# Backend de Tibianity

Backend para la aplicación Tibianity que proporciona API para integrarse con TibiaData y ofrece autenticación mediante Google OAuth.

## Descripción General
El backend de Tibianity es una API REST desarrollada en Node.js con TypeScript. Proporciona servicios para obtener datos del juego Tibia utilizando la API TibiaData y ofrece autenticación mediante Google OAuth. Además, almacena la información de los usuarios en MongoDB.

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/         # Configuraciones del sistema
│   ├── controllers/    # Controladores para las rutas 
│   ├── middleware/     # Middlewares (autenticación, etc.)
│   ├── models/         # Modelos de datos (Mongoose)
│   ├── routes/         # Definición de rutas de la API
│   ├── scripts/        # Scripts utilitarios
│   ├── services/       # Servicios para conexión con APIs
│   ├── types/          # Definiciones de tipos TypeScript
│   ├── utils/          # Utilidades varias
│   └── index.ts        # Punto de entrada de la aplicación
├── .env                # Variables de entorno (no incluir en git)
├── .env.example        # Plantilla para el archivo .env
├── .gitignore          # Archivos ignorados por git
├── package.json        # Dependencias y scripts
├── tsconfig.json       # Configuración de TypeScript
└── README.md           # Documentación básica
```

## Componentes Principales

### 1. Servidor Express (index.ts)
- Configura el servidor Express con middlewares (CORS, JSON, sesiones)
- Inicializa Passport para autenticación
- Establece la conexión con MongoDB
- Define las rutas principales
- Configura el manejo de errores

### 2. Autenticación (config/passport.config.ts)
- Implementa la estrategia Google OAuth 2.0
- Guarda los datos de usuario en MongoDB
- Registra automáticamente cada inicio de sesión en la base de datos
- Configura la serialización y deserialización de usuarios
- Utiliza las credenciales de Google configuradas en variables de entorno

### 3. Base de Datos
- **db.ts**: Configuración de conexión a MongoDB
  - Gestión de la conexión y manejo de errores
  - Uso de la URI especificada en variables de entorno

- **User.ts**: Modelo de usuario para MongoDB
  - Define el esquema con los campos requeridos (googleId, name, email, etc.)
  - Proporciona la interfaz TypeScript para mantener el tipado fuerte

- **SessionLog.ts**: Modelo para registrar inicios de sesión
  - Almacena información de cada inicio de sesión (usuario, IP, fecha, user-agent)
  - Establece relación con el modelo de Usuario mediante referencias
  - Permite el seguimiento y auditoría de la actividad de usuarios

### 4. Middleware de Autenticación
- **auth.middleware.ts**: Funciones de verificación para proteger rutas
  - `isAuthenticated`: Verifica que el usuario esté autenticado
  - `isAdmin`: Verifica que el usuario tenga privilegios de administrador
  - Controla el acceso a rutas sensibles del sistema

### 5. Rutas
- **auth.routes.ts**: Rutas para autenticación con Google OAuth
  - `/auth/google`: Inicio del flujo de autenticación
  - `/auth/google/callback`: Callback después de la autenticación
  - `/auth/profile`: Obtener perfil del usuario
  - `/auth/logout`: Cerrar sesión

- **news.routes.ts**: Rutas para obtener noticias de Tibia
  - `/api/news`: Obtiene las últimas noticias
  - `/api/news/:id`: Obtiene una noticia específica por ID

- **admin.routes.ts**: Rutas administrativas protegidas
  - `/admin/users`: Obtiene todos los usuarios registrados (solo admin)
  - `/admin/sessions`: Obtiene todos los logs de inicio de sesión (solo admin)

### 6. Controladores
- **news.controller.ts**: Gestiona las solicitudes de noticias
  - Procesamiento de datos de la API externa
  - Manejo de errores y respuestas

- **auth.controller.ts**: Gestiona las solicitudes de autenticación
  - Funcionalidad para ver perfil y cerrar sesión
  - Integración con Passport

- **admin.controller.ts**: Gestiona las funciones administrativas
  - Obtención de listado de usuarios registrados
  - Obtención y filtrado de registros de sesiones
  - Funcionalidades protegidas para administradores

### 7. Servicios
- **tibiadata.service.ts**: Servicio para interactuar con la API de TibiaData
  - Métodos para obtener noticias recientes y por ID
  - Adaptación de datos entre formatos de API y aplicación
  - Manejo de errores y logging detallado

### 8. Script de Sincronización de Noticias (sync-news.ts)
- Script para obtener y traducir noticias de Tibia
- Utiliza OpenRouter API para traducir contenido de inglés a español
- Almacena las noticias traducidas en un archivo JSON
- Se puede ejecutar mediante el comando `npm run sync-news`

## Variables de Entorno (.env)
- `TIBIADATA_API_URL`: URL de la API de TibiaData
- `PORT`: Puerto para el servidor (5000 por defecto)
- `NODE_ENV`: Entorno de ejecución (development/production)
- `GOOGLE_CLIENT_ID`: ID de cliente de Google OAuth
- `GOOGLE_CLIENT_SECRET`: Clave secreta de Google OAuth
- `SESSION_SECRET`: Clave para sesiones Express
- `FRONTEND_URL`: URL del frontend
- `OPENROUTER_API_KEY`: Clave API para el servicio de traducción
- `OPENROUTER_BASE_URL`: URL base para OpenRouter API
- `TRANSLATION_MODEL`: Modelo a utilizar para traducciones
- `MONGO_URI`: URI de conexión a MongoDB Atlas

## Tipos de Datos Principales
- `TibiaNews`: Interfaz para las noticias de Tibia
- `TranslatedTibiaNews`: Interfaz para noticias traducidas
- `UserProfile`: Interfaz para perfiles de usuario
- `IUser`: Interfaz para el modelo de usuario en MongoDB
- `ISessionLog`: Interfaz para registros de sesiones en MongoDB

## Instalación

1. Clona el repositorio
2. Navega al directorio del backend
3. Instala las dependencias

```bash
cd backend
npm install
```

4. Copia el archivo .env.example a .env y configura las variables:

```bash
cp .env.example .env
```

5. Edita el archivo .env según tus necesidades, incluyendo la `MONGO_URI` para conectar a MongoDB

## Configuración de MongoDB

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un nuevo cluster
3. En la sección "Database Access", crea un nuevo usuario con permisos de lectura/escritura
4. En la sección "Network Access", permite el acceso desde tu IP o desde cualquier lugar para desarrollo
5. En "Clusters", haz clic en "Connect" y selecciona "Connect your application"
6. Copia la URI de conexión y reemplaza `<username>`, `<password>` y `<dbname>` con tus datos
7. Agrega la URI en tu archivo `.env` como `MONGO_URI`

## Ejecución

### Modo Desarrollo (Recomendado con Docker)

La forma más sencilla de ejecutar el backend junto con el frontend y la base de datos en un entorno de desarrollo con recarga automática para ambos es usando el archivo `docker-compose.dev.yml` desde la **raíz del proyecto** (`Tibianity/`, un nivel arriba de esta carpeta).

1.  **Desde la raíz del proyecto (`../` si estás en `tibianity-backend/`):**
    ```bash
    # Construye las imágenes (solo necesario la primera vez o si cambias dependencias)
    docker-compose -f docker-compose.dev.yml build

    # Inicia todos los servicios (backend con nodemon, frontend con hot-reload, db)
    docker-compose -f docker-compose.dev.yml up
    ```
2.  El backend estará disponible en [http://localhost:5000](http://localhost:5000).
3.  Los cambios en el código fuente del backend (`src/`) provocarán un reinicio automático del servidor gracias a `nodemon` (`npm run watch`).

### Modo Desarrollo (Standalone)

Si deseas ejecutar solo el backend localmente (necesitarás una instancia de MongoDB accesible y configurar `MONGO_URI` en `.env`):

Para iniciar el servidor en modo desarrollo (ejecuta directamente TypeScript):

```bash
npm run dev
```

Para desarrollo con recarga automática usando `nodemon`:

```bash
npm run watch
```

### Producción (Standalone)

Para compilar y ejecutar en producción (requiere MongoDB accesible):

```bash
npm run build
npm start
```

### Scripts Adicionales

Para sincronizar y traducir noticias (requiere configurar API keys en `.env`):

```bash
npm run sync-news
```

Por defecto el servidor se ejecutará en http://localhost:5000.

## Endpoints API

### Públicos
- `GET /api/news` - Obtiene las últimas noticias
- `GET /api/news/:id` - Obtiene una noticia específica por ID

### Autenticación
- `GET /auth/google` - Inicia el flujo de autenticación con Google
- `GET /auth/profile` - Obtiene el perfil del usuario autenticado
- `GET /auth/logout` - Cierra la sesión del usuario

### Administración (protegidos)
- `GET /admin/users` - Obtiene todos los usuarios registrados (requiere ser administrador)
- `GET /admin/sessions` - Obtiene todos los logs de sesiones (requiere ser administrador)
  - Filtros opcionales:
    - `?userId={googleId}` - Filtra sesiones por usuario
    - `?startDate={YYYY-MM-DD}` - Filtra desde una fecha específica
    - `?endDate={YYYY-MM-DD}` - Filtra hasta una fecha específica

## Sistema de Registro de Sesiones

El sistema registra automáticamente cada inicio de sesión cuando un usuario se autentica a través de Google OAuth, almacenando:

- **Usuario**: Referencia al documento del usuario que inició sesión
- **Dirección IP**: IP desde donde se conectó el usuario
- **Fecha**: Momento exacto del inicio de sesión
- **User Agent**: Información del navegador/dispositivo utilizado

Esta información es accesible únicamente para usuarios administradores a través de la ruta `/admin/sessions`.

## Control de Acceso

El sistema implementa diferentes niveles de acceso:

- **Público**: Cualquier usuario puede acceder a las rutas públicas
- **Autenticado**: Solo usuarios que han iniciado sesión pueden acceder a rutas protegidas
- **Administrador**: Solo usuarios con emails específicos pueden acceder a rutas administrativas

La verificación de administrador está implementada en el middleware `isAdmin` que valida el email del usuario contra una lista de emails autorizados.

## Tecnologías utilizadas

- Node.js
- Express
- TypeScript
- Mongoose
- MongoDB Atlas
- Axios
- Passport (Google OAuth)
- OpenRouter API (para traducciones) 