# Etapa 1: Construcción
FROM node:20 AS builder

WORKDIR /app

# Argumento para la URL de la API
ARG VITE_API_URL=http://localhost:4000

# Copiar archivos de dependencias
COPY package*.json ./

# Limpiar completamente e instalar dependencias
# Esto soluciona problemas con dependencias opcionales de rollup y esbuild
RUN rm -rf node_modules package-lock.json && \
    npm install && \
    npm install @rollup/rollup-linux-x64-gnu --save-optional && \
    npm rebuild esbuild

# Copiar código fuente
COPY . .

# Establecer variable de entorno para el build
ENV VITE_API_URL=${VITE_API_URL}

# Reinstalar esbuild después de copiar todo para asegurar compatibilidad
RUN rm -rf node_modules/.cache && \
    npm rebuild esbuild --force || \
    (npm uninstall esbuild && npm install esbuild)

# Construir la aplicación
RUN npm run build

# Etapa 2: Producción
FROM nginx:alpine

# Copiar los archivos construidos desde la etapa de construcción
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de nginx personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]

