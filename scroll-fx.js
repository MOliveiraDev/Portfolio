// Animações ao rolar: cada seção revela seus elementos ao entrar na tela.
// O atributo data-reveal é removido ao terminar, devolvendo o controle do
// transform ao :hover dos cards.
(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    document.documentElement.classList.add('fx');

    // [seletor, variante, atraso entre irmãos em ms]
    const groups = [
        ['.eyebrow:not(.hero .eyebrow)', 'up', 0],
        ['.section-title', 'title', 0],
        ['.head-link', 'up', 0],
        ['.topic-item', 'up', 110],
        ['.marquee', 'up', 0],
        ['.experience-card', 'up', 120],
        ['.proj-filters', 'up', 0],
        ['.project-card', 'pop', 90],
        ['.contact-description', 'up', 0],
        ['.contact-buttons', 'up', 0],
        ['.contact-item', 'alt', 80],
        ['.replay-card', 'pop', 0],
        ['.footer-content', 'up', 0]
    ];

    const steps = new WeakMap();
    const variants = new WeakMap();
    const io = new IntersectionObserver((entries) => {
        // durante a cortina de transição nada é construído: quem estiver na tela espera ela abrir
        if (window.__wiping) return;
        const shown = entries.filter((e) => e.isIntersecting);
        shown.forEach((e, i) => {
            const el = e.target;
            io.unobserve(el);
            el._b = true;
            const tok = el._t = (el._t || 0) + 1;
            const delay = Math.min(i * steps.get(el), 480);
            const run = () => {
                el.style.setProperty('--d', delay + 'ms');
                el.classList.add('is-in', 'in-view');
                if (el.getAttribute('data-reveal') === 'title' && window.scrambleText) window.scrambleText(el, 900);
                setTimeout(() => {
                    if (el._t !== tok) return;   // foi reiniciado por uma navegação
                    el.removeAttribute('data-reveal');
                    el.classList.remove('is-in');
                    el.style.removeProperty('--d');
                }, delay + 1100);
            };
            // um agente de IA desenha o contorno do componente e só então ele é construído
            if (window.__agents && i < 6 && !el.matches('.footer-content, .proj-filters, .head-link')) window.__agents.build(el).then(run);
            else run();
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    const targets = [];
    for (const [sel, variant, step] of groups) {
        document.querySelectorAll(sel).forEach((el, i) => {
            const v = variant === 'alt'
                ? ([...el.parentElement.children].indexOf(el) % 2 ? 'right' : 'left')
                : variant;
            el.setAttribute('data-reveal', v);
            steps.set(el, step);
            variants.set(el, v);
            targets.push(el);
        });
    }
    // ao navegar por uma aba, a seção de destino é "desconstruída" e os agentes a constroem de novo
    // seção "visitada" = o usuário ficou nela de verdade; só as ainda não visitadas são reconstruídas ao clicar na aba
    const visited = new Set();
    const secs = ['home', 'about', 'skills', 'experience', 'projects', 'contact'].map((id) => document.getElementById(id)).filter(Boolean);
    let curSec = null, dwell = 0;
    const checkCurrent = () => {
        let cur = secs[0];
        secs.forEach((sc) => { if (sc.getBoundingClientRect().top <= innerHeight * 0.45) cur = sc; });
        if (cur !== curSec) {
            curSec = cur; clearTimeout(dwell);
            dwell = setTimeout(() => { if (!window.__wiping && curSec === cur) visited.add(cur.id); }, 1200);
        }
    };
    window.addEventListener('scroll', checkCurrent, { passive: true });
    window.addEventListener('wipe:end', () => { checkCurrent(); });
    window.__resetReveal = (section) => {
        if (visited.has(section.id)) return;     // já foi vista: não constrói de novo
        visited.add(section.id);
        targets.forEach((el) => {
            if (!section.contains(el)) return;
            el._t = (el._t || 0) + 1;
            el._b = false;
            io.unobserve(el);
            el.classList.remove('is-in', 'in-view');
            el.style.removeProperty('--d');
            el.setAttribute('data-reveal', variants.get(el));
        });
    };
    // com introdução, as revelações só começam quando a cortina abre
    const begin = () => targets.forEach((el) => io.observe(el));
    window.addEventListener('wipe:end', () => targets.forEach((el) => {
        if (el.hasAttribute('data-reveal') && !el.classList.contains('is-in') && !el._b) { io.unobserve(el); io.observe(el); }
    }));
    if (document.documentElement.classList.contains('has-intro') && !window.__introDone) {
        window.addEventListener('intro:reveal', begin, { once: true });
    } else begin();

    // Barra de progresso de leitura
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.appendChild(bar);
    let queued = false;
    const update = () => {
        queued = false;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    window.addEventListener('scroll', () => {
        if (!queued) { queued = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
})();
