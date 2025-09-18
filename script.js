// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navbar = document.getElementById('navbar');
const themeToggle = document.getElementById('theme-toggle');
const backToTop = document.getElementById('back-to-top');
const loadingScreen = document.getElementById('loading-screen');
const contactForm = document.getElementById('contact-form');
const heroSubtitle = document.getElementById('hero-subtitle');

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        // Mobile menu toggle
        hamburger.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => this.handleScroll());

        // Active link highlighting
        window.addEventListener('scroll', () => this.updateActiveLink());

        // Smooth scrolling
        this.initSmoothScrolling();
    }

    toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Navbar scroll effect
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (scrollTop > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    }

    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Back to top button
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }
}

// Typing Animation
class TypingAnimation {
    constructor(element, texts, speed = 100, deleteSpeed = 50, delay = 2000) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.deleteSpeed = deleteSpeed;
        this.delay = delay;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.delay;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Skills Management
class SkillsManager {
    constructor() {
        this.init();
    }

    init() {
        const categories = document.querySelectorAll('.skill-category');
        const skillGroups = document.querySelectorAll('.skill-group');

        categories.forEach(category => {
            category.addEventListener('click', () => {
                const targetGroup = category.getAttribute('data-category');
                
                // Update active category
                categories.forEach(cat => cat.classList.remove('active'));
                category.classList.add('active');

                // Update active skill group
                skillGroups.forEach(group => {
                    group.classList.remove('active');
                    if (group.getAttribute('data-group') === targetGroup) {
                        group.classList.add('active');
                    }
                });
            });
        });
    }
}

// Statistics Counter
class StatsCounter {
    constructor() {
        this.init();
    }

    init() {
        const stats = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }
}

// Form Management
class FormManager {
    constructor() {
        this.init();
    }

    init() {
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Real-time validation
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearError(input));
            });
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        const isValid = this.validateForm(data);
        if (!isValid) return;

        // Show loading state
        this.setLoadingState(true);

        try {
            // Create email body
            const emailBody = `Name: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`;
            
            // Create mailto link
            const mailtoLink = `mailto:ayahady052@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(emailBody)}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            this.showNotification('Email client opened! Please send the message from your email app.', 'success');
            contactForm.reset();
        } catch (error) {
            this.showNotification('Sorry, there was an error. Please try sending an email directly to ayahady052@gmail.com', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    validateForm(data) {
        let isValid = true;
        
        // Name validation
        if (!data.name || data.name.trim().length < 2) {
            this.showFieldError('name', 'Please enter a valid name (at least 2 characters)');
            isValid = false;
        }

        // Email validation
        if (!data.email || !this.isValidEmail(data.email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Subject validation
        if (!data.subject || data.subject.trim().length < 3) {
            this.showFieldError('subject', 'Please enter a subject (at least 3 characters)');
            isValid = false;
        }

        // Message validation
        if (!data.message || data.message.trim().length < 10) {
            this.showFieldError('message', 'Please enter a message (at least 10 characters)');
            isValid = false;
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const name = field.name;

        switch (name) {
            case 'name':
                if (value.length < 2) {
                    this.showFieldError(name, 'Name must be at least 2 characters');
                    return false;
                }
                break;
            case 'email':
                if (!this.isValidEmail(value)) {
                    this.showFieldError(name, 'Please enter a valid email address');
                    return false;
                }
                break;
            case 'subject':
                if (value.length < 3) {
                    this.showFieldError(name, 'Subject must be at least 3 characters');
                    return false;
                }
                break;
            case 'message':
                if (value.length < 10) {
                    this.showFieldError(name, 'Message must be at least 10 characters');
                    return false;
                }
                break;
        }

        this.clearError(field);
        return true;
    }

    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorElement = field.parentNode.querySelector('.form-error');
        
        field.style.borderColor = 'var(--error-color)';
        errorElement.textContent = message;
    }

    clearError(field) {
        const errorElement = field.parentNode.querySelector('.form-error');
        field.style.borderColor = 'var(--border-color)';
        errorElement.textContent = '';
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setLoadingState(loading) {
        const submitBtn = contactForm.querySelector('.btn-submit');
        if (loading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                </div>
                <div class="notification-text">
                    <strong>${type === 'success' ? 'Success!' : 'Info!'}</strong>
                    <p>${message}</p>
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add styles
        this.addNotificationStyles();

        // Add to page
        document.body.appendChild(notification);

        // Close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => notification.remove());

        // Auto remove
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
    }

    addNotificationStyles() {
        if (document.getElementById('notification-styles')) return;

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                max-width: 400px;
                background: white;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-xl);
                z-index: 10000;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border-left: 4px solid var(--success-color);
            }
            
            .notification.error {
                border-left-color: var(--error-color);
            }
            
            .notification-content {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                padding: 1.5rem;
            }
            
            .notification-icon {
                flex-shrink: 0;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
            }
            
            .notification.success .notification-icon {
                background: rgba(16, 185, 129, 0.1);
                color: var(--success-color);
            }
            
            .notification.error .notification-icon {
                background: rgba(239, 68, 68, 0.1);
                color: var(--error-color);
            }
            
            .notification-text strong {
                display: block;
                color: var(--text-primary);
                margin-bottom: 0.25rem;
            }
            
            .notification-text p {
                color: var(--text-secondary);
                margin: 0;
                font-size: 0.9rem;
                line-height: 1.4;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--text-light);
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: var(--transition);
                margin-left: auto;
                flex-shrink: 0;
            }
            
            .notification-close:hover {
                background: var(--bg-tertiary);
                color: var(--text-primary);
            }
            
            @media (max-width: 480px) {
                .notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Intersection Observer for Animations
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Elements to animate
        const animateElements = document.querySelectorAll(`
            .hero-text,
            .hero-image,
            .about-intro,
            .about-highlights,
            .about-stats,
            .skill-category,
            .skill-item,
            .project-card,
            .timeline-item,
            .contact-method,
            .contact-form
        `);

        animateElements.forEach(el => observer.observe(el));
    }
}

// Parallax Effects
class ParallaxManager {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleParallax());
    }

    handleParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-shapes');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// Loading Manager
class LoadingManager {
    constructor() {
        this.init();
    }

    init() {
        // Hide loading screen when page is loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                document.body.style.overflow = '';
            }, 1000);
        });

        // Show loading screen initially
        document.body.style.overflow = 'hidden';
    }
}

// Project Card Interactions
class ProjectManager {
    constructor() {
        this.init();
    }

    init() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => this.handleMouseEnter(e));
            card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        });
    }

    handleMouseEnter(e) {
        const card = e.currentTarget;
        card.style.transition = 'transform 0.1s ease-out';
    }

    handleMouseLeave(e) {
        const card = e.currentTarget;
        card.style.transition = 'transform 0.3s ease-out';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(-10px)';
    }

    handleMouseMove(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    new LoadingManager();
    new ThemeManager();
    new NavigationManager();
    new SkillsManager();
    new StatsCounter();
    new FormManager();
    new AnimationManager();
    new ParallaxManager();
    new ProjectManager();

    // Initialize typing animation
    if (heroSubtitle) {
        new TypingAnimation(heroSubtitle, [
            'Full Stack .NET Developer',
            'Problem Solver',
            'Code Enthusiast',
            'Continuous Learner'
        ]);
    }

    // Console message
    console.log(`
    🚀 Welcome to Aya's Portfolio!
    📧 Contact: ayahady052@gmail.com
    💼 LinkedIn: https://www.linkedin.com/in/aya-hady/
    🔧 Built with HTML, CSS, and JavaScript
    🎨 Designed with passion and attention to detail
    `);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = '👋 Come back soon! - Aya El-Sharbasy';
    } else {
        document.title = 'Aya Mohamed El-Sharbasy - Full Stack .NET Developer';
    }
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const nav = new NavigationManager();
        nav.closeMobileMenu();
    }
    
    // Enter key on focused elements
    if (e.key === 'Enter' && e.target.classList.contains('social-link')) {
        e.target.click();
    }
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
            console.log(`Page load time: ${entry.loadEventEnd - entry.loadEventStart}ms`);
        }
    }
});

if (PerformanceObserver.supportedEntryTypes.includes('navigation')) {
    perfObserver.observe({ entryTypes: ['navigation'] });
}
