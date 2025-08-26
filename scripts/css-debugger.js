// Diagnóstico CSS - Verificar si los estilos se cargan correctamente
class CSSDebugger {
  constructor() {
    this.init();
  }

  init() {
    // Ejecutar diagnóstico después de que todo se cargue
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.runDiagnostics();
      }, 1000);
    });
  }

  runDiagnostics() {
    console.log('🔍 Iniciando diagnóstico CSS...');
    
    const results = {
      cssFiles: this.checkCSSFiles(),
      certificationStyles: this.checkCertificationStyles(),
      customProperties: this.checkCustomProperties(),
      gridSupport: this.checkGridSupport()
    };

    this.displayResults(results);
    this.fixIssues(results);
  }

  checkCSSFiles() {
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    const results = [];

    cssLinks.forEach((link, index) => {
      const href = link.href;
      const loaded = !link.sheet || link.sheet.cssRules.length > 0;
      
      results.push({
        file: href.split('/').pop(),
        url: href,
        loaded: loaded,
        rules: link.sheet ? link.sheet.cssRules.length : 0
      });
    });

    return results;
  }

  checkCertificationStyles() {
    const certSection = document.querySelector('.certifications');
    const certGrid = document.querySelector('.certifications-grid');
    const certCards = document.querySelectorAll('.certification-card');

    if (!certSection) return { error: 'Sección de certificaciones no encontrada' };

    const sectionStyles = window.getComputedStyle(certSection);
    const gridStyles = certGrid ? window.getComputedStyle(certGrid) : null;
    
    return {
      section: {
        background: sectionStyles.backgroundColor,
        padding: sectionStyles.padding,
        display: sectionStyles.display
      },
      grid: gridStyles ? {
        display: gridStyles.display,
        gridTemplateColumns: gridStyles.gridTemplateColumns,
        gap: gridStyles.gap
      } : null,
      cardsCount: certCards.length,
      firstCardStyles: certCards.length > 0 ? {
        background: window.getComputedStyle(certCards[0]).backgroundColor,
        borderRadius: window.getComputedStyle(certCards[0]).borderRadius,
        padding: window.getComputedStyle(certCards[0]).padding
      } : null
    };
  }

  checkCustomProperties() {
    const testElement = document.createElement('div');
    testElement.style.color = 'var(--primary, #ff0000)';
    document.body.appendChild(testElement);
    
    const computed = window.getComputedStyle(testElement);
    const supportsVars = computed.color !== 'rgb(255, 0, 0)';
    
    document.body.removeChild(testElement);
    
    return {
      supported: supportsVars,
      primaryColor: supportsVars ? getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() : null
    };
  }

  checkGridSupport() {
    const testElement = document.createElement('div');
    testElement.style.display = 'grid';
    document.body.appendChild(testElement);
    
    const computed = window.getComputedStyle(testElement);
    const supportsGrid = computed.display === 'grid';
    
    document.body.removeChild(testElement);
    
    return {
      supported: supportsGrid,
      fallbackActive: !supportsGrid
    };
  }

  displayResults(results) {
    console.group('📊 Resultados del diagnóstico CSS');
    
    console.log('📂 Archivos CSS:', results.cssFiles);
    console.log('🎨 Estilos de certificaciones:', results.certificationStyles);
    console.log('🎯 Variables CSS:', results.customProperties);
    console.log('📐 Soporte de Grid:', results.gridSupport);
    
    console.groupEnd();

    // Mostrar problemas críticos
    const issues = this.identifyIssues(results);
    if (issues.length > 0) {
      console.warn('⚠️ Problemas identificados:', issues);
      
      // Mostrar en UI si es necesario
      this.showUserNotification(issues);
    }
  }

  identifyIssues(results) {
    const issues = [];

    // Verificar archivos CSS
    results.cssFiles.forEach(file => {
      if (!file.loaded) {
        issues.push(`CSS no cargado: ${file.file}`);
      }
    });

    // Verificar estilos de certificaciones
    if (results.certificationStyles.error) {
      issues.push(results.certificationStyles.error);
    } else {
      const { section, grid, cardsCount } = results.certificationStyles;
      
      if (section.background === 'rgba(0, 0, 0, 0)' || section.background === 'transparent') {
        issues.push('Background de certificaciones no aplicado');
      }
      
      if (!grid || grid.display !== 'grid') {
        issues.push('CSS Grid no aplicado a certificaciones');
      }
      
      if (cardsCount === 0) {
        issues.push('No se encontraron tarjetas de certificación');
      }
    }

    // Verificar variables CSS
    if (!results.customProperties.supported) {
      issues.push('Variables CSS no soportadas - usando fallbacks');
    }

    // Verificar Grid
    if (!results.gridSupport.supported) {
      issues.push('CSS Grid no soportado - usando fallback');
    }

    return issues;
  }

  fixIssues(results) {
    const issues = this.identifyIssues(results);
    
    if (issues.length > 0) {
      console.log('🔧 Aplicando correcciones automáticas...');
      
      // Forzar estilos inline si es necesario
      this.applyFallbackStyles();
    }
  }

  applyFallbackStyles() {
    const certSection = document.querySelector('.certifications');
    const certGrid = document.querySelector('.certifications-grid');
    const certCards = document.querySelectorAll('.certification-card');

    if (certSection) {
      const currentBg = window.getComputedStyle(certSection).backgroundColor;
      if (currentBg === 'rgba(0, 0, 0, 0)' || currentBg === 'transparent') {
        console.log('🎨 Aplicando background fallback a certificaciones');
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        certSection.style.backgroundColor = isDark ? '#1e293b' : '#f8fafc';
        certSection.style.padding = '3rem 0';
      }
    }

    if (certGrid) {
      const currentDisplay = window.getComputedStyle(certGrid).display;
      if (currentDisplay !== 'grid') {
        console.log('📐 Aplicando Grid fallback a certificaciones');
        certGrid.style.display = 'grid';
        certGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
        certGrid.style.gap = '1.5rem';
        certGrid.style.marginTop = '2rem';
      }
    }

    certCards.forEach((card, index) => {
      const currentBg = window.getComputedStyle(card).backgroundColor;
      if (currentBg === 'rgba(0, 0, 0, 0)' || currentBg === 'transparent') {
        console.log(`🎴 Aplicando estilos fallback a tarjeta ${index + 1}`);
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        card.style.backgroundColor = isDark ? '#334155' : '#ffffff';
        card.style.borderRadius = '0.75rem';
        card.style.padding = '1.5rem';
        card.style.border = isDark ? '1px solid #475569' : '1px solid #e2e8f0';
        card.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      }
    });
  }

  showUserNotification(issues) {
    // Solo mostrar si hay problemas críticos de visualización
    const criticalIssues = issues.filter(issue => 
      issue.includes('Background') || 
      issue.includes('Grid') || 
      issue.includes('CSS no cargado')
    );

    if (criticalIssues.length > 0) {
      console.warn('🚨 Problemas críticos de CSS detectados. Aplicando correcciones...');
      // La corrección se aplica automáticamente
    }
  }
}

// Inicializar diagnóstico solo en desarrollo o si hay problemas
if (window.location.hostname === 'localhost' || window.location.search.includes('debug=css')) {
  new CSSDebugger();
} else {
  // En producción, solo verificar problemas críticos
  window.addEventListener('load', () => {
    setTimeout(() => {
      const certSection = document.querySelector('.certifications');
      if (certSection) {
        const styles = window.getComputedStyle(certSection);
        if (styles.backgroundColor === 'rgba(0, 0, 0, 0)' || styles.backgroundColor === 'transparent') {
          console.warn('⚠️ Problema de CSS detectado en producción, aplicando corrección');
          new CSSDebugger();
        }
      }
    }, 2000);
  });
}
