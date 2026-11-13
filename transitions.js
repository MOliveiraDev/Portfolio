// Introdução (sequência de boot), cortina de transição entre seções e
// efeito de "decodificação" de texto.
(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const curtain = document.getElementById('curtain');
    if (!curtain) return;
    const cols = [...curtain.querySelectorAll('.curtain-cols span')];
    const label = curtain.querySelector('.curtain-label');
    const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';

    // ---- texto que se decodifica -------------------------------------------
    const GLYPHS = '01{}[]<>/$#_=+*';
    window.scrambleText = (el, dur = 800) => {
        if (reduce || !el || el.dataset.scrambling) return;
        el.dataset.scrambling = '1';
        const nodes = [];
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
            const n = walker.currentNode;
            if (n.nodeValue.trim()) nodes.push([n, n.nodeValue]);
        }
        const total = nodes.reduce((sum, [, text]) => sum + text.length, 0);
        const t0 = performance.now();
        const tick = (now) => {
            const p = Math.min(1, (now - t0) / dur);
            let seen = 0;
            for (const [node, text] of nodes) {
                let out = '';
                for (let i = 0; i < text.length; i++, seen++) {
                    const ch = text[i];
                    out += ch === ' ' || seen / total < p ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
                }
                node.nodeValue = out;
            }
            if (p < 1) requestAnimationFrame(tick);
            else delete el.dataset.scrambling;
        };
        requestAnimationFrame(tick);
    };

    // ---- introdução: o terminal bash constrói o site e vira o monitor do hero ----
    const body = curtain.querySelector('.intro-body');
    function runIntro() {
        // o terminal da introdução é o próprio monitor do hero: um único elemento
        const mon = document.querySelector('.code-monitor');
        const slot = mon.parentElement;
        const term = mon.querySelector('.code-content');
        const title = mon.querySelector('.monitor-title');
        const meta = body.querySelector('.intro-meta');
        const pct = body.querySelector('.intro-pct');
        const bar = body.querySelector('.intro-bar i');
        const PS = 'maicon@oliver:~$ ';

        let skipped = false;
        const sleep = (ms) => new Promise((r) => setTimeout(r, skipped ? 0 : ms));
        const D = (ms) => (skipped ? Math.min(ms, 140) : ms);
        const setProgress = (k) => {
            pct.textContent = Math.round(k * 100) + '%';
            bar.style.transform = `scaleX(${k})`;
        };

        // tira o monitor do hero e o coloca no centro da tela de boot
        const vw = window.innerWidth, vh = window.innerHeight;
        const mw = Math.min(720, vw * 0.92);
        const mh = Math.min(370, Math.max(290, vh * 0.42 + 40));
        const place = { left: (vw - mw) / 2, top: Math.max(70, (vh - mh) / 2 - 36), width: mw, height: mh };
        mon.classList.add('flying');
        mon.style.cssText = `left:${place.left}px;top:${place.top}px;width:${place.width}px;height:${place.height}px`;
        term.classList.add('intro-term');
        title.textContent = 'maicon@oliver: ~ — bash';
        body.appendChild(mon);

        // leve flutuação enquanto espera
        const t0 = performance.now();
        let raf = 0, floating = true;
        const float = (now) => {
            if (!floating) return;
            mon.style.transform = `translateY(${Math.sin((now - t0) / 800) * 4}px)`;
            raf = requestAnimationFrame(float);
        };
        raf = requestAnimationFrame(float);

        // o terminal é só da introdução: ao terminar, ele se dissolve e o espaço some
        let gone = false;
        const leave = async () => {
            if (gone) return;
            gone = true;
            const h = slot.offsetHeight;
            mon.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.94)' }],
                { duration: D(450), easing: 'ease-in', fill: 'forwards' });
            const a = slot.animate([{ height: h + 'px' }, { height: '0px' }],
                { duration: D(600), delay: D(180), easing: 'cubic-bezier(0.65, 0, 0.25, 1)', fill: 'forwards' });
            await a.finished.catch(() => {});
            mon.remove();
            slot.remove();
        };
        window.addEventListener('intro:docked', () => { gone = true; mon.remove(); slot.remove(); }, { once: true });

        const addLine = (html) => {
            const line = document.createElement('div');
            line.className = 'intro-line';
            line.innerHTML = html;
            term.appendChild(line);
            return line;
        };
        async function typeCommand(cmd) {
            const line = addLine(`<span class="ps">${PS}</span><span class="cmd"></span><i class="intro-cursor"></i>`);
            const out = line.querySelector('.cmd');
            for (const ch of cmd) {
                out.textContent += ch;
                await sleep(30 + Math.random() * 35);
            }
            await sleep(260);
            line.querySelector('.intro-cursor').remove();
        }

        // contorno "blueprint" que aparece onde uma peça do site vai ser construída
        function blueprint(el, label) {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            if (!r.width || !r.height) return null;
            let lx = 0, ly = 0, n = el;
            while (n) { lx += n.offsetLeft; ly += n.offsetTop; n = n.offsetParent; }
            const animated = el.hasAttribute('data-reveal');
            const bl = animated ? lx - scrollX : r.left, bt = animated ? ly - scrollY : r.top;
            const bw = animated ? el.offsetWidth : r.width, bh = animated ? el.offsetHeight : r.height;
            const bp = document.createElement('div');
            bp.className = 'bp';
            bp.style.cssText = `left:${bl}px;top:${bt}px;width:${bw}px;height:${bh}px`;
            bp.innerHTML = `<span>${label} &middot; ${Math.round(r.width)}&times;${Math.round(r.height)}</span><i class="bp-bar"></i>`;
            curtain.appendChild(bp);
            bp.animate([{ opacity: 0, transform: 'scale(1.1)' }, { opacity: 1, transform: 'none' }],
                { duration: D(260), easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'both' });
            return bp;
        }
        const dismiss = (list) => list.filter(Boolean).forEach((bp) =>
            bp.animate([{ opacity: 1 }, { opacity: 0 }], { duration: D(420), fill: 'forwards' }).finished.then(() => bp.remove(), () => bp.remove()));

        // ---- o site começa vazio: cada peça só aparece quando um agente a constrói ----
        let AG = null;
        const names = ['api', 'ui', 'db', 'infra', 'tests', 'ai'];
        const pieces = ['.hero-giant', '.hero .eyebrow', '.hero-hello', '.hero h1', '.hero h2', '.hero-lead', '.hero-buttons', '.hero-stats'];
        pieces.forEach((s) => document.querySelectorAll(s).forEach((el) => el.classList.add('unbuilt')));
        window.addEventListener('intro:docked', () => document.querySelectorAll('.unbuilt').forEach((el) => el.classList.remove('unbuilt')), { once: true });

        const SCAN = 800;
        // a peça aparece de cima para baixo, na mesma velocidade da barra de construção
        const reveal = (el, from = 'inset(0 0 100% 0)') => {
            if (!el) return;
            el.classList.remove('unbuilt');
            el.animate([{ clipPath: from, opacity: 1 }, { clipPath: 'inset(0 0 0 0)', opacity: 1 }],
                { duration: D(SCAN), easing: 'linear', fill: 'backwards' });
        };
        const rectOf = (sel) => { const el = document.querySelector(sel); return el ? el.getBoundingClientRect() : null; };

        // componentes do hero, na ordem em que os agentes os constroem
        const steps = [
            { agent: 1, name: 'navbar', label: 'navbar', targets: ['.nav-logo', '.nav-menu', '.nav-cta', '.theme-toggle'],
              go: () => root.classList.add('b-nav') },
            { agent: 3, name: 'hero background', label: 'background', targets: ['.hero-giant span'],
              go: () => reveal(document.querySelector('.hero-giant')) },
            { agent: 5, name: 'hero photo', label: 'photo', targets: ['.hero-photo'],
              go: () => window.dispatchEvent(new Event('build:photo')) },
            { agent: 0, name: 'hero text', label: 'text', targets: ['.hero .eyebrow', '.hero-hello', '.hero h1', '.hero h2', '.hero-lead'],
              go: () => {
                  ['.hero .eyebrow', '.hero-hello', '.hero h1', '.hero h2', '.hero-lead'].forEach((s) => reveal(document.querySelector(s)));
                  window.__introDone = true;
                  window.dispatchEvent(new Event('intro:reveal'));
                  window.scrambleText(document.querySelector('.hero h1'), 1100);
              } },
            { agent: 2, name: 'hero buttons', label: 'buttons', targets: ['.hero-buttons'], go: () => reveal(document.querySelector('.hero-buttons')) },
            { agent: 4, name: 'hero stats', label: 'stats', targets: ['.hero-stats'], go: () => reveal(document.querySelector('.hero-stats')) },
            { agent: 3, name: 'grid + effects', label: 'effects', targets: [], go: () => root.classList.add('b-fx') }
        ];

        // 1) boot no centro: o bash invoca os agentes, em grupos de quatro
        async function boot() {
            await sleep(450);
            AG = window.__agents || null;
            await typeCommand('./summon-agents.sh');
            const n = AG ? AG.count : 6;
            setProgress(0.04);
            for (let g = 0; g < n; g += 4) {
                const idx = [0, 1, 2, 3].map((k) => g + k).filter((k) => k < n);
                addLine(`<b class="tag-ok">[ ok ]</b> ${idx.map((i) => `<b style="color:${AG ? AG.colors[i] : '#fff'}">&laquo;${AG ? AG.names[i] : names[i]}&raquo;</b>`).join(' ')} online`);
                for (const i of idx) {
                    if (AG) AG.spawn(i);
                    await sleep(190);
                    setProgress(0.04 + ((i + 1) / n) * 0.96);
                }
            }
            addLine(`<b class="tag-run">[ &gt;&gt; ]</b> ${n} agents ready &middot; starting build`);
            await sleep(650);
        }

        // 2) o mesmo terminal voa até o seu lugar no hero; a cortina sobe
        async function flyHome() {
            floating = false;
            cancelAnimationFrame(raf);
            mon.style.transform = '';
            const tr = slot.getBoundingClientRect();
            const EZ = 'cubic-bezier(0.65, 0, 0.25, 1)', T = D(1100);

            meta.animate([{ opacity: 1 }, { opacity: 0 }], { duration: D(300), fill: 'forwards' });
            const wipes = cols.map((c, i) => c.animate(
                [{ transform: 'translateY(0)' }, { transform: 'translateY(-101%)' }],
                { duration: D(800), delay: D(i * 60), easing: EZ, fill: 'forwards' }));
            const fly = mon.animate([
                { left: place.left + 'px', top: place.top + 'px', width: place.width + 'px', height: place.height + 'px' },
                { left: tr.left + 'px', top: tr.top + 'px', width: tr.width + 'px', height: tr.height + 'px' }
            ], { duration: T, easing: EZ, fill: 'forwards' });
            await fly.finished;
            return { wipes };
        }

        // 3) com o site vazio, os agentes constroem componente por componente
        async function buildSite() {
            term.innerHTML = '';
            title.innerHTML = 'maicon@oliver: ~/portfolio &mdash; bash';
            const n = AG ? AG.count : 6;
            addLine('<span class="dim">$ ./build-site.sh --agents=' + n + '</span>');
            await sleep(240);
            const tails = [];
            for (const st of steps) {
                const lead = st.agent % n, crew = [lead, (lead + 5) % n, (lead + 11) % n];
                const who = AG ? AG.names[lead] : names[st.agent];
                const line = addLine(`<b class="tag-run">[ .. ]</b> ${who} &rsaquo; ${st.name}`);
                const els = st.targets.map((s) => document.querySelector(s)).filter(Boolean);
                const bps = els.map((el, i) => blueprint(el, i === 0 ? `${who} › ${st.label}` : st.label));
                const rs = els.map((el) => el.getBoundingClientRect());
                const L = Math.min(...rs.map((r) => r.left)), T = Math.min(...rs.map((r) => r.top));
                const R = Math.max(...rs.map((r) => r.right)), B = Math.max(...rs.map((r) => r.bottom));
                if (AG && els.length) {
                    // a equipe cerca o componente; o líder desenha de um canto ao outro
                    AG.assign(crew[1], R - 6, T + 6, D(700));
                    AG.assign(crew[2], L + 6, B - 6, D(700));
                    await AG.assign(lead, L + 6, T + 6, D(700));
                    await AG.assign(lead, R - 6, B - 6, D(520));
                }
                await sleep(120);
                st.go();   // a peça começa a aparecer junto com a barra
                line.innerHTML = `<b class="tag-ok">[ ok ]</b> ${who} &rsaquo; ${st.name}`;
                bps.forEach((bp) => bp && bp.querySelector('.bp-bar').animate([{ top: '0%' }, { top: '100%' }],
                    { duration: D(SCAN), easing: 'linear', fill: 'forwards' }));
                // os cursores descem junto com a barra, até o fim da construção
                tails.push((async () => {
                    if (AG && els.length) {
                        const ms = D(SCAN), xm = (L + R) / 2;
                        await Promise.all([
                            AG.sweep(lead, R - 6, T, R - 6, B, ms),
                            AG.sweep(crew[1], L + 6, T, L + 6, B, ms),
                            AG.sweep(crew[2], xm, T, xm, B, ms)
                        ]);
                        crew.forEach((c) => AG.release(c));
                    } else await sleep(SCAN);
                    dismiss(bps);
                })());
                await sleep(200);
            }
            await Promise.all(tails);
            addLine('<b class="tag-run">[ &gt;&gt; ]</b> sections build on scroll');
            await sleep(700);
        }

        // 4) o terminal já está em casa: só volta a ser o monitor do hero
        async function dock(wipes) {
            addLine('<b class="tag-ok">[ ok ]</b> all agents idle &middot; terminal closed');
            await sleep(700);
            await leave();
            window.__introDone = true;
            window.dispatchEvent(new Event('intro:docked'));
            root.classList.remove('has-intro');
            wipes.forEach((a) => a.cancel());
            body.remove();
        }

        const skipEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
        const onSkip = () => { skipped = true; };
        skipEvents.forEach((ev) => window.addEventListener(ev, onSkip, { passive: true }));

        (async () => {
            await boot();
            const { wipes } = await flyHome();
            await buildSite();
            await dock(wipes);
            skipEvents.forEach((ev) => window.removeEventListener(ev, onSkip));
        })();
    }

    if (root.classList.contains('has-intro')) {
        if (!location.hash) {
            try { history.scrollRestoration = 'manual'; } catch (e) {}
            window.scrollTo(0, 0);
        }
        runIntro();
    } else {
        if (body) body.remove();
        document.querySelector('.monitor-slot')?.remove();
    }

    // ---- cortina entre seções (cliques no menu e nos botões) -------------------
    const order = ['home', 'about', 'skills', 'experience', 'projects', 'contact'];
    let busy = false;
    // destino da rolagem: o título da seção nunca fica sob a barra fixa
    const topOf = (target) => {
        if (target.id === 'home') return 0;
        const nav = document.querySelector('.navbar');
        const pad = parseFloat(getComputedStyle(target).paddingTop) || 0;
        const under = Math.max(0, (nav ? nav.offsetHeight : 0) + 16 - pad);
        return target.getBoundingClientRect().top + window.scrollY - under;
    };
    window.pageWipe = (target) => {
        if (reduce || root.classList.contains('has-intro')) { window.scrollTo(0, topOf(target)); return; }
        if (busy) return;
        busy = true;
        window.__wiping = true;   // os componentes só são construídos depois que a cortina abre
        const idx = order.indexOf(target.id);
        label.innerHTML = '';
        if (idx >= 0) {
            const num = document.createElement('span');
            num.textContent = String(idx + 1).padStart(2, '0');
            const PTN = { home: 'início', about: 'sobre', skills: 'habilidades', experience: 'experiência', projects: 'projetos', contact: 'contato' };
            label.append(num, window.i18n && window.i18n.lang === 'pt' ? PTN[target.id] || target.id : target.id);
        }
        curtain.classList.add('is-active');
        const anims = cols.map((c, i) => c.animate(
            [{ transform: 'translateY(101%)' }, { transform: 'translateY(0)' }],
            { duration: 420, delay: i * 45, easing: EASE, fill: 'forwards' }
        ));
        anims.push(label.animate(
            [{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'none' }],
            { duration: 340, delay: 240, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'forwards' }
        ));
        anims[cols.length - 1].finished.then(() => {
            if (window.__resetReveal) window.__resetReveal(target);
            window.scrollTo({ top: topOf(target), behavior: 'instant' });
            setTimeout(() => {
                anims.push(label.animate(
                    [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-40px)' }],
                    { duration: 220, easing: 'ease-in', fill: 'forwards' }
                ));
                const out = cols.map((c, i) => c.animate(
                    [{ transform: 'translateY(0)' }, { transform: 'translateY(-101%)' }],
                    { duration: 560, delay: 80 + i * 45, easing: EASE, fill: 'forwards' }
                ));
                setTimeout(() => { window.__wiping = false; window.dispatchEvent(new Event('wipe:end')); }, 260);
                out[out.length - 1].finished.then(() => {
                    curtain.classList.remove('is-active');
                    [...anims, ...out].forEach((a) => a.cancel());
                    busy = false;
                });
            }, 280);
        });
    };
})();
