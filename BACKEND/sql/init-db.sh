#!/bin/bash
set -e

echo "========================================="
echo "Inicializando base de datos Atlas..."
echo "========================================="

# Esperar un momento para asegurar que la base de datos esté lista
sleep 2

# Procesar el dump eliminando comandos problemáticos y ejecutarlo
# Eliminamos DROP DATABASE, CREATE DATABASE, CREATE SCHEMA public y reemplazamos \connect atlas
echo "Procesando dump-atlas.sql..."

# Crear un archivo temporal procesado
PROCESSED_DUMP="/tmp/dump-processed.sql"

# Procesar el dump
grep -v "^DROP DATABASE" /tmp/dump-atlas.sql | \
grep -v "^CREATE DATABASE" | \
grep -v "^ALTER DATABASE atlas" | \
grep -v "^CREATE SCHEMA public" | \
grep -v "^ALTER SCHEMA public OWNER" | \
sed "s/\\\\connect atlas/\\\\c $POSTGRES_DB/g" | \
sed "s/\\\\connect $POSTGRES_DB/\\\\c $POSTGRES_DB/g" > "$PROCESSED_DUMP"

echo "Cargando dump procesado en la base de datos $POSTGRES_DB..."
psql -v ON_ERROR_STOP=0 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" < "$PROCESSED_DUMP"

# Verificar que las tablas se crearon
echo "Verificando tablas creadas..."
TABLE_COUNT=$(psql -t -A --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
echo "Tablas creadas: $TABLE_COUNT"

echo "========================================="
echo "Base de datos inicializada correctamente."
echo "========================================="

