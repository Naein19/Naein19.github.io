console.log('Script.js loaded');

// --- MAIN SCRIPT ---
window.addEventListener('load', () => {
    console.log('Window Loaded');
    try {
        // Initialize Lenis
        if (typeof Lenis !== 'undefined') {
            const lenis = new Lenis({
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

    // Start Animations
    try {
        if (typeof gsap !== 'undefined') {
            // Ensure initial states for Hero
            gsap.set('.hero-title .char', { y: 100, autoAlpha: 0 }); // Hide initially
            gsap.set('.hero-title-last .char', { y: 100, autoAlpha: 0 });
            gsap.set('.hero-subtitle', { y: 20, autoAlpha: 0 });
            gsap.set('.scroll-indicator', { y: 20, autoAlpha: 0 });

            if (window.initAnimations) {
                // initLoader will chain: initHero -> initZoomAnimation -> initScrollAnimations
                window.initAnimations.initLoader();
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
});
