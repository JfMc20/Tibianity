# Stage 1: Build the React application
FROM node:18-slim AS builder
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Copiar el resto del código de la aplicación ANTES de instalar
COPY . .

# Instalar dependencias (después de copiar todo el código)
RUN npm install

# Construir la aplicación para producción
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

# Eliminar el contenido por defecto de Nginx
RUN rm -rf ./*

# Copiar los archivos construidos desde el stage 'builder'
COPY --from=builder /app/build .

# Exponer el puerto 3001
EXPOSE 3001

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"] 