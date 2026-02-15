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

    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '#about',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 50, opacity: 0, duration: 1.5, ease: 'power3.out'
    });

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
    if (!target) return;

    const getCenterCoords = () => {
        const rect = target.getBoundingClientRect();
        const viewportCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const targetCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        return {
            x: viewportCenter.x - targetCenter.x,
            y: viewportCenter.y - targetCenter.y
        };
    };

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: '+=2500', // Increased distance for both animations
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            // markers: true // Debugging
            onLeave: () => {
                // When animation completes, make About section scale/position normal for scrolling
                // We typically need to match the scroll position where the pin ends.
                // However, since we pinned 'Hero', the 'About' section is technically below it.
                // For a true "popup" that transitions to normal scroll, we might need to unfix it.
                gsap.set('#about', { position: 'relative', top: 'auto', left: 'auto', height: 'auto', width: '100%', y: 0, scale: 1, autoAlpha: 1 });
            },
            onEnterBack: () => {
                // Re-fix it for reverse animation
                gsap.set('#about', { position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 50 });
            },
            onLeaveBack: () => {
                gsap.set('.hero-title .char, .hero-title-last .char, .hero-subtitle, .scroll-indicator', {
                    autoAlpha: 1,
                    overwrite: true
                });
                gsap.set('#bg-canvas', { autoAlpha: 1 });
                // Ensure About is hidden and reset
                gsap.set('#about', { autoAlpha: 0, position: 'relative' });
            }
        }
    });

    // Step 0: Initial state for About Section (Popup)
    // We set this immediately when the timeline is created/refreshed
    gsap.set('#about', {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 50,
        autoAlpha: 0,
        scale: 0.6,
        y: 100,
        transformOrigin: "center center"
    });

    // Step 1: Zoom into 'A'
    tl.to(target, {
        scale: 300,
        x: () => getCenterCoords().x,
        y: () => getCenterCoords().y,
        rotate: 0,
        transformOrigin: "center center",
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

    // Step 2: About Section Popup
    // Starts after Zoom finishes (relative time)
    tl.to('#about', {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "power4.out"
    });
};

window.initAnimations = {
    initLoader,
    initHero,
    initScrollAnimations,
    initZoomAnimation
};
