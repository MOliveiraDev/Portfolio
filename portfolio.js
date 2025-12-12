// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or default to dark
const currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);

// Update icon based on current theme
if (currentTheme === 'light') {
    themeIcon.className = 'fas fa-sun';
} else {
    themeIcon.className = 'fas fa-moon';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    if (newTheme === 'light') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
});

// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.topic-item, .highlight-card, .skill-card, .experience-card, .project-card, .contact-item'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Create scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.id = 'scroll-top';
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollTopBtn);

// Navbar background and scroll to top button
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(26, 26, 46, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.borderBottom = '1px solid var(--border-color)';
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        navbar.style.background = 'transparent';
        navbar.style.backdropFilter = 'none';
        navbar.style.borderBottom = 'none';
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

// Scroll to top functionality
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Skill cards staggered animation
const skillsSection = document.getElementById('skills');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillCards = entry.target.querySelectorAll('.skill-card');
            skillCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// Code typing animation - Multiple Java examples
const codeExamples = [
    // Simple Hello World - First example
    {
        title: "HelloWorld.java",
        lines: [
            '<span class="keyword">public class</span> <span class="class-name">HelloWorld</span> {',
            '',
            '    <span class="keyword">public static</span> <span class="keyword">void</span> <span class="method">main</span>(<span class="class-name">String</span>[] args) {',
            '        <span class="comment">// Simple Java program</span>',
            '        <span class="class-name">System</span>.out.<span class="method">println</span>(<span class="string">"Hello, World!"</span>);',
            '',
            '        <span class="comment">// Variables and operations</span>',
            '        <span class="keyword">int</span> x = <span class="number">10</span>;',
            '        <span class="keyword">int</span> y = <span class="number">20</span>;',
            '        <span class="keyword">int</span> sum = x + y;',
            '',
            '        <span class="class-name">System</span>.out.<span class="method">println</span>(<span class="string">"Sum: "</span> + sum);',
            '',
            '        <span class="comment">// Loop example</span>',
            '        <span class="keyword">for</span> (<span class="keyword">int</span> i = <span class="number">1</span>; i &lt;= <span class="number">5</span>; i++) {',
            '            <span class="class-name">System</span>.out.<span class="method">println</span>(<span class="string">"Count: "</span> + i);',
            '        }',
            '    }',
            '}'
        ]
    },
    // Spring Boot REST API
    {
        title: "UserController.java",
        lines: [
            '<span class="annotation">@RestController</span>',
            '<span class="annotation">@RequestMapping</span>(<span class="string">"/api/users"</span>)',
            '<span class="keyword">public class</span> <span class="class-name">UserController</span> {',
            '',
            '    <span class="annotation">@Autowired</span>',
            '    <span class="keyword">private</span> <span class="class-name">UserService</span> userService;',
            '',
            '    <span class="annotation">@GetMapping</span>',
            '    <span class="keyword">public</span> <span class="class-name">List</span>&lt;<span class="class-name">User</span>&gt; <span class="method">getAllUsers</span>() {',
            '        <span class="keyword">return</span> userService.<span class="method">findAll</span>();',
            '    }',
            '',
            '    <span class="annotation">@PostMapping</span>',
            '    <span class="keyword">public</span> <span class="class-name">ResponseEntity</span>&lt;<span class="class-name">User</span>&gt; <span class="method">createUser</span>(<span class="annotation">@RequestBody</span> <span class="class-name">User</span> user) {',
            '        <span class="class-name">User</span> savedUser = userService.<span class="method">save</span>(user);',
            '        <span class="keyword">return</span> <span class="class-name">ResponseEntity</span>.<span class="method">ok</span>(savedUser);',
            '    }',
            '}'
        ]
    },
    // Data Structures - ArrayList
    {
        title: "DataStructures.java",
        lines: [
            '<span class="keyword">import</span> java.util.*;',
            '',
            '<span class="keyword">public class</span> <span class="class-name">DataStructures</span> {',
            '    <span class="keyword">public static</span> <span class="keyword">void</span> <span class="method">main</span>(<span class="class-name">String</span>[] args) {',
            '        <span class="comment">// ArrayList example</span>',
            '        <span class="class-name">List</span>&lt;<span class="class-name">String</span>&gt; names = <span class="keyword">new</span> <span class="class-name">ArrayList</span>&lt;&gt;();',
            '        names.<span class="method">add</span>(<span class="string">"Alice"</span>);',
            '        names.<span class="method">add</span>(<span class="string">"Bob"</span>);',
            '        names.<span class="method">add</span>(<span class="string">"Charlie"</span>);',
            '',
            '        <span class="comment">// Stream API</span>',
            '        names.<span class="method">stream</span>()',
            '             .<span class="method">filter</span>(name -> name.<span class="method">startsWith</span>(<span class="string">"A"</span>))',
            '             .<span class="method">forEach</span>(<span class="class-name">System</span>.out::<span class="method">println</span>);',
            '',
            '        <span class="comment">// HashMap example</span>',
            '        <span class="class-name">Map</span>&lt;<span class="class-name">String</span>, <span class="class-name">Integer</span>&gt; ages = <span class="keyword">new</span> <span class="class-name">HashMap</span>&lt;&gt;();',
            '        ages.<span class="method">put</span>(<span class="string">"Alice"</span>, <span class="number">25</span>);',
            '        ages.<span class="method">put</span>(<span class="string">"Bob"</span>, <span class="number">30</span>);',
            '    }',
            '}'
        ]
    }
];

let currentExampleIndex = 0;

function typeCode() {
    const codeContainer = document.querySelector('.code-container');
    const codeTitle = document.querySelector('.code-title');
    const codeContent = document.querySelector('.code-content');
    
    if (!codeContainer || !codeTitle || !codeContent) return;

    const currentExample = codeExamples[currentExampleIndex];
    
    // Clear previous content
    codeContent.innerHTML = '';
    codeTitle.textContent = currentExample.title;
    
    let lineIndex = 0;
    
    function typeLine() {
        if (lineIndex < currentExample.lines.length) {
            const line = currentExample.lines[lineIndex];
            const lineElement = document.createElement('div');
            lineElement.className = 'code-line';
            
            if (line.trim() === '') {
                lineElement.innerHTML = '&nbsp;';
                codeContent.appendChild(lineElement);
                lineIndex++;
                setTimeout(typeLine, 200);
            } else {
                codeContent.appendChild(lineElement);
                
                let charIndex = 0;
                function typeChar() {
                    if (charIndex < line.length) {
                        lineElement.innerHTML = line.substring(0, charIndex + 1);
                        charIndex++;
                        setTimeout(typeChar, 30);
                    } else {
                        lineIndex++;
                        setTimeout(typeLine, 300);
                    }
                }
                typeChar();
            }
        } else {
            // Wait before starting next example
            setTimeout(() => {
                currentExampleIndex = (currentExampleIndex + 1) % codeExamples.length;
                setTimeout(typeCode, 2000);
            }, 3000);
        }
    }
    
    typeLine();
}

// Start typing animation when code section is visible
const codeSection = document.querySelector('.code-container');
if (codeSection) {
    const codeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(typeCode, 1000);
                codeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    codeObserver.observe(codeSection);
}

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        // Here you would typically send the data to a server
        alert('Mensagem enviada com sucesso! Entrarei em contato em breve.');
        this.reset();
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Navbar active link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});