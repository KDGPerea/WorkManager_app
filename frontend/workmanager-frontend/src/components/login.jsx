import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import Header from "./header";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            alert('Inicio de sesión exitoso');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Inicio de sesión fallido');
        }
    };

    return (
        <>
            <Header/>
            <section id="login">
                <div className="container">
                    <h2>Iniciar Sesión</h2>
                    <div className="login">
                        <form onSubmit={handleSubmit} id="loginform">
                            <label htmlFor="email">Usuario:</label>
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                            <label htmlFor="password">Contraseña:</label>
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <button type="submit">Iniciar sesión</button>
                            <p>¿No tienes cuenta? <Link to="/register">Registrate</Link></p>
                        </form>
                    </div>
                </div>
            </section>

            <footer>
                <div className="container">
                    <p>&copy; ColaboraNet 2025</p>
                </div>
            </footer>
        </>
    );
};

export default Login;