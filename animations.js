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
                window.initAnimations.initExperienceTimeline();
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
    const aboutLeftColumn = document.querySelector('.about-column-left');
    const aboutRightColumn = document.querySelector('.about-column-right');
    const aboutSideIdentity = document.querySelector('.about-side-identity');

    if (!target || !aboutSection || window.innerWidth <= 1024) return;

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
    gsap.set(aboutSection, {
        opacity: 0,
        scale: 0.85,
        autoAlpha: 0,
        visibility: 'visible',
        position: window.innerWidth > 1024 ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        width: '100%',
        height: window.innerWidth > 1024 ? '100vh' : 'auto',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-color)',
        transformOrigin: "center center",
        boxSizing: 'border-box'
    });

    gsap.set([aboutHeading, aboutLeftColumn, aboutRightColumn], { opacity: 0, y: 30 });
    if (aboutLabel) {
        gsap.set(aboutLabel, { opacity: 0, x: -20 });
    }
    if (aboutSideIdentity) {
        gsap.set(aboutSideIdentity, { opacity: 0, x: -30 });
    }

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

    // --- PHASE 1: Zoom Animation ---
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
        .to(target, { autoAlpha: 0, duration: 0.3 }, 0.4)
        .to('.hero-role-badge', { autoAlpha: 0, y: -40, duration: 0.35, ease: 'power2.in' }, 0)
        .to('.hero-title .char:not(.zoom-target)', { autoAlpha: 0, duration: 0.4 }, 0)
        .to('.hero-title-last', { autoAlpha: 0, y: 20, duration: 0.4 }, 0)
        .to('.hero-subtitle', { autoAlpha: 0, y: 40, duration: 0.35 }, 0)
        .to('.hero-line', { autoAlpha: 0, scaleX: 0, duration: 0.3 }, 0)
        .to('.hero-expertise', { autoAlpha: 0, y: 50, duration: 0.35 }, 0)
        .to('.hero-glow-orb', { autoAlpha: 0, scale: 1.4, duration: 0.5 }, 0)
        .to('#bg-canvas', { autoAlpha: 0, duration: 0.4 }, 0);

    // --- PHASE 2: About Section "Popup" ---
    tl.to(aboutSection, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.6,
        ease: "power4.out"
    }, 0.35);

    // --- PHASE 3: Content Reveal ---
    if (aboutSideIdentity) {
        tl.to(aboutSideIdentity, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }, ">-0.5");
    } else if (aboutLabel) {
        tl.to(aboutLabel, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }, ">-0.5");
    }

    tl.to([aboutHeading, aboutLeftColumn], {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out"
    }, ">-0.4")
        .to(aboutRightColumn, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            onStart: () => {
                aboutSection.setAttribute('data-visible', '');
            }
        }, ">-0.3");

    // --- PHASE 4: Exit Animation (Desktop Only) ---
    tl.to([aboutSideIdentity, aboutLabel, aboutHeading, aboutLeftColumn, aboutRightColumn].filter(Boolean), {
        y: -60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: "power2.in"
    }, ">0.2")
        .to(aboutSection, { autoAlpha: 0, duration: 0.5 }, ">-0.2");
};

const initExperienceTimeline = () => {
    console.log('initExperienceTimeline called');
    const section = document.querySelector('#experience-section');
    const entries = gsap.utils.toArray('.timeline-entry');
    const line = document.querySelector('.timeline-line');

    if (!section || entries.length === 0) return;

    // Header reveal (Desktop only - handled by media query in CSS for mobile)
    if (window.innerWidth > 1024) {
        gsap.fromTo('#experience-section .section-header',
            { opacity: 0, x: -30 },
            {
                opacity: 1, x: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '#experience-section',
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play reverse play reverse",
                }
            }
        );
    }

    // Line drawing animation
    gsap.fromTo(line,
        { scaleY: 0, transformOrigin: "top center" },
        {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
                trigger: '.timeline-container',
                start: "top 70%",
                end: "bottom 80%",
                scrub: 1
            }
        }
    );

    // Sequential reveal for entries
    entries.forEach((entry, i) => {
        const marker = entry.querySelector('.timeline-marker');
        const card = entry.querySelector('.timeline-card');

        gsap.fromTo([marker, card],
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
                stagger: 0.12,
                scrollTrigger: {
                    trigger: entry,
                    start: "top 88%",
                    toggleActions: "play none none none"
                }
            }
        );
    });
};

const initHorizontalSkills = () => {
    console.log('initHorizontalSkills called');
    const skillsSection = document.querySelector('#skills');
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
        },
        // Title reveal for all screen sizes
        "all": function () {
            gsap.fromTo('.skills-heading', { opacity: 0, y: 30 }, {
                opacity: 1, y: 0,
                scrollTrigger: {
                    trigger: skillsSection,
                    start: "top 90%",
                    end: () => "+=" + (skillsContainer.scrollWidth + window.innerWidth),
                    toggleActions: "play reverse play reverse",
                    invalidateOnRefresh: true,
                }
            });
        },

        // Mobile: vertical stacking with fade-in reveals
        "(max-width: 768px)": function () {
            panels.forEach(panel => {
                gsap.fromTo(panel, { opacity: 0, y: 30 }, {
                    opacity: 1, y: 0,
                    scrollTrigger: {
                        trigger: panel,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                });
            });
        }
    });
};

const initProjectStack = () => {
    // No-op: pinned full-height cards are removed in the new cinematic layout
    console.log('initProjectStack: cinematic layout — skipping pin logic');
};

const initProjectTitleCharacterAnimation = () => {
    console.log('initProjectTitleCharacterAnimation called');
    const header = document.querySelector('.projects-header');
    if (!header) return;

    const chars = header.querySelectorAll('.char');
    if (chars.length === 0) return;

    gsap.fromTo(chars,
        { opacity: 0, yPercent: 110, scaleY: 2, scaleX: 0.75, transformOrigin: '50% 0%', filter: 'blur(8px)' },
        {
            opacity: 1, yPercent: 0, scaleY: 1, scaleX: 1, filter: 'blur(0px)',
            duration: 1, ease: 'back.inOut(2)', stagger: 0.045,
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                end: 'center center',
                scrub: true,
                invalidateOnRefresh: true
            }
        }
    );

    // Animate label row and meta
    gsap.fromTo(['.projects-label-row', '.projects-header-meta'],
        { opacity: 0, y: 20 },
        {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: header, start: 'top 75%', toggleActions: 'play none none none' }
        }
    );
};

const initProjectContentReveal = () => {
    // 1. Fixed Header Reveal (Desktop only)
    if (window.innerWidth > 1024) {
        gsap.fromTo('.projects-minimal-header',
            { opacity: 0, x: -30 },
            {
                opacity: 1, x: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '#projects-section',
                    // Delayed appearance to prevent overlap with skills
                    start: "top 60%",
                    end: "bottom 20%",
                    toggleActions: "play reverse play reverse",
                }
            }
        );
    }

    // 2. Project Rows reveal - clean vertical showcase
    const projectRows = gsap.utils.toArray('.project-row');
    projectRows.forEach((row) => {
        gsap.fromTo(row,
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0,
                duration: 1.2, ease: 'power2.out',
                scrollTrigger: {
                    trigger: row,
                    start: 'top 82%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
};

const initProjectProgress = () => {
    // No-op: progress counter removed in cinematic redesign
    console.log('initProjectProgress: cinematic layout — skipping');
};

window.initAnimations = {
    initLoader,
    initHero,
    initScrollAnimations,
    initZoomAnimation,
    initExperienceTimeline,
    initHorizontalSkills,
    initProjectStack,
    initProjectTitleCharacterAnimation,
    initProjectContentReveal,
    initProjectProgress
};

