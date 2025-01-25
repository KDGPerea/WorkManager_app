import React, { useState } from "react";

const InvitacionForm = ({ proyectoId, onEnviarInvitacion }) => {
    const [email, setEmail] = useState('');
    const [rol, setRol] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onEnviarInvitacion(email, rol, proyectoId);
    };

    return (
        <>
            <section id="invitacionform">
                <div className="container">
                    <div className="invitacionform">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email">Email:</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                            <label htmlFor="rol">Rol:</label>
                            <select name="rol" id="rol" value={rol} onChange={(e) => setRol(e.target.value)}>
                                <option value="administrador">Administrador</option>
                                <option value="editor">Editor</option>
                                <option value="visor">Visor</option>
                            </select>

                            <button type="submit">Enviar Invitación</button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default InvitacionForm;