import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import workmanagerlogo from '../assets/img/logo_workmanager.png';
import '../assets/css/App.css';

function Header_tasklist() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    alert('¡Adiós! Esperamos verte pronto.');
    navigate('/login');
  };

  return (
    <header>
      <div className="container">
        <Link to="/dashboard" className="logo-Colabora">
          <img src={workmanagerlogo} alt="logo de la compañía" />
          <h2 className="nombre-empresa">ColaboraNet</h2>
        </Link>
        <nav>
          {user ? (
            <div className="dropdown">
              <button className="dropbtn">{user.nombre}</button>
              <div className="dropdown_content">
                <a href="#" onClick={handleLogout}>Cerrar Sesión</a>
              </div>
            </div>
          ) : (
            <Link to="/login">Inicio Sesión/Registrarse</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header_tasklist;