# Stage 1: Build the TypeScript application
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar todos los archivos necesarios primero
COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY src ./src

# Instalar dependencias (usando ci para consistencia)
RUN npm ci

# Construir la aplicación TypeScript
RUN npm run build

# Stage 2: Create the final production image
FROM node:20-alpine
WORKDIR /app

# Copiar solo las dependencias de producción desde el stage 'builder'
COPY --from=builder /app/node_modules ./node_modules

# Copiar los archivos construidos (JavaScript) desde el stage 'builder'
COPY --from=builder /app/dist/ ./dist/

# Copiar package.json (necesario para el comando npm start)
COPY package.json ./

# Exponer el puerto en el que escucha tu backend
# CAMBIAR 3000 SI TU BACKEND USA OTRO PUERTO
EXPOSE 5000

# Definir variable de entorno para producción (opcional pero recomendado)
ENV NODE_ENV=production

# Comando para iniciar la aplicación
CMD ["npm", "start"] 