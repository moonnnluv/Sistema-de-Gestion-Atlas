-- Esquema final en español (creación directa de tablas)

create table usuarios (
  id bigint primary key generated always as identity,
  nombre_usuario text not null unique,
  contrasena_hash text not null,
  correo text not null unique,
  created_at timestamp with time zone default now()
);

create table empresas (
  id bigint primary key generated always as identity,
  nombre text not null,
  direccion text,
  telefono text,
  correo text not null unique,
  created_at timestamp with time zone default now()
);

create table clientes (
  id bigint primary key generated always as identity,
  nombre text not null,
  correo text not null unique,
  telefono text,
  direccion text,
  es_empresa boolean not null default false,
  -- Información del cliente
  rut text,
  nombre_fantasia text,
  giro_actividad_economica text,
  -- Información del representante del cliente
  nombre_representante text,
  cargo_representante text,
  correo_representante text,
  telefono_representante text,
  relacion_representante text,
  -- Información de contacto (desglosada)
  direccion_calle text,
  direccion_numero text,
  direccion_ciudad text,
  direccion_region text,
  sitio_web text,
  telefono_corporativo text,
  -- Información financiera
  nombre_banco text,
  numero_cuenta text,
  titular_cuenta text,
  metodo_pago text,
  dia_pago text,
  moneda text,
  empresa_id bigint references empresas (id),
  created_at timestamp with time zone default now()
);

create table contratos (
  id bigint primary key generated always as identity,
  cliente_id bigint references clientes (id),
  titulo text not null,
  descripcion text,
  fecha_inicio date not null,
  fecha_fin date not null,
  created_at timestamp with time zone default now()
);

create table documentos_contrato (
  id bigint primary key generated always as identity,
  contract_id bigint references contratos (id),
  document bytea not null,
  created_at timestamp with time zone default now()
);

create table auditoria (
  id bigint primary key generated always as identity,
  usuario_id text not null,
  accion text not null,
  fecha_hora timestamp with time zone default now()
);

create table roles (
  id bigint primary key generated always as identity,
  nombre text not null unique
);

create table empresa_usuarios (
  id bigint primary key generated always as identity,
  empresa_id bigint references empresas (id),
  usuario_id bigint references usuarios (id),
  rol_id bigint references roles (id),
  created_at timestamp with time zone default now()
);

INSERT INTO public.roles OVERRIDING SYSTEM VALUE VALUES (1, 'administrador');
INSERT INTO public.roles OVERRIDING SYSTEM VALUE VALUES (2, 'editor');