import React, { useState } from 'react';

const UpdateProjectModal = ({ project, onUpdate, onClose }) => {
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description);

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(project._id, name, description);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Actualizar Proyecto</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre del Proyecto:</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Descripción:</label>
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit">Actualizar</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProjectModal;