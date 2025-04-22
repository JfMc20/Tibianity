# Tibianity - Frontend

![Tibianity Logo](public/images/Logo%20(1).png)

Tibianity es una plataforma web para una comunidad de creadores de contenido enfocados en el juego Tibia. El sitio sirve como un hub central para mostrar streamers, youtubers y otros creadores patrocinados, así como para compartir noticias, lore del juego, eventos próximos y ofrecer un mercado virtual.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Componentes Principales](#componentes-principales)
- [Sistema de Páginas](#sistema-de-páginas)
- [Autenticación](#autenticación)
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

## 🛠️ Tecnologías

- **Framework**: React.js 18
- **Enrutamiento**: React Router DOM v7
- **Estilos**: Tailwind CSS 3
- **Peticiones HTTP**: Axios
- **Autenticación**: Google OAuth (integrado con backend)
- **Fuentes**: Inter (Google Fonts)
- **Metadatos**: Open Graph para compartir en redes sociales
- **Procesamiento CSS**: PostCSS con autoprefixer

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

Para iniciar la aplicación en modo desarrollo:

```bash
npm start
```

La aplicación se abrirá automáticamente en tu navegador en [http://localhost:3000](http://localhost:3000).

Para crear una versión optimizada para producción:

```bash
npm run build
```

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
  │   ├── /pages            # Páginas principales
  │   │   ├── News.jsx      # Página de noticias
  │   │   ├── Market.jsx    # Página del mercado virtual
  │   │   ├── LorePage.jsx  # Página de lore
  │   │   └── TeamPage.jsx  # Página de equipo
  │   │
  │   ├── /styles           # Estilos CSS adicionales
  │   │
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
- Componente raíz que configura React Router
- Encapsula la aplicación en el AuthProvider para gestión de autenticación
- Define todas las rutas principales de la aplicación
- Mantiene Navbar y Footer como elementos persistentes

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

## 📄 Sistema de Páginas

- **Página de Inicio (/)**: Combina Hero, Services, Lore y Team
- **News (/news)**: Página de noticias con integración de backend/archivo local
- **Market (/market)**: Página para el mercado virtual
- **Lore (/lore)**: Página completa dedicada a la historia y lore
- **Team (/team)**: Página del equipo de creadores

## 🔑 Autenticación

El sistema de autenticación utiliza Google OAuth a través del backend:

- Implementado a través de AuthContext.jsx
- Integración con la API de backend (/auth/google)
- Persistencia de sesión mediante cookies
- Manejo de estado de autenticación (isAuthenticated, user)
- Componentes UI que responden al estado de autenticación

## 🔌 Integración con Backend

El frontend se comunica con el backend para:

- Autenticación con Google OAuth
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
- Sistema de rutas implementado
- Diseño visual y componentes principales creados
- Integración con backend para autenticación
- Sistema de noticias funcional

### Próximos Desarrollos
- Implementación completa del mercado virtual
- Perfiles para creadores individuales
- Sistema de eventos y calendario
- Sección de lore con contenido completo
- Panel de administración

## 👥 Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request 