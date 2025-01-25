import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../assets/css/tasklist.css'
import Header_tasklist from "./header-tasklist";

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [priority, setPriority] = useState('');
    const [status, setStatus] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { projectId } = useParams();

    useEffect(() => {
        document.body.classList.add('tasklist-page');

        return () => {
            document.body.classList.remove('tasklist-page');
        };
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/tasks?project=${projectId}`, {
                    headers: { 'x-auth-token': token }
                });
                setTasks(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTasks();
    }, [token, projectId]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/tasks/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setTasks(tasks.filter((task) => task._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleStatusChange = async (id, status) =>{
        try {
            const response = await axios.patch(`http://localhost:3000/tasks/${id}/status`, { status }, {
                headers: { 'x-auth-token': token }
            });
            const updatedTask = response.data;
            setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
        } catch (error){
            console.error(error);
        }
    };

    const handleFilter = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/tasks/filter?project=${projectId}&priority=${priority}&status=${status}`, {
                headers: { 'x-auth-token': token }
            });
            setTasks(response.data);
        } catch (error) {
            console.error(error);
            alert('Error al filtrar las tareas');
        }
    };

    return (
        <>
            <Header_tasklist/>
            <section id="tasklist">
                <div className="container">
                    <h2>Lista de Tareas</h2>
                    <div className="filters">
                        <label htmlFor="filter-priority">Filtrar por prioridad:</label>
                        <select name="" id="filter-priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="">Todas</option>
                            <option value="Baja">Baja</option>
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                        </select>
                        <label htmlFor="filter-status">Filtrar por Estado:</label>
                        <select name="" id="filter-status" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Progreso">En Progreso</option>
                            <option value="Completa">Completa</option>
                        </select>
                        <button onClick={handleFilter}>Filtrar</button>
                    </div>
                    <button className="add-task-button" onClick={() => navigate(`/tasks/new?project=${projectId}`)}>Añadir nueva tarea</button>
                    <ul className="tasks-list">
                        {tasks.map((task) => (
                            <li key={task._id} className="task-item"> 
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <p>Fecha de Vencimiento: {task.dueDate}</p>
                                <p>Prioridad: {task.priority}</p>
                                <label htmlFor="status">Estado:</label>
                                <select name="" id="status" value={task.status} onChange={(e) => handleStatusChange(task._id, e.target.value)}>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En Progreso">En Progreso</option>
                                    <option value="Completa">Completa</option>
                                </select>
                                <button onClick={() => handleDelete(task._id)}>Eliminar</button>
                                <Link to={`/tasks/edit/${task._id}`}>Editar</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </>
    );
};

export default TaskList;