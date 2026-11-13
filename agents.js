// Cursores de "agentes" que constroem e exploram a página, HUD, tour, replay,
// filtros de projetos e microinterações do mouse.
(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    // ---- números do hero (contados a partir do próprio conteúdo da página) ----
    const counters = $$('[data-count]');
    counters.forEach((el) => { el.dataset.n = document.querySelectorAll(el.dataset.count).length; });
    let counted = false;
    const countUp = () => {
        if (counted) return;
        counted = true;
        counters.forEach((el, i) => {
            const n = +el.dataset.n;
            if (reduce) { el.textContent = n; return; }
            const t0 = performance.now() + i * 160;
            const tick = (now) => {
                const k = Math.max(0, Math.min(1, (now - t0) / 1100));
                el.textContent = Math.round(n * ease(k));
                if (k < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
    };
    if (root.classList.contains('has-intro') && !window.__introDone) window.addEventListener('intro:docked', () => setTimeout(countUp, 900), { once: true });
    else setTimeout(countUp, 400);

    // ---- filtros de projetos ----
    const filters = $$('.proj-filters button');
    const cards = $$('.project-card');
    filters.forEach((btn) => btn.addEventListener('click', () => {
        filters.forEach((b) => b.classList.toggle('is-on', b === btn));
        const f = btn.dataset.filter;
        let i = 0;
        cards.forEach((card) => {
            const ok = f === 'all' || (card.dataset.cat || '').split(' ').includes(f);
            card.classList.toggle('is-hidden', !ok);
            if (ok && !reduce) {
                card.animate([{ opacity: 0, transform: 'translateY(18px) scale(0.97)' }, { opacity: 1, transform: 'none' }],
                    { duration: 460, delay: i++ * 70, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', fill: 'backwards' });
            }
        });
    }));

    // ---- brilho que segue o mouse nos cartões e botões "magnéticos" ----
    if (!coarse) {
        $$('.topic-item, .project-card, .contact-item').forEach((el) => {
            el.addEventListener('pointermove', (e) => {
                const r = el.getBoundingClientRect();
                el.style.setProperty('--sx', e.clientX - r.left + 'px');
                el.style.setProperty('--sy', e.clientY - r.top + 'px');
            });
        });
        $$('.btn, .nav-cta, .head-link').forEach((el) => {
            el.addEventListener('pointermove', (e) => {
                const r = el.getBoundingClientRect();
                el.style.setProperty('--mx', (e.clientX - (r.left + r.width / 2)) * 0.18 + 'px');
                el.style.setProperty('--my', (e.clientY - (r.top + r.height / 2)) * 0.28 + 'px');
            });
            el.addEventListener('pointerleave', () => { el.style.setProperty('--mx', '0px'); el.style.setProperty('--my', '0px'); });
        });
    }

    // ---- replay: refaz a construção da página ----
    const replay = () => {
        try { history.scrollRestoration = 'manual'; } catch (e) {}
        window.scrollTo(0, 0);
        location.href = location.pathname + '?replay=' + Date.now();
    };
    $('#replay-card')?.addEventListener('click', replay);

    if (reduce) return;

    // ---- agentes ----
    const ALL = [
        { c: '#6ee7ff', n: 'api' }, { c: '#ff9ecb', n: 'ui' }, { c: '#9dffb0', n: 'db' }, { c: '#ffe27a', n: 'infra' },
        { c: '#b9a6ff', n: 'tests' }, { c: '#ffffff', n: 'ai' }, { c: '#ffb86b', n: 'auth' }, { c: '#7fffd4', n: 'cache' },
        { c: '#ff8f8f', n: 'queue' }, { c: '#8fb8ff', n: 'ci' }, { c: '#e6a8ff', n: 'docs' }, { c: '#c8ff6b', n: 'seo' },
        { c: '#6bffea', n: 'a11y' }, { c: '#ffd36b', n: 'perf' }, { c: '#ff9ad8', n: 'logs' }, { c: '#a8b8ff', n: 'deploy' }
    ];
    const AGENTS = ALL.slice(0, coarse || window.innerWidth < 700 ? 8 : 16);

    const layer = document.createElement('div');
    layer.id = 'agents';
    layer.setAttribute('aria-hidden', 'true');
    const arrow = (c) => `<svg viewBox="0 0 18 18"><path d="M2 1.5 L15.5 7.6 L9.4 9.6 L7.4 16 Z" fill="${c}" stroke="#0b0b0c" stroke-width="1" stroke-linejoin="round"/></svg>`;
    const mouse = { x: -999, y: -999, moved: 0 };
    const list = AGENTS.map((a, i) => {
        const el = document.createElement('div');
        el.className = 'agent' + (i % 3 === 0 ? ' label' : '');
        el.style.setProperty('--c', a.c);
        el.innerHTML = `<span class="click"></span>${arrow(a.c)}<span class="tag">${a.n}</span>`;
        layer.appendChild(el);
        const side = i % 4;
        const W = window.innerWidth, H = window.innerHeight;
        const start = [[-40, Math.random() * H], [W + 40, Math.random() * H], [Math.random() * W, -40], [Math.random() * W, H + 40]][side];
        el.style.transform = `translate3d(${start[0]}px, ${start[1]}px, 0)`;
        return { el, c: a.c, n: a.n, x: start[0], y: start[1], vx: 0, vy: 0, tx: W / 2, ty: H / 2, next: 0, target: null, i, live: false, manual: false, parade: false, exiting: false, rot: 0, svg: el.querySelector('svg') };
    });
    document.body.appendChild(layer);

    const SELECTORS = '.btn, .proj-filters button, .head-link, .project-links a, .section-title, .project-card, .skill-card, .contact-item, .topic-item, .replay-card, .nav-link, .experience-card, .hero-stats li';
    const pickTarget = (ag) => {
        const W = window.innerWidth, H = window.innerHeight;
        if (Math.random() < 0.62 && !root.classList.contains('has-intro')) {
            const vis = $$(SELECTORS).filter((el) => {
                const r = el.getBoundingClientRect();
                return r.width > 20 && r.bottom > 80 && r.top < H - 40 && r.right > 0 && r.left < W;
            });
            if (vis.length) {
                const el = vis[(Math.random() * vis.length) | 0];
                const r = el.getBoundingClientRect();
                ag.target = el;
                ag.tx = r.left + r.width * (0.2 + Math.random() * 0.6);
                ag.ty = r.top + Math.min(r.height, 120) * (0.3 + Math.random() * 0.5);
                return;
            }
        }
        ag.target = null;
        ag.tx = 40 + Math.random() * (W - 80);
        ag.ty = 90 + Math.random() * (H - 180);
    };

    // ---- interações: o agente passa o cursor, "clica" e o componente reage (sem navegar) ----
    const pulse = (ag) => { ag.el.classList.remove('pulse'); void ag.el.offsetWidth; ag.el.classList.add('pulse'); };
    const BTN = '.btn, .nav-cta, .head-link, .proj-filters button, .project-links a';
    let lastInteract = 0;
    const aim = (el, x, y) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--sx', x - r.left + 'px');
        el.style.setProperty('--sy', y - r.top + 'px');
        if (el.matches(BTN)) {
            el.style.setProperty('--mx', (x - (r.left + r.width / 2)) * 0.18 + 'px');
            el.style.setProperty('--my', (y - (r.top + r.height / 2)) * 0.28 + 'px');
        }
    };
    const interact = (ag) => {
        const el = ag.target;
        const now = performance.now();
        // raro: só às vezes, e no máximo uma interação a cada ~6 s em toda a página
        if (!el || el.hasAttribute('data-reveal') || el.classList.contains('unbuilt') || ag.busy
            || now - lastInteract < 6000 || Math.random() > 0.25) return;
        lastInteract = now;
        ag.busy = true;
        el.classList.add('ag-hover');
        ag.hover = el;
        aim(el, ag.x, ag.y);
        setTimeout(() => {
            pulse(ag);                                  // o "clique"
            el.animate([{ scale: 1 }, { scale: 0.96 }, { scale: 1 }], { duration: 300, easing: 'ease-out' });
            const rip = document.createElement('span');
            rip.className = 'ag-ripple';
            rip.style.cssText = `left:${ag.x}px;top:${ag.y}px;--c:${ag.c}`;
            document.body.appendChild(rip);
            setTimeout(() => rip.remove(), 700);
            // links e botões só reagem visualmente: nenhum clique chega ao href
        }, 520);
        setTimeout(() => {
            el.classList.remove('ag-hover');
            if (el.matches(BTN)) { el.style.setProperty('--mx', '0px'); el.style.setProperty('--my', '0px'); }
            ag.hover = null; ag.busy = false;
        }, 1500);
    };

    // ---- fila indiana: quando o site termina de ser construído, os agentes se juntam e rondam o contato ----
    let paradeOn = false, paradeDone = false, pT = 0;
    const contactEl = document.getElementById('contact');
    const paradePoint = (u) => {
        const r = contactEl.getBoundingClientRect();
        const cx = r.left + scrollX + r.width / 2, cy = r.top + scrollY + r.height / 2;
        const A = Math.min(r.width * 0.42, 640), B = Math.min(r.height * 0.3, 200);
        return [cx + A * Math.sin(u), cy + B * Math.sin(2 * u)];   // trajeto em "8" sobre a seção
    };
    const startParade = () => {
        if (paradeOn || !contactEl) return;
        paradeOn = true;
        list.forEach((ag) => { if (ag.live) { ag.parade = true; ag.manual = true; } });
        setTimeout(endParade, 20000);   // depois de 20 s a fila se desfaz
    };
    // cada agente sai da tela por um caminho diferente e é desligado (libera CPU e memória)
    const exitAgent = (ag) => {
        ag.parade = false; ag.manual = true; ag.exiting = true;
        ag.exA = (ag.i / list.length) * Math.PI * 2 + Math.random() * 0.5;
        ag.exW = 60 + Math.random() * 120;
        ag.exT0 = performance.now();
    };
    function endParade() {
        paradeOn = false; paradeDone = true;
        list.forEach((ag) => { if (ag.live && ag.parade) exitAgent(ag); });
    }
    const deactivate = (ag) => {
        ag.live = false; ag.exiting = false; ag.manual = false; ag.parade = false;
        ag.vx = ag.vy = 0; ag.el.classList.remove('on');
    };
    // a fila começa quando a seção de contato (a última) termina de ser construída
    setInterval(() => {
        if (paradeOn || paradeDone || !window.__introDone || window.__wiping) return;
        if (!root.classList.contains('fx')) return;
        if (document.querySelector('#contact [data-reveal], #bp-doc .bp')) return;   // contato construído e nenhum agente ocupado
        startParade();
    }, 1000);

    let running = false, last = 0;
    const loop = (now) => {
        const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
        last = now;
        const W = window.innerWidth, H = window.innerHeight;
        const following = now - mouse.moved < 1600;
        if (paradeOn) pT += dt * 0.42;
        for (const ag of list) {
            if (!ag.live) continue;
            if (ag.manual) {
                /* ordem do bash: segue o alvo definido por assign() */
                if (ag.parade) {
                    const [px, py] = paradePoint(pT - ag.i * 0.1);
                    ag.tx = px; ag.ty = py;
                } else if (ag.exiting) {
                    const R = Math.max(W, H) * 0.95, c = Math.cos(ag.exA), sn = Math.sin(ag.exA);
                    const wob = Math.sin((now - ag.exT0) / 260) * ag.exW;
                    ag.tx = W / 2 + c * R - sn * wob;
                    ag.ty = H / 2 + sn * R + c * wob + window.scrollY;
                }
            } else if (following && ag.i < 2) {
                ag.tx = mouse.x + (ag.i === 0 ? 46 : -34);
                ag.ty = mouse.y + (ag.i === 0 ? 38 : 58);
            } else if (now > ag.next) {
                pickTarget(ag);
                ag.next = now + 1500 + Math.random() * 2600;
                ag.arrived = false;
            }
            // mola amortecida até o alvo (alvos manuais vivem em coordenadas da página e acompanham a rolagem)
            const k = ag.exiting ? 9 : ag.manual ? 80 : 38, d = ag.exiting ? 4.5 : ag.manual ? 13 : 9;
            const goalY = ag.manual ? ag.ty - window.scrollY : ag.ty;
            ag.vx += ((ag.tx - ag.x) * k - ag.vx * d) * dt;
            ag.vy += ((goalY - ag.y) * k - ag.vy * d) * dt;
            // o mouse real afasta os agentes que passam perto
            const mx = ag.x - mouse.x, my = ag.y - mouse.y, md = Math.hypot(mx, my);
            if (!ag.manual && !(following && ag.i < 2) && md < 110 && md > 0) {
                const f = (110 - md) / 110;
                ag.vx += (mx / md) * f * 1700 * dt;
                ag.vy += (my / md) * f * 1700 * dt;
            }
            ag.x += ag.vx * dt;
            ag.y += ag.vy * dt;
            if (!ag.manual && !ag.arrived && Math.hypot(ag.tx - ag.x, ag.ty - ag.y) < 14) {
                ag.arrived = true;
                if (ag.target) interact(ag);
            }
            if (ag.hover) aim(ag.hover, ag.x, ag.y);
            ag.el.style.transform = `translate3d(${ag.x.toFixed(1)}px, ${ag.y.toFixed(1)}px, 0)`;
            // na fila, a seta aponta para onde o agente anda
            if (ag.exiting && (ag.x < -60 || ag.x > W + 60 || ag.y < -60 || ag.y > H + 60)) { deactivate(ag); continue; }
            if (ag.parade || ag.exiting) {
                if (Math.hypot(ag.vx, ag.vy) > 25) {
                    const tgt = Math.atan2(ag.vy, ag.vx) * 180 / Math.PI + 135;
                    ag.rot += ((((tgt - ag.rot) % 360) + 540) % 360 - 180) * 0.18;
                    ag.svg.style.transform = `rotate(${ag.rot.toFixed(1)}deg)`;
                }
            } else if (ag.rot) {
                ag.rot *= 0.8; if (Math.abs(ag.rot) < 1) ag.rot = 0;
                ag.svg.style.transform = ag.rot ? `rotate(${ag.rot.toFixed(1)}deg)` : '';
            }
        }
        if (running && list.some((a) => a.live)) requestAnimationFrame(loop); else running = false;
    };
    const start = () => {
        if (running) return;
        running = true;
        last = performance.now();
        requestAnimationFrame(loop);
    };
    const spawn = (i) => {
        const ag = list[i];
        if (!ag || ag.live) return;
        ag.live = true;
        ag.next = 0;
        ag.el.classList.add('on');
        start();
        window.dispatchEvent(new Event('agents:live'));
        const W = innerWidth, H = innerHeight;
        ag.tx = W * (0.15 + Math.random() * 0.7);
        ag.ty = H * (0.2 + Math.random() * 0.6);
    };
    // ordem direta: leva o agente a um ponto (x,y em coordenadas da tela) e avisa quando chega
    const vy = (ag) => ag.ty - window.scrollY;
    const assign = (i, x, y, cap = 900) => new Promise((res) => {
        const ag = list[i % list.length];
        if (!ag.live) spawn(ag.i);
        ag.manual = true; ag.parade = false; ag.exiting = false; ag.tx = x; ag.ty = y + window.scrollY;
        const t0 = performance.now();
        const poll = () => {
            if (Math.hypot(ag.tx - ag.x, vy(ag) - ag.y) < 16 || performance.now() - t0 > cap) {
                ag.el.classList.remove('pulse'); void ag.el.offsetWidth; ag.el.classList.add('pulse');
                res(ag);
            } else requestAnimationFrame(poll);
        };
        requestAnimationFrame(poll);
    });
    // desliza o cursor em linha reta durante `ms` (em sincronia com a barra de construção)
    const sweep = (i, x0, y0, x1, y1, ms) => new Promise((res) => {
        const ag = list[i % list.length];
        if (!ag.live) spawn(ag.i);
        ag.manual = true; ag.parade = false; ag.exiting = false;
        const sy = window.scrollY, t0 = performance.now();
        const f = (now) => {
            const k = Math.min(1, (now - t0) / ms);
            ag.tx = x0 + (x1 - x0) * k; ag.ty = y0 + (y1 - y0) * k + sy;
            if (k < 1) requestAnimationFrame(f); else res();
        };
        requestAnimationFrame(f);
    });
    const release = (i) => { const ag = list[i % list.length]; if (paradeOn) { ag.parade = true; ag.manual = true; } else if (paradeDone) exitAgent(ag); else { ag.manual = false; ag.next = 0; } };
    // camada de contornos presa à página (rola junto com o conteúdo)
    const docLayer = document.createElement('div');
    docLayer.id = 'bp-doc';
    document.body.appendChild(docLayer);
    let rr = 0;
    const bpLabel = (el) => el.matches('.section-title') ? 'heading' : el.matches('.project-card') ? 'project' : el.matches('.skill-card') ? 'chip'
        : el.matches('.topic-item') ? 'card' : el.matches('.contact-item') ? 'link' : el.matches('.experience-card') ? 'timeline'
        : el.matches('.marquee') ? 'marquee' : el.matches('.quote-card') ? 'quote' : 'block';
    // um agente vai até o componente; a barra desce e o cursor desce junto, enquanto ele é construído
    const SCAN = 900;
    const build = (el) => new Promise((res) => {
        const r = el.getBoundingClientRect();
        if (r.width < 10 || r.bottom < 0 || r.top > innerHeight) return res();
        // posição real (de layout) do componente, sem a inclinação/escala da animação de entrada
        let lx = 0, ly = 0, n = el;
        while (n) { lx += n.offsetLeft; ly += n.offsetTop; n = n.offsetParent; }
        const animated = el.hasAttribute('data-reveal');
        const L = animated ? lx - scrollX : r.left, T = animated ? ly - scrollY : r.top;
        const W = animated ? el.offsetWidth : r.width, H = animated ? el.offsetHeight : r.height;
        const i = rr++ % list.length;
        const bp = document.createElement('div');
        bp.className = 'bp bp-doc';
        bp.style.cssText = `left:${L + scrollX}px;top:${T + scrollY}px;width:${W}px;height:${H}px`;
        bp.innerHTML = `<span>${list[i].n} &rsaquo; ${bpLabel(el)} &middot; ${Math.round(W)}&times;${Math.round(H)}</span><i class="bp-bar"></i>`;
        docLayer.appendChild(bp);
        bp.animate([{ opacity: 0, transform: 'scale(1.05)' }, { opacity: 1, transform: 'none' }], { duration: 220, fill: 'both' });
        assign(i, L + W - 4, T + 4, 600).then(() => {
            res();   // o componente começa a ser construído junto com a barra
            const bar = bp.querySelector('.bp-bar');
            bar.animate([{ top: '0%' }, { top: '100%' }], { duration: SCAN, easing: 'linear', fill: 'forwards' });
            sweep(i, L + W - 4, T + 4, L + W - 4, T + H - 4, SCAN).then(() => {
                release(i);
                bp.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 320, fill: 'forwards' }).finished.then(() => bp.remove(), () => bp.remove());
            });
        });
    });
    window.__agentPts = () => list.filter((a) => a.live).map((a) => ({ x: a.x + 3, y: a.y + 3 }));
    window.__agents = { spawn, assign, sweep, release, count: list.length, names: list.map((a) => a.n), colors: list.map((a) => a.c), build, SCAN };
    start();

    if (!coarse) window.addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.moved = performance.now(); }, { passive: true });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) running = false;
        else if (!running) start();
    });
    // sem introdução, todos os agentes entram sozinhos
    if (!root.classList.contains('has-intro')) list.forEach((ag, i) => setTimeout(() => spawn(i), 150 * i));

    // ---- HUD: agentes, seção atual, tour e replay ----
    const sections = ['home', 'about', 'skills', 'experience', 'projects', 'contact'].map((id) => document.getElementById(id)).filter(Boolean);
    const hud = document.createElement('div');
    hud.className = 'hud';
    hud.innerHTML = `<span class="hud-dots">${AGENTS.slice(0, 7).map((a) => `<i style="--c:${a.c}"></i>`).join('')}</span>
        <span>${AGENTS.length} agents</span><span class="muted"><b class="hud-sec">1</b> / ${sections.length} layers</span>
        <span class="hud-bar"><i></i></span>
        <button class="tour" type="button">Tour</button>
        <button class="rep" type="button" aria-label="Replay"><i class="fas fa-rotate-right"></i></button>`;
    document.body.appendChild(hud);
    const secEl = $('.hud-sec', hud), barEl = $('.hud-bar i', hud);
    const upd = () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        barEl.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
        let idx = 0;
        sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= innerHeight * 0.45) idx = i; });
        secEl.textContent = idx + 1;
    };
    window.addEventListener('scroll', upd, { passive: true });
    upd();

    // Tour: vai de seção em seção e, dentro de cada uma, rola aos poucos até o fim,
    // para que todos os componentes (inclusive os abaixo da dobra) sejam construídos.
    let tour = 0, stepIdx = 0;
    const tourBtn = $('.tour', hud);
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const stopTour = () => { tour = 0; tourBtn.classList.remove('is-on'); tourBtn.textContent = 'Tour'; };
    const runTour = async (id) => {
        while (tour === id) {
            stepIdx = (stepIdx + 1) % sections.length;
            const t = sections[stepIdx];
            if (window.pageWipe) {
                while (window.__wiping || document.querySelector('#curtain.is-active')) await wait(120);
                window.pageWipe(t);
                await wait(300);
                while (tour === id && (window.__wiping || document.querySelector('#curtain.is-active'))) await wait(120);
            } else t.scrollIntoView({ behavior: 'smooth' });
            await wait(2600);                        // dá tempo de construir o que está na tela
            let guard = 8;
            while (tour === id && guard-- > 0 && t.getBoundingClientRect().bottom > innerHeight + 40) {
                window.scrollBy({ top: Math.round(innerHeight * 0.7), behavior: 'smooth' });
                await wait(2600);
            }
            // rede de segurança: o que ainda não foi construído nesta seção entra agora
            t.querySelectorAll('[data-reveal]').forEach((el) => {
                el.classList.add('is-in', 'in-view');
                setTimeout(() => { el.removeAttribute('data-reveal'); el.classList.remove('is-in'); }, 1200);
            });
            await wait(900);
        }
    };
    tourBtn.addEventListener('click', () => {
        if (tour) return stopTour();
        stepIdx = Math.max(0, sections.findIndex((s) => s.getBoundingClientRect().bottom > innerHeight * 0.5)) - 1;
        tourBtn.classList.add('is-on'); tourBtn.textContent = 'On tour';
        tour = Date.now();
        runTour(tour);
    });
    ['wheel', 'touchstart', 'keydown'].forEach((ev) => window.addEventListener(ev, () => { if (tour) stopTour(); }, { passive: true }));
    $('.rep', hud).addEventListener('click', replay);
})();
