# Tibianity - Frontend

![Tibianity Logo](public/images/Logo%20(1).png)

Tibianity es una plataforma web para una comunidad de creadores de contenido enfocados en el juego Tibia. El sitio sirve como un hub central para mostrar streamers, youtubers y otros creadores patrocinados, así como para compartir noticias, lore del juego, eventos próximos, ofrecer un mercado virtual y gestionar suscripciones de correo.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Componentes Principales](#componentes-principales)
- [Sistema de Páginas y Rutas Administrativas](#sistema-de-páginas-y-rutas-administrativas)
- [Autenticación](#autenticación)
- [Funcionalidades del Administrador](#funcionalidades-del-administrador)
- [Integración con Backend](#integración-con-backend)
- [Sistema de Noticias](#sistema-de-noticias)
- [Estilos y Diseño](#estilos-y-diseño)
- [Estado y Próximos Pasos](#estado-y-próximos-pasos)
- [Contribución](#contribución)

## ✨ Características

- **Showcase de Creadores**: Destacar los mejores creadores de contenido de Tibia
- **Noticias Oficiales**: Integración con la API del backend para mostrar noticias oficiales de Tibia con traducción al español
- **Autenticación con Google**: Sistema de login integrado con Google OAuth
- **Diseño Neón**: Interfaz oscura con efectos de neón y animaciones sutiles
- **Componentes Interactivos**: Elementos UI con efectos hover, animaciones y gradientes
- **Diseño Responsive**: Optimizado para todos los dispositivos
- **Integración con Backend**: Conexión con el backend para obtener datos de noticias y gestionar la autenticación
- **Suscripción por Correo Electrónico**: Página ComingSoon
- **Panel de Administración**:
  - Visualización de usuarios y sesiones
  - Gestión de roles de administrador
  - Envío de correos masivos a suscriptores

## 🛠️ Tecnologías

- **Framework**: React.js 18
- **Enrutamiento**: React Router DOM v7
- **Estilos**: Tailwind CSS 3
- **Peticiones HTTP**: Axios
- **Autenticación**: Google OAuth (integrado con backend)
- **Fuentes**: Inter (Google Fonts)
- **Metadatos**: Open Graph para compartir en redes sociales
- **Procesamiento CSS**: PostCSS con autoprefixer
- **Iconos**: Heroicons (`@heroicons/react`)
- **Visualización de Datos (Admin)**: Chart.js (`react-chartjs-2`)
- **Selección de Fechas (Admin)**: React Datepicker (`react-datepicker`)
- **Manejo de Fechas**: Date-fns
- **Partículas Animadas**: tsparticles (`@tsparticles/react`)

## 🔧 Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tibianity.git
   cd tibianity/frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura el backend (opcional):
   El frontend está diseñado para funcionar con el backend de Tibianity. Consulta la documentación del backend para su instalación.

## 🚀 Uso

### Modo Desarrollo (Recomendado con Docker)

Para la experiencia de desarrollo más fluida, especialmente trabajando con el backend, se recomienda usar el archivo `docker-compose.dev.yml` ubicado en la raíz del proyecto (`Tibianity/`). Este archivo está configurado para:

- Ejecutar el frontend con el servidor de desarrollo de React (`npm start`).
- Montar tu código fuente local directamente en el contenedor, permitiendo **hot-reloading** (recarga en caliente) instantánea al guardar cambios.
- Ejecutar el backend con `nodemon` para recarga automática.
- Configurar automáticamente las variables de entorno para la comunicación entre frontend y backend.

1.  **Desde la raíz del proyecto (`Tibianity/`):**
    ```bash
    # Construye las imágenes si es la primera vez o cambias dependencias
    docker-compose -f docker-compose.dev.yml build 

    # Inicia los servicios (frontend, backend, db)
    docker-compose -f docker-compose.dev.yml up
    ```
2.  Accede al frontend en tu navegador: [http://localhost:3000](http://localhost:3000)
3.  ¡Realiza cambios en el código frontend y observa la actualización automática!

### Modo Desarrollo (Solo Frontend Local)

Si prefieres ejecutar solo el servidor de desarrollo del frontend localmente (sin Docker para el frontend):

1.  Asegúrate de que el backend y la base de datos estén ejecutándose (puedes usar `docker-compose up backend mongo` desde la raíz del proyecto).
2.  Asegúrate de tener un archivo `.env` en la raíz de `tibianity-frontend/` con `REACT_APP_API_URL=http://localhost:5000` (o el puerto correcto del backend).
3.  Desde la carpeta `tibianity-frontend/`:
    ```bash
    npm start
    ```
    La aplicación se abrirá automáticamente en tu navegador en [http://localhost:3000](http://localhost:3000).

### Producción

Para crear una versión optimizada para producción:

```bash
npm run build
```
Esta versión se sirve mediante Nginx cuando ejecutas `docker-compose up` (usando `docker-compose.yml`).

## 🛠️ Scripts de Desarrollo

### Probar Conexión con Backend (`src/scripts/testBackend.mjs`)

Este script te permite verificar rápidamente si el servidor backend está en ejecución y accesible desde tu entorno local sin necesidad de iniciar la aplicación frontend completa.

**Funcionamiento:**
- Lee la variable de entorno `REACT_APP_API_URL` (definida en un archivo `.env` en la raíz del frontend, por ejemplo) para obtener la URL del backend. Si no está definida, utiliza `http://localhost:5000` por defecto.
- Envía una petición GET a la ruta raíz (`/`) del backend.
- Espera una respuesta exitosa (código 2xx) dentro de un timeout de 5 segundos.
- Muestra mensajes indicando si la conexión fue exitosa, si hubo un error HTTP, o si ocurrió un error de red (timeout, conexión rechazada, host no encontrado).

**Uso:**
Ejecuta el script desde la raíz del directorio `frontend` con Node.js:

```bash
node --experimental-json-modules src/scripts/testBackend.mjs
```

*(Nota: La flag `--experimental-json-modules` puede ser necesaria dependiendo de tu versión de Node.js)*

## 📁 Estructura del Proyecto

```
/frontend
  ├── /public               # Archivos públicos estáticos
  │   ├── /data             # Datos estáticos (noticias traducidas)
  │   ├── /images           # Imágenes y medios
  │   └── index.html        # Documento HTML principal
  │
  ├── /src                  # Código fuente de la aplicación
  │   ├── /components       # Componentes reutilizables
  │   │   ├── /Admin        # Componentes específicos del panel admin
  │   │   │   ├── SidePanelMenu.jsx
  │   │   │   └── EmailSubscribers.jsx
  │   │   ├── /ComingSoon   # Componentes de la página ComingSoon
  │   │   │   └── ComingSoon.jsx 
  │   │   ├── Navbar.jsx    # Barra de navegación principal
  │   │   ├── Hero.jsx      # Sección principal de la página de inicio
  │   │   ├── Services.jsx  # Sección de servicios
  │   │   ├── Lore.jsx      # Componente para el lore
  │   │   ├── Team.jsx      # Componente de equipo de creadores
  │   │   └── Footer.jsx    # Pie de página global
  │   │
  │   ├── /context          # Contextos de React (estado global)
  │   │   └── AuthContext.jsx # Contexto para la autenticación
  │   │
  │   ├── /pages            # Páginas principales y vistas
  │   │   ├── AdminDashboard.jsx
  │   │   ├── EmailSenderPage.jsx # Nueva página para enviar correos
  │   │   ├── News.jsx      # Página de noticias
  │   │   ├── Market.jsx    # Página del mercado virtual
  │   │   ├── LorePage.jsx  # Página de lore
  │   │   ├── TeamPage.jsx  # Página de equipo
  │   │   └── ... (otras páginas)
  │   │
  │   ├── /styles           # Estilos CSS adicionales
  │   ├── /config           # Archivos de configuración (constants.js)
  │   ├── /api              # Lógica de llamadas a API (chat.js)
  │   ├── /utils            # Funciones de utilidad
  │   ├── App.jsx           # Componente principal y rutas
  │   ├── index.js          # Punto de entrada de la aplicación
  │   └── index.css         # Estilos globales
  │
  ├── package.json          # Dependencias y scripts
  ├── tailwind.config.js    # Configuración de Tailwind CSS
  ├── postcss.config.js     # Configuración de PostCSS
  └── README.md             # Documentación
```

## 🧩 Componentes Principales

### App.jsx
- Componente raíz de la aplicación, renderizado por `index.js`.
- Configura el enrutador principal (`BrowserRouter`) y define las rutas (`<Routes>`, `<Route>`) para todas las páginas, incluyendo las rutas administrativas (`/admin`, `/admin/email`).
- Establece la estructura de diseño general, incluyendo componentes persistentes como `Navbar` y `Footer` que se muestran en todas las páginas.
- **Renderiza condicionalmente** la interfaz principal (con `Navbar`) o el componente `ComingSoon` basado en el estado de autenticación del usuario.
- **Protege las rutas administrativas** asegurando que solo se rendericen si el usuario autenticado es administrador (`isAdmin`).
- Envuelve toda la aplicación dentro del `AuthProvider` (`AuthContext.jsx`), asegurando que el estado de autenticación y las funciones relacionadas estén disponibles globalmente para todos los componentes hijos.
- Importa y utiliza los componentes de página (`News`, `Market`, etc.) para asociarlos a sus respectivas rutas.

### Navbar.jsx
- Barra de navegación responsive con logo animado y efectos neón
- Enlaces a todas las secciones principales con efectos hover
- Integración con AuthContext para mostrar el estado de autenticación
- Botones de Login/Logout con Google OAuth
- Implementación de componentes internos (Logo, LoginButton, NavLink)

### Hero.jsx
- Componente de hero con carrusel de imágenes automático
- Efectos visuales de neón y animaciones CSS
- Título principal con efectos de shimmer y gradientes

### AuthContext.jsx
- Proveedor de contexto para gestionar la autenticación
- Funciones para inicio y cierre de sesión
- Integración con el backend para verificar el estado de la sesión
- Almacenamiento de datos del usuario autenticado

### News.jsx
- Página para mostrar noticias oficiales de Tibia
- Carga de noticias desde archivo JSON local (news-es.json) con traducciones
- Fallback a API del backend si el archivo local no está disponible
- Visualización de noticias con categorías, fechas y contenido formateado
- Funcionalidad de expansión/colapso para noticias largas

### Footer.jsx
- Pie de página global que se muestra en todas las páginas
- Enlaces a redes sociales y otros recursos

### ComingSoon.jsx
- Página/Componente de marcador de posición mostrado mientras la aplicación principal está en desarrollo o para usuarios no autenticados.
- Integra `AuthContext` para mostrar diferentes mensajes y opciones (Login/Logout) dependiendo del estado de autenticación.
- Incluye el logo de Tibianity y enlaces a redes sociales.
- Muestra un formulario de suscripción por correo (actualmente sin funcionalidad de envío).
- Utiliza `@tsparticles/react` para un fondo animado de partículas personalizable.
- Presenta una ilustración decorativa y maneja la visualización de errores de autenticación.
- Diseño responsive adaptado a diferentes tamaños de pantalla con efectos visuales neón.
- **Formulario de Suscripción**: Incluye un formulario para que los usuarios ingresen su correo electrónico. Llama al endpoint `/api/subscribe` del backend para registrar la suscripción.
- Muestra feedback al usuario sobre el éxito o error de la suscripción.

### Admin Components (`src/components/Admin/`)
- **SidePanelMenu.jsx**: Menú lateral fijo para la navegación dentro del panel de administración. Usa `NavLink` y `@heroicons/react`.
- **EmailSubscribers.jsx**: Componente de formulario que permite a los administradores escribir un asunto y cuerpo (HTML) para un correo y enviarlo a todos los suscriptores registrados a través del endpoint `/api/admin/send-newsletter` del backend.

## 📄 Sistema de Páginas y Rutas Administrativas

- **Página de Inicio (/)**: Combina Hero, Services, Lore y Team
- **News (/news)**: Página de noticias con integración de backend/archivo local
- **Market (/market)**: Página para el mercado virtual
- **Lore (/lore)**: Página completa dedicada a la historia y lore
- **Team (/team)**: Página del equipo de creadores
- **Chat (/chat)**: Página de chat con LLM
- **Admin Dashboard (`/admin`)**: Página principal del panel de administración. Muestra métricas clave, filtros y tablas de usuarios/sesiones. Incluye el `SidePanelMenu`.
- **Enviar Correos (`/admin/email`)**: Página dedicada al envío de correos masivos. Contiene el `SidePanelMenu` y el componente `EmailSubscribers`.

## 🔑 Autenticación

El sistema de autenticación utiliza Google OAuth a través del backend:

- Implementado a través de AuthContext.jsx
- Integración con la API de backend (/auth/google)
- Persistencia de sesión mediante cookies
- Manejo de estado de autenticación (isAuthenticated, user)
- Componentes UI que responden al estado de autenticación

## 👑 Funcionalidades del Administrador

El panel de administración (`/admin` y sub-rutas) ofrece funcionalidades exclusivas para usuarios marcados como administradores:
- **Dashboard Principal (`/admin`)**: Visualización de métricas (total usuarios, sesiones), filtros por fecha y usuario, gráficos de sesiones y tabla de usuarios registrados.
- **Gestión de Roles**: Posibilidad de promover usuarios a administradores o degradar administradores existentes (excepto a sí mismo).
- **Envío de Correos (`/admin/email`)**: Interfaz para redactar y enviar correos masivos a todos los usuarios suscritos a través del formulario en `ComingSoon`. La funcionalidad de envío real depende de la configuración del backend con Resend.

## 🔌 Integración con Backend

El frontend se comunica con el backend para:

- Autenticación con Google OAuth
- **Registrar suscripciones** de correo (`POST /api/subscribe`)
- **Obtener datos administrativos** (usuarios, sesiones) (`GET /admin/users`, `GET /admin/sessions`)
- **Gestionar roles** de administrador (`PATCH /admin/users/:id/promote`, `PATCH /admin/users/:id/demote`)
- **Iniciar el envío de correos** a suscriptores (`POST /api/admin/send-newsletter`)
- Obtención de noticias oficiales cuando no están disponibles localmente
- Otras funcionalidades de API que puedan ser necesarias

### Configuración de la URL del Backend

La URL base del servidor backend se configura mediante una variable de entorno.

1.  **Desarrollo Local:**
    Si no se proporciona ninguna variable de entorno, el frontend podría intentar conectarse a una URL predeterminada (por ejemplo, `http://localhost:5000` si el backend corre en ese puerto). Comprueba el código fuente (especialmente donde se use `axios` o `fetch`) para ver la URL por defecto.

2.  **Producción (Docker):**
    Al ejecutar la aplicación en Docker, es **esencial** proporcionar la variable de entorno `REACT_APP_API_URL` con la URL completa del backend accesible desde el contenedor frontend.

    Por ejemplo, si tu backend está corriendo en `http://api.tuservidor.com`, deberías pasar la variable al contenedor Docker al ejecutarlo:

    ```bash
    docker run -p 3001:3001 -e REACT_APP_API_URL=http://api.tuservidor.com mi-frontend-app
    ```

    O si usas `docker-compose.yml`, definirla en la sección `environment` del servicio frontend.

    Asegúrate de que el código que realiza las llamadas a la API (probablemente usando `axios`) utilice esta variable de entorno:

    ```javascript
    // Ejemplo de uso en el código (ej. en un archivo de configuración de axios)
    import axios from 'axios';

    const apiClient = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000' // Fallback para desarrollo
    });

    export default apiClient;
    ```

### Archivo Central de Constantes (`src/config/constants.js`)

Este archivo centraliza las constantes de configuración usadas en la aplicación, principalmente las URLs de la API, para mejorar la mantenibilidad.

- **`API_URL`:**
    - Define la URL base para todas las llamadas al backend.
    - Se configura prioritariamente mediante la variable de entorno `REACT_APP_API_URL` (establecida durante el build).
    - Si la variable de entorno no está disponible, utiliza `'/api'` como fallback, útil para configuraciones con proxy inverso (Nginx) o el proxy de desarrollo.
- **`AUTH_API`:**
    - Objeto que agrupa las URLs completas para los endpoints de autenticación (Login, Logout, Perfil), construidas a partir de `API_URL`.
- **`ADMIN_API`:**
    - Objeto que agrupa las URLs completas para los endpoints de administración (Usuarios, Sesiones), construidas a partir de `API_URL`.

### Módulo de Chat con N8N (`src/api/chat.js`)

Este módulo maneja la comunicación con un servicio externo (probablemente un Large Language Model - LLM) a través de un webhook de N8N.

- **Función Principal:** Exporta `sendMessageToLLM(message, sessionId)`.
- **Lógica:**
    - Envía el mensaje del usuario (`message`) a la URL del webhook de N8N mediante una petición POST.
    - Formatea el payload esperado por N8N (con `chatInput`).
    - Incluye lógica para manejar respuestas (verificación de status, parseo de JSON, validación de estructura básica como `success` y `answer`).
    - Maneja errores de red y de la respuesta del servidor N8N.
- **Configuración:**
    - **URL del Webhook:** Utiliza una constante `N8N_WEBHOOK_URL`. Actualmente está **codificada directamente** en el archivo. La práctica recomendada (indicada con comentarios en el código) es configurarla mediante la variable de entorno `REACT_APP_N8N_WEBHOOK_URL` durante el build.
    - **Session ID y Autenticación:** El código tiene comentarios indicando dónde se podría añadir un `sessionId` para mantener el contexto de la conversación y cabeceras de `Authorization` si el webhook las requiriera (tareas pendientes de implementar).

## 📰 Sistema de Noticias

- Visualización de noticias oficiales de Tibia con traducción al español
- Carga prioritaria desde archivo local (/public/data/news-es.json)
- Fallback a la API del backend si el archivo local no está disponible
- Categorización de noticias por tipo (News, Community, Development, etc.)
- Formato avanzado de contenido HTML con estilos

## 🎨 Estilos y Diseño

### Paleta de Colores
- Definida en tailwind.config.js
- Colores neón principales:
  - Magenta: `#e100ff`
  - Cyan: `#00f7ff`
  - Fondo oscuro: `#050014` y `#080020`

### Características de Diseño
- Efectos neón con animaciones pulsantes
- Gradientes en botones y bordes
- Sombras personalizadas para elementos UI
- Animaciones en interacciones (hover, focus)
- Totalmente responsive para todas las pantallas

## 🚧 Estado y Próximos Pasos

### Estado Actual
- Sistema de rutas implementado (incluyendo rutas admin)
- Diseño visual y componentes principales creados
- Integración con backend para autenticación y noticias
- Funcionalidad de suscripción por correo implementada
- Panel de administración básico con visualización de datos y gestión de roles
- Funcionalidad de envío de correos a suscriptores implementada (vía Resend en backend)

### Próximos Desarrollos
- Implementación completa del mercado virtual
- Perfiles para creadores individuales
- Sistema de eventos y calendario
- Sección de lore con contenido completo
- Mejoras adicionales al panel de administración (ej. estadísticas más detalladas, paginación, búsqueda en tablas)

## 👥 Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request 