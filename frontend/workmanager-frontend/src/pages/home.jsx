import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import '../assets/css/App.css';
import Header from '../components/header'

const Home = () => {
    const [user, setUser] = useState(null);

    useEffect(()=>{
      const userData = localStorage.getItem('user');
      if (userData){
        setUser(JSON.parse(userData));
      }
    }, []);
  
    return (
      <>
        <Header/>
        <section id="hero">
          <h1>Bienvenidos a ColaboraNet</h1>
        </section>
  
        <section id="somosColabora">
          <div className="container">
            <h2>Somos <span className="color-acento">ColaboraNet</span></h2>
            <p>
              Colabora Web es una plataforma digital innovadora dedicada a optimizar la administración de tareas colaborativas. Nuestra prioridad es facilitar el trabajo en equipo mediante herramientas intuitivas y eficaces que permiten una organización eficiente y una mayor productividad. Nos especializamos en ofrecer soluciones que se adaptan a las necesidades específicas de cada equipo, promoviendo un ambiente de colaboración y cohesión.
            </p>
            <h2><span className="color-acento">Misión</span></h2>
            <p>Nuestra misión es transformar la forma en que los equipos trabajan juntos. Nos comprometemos a proporcionar herramientas potentes y fáciles de usar que permitan a los equipos coordinarse de manera eficaz, asignar responsabilidades de forma transparente y cumplir sus objetivos de manera conjunta. Creemos que la colaboración efectiva es la clave para el éxito y nos dedicamos a facilitar esta colaboración en todas las organizaciones.</p>
            <h2><span className="color-acento">Visión</span></h2>
            <p>Aspiramos a convertirnos en la plataforma líder mundial en gestión de tareas colaborativas. Nuestra visión es ser reconocidos por nuestra capacidad de transformar la forma en que los equipos colaboran y ejecutan proyectos, fomentando la innovación, la eficiencia y el éxito. Nos esforzamos por ser la herramienta de referencia para organizaciones de todo el mundo, ayudando a los equipos a alcanzar su máximo potencial y a superar sus metas de manera colaborativa.</p>
          </div>
        </section>
  
        <section id="demostracion">
          <div className="container">
            <h2>Beneficios</h2>
            <div className="cart-container">
              <div className="carta">
                  <RouterLink to="/tasks" className='router_link'>
                      <h3>Mejora de la Comunicación:</h3>
                      <p>
                          Una plataforma colaborativa permite a todos los 
                          miembros del equipo estar en sintonía, compartiendo actualizaciones y comentarios 
                          en tiempo real. Esto reduce malentendidos y asegura que todos estén al tanto de los 
                          progresos y necesidades del proyecto.
                      </p>
                </RouterLink>
              </div>
              <div className="carta">
                  <RouterLink to="/tasks" className='router_link'>
                      <h3>Aumento de la Productividad:</h3>
                      <p>
                          Al centralizar las tareas y responsabilidades, todos 
                          pueden ver claramente qué se necesita hacer y quién está a cargo de cada tarea. Esto 
                          no solo ayuda a priorizar y organizar el trabajo, sino que también evita la duplicación 
                          de esfuerzos y mejora la eficiencia general del equipo.
                      </p>
                  </RouterLink>
              </div>
              <div className="carta">
                  <RouterLink to="/tasks" className='router_link'>
                      <h3>Transparencia y Responsabilidad:</h3>
                      <p>
                          Al utilizar una página de gestión de tareas, es fácil 
                          rastrear el progreso y verificar que las tareas se estén completando según lo 
                          planificado. Esto fomenta un sentido de responsabilidad entre los miembros del 
                          equipo y proporciona una clara visibilidad del estado del proyecto a todos los interesados.
                      </p>
                 </RouterLink>
              </div>
            </div>
          </div>
        </section>
  
        <section id="final">
          <h2>¿Listo para colaborar?</h2>
        </section>
  
        <footer>
          <div className="container">
            <p>&copy; ColaboraNet 2025</p>
          </div>
        </footer>
      </>
    );
  }
  
export default Home;  