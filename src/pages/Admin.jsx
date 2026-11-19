
import { useState, useEffect } from "react";
import { fetchPrivado } from "../service/api";

function Admin(){

    const [appointments, setAppointments] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [mascotas, setMascotas] = useState([]);
    const [veterinarios, setVeterinarios] = useState([]);

    const [errorMascota, setErrorMascota] = useState('');
    const [mensajeMascota, setMensajeMascota] = useState('');
    const [errorTurno, setErrorTurno] = useState('');
    const [mensajeTurno, setMensajeTurno] = useState('');
    const [errorVeterinario, setErrorVeterinario] = useState('');
    const [mensajeVeterinario, setMensajeVeterinario] = useState('');

    const [errorGestionTurnos, setErrorGestionTurnos] = useState('');
    const [mensajeGestionTurnos, setMensajeGestionTurnos] = useState('');

    const [turnoEditando, setTurnoEditando] = useState(null);

    const [mascota, setMascota] = useState({
        name: '',
        type: '',
        breed: '',
        age: '',
        owner: ''
    });

    const [turno, setTurno] = useState({
        pet: '',
        veterinarian: '',
        date: '',
        time: '',
        reason: ''
    });

    const [veterinario, setVeterinario] = useState({
        name: '',
        specialty: '',
        license: '',
        active: true
    });

    const endPoint = '/api/appointments';

    async function getAppointments() {
        const res = await fetchPrivado(endPoint);
        setAppointments(res.data);
    }

    useEffect(() => {
        async function getDatos() {
            try {
                await getAppointments();

                const resUsuarios = await fetchPrivado('/api/users');
                setUsuarios(resUsuarios.data.filter(usuario => usuario.role === 'user'));

                const resMascotas = await fetchPrivado('/api/pets');
                setMascotas(resMascotas.data);

                const resVeterinarios = await fetchPrivado('/api/veterinarians');
                setVeterinarios(resVeterinarios.data);

            } catch (error) {
                console.error(error);
            }
        }

        getDatos();
    }, []);

    function handleChange(e) {
        setMascota({
            ...mascota,
            [e.target.name]: e.target.value
        });
        setErrorMascota('');
        setMensajeMascota('');
    }

    function handleTurnoChange(e) {
        setTurno({
            ...turno,
            [e.target.name]: e.target.value
        });
        setErrorTurno('');
        setMensajeTurno('');
    }

    function handleVeterinarioChange(e) {
        const { name, value } = e.target;

        setVeterinario({
            ...veterinario,
            [name]: name === 'active' ? value === 'true' : value
        });

        setErrorVeterinario('');
        setMensajeVeterinario('');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErrorMascota('');
        setMensajeMascota('');

        try {
            await fetchPrivado('/api/pets', {
                method: 'POST',
                body: JSON.stringify({
                    ...mascota,
                    age: Number(mascota.age)
                })
            });

            setMascota({
                name: '',
                type: '',
                breed: '',
                age: '',
                owner: ''
            });

            const res = await fetchPrivado('/api/pets');
            setMascotas(res.data);
            setMensajeMascota('Mascota registrada correctamente.');

        } catch (error) {
            setErrorMascota(error.message);
            console.error(error);
        }
    }

    async function handleVeterinarioSubmit(e) {
        e.preventDefault();
        setErrorVeterinario('');
        setMensajeVeterinario('');

        try {
            await fetchPrivado('/api/veterinarians', {
                method: 'POST',
                body: JSON.stringify(veterinario)
            });

            setVeterinario({
                name: '',
                specialty: '',
                license: '',
                active: true
            });

            const res = await fetchPrivado('/api/veterinarians');
            setVeterinarios(res.data);

            setMensajeVeterinario('Veterinario registrado correctamente.');

        } catch (error) {
            setErrorVeterinario(error.message);
            console.error(error);
        }
    }

    async function handleTurnoSubmit(e) {
        e.preventDefault();
        setErrorTurno('');
        setMensajeTurno('');

        try {
            await fetchPrivado('/api/appointments', {
                method: 'POST',
                body: JSON.stringify(turno)
            });

            setTurno({
                pet: '',
                veterinarian: '',
                date: '',
                time: '',
                reason: ''
            });

            await getAppointments();
            setMensajeTurno('Turno registrado correctamente.');

        } catch (error) {
            setErrorTurno(error.message);
            console.error(error);
        }
    }

    function handleEditarTurno(appointment) {
        setErrorGestionTurnos('');
        setMensajeGestionTurnos('');

        setTurnoEditando({
            _id: appointment._id,
            pet: appointment.pet?._id || '',
            veterinarian: appointment.veterinarian?._id || '',
            date: appointment.date ? String(appointment.date).slice(0, 10) : '',
            time: appointment.time || '',
            reason: appointment.reason || '',
            active: appointment.active ?? true
        });
    }

    function handleCambioEdicion(e) {
        setTurnoEditando({
            ...turnoEditando,
            [e.target.name]: e.target.value
        });

        setErrorGestionTurnos('');
        setMensajeGestionTurnos('');
    }

    async function handleGuardarEdicion(e) {
        e.preventDefault();
        setErrorGestionTurnos('');
        setMensajeGestionTurnos('');

        try {
            await fetchPrivado(`${endPoint}/${turnoEditando._id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    pet: turnoEditando.pet,
                    veterinarian: turnoEditando.veterinarian,
                    date: turnoEditando.date,
                    time: turnoEditando.time,
                    reason: turnoEditando.reason,
                    active: turnoEditando.active
                })
            });

            await getAppointments();
            setTurnoEditando(null);
            setMensajeGestionTurnos('Turno actualizado correctamente.');

        } catch (error) {
            setErrorGestionTurnos(error.message);
            console.error(error);
        }
    }

    async function handleEliminarTurno(id) {
        const confirmar = window.confirm(
            '¿Estás seguro de que querés eliminar este turno?'
        );

        if (!confirmar) return;

        setErrorGestionTurnos('');
        setMensajeGestionTurnos('');

        try {
            await fetchPrivado(`${endPoint}/${id}`, {
                method: 'DELETE'
            });

            await getAppointments();

            if (turnoEditando?._id === id) {
                setTurnoEditando(null);
            }

            setMensajeGestionTurnos('Turno eliminado correctamente.');

        } catch (error) {
            setErrorGestionTurnos(error.message);
            console.error(error);
        }
    }

    return (
        <section className="admin-page">
            <div className="admin-heading">
                <h1>Panel del Administrador</h1>
                <p>Gestioná y consultá los turnos de la veterinaria.</p>
            </div>

            <h2>Registrar mascota</h2>

            <form onSubmit={handleSubmit}>
                <label>Nombre</label>
                <input
                    type="text"
                    name="name"
                    value={mascota.name}
                    onChange={handleChange}
                    required
                />

                <label>Tipo</label>
                <select
                    name="type"
                    value={mascota.type}
                    onChange={handleChange}
                    required
                >
                    <option value="">Seleccioná un tipo</option>
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
                    <option value="ave">Ave</option>
                    <option value="otro">Otro</option>
                </select>

                <label>Raza</label>
                <input
                    type="text"
                    name="breed"
                    value={mascota.breed}
                    onChange={handleChange}
                    required
                />

                <label>Edad</label>
                <input
                    type="number"
                    name="age"
                    value={mascota.age}
                    onChange={handleChange}
                    min="0"
                    max="50"
                    required
                />

                <label>Dueño</label>
                <select
                    name="owner"
                    value={mascota.owner}
                    onChange={handleChange}
                    required
                >
                    <option value="">Seleccioná un usuario</option>
                    {
                        usuarios.map(usuario => (
                            <option key={usuario._id} value={usuario._id}>
                                {usuario.name} - {usuario.email}
                            </option>
                        ))
                    }
                </select>

                <button type="submit">Registrar mascota</button>

                {errorMascota && <p className="error-message">{errorMascota}</p>}
                {mensajeMascota && <p>{mensajeMascota}</p>}
            </form>

            <h2>Registrar veterinario</h2>

            <form onSubmit={handleVeterinarioSubmit}>
                <label>Nombre</label>
                <input
                    type="text"
                    name="name"
                    value={veterinario.name}
                    onChange={handleVeterinarioChange}
                    required
                />

                <label>Especialidad</label>
                <input
                    type="text"
                    name="specialty"
                    value={veterinario.specialty}
                    onChange={handleVeterinarioChange}
                    required
                />

                <label>Matrícula</label>
                <input
                    type="text"
                    name="license"
                    value={veterinario.license}
                    onChange={handleVeterinarioChange}
                    maxLength={10}
                    required
                />

                <label>Estado</label>
                <select
                    name="active"
                    value={String(veterinario.active)}
                    onChange={handleVeterinarioChange}
                    required
                >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                </select>

                <button type="submit">Registrar veterinario</button>

                {errorVeterinario && <p className="error-message">{errorVeterinario}</p>}
                {mensajeVeterinario && <p>{mensajeVeterinario}</p>}
            </form>

            <h2>Veterinarios registrados</h2>

            <div className="veterinarians-container">
                {
                    veterinarios.map(veterinario => (
                        <article className="veterinarian-card" key={veterinario._id}>
                            <h3>{veterinario.name}</h3>
                            <p>
                                <strong>Especialidad:</strong> {veterinario.specialty}
                            </p>
                            <p>
                                <strong>Matrícula:</strong> {veterinario.license}
                            </p>
                            <p>
                                <strong>Estado:</strong> {veterinario.active ? 'Activo' : 'Inactivo'}
                            </p>
                        </article>
                    ))
                }
            </div>

            <h2>Registrar turno</h2>

            <form onSubmit={handleTurnoSubmit}>
                <label>Mascota</label>
                <select
                    name="pet"
                    value={turno.pet}
                    onChange={handleTurnoChange}
                    required
                >
                    <option value="">Seleccioná una mascota</option>
                    {
                        mascotas.map(mascota => (
                            <option key={mascota._id} value={mascota._id}>
                                {mascota.name}
                            </option>
                        ))
                    }
                </select>

                <label>Veterinario</label>
                <select
                    name="veterinarian"
                    value={turno.veterinarian}
                    onChange={handleTurnoChange}
                    required
                >
                    <option value="">Seleccioná un veterinario</option>
                    {
                        veterinarios
                            .filter(veterinario => veterinario.active)
                            .map(veterinario => (
                                <option key={veterinario._id} value={veterinario._id}>
                                    {veterinario.name} - {veterinario.specialty}
                                </option>
                            ))
                    }
                </select>

                <label>Fecha</label>
                <input
                    type="date"
                    name="date"
                    value={turno.date}
                    onChange={handleTurnoChange}
                    required
                />

                <label>Hora</label>
                <input
                    type="time"
                    name="time"
                    value={turno.time}
                    onChange={handleTurnoChange}
                    required
                />

                <label>Motivo</label>
                <input
                    type="text"
                    name="reason"
                    value={turno.reason}
                    onChange={handleTurnoChange}
                    required
                />

                <button type="submit">Registrar turno</button>

                {errorTurno && <p className="error-message">{errorTurno}</p>}
                {mensajeTurno && <p>{mensajeTurno}</p>}
            </form>

            <h2>Turnos</h2>

            {errorGestionTurnos && (
                <p className="error-message">{errorGestionTurnos}</p>
            )}

            {mensajeGestionTurnos && (
                <p>{mensajeGestionTurnos}</p>
            )}

            <div className="appointments-container">
                {
                    appointments.map(appointment => (
                        <article className="appointment-card" key={appointment._id}>

                            {turnoEditando?._id === appointment._id ? (
                                <form onSubmit={handleGuardarEdicion}>
                                    <h3>Editar turno</h3>

                                    <label>Mascota</label>
                                    <select
                                        name="pet"
                                        value={turnoEditando.pet}
                                        onChange={handleCambioEdicion}
                                        required
                                    >
                                        <option value="">Seleccioná una mascota</option>
                                        {
                                            mascotas.map(mascota => (
                                                <option key={mascota._id} value={mascota._id}>
                                                    {mascota.name}
                                                </option>
                                            ))
                                        }
                                    </select>

                                    <label>Veterinario</label>
                                    <select
                                        name="veterinarian"
                                        value={turnoEditando.veterinarian}
                                        onChange={handleCambioEdicion}
                                        required
                                    >
                                        <option value="">Seleccioná un veterinario</option>
                                        {
                                            veterinarios.map(veterinario => (
                                                <option key={veterinario._id} value={veterinario._id}>
                                                    {veterinario.name} - {veterinario.specialty}
                                                    {!veterinario.active ? ' (Inactivo)' : ''}
                                                </option>
                                            ))
                                        }
                                    </select>

                                    <label>Fecha</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={turnoEditando.date}
                                        onChange={handleCambioEdicion}
                                        required
                                    />

                                    <label>Hora</label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={turnoEditando.time}
                                        onChange={handleCambioEdicion}
                                        required
                                    />

                                    <label>Motivo</label>
                                    <input
                                        type="text"
                                        name="reason"
                                        value={turnoEditando.reason}
                                        onChange={handleCambioEdicion}
                                        required
                                    />

                                    <button type="submit">Guardar cambios</button>

                                    <button
                                        type="button"
                                        onClick={() => setTurnoEditando(null)}
                                    >
                                        Cancelar
                                    </button>
                                </form>
                            ) : (
                                <>
                                    <h3>{appointment.pet?.name}</h3>

                                    <p>
                                        <strong>Veterinario:</strong> {appointment.veterinarian?.name}
                                    </p>

                                    <p className="appointment-date">
                                        {new Date(appointment.date).toLocaleDateString()}
                                    </p>

                                    <p className="appointment-time">
                                        {appointment.time}
                                    </p>

                                    <p>
                                        <strong>Motivo:</strong> {appointment.reason}
                                    </p>

                                    <div className="appointment-actions">
                                        <button
                                            type="button"
                                            onClick={() => handleEditarTurno(appointment)}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleEliminarTurno(appointment._id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </>
                            )}

                        </article>
                    ))
                }
            </div>
        </section>
    )
}

export default Admin;
