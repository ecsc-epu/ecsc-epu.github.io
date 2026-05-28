const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let mouse = { x: null, y: null };

function init() {
    resize();
    window.addEventListener('resize', resize);
    
    document.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    document.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Create particles
    const particleCount = Math.floor((width * height) / 15000); // Responsive particle count
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    animate();
}

function resize() {
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = width;
    canvas.height = height;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.radius = Math.random() * 2 + 1;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 196, 94, 0.4)'; // Yellow from palette
        ctx.fill();
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Connect to mouse
        if (mouse.x != null) {
            let dx = mouse.x - particles[i].x;
            let dy = mouse.y - particles[i].y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 150) {
                ctx.beginPath();
                // Red color connection to mouse
                ctx.strokeStyle = `rgba(190, 61, 42, ${0.8 * (1 - dist/150)})`; 
                ctx.lineWidth = 1.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }

        // Connect to other particles
        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 100) {
                ctx.beginPath();
                // Yellow subtle network connection
                ctx.strokeStyle = `rgba(245, 196, 94, ${0.2 * (1 - dist/100)})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    
    requestAnimationFrame(animate);
}

// Wait for fonts and layout to settle
window.addEventListener('load', init);
