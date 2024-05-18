# Etapa 1: Construcción del frontend
FROM node:14 AS build-frontend

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Etapa 2: Configuración del backend
FROM node:14 AS build-backend

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend/ ./
COPY --from=build-frontend /app/frontend/build /app/backend/public

# Etapa 3: Imagen final
FROM node:14

WORKDIR /app

COPY --from=build-backend /app/backend /app/backend

# Añadir el archivo de configuración de Redis como un volumen
VOLUME ["/app/config"]

ENV REDIS_CONFIG_PATH=/app/config/redis-config.json

WORKDIR /app/backend

CMD ["node", "src/app.js"]
