// App Initialization
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Starting Portfolio App...');
    
    try {
        // Initialize I18n first
        const i18n = new I18nManager('en'); // English as default
        
        // Wait for i18n to be ready
        while (!i18n.isReady()) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Initialize the main portfolio app
        const portfolio = new ModernPortfolio();
        
        // Make i18n globally accessible
        window.portfolioI18n = i18n;
        
        console.log('✅ Portfolio App initialized successfully!');
        
    } catch (error) {
        console.error('❌ Error initializing app:', error);
    }
});
