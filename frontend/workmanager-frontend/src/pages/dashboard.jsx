import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ProjectForm from "../components/projectForm";
import InvitacionForm from "../components/invitacionForm";
import UpdateProjectModal from "../components/updateProjectModal";
import Header_tasklist from "../components/header-tasklist";
import '../assets/css/dashboard.css'

const Dashboard = () => {

    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [projectToUpdate, setProjectToUpdate] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    
    useEffect(() => {
            document.body.classList.add('dashboard-page');
    
            return () => {
                document.body.classList.remove('dashboard-page');
            };
    }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:3000/projects', {
                    headers: { 'x-auth-token': token }
                });
                setProjects(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProjects();
    }, [token]);

    const crearProyecto = async (name, description) => {
        try {
            const response = await axios.post('http://localhost:3000/projects', {
                name,
                description,
            }, {
                headers: { 'x-auth-token': token }
            });
            setProjects([...projects, response.data]);
        } catch (error) {
            console.error('Error al crear el proyecto:', error);
        }
    };

    const enviarInvitacion = async (email, rol, projectId) => {
        try {
            const response = await axios.post('http://localhost:3000/invitaciones', {
                email,
                rol,
                proyecto_id: projectId
            }, {
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            });
            console.log('Invitación enviada:', response.data);
        } catch (error) {
            console.error('Error al enviar la invitación:', error);
        }
    };

    const handleSelectProject = (projectId) => {
        setSelectedProjectId(projectId);
    };

    const goToTaskList = () => {
        navigate(`/tasks/${selectedProjectId}`);
    };

    const eliminarProyecto = async (projectId) => {
        try {
            await axios.delete(`http://localhost:3000/projects/${projectId}`, {
                headers: { 'x-auth-token': token }
            });
            setProjects(projects.filter(project => project._id !== projectId));
        } catch (error) {
            console.error('Error al eliminar el proyecto:', error);
        }
    };

    const actualizarProyecto = async (projectId, name, description) => {
        try {
            const response = await axios.put(`http://localhost:3000/projects/${projectId}`, {
                name,
                description,
            }, {
                headers: { 'x-auth-token': token }
            });

            // Verificar que el proyecto actualizado esté presente en la respuesta
            const updatedProject = response.data;

            setProjects(projects.map(project => project._id === projectId ? updatedProject : project));
            setProjectToUpdate(null); // Cerrar el modal
        } catch (error) {
            console.error('Error al actualizar el proyecto:', error);
        }
    };
    
    return (
        <>
            <Header_tasklist/>
            <section className="dashboard">
                <div className="sidebar">
                    <h1>Dashboard</h1>
                    <p>Bienvenido a tu dashboard. Aquí podras administrar tus proyectos:</p>
                    <div className="form-container">
                        <h3>Crear Proyecto</h3>
                        <ProjectForm onCrearProyecto={crearProyecto} />
                    </div>
                    {selectedProjectId && (
                        <div className="form-container invitacion-form">
                            <h3>Invitar a Colaboradores</h3>
                            <InvitacionForm proyectoId={selectedProjectId} onEnviarInvitacion={enviarInvitacion} />
                        </div>
                    )}
                    </div>
                    <div className="content projects-list">
                        <h2>Proyectos</h2>
                        {projects.length === 0 ? (
                            <p>No hay proyectos disponibles</p>
                        ) : (
                            <ul>
                                {projects.map(project => (
                                    <li key={project._id}>
                                        <h3>{project.name}</h3>
                                        <p>{project.description}</p>
                                        <div className="project-buttons">
                                            <button onClick={() => handleSelectProject(project._id)}>Seleccionar Proyecto</button>
                                            <button onClick={() => goToTaskList(project._id)}>Ir a la lista de tareas</button>
                                            <button onClick={() => eliminarProyecto(project._id)}>Eliminar Proyecto</button>
                                            <button onClick={() => setProjectToUpdate(project)}>Actualizar Proyecto</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
            </section>
            {projectToUpdate && (
                <UpdateProjectModal
                project={projectToUpdate}
                onUpdate={actualizarProyecto}
                onClose={() => setProjectToUpdate(null)}
                />
            )}
        </>
    );
};

export default Dashboard;