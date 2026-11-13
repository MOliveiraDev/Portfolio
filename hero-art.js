// Fundo animado do hero: os ícones se desenham quando o agente constrói o fundo e seguem o mouse com profundidade.
(() => {
    const art = document.querySelector('.hero-art');
    if (!art) return;
    const start = () => art.classList.add('draw');
    if (art.classList.contains('unbuilt')) {
        const mo = new MutationObserver(() => { if (!art.classList.contains('unbuilt')) { mo.disconnect(); start(); } });
        mo.observe(art, { attributes: true, attributeFilter: ['class'] });
    } else start();
    if (window.matchMedia('(pointer: coarse)').matches) return;
    window.addEventListener('pointermove', (e) => {
        art.style.setProperty('--px', ((e.clientX / innerWidth) * 2 - 1).toFixed(3));
        art.style.setProperty('--py', ((e.clientY / innerHeight) * 2 - 1).toFixed(3));
    }, { passive: true });
})();
