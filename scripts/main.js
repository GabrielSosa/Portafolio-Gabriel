// Modern Portfolio App
class ModernPortfolio {
  constructor() {
    this.currentLang = localStorage.getItem('portfolio-lang') || 'es';
    this.currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
    this.translations = new Map();
    this.isLoading = true;
    
    this.init();
  }

  async init() {
    try {
      console.log('🚀 Initializing Modern Portfolio...');
      
      // Inicializar componentes principales
      this.initTheme();
      await this.loadTranslations();
      this.initNavigation();
      this.initScrollEffects();
      this.initContactForm();
      this.initAnimations();
      
      // Simular carga y mostrar contenido
      setTimeout(() => this.hideLoading(), 1500);
      
      console.log('✅ Portfolio initialized successfully!');
    } catch (error) {
      console.error('❌ Error initializing portfolio:', error);
      this.hideLoading();
    }
  }

  // Gestión de carga
  hideLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    
    if (loadingScreen && app) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        app.style.display = 'block';
        app.style.opacity = '0';
        
        requestAnimationFrame(() => {
          app.style.transition = 'opacity 0.5s ease';
          app.style.opacity = '1';
        });
      }, 300);
    }
  }

  // Gestión de tema
  initTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      this.updateThemeIcon(themeToggle);
      
      themeToggle.addEventListener('click', () => {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('portfolio-theme', this.currentTheme);
        this.updateThemeIcon(themeToggle);
      });
    }
  }

  updateThemeIcon(toggle) {
    const icon = toggle.querySelector('i');
    if (icon) {
      icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  // Sistema de traducciones
  async loadTranslations() {
    try {
      const translations = {
        es: {
          nav: {
            home: 'Inicio',
            about: 'Sobre Mí',
            experience: 'Experiencia',
            projects: 'Proyectos',
            contact: 'Contacto'
          },
          hero: {
            greeting: 'Hola, soy',
            title: 'DevOps Engineer & Cloud Specialist',
            description: 'Especialista en infraestructura en la nube, automatización y DevOps con experiencia en AWS, Azure, Kubernetes y tecnologías de contenedores.',
            cta1: 'Contáctame',
            cta2: 'Ver Proyectos',
            status: 'Disponible para trabajar'
          },
          about: {
            title: 'Sobre Mí',
            intro: 'Soy un DevOps Engineer apasionado por la automatización y la infraestructura en la nube, ubicado en Tegucigalpa, Honduras.',
            description: 'Con experiencia en diseño, implementación y gestión de infraestructuras escalables en AWS y Azure, especializado en contenedores, orquestación con Kubernetes y prácticas de CI/CD.',
            stats: {
              experience: 'Años de Experiencia',
              projects: 'Proyectos Completados',
              certifications: 'Certificaciones Cloud'
            }
          },
          contact: {
            title: '¡Conectemos!',
            location: 'Ubicación',
            phone: 'Teléfono',
            email: 'Email',
            form: {
              name: 'Nombre',
              email: 'Email',
              message: 'Mensaje',
              send: 'Enviar Mensaje'
            }
          }
        },
        en: {
          nav: {
            home: 'Home',
            about: 'About',
            experience: 'Experience',
            projects: 'Projects',
            contact: 'Contact'
          },
          hero: {
            greeting: 'Hi, I am',
            title: 'DevOps Engineer & Cloud Specialist',
            description: 'Cloud infrastructure specialist, automation and DevOps expert with experience in AWS, Azure, Kubernetes and container technologies.',
            cta1: 'Contact Me',
            cta2: 'View Projects',
            status: 'Available for work'
          },
          about: {
            title: 'About Me',
            intro: 'I am a DevOps Engineer passionate about automation and cloud infrastructure, located in Tegucigalpa, Honduras.',
            description: 'With experience in designing, implementing and managing scalable infrastructures on AWS and Azure, specialized in containers, Kubernetes orchestration and CI/CD practices.',
            stats: {
              experience: 'Years of Experience',
              projects: 'Completed Projects',
              certifications: 'Cloud Certifications'
            }
          },
          contact: {
            title: 'Let\'s Connect!',
            location: 'Location',
            phone: 'Phone',
            email: 'Email',
            form: {
              name: 'Name',
              email: 'Email',
              message: 'Message',
              send: 'Send Message'
            }
          }
        }
      };

      this.translations.set('es', translations.es);
      this.translations.set('en', translations.en);

      this.initLanguageToggle();
      this.updateContent();

    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }

  initLanguageToggle() {
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      langToggle.textContent = this.currentLang.toUpperCase();
      
      langToggle.addEventListener('click', () => {
        this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
        localStorage.setItem('portfolio-lang', this.currentLang);
        langToggle.textContent = this.currentLang.toUpperCase();
        this.updateContent();
      });
    }
  }

  updateContent() {
    const currentTranslations = this.translations.get(this.currentLang);
    if (!currentTranslations) return;

    // Actualizar elementos con data-lang
    document.querySelectorAll('[data-lang]').forEach(element => {
      const key = element.getAttribute('data-lang');
      const value = this.getNestedValue(currentTranslations, key);
      if (value) {
        element.textContent = value;
      }
    });
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
  }

  // Navegación
  initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Click en enlaces de navegación
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Actualizar enlace activo
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    });

    // Activar enlace según scroll
    window.addEventListener('scroll', () => {
      let currentSection = '';
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          currentSection = section.id;
        }
      });

      if (currentSection) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Efectos de scroll
  initScrollEffects() {
    // Parallax en hero
    const hero = document.querySelector('.hero');
    if (hero) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
      });
    }

    // Animaciones de entrada
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observar elementos animables
    document.querySelectorAll('.project-card, .timeline-item, .skill-category, .stat').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  // Formulario de contacto
  initContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
          // Mostrar estado de carga
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
          submitBtn.disabled = true;

          // Simular envío (aquí integrarías con tu backend)
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Mostrar éxito
          submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!';
          submitBtn.style.background = '#10b981';

          // Reset form
          form.reset();

          // Mostrar notificación
          this.showNotification('¡Mensaje enviado con éxito!', 'success');

        } catch (error) {
          console.error('Error sending form:', error);
          submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
          submitBtn.style.background = '#ef4444';
          this.showNotification('Error al enviar el mensaje', 'error');
        }

        // Restaurar botón
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 3000);
      });
    }
  }

  // Notificaciones
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    `;

    // Estilos
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: type === 'success' ? '#10b981' : '#ef4444',
      color: 'white',
      padding: '1rem 1.5rem',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      zIndex: '10000',
      animation: 'slideInRight 0.3s ease'
    });

    document.body.appendChild(notification);

    // Auto-eliminar
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  // Animaciones especiales
  initAnimations() {
    // Typing effect en el nombre
    const nameElement = document.querySelector('.highlight');
    if (nameElement) {
      const text = 'Gabriel Sosa';
      let i = 0;
      nameElement.textContent = '';
      
      const typeWriter = () => {
        if (i < text.length) {
          nameElement.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 100);
        }
      };
      
      setTimeout(typeWriter, 1000);
    }

    // Contador animado para stats
    this.initCounters();

    // Particles en background
    this.initParticles();
  }

  initCounters() {
    const counters = document.querySelectorAll('.stat h3');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.textContent);
          let current = 0;
          const increment = target / 60;
          
          const updateCounter = () => {
            if (current < target) {
              current += increment;
              counter.textContent = Math.ceil(current) + '+';
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target + '+';
            }
          };
          
          updateCounter();
          counterObserver.unobserve(counter);
        }
      });
    });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      opacity: 0.3;
    `;
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 50;

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 2 + 1
      });
    }

    // Animate particles
    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#3b82f6';

      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animateParticles);
    };

    animateParticles();
  }

  // Utilidades
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
}

// Estilos adicionales para notificaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(notificationStyles);

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ModernPortfolio());
} else {
  new ModernPortfolio();
}
