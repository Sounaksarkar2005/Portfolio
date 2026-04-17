// --- Theme Toggle Logic with Reveal Animation ---
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const reveal = document.getElementById('theme-reveal');
const body = document.body;

// Initialize theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', (e) => {
    const rect = themeToggle.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Set reveal starting point
    reveal.style.clipPath = `circle(0% at ${x}px ${y}px)`;
    reveal.classList.remove('active');
    
    // Force reflow
    void reveal.offsetWidth;

    // Start reveal
    reveal.classList.add('active');
    reveal.style.clipPath = `circle(150% at ${x}px ${y}px)`;

    // Switch theme halfway through animation
    setTimeout(() => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        
        if (isLight) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
            updateThreeTheme(true);
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
            updateThreeTheme(false);
        }
    }, 400);

    // Cleanup reveal
    setTimeout(() => {
        reveal.classList.remove('active');
        reveal.style.clipPath = 'circle(0% at center)';
    }, 1000);
});

// Scroll Animation Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// Custom Trailing Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });
}

// Hover effect for interactive elements
document.querySelectorAll('a, .btn, .skill-card, .project-card, .dock-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursorOutline) {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(57, 255, 20, 0.1)';
        }
    });
    el.addEventListener('mouseleave', () => {
        if (cursorOutline) {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
        }
    });
});

// Tilt Effect for Glass Cards
const tiltElements = document.querySelectorAll('.tilt-effect');

tiltElements.forEach(element => {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * 10;
        const rotateY = ((centerX - x) / centerX) * 10;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
    });
});

// Typing effect for Hero
const textElement = document.querySelector('.typewriter');
if (textElement) {
    const text = textElement.textContent;
    textElement.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            textElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    setTimeout(typeWriter, 500);
}


// ============================================
// Three.js 3D Interactive Background
// ============================================
let updateThreeTheme;

const canvas = document.querySelector('#bg-canvas');
if (canvas) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030a04, 0.0015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);

    const geometries = [
        new THREE.IcosahedronGeometry(1.5, 0),
        new THREE.TorusGeometry(1, 0.3, 16, 100),
        new THREE.OctahedronGeometry(1.2, 0)
    ];

    const material = new THREE.MeshBasicMaterial({ 
        color: 0x39ff14, 
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });

    const shapes = [];

    for(let i=0; i<60; i++) {
        const geo = geometries[Math.floor(Math.random() * geometries.length)];
        const shape = new THREE.Mesh(geo, material);
        
        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(120));
        shape.position.set(x, y, z);
        
        const scale = Math.random() * 2.5;
        shape.scale.set(scale, scale, scale);
        
        shape.userData = {
            rotX: (Math.random() - 0.5) * 0.015,
            rotY: (Math.random() - 0.5) * 0.015
        };

        scene.add(shape);
        shapes.push(shape);
    }

    // Dynamic Theme Update for Three.js
    updateThreeTheme = (isLight) => {
        if (isLight) {
            material.color.setHex(0x008800);
            scene.fog.color.setHex(0xf0f7f4);
        } else {
            material.color.setHex(0x39ff14);
            scene.fog.color.setHex(0x030a04);
        }
    };

    // Set initial state
    if (savedTheme === 'light') updateThreeTheme(true);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.05;
        mouseY = (event.clientY - windowHalfY) * 0.05;
    });

    document.body.onscroll = () => {
        const t = document.body.getBoundingClientRect().top;
        camera.position.z = 30 + (t * -0.005);
        camera.position.x = t * -0.0001;
        camera.position.y = t * -0.0001;
    };

    function animate() {
        requestAnimationFrame(animate);
        targetX = mouseX * 0.02;
        targetY = mouseY * 0.02;
        camera.rotation.y += 0.03 * (targetX - camera.rotation.y);
        camera.rotation.x += 0.03 * (targetY - camera.rotation.x);

        shapes.forEach(shape => {
            shape.rotation.x += shape.userData.rotX;
            shape.rotation.y += shape.userData.rotY;
            shape.position.y += Math.sin(Date.now() * 0.001 + shape.position.x) * 0.005;
        });

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- Projects See More Logic ---
const seeMoreBtn = document.getElementById('see-more-btn');
const comingSoonMsg = document.getElementById('coming-soon');

if (seeMoreBtn && comingSoonMsg) {
    seeMoreBtn.addEventListener('click', () => {
        seeMoreBtn.style.display = 'none';
        comingSoonMsg.style.display = 'block';
        setTimeout(() => {
            comingSoonMsg.classList.add('visible');
        }, 10);
    });
}



