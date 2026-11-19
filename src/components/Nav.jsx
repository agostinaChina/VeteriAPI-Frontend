
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Nav(){

    const { user, autenticado, logout } = useAuth();
    const navigate = useNavigate();

    function cerrarSesion(){
        logout();
        navigate('/login');
    }

    return (
      <nav>
        {
            autenticado ? (
            <>
                <NavLink to='/'>Inicio</NavLink> |
                <NavLink to='/perfil'>Mi Perfil</NavLink>

                {
                    user?.role === 'admin' && (
                       <> | <NavLink to='/admin'>Admin</NavLink> </>
                    )
                }

                {
                    user?.role === 'user' && (
                       <> | <NavLink to='/usuario'>Mi espacio</NavLink> </>
                    )
                }

                <br />
                <button onClick={cerrarSesion}>Cerrar Sesión</button>
                <p>Hola! {user.name}</p>
            </>
            ) : (
            <>
                <NavLink to='/login'>Iniciar Sesión</NavLink> |
                <NavLink to='/register'>Crear una cuenta</NavLink>
            </>
            )
        }

      </nav>
    )
}

export default Nav;
