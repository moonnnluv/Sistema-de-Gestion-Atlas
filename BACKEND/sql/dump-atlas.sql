--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3
-- Dumped by pg_dump version 13.3

-- Started on 2025-11-17 23:44:10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE atlas;
--
-- TOC entry 3090 (class 1262 OID 68930)
-- Name: atlas; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE atlas WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Spanish_Spain.1252';


ALTER DATABASE atlas OWNER TO postgres;

\connect atlas

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 3091 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 211 (class 1259 OID 69012)
-- Name: auditoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auditoria (
    id bigint NOT NULL,
    usuario_id text NOT NULL,
    accion text NOT NULL,
    fecha_hora timestamp with time zone DEFAULT now()
);


ALTER TABLE public.auditoria OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 69010)
-- Name: auditoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.auditoria ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.auditoria_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 205 (class 1259 OID 68961)
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
--

create table public.clientes (
  id bigint NOT NULL,
  nombre text not null,
  correo text not null unique,
  telefono text,
  direccion text,
  es_empresa boolean DEFAULT false NOT NULL,
  rut text,
  nombre_fantasia text,
  giro_actividad_economica text,
  nombre_representante text,
  cargo_representante text,
  correo_representante text,
  telefono_representante text,
  relacion_representante text,
  direccion_calle text,
  direccion_numero text,
  direccion_ciudad text,
  direccion_region text,
  sitio_web text,
  telefono_corporativo text,
  nombre_banco text,
  numero_cuenta text,
  titular_cuenta text,
  metodo_pago text,
  dia_pago text,
  moneda text,
  empresa_id bigint,
  created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.clientes OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 68959)
-- Name: clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.clientes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.clientes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 207 (class 1259 OID 68980)
-- Name: contratos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contratos (
    id bigint NOT NULL,
    cliente_id bigint,
    titulo text NOT NULL,
    descripcion text,
    fecha_inicio date NOT NULL,
    fecha_fin date NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.contratos OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 68978)
-- Name: contratos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.contratos ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.contratos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 209 (class 1259 OID 68996)
-- Name: documentos_contrato; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documentos_contrato (
    id bigint NOT NULL,
    contract_id bigint,
    document bytea NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.documentos_contrato OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 68994)
-- Name: documentos_contrato_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.documentos_contrato ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.documentos_contrato_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 215 (class 1259 OID 69035)
-- Name: empresa_usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresa_usuarios (
    id bigint NOT NULL,
    empresa_id bigint,
    usuario_id bigint,
    rol_id bigint,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.empresa_usuarios OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 69033)
-- Name: empresa_usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.empresa_usuarios ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.empresa_usuarios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 203 (class 1259 OID 68948)
-- Name: empresas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresas (
    id bigint NOT NULL,
    nombre text NOT NULL,
    direccion text,
    telefono text,
    correo text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.empresas OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 68946)
-- Name: empresas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.empresas ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.empresas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 213 (class 1259 OID 69023)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    nombre text NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 69021)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.roles ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 201 (class 1259 OID 68933)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id bigint NOT NULL,
    nombre_usuario text NOT NULL,
    contrasena_hash text NOT NULL,
    correo text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 68931)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.usuarios ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.usuarios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

--
-- TOC entry 3082 (class 0 OID 69023)
-- Dependencies: 213
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.roles OVERRIDING SYSTEM VALUE VALUES (1, 'administrador');
INSERT INTO public.roles OVERRIDING SYSTEM VALUE VALUES (2, 'editor');
INSERT INTO public.usuarios OVERRIDING SYSTEM VALUE VALUES (1, 'admin', 'admin', 'admin@atlasfake.com');
INSERT INTO public.usuarios OVERRIDING SYSTEM VALUE VALUES (2, 'editor', 'editor', 'editor@atlasfake.com');
INSERT INTO public.empresas OVERRIDING SYSTEM VALUE VALUES (1, 'Altavia', 'Avenida Macul 4660, Macul, Santiago', '1234567890', 'altavia@atlasfake.com');
INSERT INTO public.clientes OVERRIDING SYSTEM VALUE VALUES (1,'María González','maria.gonzalez@biotec.cl',
  '987654321','Av. Providencia 1234, Providencia, Santiago',true,'17654321-9','Biotec Solutions','Servicios Tecnológicos','Carlos Rojas','Gerente General','carlos.rojas@biotec.cl','912345678','Representante Legal','Av. Providencia','1234','Providencia','Region Metropolitana','https://www.biotec.cl','912345678','Banco Santander','9876543210','Biotec Solutions SpA','transferencia','5','CLP',1);
INSERT INTO public.clientes OVERRIDING SYSTEM VALUE VALUES (2,'Pedro Morales','pedro.morales@constructoraandes.cl','998877665','Av. Apoquindo 4500, Las Condes, Santiago',true,'18933456-2','Constructora Andes','Construcción y Obras Civiles','Laura Fernández','Directora de Administración','laura.fernandez@constructoraandes.cl','934567890','Apoderada','Av. Apoquindo','4500','Las Condes','Region Metropolitana','https://www.constructoraandes.cl','998877665','Banco BCI','4567891230','Constructora Andes Ltda.','transferencia','10','CLP',1);
  
INSERT INTO public.contratos OVERRIDING SYSTEM VALUE VALUES (1, 1, 'Contrato de Servicios', 'Contrato de servicios de Biotec Solutions', '2026-01-01', '2026-12-31');
INSERT INTO public.contratos OVERRIDING SYSTEM VALUE VALUES (2, 2, 'Contrato de Servicios', 'Contrato de servicios de Construcción y Obras Civiles', '2026-01-01', '2026-12-31');

INSERT INTO public.empresa_usuarios OVERRIDING SYSTEM VALUE VALUES (1, 1, 1, 1);
INSERT INTO public.empresa_usuarios OVERRIDING SYSTEM VALUE VALUES (2, 1, 2, 2);

--
-- TOC entry 3092 (class 0 OID 0)
-- Dependencies: 210
-- Name: auditoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auditoria_id_seq', 1, true);


--
-- TOC entry 3093 (class 0 OID 0)
-- Dependencies: 204
-- Name: clientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clientes_id_seq', 2, true);


--
-- TOC entry 3094 (class 0 OID 0)
-- Dependencies: 206
-- Name: contratos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contratos_id_seq', 2, true);


--
-- TOC entry 3095 (class 0 OID 0)
-- Dependencies: 208
-- Name: documentos_contrato_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documentos_contrato_id_seq', 1, true);


--
-- TOC entry 3096 (class 0 OID 0)
-- Dependencies: 214
-- Name: empresa_usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.empresa_usuarios_id_seq', 2, true);


--
-- TOC entry 3097 (class 0 OID 0)
-- Dependencies: 202
-- Name: empresas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.empresas_id_seq', 1, true);


--
-- TOC entry 3098 (class 0 OID 0)
-- Dependencies: 212
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 2, true);


--
-- TOC entry 3099 (class 0 OID 0)
-- Dependencies: 200
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 2, true);


--
-- TOC entry 2926 (class 2606 OID 69020)
-- Name: auditoria auditoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria
    ADD CONSTRAINT auditoria_pkey PRIMARY KEY (id);


--
-- TOC entry 2918 (class 2606 OID 68972)
-- Name: clientes clientes_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_correo_key UNIQUE (correo);


--
-- TOC entry 2920 (class 2606 OID 68970)
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- TOC entry 2922 (class 2606 OID 68988)
-- Name: contratos contratos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contratos
    ADD CONSTRAINT contratos_pkey PRIMARY KEY (id);


--
-- TOC entry 2924 (class 2606 OID 69004)
-- Name: documentos_contrato documentos_contrato_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_contrato
    ADD CONSTRAINT documentos_contrato_pkey PRIMARY KEY (id);


--
-- TOC entry 2932 (class 2606 OID 69040)
-- Name: empresa_usuarios empresa_usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_usuarios
    ADD CONSTRAINT empresa_usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 2914 (class 2606 OID 68958)
-- Name: empresas empresas_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_correo_key UNIQUE (correo);


--
-- TOC entry 2916 (class 2606 OID 68956)
-- Name: empresas empresas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_pkey PRIMARY KEY (id);


--
-- TOC entry 2928 (class 2606 OID 69032)
-- Name: roles roles_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key UNIQUE (nombre);


--
-- TOC entry 2930 (class 2606 OID 69030)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 2908 (class 2606 OID 68945)
-- Name: usuarios usuarios_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_key UNIQUE (correo);


--
-- TOC entry 2910 (class 2606 OID 68943)
-- Name: usuarios usuarios_nombre_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_nombre_usuario_key UNIQUE (nombre_usuario);


--
-- TOC entry 2912 (class 2606 OID 68941)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 2933 (class 2606 OID 68973)
-- Name: clientes clientes_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 2934 (class 2606 OID 68989)
-- Name: contratos contratos_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contratos
    ADD CONSTRAINT contratos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id);


--
-- TOC entry 2935 (class 2606 OID 69005)
-- Name: documentos_contrato documentos_contrato_contract_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_contrato
    ADD CONSTRAINT documentos_contrato_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contratos(id);


--
-- TOC entry 2936 (class 2606 OID 69041)
-- Name: empresa_usuarios empresa_usuarios_empresa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_usuarios
    ADD CONSTRAINT empresa_usuarios_empresa_id_fkey FOREIGN KEY (empresa_id) REFERENCES public.empresas(id);


--
-- TOC entry 2938 (class 2606 OID 69051)
-- Name: empresa_usuarios empresa_usuarios_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_usuarios
    ADD CONSTRAINT empresa_usuarios_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id);


--
-- TOC entry 2937 (class 2606 OID 69046)
-- Name: empresa_usuarios empresa_usuarios_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa_usuarios
    ADD CONSTRAINT empresa_usuarios_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


-- Completed on 2025-11-17 23:44:10

--
-- PostgreSQL database dump complete
--

