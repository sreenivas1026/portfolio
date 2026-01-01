// Glowing Cursor Follow Effect (guaranteed to run last)
window.addEventListener('DOMContentLoaded', function () {
    console.log('Cursor glow script loaded');
    const cursorGlow = document.createElement('div');
    cursorGlow.id = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    Object.assign(cursorGlow.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        pointerEvents: 'none',
        background: 'radial-gradient(circle at 40% 40%, #00ffe7 0%, #00aaff 60%, transparent 100%)',
        boxShadow: '0 0 80px 40px #00ffe7aa',
        mixBlendMode: 'screen',
        zIndex: '2147483647',
        opacity: '0.8',
        transition: 'background 0.3s, width 0.2s, height 0.2s, box-shadow 0.3s',
        transform: 'translate(-50%, -50%)',
        willChange: 'transform',
    });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX, glowY = mouseY;
    let hue = 180;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.18;
        glowY += (mouseY - glowY) * 0.18;
        hue = (hue + 1) % 360;
        cursorGlow.style.transform = `translate(${glowX - 60}px, ${glowY - 60}px)`;
        cursorGlow.style.background = `radial-gradient(circle at 40% 40%, hsl(${hue},100%,70%) 0%, hsl(${(hue+60)%360},100%,60%) 60%, transparent 100%)`;
        cursorGlow.style.boxShadow = `0 0 80px 40px hsl(${hue},100%,70%,0.7)`;
        requestAnimationFrame(animateGlow);
    }
    animateGlow();
});
document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navbar = document.getElementById('navbar');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Navbar Scroll Effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavigation() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('text-blue-500');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('text-blue-500');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);

    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards for animation
    document.querySelectorAll('.card').forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Form Validation & Enhancement
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            let isValid = true;
            
            // Simple validation
            if (name && name.value.trim() === '') {
                isValid = false;
                name.classList.add('border-red-500');
            } else if (name) {
                name.classList.remove('border-red-500');
            }
            
            if (email && !isValidEmail(email.value)) {
                isValid = false;
                email.classList.add('border-red-500');
            } else if (email) {
                email.classList.remove('border-red-500');
            }
            
            if (message && message.value.trim() === '') {
                isValid = false;
                message.classList.add('border-red-500');
            } else if (message) {
                message.classList.remove('border-red-500');
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Strong Color Filter Cursor Effect
    const cursorFilter = document.createElement('div');
    cursorFilter.id = 'cursor-filter';
    document.body.appendChild(cursorFilter);

    Object.assign(cursorFilter.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(0,255,255,0.25) 0%, rgba(0,0,0,0.0) 70%)',
        mixBlendMode: 'color-dodge',
        zIndex: '99999',
        transition: 'width 0.2s, height 0.2s, background 0.3s',
        transform: 'translate(-50%, -50%)',
        willChange: 'transform',
        opacity: '1',
        filter: 'blur(0.5px)',
    });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let filterX = mouseX, filterY = mouseY;
    let hue = 180;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateFilter() {
        filterX += (mouseX - filterX) * 0.18;
        filterY += (mouseY - filterY) * 0.18;
        hue = (hue + 1) % 360;
        cursorFilter.style.transform = `translate(${filterX - 100}px, ${filterY - 100}px)`;
        cursorFilter.style.background = `radial-gradient(circle, hsla(${hue},100%,60%,0.25) 0%, rgba(0,0,0,0.0) 70%)`;
        requestAnimationFrame(animateFilter);
    }
    animateFilter();

    document.addEventListener('mousedown', () => {
        cursorFilter.style.width = '300px';
        cursorFilter.style.height = '300px';
        cursorFilter.style.opacity = '0.9';
    });
    document.addEventListener('mouseup', () => {
        cursorFilter.style.width = '200px';
        cursorFilter.style.height = '200px';
        cursorFilter.style.opacity = '1';
    });

    // Log to console
    console.log('%c🚀 Portfolio Loaded Successfully!', 'color: #005BFF; font-size: 16px; font-weight: bold;');
    console.log('%cBuilt with ❤️ using HTML + Tailwind CSS', 'color: #A9A9A9; font-size: 12px;');
});
