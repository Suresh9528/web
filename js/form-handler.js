// Form Handling and Email Notification Simulation

class FormHandler {
    constructor() {
        this.forms = document.querySelectorAll('.contact-form, .inquiry-form');
        this.init();
    }
    
    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e, form));
        });
    }
    
    async handleSubmit(e, form) {
        e.preventDefault();
        
        // Validate form
        if (!this.validateForm(form)) {
            return;
        }
        
        // Get form data
        const formData = this.getFormData(form);
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call (in production, replace with actual API endpoint)
            await this.simulateApiCall(formData);
            
            // Show success message
            this.showSuccessMessage(form, 'Thank you for your inquiry! We will contact you shortly.');
            
            // Reset form
            form.reset();
            
            // Send WhatsApp notification (simulated)
            this.sendWhatsAppNotification(formData);
            
        } catch (error) {
            this.showErrorMessage(form, 'Something went wrong. Please try again or contact us directly.');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            field.classList.remove('error');
            
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
                this.showFieldError(field, 'This field is required');
            } else if (field.type === 'email' && !this.isValidEmail(field.value)) {
                field.classList.add('error');
                isValid = false;
                this.showFieldError(field, 'Please enter a valid email address');
            } else if (field.type === 'tel' && !this.isValidPhone(field.value)) {
                field.classList.add('error');
                isValid = false;
                this.showFieldError(field, 'Please enter a valid phone number');
            } else {
                this.removeFieldError(field);
            }
        });
        
        return isValid;
    }
    
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    isValidPhone(phone) {
        // Basic phone validation - adjust as needed
        const re = /^[\+]?[1-9][\d]{0,15}$/;
        return re.test(phone.replace(/[\s\-\(\)\.]+/g, ''));
    }
    
    showFieldError(field, message) {
        this.removeFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 5px;
        `;
        
        field.parentNode.appendChild(errorDiv);
    }
    
    removeFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    getFormData(form) {
        const formData = {};
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.name) {
                formData[input.name] = input.value.trim();
            }
        });
        
        // Add timestamp
        formData.timestamp = new Date().toISOString();
        
        // Add page URL
        formData.pageUrl = window.location.href;
        
        return formData;
    }
    
    simulateApiCall(formData) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    // Log to console (in production, this would go to your server)
                    console.log('Form submitted:', formData);
                    
                    // Simulate email notification
                    this.simulateEmailNotification(formData);
                    
                    resolve({ success: true, message: 'Form submitted successfully' });
                } else {
                    reject(new Error('Network error'));
                }
            }, 1500);
        });
    }
    
    simulateEmailNotification(formData) {
        const emailContent = `
            New Inquiry Received:
            
            Name: ${formData.name || 'Not provided'}
            Email: ${formData.email || 'Not provided'}
            Phone: ${formData.phone || 'Not provided'}
            Company: ${formData.company || 'Not provided'}
            Service: ${formData.service || 'Not provided'}
            Message: ${formData.message || 'Not provided'}
            
            Submitted from: ${formData.pageUrl}
            Time: ${new Date(formData.timestamp).toLocaleString()}
        `;
        
        console.log('Email notification would be sent with content:', emailContent);
        
        // In production, you would use:
        // 1. Server-side email sending (PHP, Node.js, etc.)
        // 2. Third-party service (SendGrid, Mailgun, etc.)
        // 3. Form submission services (Formspree, Netlify Forms, etc.)
    }
    
    sendWhatsAppNotification(formData) {
        const phoneNumber = '91XXXXXXXXXX'; // Replace with actual number
        const message = `New inquiry from ${formData.name || 'Visitor'} about ${formData.service || 'services'}. Check dashboard for details.`;
        const encodedMessage = encodeURIComponent(message);
        
        // Create WhatsApp link (would be used in production)
        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        console.log('WhatsApp notification link:', whatsappLink);
        
        // In production, you might want to:
        // 1. Open WhatsApp in new tab
        // 2. Use WhatsApp Business API
        // 3. Send to multiple numbers
    }
    
    showSuccessMessage(form, message) {
        // Remove any existing messages
        this.removeMessages(form);
        
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `
            <div style="
                background-color: #d4edda;
                color: #155724;
                padding: 15px;
                border-radius: 8px;
                margin-top: 20px;
                border: 1px solid #c3e6cb;
                display: flex;
                align-items: center;
                gap: 10px;
            ">
                <i class="fas fa-check-circle" style="font-size: 1.2rem;"></i>
                <span>${message}</span>
            </div>
        `;
        
        form.appendChild(successDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 10000);
    }
    
    showErrorMessage(form, message) {
        // Remove any existing messages
        this.removeMessages(form);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.innerHTML = `
            <div style="
                background-color: #f8d7da;
                color: #721c24;
                padding: 15px;
                border-radius: 8px;
                margin-top: 20px;
                border: 1px solid #f5c6cb;
                display: flex;
                align-items: center;
                gap: 10px;
            ">
                <i class="fas fa-exclamation-circle" style="font-size: 1.2rem;"></i>
                <span>${message}</span>
            </div>
        `;
        
        form.appendChild(errorDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 10000);
    }
    
    removeMessages(form) {
        const existingMessages = form.querySelectorAll('.form-success, .form-error');
        existingMessages.forEach(msg => msg.remove());
    }
}

// Initialize form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FormHandler();
});