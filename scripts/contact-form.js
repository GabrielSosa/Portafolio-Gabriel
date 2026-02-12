// Contact Form Handler with EmailJS Integration and Anti-Spam Protection
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.statusDiv = document.getElementById('form-status');
        this.submitBtn = document.getElementById('submit-btn');
        
        // EmailJS Configuration
        this.emailjsConfig = {
            publicKey: 'A9yt-Xz4Z0U0WS26p',     // Your EmailJS Public Key
            serviceID: 'service_edg8uu6',        // Your Service ID
            templateID: 'template_yz6hlg6'       // Your Template ID
        };
        
        // Initialize Anti-Spam Protection
        this.antiSpam = new AntiSpamProtection();
        
        this.init();
    }

    init() {
        if (this.form) {
            // Initialize EmailJS
            emailjs.init(this.emailjsConfig.publicKey);
            
            // Add CAPTCHA to form
            this.addCaptchaToForm();
            
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    addCaptchaToForm() {
        // Find the submit button
        const submitBtn = this.form.querySelector('#submit-btn');
        
        // Create CAPTCHA container
        const captchaContainer = document.createElement('div');
        captchaContainer.className = 'captcha-container';
        captchaContainer.innerHTML = this.antiSpam.getChallengeHTML();
        
        // Insert CAPTCHA before submit button
        submitBtn.parentNode.insertBefore(captchaContainer, submitBtn);
    }

    async handleSubmit(e) {
        e.preventDefault();

        // 1. Basic bot protection check (honeypot)
        const honeypot = this.form.querySelector('input[name="bot-field"]');
        if (honeypot && honeypot.value) {
            this.showMessage('🚫 Error: Submisión inválida detectada.', 'error');
            return;
        }

        // 2. CAPTCHA validation
        const captchaAnswer = this.form.querySelector('#captcha-answer')?.value;
        if (!this.antiSpam.validateAnswer(captchaAnswer)) {
            this.showMessage('❌ Respuesta de verificación incorrecta. Intenta nuevamente.', 'error');
            // Generate new challenge
            this.refreshCaptcha();
            return;
        }

        // 3. Bot behavior detection
        const botChecks = this.antiSpam.detectBotBehavior();
        if (botChecks.suspiciousUserAgent || botChecks.webdriverPresent || !botChecks.hasUserInteraction) {
            this.showMessage('🛡️ Por favor completa la verificación correctamente.', 'error');
            this.refreshCaptcha();
            return;
        }

        // 4. Form validation
        if (!this.validateForm()) {
            return;
        }

        // 5. Rate limiting check
        if (!this.checkRateLimit()) {
            this.showMessage('⏰ Por favor espera un momento antes de enviar otro mensaje.', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Prepare email data for EmailJS
            const templateParams = {
                from_name: this.form.name.value,
                from_email: this.form.email.value,
                subject: this.form.subject ? this.form.subject.value : 'Contacto desde Portfolio',
                message: this.form.message.value,
                to_email: 'gabrielsosa3093@gmail.com',
                reply_to: this.form.email.value,
                timestamp: new Date().toLocaleString('es-HN'),
                user_agent: navigator.userAgent,
                captcha_solved: true
            };

            // Send email via EmailJS
            const response = await emailjs.send(
                this.emailjsConfig.serviceID,
                this.emailjsConfig.templateID,
                templateParams
            );

            if (response.status === 200) {
                this.showMessage(
                    '✅ ¡Mensaje enviado exitosamente! Te contactaré pronto. 🚀', 
                    'success'
                );
                this.form.reset();
                this.refreshCaptcha();
                this.updateRateLimit();
            } else {
                throw new Error('EmailJS response not OK');
            }

        } catch (error) {
            let errorMessage = 'Error al enviar el mensaje. Por favor intenta nuevamente. 😔';
            
            if (error.status === 412) {
                errorMessage = '⚠️ Error de configuración del servicio de email.';
            } else if (error.status === 400) {
                errorMessage = '❌ Datos del formulario inválidos. Revisa los campos.';
            } else if (error.status === 403) {
                errorMessage = '🔐 Error de autenticación del servicio.';
            }
            
            this.showMessage(errorMessage, 'error');
            this.refreshCaptcha();
        } finally {
            this.setLoadingState(false);
        }
    }

    refreshCaptcha() {
        const captchaContainer = this.form.querySelector('.captcha-container');
        if (captchaContainer) {
            this.antiSpam.generateNewChallenge();
            captchaContainer.innerHTML = this.antiSpam.getChallengeHTML();
        }
    }

    checkRateLimit() {
        const lastSubmission = localStorage.getItem('lastFormSubmission');
        const now = Date.now();
        const cooldownTime = 30000; // 30 seconds

        if (lastSubmission && (now - parseInt(lastSubmission)) < cooldownTime) {
            return false;
        }
        return true;
    }

    updateRateLimit() {
        localStorage.setItem('lastFormSubmission', Date.now().toString());
    }

    validateForm() {
        const requiredFields = [
            { name: 'name', label: 'Nombre' },
            { name: 'email', label: 'Email' },
            { name: 'message', label: 'Mensaje' }
        ];
        
        let isValid = true;
        let firstErrorField = null;

        // Validate required fields
        requiredFields.forEach(({ name, label }) => {
            const field = this.form[name];
            const value = field.value.trim();
            
            if (!value) {
                field.style.borderColor = '#ef4444';
                if (!firstErrorField) firstErrorField = field;
                isValid = false;
            } else {
                field.style.borderColor = '';
            }
        });

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailField = this.form.email;
        if (emailField.value && !emailRegex.test(emailField.value)) {
            emailField.style.borderColor = '#ef4444';
            this.showMessage('Por favor ingresa un email válido.', 'error');
            if (!firstErrorField) firstErrorField = emailField;
            isValid = false;
        }

        // Anti-spam content validation
        const messageField = this.form.message;
        if (messageField.value) {
            // Check for suspicious patterns
            const suspiciousPatterns = [
                /viagra|cialis|lottery|winner|congratulations/i,
                /click here|visit now|amazing offer/i,
                /(https?:\/\/[^\s]+.*){3,}/g, // Multiple URLs
                /(.)\1{10,}/g, // Repeated characters
                /[A-Z]{5,}.*[A-Z]{5,}/g // Excessive caps
            ];

            const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
                pattern.test(messageField.value)
            );

            if (hasSuspiciousContent) {
                this.showMessage('🚫 El mensaje contiene contenido sospechoso. Por favor revisa tu mensaje.', 'error');
                messageField.style.borderColor = '#ef4444';
                if (!firstErrorField) firstErrorField = messageField;
                isValid = false;
            }
        }

        // Focus first error field
        if (firstErrorField) {
            firstErrorField.focus();
        }

        return isValid;
    }

    setLoadingState(loading) {
        if (loading) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span data-i18n="contact.form.send">Send Message</span>';
        }
    }

    showMessage(message, type) {
        this.statusDiv.textContent = message;
        this.statusDiv.className = `form-status ${type}`;
        this.statusDiv.style.display = 'block';

        // Auto-hide after 8 seconds
        setTimeout(() => {
            this.statusDiv.style.display = 'none';
        }, 8000);

        // Scroll to message
        this.statusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    isLocalhost() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1';
    }

    showDevInstructions() {
        // Production ready - no dev instructions needed
    }

    // Method to update EmailJS configuration easily
    updateEmailJSConfig(serviceID, templateID) {
        this.emailjsConfig.serviceID = serviceID;
        this.emailjsConfig.templateID = templateID;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.contactForm = new ContactForm();
});
