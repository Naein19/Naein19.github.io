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
        }, "-=0.5")
        .to('.scroll-indicator', {
            opacity: 1, y: 0, duration: 1, ease: 'power2.out', autoAlpha: 1
        }, "-=0.5");
};

const initScrollAnimations = () => {
    console.log('initScrollAnimations called');
    gsap.registerPlugin(ScrollTrigger);

    // Project cards animation
    document.querySelectorAll('.project-card').forEach((card) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 100, opacity: 0, duration: 1, ease: 'power3.out'
        });
    });

    // Contact links animation
    gsap.from('.contact-link', {
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 70%',
        },
        y: 50, opacity: 0, stagger: 0.2, duration: 1, ease: 'power3.out'
    });
};

const initZoomAnimation = () => {
    console.log('initZoomAnimation called');
    const target = document.querySelector('.zoom-target');
    const aboutSection = document.querySelector('#about-section');
    const aboutHeading = document.querySelector('.about-heading');
    const aboutLines = document.querySelectorAll('.about-line');

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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-color)',
        transformOrigin: "center center"
    });

    gsap.set([aboutHeading, aboutLines], {
        opacity: 0,
        filter: 'blur(10px)'
    });

    // --- SIMULTANEOUS PINNING STRATEGY ---
    // 1. Pin Hero (No spacing)
    ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: '+=3000',
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
        onLeave: () => gsap.set('#hero', { autoAlpha: 0 }),
        onEnterBack: () => gsap.set('#hero', { autoAlpha: 1 })
    });

    // 2. Pin About (With spacing)
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: aboutSection,
            start: 'top top',
            end: '+=3000',
            pin: true,
            pinSpacing: true,
            scrub: 1.2,
            invalidateOnRefresh: true,
            onLeave: () => {
                gsap.set(aboutSection, {
                    position: 'relative',
                    top: 'auto',
                    left: 'auto',
                    zIndex: 5,
                    opacity: 1,
                    scale: 1,
                    clearProps: "transform"
                });
                // Ensure text elements stay visible
                gsap.set([aboutHeading, aboutLines], {
                    opacity: 1,
                    filter: 'blur(0px)'
                });
            },
            onEnterBack: () => {
                gsap.set(aboutSection, {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 50
                });
            },
            onLeaveBack: () => {
                // Reset states when scrolling back to Hero
                gsap.set(aboutSection, {
                    autoAlpha: 0,
                    scale: 0.85
                });
            }
        }
    });

    // --- ZOOM & POPUP ANIMATION ---
    // Step 1: Zoom Animation (Letter 'A')
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
        .to('.hero-title .char:not(.zoom-target), .hero-title-last, .hero-subtitle, .scroll-indicator', {
            autoAlpha: 0,
            duration: 0.5
        }, 0)
        .to('#bg-canvas', {
            autoAlpha: 0,
            duration: 0.5
        }, 0);

    // Step 2: About Section "Popup" Animation
    tl.to(aboutSection, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.8,
        ease: "power4.out"
    }, 0.6);

    // Step 3: Scroll Text Reveal Animation (Scrubbed)
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
            onUpdate: (self) => {
                // Hide About when in Skills
                if (self.progress > 0) {
                    gsap.set('#about', { autoAlpha: 0 });
                } else {
                    gsap.set('#about', { autoAlpha: 1 });
                }
            }
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

    // Animate content
    panels.forEach((panel) => {
        const content = panel.querySelector('.panel-content');
        if (content) {
            const progressBars = panel.querySelectorAll('.skill-progress');
            progressBars.forEach((bar) => {
                const item = bar.closest('.skill-item');
                if (item) {
                    const percent = item.getAttribute('data-percent');
                    gsap.fromTo(bar, { width: '0%' }, {
                        width: `${percent}%`,
                        duration: 1.5,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: panel,
                            containerAnimation: scrollTween,
                            start: "left center",
                            toggleActions: "play none none reverse"
                        }
                    });
                }
            });
        }
    });
};

window.initAnimations = {
    initLoader,
    initHero,
    initScrollAnimations,
    initZoomAnimation,
    initHorizontalSkills
};
