/**
 * Legal Pages JavaScript
 * Sura Corporate Solutions - Legal Pages Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize legal pages functionality
    initLegalPages();
});

/**
 * Initialize legal pages
 */
function initLegalPages() {
    // Table of Contents functionality
    initTableOfContents();
    
    // Section highlighting
    initSectionHighlighting();
    
    // Print functionality
    initPrintFunctionality();
    
    // Scroll to top for legal pages
    initLegalScrollTop();
    
    // Smooth scrolling for anchor links
    initLegalSmoothScrolling();
}

/**
 * Initialize Table of Contents
 */
function initTableOfContents() {
    const tocContainer = document.querySelector('.toc-container');
    if (!tocContainer) return;
    
    // Add expand/collapse functionality
    const tocHeader = document.createElement('div');
    tocHeader.className = 'toc-header';
    tocHeader.innerHTML = `
        <h3>Table of Contents <button class="toc-toggle"><i class="fas fa-chevron-down"></i></button></h3>
    `;
    
    tocContainer.insertBefore(tocHeader, tocContainer.querySelector('.toc-list').parentNode);
    
    const tocToggle = tocContainer.querySelector('.toc-toggle');
    const tocList = tocContainer.querySelector('.toc-list');
    
    tocToggle.addEventListener('click', function() {
        tocList.classList.toggle('collapsed');
        const icon = this.querySelector('i');
        if (tocList.classList.contains('collapsed')) {
            icon.className = 'fas fa-chevron-right';
        } else {
            icon.className = 'fas fa-chevron-down';
        }
    });
    
    // Add copy link functionality to each TOC item
    const tocLinks = tocContainer.querySelectorAll('.toc-list a');
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add smooth scrolling
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, `#${targetId}`);
                
                // Highlight the section
                highlightSection(targetId);
            }
        });
    });
}

/**
 * Initialize section highlighting
 */
function initSectionHighlighting() {
    const sections = document.querySelectorAll('.legal-section-content h2[id], .legal-section-content h3[id]');
    const tocLinks = document.querySelectorAll('.toc-list a');
    
    if (sections.length === 0 || tocLinks.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                highlightSection(id);
            }
        });
    }, {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0.1
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * Highlight section in TOC
 */
function highlightSection(sectionId) {
    const tocLinks = document.querySelectorAll('.toc-list a');
    
    tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
            
            // Scroll TOC item into view if needed
            const tocContainer = document.querySelector('.toc-container');
            if (tocContainer) {
                const tocRect = tocContainer.getBoundingClientRect();
                const linkRect = link.getBoundingClientRect();
                
                if (linkRect.bottom > tocRect.bottom || linkRect.top < tocRect.top) {
                    link.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    });
}

/**
 * Initialize print functionality
 */
function initPrintFunctionality() {
    // Add print button to legal pages
    const printButton = document.createElement('button');
    printButton.className = 'print-button';
    printButton.innerHTML = '<i class="fas fa-print"></i> Print This Page';
    printButton.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        cursor: pointer;
        box-shadow: var(--shadow-md);
        z-index: 999;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        transition: var(--transition);
    `;
    
    printButton.addEventListener('mouseenter', () => {
        printButton.style.transform = 'translateY(-2px)';
        printButton.style.boxShadow = 'var(--shadow-lg)';
    });
    
    printButton.addEventListener('mouseleave', () => {
        printButton.style.transform = 'translateY(0)';
        printButton.style.boxShadow = 'var(--shadow-md)';
    });
    
    printButton.addEventListener('click', printLegalPage);
    
    document.body.appendChild(printButton);
}

/**
 * Print legal page with optimized formatting
 */
function printLegalPage() {
    // Create a print-friendly version
    const originalTitle = document.title;
    const printWindow = window.open('', '_blank');
    
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${originalTitle} - Printed Version</title>
            <style>
                @media print {
                    body {
                        font-family: 'Georgia', serif;
                        font-size: 12pt;
                        line-height: 1.5;
                        color: #000;
                        margin: 0;
                        padding: 20px;
                    }
                    
                    h1, h2, h3, h4, h5, h6 {
                        font-family: 'Helvetica', sans-serif;
                        color: #000;
                        page-break-after: avoid;
                    }
                    
                    h1 {
                        font-size: 24pt;
                        margin-bottom: 20px;
                        border-bottom: 2px solid #000;
                        padding-bottom: 10px;
                    }
                    
                    h2 {
                        font-size: 18pt;
                        margin-top: 30px;
                        margin-bottom: 15px;
                        border-bottom: 1px solid #ccc;
                        padding-bottom: 5px;
                    }
                    
                    h3 {
                        font-size: 14pt;
                        margin-top: 25px;
                        margin-bottom: 10px;
                    }
                    
                    p, li {
                        font-size: 12pt;
                        margin-bottom: 10px;
                    }
                    
                    ul, ol {
                        margin-left: 30px;
                        margin-bottom: 20px;
                    }
                    
                    .legal-header {
                        text-align: center;
                        margin-bottom: 40px;
                        border-bottom: 2px solid #000;
                        padding-bottom: 20px;
                    }
                    
                    .legal-header h1 {
                        border-bottom: none;
                    }
                    
                    .last-updated {
                        text-align: center;
                        font-style: italic;
                        margin-bottom: 30px;
                    }
                    
                    .toc-container {
                        page-break-after: always;
                        margin-bottom: 40px;
                    }
                    
                    .toc-list li {
                        margin-bottom: 8px;
                    }
                    
                    .warning-box, .disclaimer-box {
                        background: #f8f9fa;
                        border-left: 4px solid #dc3545;
                        padding: 15px;
                        margin: 20px 0;
                        page-break-inside: avoid;
                    }
                    
                    .contact-info-box {
                        background: #f8f9fa;
                        border: 1px solid #ddd;
                        padding: 20px;
                        margin: 20px 0;
                        page-break-inside: avoid;
                    }
                    
                    a {
                        color: #000;
                        text-decoration: none;
                    }
                    
                    .no-print {
                        display: none;
                    }
                    
                    @page {
                        margin: 2cm;
                        size: A4;
                    }
                    
                    @page :first {
                        margin-top: 3cm;
                    }
                }
            </style>
        </head>
        <body>
            <div class="legal-header">
                <h1>${document.querySelector('h1').textContent}</h1>
                <p class="last-updated">${document.querySelector('.last-updated').textContent}</p>
            </div>
            
            ${document.querySelector('.legal-section-content').outerHTML}
            
            <div class="print-footer" style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 10pt; text-align: center;">
                <p>Printed from: ${window.location.href}</p>
                <p>Print Date: ${new Date().toLocaleDateString()}</p>
                <p>&copy; ${new Date().getFullYear()} Sura Corporate Solutions. All Rights Reserved.</p>
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Print after content loads
    printWindow.onload = function() {
        printWindow.print();
        printWindow.onafterprint = function() {
            printWindow.close();
        };
    };
}

/**
 * Initialize scroll to top for legal pages
 */
function initLegalScrollTop() {
    // Add back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'legal-back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 160px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--accent-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: var(--shadow-md);
        z-index: 999;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        transition: var(--transition);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    backToTopBtn.addEventListener('mouseenter', () => {
        backToTopBtn.style.transform = 'translateY(-3px)';
        backToTopBtn.style.boxShadow = 'var(--shadow-lg)';
    });
    
    backToTopBtn.addEventListener('mouseleave', () => {
        backToTopBtn.style.transform = 'translateY(0)';
        backToTopBtn.style.boxShadow = 'var(--shadow-md)';
    });
}

/**
 * Initialize smooth scrolling for legal pages
 */
function initLegalSmoothScrolling() {
    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, href);
                
                // Highlight the section
                if (href.startsWith('#')) {
                    highlightSection(href.substring(1));
                }
            }
        });
    });
}

/**
 * Initialize legal page search (if needed)
 */
function initLegalSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search in this document...';
    searchInput.className = 'legal-search';
    searchInput.style.cssText = `
        position: fixed;
        top: 120px;
        right: 30px;
        padding: 10px 15px;
        border: 2px solid var(--gray-light);
        border-radius: 25px;
        width: 250px;
        z-index: 998;
        box-shadow: var(--shadow-sm);
        transition: var(--transition);
    `;
    
    const searchContainer = document.createElement('div');
    searchContainer.style.position = 'relative';
    searchContainer.appendChild(searchInput);
    
    const searchIcon = document.createElement('i');
    searchIcon.className = 'fas fa-search';
    searchIcon.style.cssText = `
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--gray-medium);
        pointer-events: none;
    `;
    
    searchContainer.appendChild(searchIcon);
    document.querySelector('.legal-section').insertBefore(searchContainer, document.querySelector('.legal-content'));
    
    // Add search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm.length < 2) {
            clearSearchHighlights();
            return;
        }
        
        highlightSearchTerms(searchTerm);
    });
    
    // Clear highlights when search is cleared
    searchInput.addEventListener('search', clearSearchHighlights);
}

/**
 * Highlight search terms in legal content
 */
function highlightSearchTerms(searchTerm) {
    clearSearchHighlights();
    
    const legalContent = document.querySelector('.legal-section-content');
    if (!legalContent) return;
    
    const walker = document.createTreeWalker(
        legalContent,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let node;
    const matches = [];
    
    while (node = walker.nextNode()) {
        if (node.parentNode.nodeName === 'SCRIPT' || 
            node.parentNode.nodeName === 'STYLE' ||
            node.parentNode.classList.contains('search-highlight')) {
            continue;
        }
        
        const nodeText = node.textContent.toLowerCase();
        if (nodeText.includes(searchTerm)) {
            matches.push({
                node: node,
                text: node.textContent
            });
        }
    }
    
    // Highlight matches
    matches.forEach(match => {
        const span = document.createElement('span');
        span.className = 'search-highlight';
        span.innerHTML = match.text.replace(
            new RegExp(`(${searchTerm})`, 'gi'),
            '<mark>$1</mark>'
        );
        
        match.node.parentNode.replaceChild(span, match.node);
    });
    
    // Scroll to first match
    const firstMatch = document.querySelector('.search-highlight');
    if (firstMatch) {
        firstMatch.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

/**
 * Clear search highlights
 */
function clearSearchHighlights() {
    document.querySelectorAll('.search-highlight').forEach(highlight => {
        const parent = highlight.parentNode;
        while (highlight.firstChild) {
            parent.insertBefore(highlight.firstChild, highlight);
        }
        parent.removeChild(highlight);
    });
}

/**
 * Initialize legal page analytics
 */
function initLegalAnalytics() {
    // Track page views
    trackLegalPageView();
    
    // Track time spent reading
    trackReadingTime();
    
    // Track section visits
    trackSectionVisits();
}

/**
 * Track legal page view
 */
function trackLegalPageView() {
    const pageTitle = document.title;
    const pageUrl = window.location.pathname;
    
    console.log(`Legal Page View: ${pageTitle} - ${pageUrl}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: pageTitle,
            page_location: pageUrl,
            page_path: pageUrl,
            legal_page: true
        });
    }
}

/**
 * Track reading time
 */
function trackReadingTime() {
    let startTime = Date.now();
    let maxScroll = 0;
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        maxScroll = Math.max(maxScroll, scrollPercent);
    });
    
    window.addEventListener('beforeunload', () => {
        const timeSpent = Date.now() - startTime;
        const seconds = Math.floor(timeSpent / 1000);
        const minutes = Math.floor(seconds / 60);
        
        console.log(`Time spent on legal page: ${minutes} minutes, ${seconds % 60} seconds, Max scroll: ${Math.round(maxScroll)}%`);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'reading_time', {
                time_spent_seconds: seconds,
                max_scroll_percent: Math.round(maxScroll),
                page_title: document.title,
                page_path: window.location.pathname
            });
        }
    });
}

/**
 * Track section visits
 */
function trackSectionVisits() {
    const sections = document.querySelectorAll('.legal-section-content h2[id]');
    
    sections.forEach(section => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    const sectionTitle = entry.target.textContent;
                    
                    console.log(`Section visited: ${sectionTitle} (${sectionId})`);
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'section_view', {
                            section_id: sectionId,
                            section_title: sectionTitle,
                            page_title: document.title,
                            event_category: 'Legal Page'
                        });
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        observer.observe(section);
    });
}

// Initialize when page loads
window.addEventListener('load', function() {
    // Add additional styles for legal pages
    addLegalStyles();
});

/**
 * Add additional styles for legal pages
 */
function addLegalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Table of Contents */
        .toc-container {
            background: var(--light-color);
            padding: 25px;
            border-radius: var(--border-radius);
            margin: 30px 0;
            border-left: 4px solid var(--primary-color);
        }
        
        .toc-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            cursor: pointer;
        }
        
        .toc-header h3 {
            margin: 0;
            color: var(--primary-color);
        }
        
        .toc-toggle {
            background: none;
            border: none;
            color: var(--primary-color);
            cursor: pointer;
            font-size: 1.2rem;
            padding: 5px;
        }
        
        .toc-list {
            list-style: decimal;
            padding-left: 20px;
            margin: 0;
            transition: max-height 0.3s ease;
        }
        
        .toc-list.collapsed {
            max-height: 0;
            overflow: hidden;
        }
        
        .toc-list li {
            margin-bottom: 10px;
            line-height: 1.4;
        }
        
        .toc-list a {
            color: var(--gray-dark);
            text-decoration: none;
            transition: var(--transition);
            display: block;
            padding: 5px 10px;
            border-radius: 4px;
        }
        
        .toc-list a:hover {
            background: rgba(10, 38, 71, 0.05);
            color: var(--primary-color);
        }
        
        .toc-list a.active {
            background: var(--primary-color);
            color: white;
            font-weight: 600;
        }
        
        /* Warning and Disclaimer Boxes */
        .warning-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 25px;
            border-radius: var(--border-radius);
            margin: 30px 0;
            display: flex;
            gap: 20px;
            align-items: flex-start;
        }
        
        .warning-box.secondary {
            background: #d1ecf1;
            border-left-color: #17a2b8;
        }
        
        .warning-icon {
            font-size: 2rem;
            color: #ffc107;
            flex-shrink: 0;
        }
        
        .warning-box.secondary .warning-icon {
            color: #17a2b8;
        }
        
        .warning-content h3,
        .warning-content h4 {
            color: var(--primary-color);
            margin-top: 0;
            margin-bottom: 10px;
        }
        
        .warning-content p {
            color: var(--gray-dark);
            margin: 0;
            line-height: 1.6;
        }
        
        .disclaimer-box {
            background: #f8d7da;
            border-left: 4px solid #dc3545;
            padding: 20px;
            border-radius: var(--border-radius);
            margin: 25px 0;
        }
        
        .disclaimer-box p {
            color: #721c24;
            margin: 0;
            font-weight: 500;
            line-height: 1.6;
        }
        
        /* Contact Info Box */
        .contact-info-box {
            background: var(--light-color);
            border: 1px solid var(--gray-light);
            padding: 30px;
            border-radius: var(--border-radius);
            margin: 30px 0;
        }
        
        .contact-info-box p {
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .contact-info-box i {
            color: var(--accent-color);
            width: 20px;
        }
        
        .contact-info-box strong {
            color: var(--primary-color);
        }
        
        /* Acknowledgment Box */
        .acknowledgment-box {
            background: #e7f3ff;
            border-left: 4px solid var(--primary-color);
            padding: 25px;
            border-radius: var(--border-radius);
            margin: 30px 0;
        }
        
        .acknowledgment-box h3 {
            color: var(--primary-color);
            margin-top: 0;
            margin-bottom: 15px;
        }
        
        .acknowledgment-box ul {
            padding-left: 20px;
            margin: 15px 0;
        }
        
        .acknowledgment-box li {
            margin-bottom: 8px;
            color: var(--gray-dark);
        }
        
        /* Update Notice */
        .update-notice {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 20px;
            border-radius: var(--border-radius);
            margin: 30px 0;
        }
        
        .update-notice p {
            color: var(--gray-dark);
            margin: 0;
            line-height: 1.6;
        }
        
        /* Search Highlight */
        .search-highlight mark {
            background: #ffeb3b;
            padding: 2px 4px;
            border-radius: 3px;
        }
        
        /* Print Button Hover */
        .print-button:hover {
            background: var(--secondary-color);
            transform: translateY(-2px);
        }
        
        /* Responsive Adjustments */
        @media (max-width: 767px) {
            .toc-container {
                padding: 20px;
            }
            
            .warning-box {
                flex-direction: column;
                gap: 15px;
            }
            
            .warning-icon {
                font-size: 1.5rem;
            }
            
            .print-button {
                bottom: 80px;
                right: 20px;
                padding: 10px 15px;
                font-size: 0.9rem;
            }
            
            .legal-back-to-top {
                bottom: 140px;
                right: 20px;
                width: 45px;
                height: 45px;
            }
        }
        
        @media print {
            .print-button,
            .legal-back-to-top,
            .legal-search,
            .toc-toggle,
            .whatsapp-float {
                display: none !important;
            }
        }
    `;
    
    document.head.appendChild(style);
}