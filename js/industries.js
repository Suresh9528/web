/**
 * Industries Page JavaScript
 * Sura Corporate Solutions - Industries Served Page
 * Version: 1.0.0
 * Author: Sura Corporate Solutions
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Industries page initialized');
    
    // Initialize all industry page functionality
    initIndustryPage();
});

/**
 * Main initialization function for industries page
 */
function initIndustryPage() {
    // Initialize components
    initIndustryFilters();
    initTestimonialSlider();
    initIndustryStats();
    initIndustryCardAnimations();
    initIndustryNavigation();
    initIndustryContactForms();
    initIndustryIntersectionObserver();
    initIndustryImageLazyLoading();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize analytics for industry page
    initIndustryAnalytics();
}

/**
 * Initialize industry filtering functionality
 */
function initIndustryFilters() {
    const filterContainer = document.querySelector('.industry-filters');
    const industryCards = document.querySelectorAll('.industry-card');
    
    // If no filter container exists, create one
    if (!filterContainer && industryCards.length > 0) {
        createIndustryFilters();
    }
    
    // Get existing filters
    const filterButtons = document.querySelectorAll('.industry-filter');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const filterValue = this.getAttribute('data-filter');
                const filterText = this.textContent.trim();
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter cards with animation
                filterIndustryCards(filterValue);
                
                // Track filter usage
                trackIndustryFilter(filterText);
            });
        });
    }
}

/**
 * Create dynamic industry filters
 */
function createIndustryFilters() {
    const industryCards = document.querySelectorAll('.industry-card');
    if (industryCards.length === 0) return;
    
    // Create filter container
    const filterContainer = document.createElement('div');
    filterContainer.className = 'industry-filters';
    filterContainer.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
        margin: 40px 0;
        padding: 20px;
        background: var(--light-color);
        border-radius: var(--border-radius);
    `;
    
    // Create "All" filter
    const allFilter = createFilterButton('all', 'All Industries', true);
    filterContainer.appendChild(allFilter);
    
    // Extract unique industries from cards
    const industries = new Set();
    industryCards.forEach(card => {
        const industryType = card.getAttribute('data-industry') || 
                           card.querySelector('.industry-badge')?.textContent || 
                           'general';
        industries.add(industryType);
    });
    
    // Create filter buttons for each industry
    industries.forEach(industry => {
        if (industry !== 'general') {
            const button = createFilterButton(industry, formatIndustryName(industry), false);
            filterContainer.appendChild(button);
        }
    });
    
    // Insert before industries grid
    const industriesGrid = document.querySelector('.industries-grid');
    if (industriesGrid) {
        industriesGrid.parentNode.insertBefore(filterContainer, industriesGrid);
    }
    
    // Add styles for filters
    addFilterStyles();
}

/**
 * Create a filter button
 */
function createFilterButton(value, text, isActive = false) {
    const button = document.createElement('button');
    button.className = `industry-filter ${isActive ? 'active' : ''}`;
    button.setAttribute('data-filter', value);
    button.textContent = text;
    
    button.style.cssText = `
        padding: 10px 25px;
        background-color: ${isActive ? 'var(--primary-color)' : 'var(--light-color)'};
        color: ${isActive ? 'var(--white)' : 'var(--primary-color)'};
        border: 2px solid ${isActive ? 'var(--primary-color)' : 'var(--gray-light)'};
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.95rem;
    `;
    
    // Hover effect
    button.addEventListener('mouseenter', () => {
        if (!button.classList.contains('active')) {
            button.style.backgroundColor = 'var(--gray-light)';
            button.style.transform = 'translateY(-2px)';
        }
    });
    
    button.addEventListener('mouseleave', () => {
        if (!button.classList.contains('active')) {
            button.style.backgroundColor = 'var(--light-color)';
            button.style.transform = 'translateY(0)';
        }
    });
    
    return button;
}

/**
 * Filter industry cards based on selection
 */
function filterIndustryCards(filterValue) {
    const industryCards = document.querySelectorAll('.industry-card');
    let visibleCount = 0;
    
    industryCards.forEach((card, index) => {
        const industryType = card.getAttribute('data-industry') || 
                           card.querySelector('.industry-badge')?.textContent?.toLowerCase() || 
                           'general';
        
        const shouldShow = filterValue === 'all' || 
                          industryType.toLowerCase().includes(filterValue.toLowerCase()) ||
                          filterValue.toLowerCase().includes(industryType.toLowerCase());
        
        if (shouldShow) {
            // Show with animation
            setTimeout(() => {
                card.style.display = 'flex';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                requestAnimationFrame(() => {
                    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
            }, index * 50);
            
            visibleCount++;
        } else {
            // Hide with animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Show message if no results
    showNoResultsMessage(visibleCount === 0);
    
    return visibleCount;
}

/**
 * Format industry name for display
 */
function formatIndustryName(industry) {
    return industry
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Add filter styles
 */
function addFilterStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .industry-filters {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
            margin: 40px 0;
        }
        
        .industry-filter {
            padding: 10px 25px;
            background-color: var(--light-color);
            color: var(--primary-color);
            border: 2px solid var(--gray-light);
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .industry-filter:hover {
            background-color: var(--gray-light);
            transform: translateY(-2px);
        }
        
        .industry-filter.active {
            background-color: var(--primary-color);
            color: var(--white);
            border-color: var(--primary-color);
        }
        
        .no-results-message {
            text-align: center;
            padding: 40px;
            color: var(--gray-medium);
            font-size: 1.1rem;
            display: none;
        }
        
        .no-results-message.show {
            display: block;
            animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Show/hide no results message
 */
function showNoResultsMessage(show) {
    let message = document.querySelector('.no-results-message');
    
    if (!message) {
        message = document.createElement('div');
        message.className = 'no-results-message';
        message.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--gray-light); margin-bottom: 20px;"></i>
                <h3 style="color: var(--primary-color); margin-bottom: 10px;">No Industries Found</h3>
                <p>Try selecting a different filter or <a href="contact.html" style="color: var(--accent-color); text-decoration: underline;">contact us</a> for custom solutions.</p>
            </div>
        `;
        
        const industriesGrid = document.querySelector('.industries-grid');
        if (industriesGrid) {
            industriesGrid.parentNode.insertBefore(message, industriesGrid.nextSibling);
        }
    }
    
    if (show) {
        message.classList.add('show');
    } else {
        message.classList.remove('show');
    }
}

/**
 * Initialize testimonial slider
 */
function initTestimonialSlider() {
    const testimonialSlider = document.querySelector('.testimonials-slider');
    if (!testimonialSlider) return;
    
    const testimonials = testimonialSlider.querySelectorAll('.testimonial-card');
    if (testimonials.length <= 1) return;
    
    // Only convert to slider on mobile
    if (window.innerWidth <= 768) {
        createTestimonialSlider(testimonials);
    }
    
    // Update on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const currentSlider = document.querySelector('.testimonial-slider-container');
            if (window.innerWidth <= 768 && !currentSlider) {
                createTestimonialSlider(testimonials);
            } else if (window.innerWidth > 768 && currentSlider) {
                removeTestimonialSlider();
            }
        }, 250);
    });
}

/**
 * Create testimonial slider
 */
function createTestimonialSlider(testimonials) {
    // Remove existing slider if any
    removeTestimonialSlider();
    
    // Create slider container
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'testimonial-slider-container';
    sliderContainer.style.cssText = `
        position: relative;
        max-width: 600px;
        margin: 0 auto;
    `;
    
    // Create slider track
    const sliderTrack = document.createElement('div');
    sliderTrack.className = 'testimonial-slider-track';
    sliderTrack.style.cssText = `
        display: flex;
        transition: transform 0.5s ease;
        width: ${testimonials.length * 100}%;
    `;
    
    // Add testimonials to track
    testimonials.forEach(testimonial => {
        const slide = document.createElement('div');
        slide.className = 'testimonial-slide';
        slide.style.cssText = `
            width: 100%;
            flex-shrink: 0;
            padding: 0 15px;
            box-sizing: border-box;
        `;
        slide.appendChild(testimonial.cloneNode(true));
        sliderTrack.appendChild(slide);
    });
    
    sliderContainer.appendChild(sliderTrack);
    
    // Create navigation
    const navContainer = document.createElement('div');
    navContainer.className = 'testimonial-slider-nav';
    navContainer.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
        gap: 20px;
    `;
    
    // Prev button
    const prevButton = document.createElement('button');
    prevButton.className = 'slider-prev';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid var(--primary-color);
        background: var(--white);
        color: var(--primary-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    `;
    
    // Next button
    const nextButton = document.createElement('button');
    nextButton.className = 'slider-next';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.style.cssText = prevButton.style.cssText;
    
    // Dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider-dots';
    dotsContainer.style.cssText = `
        display: flex;
        gap: 8px;
    `;
    
    testimonials.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('data-slide', index);
        dot.style.cssText = `
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: none;
            background-color: ${index === 0 ? 'var(--primary-color)' : 'var(--gray-light)'};
            cursor: pointer;
            transition: background-color 0.3s ease;
        `;
        dotsContainer.appendChild(dot);
    });
    
    navContainer.appendChild(prevButton);
    navContainer.appendChild(dotsContainer);
    navContainer.appendChild(nextButton);
    
    // Replace original testimonials with slider
    const originalContainer = document.querySelector('.testimonials-slider');
    if (originalContainer) {
        originalContainer.style.display = 'none';
        originalContainer.parentNode.insertBefore(sliderContainer, originalContainer.nextSibling);
        originalContainer.parentNode.insertBefore(navContainer, sliderContainer.nextSibling);
    }
    
    // Initialize slider functionality
    let currentSlide = 0;
    const totalSlides = testimonials.length;
    
    function updateSlider() {
        const track = document.querySelector('.testimonial-slider-track');
        if (track) {
            track.style.transform = `translateX(-${currentSlide * (100 / totalSlides)}%)`;
        }
        
        // Update dots
        document.querySelectorAll('.slider-dot').forEach((dot, index) => {
            dot.style.backgroundColor = index === currentSlide ? 'var(--primary-color)' : 'var(--gray-light)';
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Update button states
        prevButton.disabled = currentSlide === 0;
        nextButton.disabled = currentSlide === totalSlides - 1;
        
        prevButton.style.opacity = currentSlide === 0 ? '0.5' : '1';
        nextButton.style.opacity = currentSlide === totalSlides - 1 ? '0.5' : '1';
    }
    
    // Event listeners
    prevButton.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
            trackTestimonialNavigation('prev');
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlider();
            trackTestimonialNavigation('next');
        }
    });
    
    // Dot click events
    document.querySelectorAll('.slider-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            currentSlide = parseInt(dot.getAttribute('data-slide'));
            updateSlider();
            trackTestimonialNavigation('dot', currentSlide);
        });
    });
    
    // Auto-advance slider
    let autoSlideInterval;
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Start auto slide
    startAutoSlide();
    
    // Pause on hover
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
    sliderContainer.addEventListener('touchstart', stopAutoSlide);
    sliderContainer.addEventListener('touchend', startAutoSlide);
    
    // Initialize
    updateSlider();
}

/**
 * Remove testimonial slider
 */
function removeTestimonialSlider() {
    const sliderContainer = document.querySelector('.testimonial-slider-container');
    const navContainer = document.querySelector('.testimonial-slider-nav');
    const originalContainer = document.querySelector('.testimonials-slider');
    
    if (sliderContainer) sliderContainer.remove();
    if (navContainer) navContainer.remove();
    if (originalContainer) originalContainer.style.display = 'grid';
}

/**
 * Initialize industry statistics animation
 */
function initIndustryStats() {
    const industryStats = document.querySelectorAll('.stat-number[data-count]');
    
    if (industryStats.length > 0) {
        // Create observer for stats
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    animateCounter(element);
                    observer.unobserve(element);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });
        
        industryStats.forEach(stat => {
            observer.observe(stat);
        });
    }
}

/**
 * Animate counter
 */
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const isPercentage = element.getAttribute('data-count').includes('%');
    
    function updateCounter() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(easeOutQuart * target);
        
        element.textContent = currentValue + (isPercentage ? '%' : '+');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (isPercentage ? '%' : '+');
        }
    }
    
    requestAnimationFrame(updateCounter);
}

/**
 * Initialize industry card animations
 */
function initIndustryCardAnimations() {
    const industryCards = document.querySelectorAll('.industry-card');
    
    if (industryCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        // Set initial state
        industryCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            observer.observe(card);
        });
    }
}

/**
 * Initialize industry navigation
 */
function initIndustryNavigation() {
    // Smooth scrolling for industry anchors
    document.querySelectorAll('a[href^="#industry-"], a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (!href.startsWith('#') || href === '#') return;
            
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
                
                // Track navigation
                trackIndustryNavigation(href);
            }
        });
    });
}

/**
 * Initialize industry contact forms
 */
function initIndustryContactForms() {
    const industryContactButtons = document.querySelectorAll('[href*="contact.html?industry="]');
    
    industryContactButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const industryMatch = href.match(/industry=([^&]*)/);
            
            if (industryMatch) {
                const industry = decodeURIComponent(industryMatch[1]);
                
                // Store industry in localStorage for contact form
                localStorage.setItem('selectedIndustry', industry);
                
                // Track industry selection
                trackIndustrySelection(industry);
                
                // Add visual feedback
                this.classList.add('clicked');
                setTimeout(() => {
                    this.classList.remove('clicked');
                }, 300);
            }
        });
    });
}

/**
 * Initialize intersection observer for animations
 */
function initIndustryIntersectionObserver() {
    // Observer for general animations
    const animatedElements = document.querySelectorAll('.feature-card, .challenge-card, .testimonial-card');
    
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
}

/**
 * Initialize image lazy loading
 */
function initIndustryImageLazyLoading() {
    const industryImages = document.querySelectorAll('.industry-image img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src') || img.src;
                    
                    // Load image
                    img.src = src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '0px 0px 100px 0px'
        });
        
        industryImages.forEach(img => {
            // Store original src in data-src
            if (!img.hasAttribute('data-src')) {
                img.setAttribute('data-src', img.src);
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
            }
            imageObserver.observe(img);
        });
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Window resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Reinitialize testimonial slider on resize
            initTestimonialSlider();
        }, 250);
    });
    
    // Industry card hover effects
    const industryCards = document.querySelectorAll('.industry-card');
    industryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = 'var(--shadow-lg)';
        });
        
        card.addEventListener('mouseleave', () => {
            if (!document.querySelector('.industry-filter.active') || 
                card.style.display !== 'none') {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'var(--shadow-md)';
            }
        });
    });
    
    // Service tag hover effects
    const serviceTags = document.querySelectorAll('.service-tag');
    serviceTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'scale(1.05)';
            tag.style.backgroundColor = 'var(--accent-color)';
            tag.style.color = 'var(--white)';
        });
        
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'scale(1)';
            tag.style.backgroundColor = 'var(--light-color)';
            tag.style.color = 'var(--primary-color)';
        });
    });
}

/**
 * Initialize industry analytics
 */
function initIndustryAnalytics() {
    // Track page view
    trackPageView();
    
    // Track time on page
    trackTimeOnPage();
    
    // Track industry interactions
    trackIndustryInteractions();
}

/**
 * Track page view
 */
function trackPageView() {
    const pageTitle = document.title;
    const pageUrl = window.location.pathname + window.location.search;
    
    console.log(`Industry Page View: ${pageTitle} - ${pageUrl}`);
    
    // Send to analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: pageTitle,
            page_location: pageUrl,
            page_path: pageUrl,
            industry_page: true
        });
    }
}

/**
 * Track time on page
 */
function trackTimeOnPage() {
    let startTime = Date.now();
    let maxScroll = 0;
    
    // Track scroll depth
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        maxScroll = Math.max(maxScroll, scrollPercent);
    });
    
    // Track on beforeunload
    window.addEventListener('beforeunload', () => {
        const timeSpent = Date.now() - startTime;
        const seconds = Math.floor(timeSpent / 1000);
        
        console.log(`Time on Industry Page: ${seconds} seconds, Max Scroll: ${Math.round(maxScroll)}%`);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'time_on_page', {
                time_spent: seconds,
                max_scroll: Math.round(maxScroll),
                page_title: document.title,
                page_path: window.location.pathname
            });
        }
    });
}

/**
 * Track industry interactions
 */
function trackIndustryInteractions() {
    // Track industry card clicks
    document.querySelectorAll('.industry-card a').forEach(link => {
        link.addEventListener('click', () => {
            const industry = link.closest('.industry-card').querySelector('h3').textContent;
            trackIndustryCardClick(industry);
        });
    });
    
    // Track challenge card views
    const challengeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const challenge = entry.target.querySelector('h3').textContent;
                trackChallengeView(challenge);
                challengeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.challenge-card').forEach(card => {
        challengeObserver.observe(card);
    });
}

/**
 * Track industry filter usage
 */
function trackIndustryFilter(filterName) {
    console.log(`Industry Filter Used: ${filterName}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'industry_filter', {
            filter_name: filterName,
            event_category: 'Filter',
            event_label: `Filter: ${filterName}`
        });
    }
}

/**
 * Track testimonial navigation
 */
function trackTestimonialNavigation(action, slideIndex = null) {
    console.log(`Testimonial Navigation: ${action} ${slideIndex !== null ? `to slide ${slideIndex}` : ''}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'testimonial_nav', {
            action: action,
            slide_index: slideIndex,
            event_category: 'Testimonial',
            event_label: `Navigation: ${action}`
        });
    }
}

/**
 * Track industry navigation
 */
function trackIndustryNavigation(targetId) {
    console.log(`Industry Navigation: ${targetId}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'industry_navigation', {
            target: targetId,
            event_category: 'Navigation',
            event_label: `Scroll to: ${targetId}`
        });
    }
}

/**
 * Track industry selection
 */
function trackIndustrySelection(industry) {
    console.log(`Industry Selected: ${industry}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'industry_selection', {
            industry: industry,
            event_category: 'Selection',
            event_label: `Selected: ${industry}`
        });
    }
}

/**
 * Track industry card click
 */
function trackIndustryCardClick(industry) {
    console.log(`Industry Card Clicked: ${industry}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'industry_card_click', {
            industry: industry,
            event_category: 'Engagement',
            event_label: `Card Click: ${industry}`
        });
    }
}

/**
 * Track challenge view
 */
function trackChallengeView(challenge) {
    console.log(`Challenge Viewed: ${challenge}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'challenge_view', {
            challenge: challenge,
            event_category: 'Content',
            event_label: `Challenge: ${challenge}`
        });
    }
}

/**
 * Error handling
 */
window.addEventListener('error', function(e) {
    console.error('Industries Page Error:', e.error);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            description: e.error.message,
            fatal: false,
            page_location: window.location.href
        });
    }
});

/**
 * Initialize on window load
 */
window.addEventListener('load', function() {
    // Check if all images loaded
    const images = document.querySelectorAll('img');
    let loadedCount = 0;
    
    images.forEach(img => {
        if (img.complete) {
            loadedCount++;
        } else {
            img.addEventListener('load', () => {
                loadedCount++;
                if (loadedCount === images.length) {
                    console.log('All images loaded');
                }
            });
            
            img.addEventListener('error', () => {
                console.warn('Image failed to load:', img.src);
                loadedCount++;
            });
        }
    });
    
    // Track page load performance
    if ('performance' in window) {
        setTimeout(() => {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            
            console.log(`Industry Page Load Time: ${loadTime}ms`);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    name: 'page_load',
                    value: loadTime,
                    event_category: 'Performance',
                    event_label: 'Industry Page Load'
                });
            }
        }, 0);
    }
});

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initIndustryPage,
        filterIndustryCards,
        animateCounter
    };
}