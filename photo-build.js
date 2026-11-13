// A foto do hero é "construída" depois da introdução: milhares de pixels saem do
// monitor de código, formam o retrato de cima para baixo seguindo uma linha de
// varredura, e a foto real assume no final.
(() => {
    const fig = document.querySelector('.hero-photo');
    if (!fig) return;
    const img = fig.querySelector('img');
    const cv = fig.querySelector('canvas');
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !cv || !cv.getContext) return;

    fig.classList.add('pending');
    const loaded = new Promise((res) => {
        if (img.complete && img.naturalWidth) res();
        else { img.addEventListener('load', res, { once: true }); img.addEventListener('error', res, { once: true }); }
    });

    const rnd = (() => { let s = 99; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);


    // ---- partículas que saltam da barra do terno (base da foto), em loop ----
    let sparksOn = false;
    function startSparks() {
        if (sparksOn) return;
        sparksOn = true;
        const sc = document.createElement('canvas');
        sc.className = 'photo-sparks';
        sc.setAttribute('aria-hidden', 'true');
        fig.appendChild(sc);
        const ctx = sc.getContext('2d');
        let W = 0, H = 0, dpr = 1;
        const size = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = sc.clientWidth; H = sc.clientHeight;
            sc.width = W * dpr; sc.height = H * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        size();
        window.addEventListener('resize', size);
        const cols = ['#ff4d4d', '#ff8a5c', '#ffd0b0', '#ffffff'];
        const ps = [];
        let visible = true, last = performance.now(), acc = 0;
        new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(fig);
        const rate = window.innerWidth < 700 ? 22 : 42;   // partículas por segundo
        const spawn = () => {
            // nasce ao longo da barra do terno, na faixa onde a foto desvanece
            const x = W * (0.2 + Math.random() * 0.6);
            const y = H * (0.80 + Math.random() * 0.1);
            ps.push({
                x, y, floor: y + H * 0.04,
                vx: (Math.random() - 0.5) * 60,
                vy: -(110 + Math.random() * 230),
                r: 2 + Math.random() * 3.2,
                life: 0, max: 1.3 + Math.random() * 1.6,
                bounce: 0.35 + Math.random() * 0.25,
                c: cols[(Math.random() * cols.length) | 0]
            });
        };
        const G = 360;
        const frame = (now) => {
            const dt = Math.min(0.05, (now - last) / 1000); last = now;
            if (!document.hidden && visible) {
                acc += dt * rate;
                while (acc >= 1) { acc -= 1; spawn(); }
                ctx.clearRect(0, 0, W, H);
                for (let i = ps.length - 1; i >= 0; i--) {
                    const p = ps[i];
                    p.life += dt;
                    if (p.life >= p.max) { ps.splice(i, 1); continue; }
                    p.vy += G * dt;
                    p.x += p.vx * dt; p.y += p.vy * dt;
                    if (p.y > p.floor && p.vy > 0) { p.y = p.floor; p.vy *= -p.bounce; p.vx *= 0.7; }   // quica na barra
                    const k = p.life / p.max;
                    ctx.globalAlpha = (k < 0.1 ? k / 0.1 : 1 - (k - 0.1) / 0.9);
                    ctx.fillStyle = p.c;
                    ctx.shadowColor = p.c; ctx.shadowBlur = 12;
                    ctx.fillRect(p.x - p.r / 2, p.y - p.r / 2, p.r, p.r);
                }
                ctx.globalAlpha = 1; ctx.shadowBlur = 0;
            }
            requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
    }

    let started = false;
    async function build() {
        if (started) return;
        started = true;
        await loaded;
        const finish = () => { fig.classList.remove('pending'); fig.classList.add('built'); setTimeout(() => cv.remove(), 900); startSparks(); };
        if (!img.naturalWidth) return finish();

        // 1) amostra os pixels opacos da foto
        const nw = img.naturalWidth, nh = img.naturalHeight;
        const STEP = window.innerWidth < 700 ? 8 : 6;
        const off = document.createElement('canvas');
        off.width = nw; off.height = nh;
        const octx = off.getContext('2d', { willReadFrequently: true });
        octx.drawImage(img, 0, 0);
        const px = octx.getImageData(0, 0, nw, nh).data;

        // 2) canvas do tamanho da figura
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const W = fig.clientWidth, H = fig.clientHeight;
        if (!W || !H) return finish();
        const PAD = Math.round(W * 0.14);
        cv.style.cssText = `inset:auto;left:${-PAD}px;top:${-PAD}px;width:${W + PAD * 2}px;height:${H + PAD * 2}px`;
        cv.width = (W + PAD * 2) * dpr; cv.height = (H + PAD * 2) * dpr;
        const ctx = cv.getContext('2d');
        const base = () => ctx.setTransform(dpr, 0, 0, dpr, PAD * dpr, PAD * dpr);
        base();
        const cell = (STEP * W) / nw;

        // origem: centro do monitor de código (ou abaixo da foto, no celular)
        const fr = fig.getBoundingClientRect();
        const mon = document.querySelector('.code-monitor');
        const mr = mon ? mon.getBoundingClientRect() : { width: 0 };
        const ox = mr.width > 40 ? mr.left + mr.width / 2 - fr.left : W * 0.5;
        const oy = mr.width > 40 ? mr.top + mr.height / 2 - fr.top : H * 1.1;

        const dots = [];
        for (let y = STEP / 2; y < nh; y += STEP) {
            for (let x = STEP / 2; x < nw; x += STEP) {
                const i = ((y | 0) * nw + (x | 0)) * 4;
                if (px[i + 3] < 120) continue;
                const ty = y / nh;
                dots.push({
                    tx: (x / nw) * W, ty: ty * H,
                    sx: ox + (rnd() - 0.5) * 70, sy: oy + (rnd() - 0.5) * 50,
                    arc: (rnd() - 0.5) * 140,
                    delay: ty * 1.25 + rnd() * 0.25,
                    dur: 0.6 + rnd() * 0.35,
                    c: `rgb(${px[i]},${px[i + 1]},${px[i + 2]})`
                });
            }
        }
        const total = dots.reduce((m, d) => Math.max(m, d.delay + d.dur), 0);
        const accent = getComputedStyle(root).getPropertyValue('--accent-primary').trim() || '#e5262f';
        const accent2 = getComputedStyle(root).getPropertyValue('--accent-secondary').trim() || '#ff5a4d';

        // 3) anima
        const draw = (t) => {
            base();
            ctx.clearRect(-PAD, -PAD, W + PAD * 2, H + PAD * 2);

            ctx.fillStyle = accent;
            ctx.beginPath();
            const settled = [];
            for (const d of dots) {
                const k = (t - d.delay) / d.dur;
                if (k <= 0) continue;
                if (k >= 1) { settled.push(d); continue; }
                const e = ease(k);
                const x = d.sx + (d.tx - d.sx) * e + Math.sin(Math.PI * e) * d.arc;
                const y = d.sy + (d.ty - d.sy) * e - Math.sin(Math.PI * e) * Math.abs(d.arc) * 0.6;
                const s = cell * (0.45 + 0.55 * e);
                if (k > 0.82) { // quase no lugar: já mostra a cor real
                    ctx.fillStyle = d.c;
                    ctx.fillRect(x - s / 2, y - s / 2, s, s);
                    ctx.fillStyle = accent;
                } else {
                    ctx.rect(x - s / 2, y - s / 2, s, s);
                }
            }
            ctx.fill();
            const s = cell + 0.7;
            for (const d of settled) {
                ctx.fillStyle = d.c;
                ctx.fillRect(d.tx - s / 2, d.ty - s / 2, s, s);
            }

            // linha de varredura acompanhando a frente da construção
            const front = ((t - 0.55) / 1.25) * H;
            if (front > 0 && front < H + 40) {
                const g = ctx.createLinearGradient(0, front - 46, 0, front);
                g.addColorStop(0, 'rgba(229,38,47,0)');
                g.addColorStop(1, 'rgba(229,38,47,0.28)');
                ctx.fillStyle = g;
                ctx.fillRect(0, front - 46, W, 46);
                ctx.fillStyle = accent2;
                ctx.shadowColor = accent;
                ctx.shadowBlur = 14;
                ctx.fillRect(0, front, W, 2);
                ctx.shadowBlur = 0;
            }

            return t >= total + 0.05;
        };

        // ---- "fixar": quando a foto termina de ser construída ela trava no lugar ----
        // pancada de escala, contorno ciano que se expande, brilho varrendo a silhueta
        // e faíscas saindo da borda (mesma receita do vídeo de referência)
        const sil = document.createElement('canvas');
        sil.width = Math.round(W * dpr); sil.height = Math.round(H * dpr);
        const sg = sil.getContext('2d');
        sg.drawImage(img, 0, 0, sil.width, sil.height);
        sg.globalCompositeOperation = 'source-in';
        sg.fillStyle = '#ff6b5e'; sg.fillRect(0, 0, sil.width, sil.height);
        const tmp = document.createElement('canvas');
        tmp.width = sil.width; tmp.height = sil.height;
        const tg = tmp.getContext('2d');

        const occupied = new Set(dots.map((d) => `${Math.round(d.tx / cell)},${Math.round(d.ty / cell)}`));
        const cxm = W / 2, cym = H * 0.55;
        const sparks = [];
        for (const d of dots) {
            const gx = Math.round(d.tx / cell), gy = Math.round(d.ty / cell);
            const edge = !occupied.has(`${gx - 1},${gy}`) || !occupied.has(`${gx + 1},${gy}`) ||
                !occupied.has(`${gx},${gy - 1}`) || !occupied.has(`${gx},${gy + 1}`);
            if (!edge || rnd() > 0.45) continue;
            const ang = Math.atan2(d.ty - cym, d.tx - cxm) + (rnd() - 0.5) * 0.6;
            const dist = (20 + rnd() * 60) * (W / 560);
            sparks.push({ x: d.tx, y: d.ty, dx: Math.cos(ang) * dist, dy: Math.sin(ang) * dist,
                dl: rnd() * 0.25, life: 0.45 + rnd() * 0.5, sz: 2 + rnd() * 2.6, k: rnd() < 0.5 ? 0 : 1 });
        }
        const punch = (k) => (k < 0 || k > 1 ? 0 : (k < 0.12 ? k / 0.12 : Math.exp(-(k - 0.12) / 0.16)));
        const LOCK = 1.3, AMP = 0.03;
        const drawLock = (t) => {
            base();
            ctx.clearRect(-PAD, -PAD, W + PAD * 2, H + PAD * 2);
            const pk = punch(t / 0.9);
            fig.style.transformOrigin = '50% 60%';
            fig.style.transform = `scale(${1 + AMP * pk})`;

            // contorno ciano que cresce e some
            if (pk > 0.01) {
                const gs = 1 + AMP * 1.8 * pk;
                ctx.save();
                ctx.translate(cxm, cym); ctx.scale(gs, gs); ctx.translate(-cxm, -cym);
                ctx.globalAlpha = 0.5 * pk;
                ctx.drawImage(sil, 0, 0, W, H);
                ctx.restore();
            }
            // brilho que varre a silhueta da esquerda para a direita
            const tt = t / 1.0;
            if (tt > 0 && tt < 1) {
                const e = tt < 0.5 ? 2 * tt * tt : 1 - Math.pow(-2 * tt + 2, 2) / 2;
                const c = -0.2 * W + 1.4 * W * e;
                const fade = Math.sin(Math.PI * Math.min(1, tt * 1.15));
                tg.clearRect(0, 0, tmp.width, tmp.height);
                tg.globalCompositeOperation = 'source-over';
                tg.drawImage(sil, 0, 0);
                tg.globalCompositeOperation = 'destination-in';
                const gr = tg.createLinearGradient((c - W * 0.18) * dpr, 0, (c + W * 0.18) * dpr, 0);
                gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(0.5, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
                tg.fillStyle = gr; tg.fillRect(0, 0, tmp.width, tmp.height);
                ctx.globalAlpha = 0.55 * fade;
                ctx.drawImage(tmp, 0, 0, W, H);
                ctx.globalAlpha = 1;
            }
            // faíscas
            const cols = ['#ffffff', '#7ffbff'];
            for (const s of sparks) {
                const p = (t - s.dl) / s.life;
                if (p <= 0 || p >= 1) continue;
                const e = 1 - Math.pow(1 - p, 2.2), z = s.sz * (1 - p * 0.7);
                ctx.globalAlpha = 1 - p;
                ctx.fillStyle = cols[s.k];
                ctx.fillRect(s.x + s.dx * e - z / 2, s.y + s.dy * e - z / 2, z, z);
            }
            ctx.globalAlpha = 1;
            return t >= LOCK;
        };
        // o cartão de código também "trava" no mesmo instante
        const punchMon = () => {
            if (!mon || !mon.animate) return;
            mon.animate([
                { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255,107,94,0)' },
                { transform: 'scale(1.045)', boxShadow: '0 0 0 3px rgba(255,107,94,.55), 0 0 40px rgba(255,107,94,.35)', offset: 0.12 },
                { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255,107,94,0)' }
            ], { duration: 900, easing: 'ease-out' });
        };

        // ?pbdebug: expõe o desenho de um instante (para inspeção), sem animar
        if (/pbdebug/.test(location.search)) { window.__photoDraw = draw; window.__photoLock = drawLock; window.__photoTotal = total; return; }
        const t0 = performance.now();
        const frame = (now) => {
            if (draw((now - t0) / 1000)) {
                // construção completa: mostra a foto real e fixa
                img.style.transition = 'none';
                fig.classList.remove('pending');
                punchMon();
                const l0 = performance.now();
                const lockFrame = (n) => {
                    if (drawLock((n - l0) / 1000)) {
                        fig.style.transform = '';
                        finish();
                    } else requestAnimationFrame(lockFrame);
                };
                requestAnimationFrame(lockFrame);
            } else requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
    }

    // com a introdução, espera o terminal "assentar" no monitor; sem ela, começa já
    if (root.classList.contains('has-intro') && !window.__dockedDone) {
        window.addEventListener('build:photo', () => { window.__dockedDone = true; build(); }, { once: true });
    window.addEventListener('intro:docked', () => { window.__dockedDone = true; build(); }, { once: true });
    } else {
        build();
    }
})();
