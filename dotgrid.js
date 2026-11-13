// Fundo de grade de pontos interativo (porte em JS puro do componente
// "Dot Grid BG"): perto do cursor os pontos crescem, ficam mais opacos e
// orbitam numa elipse 3D inclinada; ao sair, a influência se dissolve.
(() => {
    const cfg = {
        dotSize: 3,
        spacing: 28,
        orbitSpeed: 1.5,
        impactRadius: 100,
        scaleOnHover: 1.8
    };
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const canvas = document.createElement('canvas');
    canvas.id = 'dot-grid';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(canvas, document.body.firstChild);
    const ctx = canvas.getContext('2d');

    let W = 0, H = 0, dots = [];
    let color = '#e5262f';
    const mouse = { x: -9999, y: -9999, hovering: false, left: 0 };
    let angle = 0, running = false, last = 0;

    const smooth = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };
    const readColor = () => {
        color = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim() || '#e5262f';
    };

    function build() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth; H = window.innerHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const sp = cfg.spacing;
        const cols = Math.ceil(W / sp) + 2, rows = Math.ceil(H / sp) + 2;
        dots = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                dots.push({
                    bx: c * sp, by: r * sp,
                    phase: Math.random() * Math.PI * 2,
                    inc: Math.random() * Math.PI,
                    asc: Math.random() * Math.PI * 2,
                    mult: 0.7 + Math.random() * 0.6
                });
            }
        }
        draw(0);
    }

    function draw(now) {
        const sinceLeave = (now - mouse.left) / 1000;
        const decay = mouse.hovering ? 1 : smooth(Math.max(0, 1 - sinceLeave * 1.5));
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = color;
        const R = cfg.impactRadius;

        // fontes de influência: o mouse real e todos os cursores dos agentes
        const pts = [];
        if (decay > 0) pts.push({ x: mouse.x, y: mouse.y, w: decay, R });
        const ap = window.__agentPts ? window.__agentPts() : [];
        for (const p of ap) pts.push({ x: p.x, y: p.y, w: 1, R: R * 0.85 });

        for (const d of dots) {
            let x = d.bx, y = d.by, scale = 1, alpha = 0.3;
            let inf = 0, t = 1;
            for (const p of pts) {
                const dx = d.bx - p.x, dy = d.by - p.y;
                if (dx > p.R || dx < -p.R || dy > p.R || dy < -p.R) continue;
                const dist = Math.hypot(dx, dy);
                if (dist >= p.R) continue;
                const tt = dist / p.R, ii = smooth(1 - tt) * p.w;
                if (ii > inf) { inf = ii; t = tt; }
            }
            if (inf > 0) {
                let depth = 1;
                if (!reduceMotion) {
                    const orbitR = (1 - t) * cfg.spacing * 0.7 * inf;
                    const th = angle * d.mult + d.phase;
                    const x0 = Math.cos(th) * orbitR, y0 = Math.sin(th) * orbitR;
                    const y1 = y0 * Math.cos(d.inc), lz = y0 * Math.sin(d.inc);
                    x += x0 * Math.cos(d.asc) - y1 * Math.sin(d.asc);
                    y += x0 * Math.sin(d.asc) + y1 * Math.cos(d.asc);
                    depth = 0.75 + 0.25 * ((lz / Math.max(orbitR, 1)) * 0.5 + 0.5);
                }
                scale = (1 + (cfg.scaleOnHover - 1) * inf) * depth;
                alpha = (0.3 + 0.7 * inf) * depth;
            }
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(x, y, (cfg.dotSize / 2) * scale, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    function loop(now) {
        const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
        last = now;
        angle += cfg.orbitSpeed * dt;
        draw(now);
        const fading = !mouse.hovering && (now - mouse.left) / 1000 < 0.7;
        const agentsOn = window.__agentPts && window.__agentPts().length;
        if (mouse.hovering || fading || agentsOn) requestAnimationFrame(loop);
        else running = false;
    }
    const start = () => {
        if (running) return;
        running = true; last = performance.now();
        requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        mouse.x = e.clientX; mouse.y = e.clientY; mouse.hovering = true;
        start();
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => {
        mouse.hovering = false; mouse.left = performance.now();
        start();
    });

    window.addEventListener('agents:live', start);

    let resizeT;
    window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(build, 120); });
    new MutationObserver(() => { readColor(); draw(performance.now()); })
        .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    readColor();
    build();
})();
