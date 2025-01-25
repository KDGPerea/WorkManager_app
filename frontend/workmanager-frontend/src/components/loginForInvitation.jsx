import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/css/login-invitation.css'

const LoginForInvitation = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
            document.body.classList.add('logininvitation-page');
    
            return () => {
                document.body.classList.remove('logininvitation-page');
            };
        }, []);

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', { email, password });
            localStorage.setItem('token', response.data.token);
            const { token: authToken, user } = response.data;
            localStorage.setItem('token', authToken);
            localStorage.setItem('user', JSON.stringify(user));
            navigate(`/unirse/${token}`);
        } catch (err) {
            setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <seccion id="login-invitation">
            <div className='container'>
                <h2>Iniciar Sesión para Confirmar Invitación</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="login-invitation">
                    <form onSubmit={handleLogin} className="login">
                        <div>
                            <label>Email:</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <label>Contraseña:</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit">Iniciar Sesión</button>
                    </form>
                </div>
            </div>
        </seccion>
    );
};

export default LoginForInvitation;