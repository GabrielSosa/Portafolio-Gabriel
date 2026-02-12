// Anti-Spam Protection System
class AntiSpamProtection {
    constructor() {
        this.challenges = [
            {
                question: "¿Cuánto es 5 + 3?",
                answer: "8",
                type: "math"
            },
            {
                question: "¿Cuál es la capital de Honduras?",
                answer: "tegucigalpa",
                type: "knowledge"
            },
            {
                question: "Escribe la palabra 'HUMANO' en minúsculas:",
                answer: "humano",
                type: "text"
            },
            {
                question: "¿En qué año estamos? (4 dígitos)",
                answer: "2025",
                type: "current"
            },
            {
                question: "¿Cuántas letras tiene la palabra 'PORTFOLIO'?",
                answer: "9",
                type: "count"
            },
            {
                question: "¿Cuál es el resultado de 12 - 7?",
                answer: "5",
                type: "math"
            },
            {
                question: "Completa: DevOps es una metodología de _____ (desarrollo)",
                answer: "desarrollo",
                type: "tech"
            }
        ];
        
        this.currentChallenge = null;
        this.startTime = null;
        this.init();
    }

    init() {
        this.generateNewChallenge();
    }

    generateNewChallenge() {
        const randomIndex = Math.floor(Math.random() * this.challenges.length);
        this.currentChallenge = this.challenges[randomIndex];
        this.startTime = Date.now();
        return this.currentChallenge;
    }

    validateAnswer(userAnswer) {
        if (!this.currentChallenge || !userAnswer) {
            return false;
        }

        // Check response time (too fast = likely bot)
        const responseTime = Date.now() - this.startTime;
        if (responseTime < 2000) { // Less than 2 seconds is suspicious
            console.warn('⚠️ Suspicious response time:', responseTime + 'ms');
            return false;
        }

        // Normalize answer for comparison
        const normalizedAnswer = userAnswer.toString().toLowerCase().trim();
        const expectedAnswer = this.currentChallenge.answer.toLowerCase().trim();
        
        return normalizedAnswer === expectedAnswer;
    }

    getChallengeHTML() {
        if (!this.currentChallenge) {
            this.generateNewChallenge();
        }

        return `
            <div class="captcha-challenge">
                <label for="captcha-answer">
                    <i class="fas fa-shield-alt"></i>
                    <strong>Verificación Anti-Spam:</strong> ${this.currentChallenge.question}
                </label>
                <input type="text" 
                       id="captcha-answer" 
                       name="captcha-answer" 
                       required 
                       autocomplete="off"
                       placeholder="Tu respuesta...">
                <small class="captcha-hint">Esta verificación nos ayuda a prevenir spam automatizado</small>
            </div>
        `;
    }

    // Additional bot detection methods
    detectBotBehavior() {
        const checks = {
            // Check if user agent is suspicious
            suspiciousUserAgent: /bot|crawler|spider|scraper|headless/i.test(navigator.userAgent),
            
            // Check if webdriver is present (automated browsers)
            webdriverPresent: navigator.webdriver === true,
            
            // Check if user interacted with page (scroll, mouse movement, etc.)
            hasUserInteraction: this.hasUserInteracted(),
            
            // Check form fill speed (too fast = bot)
            fillSpeedSuspicious: this.checkFillSpeed(),
            
            // Check if JavaScript is disabled (basic check)
            jsEnabled: true // If this runs, JS is enabled
        };

        return checks;
    }

    hasUserInteracted() {
        // This would be set by event listeners for mouse/scroll/keyboard
        return window.userHasInteracted || false;
    }

    checkFillSpeed() {
        // Check if form was filled suspiciously fast
        const formFillStart = window.formFillStartTime || Date.now();
        const timeTaken = Date.now() - formFillStart;
        return timeTaken < 5000; // Less than 5 seconds is suspicious
    }
}

// User interaction tracking
let userInteractionTracker = {
    hasScrolled: false,
    hasMovedMouse: false,
    hasTyped: false,
    
    init() {
        // Track scroll
        window.addEventListener('scroll', () => {
            this.hasScrolled = true;
            window.userHasInteracted = true;
        }, { once: true });

        // Track mouse movement
        document.addEventListener('mousemove', () => {
            this.hasMovedMouse = true;
            window.userHasInteracted = true;
        }, { once: true });

        // Track typing
        document.addEventListener('keydown', () => {
            this.hasTyped = true;
            window.userHasInteracted = true;
        }, { once: true });

        // Track form start time
        const formInputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                if (!window.formFillStartTime) {
                    window.formFillStartTime = Date.now();
                }
            }, { once: true });
        });
    }
};

// Initialize user interaction tracking
document.addEventListener('DOMContentLoaded', () => {
    userInteractionTracker.init();
});

// Export for use in contact form
window.AntiSpamProtection = AntiSpamProtection;
