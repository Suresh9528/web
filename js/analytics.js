// Analytics and Tracking Implementation

class AnalyticsTracker {
    constructor() {
        this.trackingId = 'UA-XXXXXX-X'; // Replace with your Google Analytics ID
        this.init();
    }
    
    init() {
        // Load Google Analytics script
        this.loadGoogleAnalytics();
        
        // Track page views
        this.trackPageView();
        
        // Track form submissions
        this.trackFormSubmissions();
        
        // Track button clicks
        this.trackClicks();
        
        // Track WhatsApp clicks
        this.trackWhatsAppClicks();
        
        // Track phone calls
        this.trackPhoneCalls();
    }
    
    loadGoogleAnalytics() {
        // Load Google Analytics script
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', this.trackingId);
        
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
        document.head.appendChild(script);
    }
    
    trackPageView() {
        const pageTitle = document.title;
        const pageUrl = window.location.pathname;
        
        console.log(`Page View: ${pageTitle} - ${pageUrl}`);
        
        // Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: pageTitle,
                page_location: pageUrl,
                page_path: pageUrl
            });
        }
        
        // Track time on page
        this.trackTimeOnPage();
    }
    
    trackTimeOnPage() {
        let startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - startTime;
            const seconds = Math.floor(timeSpent / 1000);
            
            console.log(`Time on page: ${seconds} seconds`);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'time_on_page', {
                    time_spent: seconds,
                    page_title: document.title,
                    page_url: window.location.pathname
                });
            }
        });
    }
    
    trackFormSubmissions() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const formName = form.getAttribute('name') || form.getAttribute('id') || 'contact_form';
                const formData = new FormData(form);
                
                console.log(`Form Submitted: ${formName}`);
                
                // Track in Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        form_name: formName,
                        form_location: window.location.pathname,
                        event_category: 'Form',
                        event_label: formName
                    });
                }
                
                // Track conversion
                this.trackConversion('form_submission', formName);
            });
        });
    }
    
    trackClicks() {
        // Track CTA button clicks
        const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .cta-button');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const buttonText = button.textContent.trim();
                const buttonId = button.getAttribute('id') || 'unnamed_button';
                
                console.log(`Button Clicked: ${buttonText}`);
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'button_click', {
                        button_text: buttonText,
                        button_id: buttonId,
                        page_location: window.location.pathname,
                        event_category: 'Button',
                        event_label: buttonText
                    });
                }
            });
        });
        
        // Track navigation clicks
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const linkText = link.textContent.trim();
                const linkHref = link.getAttribute('href');
                
                console.log(`Navigation Click: ${linkText} -> ${linkHref}`);
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'nav_click', {
                        link_text: linkText,
                        link_url: linkHref,
                        event_category: 'Navigation',
                        event_label: linkText
                    });
                }
            });
        });
    }
    
    trackWhatsAppClicks() {
        const whatsappButtons = document.querySelectorAll('.whatsapp-float, .whatsapp-button');
        
        whatsappButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                console.log('WhatsApp Clicked');
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'whatsapp_click', {
                        event_category: 'Contact',
                        event_label: 'WhatsApp',
                        page_location: window.location.pathname
                    });
                }
                
                // Track conversion
                this.trackConversion('whatsapp_contact', 'WhatsApp');
            });
        });
    }
    
    trackPhoneCalls() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        
        phoneLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const phoneNumber = link.getAttribute('href').replace('tel:', '');
                
                console.log(`Phone Call: ${phoneNumber}`);
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'phone_call', {
                        phone_number: phoneNumber,
                        event_category: 'Contact',
                        event_label: 'Phone Call',
                        page_location: window.location.pathname
                    });
                }
                
                // Track conversion
                this.trackConversion('phone_call', phoneNumber);
            });
        });
    }
    
    trackConversion(action, label) {
        console.log(`Conversion: ${action} - ${label}`);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                send_to: `${this.trackingId}/conversion`,
                value: 1.0,
                currency: 'USD',
                transaction_id: '',
                event_category: 'Conversion',
                event_label: label
            });
        }
    }
    
    // Error tracking
    trackError(error, context = '') {
        console.error(`Error Tracked: ${error.message}`, context);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: error.message,
                fatal: false,
                context: context
            });
        }
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize in production
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        new AnalyticsTracker();
    }
    
    // Error boundary for global errors
    window.addEventListener('error', (e) => {
        const tracker = new AnalyticsTracker();
        tracker.trackError(e.error, 'Global Error');
    });
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            
            console.log(`Page Load Time: ${loadTime}ms`);
            
            // Track load time in analytics
            if (typeof gtag !== 'undefined' && loadTime > 0) {
                gtag('event', 'timing_complete', {
                    name: 'page_load',
                    value: loadTime,
                    event_category: 'Performance',
                    event_label: 'Page Load Time'
                });
            }
        }, 0);
    });
}