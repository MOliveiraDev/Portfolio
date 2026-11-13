// Marca no menu a seção que está na tela (segmento branco quando o menu está recolhido).
(() => {
    const links = [...document.querySelectorAll('.nav-menu .nav-link')];
    const map = new Map();
    links.forEach((a) => {
        const sec = document.querySelector(a.getAttribute('href'));
        if (sec) map.set(sec, a);
    });
    const set = (a) => links.forEach((l) => {
        l.classList.toggle('is-active', l === a);
        if (l === a) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
    });
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) set(map.get(e.target)); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, sec) => io.observe(sec));
    set(links[0]);
})();
