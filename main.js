/**
 * HennaFast Landing Page JavaScript
 * Handles interactivity, smooth scrolling, and form submissions
 */

class HennaFastApp {
    constructor() {
      this.initializeComponents();
      this.setupEventListeners();
      this.initializeSmoothScroll();
      this.initializeFAQ();
      this.initializeForm();
      this.handleNavbarScroll();
      this.initializeScrollAnimations();
    }
  
    /**
     * Initialize DOM element references
     */
    initializeComponents() {
      this.header = document.querySelector('.header');
      this.navLinks = document.querySelectorAll('.header__nav-link');
      this.menuToggle = document.querySelector('.header__menu-toggle');
      this.nav = document.querySelector('.header__nav');
      this.faqItems = document.querySelectorAll('.faq__item');
      this.form = document.getElementById('demo-form');
      this.formMessage = document.getElementById('form-message');
      this.scrollButtons = document.querySelectorAll('[data-scroll-to]');
    }
  
    /**
     * Setup event listeners
     */
    setupEventListeners() {
      // Mobile menu toggle
      if (this.menuToggle) {
        this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
      }
  
      // Close mobile menu on link click
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (this.nav.classList.contains('open')) {
            this.nav.classList.remove('open');
          }
        });
      });
  
      // Window scroll for header styling
      window.addEventListener('scroll', () => this.handleNavbarScroll());
  
      // Active nav link highlighting
      window.addEventListener('scroll', () => this.highlightActiveSection());
  
      // Close mobile menu on outside click
      document.addEventListener('click', (e) => {
        if (this.nav && this.nav.classList.contains('open') && 
            !this.nav.contains(e.target) && !this.menuToggle.contains(e.target)) {
          this.nav.classList.remove('open');
        }
      });
  
      // ESC key to close mobile menu
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.nav && this.nav.classList.contains('open')) {
          this.nav.classList.remove('open');
          this.menuToggle.focus();
        }
      });
    }
  
    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
      this.nav.classList.toggle('open');
      const isOpen = this.nav.classList.contains('open');
      this.menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    }
  
    /**
     * Initialize smooth scrolling for anchor links and buttons
     */
    initializeSmoothScroll() {
      // Handle navigation links
      this.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href.startsWith('#')) {
            e.preventDefault();
            this.smoothScrollTo(href);
          }
        });
      });
  
      // Handle buttons with data-scroll-to attribute
      this.scrollButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const target = button.dataset.scrollTo;
          if (target) {
            this.smoothScrollTo(target);
          }
        });
      });
    }
  
    /**
     * Smooth scroll to target element
     * @param {string} targetSelector - CSS selector for target element
     */
    smoothScrollTo(targetSelector) {
      const target = document.querySelector(targetSelector);
      if (target) {
        const headerHeight = this.header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  
    /**
     * Initialize FAQ accordion functionality
     */
    initializeFAQ() {
      this.faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        
        question.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');
          
          // Close all FAQ items
          this.faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('open');
              otherItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
            }
          });
          
          // Toggle current item
          item.classList.toggle('open');
          question.setAttribute('aria-expanded', !isOpen);
        });
      });
    }
  
    /**
     * Initialize form submission handling
     */
    initializeForm() {
      if (!this.form) return;
  
      this.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!this.validateForm(data)) {
          return;
        }
        
        // Show loading state
        const submitBtn = this.form.querySelector('.form__submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        try {
          // Simulate API call (replace with actual endpoint)
          const response = await this.submitForm(data);
          
          if (response.success) {
            this.showMessage('¡Gracias! Nos pondremos en contacto en las próximas 48 horas.', 'success');
            this.form.reset();
          } else {
            this.showMessage('Hubo un error al enviar el formulario. Por favor, intente nuevamente.', 'error');
          }
        } catch (error) {
          console.error('Form submission error:', error);
          this.showMessage('Error de conexión. Por favor, intente más tarde.', 'error');
        } finally {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      });
  
      // Add input validation feedback
      const inputs = this.form.querySelectorAll('input[required]');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
      });
    }
  
    /**
     * Validate form data
     * @param {Object} data - Form data object
     * @returns {boolean} - Validation result
     */
    validateForm(data) {
      const errors = [];
      
      if (!data.fullname || data.fullname.trim().length < 2) {
        errors.push('Por favor, ingrese su nombre completo');
      }
      
      if (!data.salon || data.salon.trim().length < 2) {
        errors.push('Por favor, ingrese el nombre del salón');
      }
      
      if (!data.email || !this.isValidEmail(data.email)) {
        errors.push('Por favor, ingrese un email válido');
      }
      
      if (!data.phone || data.phone.trim().length < 8) {
        errors.push('Por favor, ingrese un teléfono válido');
      }
      
      if (errors.length > 0) {
        this.showMessage(errors.join('<br>'), 'error');
        return false;
      }
      
      return true;
    }
  
    /**
     * Validate individual field
     * @param {HTMLElement} field - Input field to validate
     */
    validateField(field) {
      const value = field.value.trim();
      const name = field.name;
      
      field.classList.remove('error');
      
      if (field.hasAttribute('required') && !value) {
        field.classList.add('error');
        return false;
      }
      
      if (name === 'email' && value && !this.isValidEmail(value)) {
        field.classList.add('error');
        return false;
      }
      
      return true;
    }
  
    /**
     * Check if email is valid
     * @param {string} email - Email address
     * @returns {boolean} - Validation result
     */
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  
    /**
     * Submit form data (mock implementation)
     * @param {Object} data - Form data
     * @returns {Promise} - Submission result
     */
    async submitForm(data) {
      // TODO: Replace with actual API endpoint
      console.log('Form data submitted:', data);
      
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mock success response
          resolve({ success: true });
          
          // For production, use actual fetch:
          // fetch('/api/contact', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify(data)
          // })
        }, 1000);
      });
    }
  
    /**
     * Show form message
     * @param {string} message - Message text
     * @param {string} type - Message type (success/error)
     */
    showMessage(message, type) {
      if (!this.formMessage) return;
      
      this.formMessage.innerHTML = message;
      this.formMessage.className = `form__message ${type}`;
      this.formMessage.style.display = 'block';
      
      // Auto-hide success messages
      if (type === 'success') {
        setTimeout(() => {
          this.formMessage.style.display = 'none';
        }, 5000);
      }
      
      // Focus on message for screen readers
      this.formMessage.focus();
    }
  
    /**
     * Handle navbar scroll effects
     */
    handleNavbarScroll() {
      const scrolled = window.pageYOffset > 50;
      
      if (scrolled) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
    }
  
    /**
     * Highlight active navigation link based on scroll position
     */
    highlightActiveSection() {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.pageYOffset + this.header.offsetHeight + 100;
      
      sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        const navLink = document.querySelector(`.header__nav-link[href="#${id}"]`);
        
        if (navLink) {
          if (scrollPosition >= top && scrollPosition <= bottom) {
            this.navLinks.forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
          }
        }
      });
    }

    /**
     * Initialize scroll-triggered animations using Intersection Observer
     */
    initializeScrollAnimations() {
      // Check if Intersection Observer is supported
      if (!('IntersectionObserver' in window)) {
        console.warn('Intersection Observer not supported');
        return;
      }

      // Configuration for the observer
      const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Trigger when element is 100px from bottom of viewport
        threshold: 0.1 // Trigger when 10% of element is visible
      };

      // Callback function for when elements intersect
      const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Add the animation class
            entry.target.classList.add('animate-on-scroll');
            
            // Optional: Stop observing after animation to improve performance
            // observer.unobserve(entry.target);
          }
        });
      };

      // Create the observer
      const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

      // Define elements to animate with their animation types
      const animationTargets = [
        // Social proof items - fade in up
        { selector: '.social-proof__item', animation: 'animate-fade-in-up' },
        
        // Benefit cards - scale in
        { selector: '.benefit-card', animation: 'animate-scale-in' },
        
        // Step cards - fade in from different directions
        { selector: '.step-card:nth-child(1)', animation: 'animate-fade-in-left' },
        { selector: '.step-card:nth-child(2)', animation: 'animate-fade-in-up' },
        { selector: '.step-card:nth-child(3)', animation: 'animate-fade-in-right' },
        
        // ROI cards
        { selector: '.roi__card--before', animation: 'animate-fade-in-left' },
        { selector: '.roi__card--after', animation: 'animate-fade-in-right' },
        
        // FAQ items - fade in up
        { selector: '.faq__item', animation: 'animate-fade-in-up' },
        
        // Section titles - fade in down
        { selector: '.section-title', animation: 'animate-fade-in-down' },
        
        // Social proof title
        { selector: '.social-proof__title', animation: 'animate-fade-in-down' },
        
        // ROI intro
        { selector: '.roi__intro', animation: 'animate-fade-in-up' },
        
        // Contact form
        { selector: '.contact__form', animation: 'animate-scale-in' },
        
        // How it works image
        { selector: '.how-it-works__image', animation: 'animate-fade-in-up' }
      ];

      // Apply animations to elements
      animationTargets.forEach(({ selector, animation }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          // Add the animation class type
          element.classList.add(animation);
          // Start observing the element
          scrollObserver.observe(element);
        });
      });

      // Store observer for potential cleanup
      this.scrollObserver = scrollObserver;
    }
  }
  
  // Initialize app when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const app = new HennaFastApp();
    
    // Make app instance available globally for debugging
    window.hennaFastApp = app;
  });
  
  // Performance optimization: lazy load images
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Only load if src is set
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }
  
  // Add CSS error class styles dynamically
  const style = document.createElement('style');
  style.textContent = `
    input.error {
      border-color: var(--brand-cta) !important;
      box-shadow: 0 0 0 3px rgba(217, 140, 44, 0.1) !important;
    }
  `;
  document.head.appendChild(style);
  /* --- LÓGICA CALCULADORA ROI (ACTUALIZADA) --- */
document.addEventListener('DOMContentLoaded', () => {
    const priceInput = document.getElementById('service-price');
    const clientsInput = document.getElementById('clients-range');
    const clientsDisplay = document.getElementById('clients-display');
    
    // Elementos de Texto
    const hoursSpentEl = document.getElementById('hours-spent');
    const hoursSavedEl = document.getElementById('hours-saved');
    
    // Elementos de Dinero
    const currentRevEl = document.getElementById('current-revenue');
    const potentialRevEl = document.getElementById('potential-revenue');
    const extraRevEl = document.getElementById('extra-revenue');

    // Formateador de Moneda (Argentina)
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const calculateROI = () => {
        const price = parseFloat(priceInput.value) || 0;
        const clientsWeek = parseInt(clientsInput.value) || 0;

        // Actualizar visualización del slider
        clientsDisplay.textContent = clientsWeek;

        // 1. Lógica de TIEMPO
        // Tradicional: 3 horas por cliente
        const totalHoursTraditional = clientsWeek * 3;
        // HennaFast: 1 hora por cliente
        const totalHoursFast = clientsWeek * 1;
        
        hoursSpentEl.textContent = totalHoursTraditional;
        hoursSavedEl.textContent = totalHoursFast;

        // 2. Lógica de DINERO (Mensual = 4 semanas)
        const currentMonthly = price * clientsWeek * 4;

        // Proyección: En las 2 horas que te sobran por cada cliente, 
        // asumimos que metes AL MENOS 1 servicio más del mismo valor.
        // Por lo tanto, duplicas la facturación de ese bloque de tiempo.
        const potentialMonthly = currentMonthly * 2; 
        
        const extraMonthly = potentialMonthly - currentMonthly;

        // Actualizar DOM
        currentRevEl.textContent = formatMoney(currentMonthly);
        potentialRevEl.textContent = formatMoney(potentialMonthly);
        extraRevEl.textContent = `+ ${formatMoney(extraMonthly)}`;
    };

    // Event Listeners
    priceInput.addEventListener('input', calculateROI);
    clientsInput.addEventListener('input', calculateROI);

    // Inicializar
    calculateROI();
});