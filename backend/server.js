const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const nodemailer = require('nodemailer')
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

mongoose.connect('mongodb://localhost/workmanager');

app.use(express.json());
app.use(cors());

// Esquema de usuario
const UserSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true },
    password: String,
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
});

const User = mongoose.model('User', UserSchema);

// Esquema de Proyectos
const ProjectSchema = new mongoose.Schema({
    name: String,
    description: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref : 'User'},
    members: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            role: { type: String }
        }
    ]
}, {
    timestamps: true
});

ProjectSchema.pre('save', function (next) {
    if (!this.members) {
        this.members = [];
    }
    next();
});

const Project = mongoose.model('Project', ProjectSchema);

// Esquema de Tareas
const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    dueDate: Date,
    priority: String,
    status: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project'}
});

const Task = mongoose.model('Task', TaskSchema);

// Esquema de Invitación
const InvitacionSchema = new mongoose.Schema({
    email: String,
    rol: String,
    proyecto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    expira: Date,
});

const Invitacion = mongoose.model('Invitacion', InvitacionSchema);

//Registro de Usuarios
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.send('Usuario registrado');
})

// Inicio de Sesión
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send('Usuario no encontrado');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).send('Usuario o contraseña incorrectas');
    }
    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
    res.json({ token,
        user: {
            nombre: user.name,
            email: user.email
        }
    }); 
});

// Configuracion de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Middleware de Autenticación
const auth = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).send('Acceso denegado');
    }
    try {
        const decoded = jwt.verify(token, 'secret');
        req.user = decoded;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user.email = user.email; 

        next();
    } catch (ex) {
        res.status(400).send('Token inválido');
    }
};

// Operaciones CRUD de Proyectos
app.post('/projects', auth, async (req, res) => {
    const { name, description} = req.body;
    const project = new Project({
        name,
        description,
        user: req.user.id,
    });
    await project.save();
    res.json(project);
});

app.get('/projects', auth, async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user.id });
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error al obtener los proyectos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.delete('/projects/:projectId', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).send('Proyecto no encontrado');
        }

        if (project.user.toString() !== req.user.id && !project.members.some(member => member.user.toString() === req.user.id && member.role === 'admin')) {
            return res.status(403).send('No tienes permiso para eliminar este proyecto');
        }

        await Project.findByIdAndDelete(req.params.projectId);

        await User.updateMany(
            { projects: req.params.projectId },
            { $pull: { projects: req.params.projectId } }
        );

        res.send('Proyecto eliminado');
    } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).send('Proyecto no encontrado');
        }

        if (project.user.toString() !== req.user.id && !project.members.some(member => member.user.toString() === req.user.id && member.role === 'admin')) {
            return res.status(403).send('No tienes permiso para actualizar este proyecto');
        }
        if (req.body.name !== undefined) {
            project.name = req.body.name;
        }
        if (req.body.description !== undefined) {
            project.description = req.body.description;
        }

        await project.save();

        res.json(project);
    } catch (error) {
        console.error('Error al actualizar el proyecto:', error);
        res.status(500).send('Error interno del servidor');
    }
};

app.put('/projects/:projectId', auth, updateProject);

// Agregar usuarios al proyecto
const agregarUsuarioAProyecto = async (email, proyecto_id, rol) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const project = await Project.findById(proyecto_id);
        if (!project) {
            throw new Error('Proyecto no encontrado');
        }

        if (!Array.isArray(project.members)) {
            project.members = [];
        }

        const isMember = project.members.some(member => member.user.toString() === user._id.toString());
        if (isMember) {
            console.log('El usuario ya es miembro del proyecto');
            return;
        }

        project.members.push({ user: user._id, role: rol });

        if (!Array.isArray(user.projects)) {
            user.projects = [];
        }
        user.projects.push(proyecto_id);
        
        await user.save();
        await project.save();
    } catch (error) {
        console.error('Error en agregarUsuarioAProyecto:', error);
        throw new Error('Error al agregar usuario al proyecto: ' + error.message);
    }
};

// Invitaciones
app.post('/invitaciones', auth, async (req, res) => {
    const { email, rol, proyecto_id } = req.body;

    if (!email || !rol || !proyecto_id) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    try {
        const token = jwt.sign({ email, proyecto_id, rol }, process.env.SECRET_KEY, { expiresIn: '7d' });

        const invitacion = {
            email,
            rol,
            proyecto_id,
            token,
            enviadoPor: req.user.id,
            estado: 'pendiente'
        };

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Invitación a unirte a un proyecto',
            text: `Hola, has sido invitado a unirte al proyecto con ID ${proyecto_id} como ${rol}. Haz clic en el siguiente enlace para unirte: ${process.env.FRONTEND_URL}/login-invitation/${token}`
        };        

        await transporter.sendMail(mailOptions);
        await new Invitacion(invitacion).save();

        res.status(200).send('Invitación enviada correctamente');
    } catch (error) {
        console.error('Error al enviar la invitación:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/unirse/:token', auth, async (req, res) => {
    const { token } = req.params;

    try {
        console.log('Token recibido:', token);
        const decoded = jwt.verify(token, secretKey);
        const { proyecto_id, rol } = decoded;

        console.log('Decodificado:', decoded);

        const email = req.user.email;

        await agregarUsuarioAProyecto(email, proyecto_id, rol);

        res.status(200).json({ message: `Usuario ${email} se ha unido al proyecto ${proyecto_id} como ${rol}`, project_id: proyecto_id });
    } catch (error) {
        console.error('Error al unirse al proyecto:', error);
        res.status(400).json({ error: 'Token inválido o expirado' });
    }
});

// Operaciones CRUD de Tareas
app.get('/tasks/filter', auth, async (req, res) => {
    const { project, priority, status } = req.query;
    const query = { user: req.user.id, project };

    if (priority) query.priority = priority;
    if (status) query.status = status;

    try {
        const tasks = await Task.find(query);
        res.json(tasks);
    } catch (error) {
        res.status(500).send('Error al filtrar las tareas');
    }
});

app.post('/tasks', auth, async (req, res) => {
    const { title, description, dueDate, priority, project } = req.body;

    try {
        const task = new Task({
            title,
            description,
            dueDate,
            priority,
            project,
            user: req.user.id,
        });
        await task.save();
        res.send(task);
    } catch (error) {
        res.status(400).send('Error al crear la tarea');
    }
});


app.get('/tasks', auth, async (req, res) => {
    const { project } = req.query;
    const tasks = await Task.find({ user: req.user.id, project });
    res.send(tasks);
});

app.get('/tasks/:id', auth, async (req, res) => {
    const tasks = await Task.findById(req.params.id);
    res.send(tasks);
});

app.put('/tasks/:id', auth, async (req, res) => {
    const { title, description, dueDate, priority, project } = req.body;

    if (!project) {
        return res.status(400).send('El campo project es obligatorio');
    }

    const task = await Task.findByIdAndUpdate(req.params.id, { title, description, dueDate, priority, project }, { new: true });
    res.send(task);
});

app.delete('/tasks/:id', auth, async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.send('Tarea eliminada');
});

app.patch('/tasks/:id/status', auth, async (req, res) => {
    const task = await Task.findById(req.params.id);
    task.status = req.body.status;
    await task.save();
    res.send(task);
});

app.listen(3000, () => {
    console.log('Server corriendo en el puerto 3000')
});