/* ============================
   VALOK — Main JavaScript
   ============================ */

// ---- PARTICLE BACKGROUND ----
(function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    this.x -= dx * 0.01;
                    this.y -= dy * 0.01;
                }
            }

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create particles
    const count = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.15;
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
})();

// ---- NAVBAR SCROLL ----
(function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });
})();

// ---- MOBILE MENU TOGGLE ----
(function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        links.classList.toggle('active');
    });

    // Close menu on link click
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('active');
        });
    });
})();

// ---- SCROLL ANIMATIONS (Intersection Observer) ----
(function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger the animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px 50px 0px'
    });

    elements.forEach(el => observer.observe(el));
})();

// ---- COUNTER ANIMATION ----
(function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                const duration = 2000;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(target * eased);
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = target;
                    }
                }
                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
})();

// ---- SMOOTH ANCHOR SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ---- PRIVACY BANNER LOGIC ----
(function initPrivacyBanner() {
    const banner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('acceptCookies');
    if (!banner || !acceptBtn) return;

    function activateTracking() {
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    }

    // Check if user has already accepted
    if (!localStorage.getItem('privacyAccepted')) {
        // Show banner with delay for better UX
        setTimeout(() => {
            banner.classList.add('visible');
        }, 1500);
    } else {
        // User has already accepted, activate tracking immediately
        activateTracking();
    }

    acceptBtn.addEventListener('click', () => {
        banner.classList.remove('visible');
        localStorage.setItem('privacyAccepted', 'true');
        activateTracking();
    });
})();



// ---- FORMSPREE AJAX SUBMISSION ----
(function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form || !status) return;

    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Lähetetään...';

        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                status.textContent = "Kiitos! Tarjouspyyntö on vastaanotettu. Palaamme asiaan pian.";
                status.className = "form-status success";
                form.reset();
            } else {
                const result = await response.json();
                if (result.errors) {
                    status.textContent = result.errors.map(error => error.message).join(", ");
                } else {
                    status.textContent = "Hups! Lähetyksessä tapahtui virhe (Koodi: " + response.status + "). Yritä uudelleen.";
                }
                status.className = "form-status error";
            }
        } catch (error) {
            status.textContent = "Nettiyhteysvirhe tai palomuuriongelma. Voit lähettää sähköpostia suoraan: aleksanteri@valok.fi";
            status.className = "form-status error";
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;

            // Auto-hide status after 8 seconds if it was successful
            if (status.classList.contains('success')) {
                setTimeout(() => {
                    status.style.display = 'none';
                    status.classList.remove('success');
                }, 8000);
            }
        }
    }

    form.addEventListener("submit", handleSubmit);
})();

// ---- FAQ ACCORDION ----
(function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                const answer = faq.querySelector('.faq-answer');
                if (answer) answer.style.maxHeight = null;
            });

            // Open clicked if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
})();

// ---- THEME TOGGLE ----
(function initThemeToggle() {
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.getElementById('navLinks');
    const mobileToggle = document.getElementById('mobileToggle');
    if (!navContainer) return;

    // Create the button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.setAttribute('aria-label', 'Vaihda teemaa');
    toggleBtn.innerHTML = `
        <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    `;

    // Insert button at correct position
    if (window.innerWidth <= 768 && mobileToggle) {
        navContainer.insertBefore(toggleBtn, mobileToggle);
    } else {
        navContainer.appendChild(toggleBtn);
    }

    // Handle screen resize to move toggle button
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768 && mobileToggle) {
            if (toggleBtn.nextSibling !== mobileToggle) {
                navContainer.insertBefore(toggleBtn, mobileToggle);
            }
        } else {
            if (toggleBtn.parentElement === navContainer && toggleBtn.nextSibling !== null) {
                navContainer.appendChild(toggleBtn);
            }
        }
    });

    // Update logo images based on theme
    function updateLogos() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const logoImgs = document.querySelectorAll('.logo-img');
        logoImgs.forEach(img => {
            let src = img.getAttribute('src');
            if (!src) return;
            
            const isBlog = src.startsWith('../');
            const basePath = isBlog ? '../img/' : 'img/';
            
            if (isLight) {
                img.src = basePath + 'valok-black-with-white-outline.webp';
                img.srcset = basePath + 'valok-black-with-white-outline.webp';
            } else {
                img.src = basePath + 'aRon_A1.webp';
                img.srcset = `${basePath}aRon_A1-mobile.webp 800w, ${basePath}aRon_A1.webp 1600w`;
            }
        });
    }

    // Initialize logos based on stored theme
    updateLogos();

    // Click handler
    toggleBtn.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateLogos();
    });
})();
