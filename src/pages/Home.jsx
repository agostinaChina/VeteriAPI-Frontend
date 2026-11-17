
import { useState, useEffect } from 'react'
import { obtenerMascotas } from '../service/api.js'


function Home(){
    const [ error, setError] = useState('');
    const [ mascotas, setMascotas ] = useState( [] );

    useEffect( () => {
        async function getMascotas(){
            try {
                const result = await obtenerMascotas();
                setMascotas( result.data);
            } catch (error) {
                console.log(error);
                setError('No pudimos obtener las mascotas :(')
            } finally {

            }

        }
        getMascotas();

    }, [])

    return(
        <>
            <h1>Page home</h1>
            <h4>Lista de mascotas</h4>

            <p>{ error}</p>
            <ul>
                {
                    mascotas.map( mascota => 
                                <li key={ mascota._id}> { mascota.name } </li>
                                )
                }
            </ul>
        </>
    )
}

export default Home;
