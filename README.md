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

## 📁 Estructura del Proyecto

```
.
├── Dockerfile
├── index.html
├── cv.html
├── README.md
├── assets/
│   ├── favicon.svg
│   ├── icons/
│   └── images/
├── lang/
│   ├── en.json
│   └── es.json
├── scripts/
│   ├── anti-spam.js
│   ├── contact-form.js
│   ├── emailjs-setup.js
│   ├── i18n-simple.js
│   └── main.js
└── styles/
    └── main.css
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
