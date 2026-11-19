
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Login(){
    const [ error, setError] = useState('');
    const [ mensaje, setMensaje ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ cargando, setCargando ] = useState(false);

    const {login} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const destino = location.state?.from?.pathname || '/perfil';

    async function handleSubmitLogin(event){
        event.preventDefault();
        setCargando(true);
        setMensaje('');

        try {
            await login(email, password);
            navigate(destino, { replace: true});

        } catch (error) {
            console.error({ error});
            setMensaje(error.message);
            console.error(error.message);
        } finally {
            setCargando(false);
        }
    }

    return(
        <section className="auth-page">
            <div className="auth-card">
                <h1>¡Bienvenido!</h1>
                <p className="auth-description">
                    Ingresá a tu cuenta de VeteriAPI.
                </p>

                <form onSubmit={handleSubmitLogin} className="auth-form">
                    <label htmlFor='email'>Email</label>
                    <input 
                        type="email" 
                        id='email' 
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <label htmlFor="password">Contraseña</label>
                    <input 
                        type="password" 
                        id='password'
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />

                    <button 
                        disabled={cargando}
                        type='submit'
                        className="auth-button"
                    >
                        {cargando ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>

                <p className="auth-error">{mensaje}</p>
                <p className="auth-error">{error}</p>
            </div>
        </section>
    )
}

export default Login;
