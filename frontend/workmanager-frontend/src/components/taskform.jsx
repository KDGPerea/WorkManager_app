import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header_tasklist from "./header-tasklist";
import "../assets/css/taskform.css"

const TaskForm = ({ task = {} }) => {
    const [title, setTitle] = useState(task.title || '');
    const [description, setDescription] = useState(task.description || '');
    const [dueDate, setDueDate] = useState(task.dueDate || '');
    const [priority, setPriority] = useState(task.priority || '');
    const [projectId, setProjectId] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const projectIdFromUrl = queryParams.get('project');
        setProjectId(projectIdFromUrl);
    }, [location]);

    useEffect(() => {
        if (id) {
            const fetchTasks = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/tasks/${id}`, {
                        headers: { 'x-auth-token': token }
                    });
                    const { title, description, dueDate, priority, project } = response.data;
                    setTitle(title);
                    setDescription(description);
                    setDueDate(dueDate ? dueDate.slice(0, 10) : '');
                    setPriority(priority); 
                    setProjectId(project)

                } catch (error) {
                    console.error(error);
                }
            };
            fetchTasks();
        }
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title') setTitle(value);
        if (name === 'description') setDescription(value);
        if (name === 'dueDate') setDueDate(value);
        if (name === 'priority') setPriority(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (id) {
                await axios.put(`http://localhost:3000/tasks/${id}`, { title, description, dueDate, priority, project: projectId }, {
                    headers: { 'x-auth-token': token }
                });
            } else {
                await axios.post('http://localhost:3000/tasks', { title, description, dueDate, priority, project: projectId }, {
                    headers: { 'x-auth-token': token }
                });
            }
            navigate(`/tasks/${projectId}`);
        } catch (error) {
            console.error(error);
            alert('Error al guardar la tarea');
        }
    };

    return (
        <>
        <Header_tasklist/>
        <section id="taskform">
            <div className="container">
                <h2>{id ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
                <div className="taskform">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="title">Titulo:</label>
                        <input type="text" id="title" name="title" placeholder="Title" value={title} onChange={handleChange} required />

                        <label htmlFor="description">Descripción:</label>
                        <textarea name="description" id="description" placeholder="Description" value={description} onChange={handleChange} required />

                        <label htmlFor="date">Fecha de Vencimiento:</label>
                        <input type="date" name="dueDate" value={dueDate} onChange={handleChange} required/>

                        <label htmlFor="priority">Prioridad:</label>
                        <select name="priority" id="priority" value={priority} onChange={handleChange} required >
                            <option value="">Selecciona Prioridad</option>
                            <option value="Baja">Baja</option>
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                        </select>
                        <button type="submit" className="taskform-btn">Guardar Tarea</button>
                    </form>
                </div>
            </div>
        </section>
        </>
    );
};

export default TaskForm;