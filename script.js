class PortfolioApp {
    constructor() {
        this.currentLanguage = localStorage.getItem('preferred-language') || 'en';
        this.translations = new Map();
        this.init();
    }

    async init() {
        try {
            await this.loadTranslations();
            this.createLanguageSelector();
            this.initNavigation();
            this.initAnimations();
            this.initNameAnimation();
            this.updateContent();
            console.log('✅ Portfolio app initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
        }
    }

    async loadTranslations() {
        try {
            const [enResponse, esResponse] = await Promise.all([
                fetch('./lang/en.json'),
                fetch('./lang/es.json')
            ]);

            if (!enResponse.ok || !esResponse.ok) {
                throw new Error('Failed to load translation files');
            }

            const [enData, esData] = await Promise.all([
                enResponse.json(),
                esResponse.json()
            ]);

            this.translations.set('en', enData);
            this.translations.set('es', esData);

            console.log('🌐 Translations loaded:', [...this.translations.keys()]);
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback translations
            this.translations.set('en', { 
                profile: { name: "Gabriel Sosa", title: "DevOps | SRE | Cloud Engineer" } 
            });
            this.translations.set('es', { 
                profile: { name: "Gabriel Sosa", title: "DevOps | SRE | Ingeniero en la Nube" } 
            });
        }
    }

    createLanguageSelector() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) {
            console.warn('Sidebar not found');
            return;
        }

        // Remove existing selector
        sidebar.querySelector('.sidebar-language-selector')?.remove();

        const langSelector = document.createElement('div');
        langSelector.className = 'sidebar-language-selector';

        const languages = [
            { code: 'en', label: 'EN' },
            { code: 'es', label: 'ES' }
        ];

        const buttonFragment = document.createDocumentFragment();
        
        languages.forEach(({ code, label }) => {
            const button = Object.assign(document.createElement('button'), {
                className: `lang-btn ${code === this.currentLanguage ? 'active' : ''}`,
                textContent: label,
                type: 'button'
            });
            
            button.addEventListener('click', () => this.switchLanguage(code), { passive: true });
            buttonFragment.appendChild(button);
        });

        langSelector.appendChild(buttonFragment);
        sidebar.appendChild(langSelector);
        
        console.log('🔤 Language selector created');
    }

    switchLanguage(langCode) {
        if (langCode === this.currentLanguage) return;

        this.currentLanguage = langCode;
        localStorage.setItem('preferred-language', langCode);

        // Update button states using modern methods
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent === langCode.toUpperCase());
        });

        this.updateContent();
        console.log(`🔄 Language switched to: ${langCode}`);
    }

    updateContent() {
        const elements = document.querySelectorAll('[data-lang]');
        const currentTranslations = this.translations.get(this.currentLanguage);
        
        if (!currentTranslations) {
            console.error(`No translations found for language: ${this.currentLanguage}`);
            return;
        }

        console.log(`📝 Updating ${elements.length} elements for language: ${this.currentLanguage}`);

        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
            let nameElement = null;
            
            elements.forEach(element => {
                const key = element.dataset.lang;
                const translation = this.getNestedValue(currentTranslations, key);
                
                if (translation) {
                    element.textContent = translation;
                    
                    // Check if this is the name element
                    if (key === 'profile.name' && element.tagName === 'H1') {
                        nameElement = element;
                    }
                } else {
                    console.warn(`⚠️ Translation missing for key: ${key}`);
                }
            });

            // Trigger name animation if name was updated
            if (nameElement && nameElement.textContent) {
                setTimeout(() => this.startTextRevealEffect(nameElement), 100);
            }
        });
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj) ?? null;
    }

    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item[data-section]');
        const sections = document.querySelectorAll('.section');

        if (navItems.length === 0) {
            console.warn('No navigation items found');
            return;
        }

        // Use event delegation for better performance
        document.querySelector('.navigation')?.addEventListener('click', (e) => {
            const navItem = e.target.closest('.nav-item[data-section]');
            if (!navItem) return;

            e.preventDefault();
            
            const targetSection = navItem.dataset.section;
            
            // Update navigation state efficiently
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Activate current navigation and section
            navItem.classList.add('active');
            const targetElement = document.getElementById(targetSection);
            
            if (targetElement) {
                targetElement.classList.add('active');
                
                // Smooth scroll with better performance
                targetElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start',
                    inline: 'nearest'
                });
            }
        }, { passive: false });

        console.log('🧭 Navigation initialized');
    }

    initAnimations() {
        // Modern Intersection Observer with better options
        const observerOptions = {
            threshold: [0, 0.1, 0.5],
            rootMargin: '50px 0px',
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.style.cssText += `
                        opacity: 1;
                        transform: translateY(0);
                        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    `;
                    observer.unobserve(element); // Stop observing once animated
                }
            });
        }, observerOptions);

        // Animate cards with CSS custom properties
        const animatedElements = document.querySelectorAll('.doing-item, .timeline-item, .portfolio-item');
        
        animatedElements.forEach((element, index) => {
            element.style.cssText = `
                opacity: 0;
                transform: translateY(30px);
                --animation-delay: ${index * 100}ms;
                animation-delay: var(--animation-delay);
            `;
            observer.observe(element);
        });

        this.initContactForm();
        console.log('✨ Animations initialized');
    }

    initNameAnimation() {
        const nameElement = document.querySelector('.profile-info h1[data-lang]');
        if (!nameElement) {
            console.warn('Name element not found');
            return;
        }

        // Add typing class initially
        nameElement.classList.add('typing');

        // Remove typing cursor after name animation completes
        setTimeout(() => {
            nameElement.classList.remove('typing');
            this.startTextRevealEffect(nameElement);
        }, 1500);

        console.log('✨ Name animation initialized');
    }

    startTextRevealEffect(element) {
        const text = element.textContent;
        if (!text) return;

        // Clear the element
        element.textContent = '';
        element.classList.remove('typing');

        // Create individual spans for each letter
        const letters = text.split('').map((letter, index) => {
            const span = document.createElement('span');
            span.textContent = letter === ' ' ? '\u00A0' : letter;
            span.style.cssText = `
                opacity: 0;
                transform: translateY(20px) rotateX(90deg);
                display: inline-block;
                animation: letterReveal 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                animation-delay: ${index * 50}ms;
            `;
            return span;
        });

        // Add letter reveal animation to CSS if not exists
        if (!document.querySelector('#letter-reveal-style')) {
            const style = document.createElement('style');
            style.id = 'letter-reveal-style';
            style.textContent = `
                @keyframes letterReveal {
                    0% {
                        opacity: 0;
                        transform: translateY(20px) rotateX(90deg);
                    }
                    50% {
                        opacity: 0.7;
                        transform: translateY(-5px) rotateX(45deg);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) rotateX(0deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Append all letter spans
        const fragment = document.createDocumentFragment();
        letters.forEach(span => fragment.appendChild(span));
        element.appendChild(fragment);

        // Add glow effect after all letters are revealed
        const totalDelay = letters.length * 50 + 600;
        setTimeout(() => {
            element.style.textShadow = '0 0 20px rgba(66, 133, 244, 0.3)';
        }, totalDelay);
    }

    initContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        // Modern form validation with better UX
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate using modern techniques
            const validation = this.validateForm(data);
            if (!validation.isValid) {
                this.showFormError(validation.message);
                return;
            }

            await this.handleFormSubmission(data, form);
        });

        // Real-time validation
        form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field), { passive: true });
        });

        console.log('📧 Contact form initialized');
    }

    validateForm(data) {
        const { name, email, message } = data;
        
        if (!name?.trim()) return { isValid: false, message: 'Name is required' };
        if (!email?.trim()) return { isValid: false, message: 'Email is required' };
        if (!message?.trim()) return { isValid: false, message: 'Message is required' };
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, message: 'Please enter a valid email address' };
        }
        
        return { isValid: true };
    }

    validateField(field) {
        const value = field.value.trim();
        const isValid = value.length > 0;
        
        field.classList.toggle('invalid', !isValid);
        field.classList.toggle('valid', isValid);
    }

    showFormError(message) {
        // Create or update error message
        let errorEl = document.querySelector('.form-error');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'form-error';
            document.querySelector('.contact-form').prepend(errorEl);
        }
        
        errorEl.textContent = message;
        errorEl.style.cssText = `
            color: #ff6b6b;
            background: rgba(255, 107, 107, 0.1);
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid rgba(255, 107, 107, 0.3);
        `;
        
        // Remove error after 5 seconds
        setTimeout(() => errorEl?.remove(), 5000);
    }

    async handleFormSubmission(data, form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn?.textContent;
        
        try {
            // Show loading state
            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                submitBtn.style.cursor = 'not-allowed';
            }

            // Simulate API call with realistic delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success feedback
            this.showSuccessMessage();
            form.reset();
            document.querySelector('.form-error')?.remove();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormError('Failed to send message. Please try again.');
        } finally {
            // Restore button state
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.cursor = 'pointer';
            }
        }
    }

    showSuccessMessage() {
        const successEl = document.createElement('div');
        successEl.textContent = '✅ Message sent successfully!';
        successEl.style.cssText = `
            color: #4ecdc4;
            background: rgba(78, 205, 196, 0.1);
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid rgba(78, 205, 196, 0.3);
        `;
        
        document.querySelector('.contact-form').prepend(successEl);
        setTimeout(() => successEl.remove(), 3000);
    }
}

// Initialize app with error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        new PortfolioApp();
    } catch (error) {
        console.error('Failed to start portfolio app:', error);
    }
});

// Modern browser feature detection and enhancements
if ('serviceWorker' in navigator) {
    console.log('🚀 Service Worker supported - PWA ready');
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(`⚡ Page loaded in ${perfData.loadEventEnd - perfData.fetchStart}ms`);
    });
}

// Handle visibility changes for better performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('🔍 Page hidden - pausing animations');
    } else {
        console.log('👀 Page visible - resuming animations');
    }
});

// Global error handling
window.addEventListener('error', (e) => {
    console.error('🚨 Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('🚨 Unhandled promise rejection:', e.reason);
    e.preventDefault();
});
