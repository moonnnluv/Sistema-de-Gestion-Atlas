# Atlas

API en Node.js (Express) con PostgreSQL. Intencionalmente vulnerable para fines académicos.

## Requisitos
- Node.js 18+
- PostgreSQL 13+

## Instalación
```bash
npm install
```

## Base de datos
1. Crear base de datos local (si no existe):
   ```sql
   CREATE DATABASE atlas;
   ```
2. Ejecutar script de tablas y datos:
   ```sql
   \c atlas
   \i sql/init.sql
   ```
3. Conexión por defecto: `postgres://postgres:postgres@localhost:5432/atlas`
   - Puedes cambiarla con `DATABASE_URL`.

## Ejecutar
```bash
npm run start
```
- La API: `http://localhost:4000`
- Salud: `GET /`
 - Swagger UI: `http://localhost:4000/docs`
 - OpenAPI JSON: `http://localhost:4000/openapi.json`

## Autenticación
- `POST /autenticacion/login` body `{ "nombre_usuario": "admin", "password": "admin" }`
- Respuesta: `{ token }`
- El token JWT incluye: `usuarioId`, `nombreUsuario`, `empresaUsuarioId`, `empresaId`

## Endpoints

### Usuarios
- `POST /usuarios`, `GET /usuarios`, `GET /usuarios/:id`, `PUT /usuarios/:id`, `DELETE /usuarios/:id`
- Campos: `nombre_usuario`, `contrasena_hash`, `correo`
- **Nota:** `GET /usuarios` filtra usuarios por empresa del token

### Clientes
- `POST /clientes`, `GET /clientes`, `GET /clientes/:id`, `PUT /clientes/:id`, `DELETE /clientes/:id`
- Campos: `nombre`, `correo`, `telefono`, `direccion`, `es_empresa`, `nombre_banco`, `numero_cuenta`, `titular_cuenta`
- **Nota:** El campo `empresa_id` se obtiene automáticamente del token al crear/editar. Todos los endpoints filtran por empresa del token.
- Buscar clientes: `GET /clientes/search?name=ACME` (consulta por nombre con ILIKE, filtrado por empresa)

### Contratos
- Subir: `POST /contratos` (form-data: `cliente_id`, `titulo`, `fecha_inicio`, `fecha_fin`, opcional `descripcion`, y `file` PDF)
- Listar: `GET /contratos`
- Detalle: `GET /contratos/:id`
- Ver archivo: `GET /contratos/:id/file` (desde DB `documentos_contrato`)
- Eliminar: `DELETE /contratos/:id`
- **Contratos por estado:** `GET /contratos/estados`
  - Retorna un array con contratos por estado (`por_vencer` y `vencido`)
  - `por_vencer`: contratos cuya `fecha_fin` está entre hoy y los próximos 30 días (máximo 3)
  - `vencido`: contratos cuya `fecha_fin` ya pasó (máximo 3)
  - Cada contrato incluye el campo `estado`
  - Requiere autenticación (filtra por empresa del token)
- **Dashboard:** `GET /contratos/dashboard`
  - Retorna estadísticas de la empresa:
    - `totalUsuarios`: total de usuarios asociados a la empresa
    - `totalClientes`: total de clientes de la empresa
    - `contratosVencen7Dias`: contratos que vencen en los próximos 7 días
    - `contratosVencen15Dias`: contratos que vencen en los próximos 15 días
    - `contratosVencen30Dias`: contratos que vencen en los próximos 30 días
  - Requiere autenticación (filtra por empresa del token)

### Auditoría
- `POST /auditoria`, `GET /auditoria`

### Empresas
- `POST /empresas`, `GET /empresas`, `GET /empresas/:id`, `PUT /empresas/:id`, `DELETE /empresas/:id`
- Campos: `nombre`, `direccion`, `telefono`, `correo`
- **Nota:** `POST /empresas` acepta un formato especial para crear empresa con usuario:
  ```json
  {
    "usuario": {
      "nombre_usuario": "usuario",
      "contrasena_hash": "password",
      "correo": "correo@example.com"
    },
    "empresa": {
      "nombre": "Empresa SA",
      "direccion": "...",
      "telefono": "...",
      "correo": "empresa@example.com"
    }
  }
  ```
  Este endpoint crea automáticamente el usuario, la empresa y la relación empresa-usuario con rol administrador (ID 1).

### Roles
- `POST /roles`, `GET /roles`, `GET /roles/:id`, `PUT /roles/:id`, `DELETE /roles/:id`
- Campos: `nombre`

### Empresa-Usuarios
- `POST /empresa-usuarios`, `GET /empresa-usuarios`, `GET /empresa-usuarios/:id`, `PUT /empresa-usuarios/:id`, `DELETE /empresa-usuarios/:id`
- Campos: `empresa_id`, `usuario_id`, `rol_id`

## Notas
- Los documentos de contratos se almacenan en DB (`documentos_contrato.document`) y se sirven desde `GET /contratos/:id/file`.
- Contraseñas en texto plano a propósito (campo `contrasena_hash` no usa hash real).
- Sin mitigaciones de seguridad (XSS/SQLi, etc.).
- La mayoría de los endpoints requieren autenticación mediante token Bearer en el header `Authorization`.
- Los endpoints filtran datos por empresa según el `empresaId` contenido en el token JWT.
- Todos los errores retornan formato: `{ error: "mensaje", glosa: "detalle del error" }`.
