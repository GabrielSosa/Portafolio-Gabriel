// CV Generator - Manejo robusto de descarga de CV
class CVGenerator {
  constructor() {
    this.isGenerating = false;
    this.initButton();
    this.detectBrowserSupport();
  }

  detectBrowserSupport() {
    this.browserInfo = {
      isIE: navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1,
      isEdge: navigator.userAgent.indexOf('Edge/') !== -1,
      isFirefox: navigator.userAgent.indexOf('Firefox') !== -1,
      isChrome: navigator.userAgent.indexOf('Chrome') !== -1,
      isSafari: navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      supportsPopup: this.testPopupSupport(),
      supportsDownload: this.testDownloadSupport()
    };

    console.log('🔍 CV Generator - Detección de navegador:', this.browserInfo);
  }

  testPopupSupport() {
    try {
      const popup = window.open('', '_test', 'width=1,height=1');
      if (popup) {
        popup.close();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  testDownloadSupport() {
    const a = document.createElement('a');
    return typeof a.download !== 'undefined';
  }

  initButton() {
    const cvButton = document.getElementById('download-cv-btn');
    if (!cvButton) {
      console.warn('❌ Botón de CV no encontrado');
      return;
    }

    cvButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleCVDownload();
    });
  }

  async handleCVDownload() {
    if (this.isGenerating) {
      this.showNotification('⏳ Ya se está generando un PDF, por favor espera...', 'info');
      return;
    }

    try {
      this.isGenerating = true;
      await this.downloadCV();
    } catch (error) {
      console.error('Error en descarga de CV:', error);
      this.handleDownloadError(error);
    } finally {
      this.isGenerating = false;
    }
  }

  async downloadCV() {
    // Obtener el idioma actual
    const currentLang = localStorage.getItem('portfolio-lang') || 'en';
    
    // Verificar si tenemos librerías PDF disponibles localmente
    if (typeof window.jspdf !== 'undefined' && typeof window.html2canvas !== 'undefined') {
      // Generar PDF directamente en la página actual
      await this.generatePDFDirect(currentLang);
    } else {
      // Método tradicional - abrir CV en nueva pestaña
      this.openCVPage(currentLang);
    }
  }

  openCVPage(lang) {
    const cvUrl = `./cv.html?lang=${lang}`;
    
    if (this.browserInfo.supportsPopup) {
      try {
        const cvWindow = window.open(cvUrl, '_blank', 
          'width=1024,height=768,scrollbars=yes,resizable=yes,menubar=no,toolbar=no');
        
        if (!cvWindow) {
          throw new Error('Popup blocked');
        }

        this.showNotification('📄 CV abierto en nueva pestaña', 'info');
        
        // Verificar si la ventana se cerró rápidamente (posible bloqueo)
        setTimeout(() => {
          if (cvWindow.closed) {
            this.showNotification('⚠️ Si el CV no se abrió, permite ventanas emergentes y vuelve a intentar', 'info');
          }
        }, 500);
      } catch (error) {
        console.warn('Popup fallido, usando navegación directa:', error);
        window.location.href = cvUrl;
      }
    } else {
      // Fallback: navegación directa
      window.location.href = cvUrl;
    }
  }

  async generatePDFDirect(lang) {
    // Esta función sería para generar PDF directamente sin abrir nueva pestaña
    // Por ahora, usar el método tradicional
    this.openCVPage(lang);
  }

  handleDownloadError(error) {
    let message = 'Error al descargar el CV. ';
    
    if (this.browserInfo.isIE) {
      message += 'Internet Explorer no es compatible. Usa Edge, Chrome o Firefox.';
    } else if (this.browserInfo.isSafari && this.browserInfo.isMobile) {
      message += 'En Safari móvil, toca "Compartir" > "Descargar PDF" cuando se abra el CV.';
    } else if (!this.browserInfo.supportsPopup) {
      message += 'Tu navegador bloquea ventanas emergentes. Permítelas para este sitio.';
    } else {
      message += 'Intenta de nuevo o actualiza tu navegador.';
    }

    this.showNotification(message, 'error');
  }

  showNotification(message, type = 'info') {
    // Crear notificación si no existe el sistema global
    if (typeof window.showNotification === 'function') {
      window.showNotification(message, type);
      return;
    }

    // Sistema de notificación local
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6';
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${bgColor};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 500;
      z-index: 10000;
      max-width: 90%;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => {
          if (notification.parentNode) {
            document.body.removeChild(notification);
          }
        }, 300);
      }
    }, 4000);
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CVGenerator();
  });
} else {
  new CVGenerator();
}

// Exportar para uso global si es necesario
window.CVGenerator = CVGenerator;
