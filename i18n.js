// Troca de idioma EN <-> PT. O HTML fica em inglês; o português vem deste dicionário.
// Nós de texto são trocados um a um; títulos e frases com marcação usam data-i18n (HTML inteiro).
(() => {
    const PT = {
        'Home': 'Início', 'About': 'Sobre', 'Skills': 'Habilidades', 'Experience': 'Experiência', 'Projects': 'Projetos', 'Contact': 'Contato',
        "Let's talk": 'Vamos conversar',
        'Software developer': 'Desenvolvedor de software', 'Back-End · AI agents': 'Back-End · Agentes de IA',
        "Hi, I'm": 'Olá, eu sou',
        'Software Development / AI Builder': 'Desenvolvimento de Software / AI Builder',
        'Always working on application development, AI agents and automated flows, choosing the best decision for the system architecture!':
            'Sempre atuando no desenvolvimento de aplicações, agentes de IA e fluxos automatizados, escolhendo a melhor decisão para a arquitetura do sistema!',
        'View projects': 'Ver projetos', 'Contact me': 'Fale comigo', 'Java Cloud Certified': 'Certificado Java Cloud',
        'Technologies': 'Tecnologias', 'in the stack': 'na stack', 'on GitHub': 'no GitHub',
        'Complementary': 'Cursos', 'courses': 'complementares',
        '01 / Behind the code': '01 / Por trás do código', '02 / Tools & stack': '02 / Ferramentas e stack',
        '03 / Path': '03 / Trajetória', '04 / Selected projects': '04 / Projetos selecionados', '05 / Next project': '05 / Próximo projeto',
        'Professional Profile': 'Perfil Profissional',
        'Back-End Developer with solid experience in software development': 'Desenvolvedor Back-End com sólida experiência em desenvolvimento de software',
        'Focused on best practices for quality, efficiency and security': 'Foco em boas práticas de qualidade, eficiência e segurança',
        'Creating AI Agents with intelligent flow for autonomous decision making': 'Criação de agentes de IA com fluxo inteligente para tomada de decisão autônoma',
        'Technical Specialization': 'Especialização Técnica',
        'Expertise in Spring Boot, Web and Security': 'Domínio de Spring Boot, Web e Security',
        'Creating images for personal projects': 'Criação de imagens para projetos pessoais',
        'Publishing on DockerHub': 'Publicação no DockerHub',
        'Application monitoring with Grafana': 'Monitoramento de aplicações com Grafana',
        'Infrastructure as code (IaC) implementation, such as Terraform': 'Implementação da infraestrutura como código (IAC), como Terraform',
        'CI/CD with code versioning in Git and workflow management with GitWorkflow': 'CI/CD com versionamento de código com Git e gerenciamento de fluxos com GitWorkflow',
        'Professional Growth': 'Crescimento Profissional',
        'Constant search for new technologies': 'Busca constante por novas tecnologias',
        'Continuous learning of modern methodologies': 'Aprendizado contínuo de metodologias modernas',
        'Goal to become a more complete and efficient developer': 'Objetivo de me tornar um desenvolvedor mais completo e eficiente',
        'IT Assistant (Intern)': 'Auxiliar de TI (Estagiário)',
        'July 2026 - Present': 'Julho de 2026 - Atual',
        'Using the GLPI tool to support level 1 help desk tickets': 'Uso da ferramenta GLPI para auxiliar no suporte de chamados N1',
        'Automations in Python and N8N for recurring processes between departments': 'Automações em Python e N8N para processos constantes entre os setores',
        'Using the Wiki tool to write process documentation for the IT department': 'Utilização da ferramenta Wiki para desenvolver documentações de processos no setor de TI',
        'Remote support using MeshCentral': 'Auxílio no suporte remoto utilizando MeshCentral',
        'Building dashboards and charts for monthly and yearly reports in Grafana': 'Desenvolvimento de dashboards e gráficos de relatórios mensais e anuais no Grafana',
        'Systems Analyst (Temporary)': 'Analista de Sistemas (Temporário)',
        'April 2026 - June 2026': 'Abril de 2026 - Junho de 2026',
        'Developing Python automation for Excel reports': 'Desenvolvimento de automação em Python para relatórios no Excel',
        'Developing Web Scraping routines in Python to collect data from outsourced systems': 'Desenvolvimento de rotinas de Web Scraping em Python para coleta de dados em sistemas terceirizados',
        'Supporting the automation of repetitive processes built in Python': 'Auxílio na automação de processos repetitivos desenvolvidos em Python',
        'Analysis of logs and events inside the Puzzle system': 'Análises de logs e eventos dentro do sistema Puzzle',
        'Administrative Assistant (Apprentice)': 'Assistente Administrativo (Jovem Aprendiz)',
        'January 2025 - October 2025': 'Janeiro de 2025 - Outubro de 2025',
        'Using intermediate Office 365 resources': 'Uso de recursos intermediários do Office 365',
        'Data manipulation and analysis in Excel for administrative reports': 'Manipulação e análise de dados no Excel para relatórios administrativos',
        'Technology in Systems Analysis and Development': 'Tecnologia em Análise e Desenvolvimento de Sistemas',
        '2025 - 2027 (In progress)': '2025 - 2027 (Em andamento)',
        'Complementary Courses': 'Cursos Complementares',
        'Intermediate English': 'Inglês Intermediário',
        'All projects': 'Todos os projetos', 'All': 'Todos', 'AI': 'IA', 'Automation': 'Automação', 'Cloud': 'Nuvem', 'Security': 'Segurança',
        'Intelligent system for gyms with integrated AI for workout personalization and user progress tracking.':
            'Sistema inteligente para academias, com IA integrada para personalizar treinos e acompanhar o progresso dos alunos.',
        'Back End developed with Spring Boot to list videos stored in a public Supabase bucket.':
            'Back-End desenvolvido com Spring Boot para listar vídeos armazenados em um bucket público do Supabase.',
        'Tool for scanning and discovering network devices, with analysis of active ports and services.':
            'Ferramenta para varredura e descoberta de dispositivos de rede, com análise de portas e serviços ativos.',
        'Complete microservices architecture using Spring Cloud with service discovery, gateway and centralized configuration.':
            'Arquitetura completa de microsserviços com Spring Cloud, com service discovery, gateway e configuração centralizada.',
        'Microservices': 'Microsserviços',
        'Automation with N8N': 'Automação com N8N',
        'Experience in automation with N8N, including order alerts, WhatsApp integration (AI and bots), audio transcription and automatic data sending to cloud database.':
            'Experiência em automação com N8N, incluindo alertas de pedidos, integração com WhatsApp (IA e bots), transcrição de áudio e envio automático de dados para banco na nuvem.',
        'Cloud Database': 'Banco em nuvem',
        "I'm available for job opportunities, freelance projects or just to talk about software development.":
            'Estou disponível para oportunidades de trabalho, projetos freelance ou só para conversar sobre desenvolvimento de software.',
        'Send email': 'Enviar e-mail',
        'Built': 'Construído', 'live.': 'ao vivo.',
        'This page · built by agents': 'Esta página · construída por agentes',
        'Tour': 'Tour', 'On tour': 'Em tour'
    };
    const PT_HTML = {
        'about': 'Mais que código.<br>Sistemas que <span class="gradient-text">funcionam.</span>',
        'skills': 'A stack por trás<br>de cada <span class="gradient-text">projeto.</span>',
        'exp': 'Sempre construindo.<br>Sempre <span class="gradient-text">aprendendo.</span>',
        'proj': 'Trabalho que<br>roda <span class="gradient-text">sozinho.</span>',
        'contact': 'Me diga o que<br>você quer <span class="gradient-text">construir.</span>',
        'li-api': 'Foco na criação de <strong>APIs RESTful</strong>',
        'li-java': 'Experiência com o ecossistema <strong>Java, Kotlin</strong> e <strong>Spring</strong>',
        't-arch': 'Foco em <strong>análises de arquitetura</strong> e <strong>tomada de decisões</strong>',
        't-flow': 'Implementações de <strong>fluxos automatizados</strong> e <strong>agentes de IA</strong> treinados para executar operações',
        't-test': 'Boas práticas de desenvolvimento orientados a <strong>testes</strong>',
        'd-graf': 'Monitoramento de aplicações com <strong>Grafana</strong>',
        'd-iac': 'Implementação da <strong>infraestrutura como código (IAC)</strong>, como <strong>Terraform</strong>',
        'd-cicd': '<strong>CI/CD</strong> com versionamento de código com <strong>Git</strong> e gerenciamento de fluxos com <strong>GitWorkflow</strong>',
        'li-docker': 'Conhecimento em <strong>Docker</strong> e docker-compose'
    };
    const RULES = [
        [/^(\d+) agents$/, '$1 agentes'],
        [/^\/ (\d+) layers$/, '/ $1 camadas'],
        [/^(\d+) agents ready/, null]
    ];
    const TITLE = { en: document.title, pt: 'Maicon Oliveira - Desenvolvedor Back-End' };
    const SKIP = 'script,style,#curtain,#agents,.code-monitor,#bp-doc,.photo-sparks,[data-i18n]';

    let lang = 'en';
    try { lang = localStorage.getItem('lang') === 'pt' ? 'pt' : 'en'; } catch (e) {}
    const orig = new WeakMap();
    const enHtml = new Map();
    document.querySelectorAll('[data-i18n]').forEach((el) => enHtml.set(el, el.innerHTML));

    const lookup = (txt) => {
        const key = txt.replace(/\s+/g, ' ').trim();
        if (!key) return null;
        if (PT[key] !== undefined) return PT[key];
        for (const [re, rep] of RULES) if (rep && re.test(key)) return key.replace(re, rep);
        return null;
    };
    const toPT = (node) => {
        if (node.parentElement && node.parentElement.closest(SKIP)) return;
        const pt = lookup(node.nodeValue);
        if (pt == null) return;
        const v = node.nodeValue;
        const nv = v.match(/^\s*/)[0] + pt + v.match(/\s*$/)[0];
        if (nv === v) return;          // igual ao original (ex.: "Tour"): não mexe, senão o observer entra em loop
        orig.set(node, v);
        node.nodeValue = nv;
    };
    const walk = (root, fn) => {
        const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const list = [];
        while (w.nextNode()) list.push(w.currentNode);
        list.forEach(fn);
    };
    const apply = () => {
        document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
        document.title = TITLE[lang];
        if (lang === 'pt') {
            walk(document.body, (n) => { if (!orig.has(n) || lookup(n.nodeValue) != null) toPT(n); });
            enHtml.forEach((en, el) => { if (!el.dataset.scrambling && PT_HTML[el.dataset.i18n]) el.innerHTML = PT_HTML[el.dataset.i18n]; });
        } else {
            walk(document.body, (n) => { if (orig.has(n)) { n.nodeValue = orig.get(n); orig.delete(n); } });
            enHtml.forEach((en, el) => { if (!el.dataset.scrambling) el.innerHTML = en; });
        }
        const btn = document.getElementById('lang-toggle');
        if (btn) {
            btn.dataset.lang = lang;
            btn.setAttribute('aria-label', lang === 'pt' ? 'Mudar idioma para inglês' : 'Switch language to Portuguese');
            btn.querySelectorAll('span').forEach((s) => s.classList.toggle('on', s.dataset.l === lang));
        }
        window.dispatchEvent(new Event('resize'));   // o menu segmentado recalcula as larguras
    };

    // texto criado depois (HUD, botão do tour) também é traduzido
    new MutationObserver((muts) => {
        if (lang !== 'pt') return;
        for (const m of muts) {
            if (m.type === 'characterData') toPT(m.target);
            else m.addedNodes.forEach((n) => {
                if (n.nodeType === 3) toPT(n);
                else if (n.nodeType === 1 && !n.closest(SKIP)) walk(n, toPT);
            });
        }
    }).observe(document.body, { childList: true, subtree: true, characterData: true });

    const set = (l) => {
        lang = l;
        try { localStorage.setItem('lang', l); } catch (e) {}
        apply();
        setTimeout(apply, 1300);   // depois de um scramble de título em andamento
    };
    window.i18n = { get lang() { return lang; }, set };
    document.getElementById('lang-toggle')?.addEventListener('click', () => set(lang === 'pt' ? 'en' : 'pt'));
    apply();
})();
