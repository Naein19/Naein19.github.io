console.log('Script.js loaded');

// --- CUSTOM CURSOR (desktop only — clean redesign) ---
(function initCustomCursor() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    let isVisible = false;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function animate() {
        dotX = lerp(dotX, mouseX, 0.2);
        dotY = lerp(dotY, mouseY, 0.2);
        ringX = lerp(ringX, mouseX, 0.08);
        ringY = lerp(ringY, mouseY, 0.08);

        dot.style.left = dotX + 'px';
        dot.style.top = dotY + 'px';
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';

        requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isVisible) {
            isVisible = true;
            dotX = mouseX; dotY = mouseY;
            ringX = mouseX; ringY = mouseY;
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

    // Click pulse
    document.addEventListener('mousedown', () => {
        dot.classList.add('clicking');
        ring.classList.add('clicking');
    });
    document.addEventListener('mouseup', () => {
        dot.classList.remove('clicking');
        ring.classList.remove('clicking');
    });

    // Interactive hover — ring expands
    const interactiveSelectors = 'a, button, .skill-icon-container, .social-icon, .env-tool-container, .nav-link, .mobile-link, .logo, .menu-btn, .github-link, .contact-social-link, .contact-email-link, .status-badge, .exp-tag';

    document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });

    // Magnetic pull on key elements
    const magneticEls = document.querySelectorAll('.social-icon, .nav-link');
    magneticEls.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.2;
            const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.2;
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

    // --- Cross-platform viewport height fix (mobile address bar differences) ---
    function setVh() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', vh + 'px');
    }
    setVh();
    window.addEventListener('resize', setVh, { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(setVh, 150));

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
            } else {
                // Fallback: drive Lenis via standalone RAF when ScrollTrigger unavailable
                function lenisRaf(time) {
                    lenis.raf(time);
                    requestAnimationFrame(lenisRaf);
                }
                requestAnimationFrame(lenisRaf);
            }
        }
    } catch (e) {
        console.error('Lenis Error:', e);
    }

    // --- Cross-platform ScrollTrigger config ---
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.config({
            ignoreMobileResize: true,
        });
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
            gsap.set('.hero-title .char', { y: 100, autoAlpha: 0, rotation: 8, filter: 'blur(10px)' });
            gsap.set('.hero-title-last .char', { y: 100, autoAlpha: 0, rotation: -5, filter: 'blur(10px)' });
            gsap.set('.hero-subtitle', { y: 30, autoAlpha: 0 });
            gsap.set('.hero-role-badge', { y: -20, autoAlpha: 0 });
            gsap.set('.hero-expertise', { autoAlpha: 1 });
            gsap.set('.exp-tag', { y: 20, autoAlpha: 0 });
            gsap.set('.hero-line', { scaleX: 0 });

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

                // Hide social bar when in contact section (status badge stays visible always)
                const socialBar = document.querySelector('.hero-social-bar');
                if (socialBar) {
                    ScrollTrigger.create({
                        trigger: '#contact',
                        start: 'top 50%',
                        end: 'bottom top',
                        onEnter: () => {
                            socialBar.classList.add('hide');
                        },
                        onLeaveBack: () => {
                            socialBar.classList.remove('hide');
                        },
                    });
                }

                // --- Active Nav Link Tracking ---
                (function initActiveNavTracking() {
                    const allNavLinks = document.querySelectorAll('.nav-link, .mobile-link');
                    let currentHref = '#hero';

                    function setActive(href) {
                        if (currentHref === href) return;
                        currentHref = href;
                        allNavLinks.forEach(l => {
                            l.classList.toggle('active', l.getAttribute('href') === href);
                        });
                    }

                    setActive('#hero');

                    let ticking = false;
                    window.addEventListener('scroll', () => {
                        if (ticking) return;
                        ticking = true;
                        requestAnimationFrame(() => {
                            checkActiveSection();
                            ticking = false;
                        });
                    }, { passive: true });

                    function checkActiveSection() {
                        const vh = window.innerHeight;
                        // Check sections bottom-to-top; first whose top is above viewport center wins
                        const sections = [
                            { id: '#contact', el: document.querySelector('#contact') },
                            { id: '#projects-section', el: document.querySelector('#projects-section') },
                            { id: '#skills-section', el: document.querySelector('#skills-section') },
                        ];

                        for (const { id, el } of sections) {
                            if (!el) continue;
                            if (el.getBoundingClientRect().top <= vh * 0.5) {
                                setActive(id);
                                return;
                            }
                        }

                        // About section is a fixed overlay — check its computed opacity
                        const about = document.querySelector('#about-section');
                        if (about && parseFloat(window.getComputedStyle(about).opacity) > 0.5) {
                            setActive('#about-section');
                            return;
                        }

                        setActive('#hero');
                    }
                })();
            } else {
                console.error('initAnimations object not found on window');
            }
        } else {
            console.error('GSAP not defined');
            // Comprehensive fallback — reveal all content without animations
            document.body.classList.remove('loading');
            document.body.classList.add('no-gsap');
            var loader = document.querySelector('.loader');
            if (loader) loader.style.display = 'none';
        }
    } catch (e) {
        console.error('Animation Init Error:', e);
        document.body.classList.remove('loading');
        document.body.classList.add('no-gsap');
        var loader = document.querySelector('.loader');
        if (loader) loader.style.display = 'none';
    }

    // Failsafe
    setTimeout(() => {
        console.log('Failsafe checking...');
        const loader = document.querySelector('.loader');
        if (loader && loader.style.display !== 'none') {
            console.log('Removing loader via Failsafe');
            loader.style.display = 'none';
            document.body.classList.remove('loading');
            // Force reveal — check if GSAP is available
            if (typeof gsap !== 'undefined') {
                gsap.to('.hero-title .char', { y: 0, autoAlpha: 1 });
                gsap.to('.hero-title-last .char', { y: 0, autoAlpha: 1 });
                gsap.to('.hero-subtitle', { y: 0, autoAlpha: 1 });
            } else {
                document.body.classList.add('no-gsap');
            }
        }
    }, 10000);

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            const isOpen = mobileMenu.classList.contains('active');
            document.body.style.overflow = isOpen ? 'hidden' : '';
            menuToggle.setAttribute('aria-expanded', String(isOpen));
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

    // --- STATUS BADGE TYPEWRITER ---
    (function initStatusTypewriter() {
        const statusTexts = ['Vitian', 'Athlete', 'Programmer', 'Engineer', 'Creator'];
        let statusIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const statusEl = document.getElementById('status-badge-text');

        if (!statusEl) return;

        function typeStatus() {
            const current = statusTexts[statusIndex];

            if (isDeleting) {
                charIndex--;
                statusEl.textContent = current.substring(0, charIndex);
            } else {
                charIndex++;
                statusEl.textContent = current.substring(0, charIndex);
            }

            let delay = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === current.length) {
                delay = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                statusIndex = (statusIndex + 1) % statusTexts.length;
                delay = 500;
            }

            setTimeout(typeStatus, delay);
        }

        typeStatus();
    })();
});

// --- CONTACT MEGA TITLE TYPING EFFECT ---
(function initContactTyping() {
    const words = ['IDEA?', 'PROJECT?', 'VISION?', 'DREAM?'];
    const el = document.getElementById('contact-typed-word');
    if (!el) return;

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            charIndex--;
            el.textContent = currentWord.substring(0, charIndex);
        } else {
            charIndex++;
            el.textContent = currentWord.substring(0, charIndex);
        }

        let delay = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            delay = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 400;
        }

        setTimeout(type, delay);
    }

    type();
})();

// --- CONTACT CARD MOUSE GLOW ---
(function initContactCardGlow() {
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.contact-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });
})();
