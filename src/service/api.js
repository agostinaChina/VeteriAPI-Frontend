
const API_URL = import.meta.env.VITE_API_URL;

export async function obtenerMascotas(){
    return await fetchPrivado('/api/pets');
}


export async function iniciarSesion(email, password){
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json().catch(err => {
            //console.log(err)
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Email o contraseña incorrectos");
            }

            if (response.status >= 500) {
                throw new Error("El servidor no está disponible. Intentá nuevamente más tarde.");
            }

            throw new Error("No se pudo iniciar Sesión");
        }

        return data;

    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error("No se pudo conectar con el servidor. Intentá nuevamente.");
        }

        throw error;
    }
}


export async function registrarUsuario(name, email, password){
    const response = await fetch(`${API_URL}/api/auth/register`,  {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password})
                });
    const data = await response.json()

    if( !response.ok){
        throw new Error("No se pudo realizar el registro");
    }

    return data;
}

export async function fetchPrivado( endpoint, options={} ){
    const token = sessionStorage.getItem('token');
    if( !token){
        throw new Error("No existe una sesión activa");
    }

const headers = new Headers(options.headers || {});
headers.set('Authorization', `Bearer ${token}`);

if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
}

    const response = await fetch(`${API_URL}${endpoint}`,
                                {
                                    ...options, headers
                                }
                            );
    const data = await response.json().catch( () => null );
    
    if( response.status === 401){
        throw new Error("La sesión es invalida o expiro");
    }

    if( response.status === 403) {
        throw new Error("Acceso no Permido");
    }

if (!response.ok) {
    console.log(data?.message);
    throw new Error(data?.message || "Error del Servidor");
}

    

    return data;
}

export async function obtenerPerfil(){
    return await fetchPrivado('/api/users/me');
}

export async function subirFotoPerfil( archivo ){

    const formData = new FormData();
    formData.append('profileImage', archivo);

    return await fetchPrivado('/api/users/profileimage',{
        method: 'POST',
        body: formData
    })
}