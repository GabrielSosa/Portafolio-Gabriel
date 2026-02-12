/*
 * EmailJS Setup Instructions and Configuration Helper
 * 
 * Tu Public Key ya está configurado: A9yt-Xz4Z0U0WS26p
 * 
 * Ahora necesitas completar estos pasos en EmailJS:
 * 
 * 1. Ve a https://emailjs.com/
 * 2. Crea un nuevo servicio de email (Gmail, Outlook, etc.)
 * 3. Crea un template de email 
 * 4. Actualiza la configuración abajo
 */

// EmailJS Configuration - UPDATED WITH REAL IDs
const EMAILJS_CONFIG = {
    publicKey: 'A9yt-Xz4Z0U0WS26p',      // ✅ Your Public Key (configured)
    serviceID: 'service_edg8uu6',          // ✅ Your Service ID from EmailJS
    templateID: 'template_yz6hlg6'         // ✅ Your Template ID from EmailJS
};

// Quick setup function - call this from console with your real IDs
window.updateEmailJSConfig = function(serviceID, templateID) {
    if (window.contactForm) {
        window.contactForm.updateEmailJSConfig(serviceID, templateID);
        console.log('✅ EmailJS updated temporarily!');
        console.log('📝 To make permanent, update scripts/emailjs-setup.js');
    }
};

// Helper to test with real IDs without editing files
window.testEmailJS = function(serviceID, templateID) {
    console.log('🧪 Testing EmailJS configuration...');
    console.log('Service ID:', serviceID);
    console.log('Template ID:', templateID);
    
    if (window.contactForm) {
        window.contactForm.updateEmailJSConfig(serviceID, templateID);
        console.log('✅ Configuration updated! Try submitting the form now.');
    } else {
        console.log('❌ Contact form not ready. Refresh and try again.');
    }
};

// Diagnostic function to help troubleshoot EmailJS issues
window.diagnoseEmailJS = function() {
    console.log('🔍 EMAILJS DIAGNOSTIC REPORT:');
    console.log('');
    console.log('📧 Current Configuration:');
    console.log('- Public Key:', EMAILJS_CONFIG.publicKey);
    console.log('- Service ID:', EMAILJS_CONFIG.serviceID);
    console.log('- Template ID:', EMAILJS_CONFIG.templateID);
    console.log('');
    
    // Check if EmailJS library is loaded
    if (typeof emailjs === 'undefined') {
        console.log('❌ EmailJS library not loaded!');
        console.log('💡 Solution: Check if CDN script is loading properly');
    } else {
        console.log('✅ EmailJS library loaded');
    }
    
    // Check form elements
    const form = document.getElementById('contact-form');
    if (!form) {
        console.log('❌ Contact form not found!');
    } else {
        console.log('✅ Contact form found');
        console.log('📋 Form fields:', Array.from(form.elements).map(el => el.name || el.id));
    }
    
    console.log('');
    console.log('🔧 COMMON SOLUTIONS FOR 412 ERROR:');
    console.log('1. Check your EmailJS service type (Gmail vs Outlook)');
    console.log('2. Verify the "From Email" in your template matches your service account');
    console.log('3. Make sure your email service is properly connected');
    console.log('4. Try recreating the service with Gmail instead of Outlook');
    console.log('');
    console.log('💡 Run: testEmailJS("your_service_id", "your_template_id") to test new IDs');
};

// Recommended Email Template for EmailJS:
const EMAIL_TEMPLATE_EXAMPLE = `
Asunto: Nuevo mensaje desde tu Portfolio - {{subject}}

Hola Gabriel,

Has recibido un nuevo mensaje desde tu portfolio:

👤 De: {{from_name}}
📧 Email: {{from_email}} 
📝 Asunto: {{subject}}
🕐 Fecha: {{timestamp}}

💬 Mensaje:
{{message}}

---
Enviado desde tu portfolio web
`;

// Helper function to update EmailJS configuration
function setupEmailJS() {
    if (window.contactForm) {
        window.contactForm.updateEmailJSConfig(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID
        );
        console.log('✅ EmailJS configured successfully!');
    } else {
        console.error('❌ Contact form not found. Make sure contact-form.js is loaded first.');
    }
}

// Auto-setup when this script loads (after contact form is ready)
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for contact form to initialize
    setTimeout(setupEmailJS, 500);
});

// Export for manual setup if needed
window.EMAILJS_CONFIG = EMAILJS_CONFIG;
window.setupEmailJS = setupEmailJS;
window.EMAIL_TEMPLATE_EXAMPLE = EMAIL_TEMPLATE_EXAMPLE;
