// --- ANIMATIONS ---
const initLoader = () => {
    console.log('initLoader called');
    const hellos = document.querySelectorAll('.loader-hello');
    gsap.set(hellos, { opacity: 0, scale: 0.8, y: 40 });
    gsap.set('.loader', { display: 'flex', opacity: 1 });

    const tl = gsap.timeline({
        onComplete: () => {
            console.log('Loader complete');
            document.body.classList.remove('loading');
            const loader = document.querySelector('.loader');
            if (loader) loader.style.display = 'none';
            // Start Hero, then Zoom, then Scroll
            initHero(() => {
                window.initAnimations.initZoomAnimation();
                window.initAnimations.initScrollAnimations();
                window.initAnimations.initHorizontalSkills();
                window.initAnimations.initProjectStack();
                window.initAnimations.initProjectTitleCharacterAnimation();
                window.initAnimations.initProjectContentReveal();
                window.initAnimations.initProjectProgress();
                ScrollTrigger.refresh();

                if (document.fonts && document.fonts.ready) {
                    document.fonts.ready.then(() => {
                        setTimeout(() => ScrollTrigger.refresh(), 200);
                    });
                }
            });
        }
    });

    // Cycle through each hello word with visible timing
    hellos.forEach((hello, i) => {
        const startTime = i * 0.85;
        tl.to(hello, {
            opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.7)'
        }, startTime)
        .to(hello, {
            opacity: 0, scale: 0.8, y: -40, duration: 0.3, ease: 'power2.in'
        }, startTime + 0.6);
    });

    // Fade out the loader
    tl.to('.loader', {
        opacity: 0, duration: 0.5, ease: 'power2.inOut'
    }, '+=0.2');
};

const initHero = (onCompleteCallback) => {
    console.log('initHero called');
    const tl = gsap.timeline({
        onComplete: onCompleteCallback
    });

    // 1. Role badge — swift entrance for immediate context
    tl.to('.hero-role-badge', {
        y: 0, autoAlpha: 1, duration: 0.6, ease: 'power4.out'
    }, 0.05)

    // 2. First name: tight cinematic character stagger
    .to('.hero-title .char', {
        y: 0, autoAlpha: 1, rotation: 0, filter: 'blur(0px)',
        stagger: { each: 0.04, from: 'start' },
        duration: 0.9, ease: 'expo.out'
    }, 0.2)

    // 3. Last name overlaps first — cinematic cascade
    .to('.hero-title-last .char', {
        y: 0, autoAlpha: 1, rotation: 0, filter: 'blur(0px)',
        stagger: { each: 0.04, from: 'start' },
        duration: 0.9, ease: 'expo.out'
    }, 0.36)

    // 4. Decorative line — deliberate, cinematic draw
    .to('.hero-line', {
        scaleX: 1, duration: 1, ease: 'power2.inOut'
    }, 0.7)

    // 5. Subtitle breathes in
    .to('.hero-subtitle', {
        y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out'
    }, 0.85)

    // 6. Tags cascade with refined spring
    .to('.exp-tag', {
        y: 0, autoAlpha: 1,
        stagger: 0.06,
        duration: 0.6,
        ease: 'back.out(1.7)'
    }, 1.1);
};

const initScrollAnimations = () => {
    console.log('initScrollAnimations called');
    gsap.registerPlugin(ScrollTrigger);

    // Contact section reveal animation
    const contactTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 70%',
            toggleActions: 'play none none none',
        }
    });

    contactTl.from('.contact-grid-bg', { opacity: 0, duration: 1.5, ease: 'power2.out' }, 0)
        .from('.contact-aurora', { opacity: 0, duration: 2, ease: 'power2.out' }, 0)
        .from('.contact-gradient-orb', { scale: 0.5, opacity: 0, duration: 1.8, ease: 'power2.out' }, 0)
        .from('.contact-light-beam', { opacity: 0, duration: 2, ease: 'power2.out' }, 0.3)
        // Section label fade in
        .from('.contact-section-label', { x: -30, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.1)
        // Cinematic title — sub line slides up with blur
        .from('.mega-line-sub', { y: 40, opacity: 0, filter: window.innerWidth > 768 ? 'blur(6px)' : 'none', duration: 1, ease: 'power4.out' }, 0.15)
        // Main lines cascade with refined 3D rotation
        .from('.mega-line-main', { y: 100, opacity: 0, filter: window.innerWidth > 768 ? 'blur(8px)' : 'none', rotationX: window.innerWidth > 768 ? -15 : 0, transformOrigin: 'bottom center', stagger: 0.25, duration: 1.4, ease: 'power4.out' }, 0.35)
        .from('.contact-subtitle', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.95)
        .from('.contact-divider', { scaleX: 0, transformOrigin: 'left center', duration: 0.8, ease: 'power3.inOut' }, 1.1)
        .from('.contact-availability', { y: 15, opacity: 0, duration: 0.6, ease: 'power3.out' }, 1.3)
        // Contact cards stagger in from right
        .fromTo('.contact-card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out' }, 1.2)
        .from('.contact-location-badge', { y: 10, opacity: 0, duration: 0.5, ease: 'power3.out' }, 1.8)
        .fromTo('.footer-inner', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 1.9);
};

const initZoomAnimation = () => {
    console.log('initZoomAnimation called');
    const target = document.querySelector('.zoom-target');
    const aboutSection = document.querySelector('#about-section');
    const aboutHeading = document.querySelector('.about-heading');
    const aboutTextWrapper = document.querySelector('.about-text-wrapper');
    const aboutLabel = document.querySelector('.about-section-label');
    const statNumbers = document.querySelectorAll('.stat-number');

    if (!target || !aboutSection) return;

    // Reset/Sanity check: Only one About section should exist
    const aboutCount = document.querySelectorAll('#about-section').length;
    if (aboutCount > 1) {
        console.warn(`Found ${aboutCount} About sections. Removing duplicates...`);
        const allAbouts = document.querySelectorAll('#about-section');
        for (let i = 1; i < allAbouts.length; i++) {
            allAbouts[i].remove();
        }
    }

    const getCenterCoords = () => {
        const rect = target.getBoundingClientRect();
        const viewportCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const targetCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        return {
            x: viewportCenter.x - targetCenter.x,
            y: viewportCenter.y - targetCenter.y
        };
    };

    // --- INITIAL STATES ---
    // About section is a fixed overlay (NOT pinned separately)
    gsap.set(aboutSection, {
        opacity: 0,
        scale: 0.85,
        autoAlpha: 0,
        visibility: 'visible',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: window.innerHeight + 'px',
        zIndex: 50,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-color)',
        transformOrigin: "center center",
        padding: 'clamp(2rem, 3vh, 3rem) 3rem',
        boxSizing: 'border-box'
    });

    gsap.set(aboutHeading, {
        opacity: 0,
        y: 30
    });
    if (aboutLabel) {
        gsap.set(aboutLabel, { opacity: 0, x: -20 });
    }
    if (aboutTextWrapper) {
        gsap.set(aboutTextWrapper, { opacity: 0, y: 25 });
    }

    // Parse and store stat targets before any animation
    const statData = [];
    statNumbers.forEach(el => {
        const text = el.textContent.trim();
        const numMatch = text.match(/(\d+)/);
        const targetVal = numMatch ? parseInt(numMatch[1]) : 0;
        const suffix = text.replace(/\d+/, '');
        statData.push({ el, targetVal, suffix, proxy: { val: 0 } });
        el.textContent = '0' + suffix;
    });

    // Single pin on Hero drives the entire hero→about sequence.
    // pinSpacing: true ensures the skills section sits right after the spacer — no blank gap.
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: '+=3500',
            pin: true,
            pinSpacing: true,
            scrub: 1,
            invalidateOnRefresh: true,
        }
    });

    // --- PHASE 1: Zoom Animation (Letter 'A') ---
    tl.fromTo(target,
        { scale: 1, x: 0, y: 0, opacity: 1 },
        {
            scale: 300,
            x: () => getCenterCoords().x,
            y: () => getCenterCoords().y,
            force3D: true,
            duration: 1,
            ease: "power2.inOut"
        })
        // Fade out the zoom target itself once it's scaled large (prevents giant white 'A' blank)
        .to(target, {
            autoAlpha: 0,
            duration: 0.3,
        }, 0.4)
        // Cinematic parallax exit — elements scatter for depth
        .to('.hero-role-badge', { autoAlpha: 0, y: -40, duration: 0.35, ease: 'power2.in' }, 0)
        .to('.hero-title .char:not(.zoom-target)', { autoAlpha: 0, duration: 0.4 }, 0)
        .to('.hero-title-last', { autoAlpha: 0, y: 20, duration: 0.4 }, 0)
        .to('.hero-subtitle', { autoAlpha: 0, y: 40, duration: 0.35 }, 0)
        .to('.hero-line', { autoAlpha: 0, scaleX: 0, duration: 0.3 }, 0)
        .to('.hero-expertise', { autoAlpha: 0, y: 50, duration: 0.35 }, 0)
        .to('.hero-glow-orb', { autoAlpha: 0, scale: 1.4, duration: 0.5 }, 0)
        .to('#bg-canvas', {
            autoAlpha: 0,
            duration: 0.4
        }, 0);

    // --- PHASE 2: About Section "Popup" (starts early, overlaps with zoom) ---
    tl.to(aboutSection, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.6,
        ease: "power4.out"
    }, 0.35);

    // --- PHASE 3: Content Reveal (clean fade) ---
    if (aboutLabel) {
        tl.to(aboutLabel, {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: "power3.out"
        }, ">-0.5");
    }
    tl.to(aboutHeading, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
    }, ">-0.4")
    .to(aboutTextWrapper, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        onStart: () => {
            aboutSection.setAttribute('data-visible', '');
        }
    }, ">-0.3");

    // --- PHASE 3.5: Stats & Credentials Reveal ---
    tl.to('.about-stats', {
        opacity: 1,
        duration: 0.6,
        ease: "power3.out"
    }, "<0.3");
    tl.to('.about-credentials', {
        opacity: 1,
        duration: 0.6,
        ease: "power3.out"
    }, "<0.1");

    // --- PHASE 3.6: Stats Counter ---
    statData.forEach(({ el, targetVal, suffix, proxy }) => {
        tl.to(proxy, {
            val: targetVal,
            duration: 0.8,
            ease: "power2.out",
            onUpdate: () => {
                el.textContent = Math.round(proxy.val) + suffix;
            }
        }, "<");
    });

    // --- PHASE 4: Exit Animation (Fade Up) ---
    const exitEls = aboutLabel ? [aboutLabel, aboutHeading, aboutTextWrapper] : [aboutHeading, aboutTextWrapper];
    tl.to(exitEls, {
        y: -80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power2.in"
    }, ">0.15")
        // --- PHASE 5: Fade out about overlay ---
        .to(aboutSection, {
            autoAlpha: 0,
            duration: 0.5
        }, ">-0.2");
};

const initHorizontalSkills = () => {
    console.log('initHorizontalSkills called');
    const skillsSection = document.querySelector('#skills-section');
    const skillsContainer = document.querySelector('#skills-container');
    const panels = gsap.utils.toArray('.skill-panel');

    if (!skillsSection || !skillsContainer || panels.length === 0) return;

    ScrollTrigger.matchMedia({
        // Desktop: horizontal scroll
        "(min-width: 769px)": function () {
            gsap.to(skillsContainer, {
                x: () => -(skillsContainer.scrollWidth - window.innerWidth),
                ease: "none",
                scrollTrigger: {
                    trigger: skillsSection,
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    start: "top top",
                    end: () => "+=" + (skillsContainer.scrollWidth - window.innerWidth),
                    invalidateOnRefresh: true,
                }
            });

            gsap.fromTo('.skills-heading', { opacity: 0, y: 50 }, {
                opacity: 1, y: 0,
                scrollTrigger: {
                    trigger: skillsSection,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                    invalidateOnRefresh: true,
                }
            });
        },

        // Mobile: vertical stacking with fade-in reveals
        "(max-width: 768px)": function () {
            // Skills heading: show only while inside skills section
            ScrollTrigger.create({
                trigger: skillsSection,
                start: 'top 80%',
                end: 'bottom 20%',
                onEnter: () => gsap.to('.skills-heading', { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }),
                onLeave: () => gsap.to('.skills-heading', { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' }),
                onEnterBack: () => gsap.to('.skills-heading', { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }),
                onLeaveBack: () => gsap.to('.skills-heading', { opacity: 0, y: 20, duration: 0.3, ease: 'power2.in' }),
            });
            panels.forEach((panel) => {
                ScrollTrigger.create({
                    trigger: panel,
                    start: 'top 85%',
                    onEnter: () => {
                        gsap.fromTo(panel,
                            { opacity: 0, y: 40 },
                            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
                        );
                    },
                    once: true
                });
            });
        }
    });
};

const initProjectStack = () => {
    console.log('initProjectStack called');
    const pinCards = gsap.utils.toArray(".project-card");

    if (pinCards.length === 0) return;

    // Skip card stacking on tablet/mobile — cards use column layout and may exceed viewport height
    if (window.innerWidth <= 992) return;

    pinCards.forEach((eachCard, index) => {
        if (index < pinCards.length - 1) {
            ScrollTrigger.create({
                trigger: eachCard,
                start: "top top",
                endTrigger: pinCards[pinCards.length - 1],
                end: "top top",
                pin: true,
                pinSpacing: false,
                invalidateOnRefresh: true,
                id: `pin-${index}`
            });

            ScrollTrigger.create({
                trigger: pinCards[index + 1],
                start: "top bottom",
                end: "top top",
                onUpdate: (self) => {
                    const rawProgress = self.progress;
                    // Delay: card stays fully visible for 25% of scroll before transitioning
                    const progress = Math.max(0, (rawProgress - 0.25) / 0.75);

                    // Clean transform: only scale + slight y-shift (NO rotation = NO blur)
                    gsap.set(eachCard, {
                        scale: 1 - progress * 0.05,
                        y: -progress * 30,
                    });

                    const overlay = eachCard.querySelector(".overlay");
                    if (overlay) {
                        gsap.set(overlay, {
                            opacity: progress * 0.6
                        });
                    }
                }
            });
        }
    });
};

const initProjectTitleCharacterAnimation = () => {
    console.log('initProjectTitleCharacterAnimation called');
    const title = document.querySelector('#project-title');
    const intro = document.querySelector('#projects-intro');
    if (!title || !intro) return;

    // Split title text into characters
    const text = title.textContent;
    title.innerHTML = '';
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.className = 'char';
        title.appendChild(span);
    });

    const chars = title.querySelectorAll('.char');

    // Character reveal animation (scroll-driven)
    gsap.fromTo(chars,
        {
            opacity: 0,
            yPercent: 120,
            scaleY: 2.3,
            scaleX: 0.7,
            transformOrigin: "50% 0%",
            filter: "blur(8px)"
        },
        {
            opacity: 1,
            yPercent: 0,
            scaleY: 1,
            scaleX: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "back.inOut(2)",
            stagger: 0.06,
            scrollTrigger: {
                trigger: intro,
                start: "top 80%",
                end: "center center",
                scrub: true,
                invalidateOnRefresh: true,
                id: "project-title-anim"
            }
        }
    );

    // Projects shadow text reveal
    const shadowText = document.querySelector('.projects-shadow-text');
    if (shadowText) {
        gsap.fromTo(shadowText,
            { autoAlpha: 0, y: -10 },
            {
                autoAlpha: 1, y: 0,
                duration: 1.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: intro,
                    start: 'top 85%',
                    end: 'center center',
                    scrub: true,
                    invalidateOnRefresh: true,
                }
            }
        );
    }
};

const initProjectContentReveal = () => {
    console.log('initProjectContentReveal called');
    const cards = gsap.utils.toArray('.project-card');
    if (cards.length === 0) return;

    cards.forEach((card, index) => {
        const category = card.querySelector('.project-category');
        const revealEls = card.querySelectorAll('.reveal-el');
        const mockup = card.querySelector('.project-mockup');
        const numberBg = card.querySelector('.project-number-bg');
        const codeLines = card.querySelectorAll('.code-line');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: 'top 75%',
                toggleActions: 'play none none none',
            }
        });

        // Watermark number — cinematic scale in + scroll parallax
        if (numberBg) {
            tl.fromTo(numberBg,
                { autoAlpha: 0, scale: 0.85 },
                { autoAlpha: 1, scale: 1, duration: 1.4, ease: 'power2.out' },
                0
            );
            // Subtle upward drift as user scrolls through card
            gsap.to(numberBg, {
                yPercent: -15,
                ease: 'none',
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                }
            });
        }

        // Accent orb fade in
        const accentOrb = card.querySelector('.project-accent-orb');
        if (accentOrb) {
            tl.fromTo(accentOrb,
                { autoAlpha: 0, scale: 0.8 },
                { autoAlpha: 1, scale: 1, duration: 1.5, ease: 'power2.out' },
                0
            );
        }

        // Category label slide in
        if (category) {
            tl.fromTo(category,
                { autoAlpha: 0, x: -30 },
                { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out' },
                0.1
            );
        }

        // Text elements stagger reveal
        if (revealEls.length > 0) {
            tl.fromTo(revealEls,
                { autoAlpha: 0, y: 35 },
                { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' },
                0.2
            );
        }

        // Mockup slide in with subtle 3D — alternating direction
        if (mockup) {
            const dir = index % 2 === 0 ? 1 : -1;
            tl.fromTo(mockup,
                { autoAlpha: 0, x: 80 * dir, rotationY: -8 * dir },
                { autoAlpha: 1, x: 0, rotationY: 0, duration: 1, ease: 'power3.out' },
                0.25 + index * 0.02
            );
        }

        // Code lines typewriter stagger
        if (codeLines.length > 0) {
            tl.fromTo(codeLines,
                { autoAlpha: 0, x: 10 },
                { autoAlpha: 1, x: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out' },
                0.6
            );
        }
    });
};

const initProjectProgress = () => {
    console.log('initProjectProgress called');
    const progressEl = document.getElementById('project-progress');
    const progressNumEl = document.getElementById('project-progress-num');
    const pinCards = gsap.utils.toArray(".project-card");
    const contactSection = document.querySelector('#contact');

    if (!progressEl || !progressNumEl || pinCards.length === 0) return;

    // Show/hide progress indicator ONLY during project cards, hide before contact
    ScrollTrigger.create({
        trigger: pinCards[0],
        start: "top 80%",
        endTrigger: pinCards[pinCards.length - 1],
        end: "bottom top",
        onEnter: () => progressEl.classList.add('visible'),
        onLeave: () => progressEl.classList.remove('visible'),
        onEnterBack: () => progressEl.classList.add('visible'),
        onLeaveBack: () => progressEl.classList.remove('visible'),
    });

    // Extra safety: explicitly hide when contact section appears
    if (contactSection) {
        ScrollTrigger.create({
            trigger: contactSection,
            start: "top 90%",
            end: "bottom bottom",
            onEnter: () => progressEl.classList.remove('visible'),
            onLeaveBack: () => {
                // Only re-show if we're still in project cards zone
                const lastCard = pinCards[pinCards.length - 1];
                const rect = lastCard.getBoundingClientRect();
                if (rect.bottom > 0 && rect.top < window.innerHeight) {
                    progressEl.classList.add('visible');
                }
            },
        });
    }

    // Update counter for each card
    pinCards.forEach((card, index) => {
        ScrollTrigger.create({
            trigger: card,
            start: "top center",
            onEnter: () => {
                progressNumEl.textContent = String(index + 1).padStart(2, '0');
            },
            onEnterBack: () => {
                progressNumEl.textContent = String(index + 1).padStart(2, '0');
            },
        });
    });
};

window.initAnimations = {
    initLoader,
    initHero,
    initScrollAnimations,
    initZoomAnimation,
    initHorizontalSkills,
    initProjectStack,
    initProjectTitleCharacterAnimation,
    initProjectContentReveal,
    initProjectProgress
};
