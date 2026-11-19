
import { useAuth } from "../context/AuthContext.jsx";
import { useState, useEffect } from "react";
import { obtenerPerfil, subirFotoPerfil } from "../service/api.js";

const API_URL = import.meta.env.VITE_API_URL;

function Perfil(){

    const { user } = useAuth();
    const [ perfil, setPerfil ] = useState(null);
    const [ archivo, setArchivo ] = useState(null);
    const [ preview, setPreview] = useState(null);

    const [ cargando, setCargando ] = useState(true);
    const [ subiendo, setSubiendo ] = useState(false);
    const [ mensaje, setMensaje ] = useState(null);

    useEffect( ()=> {
        async function cargarPerfil(){
            try {
                setCargando(true);

                const response = await obtenerPerfil();
                setPerfil(response.data);

            } catch (error) {
                setMensaje( error.message)
            } finally{
                setCargando(false)
            }
        }
        cargarPerfil();
    },[])

    const imagenActual = preview || (
        perfil?.profileImage ? `${API_URL}${perfil.profileImage}` : null
    );

    function seleccionarImagen(evento){
        const file = evento.target.files[0];
        if( !file){
            return;
        }
        if( !['image/jpeg', 'image/png', 'image/webp'].includes( file.type ) ){
            setMensaje('Formato no valido');
            return;
        }
        if( file.size >2 * 1024 * 1024){
            setMensaje('La imagen no puede superar los 2MB');
            return;
        }

        setArchivo( file );
        setPreview( URL.createObjectURL( file ));

        setMensaje("");
    }

    async function guardarImagen(evento){
        evento.preventDefault();

        if( !archivo){
            setMensaje('No se selecciono un archivo');
            return;
        }
        try {
            setSubiendo(true);
            setMensaje('');
            const response = await subirFotoPerfil( archivo);

            setPerfil( response.data);

            setArchivo(null);
            setPreview(null);
            setMensaje('Imange actualizada')

        } catch (error) {
            setMensaje(error.message)
        }
    }

    if( cargando){
        return <p className="profile-loading">Cargando Perfil</p>
    }

    return(
        <section className="profile-page">
            <div className="profile-heading">
                <h1>Mi perfil</h1>
                <p>Administrá tu información personal.</p>
            </div>

            <div className="profile-card">
                <div className="profile-info">
                    <h2>Información personal</h2>

                    <ul>
                        <li>
                            <span>Nombre</span>
                            <strong>{perfil?.name}</strong>
                        </li>
                        <li>
                            <span>Email</span>
                            <strong>{perfil?.email}</strong>
                        </li>
                        <li>
                            <span>Rol</span>
                            <strong>{user?.role}</strong>
                        </li>
                    </ul>
                </div>

                <div className="profile-photo">
                    <h2>Foto de perfil</h2>

                    {
                        imagenActual ? ( 
                            <img
                                src={imagenActual}
                                alt={perfil?.name}
                                className="profile-image"
                            /> 
                        ) : (
                            <p className="no-profile-image">Sin foto de perfil</p>
                        )
                    }

                    <form className="profile-form" onSubmit={guardarImagen}>
                        <label htmlFor="profileImage">Seleccionar imagen</label>

                        <input 
                            type="file" 
                            id="profileImage"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={seleccionarImagen}
                        />

                        <button type="submit" disabled={subiendo}>
                            {subiendo ? 'Subiendo...' : 'Guardar imagen'}
                        </button>
                    </form>
                </div>
            </div>

            <p className="profile-message">{mensaje}</p>
        </section>
    )
}

export default Perfil;
