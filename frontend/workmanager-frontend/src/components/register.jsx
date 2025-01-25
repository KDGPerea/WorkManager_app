import React, { useState } from "react";
import axios from 'axios';
import Header from "./header";
import { Link } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/register', {name, email, password});
            alert('Usuario registrado');
        } catch (error) {
            console.error(error);
            alert('Registro fallido');
        }
    };

    return (
        <>
            <Header/>
            <section id="registro">
                <div className="container">
                    <h2>Regístrese</h2>
                    <div className="registro">
                        <form onSubmit={handleSubmit} id="registroform">
                            <label htmlFor="name">Nombre:</label>
                            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />

                            <label htmlFor="email">Correo Electrónico:</label>
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                            <label htmlFor="password">Contraseña:</label>
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <button type="submit">Registrar</button>
                            <p>¿Ya tienes cuenta? <Link to="/login">Iniciar Sesión</Link></p>
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

export default Register;