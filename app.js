// Digital Rain Effect
class DigitalRain {
    constructor() {
        this.canvas = document.getElementById('digital-rain');
        this.ctx = this.canvas.getContext('2d');
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        this.charArray = this.chars.split('');
        this.drops = [];
        this.fontSize = 14;
        this.columns = 0;
        
        this.init();
        this.animate();
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = this.canvas.width / this.fontSize;
        
        // Initialize drops
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * -100;
        }
    }
    
    draw() {
        // Semi-transparent black background for trail effect
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set text style
        this.ctx.fillStyle = '#00ffff';
        this.ctx.font = `${this.fontSize}px monospace`;
        
        // Draw characters
        for (let i = 0; i < this.drops.length; i++) {
            const char = this.charArray[Math.floor(Math.random() * this.charArray.length)];
            this.ctx.fillText(char, i * this.fontSize, this.drops[i] * this.fontSize);
            
            // Reset drop if it goes off screen
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            this.drops[i]++;
        }
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
    
    resize() {
        this.init();
    }
}

// Particle System for Mouse Interaction
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Create particles on mouse move
            if (Math.random() > 0.8) {
                this.createParticle(this.mouse.x, this.mouse.y);
            }
        });
        
        this.animate();
    }
    
    createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: #00ffff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            box-shadow: 0 0 10px #00ffff;
            left: ${x}px;
            top: ${y}px;
        `;
        
        document.body.appendChild(particle);
        
        // Animate particle
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        const life = 60; // frames
        let frame = 0;
        
        const animate = () => {
            frame++;
            const progress = frame / life;
            const x = parseInt(particle.style.left) + Math.cos(angle) * speed;
            const y = parseInt(particle.style.top) + Math.sin(angle) * speed;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.opacity = 1 - progress;
            particle.style.transform = `scale(${1 - progress})`;
            
            if (frame < life) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
    }
}

// Typing Effect
class TypingEffect {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.currentText = '';
        
        this.type();
    }
    
    type() {
        const fullText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.currentText = fullText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.currentText = fullText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        this.element.textContent = this.currentText;
        
        let typeSpeed = this.speed;
        
        if (this.isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!this.isDeleting && this.charIndex === fullText.length) {
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Navigation System
class Navigation {
    constructor() {
        this.channels = document.querySelectorAll('.channel');
        this.sections = document.querySelectorAll('.content-section');
        this.buttons = document.querySelectorAll('[data-section]');
        this.hamburgerBtn = document.getElementById('hamburger-toggle');
        this.sidebar = document.getElementById('sidebar');
        this.mobileOverlay = document.getElementById('mobile-overlay');
        this.isMobileMenuOpen = false;
        
        this.init();
    }
    
    init() {
        // Channel navigation
        this.channels.forEach(channel => {
            channel.addEventListener('click', () => {
                const sectionName = channel.getAttribute('data-section');
                this.showSection(sectionName);
                this.setActiveChannel(channel);
                
                // Close mobile menu when navigating
                if (this.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        });
        
        // Button navigation
        this.buttons.forEach(button => {
            if (!button.classList.contains('channel')) {
                button.addEventListener('click', () => {
                    const sectionName = button.getAttribute('data-section');
                    this.showSection(sectionName);
                    this.setActiveChannelBySection(sectionName);
                });
            }
        });
        
        // Hamburger menu functionality
        if (this.hamburgerBtn) {
            this.hamburgerBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Mobile overlay click to close menu
        if (this.mobileOverlay) {
            this.mobileOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }
        
        // Close menu on window resize if mobile menu is open
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }
    
    toggleMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.isMobileMenuOpen = true;
        this.hamburgerBtn.classList.add('active');
        this.sidebar.classList.add('mobile-open');
        this.mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    closeMobileMenu() {
        this.isMobileMenuOpen = false;
        this.hamburgerBtn.classList.remove('active');
        this.sidebar.classList.remove('mobile-open');
        this.mobileOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    showSection(sectionName) {
        // Hide all sections
        this.sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Trigger section-specific animations
            this.triggerSectionAnimations(sectionName);
        }
    }
    
    setActiveChannel(activeChannel) {
        this.channels.forEach(channel => {
            channel.classList.remove('active');
        });
        activeChannel.classList.add('active');
    }
    
    setActiveChannelBySection(sectionName) {
        const channel = document.querySelector(`.channel[data-section="${sectionName}"]`);
        if (channel) {
            this.setActiveChannel(channel);
        }
    }
    
    triggerSectionAnimations(sectionName) {
        // Add specific animations for different sections
        switch (sectionName) {
            case 'skills':
                this.animateSkillBars();
                break;
            case 'projects':
                this.animateProjectCards();
                break;
        }
    }
    
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            const width = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 1s ease-out';
                bar.style.width = width;
            }, index * 100);
        });
    }
    
    animateProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
}

// Glitch Effects
class GlitchEffects {
    constructor() {
        this.init();
    }
    
    init() {
        // Add random glitch effects to glitch elements
        const glitchElements = document.querySelectorAll('.glitch');
        
        glitchElements.forEach(element => {
            setInterval(() => {
                if (Math.random() > 0.95) {
                    this.triggerGlitch(element);
                }
            }, 100);
        });
        
        // Add glitch effect to cyber buttons on click
        const cyberButtons = document.querySelectorAll('.cyber-btn');
        cyberButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.triggerButtonGlitch(button);
            });
        });
    }
    
    triggerGlitch(element) {
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = 'glitch 0.3s';
    }
    
    triggerButtonGlitch(button) {
        button.classList.add('glitch-active');
        
        // Create temporary glitch overlay
        const glitchOverlay = document.createElement('div');
        glitchOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, #00ffff, transparent);
            opacity: 0.8;
            animation: glitch-sweep 0.3s ease-out;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.appendChild(glitchOverlay);
        
        setTimeout(() => {
            glitchOverlay.remove();
            button.classList.remove('glitch-active');
        }, 300);
    }
}

// Audio System (Optional - Cyberpunk Sound Effects)
class AudioSystem {
    constructor() {
        this.context = null;
        this.init();
    }
    
    init() {
        // Initialize Web Audio API for sound effects
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
        
        // Add hover sound effects
        this.addHoverSounds();
        this.addClickSounds();
    }
    
    addHoverSounds() {
        const interactiveElements = document.querySelectorAll('.channel, .cyber-btn, .project-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.playHoverSound();
            });
        });
    }
    
    addClickSounds() {
        const clickableElements = document.querySelectorAll('.cyber-btn, .channel, .cyber-link');
        
        clickableElements.forEach(element => {
            element.addEventListener('click', () => {
                this.playClickSound();
            });
        });
    }
    
    playHoverSound() {
        if (!this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.frequency.setValueAtTime(800, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.context.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.1);
    }
    
    playClickSound() {
        if (!this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.frequency.setValueAtTime(1200, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, this.context.currentTime + 0.05);
        
        gainNode.gain.setValueAtTime(0.15, this.context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.05);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.05);
    }
}

// Scroll Effects
class ScrollEffects {
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
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe cards and other elements
        const animatedElements = document.querySelectorAll('.cyber-card, .skill-item, .contact-item');
        animatedElements.forEach(el => observer.observe(el));
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.lastTime = performance.now();
        this.frameCount = 0;
        
        this.init();
    }
    
    init() {
        // Create performance display (optional, for debugging)
        if (window.location.search.includes('debug')) {
            this.createDebugDisplay();
        }
        
        this.monitor();
    }
    
    createDebugDisplay() {
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ffff;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            border: 1px solid #00ffff;
        `;
        document.body.appendChild(debugPanel);
    }
    
    monitor() {
        const currentTime = performance.now();
        this.frameCount++;
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            const debugPanel = document.getElementById('debug-panel');
            if (debugPanel) {
                debugPanel.innerHTML = `
                    FPS: ${this.fps}<br>
                    Memory: ${(performance.memory?.usedJSHeapSize / 1024 / 1024).toFixed(2) || 'N/A'} MB
                `;
            }
        }
        
        requestAnimationFrame(() => this.monitor());
    }
}

// Cyberpunk Loader
class CyberpunkLoader {
    constructor() {
        this.container = document.getElementById('cyberpunk-loader');
        this.progress = document.querySelector('.loader-progress');
        this.percentage = document.querySelector('.loader-percentage');
        this.loadingText = document.querySelector('.loading-text');
        this.matrixCanvas = document.getElementById('loader-matrix');
        this.matrixCtx = this.matrixCanvas ? this.matrixCanvas.getContext('2d') : null;
        
        this.currentProgress = 0;
        this.targetProgress = 0;
        this.isLoading = true;
        this.loadingSteps = [
            { progress: 20, text: 'INITIALIZING SYSTEM...' },
            { progress: 40, text: 'LOADING MATRIX...' },
            { progress: 60, text: 'CONNECTING TO MAINFRAME...' },
            { progress: 80, text: 'ESTABLISHING NEURAL LINK...' },
            { progress: 95, text: 'CYBERPUNK PROTOCOL ACTIVE...' },
            { progress: 100, text: 'SYSTEM ONLINE' }
        ];
        this.currentStep = 0;
        
        this.init();
    }
    
    init() {
        if (this.matrixCanvas) {
            this.setupMatrix();
            this.animateMatrix();
        }
        this.startLoading();
    }
    
    setupMatrix() {
        this.matrixCanvas.width = window.innerWidth;
        this.matrixCanvas.height = window.innerHeight;
        this.matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
        this.matrixColumns = this.matrixCanvas.width / 14;
        this.matrixDrops = [];
        
        for (let i = 0; i < this.matrixColumns; i++) {
            this.matrixDrops[i] = Math.random() * -100;
        }
    }
    
    animateMatrix() {
        if (!this.isLoading || !this.matrixCtx) return;
        
        this.matrixCtx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        this.matrixCtx.fillRect(0, 0, this.matrixCanvas.width, this.matrixCanvas.height);
        
        this.matrixCtx.fillStyle = '#00ffff';
        this.matrixCtx.font = '14px monospace';
        
        for (let i = 0; i < this.matrixDrops.length; i++) {
            const char = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
            this.matrixCtx.fillText(char, i * 14, this.matrixDrops[i] * 14);
            
            if (this.matrixDrops[i] * 14 > this.matrixCanvas.height && Math.random() > 0.975) {
                this.matrixDrops[i] = 0;
            }
            this.matrixDrops[i]++;
        }
        
        requestAnimationFrame(() => this.animateMatrix());
    }
    
    startLoading() {
        const loadNextStep = () => {
            if (this.currentStep < this.loadingSteps.length) {
                const step = this.loadingSteps[this.currentStep];
                this.targetProgress = step.progress;
                this.loadingText.textContent = step.text;
                this.currentStep++;
                
                // Animate progress
                const animateProgress = () => {
                    if (this.currentProgress < this.targetProgress) {
                        this.currentProgress += Math.random() * 3 + 1;
                        if (this.currentProgress > this.targetProgress) {
                            this.currentProgress = this.targetProgress;
                        }
                        
                        this.progress.style.width = `${this.currentProgress}%`;
                        this.percentage.textContent = `${Math.floor(this.currentProgress)}%`;
                        
                        if (this.currentProgress < this.targetProgress) {
                            requestAnimationFrame(animateProgress);
                        } else {
                            setTimeout(loadNextStep, 500 + Math.random() * 1000);
                        }
                    }
                };
                
                animateProgress();
            } else {
                setTimeout(() => this.hideLoader(), 1000);
            }
        };
        
        setTimeout(loadNextStep, 500);
    }
    
    hideLoader() {
        this.isLoading = false;
        this.container.classList.add('hidden');
        setTimeout(() => {
            this.container.style.display = 'none';
        }, 500);
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.status = document.getElementById('form-status');
        this.submitBtn = this.form?.querySelector('.submit-btn');
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Add input validation effects
        const inputs = this.form.querySelectorAll('.cyber-input, .cyber-textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => this.handleInputFocus(input));
            input.addEventListener('blur', () => this.handleInputBlur(input));
            input.addEventListener('input', () => this.handleInputChange(input));
        });
    }
    
    handleInputFocus(input) {
        input.parentElement.classList.add('focused');
    }
    
    handleInputBlur(input) {
        input.parentElement.classList.remove('focused');
        this.validateInput(input);
    }
    
    handleInputChange(input) {
        if (input.value.length > 0) {
            input.parentElement.classList.add('has-value');
        } else {
            input.parentElement.classList.remove('has-value');
        }
    }
    
    validateInput(input) {
        const isValid = input.checkValidity();
        input.parentElement.classList.toggle('invalid', !isValid);
        return isValid;
    }
    
    async handleSubmit() {
        // Validate all inputs
        const inputs = this.form.querySelectorAll('.cyber-input, .cyber-textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showStatus('ERROR: PLEASE CORRECT THE HIGHLIGHTED FIELDS', 'error');
            return;
        }
        
        // Collect form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        this.showStatus('TRANSMITTING MESSAGE...', 'loading');
        this.submitBtn.disabled = true;
        
        try {
            // Simulate API call with different methods
            await this.submitMessage(data);
            this.showStatus('MESSAGE TRANSMITTED SUCCESSFULLY!', 'success');
            this.form.reset();
            inputs.forEach(input => {
                input.parentElement.classList.remove('has-value');
            });
        } catch (error) {
            this.showStatus(`TRANSMISSION FAILED: ${error.message}`, 'error');
        } finally {
            this.submitBtn.disabled = false;
        }
    }
    
    async submitMessage(data) {
        // Here you can implement different message sending methods
        
        // Method 1: Formspree (Recommended for beginners)
        // Replace 'YOUR_FORM_ID' with your actual Formspree form ID
        // return this.submitToFormspree(data, 'YOUR_FORM_ID');
        
        // Method 2: Netlify Forms (if hosted on Netlify)
        // return this.submitToNetlify(data);
        
        // Method 3: EmailJS (Client-side email service)
        // return this.submitToEmailJS(data);
        
        // Method 4: Custom backend API
        // return this.submitToCustomAPI(data);
        
        // For demo purposes, simulate a successful submission
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Contact form data:', data);
                resolve();
            }, 2000);
        });
    }
    
    // Formspree integration
    async submitToFormspree(data, formId) {
        const response = await fetch(`https://formspree.io/f/${formId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('NETWORK ERROR');
        }
        
        return response.json();
    }
    
    // Netlify Forms integration
    async submitToNetlify(data) {
        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'form-name': 'contact',
                ...data
            })
        });
        
        if (!response.ok) {
            throw new Error('NETWORK ERROR');
        }
        
        return response;
    }
    
    // EmailJS integration
    async submitToEmailJS(data) {
        // You need to include EmailJS library and configure it
        // return emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', data);
        throw new Error('EmailJS not configured');
    }
    
    // Custom API integration
    async submitToCustomAPI(data) {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('API ERROR');
        }
        
        return response.json();
    }
    
    showStatus(message, type) {
        this.status.textContent = message;
        this.status.className = `form-status ${type}`;
        
        if (type === 'success') {
            setTimeout(() => {
                this.status.textContent = '';
                this.status.className = 'form-status';
            }, 5000);
        }
    }
}

// Initialize Application
class CyberpunkPortfolio {
    constructor() {
        this.digitalRain = null;
        this.particleSystem = null;
        this.navigation = null;
        this.glitchEffects = null;
        this.audioSystem = null;
        this.scrollEffects = null;
        this.performanceMonitor = null;
        this.cyberpunkLoader = null;
        this.contactForm = null;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }
    
    start() {
        console.log('🚀 Initializing Cyberpunk Portfolio...');
        
        // Initialize loader first
        this.cyberpunkLoader = new CyberpunkLoader();
        
        // Initialize other systems after a delay to show loader
        setTimeout(() => {
            this.digitalRain = new DigitalRain();
            this.particleSystem = new ParticleSystem();
            this.navigation = new Navigation();
            this.glitchEffects = new GlitchEffects();
            this.audioSystem = new AudioSystem();
            this.scrollEffects = new ScrollEffects();
            this.performanceMonitor = new PerformanceMonitor();
            this.contactForm = new ContactForm();
            // Initialize typing effect
            const typedElement = document.querySelector('.typed-text');
            if (typedElement) {
                new TypingEffect(typedElement, [
                    'SYSTEM ONLINE...',
                    'WELCOME TO THE MATRIX',
                    'FULL-STACK DEVELOPER',
                    'CODE ARCHITECT',
                    'DIGITAL INNOVATOR'
                ], 150);
            }
            
            // Add window resize handler
            window.addEventListener('resize', () => {
                this.digitalRain.resize();
            });
            
            // Add CSS animations for scroll effects
            this.addScrollAnimationStyles();
            
            console.log('✅ Portfolio systems initialized');
        }, 1000);
    }
    
    addScrollAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glitch-sweep {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            .animate-in {
                animation: slideInUp 0.6s ease-out;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .glitch-active {
                animation: button-glitch 0.3s ease-out;
            }
            
            @keyframes button-glitch {
                0%, 100% { transform: translate(0); }
                20% { transform: translate(-2px, 2px); }
                40% { transform: translate(-2px, -2px); }
                60% { transform: translate(2px, 2px); }
                80% { transform: translate(2px, -2px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Start the application
new CyberpunkPortfolio();