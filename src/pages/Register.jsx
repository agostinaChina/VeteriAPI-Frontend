
import {useState} from "react";
import {registrarUsuario} from '../service/api.js';
import {useNavigate} from 'react-router-dom';

function Register(){
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: '', 
        email: '', 
        password: '',
        confirmPassword: ''
    });

    async function handleSubmitRegister(event){
        event.preventDefault();

        if(user.password !== user.confirmPassword){
            setError('Las contraseñas no coniciden');
            return;
        }

        console.log(user);

        try {
            const result = await registrarUsuario(user.name, user.email, user.password);
            setMensaje(`Usuario Registrado correctamnte`);
            setUser({ name: '', email: '', password: '', confirmPassword: ''});

            navigate('/login');
        } catch (error) {
            setError(error.message);
        }
    }

    function handleChange(event) {
        const {name, value} = event.target;
        setUser({...user, [name]: value});
    }

    return(
        <section className="auth-page">
            <div className="auth-card">
                <h1>Crear una cuenta</h1>
                <p className="auth-description">
                    Registrate para acceder a VeteriAPI.
                </p>

                <form onSubmit={handleSubmitRegister} className="auth-form">
                    <label htmlFor="name">Nombre</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                    />

                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                    />

                    <label htmlFor="confirmPassword">Repetir contraseña</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={user.confirmPassword}
                        onChange={handleChange}
                    />

                    <button type="submit" className="auth-button">
                        Registrarme
                    </button>
                </form>

                <p className="auth-error">{mensaje}</p>
                <p className="auth-error">{error}</p>
            </div>
        </section>
    )
}

export default Register;
