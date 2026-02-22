/* ============================================================
   index.js
   JavaScript specific to the index/landing page.
   Handles the aurora animation and transparent nav on scroll.
   Linked from index.html via: <script src="js/index.js"></script>
   ============================================================ */




/* ── Transparent Nav on Scroll ─────────────────────────────
   The nav starts fully transparent so it blends into the hero.
   Once the user scrolls past 80px, the .scrolled class is added
   which brings in the frosted glass background.
   The CSS in base.css handles what .scrolled actually looks like.
   ---------------------------------------------------------- */
const indexNav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    indexNav.classList.toggle('scrolled', window.scrollY > 80);
});


/* ── Aurora Borealis ───────────────────────────────────────
   Animated colored light bands drawn on a <canvas> element.
   Only renders in dark mode — checks data-theme before drawing.
   The canvas is fixed to the viewport so it covers the whole
   page as you scroll.
   ---------------------------------------------------------- */
const canvas = document.getElementById('aurora-canvas');
const ctx = canvas.getContext('2d');

// Resize the canvas to always match the window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Each band is an oval blob of color that drifts slowly
const bands = [
    { x: 0.50, y: 0.20, width: 1.4, height: 0.35, hue: 160, speed: 0.0003,  phase: 0.0, opacity: 0.40 },
    { x: 0.30, y: 0.28, width: 1.1, height: 0.28, hue: 185, speed: 0.0004,  phase: 1.2, opacity: 0.32 },
    { x: 0.70, y: 0.15, width: 1.2, height: 0.30, hue: 140, speed: 0.00025, phase: 2.5, opacity: 0.30 },
    { x: 0.40, y: 0.35, width: 0.9, height: 0.22, hue: 200, speed: 0.00035, phase: 0.8, opacity: 0.25 },
    { x: 0.65, y: 0.10, width: 1.0, height: 0.25, hue: 270, speed: 0.0002,  phase: 3.1, opacity: 0.18 },
    { x: 0.20, y: 0.18, width: 0.8, height: 0.20, hue: 290, speed: 0.00045, phase: 1.8, opacity: 0.22 },
    { x: 0.80, y: 0.25, width: 0.9, height: 0.22, hue: 310, speed: 0.00038, phase: 4.2, opacity: 0.20 },
];

let time = 0;


let scrollOpacity = 0;

// Just fade in to a fixed opacity and stay there
const startTime = performance.now();
const fadeInDuration = 2000;

function fadeInAurora(now) {
    const elapsed = now - startTime;
    scrollOpacity = Math.min(0.6, (elapsed / fadeInDuration) * 0.7); // max 0.6 instead of 1.0
    if (elapsed < fadeInDuration) requestAnimationFrame(fadeInAurora);
}
requestAnimationFrame(fadeInAurora);


function drawAurora() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Only draw if dark mode is active
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        const W = canvas.width;
        const H = canvas.height;

        ctx.save();
        ctx.globalAlpha = scrollOpacity;

        bands.forEach(band => {
            const t = time * band.speed;

            // Each band drifts slowly using sine/cosine waves
            const cx = (band.x + Math.sin(t * 0.7 + band.phase) * 0.15) * W;
            const cy = (band.y + Math.cos(t * 0.5 + band.phase) * 0.08) * H;
            const rx = band.width  * W * (0.9 + Math.sin(t + band.phase) * 0.1);
            const ry = band.height * H * (0.85 + Math.cos(t * 1.3 + band.phase) * 0.15);

            // Hue and opacity also shift slowly over time
            const hue = band.hue + Math.sin(t * 0.3 + band.phase) * 25;
            const opacity = band.opacity * (0.7 + Math.sin(t * 0.8 + band.phase) * 0.3);
            const r = Math.max(rx, ry);

            // Radial gradient fades from the center color out to transparent
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            grad.addColorStop(0,   `hsla(${hue}, 80%, 55%, ${opacity})`);
            grad.addColorStop(0.4, `hsla(${hue + 15}, 70%, 45%, ${opacity * 0.6})`);
            grad.addColorStop(1,   `hsla(${hue + 30}, 60%, 35%, 0)`);

            // Scale the circle into an oval and use 'lighter' blending
            // so overlapping bands add their colors together
            ctx.save();
            ctx.translate(cx, cy);
            ctx.scale(rx / r, ry / r);
            ctx.translate(-cx, -cy);
            ctx.globalCompositeOperation = 'lighter';
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.restore();
        });

        ctx.restore();
    }

    time++;
    requestAnimationFrame(drawAurora); // loops every frame (~60fps)
}

drawAurora();

// Fade images in once they've actually loaded
document.querySelectorAll('.project-image img').forEach(img => {
    if (img.complete) {
        img.classList.add('loaded');
    } else {
        img.addEventListener('load', () => img.classList.add('loaded'));
    }
});