import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const InvitationConfirmation = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('Confirmando invitación...');
    const [projectId, setProjectId] = useState(null);

    useEffect(() => {
        const confirmInvitation = async () => {
            const authToken = localStorage.getItem('token');
            try {
                console.log('Enviando solicitud con token de autenticación y token de invitación:', authToken, token);
                const response = await axios.get(`http://localhost:3000/unirse/${token}`, {
                    headers: { 'x-auth-token': authToken }
                });
                console.log('Respuesta del servidor:', response.data);

                setMessage(response.data.message);

                if (response.data.project_id) {
                    setProjectId(response.data.project_id);
                    console.log('Project ID establecido:', response.data.project_id);
                    setTimeout(() => {
                        navigate(`/tasks/${response.data.project_id}`);
                    }, 3000); // Redirige a la lista de tareas del proyecto después de 3 segundos
                } else {
                    console.log('No se encontró project_id en la respuesta');
                }
            } catch (error) {
                console.error('Error al confirmar la invitación:', error);
                setMessage('Error al confirmar la invitación');
            }
        };
        confirmInvitation();
    }, [token, navigate]);

    const handleRedirect = () => {
        console.log('Redirigiendo manualmente al proyecto con ID:', projectId);
        navigate(`/tasks/${projectId}`);
    };

    return (
        <div>
            <h1>{message}</h1>
            {projectId && (
                <button onClick={handleRedirect}>
                    Redirigir Manualmente a la Lista de Tareas
                </button>
            )}
        </div>
    );
};

export default InvitationConfirmation;