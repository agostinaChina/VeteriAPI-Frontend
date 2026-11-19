
import { useState, useEffect } from "react";
import { fetchPrivado } from "../service/api.js";

function Usuario(){

    const [ error, setError ] = useState('');
    const [ mascotas, setMascotas ] = useState([]);
    const [ veterinarios, setVeterinarios ] = useState([]);

    const [ turno, setTurno ] = useState({
        pet: '',
        veterinarian: '',
        date: '',
        time: '',
        reason: ''
    });

    useEffect(() => {
        async function getMascotas(){
            try {
                const result = await fetchPrivado('/api/pets');
                setMascotas(result.data);
            } catch (error) {
                console.log(error);
                setError('No pudimos obtener las mascotas :(');
            }
        }

        async function getVeterinarios(){
            try {
                const result = await fetchPrivado('/api/veterinarians');
                setVeterinarios(result.data);
            } catch (error) {
                console.log(error);
                setError('No pudimos obtener los veterinarios :(');
            }
        }

        getMascotas();
        getVeterinarios();
    }, []);

    function handleChange(e){
        setTurno({
            ...turno,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e){
        e.preventDefault();

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

            setError('Turno solicitado correctamente');

        } catch (error) {
            console.log(error);
            setError('No pudimos solicitar el turno');
        }
    }

    return (
        <section className="user-page">
            <div className="user-heading">
                <h1>Mi espacio</h1>
                <p>Consultá las mascotas registradas en la veterinaria.</p>
            </div>

            <h2>Mis mascotas</h2>

            <p className="error-message">{error}</p>

            <div className="user-pets-container">
                {
                    mascotas.map(mascota => (
                        <article className="user-pet-card" key={mascota._id}>
                            <h3>{mascota.name}</h3>
                        </article>
                    ))
                }
            </div>

            <h2>Solicitar un turno</h2>

            <form onSubmit={handleSubmit}>
                <label>Mascota</label>
                <select name="pet" value={turno.pet} onChange={handleChange} required>
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
                <select name="veterinarian" value={turno.veterinarian} onChange={handleChange} required>
                    <option value="">Seleccioná un veterinario</option>
                    {
                        veterinarios.map(veterinario => (
                            <option key={veterinario._id} value={veterinario._id}>
                                {veterinario.name}
                            </option>
                        ))
                    }
                </select>

                <label>Fecha</label>
                <input type="date" name="date" value={turno.date} onChange={handleChange} required />

                <label>Hora</label>
                <input type="time" name="time" value={turno.time} onChange={handleChange} required />

                <label>Motivo</label>
                <input type="text" name="reason" value={turno.reason} onChange={handleChange} required />

                <button type="submit">Solicitar turno</button>
            </form>
        </section>
    )
}

export default Usuario;
