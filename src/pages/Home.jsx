
import { useState, useEffect } from "react";
import { obtenerMascotas, fetchPrivado } from "../service/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function Home(){
    const [error, setError] = useState('');
    const [mascotas, setMascotas] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [turnos, setTurnos] = useState([]);
    const [errorTurnos, setErrorTurnos] = useState('');
    const [mascotaEditando, setMascotaEditando] = useState(null);
    const [errorGestion, setErrorGestion] = useState('');
    const [mensajeGestion, setMensajeGestion] = useState('');

    const { user } = useAuth();
    const esAdmin = user?.role === 'admin';

    async function getMascotas(){
        const result = await obtenerMascotas();
        setMascotas(result.data);
    }

    useEffect(() => {
        async function cargarDatos(){
            try {
                await getMascotas();

                if (esAdmin) {
                    const result = await fetchPrivado('/api/users');
                    setUsuarios(
                        result.data.filter(usuario => usuario.role === 'user')
                    );
                }
            } catch (error) {
                console.log(error);
                setError('No pudimos obtener las mascotas :(');
            }
        }

        cargarDatos();
    }, [esAdmin]);

    useEffect(() => {
        if (user?.role !== 'user') return;

        async function getTurnos(){
            try {
                const result = await fetchPrivado('/api/appointments');
                setTurnos(result.data);
            } catch (error) {
                console.log(error);
                setErrorTurnos('No pudimos obtener tus turnos :(');
            }
        }

        getTurnos();
    }, [user]);

    function handleEditarMascota(mascota){
        setErrorGestion('');
        setMensajeGestion('');

        setMascotaEditando({
            _id: mascota._id,
            name: mascota.name || '',
            type: mascota.type || '',
            breed: mascota.breed || '',
            age: mascota.age ?? '',
            owner: typeof mascota.owner === 'object'
                ? mascota.owner?._id || ''
                : mascota.owner || '',
            active: mascota.active ?? true
        });
    }

    function handleCambioEdicion(e){
        setMascotaEditando({
            ...mascotaEditando,
            [e.target.name]: e.target.value
        });

        setErrorGestion('');
        setMensajeGestion('');
    }

    async function handleGuardarEdicion(e){
        e.preventDefault();
        setErrorGestion('');
        setMensajeGestion('');

        try {
            await fetchPrivado(`/api/pets/${mascotaEditando._id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    ...mascotaEditando,
                    age: Number(mascotaEditando.age)
                })
            });

            await getMascotas();
            setMascotaEditando(null);
            setMensajeGestion('Mascota actualizada correctamente.');

        } catch (error) {
            console.error(error);
            setErrorGestion(error.message);
        }
    }

    async function handleEliminarMascota(id){
        const confirmar = window.confirm(
            '¿Estás seguro de que querés eliminar esta mascota?'
        );

        if (!confirmar) return;

        setErrorGestion('');
        setMensajeGestion('');

        try {
            await fetchPrivado(`/api/pets/${id}`, {
                method: 'DELETE'
            });

            await getMascotas();

            if (mascotaEditando?._id === id) {
                setMascotaEditando(null);
            }

            setMensajeGestion('Mascota eliminada correctamente.');

        } catch (error) {
            console.error(error);
            setErrorGestion(error.message);
        }
    }

    return(
        <section className="home">
            <h1>Nuestras mascotas</h1>
            <p className="home-description">
                Conocé a las mascotas registradas en nuestra veterinaria.
            </p>

            <h2>Lista de mascotas</h2>

            <p className="error-message">{error}</p>
            <p className="error-message">{errorGestion}</p>
            {mensajeGestion && <p>{mensajeGestion}</p>}

            <div className="pets-container">
                {
                    mascotas.map(mascota => (
                        <article className="pet-card" key={mascota._id}>
                            {mascotaEditando?._id === mascota._id ? (
                                <form onSubmit={handleGuardarEdicion}>
                                    <h3>Editar mascota</h3>

                                    <label>Nombre</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={mascotaEditando.name}
                                        onChange={handleCambioEdicion}
                                        required
                                    />

                                    <label>Especie</label>
                                    <input
                                        type="text"
                                        name="type"
                                        value={mascotaEditando.type}
                                        onChange={handleCambioEdicion}
                                        required
                                    />

                                    <label>Raza</label>
                                    <input
                                        type="text"
                                        name="breed"
                                        value={mascotaEditando.breed}
                                        onChange={handleCambioEdicion}
                                        required
                                    />

                                    <label>Edad</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={mascotaEditando.age}
                                        onChange={handleCambioEdicion}
                                        min="0"
                                        max="50"
                                        required
                                    />

                                    <label>Dueño</label>
                                    <select
                                        name="owner"
                                        value={mascotaEditando.owner}
                                        onChange={handleCambioEdicion}
                                        required
                                    >
                                        <option value="">Seleccioná un usuario</option>
                                        {usuarios.map(usuario => (
                                            <option key={usuario._id} value={usuario._id}>
                                                {usuario.name} - {usuario.email}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="appointment-actions">
                                        <button type="submit">Guardar cambios</button>
                                        <button
                                            type="button"
                                            onClick={() => setMascotaEditando(null)}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <h3>{mascota.name}</h3>
                                    <p><strong>Especie:</strong> {mascota.type}</p>
                                    <p><strong>Raza:</strong> {mascota.breed}</p>
                                    <p><strong>Edad:</strong> {mascota.age} años</p>

                                    {esAdmin && (
                                        <div className="appointment-actions">
                                            <button
                                                type="button"
                                                onClick={() => handleEditarMascota(mascota)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleEliminarMascota(mascota._id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </article>
                    ))
                }
            </div>

            {user?.role === 'user' && (
                <>
                    <h2>Mis turnos</h2>

                    <p className="error-message">{errorTurnos}</p>

                    <div className="appointments-container">
                        {turnos.length === 0 && !errorTurnos ? (
                            <p>Todavía no tenés turnos registrados.</p>
                        ) : (
                            turnos.map(turno => (
                                <article className="appointment-card" key={turno._id}>
                                    <h3>{turno.reason}</h3>
                                    <p>
                                        <strong>Mascota:</strong> {turno.pet?.name}
                                    </p>
                                    <p>
                                        <strong>Veterinario:</strong> {turno.veterinarian?.name}
                                    </p>
                                    <p>
                                        <strong>Fecha:</strong> {turno.date}
                                    </p>
                                    <p>
                                        <strong>Horario:</strong> {turno.time}
                                    </p>
                                </article>
                            ))
                        )}
                    </div>
                </>
            )}
        </section>
    )
}

export default Home;
