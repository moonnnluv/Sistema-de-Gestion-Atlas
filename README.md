# Bienvenido/a

Este proyecto fue desarrollado para la asignatura ISY1102 - Calidad y seguridad en el desarrollo de software. En este repositorio se incluye un Frontend y Backend asociados al Caso A de la asignatura llamado "Sistema de Gestión Atlas".

Este software permitirá a usuarios registrados (por empresas) gestionar clientes, contratos y documentos asociados, administrar usuarios y roles internos de la empresa, auditar acciones, y garantizar cumplimiento de normativa de protección de datos y estándares de seguridad. Debe ser accesible desde desktop, tablets y móviles, con especial atención a la usabilidad para adultos mayores.

Este proyecto está pensando para ser utilizado de las siguientes maneras:
 - Podrás inicializar el backend y frontend por separado y según tu lo requieras
 - Podrás efectuar análisis de código estático para frontend y backend.
 - Podrás efectuar análisis de código dinámico al levantar ambos servicios.
 - Utilizar docker en lugar de levantar manualmente cada servicio ya que se incluye una imagen para el proyecto completo que inicializa y configura cada elemento del software construido.
 

## Estructura

Abre el proyecto mediante terminal o editor de código de preferencia Visual Studio Code. El software tiene la siguiente estructura de carpetas y archivos
 
```
root
	|/BACKEND
	|/FRONTEND
	|.env
	|.gitignore
	|docker-compose.yml
	|package.json
	|README.md
```
En el archivo `.env` se definen las variables de entorno que utilizará docker al momento de crear las imágenes, por lo que puedes modificarlas en el caso de tener otros servicios corriendo en tu equipo que utilicen los mismos puertos.

1. JWT_SECRET: `0d1d8132f0fde5beabb417b434ff10f1cae8635a461686b0f46ac9c2bbfbd0e8` Llave utilizada para cifrar y generar los tokens de sesión
2. PORT_POSTGRES: `15432` Puerto expuesto que utilizará tu equipo para permitir acceder a la conexión a la base de datos
3. PORT_BACKEND: `4450` Puerto expuesto que utilizará tu equipo para acceder a la API
4. PORT_FRONTEND: `3350` Puerto expuesto que utilizará tu equipo para acceder al cliente - frontend

## Inicialización con Docker
Abre la terminal y situate en la raíz del proyecto y ejecuta el comando:

1. Ejecuta `docker-compose up -d` para levantar todos los servicios
2. El frontend estará disponible en `http://localhost:3350` (o el puerto configurado en .env)
3. El backend estará disponible en `http://localhost:4450` (o el puerto configurado en .env)
4. La base de datos estará disponible para conectarse mediante:
	4.1 Host: `localhost`
	4.2 Port: `15432 `(o el configurado en .env)
	4.3 Database: `atlas`
	4.4 Nombre de usuario: `postgres`
	4.5 Contraseña: `postgres`