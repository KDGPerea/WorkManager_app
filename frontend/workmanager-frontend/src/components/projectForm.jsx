import React, { useState } from "react";

const ProjectForm = ({ onCrearProyecto }) =>{
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onCrearProyecto(name, description);
    };

    return (
        <>
            <section id="projectform">
                <div className="container">
                    <div className="projectform">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="name">Nombre del Projecto:</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)}  required />

                            <label htmlFor="description">Descripción:</label>
                            <textarea name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />

                            <button type="submit">Crear Proyecto</button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProjectForm;