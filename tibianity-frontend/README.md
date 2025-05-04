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
- **Suscripción por Correo Electrónico**: Página ComingSoon con **formulario mejorado (Headless UI, validación, feedback visual)**.
- **Doble Opt-In**: Proceso de confirmación de suscripción vía email con páginas de feedback en el frontend.
- **Botón Flotante de WhatsApp**: Con efectos visuales y animaciones.
- **Panel de Administración**:
  - Visualización de usuarios y sesiones
  - Gestión de roles de administrador
  - Envío de correos masivos a suscriptores
  - **Limpieza de Suscriptores**: Funcionalidad para eliminar suscriptores pendientes o por email.

## 🛠️ Tecnologías

- **Framework**: React.js 18
- **Enrutamiento**: React Router DOM v6+ (v7 implícita)
- **Estilos**: Tailwind CSS 3 ([`tailwind.config.js`](mdc:tibianity-frontend/tailwind.config.js))
- **Peticiones HTTP**: Axios
- **Autenticación**: Google OAuth (integrado con backend vía [`AuthContext.jsx`](mdc:tibianity-frontend/src/context/AuthContext.jsx))
- **Fuentes**: Orbitron (para títulos/logo), Inter (resto) - [Ver Regla Tipografía](mdc:.cursor/rules/typography.mdc)
- **Metadatos**: Open Graph para compartir en redes sociales
- **Procesamiento CSS**: PostCSS con autoprefixer
- **Iconos**: Heroicons (`@heroicons/react`)
- **Visualización de Datos (Admin)**: Chart.js (`react-chartjs-2`)
- **Selección de Fechas (Admin)**: React Datepicker (`react-datepicker`)
- **Manejo de Fechas**: Date-fns
- **Componentes UI**: Headless UI (`@headlessui/react`) para algunos componentes (formularios, menús).

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
  │   │   ├── /common       # Componentes genéricos (SocialIcon, LoginGoogleButton, GradientButton, AnimatedBackgroundLines)
  │   │   ├── /LandingPage  # Componentes específicos de la Landing Page (Hero, Lore, Services, Team)
  │   │   ├── /Admin        # Componentes específicos del panel admin (SidePanelMenu, UserTable, SessionChart, MetricCard, FilterControls)
  │   │   ├── /ComingSoon   # Componentes específicos de la página ComingSoon (SubscriptionForm)
  │   │   ├── /common/Alerts # Componentes para mostrar feedback (ValidationAlert)
  │   │   ├── Navbar.jsx    # Barra de navegación principal (Usada en todos los layouts, integra toggle de admin)
  │   │   └── Footer.jsx    # Pie de página global
  │   │
  │   ├── /layouts          # Componentes de Layout (estructura de página)
  │   │   ├── AdminLayout.jsx   # Layout para Admin (con Navbar, Footer, SidePanelMenu responsive)
  │   │   ├── UserLayout.jsx    # Layout para Usuarios normales
  │   │   ├── GuestLayout.jsx   # Layout para Invitados
  │   │   └── PublicLayout.jsx  # Layout base para páginas públicas (futuro)
  │   │
  │   ├── /pages            # Páginas principales y vistas (contenedores de ruta)
  │   │   ├── LandingPage.jsx       # Página principal real (Hero, Services, etc.)
  │   │   ├── ComingSoonPage.jsx    # Página mostrada durante construcción/acceso restringido
  │   │   ├── EventsPage.jsx        # Página de eventos (accesible por Admin)
  │   │   ├── UserProfilePage.jsx   # Página de perfil de usuario
  │   │   ├── News.jsx              # Página de noticias
  │   │   ├── Market.jsx            # Página del mercado virtual
  │   │   ├── LorePage.jsx          # Página de lore
  │   │   ├── TeamPage.jsx          # Página de equipo
  │   │   ├── ChatPage.jsx          # Página de chat
  │   │   ├── SubscriptionConfirmationPage.jsx # Página para mostrar el resultado de la confirmación de suscripción
  │   │   └── /Admin                # Páginas del panel de admin (AdminDashboard, EmailSenderPage)
  │   │
  │   ├── /context          # Contextos de React (estado global)
  │   │   └── AuthContext.jsx # Contexto para la autenticación (devuelve user con isAdmin y canAccessPublicSite)
  │   │
  │   ├── /styles           # Estilos CSS globales (index.css)
  │   ├── /config           # Archivos de configuración (constants.js)
  │   ├── /api              # Lógica de llamadas a API (chat.js)
  │   ├── /utils            # Funciones de utilidad
  │   ├── App.jsx           # Componente principal y lógica de enrutamiento por roles/acceso
  │   ├── index.js          # Punto de entrada de la aplicación
  │   └── index.css         # Estilos globales (incluye animaciones, fuentes, grid background)
  │
  ├── package.json          # Dependencias y scripts
  ├── tailwind.config.js    # Configuración de Tailwind CSS (incluye fuente Orbitron)
  ├── postcss.config.js     # Configuración de PostCSS
  └── README.md             # Documentación
```

## 🧩 Componentes Principales

### App.jsx
- Componente raíz que renderiza el `AuthProvider` y el `Router`.
- Contiene `AppContent` que implementa la lógica principal de enrutamiento usando `<Routes>` y `<Route>`. 
- **Determina qué Layout (`AdminLayout`, `UserLayout`, `GuestLayout`) y qué página mostrar** basándose en el estado de autenticación, el rol (`isAdmin`) y el acceso (`canAccessPublicSite`) del `AuthContext`.
- Define las rutas anidadas específicas para cada rol/layout.

### Layouts (`src/layouts/`)
- **AdminLayout.jsx**: Define la estructura para las secciones de administración. Incluye `Navbar`, `Footer`, un `SidePanelMenu.jsx` (responsive: fijo en desktop, overlay en móvil) y un área de contenido (`<Outlet />`).
- **UserLayout.jsx**: Estructura para usuarios normales autenticados. Incluye `Navbar`, `Footer` y un `<Outlet />`.
- **GuestLayout.jsx**: Estructura para usuarios no autenticados (invitados). Incluye `Navbar`, `Footer` y un `<Outlet />`.
- **PublicLayout.jsx**: Layout genérico con `Navbar` y `Footer`, pensado para futuras páginas públicas.

### Navbar.jsx
- Barra de navegación superior responsive, utilizada por todos los layouts.
- Muestra el logo (fuente Orbitron), enlaces principales y botones de Login/Register.
- **Integra el botón para mostrar/ocultar el `SidePanelMenu`** cuando se usa dentro del `AdminLayout`.
- Usa `[LoginGoogleButton.jsx](mdc:tibianity-frontend/src/components/common/LoginGoogleButton.jsx)`.

### Footer.jsx
- Pie de página global con enlaces y información de contacto.
- Usa el componente reutilizable `[SocialIcon.jsx](mdc:tibianity-frontend/src/components/common/SocialIcon.jsx)`.

### LandingPage.jsx (`src/pages/`)
- Página principal del sitio que ensambla las secciones de contenido.
- **Visible por administradores y usuarios con acceso público (`canAccessPublicSite`)** en la ruta raíz (`/`).

### ComingSoonPage.jsx (`src/pages/`)
- Página que se muestra a **usuarios normales sin acceso público** en la ruta raíz (`/`) y en rutas no permitidas.
- También se muestra a **invitados** en todas las rutas.
- Contiene el formulario de suscripción. 
- Usa `[ComingSoon.jsx](mdc:tibianity-frontend/src/components/ComingSoon/ComingSoon.jsx)` para la UI, la cual ahora incluye un **fondo animado con líneas y cuadrícula**.

### Componentes Comunes (`src/components/common/`)
- **SocialIcon.jsx**: Icono de red social reutilizable.
- **LoginGoogleButton.jsx**: Botón estándar "Login con Google", ahora usa `GradientButton`.
- **GradientButton.jsx**: Botón reutilizable con borde gradiente y efecto de clic.
- **AnimatedBackgroundLines.jsx**: Componente para generar el fondo animado con líneas.
- **ValidationAlert.jsx** (`src/components/common/Alerts/`): Componente reutilizable para mostrar mensajes de éxito, error, etc., con accesibilidad (`aria-live`).

### Admin Components (`src/components/Admin/`)
- **SidePanelMenu.jsx**: Menú lateral usado en `AdminLayout`.
- **UserTable.jsx**: Muestra la tabla de usuarios con columnas para Rol y **Acceso Público**. Las acciones (Promover/Degradar, Permitir/Denegar Acceso) están ahora en un **menú desplegable** por usuario.
- Otros componentes del panel: `SessionChart`, `MetricCard`, `FilterControls`, etc.

## 📄 Sistema de Páginas y Rutas (Lógica en `App.jsx`)

La aplicación implementa un sistema de enrutamiento basado en roles y acceso:

- **Administrador (Logueado, `isAdmin=true`):**
  - Ve la `LandingPage` real en `/`.
  - Accede a todas las páginas públicas (`/news`, `/market`, `/lore`, `/team`, `/events`, `/chat`).
  - Accede a su perfil (`/profile`).
  - Accede al panel de administración en `/admin`.
  - Rutas no definidas muestran `NotFound`.
- **Usuario Normal (Logueado, `isAdmin=false`):**
  - **Si `canAccessPublicSite=true`:** Ve la `LandingPage` en `/` y puede acceder a todas las páginas públicas y a su perfil.
  - **Si `canAccessPublicSite=false`:** Ve `ComingSoonPage` en `/`, solo puede acceder a `/profile`, y es redirigido a `/` para otras rutas.
- **Invitado (No logueado):**
  - Ve `ComingSoonPage` en `/` y en cualquier otra ruta (excepto las legales).

## 🔑 Autenticación

- Implementado a través de [`AuthContext.jsx`](mdc:tibianity-frontend/src/context/AuthContext.jsx).
- Integración con la API de backend (`/auth/google`, `/auth/profile`, `/auth/logout`).
- El contexto ahora provee `user.canAccessPublicSite` además de `isAdmin`.
- **Flujo de Redirección (`AuthCallbackHandler.jsx`):** Después del login, redirige a `/admin` (si admin), a `/` (si usuario normal con acceso público) o a `/profile` (si usuario normal sin acceso público).

## 👑 Funcionalidades del Administrador

El panel de administración (`/admin` y sub-rutas) ofrece:
- **Dashboard Principal (`/admin/dashboard`)**: Visualización de métricas, filtros, gráficos y tabla de usuarios.
- **Gestión de Roles**: Promover/Degradar administradores.
- **Gestión de Acceso Público**: Permitir/Denegar a usuarios normales el acceso a las páginas públicas.
- **Envío de Correos (`/admin/email`)**: Interfaz para enviar correos a suscriptores.

## 🔌 Integración con Backend

El frontend se comunica con el backend para:

- Autenticación con Google OAuth
- **Registrar suscripciones** de correo (`POST /api/subscribe`)
- **Obtener datos administrativos** (usuarios, sesiones) (`GET /admin/users`, `GET /admin/sessions`)
- **Gestionar roles** de administrador (`PATCH /admin/users/:id/promote`, `PATCH /admin/users/:id/demote`)
- **Gestionar acceso público** (`PATCH /admin/users/:id/grant-access`, `PATCH /admin/users/:id/revoke-access`)
- **Iniciar el envío de correos** a suscriptores (`POST /admin/send-newsletter`)
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
- **Fondo animado con líneas y efecto de luz** en `ComingSoonPage`.
- **Fondo con cuadrícula sutil** en `ComingSoonPage`.
- **Tipografía Orbitron** para títulos y logo.
- Totalmente responsive para todas las pantallas

## 🚧 Estado y Próximos Pasos

### Estado Actual
- [x] Sistema de rutas refactorizado y basado en roles/acceso.
- [x] Lógica de acceso a páginas restringida según el rol/acceso.
- [x] Diseño visual y componentes principales creados.
- [x] Integración con backend para autenticación, noticias, gestión de usuarios.
- [x] Funcionalidad de suscripción por correo implementada.
- [x] Panel de administración con visualización de datos, gestión de roles y **gestión de acceso público**.
- [x] Funcionalidad de envío de correos a suscriptores implementada.
- [x] Estructura de componentes refactorizada (`common`, `LandingPage`, `Admin`).
- [x] UI de AdminLayout y Navbar ajustada (sidebar responsive, toggle integrado, footer, etc).
- [x] Mejoras visuales (tipografía Orbitron, fondo animado y grid en ComingSoon).
- [x] Añadida página de Eventos (accesible por Admin).

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