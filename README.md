# VeteriAPI - Frontend

Aplicación web para la gestión de una veterinaria, desarrollada con React. Permite gestionar mascotas, veterinarios y turnos, con funcionalidades diferenciadas según el tipo de usuario.

## Datos del alumno

- **Nombre y apellido:** Agostina Gamboa Straus
- **Materia:** Aplicaciones Híbridas
- **Docente:** Jonathan Emanuel Cruz
- **Comisión:** [26-2][DWN4AV]

## Tecnologías utilizadas

- React 19
- Vite
- React Router DOM
- JWT Decode
- JavaScript

## Funcionalidades

### Usuarios
- Registro de cuenta.
- Inicio y cierre de sesión.
- Acceso a las mascotas propias.
- Crreación de turnos propios.
- Consulta de turnos propios.
- Visualización y actualización de información del perfil.

### Administrador
- Registro, consulta, edición y eliminación de mascotas.
- Registro y consulta de veterinarios.
- Creación, consulta, edición y eliminación de turnos.

## Instalación

1. Clonar el repositorio:

   https://github.com/agostinaChina/VeteriAPI-Frontend.git

2. Ingresar a la carpeta del proyecto:

   cd VeteriAPI-Frontend

3. Instalar las dependencias:

   npm install

4. Crear un archivo `.env` en la raíz del proyecto y configurar la URL del backend:

   VITE_API_URL=http://localhost:5000

5. Iniciar el servidor de desarrollo:

   npm run dev

La aplicación esta disponible en la dirección local que indique Vite en la terminal, habitualmente `http://localhost:5173`.


## Backend

La aplicación necesita que el backend de VeteriAPI esté en funcionamiento para realizar las operaciones y consultas a la API.

Repositorio del backend: https://github.com/agostinaChina/VeteriAPI
