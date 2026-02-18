// --- ANIMATIONS ---
const initLoader = () => {
    console.log('initLoader called');
    gsap.set('.l-char', { y: 20, opacity: 0 });
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
                window.initAnimations.initHorizontalSkills(); // Horizontal Scroll
                window.initAnimations.initProjectStack(); // Project Stack
                window.initAnimations.initProjectTitleCharacterAnimation(); // Projects Title Character Float
                window.initAnimations.initProjectContentReveal(); // Project Content Reveal
                // Refresh ScrollTrigger to ensure positions are correct after animations
                ScrollTrigger.refresh();
            });
        }
    });

    tl.to('.l-char', {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out'
    })
        .to('.l-char', {
            y: -50, opacity: 0, stagger: 0.05, duration: 0.5, delay: 0.5, ease: 'power3.in'
        })
        .to('.loader', {
            opacity: 0, duration: 0.5, ease: 'power2.inOut'
        });
};

const initHero = (onCompleteCallback) => {
    console.log('initHero called');
    const tl = gsap.timeline({
        onComplete: onCompleteCallback
    });
    tl.to('.hero-title .char', {
        y: 0, stagger: 0.05, duration: 1, ease: 'power4.out', autoAlpha: 1
    })
        .to('.hero-title-last .char', {
            y: 0, stagger: 0.05, duration: 1, ease: 'power4.out', autoAlpha: 1
        }, "-=0.8")
        .to('.hero-subtitle', {
            opacity: 1, y: 0, duration: 1, ease: 'power2.out', autoAlpha: 1
        }, "-=0.5");
};

const initScrollAnimations = () => {
    console.log('initScrollAnimations called');
    gsap.registerPlugin(ScrollTrigger);

    // Contact section reveal animation
    const contactTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 70%',
            toggleActions: 'play none none none'
        }
    });

    contactTl.from('.contact-label', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0)
        .from('.contact-status', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.1)
        .from('.contact-heading', { y: 60, opacity: 0, duration: 1, ease: 'power3.out' }, 0.15)
        .from('.contact-email-link', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.4)
        .from('.contact-divider', { scaleX: 0, duration: 0.8, ease: 'power3.inOut', transformOrigin: 'left center' }, 0.5)
        .from('.contact-social-link', { y: 20, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power3.out' }, 0.7)
        .from('.contact-copyright', { opacity: 0, duration: 0.5 }, 0.9);
};

const initZoomAnimation = () => {
    console.log('initZoomAnimation called');
    const target = document.querySelector('.zoom-target');
    const aboutSection = document.querySelector('#about-section');
    const aboutHeading = document.querySelector('.about-heading');
    const aboutLines = document.querySelectorAll('.about-line');
    const aboutStats = document.querySelector('.about-stats');
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
        width: '100vw',
        height: '100vh',
        zIndex: 50,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-color)',
        transformOrigin: "center center",
        padding: 'clamp(4rem, 6vh, 6rem) 3rem',
        boxSizing: 'border-box'
    });

    gsap.set([aboutHeading, aboutLines], {
        opacity: 0,
        filter: 'blur(10px)'
    });

    if (aboutStats) {
        gsap.set(aboutStats, { opacity: 0, y: 30 });
    }

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
        .to('.hero-title .char:not(.zoom-target), .hero-title-last, .hero-subtitle', {
            autoAlpha: 0,
            duration: 0.4
        }, 0)
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

    // --- PHASE 3: Text Reveal ---
    tl.to(aboutHeading, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.6,
        ease: "power3.out"
    }, ">-0.4")
        .to(aboutLines, {
            opacity: 1,
            filter: 'blur(0px)',
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out"
        }, ">-0.3");

    // --- PHASE 3.5: Stats Counter Reveal ---
    if (aboutStats) {
        tl.to(aboutStats, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            onStart: () => {
                // Mark section visible for CSS animations
                aboutSection.setAttribute('data-visible', '');
                // Animate stat numbers counting up
                statNumbers.forEach(el => {
                    const target = parseInt(el.textContent);
                    const suffix = el.textContent.replace(/[0-9]/g, '');
                    gsap.fromTo(el, { innerText: 0 }, {
                        innerText: target,
                        duration: 1.8,
                        ease: "power2.out",
                        snap: { innerText: 1 },
                        onUpdate: function() {
                            el.textContent = Math.round(gsap.getProperty(el, 'innerText')) + suffix;
                        }
                    });
                });
            }
        }, ">-0.3");
    }

    // --- PHASE 4: Exit Animation (Fade Up) ---
    const exitEls = [aboutHeading, ...aboutLines];
    if (aboutStats) exitEls.push(aboutStats);
    tl.to(exitEls, {
        y: -80,
        opacity: 0,
        filter: 'blur(10px)',
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

    const scrollTween = gsap.to(skillsContainer, {
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

    // RESTORE SKILLS HEADING ANIMATION
    gsap.fromTo('.skills-heading', { opacity: 0, y: 50 }, {
        opacity: 1, y: 0,
        scrollTrigger: {
            trigger: skillsSection,
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    // Animate content (icons don't need independent scroll animations as per request)
};

const initProjectStack = () => {
    console.log('initProjectStack called');
    const pinCards = gsap.utils.toArray(".project-card");

    if (pinCards.length === 0) return;

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
                    const progress = self.progress;
                    gsap.set(eachCard, {
                        scale: 1 - progress * 0.25,
                        rotation: index % 2 === 0 ? progress * 5 : - progress * 5,
                        rotationX: index % 2 === 0 ? progress * 40 : - progress * 40,
                    });

                    const overlay = eachCard.querySelector(".overlay");
                    if (overlay) {
                        gsap.set(overlay, {
                            opacity: progress * 0.4
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
    if (!title) return;

    // Split text into characters
    const text = title.textContent;
    title.innerHTML = '';
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char; // Handle spaces
        span.className = 'char';
        title.appendChild(span);
    });

    const chars = title.querySelectorAll('.char');

    gsap.fromTo(chars,
        {
            opacity: 0,
            yPercent: 120,
            scaleY: 2.3,
            scaleX: 0.7,
            transformOrigin: "50% 0%"
        },
        {
            opacity: 1,
            yPercent: 0,
            scaleY: 1,
            scaleX: 1,
            duration: 1,
            ease: "back.inOut(2)",
            stagger: 0.03,
            scrollTrigger: {
                trigger: "#project-title",
                start: "center bottom+=50%",
                end: "bottom bottom-=40%",
                scrub: true,
                invalidateOnRefresh: true,
                id: "project-title-anim"
            }
        }
    );
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
                toggleActions: 'play none none none'
            }
        });

        // Watermark number scale in
        if (numberBg) {
            tl.fromTo(numberBg,
                { autoAlpha: 0, scale: 0.85 },
                { autoAlpha: 1, scale: 1, duration: 1.4, ease: 'power2.out' },
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

        // Mockup slide in with subtle 3D
        if (mockup) {
            tl.fromTo(mockup,
                { autoAlpha: 0, x: 80, rotationY: -8 },
                { autoAlpha: 1, x: 0, rotationY: 0, duration: 1, ease: 'power3.out' },
                0.25
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

window.initAnimations = {
    initLoader,
    initHero,
    initScrollAnimations,
    initZoomAnimation,
    initHorizontalSkills,
    initProjectStack,
    initProjectTitleCharacterAnimation,
    initProjectContentReveal
};
