/**
 * Finance Calculator - Tax Savings Calculator
 * Sura Corporate Solutions - Financial Services
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tax calculator
    initTaxCalculator();
    
    // Initialize compliance calendar
    initComplianceCalendar();
    
    // Initialize financial forms
    initFinancialForms();
});

/**
 * Initialize Tax Savings Calculator
 */
function initTaxCalculator() {
    const calculatorForm = document.getElementById('calculate-tax');
    const annualIncomeInput = document.getElementById('annual-income');
    const businessTypeSelect = document.getElementById('business-type');
    
    if (!calculatorForm || !annualIncomeInput || !businessTypeSelect) return;
    
    // Update current values when inputs change
    annualIncomeInput.addEventListener('input', updateTaxEstimate);
    businessTypeSelect.addEventListener('change', updateTaxEstimate);
    
    // Calculate on button click
    calculatorForm.addEventListener('click', function(e) {
        e.preventDefault();
        calculateTaxSavings();
    });
    
    // Initial calculation
    updateTaxEstimate();
}

/**
 * Update tax estimate in real-time
 */
function updateTaxEstimate() {
    const annualIncome = parseInt(document.getElementById('annual-income').value) || 0;
    const businessType = document.getElementById('business-type').value;
    
    if (annualIncome <= 0) return;
    
    // Calculate current tax liability (basic calculation)
    const currentTax = calculateCurrentTax(annualIncome, businessType);
    
    // Calculate optimized tax liability
    const optimizedTax = calculateOptimizedTax(annualIncome, businessType);
    
    // Calculate savings
    const savings = currentTax - optimizedTax;
    
    // Update display immediately (without animation)
    updateResultDisplay(currentTax, optimizedTax, savings);
}

/**
 * Calculate tax savings with animation
 */
function calculateTaxSavings() {
    const annualIncome = parseInt(document.getElementById('annual-income').value) || 0;
    const businessType = document.getElementById('business-type').value;
    
    if (annualIncome <= 0) {
        showError('Please enter a valid annual income');
        return;
    }
    
    // Show loading state
    const calculateBtn = document.getElementById('calculate-tax');
    const originalText = calculateBtn.textContent;
    calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';
    calculateBtn.disabled = true;
    
    // Simulate calculation delay
    setTimeout(() => {
        // Calculate current tax liability
        const currentTax = calculateCurrentTax(annualIncome, businessType);
        
        // Calculate optimized tax liability
        const optimizedTax = calculateOptimizedTax(annualIncome, businessType);
        
        // Calculate savings
        const savings = currentTax - optimizedTax;
        
        // Animate results
        animateResults(currentTax, optimizedTax, savings);
        
        // Reset button
        calculateBtn.textContent = originalText;
        calculateBtn.disabled = false;
        
        // Track calculation
        trackTaxCalculation(annualIncome, businessType, savings);
        
    }, 800);
}

/**
 * Calculate current tax liability based on income and business type
 */
function calculateCurrentTax(income, businessType) {
    let taxRate = 0;
    
    // Different tax rates for different business types
    switch(businessType) {
        case 'proprietorship':
            taxRate = 0.30; // 30% for proprietorship
            break;
        case 'partnership':
            taxRate = 0.28; // 28% for partnership
            break;
        case 'private-limited':
            taxRate = 0.25; // 25% for private limited
            break;
        case 'llp':
            taxRate = 0.26; // 26% for LLP
            break;
        default:
            taxRate = 0.30;
    }
    
    // Apply progressive tax slabs
    let tax = 0;
    
    if (income <= 250000) {
        tax = 0;
    } else if (income <= 500000) {
        tax = (income - 250000) * 0.05;
    } else if (income <= 1000000) {
        tax = 12500 + (income - 500000) * 0.20;
    } else {
        tax = 112500 + (income - 1000000) * taxRate;
    }
    
    // Add cess (4%)
    tax += tax * 0.04;
    
    return Math.round(tax);
}

/**
 * Calculate optimized tax liability with deductions
 */
function calculateOptimizedTax(income, businessType) {
    let baseTax = calculateCurrentTax(income, businessType);
    
    // Apply optimization strategies based on business type
    let optimizationRate = 0;
    
    switch(businessType) {
        case 'proprietorship':
            optimizationRate = 0.25; // 25% optimization possible
            break;
        case 'partnership':
            optimizationRate = 0.28; // 28% optimization possible
            break;
        case 'private-limited':
            optimizationRate = 0.30; // 30% optimization possible
            break;
        case 'llp':
            optimizationRate = 0.27; // 27% optimization possible
            break;
        default:
            optimizationRate = 0.25;
    }
    
    // Apply optimization (reduction)
    let optimizedTax = baseTax * (1 - optimizationRate);
    
    // Ensure minimum tax
    const minimumTax = income * 0.10; // Minimum 10% of income
    optimizedTax = Math.max(optimizedTax, minimumTax);
    
    return Math.round(optimizedTax);
}

/**
 * Update result display
 */
function updateResultDisplay(currentTax, optimizedTax, savings) {
    const currentTaxEl = document.getElementById('current-tax');
    const optimizedTaxEl = document.getElementById('optimized-tax');
    const savingsEl = document.getElementById('savings');
    
    if (currentTaxEl) {
        currentTaxEl.textContent = formatCurrency(currentTax);
    }
    
    if (optimizedTaxEl) {
        optimizedTaxEl.textContent = formatCurrency(optimizedTax);
    }
    
    if (savingsEl) {
        savingsEl.textContent = formatCurrency(savings);
        savingsEl.style.color = savings > 0 ? '#2ecc71' : '#e74c3c';
    }
}

/**
 * Animate results with counting effect
 */
function animateResults(finalCurrentTax, finalOptimizedTax, finalSavings) {
    const currentTaxEl = document.getElementById('current-tax');
    const optimizedTaxEl = document.getElementById('optimized-tax');
    const savingsEl = document.getElementById('savings');
    
    // Get current displayed values
    const currentCurrentTax = parseCurrency(currentTaxEl.textContent) || 0;
    const currentOptimizedTax = parseCurrency(optimizedTaxEl.textContent) || 0;
    const currentSavings = parseCurrency(savingsEl.textContent) || 0;
    
    // Animate counting
    animateValue(currentTaxEl, currentCurrentTax, finalCurrentTax, 1000);
    animateValue(optimizedTaxEl, currentOptimizedTax, finalOptimizedTax, 1000);
    animateValue(savingsEl, currentSavings, finalSavings, 1000);
    
    // Add visual feedback
    const resultBox = document.querySelector('.result-box');
    if (resultBox) {
        resultBox.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            resultBox.style.animation = '';
        }, 500);
    }
    
    // Show success message for significant savings
    if (finalSavings > 100000) {
        showSuccessMessage(`Great! You could save ${formatCurrency(finalSavings)} with our tax optimization strategies.`);
    }
}

/**
 * Animate value from start to end
 */
function animateValue(element, start, end, duration) {
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    function update() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.round(start + (end - start) * easeOutQuart);
        
        element.textContent = formatCurrency(currentValue);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = formatCurrency(end);
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * Format currency with Indian numbering system
 */
function formatCurrency(amount) {
    // Handle negative numbers
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    
    // Format with commas
    let formatted = new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 0
    }).format(absAmount);
    
    // Add ₹ symbol
    formatted = '₹ ' + formatted;
    
    // Add negative sign if needed
    if (isNegative) {
        formatted = '- ' + formatted;
    }
    
    return formatted;
}

/**
 * Parse currency string to number
 */
function parseCurrency(currencyString) {
    // Remove ₹ symbol, commas, and spaces
    const numberString = currencyString.replace(/[₹,]/g, '').trim();
    return parseInt(numberString) || 0;
}

/**
 * Initialize compliance calendar
 */
function initComplianceCalendar() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
        
        // Add click to show details
        item.addEventListener('click', function() {
            const content = this.querySelector('.timeline-content');
            const isExpanded = content.classList.contains('expanded');
            
            // Collapse all other items
            timelineItems.forEach(otherItem => {
                otherItem.querySelector('.timeline-content').classList.remove('expanded');
            });
            
            // Toggle current item
            if (!isExpanded) {
                content.classList.add('expanded');
                showComplianceDetails(this);
            }
        });
    });
    
    // Set current month highlighting
    highlightCurrentMonth();
}

/**
 * Highlight current month in compliance timeline
 */
function highlightCurrentMonth() {
    const currentMonth = new Date().getMonth(); // 0-indexed (0 = January)
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const currentMonthName = months[currentMonth];
    const timelineDates = document.querySelectorAll('.timeline-date');
    
    timelineDates.forEach(dateElement => {
        const monthText = dateElement.textContent.trim();
        if (monthText === months[currentMonth] || 
            monthText === months[(currentMonth + 1) % 12] ||
            monthText === months[(currentMonth + 2) % 12]) {
            
            // Highlight upcoming deadlines
            dateElement.style.backgroundColor = 'var(--accent-color)';
            dateElement.style.color = 'var(--white)';
            dateElement.style.fontWeight = 'bold';
            
            // Add notification badge
            if (monthText === months[currentMonth]) {
                const badge = document.createElement('span');
                badge.className = 'current-month-badge';
                badge.textContent = 'Current';
                badge.style.cssText = `
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #e74c3c;
                    color: white;
                    font-size: 0.7rem;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-weight: bold;
                `;
                dateElement.style.position = 'relative';
                dateElement.appendChild(badge);
            }
        }
    });
}

/**
 * Show compliance details
 */
function showComplianceDetails(timelineItem) {
    const date = timelineItem.querySelector('.timeline-date').textContent;
    const title = timelineItem.querySelector('h4').textContent;
    const description = timelineItem.querySelector('p').textContent;
    
    // Create and show modal with details
    const modal = createComplianceModal(date, title, description);
    document.body.appendChild(modal);
    
    // Add modal styles
    addModalStyles();
}

/**
 * Create compliance details modal
 */
function createComplianceModal(date, title, description) {
    const modal = document.createElement('div');
    modal.className = 'compliance-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            padding: 40px;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            animation: slideUp 0.3s ease;
        ">
            <div class="modal-header" style="
                margin-bottom: 25px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div>
                    <div class="modal-date" style="
                        background: var(--primary-color);
                        color: white;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-weight: bold;
                        display: inline-block;
                        margin-bottom: 10px;
                    ">${date}</div>
                    <h3 style="color: var(--primary-color); margin: 0;">${title}</h3>
                </div>
                <button class="close-modal" style="
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--gray-medium);
                ">×</button>
            </div>
            <div class="modal-body">
                <p style="color: var(--gray-dark); margin-bottom: 25px; line-height: 1.6;">${description}</p>
                
                <div class="compliance-details" style="background: var(--light-color); padding: 20px; border-radius: 8px;">
                    <h4 style="color: var(--primary-color); margin-bottom: 15px;">Compliance Requirements:</h4>
                    <ul style="color: var(--gray-dark); padding-left: 20px;">
                        <li>File quarterly GST returns</li>
                        <li>Submit TDS/TCS returns</li>
                        <li>Annual financial statements preparation</li>
                        <li>Board meeting compliance</li>
                    </ul>
                </div>
                
                <div class="modal-actions" style="margin-top: 30px; display: flex; gap: 15px;">
                    <button class="btn btn-primary" id="download-checklist" style="flex: 1;">
                        <i class="fas fa-download"></i> Download Checklist
                    </button>
                    <button class="btn btn-secondary" id="remind-me" style="flex: 1;">
                        <i class="fas fa-bell"></i> Set Reminder
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.querySelector('#download-checklist').addEventListener('click', () => {
        downloadComplianceChecklist(date);
    });
    
    modal.querySelector('#remind-me').addEventListener('click', () => {
        setComplianceReminder(date, title);
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        }
    });
    
    return modal;
}

/**
 * Initialize financial forms
 */
function initFinancialForms() {
    // Add validation to financial inquiry forms
    const financialForms = document.querySelectorAll('.financial-form');
    
    financialForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateFinancialForm(this)) {
                submitFinancialInquiry(this);
            }
        });
        
        // Add real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateFinancialField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

/**
 * Validate financial form
 */
function validateFinancialForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateFinancialField(field)) {
            isValid = false;
        }
    });
    
    // Additional validation for financial fields
    const incomeField = form.querySelector('input[name="annual_income"]');
    if (incomeField && incomeField.value) {
        const income = parseInt(incomeField.value);
        if (isNaN(income) || income < 0) {
            showFieldError(incomeField, 'Please enter a valid annual income');
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * Validate individual financial field
 */
function validateFinancialField(field) {
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    
    clearFieldError(field);
    
    // Check required fields
    if (field.required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (fieldName.includes('phone') && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = value.replace(/[\s\-\(\)\.]+/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // Number validation
    if (field.type === 'number' && value) {
        if (isNaN(parseFloat(value))) {
            showFieldError(field, 'Please enter a valid number');
            return false;
        }
        
        // Check min/max if specified
        if (field.min && parseFloat(value) < parseFloat(field.min)) {
            showFieldError(field, `Minimum value is ${field.min}`);
            return false;
        }
        
        if (field.max && parseFloat(value) > parseFloat(field.max)) {
            showFieldError(field, `Maximum value is ${field.max}`);
            return false;
        }
    }
    
    return true;
}

/**
 * Show field error
 */
function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #e74c3c;
        font-size: 0.875rem;
        margin-top: 5px;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

/**
 * Clear field error
 */
function clearFieldError(field) {
    field.classList.remove('error');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

/**
 * Submit financial inquiry
 */
function submitFinancialInquiry(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const inquiryData = {
        service: 'financial-consultation',
        timestamp: new Date().toISOString(),
        source: window.location.href
    };
    
    // Add form values
    for (let [key, value] of formData.entries()) {
        inquiryData[key] = value;
    }
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showSuccessMessage('Thank you for your inquiry! Our financial experts will contact you within 24 hours.');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Track form submission
        trackFinancialInquiry(inquiryData);
        
        // Show confirmation modal
        showFinancialConfirmation(inquiryData);
        
    }, 1500);
}

/**
 * Show success message
 */
function showSuccessMessage(message) {
    // Remove existing success messages
    const existingMessages = document.querySelectorAll('.success-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2ecc71;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.3s ease;
        ">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => successDiv.remove(), 300);
    }, 5000);
}

/**
 * Show error message
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.3s ease;
        ">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

/**
 * Show financial confirmation
 */
function showFinancialConfirmation(inquiryData) {
    const modal = document.createElement('div');
    modal.className = 'confirmation-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10002;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div class="confirmation-content" style="
            background: white;
            padding: 40px;
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            animation: slideUp 0.3s ease;
        ">
            <div class="confirmation-icon" style="
                font-size: 4rem;
                color: var(--accent-color);
                margin-bottom: 20px;
            ">
                <i class="fas fa-check-circle"></i>
            </div>
            
            <h2 style="color: var(--primary-color); margin-bottom: 15px;">Inquiry Submitted Successfully!</h2>
            <p style="color: var(--gray-dark); margin-bottom: 30px; line-height: 1.6;">
                Thank you for your interest in our financial services. Our expert will contact you within 24 hours.
                In the meantime, you can download our financial planning guide.
            </p>
            
            <div class="confirmation-details" style="
                background: var(--light-color);
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 30px;
                text-align: left;
            ">
                <h4 style="color: var(--primary-color); margin-bottom: 15px;">Your Inquiry Details:</h4>
                <ul style="color: var(--gray-dark); padding-left: 20px;">
                    <li><strong>Service:</strong> Financial Consultation</li>
                    <li><strong>Reference ID:</strong> FIN-${Date.now().toString().slice(-6)}</li>
                    <li><strong>Expected Response:</strong> Within 24 hours</li>
                </ul>
            </div>
            
            <div class="confirmation-actions" style="display: flex; gap: 15px; justify-content: center;">
                <button class="btn btn-primary" id="download-guide">
                    <i class="fas fa-download"></i> Download Financial Guide
                </button>
                <button class="btn btn-secondary" id="close-confirmation">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('#download-guide').addEventListener('click', () => {
        downloadFinancialGuide();
        modal.querySelector('#close-confirmation').click();
    });
    
    modal.querySelector('#close-confirmation').addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    });
}

/**
 * Download compliance checklist
 */
function downloadComplianceChecklist(date) {
    // Simulate download
    showSuccessMessage('Compliance checklist downloaded successfully!');
    
    // Track download
    trackComplianceDownload(date);
}

/**
 * Set compliance reminder
 */
function setComplianceReminder(date, title) {
    // In a real application, this would integrate with calendar APIs
    showSuccessMessage(`Reminder set for ${date}: ${title}`);
    
    // Track reminder setting
    trackReminderSet(date, title);
}

/**
 * Download financial guide
 */
function downloadFinancialGuide() {
    showSuccessMessage('Financial planning guide downloaded successfully!');
    
    // Track download
    trackGuideDownload();
}

/**
 * Add modal animations CSS
 */
function addModalStyles() {
    if (document.getElementById('modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        .timeline-content.expanded {
            background: var(--accent-color);
            color: white;
        }
        
        .timeline-content.expanded h4,
        .timeline-content.expanded p {
            color: white;
        }
        
        input.error,
        select.error,
        textarea.error {
            border-color: #e74c3c !important;
            background-color: rgba(231, 76, 60, 0.05) !important;
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Track tax calculation for analytics
 */
function trackTaxCalculation(income, businessType, savings) {
    console.log('Tax Calculation Tracked:', { income, businessType, savings });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'tax_calculation', {
            income: income,
            business_type: businessType,
            savings: savings,
            event_category: 'Calculator',
            event_label: 'Tax Savings Calculator'
        });
    }
}

/**
 * Track financial inquiry
 */
function trackFinancialInquiry(data) {
    console.log('Financial Inquiry Tracked:', data);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'financial_inquiry', {
            service_type: data.service || 'financial',
            event_category: 'Form',
            event_label: 'Financial Inquiry Form'
        });
    }
}

/**
 * Track compliance download
 */
function trackComplianceDownload(date) {
    console.log('Compliance Download Tracked:', date);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'compliance_download', {
            document_type: 'checklist',
            month: date,
            event_category: 'Download',
            event_label: 'Compliance Checklist'
        });
    }
}

/**
 * Track reminder setting
 */
function trackReminderSet(date, title) {
    console.log('Reminder Set Tracked:', { date, title });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'reminder_set', {
            compliance_date: date,
            compliance_type: title,
            event_category: 'Reminder',
            event_label: 'Compliance Reminder'
        });
    }
}

/**
 * Track guide download
 */
function trackGuideDownload() {
    console.log('Guide Download Tracked');
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'guide_download', {
            document_type: 'financial_guide',
            event_category: 'Download',
            event_label: 'Financial Planning Guide'
        });
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initTaxCalculator,
        calculateTaxSavings,
        calculateCurrentTax,
        calculateOptimizedTax
    };
}