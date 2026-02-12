# Portafolio Moderno de Gabriel Sosa

## 🚀 Descripción

Portfolio personal moderno y responsive para Gabriel Sosa, DevOps Engineer & Cloud Specialist. Desarrollado con tecnologías web nativas y optimizado para despliegue con Docker.

## ✨ Características

- **Diseño Moderno**: Interfaz limpia y profesional.
- **Totalmente Responsive**: Optimizado para todos los dispositivos.
- **Tema Oscuro/Claro**: Alternancia de temas persistente.
- **Multi-idioma**: Soporte para Español e Inglés (i18n).
- **Generación de CV en PDF**: Descarga el CV directamente desde la web.
- **Animaciones Suaves**: Transiciones y efectos visuales para una mejor experiencia.
- **Optimizado**: Carga rápida y excelente rendimiento.
- **SEO Friendly**: Estructura semántica y meta-tags optimizados.
- **Soporte para Docker**: Contenerizado con Nginx para un despliegue fácil.

## 🛠️ Tecnologías

- **HTML5**: Estructura semántica.
- **CSS3**: Estilos modernos con Variables CSS, Grid y Flexbox.
- **JavaScript (ES6+)**: Funcionalidad moderna sin frameworks.
- **Docker & Nginx**: Para la contenerización y el despliegue.
- **Font Awesome**: Iconografía.
- **Google Fonts**: Tipografía (Inter).

# 🌟 Portafolio Profesional de Gabriel Sosa

## 🚀 Descripción

Portfolio personal moderno y responsive para Gabriel Sosa, DevOps Engineer & Cloud Specialist. Desarrollado con tecnologías web nativas, optimizado para despliegue con Docker y con soporte completo para múltiples navegadores.

## ✨ Características

- **🎨 Diseño Moderno**: Interfaz limpia y profesional con animaciones suaves
- **📱 Totalmente Responsive**: Optimizado para todos los dispositivos
- **🌙 Tema Oscuro/Claro**: Alternancia de temas persistente
- **🌐 Multi-idioma**: Soporte completo para Español e Inglés (i18n)
- **📄 Generación de CV en PDF**: Descarga avanzada con separación silábica inteligente
- **⚡ Alto Rendimiento**: Carga rápida y optimización completa
- **🔒 SEO & Seguridad**: Headers de seguridad y estructura semántica
- **🐳 Docker Ready**: Contenerización con Nginx para despliegue en cualquier entorno

## �️ Stack Tecnológico

- **Frontend**: HTML5, CSS3 (Grid, Flexbox, Custom Properties), JavaScript ES6+
- **Librerías**: jsPDF, html2canvas, EmailJS, Font Awesome
- **Containerización**: Docker + Nginx Alpine
- **Fonts**: Inter (Google Fonts)
- **Icons**: Font Awesome 6.4.0

## �📁 Estructura del Proyecto

```
📂 portafolio-gabriel/
├── 🐳 Dockerfile                 # Configuración Docker optimizada
├── ⚙️  nginx.conf                # Configuración Nginx personalizada
├── 🏠 index.html                 # Página principal del portafolio
├── 📄 cv.html                    # CV interactivo con generación PDF
├── 📋 README.md                  # Documentación del proyecto
│
├── 📁 assets/                    # Recursos multimedia
│   ├── favicon.svg
│   ├── icons/
│   └── images/
│       ├── gabo.png              # Foto de perfil
│       ├── profile.svg           # Avatar alternativo
│       └── project*.svg/png      # Imágenes de proyectos
│
├── 🌐 lang/                      # Sistema de internacionalización
│   ├── en.json                   # Traducciones en inglés
│   └── es.json                   # Traducciones en español
│
├── 📜 scripts/                   # JavaScript modular
│   ├── anti-spam.js              # Protección anti-spam
│   ├── contact-form.js           # Formulario de contacto
│   ├── cv-generator.js           # Generación de CV mejorada
│   ├── emailjs-setup.js          # Configuración EmailJS
│   ├── i18n-simple.js            # Sistema de internacionalización
│   └── main.js                   # Funcionalidad principal
│
└── 🎨 styles/                    # Estilos CSS
    ├── main.css                  # Estilos principales
    └── certifications-fallback.css  # CSS de respaldo para certificaciones
```

## 🚀 Instalación y Uso

### Desarrollo Local

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/GabrielSosa/Portafolio-Gabriel.git
    cd Portafolio-Gabriel
    ```

2.  **Abrir `index.html` en tu navegador:**
    Puedes abrir el archivo `index.html` directamente en tu navegador o usar un servidor local simple.

    *   **Opción con Live Server (VS Code):**
        Haz clic derecho en `index.html` y selecciona "Open with Live Server".

    *   **Opción con Python:**
        ```bash
        python -m http.server 8000
        ```
        Luego, abre `http://localhost:8000` en tu navegador.

### Despliegue con Docker

1.  **Construir la imagen de Docker:**
    Desde la raíz del proyecto, ejecuta:
    ```bash
    docker build -t gabriel-portfolio .
    ```

2.  **Ejecutar el contenedor:**
    ```bash
    docker run -d -p 8080:80 --name portfolio-web gabriel-portfolio
    ```
    El portafolio estará disponible en `http://localhost:8080`.

## � Licencia

Este proyecto está bajo la Licencia MIT.
