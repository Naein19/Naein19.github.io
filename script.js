console.log('Script.js loaded');

// --- CUSTOM CURSOR (desktop only) ---
(function initCustomCursor() {
    // Skip on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let isVisible = false;

    // Smooth follow with lerp
    function lerp(a, b, t) { return a + (b - a) * t; }

    function animateCursor() {
        ringX = lerp(ringX, mouseX, 0.15);
        ringY = lerp(ringY, mouseY, 0.15);
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isVisible) {
            isVisible = true;
            dot.classList.add('visible');
            ring.classList.add('visible');
        }
    });

    document.addEventListener('mouseleave', () => {
        isVisible = false;
        dot.classList.remove('visible');
        ring.classList.remove('visible');
    });

    document.addEventListener('mouseenter', () => {
        isVisible = true;
        dot.classList.add('visible');
        ring.classList.add('visible');
    });

    // Click animation
    document.addEventListener('mousedown', () => ring.classList.add('clicking'));
    document.addEventListener('mouseup', () => ring.classList.remove('clicking'));

    // Hover states for interactive elements
    const interactiveSelectors = 'a, button, .skill-icon-container, .social-icon, .env-tool-container, .nav-link, .mobile-link, .logo, .menu-btn, .github-link, .contact-social-link, .contact-email-link';

    // Text selectors for text cursor
    const textSelectors = '.about-text, .project-description p, .features-list li, .tech-stack-content, .env-tool-quote, .hero-subtitle, .contact-copyright, .status-text';

    document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.classList.add('hovering');
            dot.classList.add('hidden');
        });
        el.addEventListener('mouseleave', () => {
            ring.classList.remove('hovering');
            dot.classList.remove('hidden');
        });
    });

    document.querySelectorAll(textSelectors).forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.classList.add('text-hover');
            dot.classList.add('hidden');
        });
        el.addEventListener('mouseleave', () => {
            ring.classList.remove('text-hover');
            dot.classList.remove('hidden');
        });
    });

    // Magnetic pull effect on social icons and nav links
    const magneticEls = document.querySelectorAll('.social-icon, .nav-link');
    magneticEls.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) * 0.25;
            const dy = (e.clientY - cy) * 0.25;
            if (typeof gsap !== 'undefined') {
                gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
            }
        });
        el.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
            }
        });
    });
})();

// --- MAIN SCRIPT ---
window.addEventListener('load', () => {
    console.log('Window Loaded');
    let lenis;
    try {
        // Initialize Lenis
        if (typeof Lenis !== 'undefined') {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: true,
                mouseMultiplier: 1,
                smoothTouch: false,
                touchMultiplier: 2,
            });

            if (typeof ScrollTrigger !== 'undefined') {
                lenis.on('scroll', ScrollTrigger.update);
                gsap.ticker.add((time) => {
                    lenis.raf(time * 1000);
                });
                gsap.ticker.lagSmoothing(0);
            }

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }
    } catch (e) {
        console.error('Lenis Error:', e);
    }

    // --- Smooth Scroll for Nav Links (works with pinned ScrollTrigger sections) ---
    function doScroll(pos) {
        if (lenis) {
            lenis.scrollTo(pos, { duration: 1.5 });
        } else {
            window.scrollTo({ top: pos, behavior: 'smooth' });
        }
    }

    function findSTByTriggerEl(el) {
        return ScrollTrigger.getAll().find(st => st.trigger === el && st.pin);
    }

    function scrollToSection(targetSelector) {
        const target = document.querySelector(targetSelector);
        if (!target) return;

        // HERO → scroll to 0
        if (targetSelector === '#hero') {
            doScroll(0);
            return;
        }

        // ABOUT → it's a fixed overlay shown during the hero pin at ~55%
        if (targetSelector === '#about-section') {
            const heroEl = document.querySelector('#hero');
            const heroST = heroEl && findSTByTriggerEl(heroEl);
            if (heroST) {
                doScroll(heroST.start + (heroST.end - heroST.start) * 0.55);
            }
            return;
        }

        // SKILLS → find its own pin ScrollTrigger
        if (targetSelector === '#skills-section') {
            const skillsST = findSTByTriggerEl(target);
            if (skillsST) {
                doScroll(skillsST.start);
            }
            return;
        }

        // PROJECTS / CONTACT / anything else → compute absolute position from DOM
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const rect = target.getBoundingClientRect();
        doScroll(rect.top + scrollY);
    }

    // Attach to all nav-link and mobile-link elements
    document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href) scrollToSection(href);
        });
    });

    // Logo click scrolls to home
    const logoEl = document.querySelector('.logo');
    if (logoEl) {
        logoEl.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToSection('#hero');
        });
    }

    // Start Animations
    try {
        if (typeof gsap !== 'undefined') {
            // Ensure initial states for Hero
            gsap.set('.hero-title .char', { y: 100, autoAlpha: 0 }); // Hide initially
            gsap.set('.hero-title-last .char', { y: 100, autoAlpha: 0 });
            gsap.set('.hero-subtitle', { y: 20, autoAlpha: 0 });

            if (window.initAnimations) {
                // initLoader will chain: initHero -> initZoomAnimation -> initScrollAnimations
                window.initAnimations.initLoader();

                // --- Global Scroll Indicator: shows 3s on each section entry ---
                const scrollIndicator = document.getElementById('global-scroll-indicator');
                let scrollIndicatorTimer = null;

                function flashScrollIndicator() {
                    if (!scrollIndicator) return;
                    scrollIndicator.classList.add('visible');
                    clearTimeout(scrollIndicatorTimer);
                    scrollIndicatorTimer = setTimeout(() => {
                        scrollIndicator.classList.remove('visible');
                    }, 3000);
                }

                // Show on initial page load after hero animation
                setTimeout(flashScrollIndicator, 2500);

                // Show on entering each section
                ['#skills-section', '#projects-section', '#contact'].forEach(selector => {
                    const el = document.querySelector(selector);
                    if (el) {
                        ScrollTrigger.create({
                            trigger: el,
                            start: 'top 80%',
                            onEnter: flashScrollIndicator,
                            onEnterBack: flashScrollIndicator,
                        });
                    }
                });

                // Also flash when about section appears (during hero pin)
                const heroEl = document.querySelector('#hero');
                const heroST = heroEl && ScrollTrigger.getAll().find(st => st.trigger === heroEl && st.pin);
                // We'll add a progress-based trigger for about via a small onUpdate check
                let aboutShown = false;
                if (heroST) {
                    heroST.animation && heroST.animation.eventCallback && heroST.animation.eventCallback('onUpdate', function() {
                        const p = this.progress();
                        if (p > 0.35 && p < 0.5 && !aboutShown) {
                            aboutShown = true;
                            flashScrollIndicator();
                        }
                        if (p < 0.3 || p > 0.6) aboutShown = false;
                    });
                }

                // Hide at very bottom of page (contact section end)
                ScrollTrigger.create({
                    trigger: '#contact',
                    start: 'bottom bottom',
                    onEnter: () => {
                        if (scrollIndicator) scrollIndicator.classList.remove('visible');
                        clearTimeout(scrollIndicatorTimer);
                    },
                });

                // Hide social bar when in contact section
                const socialBar = document.querySelector('.hero-social-bar');
                if (socialBar) {
                    ScrollTrigger.create({
                        trigger: '#contact',
                        start: 'top 50%',
                        end: 'bottom top',
                        onEnter: () => socialBar.classList.add('hide'),
                        onLeaveBack: () => socialBar.classList.remove('hide'),
                    });
                }
            } else {
                console.error('initAnimations object not found on window');
            }
        } else {
            console.error('GSAP not defined');
            // Fallback to visible
            document.body.classList.remove('loading');
            document.querySelector('.loader').style.display = 'none';
            document.querySelector('.hero-content').style.opacity = 1;
        }
    } catch (e) {
        console.error('Animation Init Error:', e);
    }

    // Failsafe
    setTimeout(() => {
        console.log('Failsafe checking...');
        const loader = document.querySelector('.loader');
        if (loader && loader.style.display !== 'none') {
            console.log('Removing loader via Failsafe');
            loader.style.display = 'none';
            document.body.classList.remove('loading');
            // Force reveal
            gsap.to('.hero-title .char', { y: 0, autoAlpha: 1 });
            gsap.to('.hero-title-last .char', { y: 0, autoAlpha: 1 });
            gsap.to('.hero-subtitle', { y: 0, autoAlpha: 1 });
        }
    }, 5000);

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', (e) => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
                // scrollToSection handles the actual scrolling via the earlier listener
            });
        });
    }
});
