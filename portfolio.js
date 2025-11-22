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

// Removed active navigation link highlighting on scroll
// Now only hover effects will work

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



// Navbar background and scroll to top button
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollTopBtn = document.getElementById('scroll-top');
    
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

// Create scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.id = 'scroll-top';
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollTopBtn);

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
            '<span class="annotation">@RequestMapping</span>(<span class="string">"/api/v1"</span>)',
            '<span class="keyword">public class</span> <span class="class-name">UserController</span> {',
            '',
            '    <span class="annotation">@Autowired</span>',
            '    <span class="keyword">private</span> <span class="class-name">UserService</span> userService;',
            '',
            '    <span class="annotation">@GetMapping</span>(<span class="string">"/users"</span>)',
            '    <span class="keyword">public</span> <span class="class-name">ResponseEntity</span>&lt;<span class="class-name">List</span>&lt;<span class="class-name">User</span>&gt;&gt; <span class="method">getUsers</span>() {',
            '        <span class="keyword">return</span> <span class="class-name">ResponseEntity</span>.<span class="method">ok</span>(userService.<span class="method">findAll</span>());',
            '    }',
            '',
            '    <span class="annotation">@PostMapping</span>(<span class="string">"/users"</span>)',
            '    <span class="keyword">public</span> <span class="class-name">ResponseEntity</span>&lt;<span class="class-name">User</span>&gt; <span class="method">createUser</span>(',
            '            <span class="annotation">@RequestBody</span> <span class="annotation">@Valid</span> <span class="class-name">User</span> user) {',
            '        <span class="class-name">User</span> saved = userService.<span class="method">save</span>(user);',
            '        <span class="keyword">return</span> <span class="class-name">ResponseEntity</span>.<span class="method">status</span>(<span class="class-name">HttpStatus</span>.CREATED)',
            '                .<span class="method">body</span>(saved);',
            '    }',
            '}'
        ]
    },
    // Algorithm - Binary Search
    {
        title: "BinarySearch.java",
        lines: [
            '<span class="keyword">public class</span> <span class="class-name">BinarySearch</span> {',
            '',
            '    <span class="keyword">public static</span> <span class="keyword">int</span> <span class="method">search</span>(<span class="keyword">int</span>[] arr, <span class="keyword">int</span> target) {',
            '        <span class="keyword">int</span> left = <span class="number">0</span>, right = arr.length - <span class="number">1</span>;',
            '',
            '        <span class="keyword">while</span> (left &lt;= right) {',
            '            <span class="keyword">int</span> mid = left + (right - left) / <span class="number">2</span>;',
            '',
            '            <span class="keyword">if</span> (arr[mid] == target) {',
            '                <span class="keyword">return</span> mid;',
            '            }',
            '',
            '            <span class="keyword">if</span> (arr[mid] &lt; target) {',
            '                left = mid + <span class="number">1</span>;',
            '            } <span class="keyword">else</span> {',
            '                right = mid - <span class="number">1</span>;',
            '            }',
            '        }',
            '',
            '        <span class="keyword">return</span> -<span class="number">1</span>; <span class="comment">// Not found</span>',
            '    }',
            '}'
        ]
    },
    // Stream API Example
    {
        title: "StreamExample.java",
        lines: [
            '<span class="keyword">import</span> java.util.*;',
            '<span class="keyword">import</span> java.util.stream.*;',
            '',
            '<span class="keyword">public class</span> <span class="class-name">StreamExample</span> {',
            '',
            '    <span class="keyword">public static</span> <span class="keyword">void</span> <span class="method">main</span>(<span class="class-name">String</span>[] args) {',
            '        <span class="class-name">List</span>&lt;<span class="class-name">String</span>&gt; names = <span class="class-name">Arrays</span>.<span class="method">asList</span>(',
            '            <span class="string">"Alice"</span>, <span class="string">"Bob"</span>, <span class="string">"Charlie"</span>, <span class="string">"David"</span>',
            '        );',
            '',
            '        <span class="class-name">List</span>&lt;<span class="class-name">String</span>&gt; result = names.<span class="method">stream</span>()',
            '            .<span class="method">filter</span>(name -&gt; name.<span class="method">length</span>() &gt; <span class="number">4</span>)',
            '            .<span class="method">map</span>(<span class="class-name">String</span>::<span class="method">toUpperCase</span>)',
            '            .<span class="method">sorted</span>()',
            '            .<span class="method">collect</span>(<span class="class-name">Collectors</span>.<span class="method">toList</span>());',
            '',
            '        result.<span class="method">forEach</span>(<span class="class-name">System</span>.out::<span class="method">println</span>);',
            '    }',
            '}'
        ]
    },
    // Design Pattern - Singleton
    {
        title: "Singleton.java",
        lines: [
            '<span class="keyword">public class</span> <span class="class-name">DatabaseConnection</span> {',
            '',
            '    <span class="keyword">private static</span> <span class="keyword">volatile</span> <span class="class-name">DatabaseConnection</span> instance;',
            '    <span class="keyword">private</span> <span class="class-name">Connection</span> connection;',
            '',
            '    <span class="keyword">private</span> <span class="method">DatabaseConnection</span>() {',
            '        <span class="comment">// Private constructor</span>',
            '        <span class="keyword">this</span>.connection = <span class="method">createConnection</span>();',
            '    }',
            '',
            '    <span class="keyword">public static</span> <span class="class-name">DatabaseConnection</span> <span class="method">getInstance</span>() {',
            '        <span class="keyword">if</span> (instance == <span class="keyword">null</span>) {',
            '            <span class="keyword">synchronized</span> (<span class="class-name">DatabaseConnection</span>.<span class="keyword">class</span>) {',
            '                <span class="keyword">if</span> (instance == <span class="keyword">null</span>) {',
            '                    instance = <span class="keyword">new</span> <span class="class-name">DatabaseConnection</span>();',
            '                }',
            '            }',
            '        }',
            '        <span class="keyword">return</span> instance;',
            '    }',
            '}'
        ]
    },

];

let currentExampleIndex = 0;

function typeCode() {
    const codeContent = document.getElementById('code-content');
    const monitorTitle = document.querySelector('.monitor-title');
    if (!codeContent) return;
    
    let lineIndex = 0;
    let charIndex = 0;
    
    function getCurrentExample() {
        return codeExamples[currentExampleIndex];
    }
    
    function updateTitle() {
        if (monitorTitle) {
            monitorTitle.textContent = getCurrentExample().title;
        }
    }
    
    function typeLine() {
        const currentExample = getCurrentExample();
        const codeLines = currentExample.lines;
        
        if (lineIndex < codeLines.length) {
            const currentLine = codeLines[lineIndex];
            
            if (charIndex < currentLine.length) {
                const lineElement = document.querySelector(`#line-${lineIndex}`) || 
                    (() => {
                        const div = document.createElement('div');
                        div.className = 'code-line';
                        div.id = `line-${lineIndex}`;
                        codeContent.appendChild(div);
                        return div;
                    })();
                
                lineElement.innerHTML = currentLine.substring(0, charIndex + 1) + '<span class="typing-cursor"></span>';
                charIndex++;
                setTimeout(typeLine, 25);
            } else {
                document.querySelector(`#line-${lineIndex} .typing-cursor`)?.remove();
                lineIndex++;
                charIndex = 0;
                setTimeout(typeLine, 150);
            }
        } else {
            setTimeout(() => {
                currentExampleIndex = (currentExampleIndex + 1) % codeExamples.length;
                codeContent.innerHTML = '';
                lineIndex = 0;
                charIndex = 0;
                updateTitle();
                setTimeout(typeLine, 500);
            }, 4000);
        }
    }
    
    updateTitle();
    typeLine();
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
        typeCode();
    }, 1000);
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-bg');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add hover effects to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.2)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = 'var(--shadow)';
    });
});

// Add click effect to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        let ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        let x = e.clientX - e.target.offsetLeft;
        let y = e.clientY - e.target.offsetTop;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple effect CSS and number styling
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .number {
        color: #bd93f9;
    }
    
    #scroll-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--accent-primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
    }
    
    #scroll-top:hover {
        background: var(--accent-secondary);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
    }
`;
document.head.appendChild(style);peCode();