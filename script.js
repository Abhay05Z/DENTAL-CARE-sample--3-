// ========================================
// Preloader
// ========================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
            initPageAnimations();
        }, 2000);
    } else {
        initPageAnimations();
    }
});

// ========================================
// Mobile Navigation Toggle
// ========================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ========================================
// Navbar Scroll Effect + Scroll Progress + Back to Top
// ========================================
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Scroll progress bar
    if (scrollProgress) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollY / docHeight) * 100;
        scrollProgress.style.width = progress + '%';
    }

    // Back to top
    if (backToTop) {
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
});

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========================================
// Custom Cursor (Desktop only)
// ========================================
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing && window.innerWidth > 1024) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX - 4 + 'px';
        cursorDot.style.top = mouseY - 4 + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.left = ringX - 20 + 'px';
        cursorRing.style.top = ringY - 20 + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .service-card, .team-card, .gallery-item, .choose-card, .testimonial-card, input, select, textarea');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
} else if (cursorDot && cursorRing) {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
}

// ========================================
// Page Transitions
// ========================================
const pageTransition = document.getElementById('pageTransition');

document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http') || href.startsWith('https://wa.me')) return;

        e.preventDefault();
        if (pageTransition) {
            pageTransition.classList.add('active');
            setTimeout(() => {
                window.location.href = href;
            }, 600);
        } else {
            window.location.href = href;
        }
    });
});

// ========================================
// Scroll Animations (Multiple Types)
// ========================================
function initPageAnimations() {
    // Fade-in elements
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const fadeSelectors = [
        '.service-card', '.testimonial-card', '.team-card',
        '.service-detail', '.timeline-item', '.pricing-card',
        '.info-card', '.about-grid', '.bio-grid'
    ];

    fadeSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = `${index * 0.1}s`;
            fadeObserver.observe(el);
        });
    });

    // Data-anim elements
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                animObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('[data-anim]').forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.12}s`;
        animObserver.observe(el);
    });

    // Stagger children
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stagger-children').forEach(el => staggerObserver.observe(el));

    // Section header reveal
    document.querySelectorAll('.section-header').forEach(header => {
        header.classList.add('fade-in');
        fadeObserver.observe(header);
    });

    // Counter animations
    initCounters();
}

// ========================================
// Typed Text Effect (Hero)
// ========================================
(function initTypedText() {
    const heroTitle = document.querySelector('.hero-text h1');
    if (!heroTitle) return;

    const words = ['Priority', 'Passion', 'Promise', 'Expertise'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const highlightSpan = heroTitle.querySelector('.highlight');
    if (!highlightSpan) return;

    // Add cursor
    const cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    highlightSpan.parentNode.insertBefore(cursor, highlightSpan.nextSibling);

    function type() {
        const current = words[wordIndex];

        if (isDeleting) {
            charIndex--;
            highlightSpan.textContent = current.substring(0, charIndex);
        } else {
            charIndex++;
            highlightSpan.textContent = current.substring(0, charIndex);
        }

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === current.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }

    setTimeout(type, 2500);
})();

// ========================================
// Parallax on Scroll
// ========================================
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Hero parallax
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage && scrollY < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrollY * 0.15}px)`;
    }

    // About section parallax
    const aboutImgMain = document.querySelector('.about-img-main');
    const aboutImgSec = document.querySelector('.about-img-secondary');
    if (aboutImgMain) {
        const rect = aboutImgMain.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const offset = (window.innerHeight - rect.top) * 0.04;
            aboutImgMain.style.transform = `translateY(${-offset}px)`;
            if (aboutImgSec) aboutImgSec.style.transform = `translateY(${offset * 0.5}px)`;
        }
    }
});

// ========================================
// Tilt Effect on Cards
// ========================================
function initTiltEffect() {
    const cards = document.querySelectorAll('.service-card, .choose-card, .testimonial-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

document.addEventListener('DOMContentLoaded', initTiltEffect);

// ========================================
// Gallery Filter
// ========================================
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        galleryItems.forEach((item, i) => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.classList.remove('hidden');
                item.style.animation = `fadeIn 0.5s ease ${i * 0.05}s forwards`;
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// Dynamic keyframe
const dynamicStyle = document.createElement('style');
dynamicStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9) translateY(10px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
    }
`;
document.head.appendChild(dynamicStyle);

// ========================================
// Gallery Lightbox
// ========================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
let currentImageIndex = 0;
let visibleImages = [];

function updateVisibleImages() {
    visibleImages = [];
    galleryItems.forEach(item => {
        if (!item.classList.contains('hidden')) {
            visibleImages.push(item.querySelector('img'));
        }
    });
}

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        updateVisibleImages();
        const img = item.querySelector('img');
        currentImageIndex = visibleImages.indexOf(img);
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });
}

if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
        lightboxImg.src = visibleImages[currentImageIndex].src;
    });
}

if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
        lightboxImg.src = visibleImages[currentImageIndex].src;
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
});

// ========================================
// Before & After Slider
// ========================================
document.querySelectorAll('.ba-slider').forEach(slider => {
    let isDragging = false;

    function updateSlider(x) {
        const rect = slider.getBoundingClientRect();
        let pos = (x - rect.left) / rect.width;
        pos = Math.max(0.05, Math.min(0.95, pos));
        const percent = pos * 100;

        const beforeWrapper = slider.querySelector('.ba-before-wrapper');
        const handle = slider.querySelector('.ba-handle');
        const beforeImg = slider.querySelector('.ba-before');

        beforeWrapper.style.width = percent + '%';
        handle.style.left = percent + '%';
        beforeImg.style.width = (100 / pos) + '%';
    }

    slider.addEventListener('mousedown', (e) => { isDragging = true; updateSlider(e.clientX); });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => { if (isDragging) updateSlider(e.clientX); });

    slider.addEventListener('touchstart', (e) => { isDragging = true; updateSlider(e.touches[0].clientX); });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => { if (isDragging) updateSlider(e.touches[0].clientX); });
});

// ========================================
// Contact Form Handling
// ========================================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = contactForm.querySelectorAll('input[required], select[required]');
        let valid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ef4444';
                input.style.animation = 'shake 0.4s ease';
                valid = false;
            } else {
                input.style.borderColor = '';
                input.style.animation = '';
            }
        });

        if (valid) {
            contactForm.style.display = 'none';
            formSuccess.classList.add('show');
            setTimeout(() => {
                contactForm.style.display = '';
                formSuccess.classList.remove('show');
                contactForm.reset();
            }, 5000);
        }
    });

    // Add shake animation
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            50% { transform: translateX(8px); }
            75% { transform: translateX(-4px); }
        }
    `;
    document.head.appendChild(shakeStyle);
}

// ========================================
// FAQ Accordion
// ========================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========================================
// Counter Animation for Stats
// ========================================
function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent;
                const number = parseInt(text);
                if (!isNaN(number)) {
                    animateCounter(entry.target, number);
                }
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000;
    const start = performance.now();
    const suffix = element.textContent.replace(/[0-9]/g, '');

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        current = Math.floor(eased * target);
        element.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

// ========================================
// Floating Particles Background
// ========================================
(function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 40;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(14, 116, 144, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(14, 116, 144, ${0.1 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
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

// ========================================
// Smooth Reveal on Page Load
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Ensure body doesn't scroll while preloader is active
    document.body.style.overflow = 'hidden';

    // Hero elements staggered entrance
    const heroElements = document.querySelectorAll('.hero-subtitle, .hero-text h1, .hero-description, .hero-buttons, .hero-stats, .hero-image');
    heroElements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${2 + i * 0.15}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${2 + i * 0.15}s`;
    });

    setTimeout(() => {
        heroElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 100);
});
