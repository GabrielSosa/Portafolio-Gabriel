// Language system
let currentLanguage = 'en';
let translations = {};

// Load translations
async function loadTranslations() {
    try {
        const enResponse = await fetch('./lang/en.json');
        const esResponse = await fetch('./lang/es.json');
        
        translations.en = await enResponse.json();
        translations.es = await esResponse.json();
        
        updateContent();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Get nested object value by path
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
}

// Update content based on current language
function updateContent() {
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(element => {
        const key = element.getAttribute('data-lang');
        const translation = getNestedValue(translations[currentLanguage], key);
        if (translation) {
            element.textContent = translation;
        }
    });
}

// Language switcher
function initLanguageSystem() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.id.replace('lang-', '');
            if (lang !== currentLanguage) {
                currentLanguage = lang;
                
                // Update active button
                langButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update content
                updateContent();
                
                // Save preference
                localStorage.setItem('preferred-language', lang);
            }
        });
    });
    
    // Load saved language preference
    const savedLang = localStorage.getItem('preferred-language');
    if (savedLang && savedLang !== currentLanguage) {
        document.getElementById(`lang-${savedLang}`).click();
    }
}

// Navigation system
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetSection = item.getAttribute('data-section');
            
            // Remove active class from all nav items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav item and target section
            item.classList.add('active');
            const section = document.getElementById(targetSection);
            if (section) {
                section.classList.add('active');
            }
        });
    });
}

// Animations and interactions
function initAnimations() {
    // Animate shapes
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        shape.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Social links hover effect
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Doing items animation
    const doingItems = document.querySelectorAll('.doing-item');
    doingItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 500 + index * 100);
    });
}

// Contact form handling
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            console.log('Form submitted:', data);
            alert(currentLanguage === 'es' ? 'Mensaje enviado exitosamente!' : 'Message sent successfully!');
            form.reset();
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadTranslations();
    initLanguageSystem();
    initNavigation();
    initAnimations();
    initContactForm();
});
