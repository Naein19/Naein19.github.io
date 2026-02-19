// --- AMBIENT CANVAS — Soft Cinematic Light Field (2D) ---
// Vintage film-inspired: slow-drifting radial light orbs
// No Three.js dependency — pure 2D canvas for performance
try {
    const canvas = document.querySelector('#bg-canvas');
    const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window && navigator.maxTouchPoints > 0);

    if (canvas && !isMobile) {
        const ctx = canvas.getContext('2d');
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;

        // --- Soft light orbs (vintage bokeh / film light leak feel) ---
        const orbs = [
            { x: 0.25, y: 0.35, r: 380, o: 0.028, sx: 0.13, sy: 0.09, px: 0, py: 1.8 },
            { x: 0.72, y: 0.28, r: 300, o: 0.022, sx: 0.10, sy: 0.14, px: 3.1, py: 0.5 },
            { x: 0.50, y: 0.72, r: 340, o: 0.018, sx: 0.11, sy: 0.08, px: 1.4, py: 4.0 },
            { x: 0.15, y: 0.65, r: 220, o: 0.015, sx: 0.09, sy: 0.12, px: 5.0, py: 2.3 },
            { x: 0.82, y: 0.60, r: 260, o: 0.020, sx: 0.12, sy: 0.07, px: 2.2, py: 5.5 },
        ];

        // Scroll-linked fade: orbs dim as user scrolls past hero
        let scrollY = 0;
        window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

        // Cinematic 24fps render
        let lastFrame = 0;
        const fps = 1000 / 24;
        let time = 0;

        function draw(now) {
            requestAnimationFrame(draw);
            if (now - lastFrame < fps) return;
            lastFrame = now;
            time += 0.008;

            // Fade canvas as user scrolls away from hero
            const scrollFade = Math.max(0, 1 - scrollY / (h * 0.8));
            if (scrollFade <= 0) return; // Skip drawing if fully scrolled past

            ctx.clearRect(0, 0, w, h);
            ctx.globalAlpha = scrollFade;

            orbs.forEach(orb => {
                // Organic drift — slow sine/cosine paths
                const cx = (orb.x + Math.sin(time * orb.sx + orb.px) * 0.12) * w;
                const cy = (orb.y + Math.cos(time * orb.sy + orb.py) * 0.08) * h;

                // Subtle breathing — opacity oscillates gently
                const breathe = 1 + Math.sin(time * 0.5 + orb.px) * 0.15;
                const opacity = orb.o * breathe;

                // Soft radial gradient (Gaussian-like falloff)
                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, orb.r);
                grad.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
                grad.addColorStop(0.35, `rgba(255, 255, 255, ${opacity * 0.5})`);
                grad.addColorStop(0.7, `rgba(255, 255, 255, ${opacity * 0.12})`);
                grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, w, h);
            });

            ctx.globalAlpha = 1;
        }

        requestAnimationFrame(draw);

        window.addEventListener('resize', () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        });
    }
} catch (e) {
    console.error('Canvas Error:', e);
}
