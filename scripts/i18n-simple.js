// Simple I18n System
let currentLang = localStorage.getItem('portfolio-lang') || 'en';
let translations = {};

// Force English as default on first load
if (!localStorage.getItem('portfolio-lang')) {
    currentLang = 'en';
    localStorage.setItem('portfolio-lang', 'en');
}

// Load translations
async function loadTranslations() {
    try {
        const [enResponse, esResponse] = await Promise.all([
            fetch('./lang/en.json', {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }),
            fetch('./lang/es.json', {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            })
        ]);
        
        const enData = await enResponse.json();
        const esData = await esResponse.json();
        
        translations = {
            en: enData,
            es: esData
        };
        
        console.log('✅ Translations loaded successfully');
        applyTranslations();
        setupLanguageToggle();
    } catch (error) {
        console.error('❌ Error loading translations:', error);
    }
}

// Apply translations to page
function applyTranslations() {
    const currentTranslations = translations[currentLang];
    if (!currentTranslations) {
        console.error('❌ No translations found for:', currentLang);
        return;
    }
    
    console.log(`🔤 Applying ${currentLang} translations...`);
    
    // Update all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedValue(currentTranslations, key);
        
        if (translation) {
            if (element.tagName === 'INPUT') {
                if (element.type === 'submit') {
                    element.value = translation;
                } else {
                    element.placeholder = translation;
                }
            } else if (element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.innerHTML = translation;
            }
        }
    });
    
    // Update meta tags
    if (currentTranslations.meta) {
        if (currentTranslations.meta.title) {
            document.title = currentTranslations.meta.title;
        }
        if (currentTranslations.meta.description) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.content = currentTranslations.meta.description;
            }
        }
    }
}

// Get nested translation value
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        if (current && typeof current === 'object') {
            if (!isNaN(key)) {
                return current[parseInt(key)];
            }
            return current[key];
        }
        return undefined;
    }, obj);
}

// Setup language toggle button
function setupLanguageToggle() {
    console.log('🔍 Looking for lang-toggle button...');
    const langToggle = document.getElementById('lang-toggle');
    console.log('Found button:', langToggle);
    
    if (!langToggle) {
        console.error('❌ Language toggle button not found!');
        // Let's also try to find it by class or other attributes
        const buttonByClass = document.querySelector('.lang-toggle');
        console.log('Trying by class:', buttonByClass);
        return;
    }
    
    // Set initial state
    updateLanguageButton();
    
    // Remove any existing listeners
    langToggle.replaceWith(langToggle.cloneNode(true));
    const newLangToggle = document.getElementById('lang-toggle');
    
    // Add click event
    newLangToggle.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('🖱️ Language button clicked!');
        switchLanguage();
    });
    
    console.log('🔘 Language toggle setup complete');
}

// Switch language
function switchLanguage() {
    const newLang = currentLang === 'en' ? 'es' : 'en';
    console.log(`🔄 Switching from ${currentLang} to ${newLang}`);
    
    currentLang = newLang;
    localStorage.setItem('portfolio-lang', currentLang);
    
    updateLanguageButton();
    applyTranslations();
}

// Update language button
function updateLanguageButton() {
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.innerHTML = `<span>${currentLang.toUpperCase()}</span>`;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌐 Initializing I18n System...');
    console.log('🔤 Default language set to:', currentLang);
    
    // Add a small delay to ensure everything is loaded
    setTimeout(() => {
        loadTranslations();
    }, 100);
});

// Debug function to reset language (can be called from console)
window.resetLanguage = () => {
    localStorage.removeItem('portfolio-lang');
    location.reload();
};
