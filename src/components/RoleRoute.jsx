
import { useAuth } from "../context/AuthContext.jsx";
import { Navigate, Outlet } from "react-router-dom"

// rolesPermitidos = ['admin', 'user']
function RoleRoute( { rolesPermitidos } ){
    const { user, autenticado } = useAuth();

    if( !autenticado){
        return <Navigate to='/login' replace />
    }

    if(  !rolesPermitidos.includes( user?.role  )  ){
        return <Navigate to='/acceso-denegado' replace />
    }

    return <Outlet />
}

export default RoleRoute;


