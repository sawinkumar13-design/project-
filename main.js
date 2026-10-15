/**
 * Sawin Kumar Portfolio — Interactive Scripts
 * Neural Canvas (Cool Purple/Cyan particles), Scroll Reveals, Project Filters, Contact Form
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. SCROLL REVEAL (IntersectionObserver)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('active'));
    }


    // ==========================================
    // 2. NEURAL NETWORK PARTICLES (PURPLE & CYAN)
    // ==========================================
    const canvas = document.getElementById('neuralCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let pulses = [];
        let mouse = { x: null, y: null, radius: 150 };

        function resizeCanvas() {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            width = rect.width;
            height = rect.height;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.45;
                this.vy = (Math.random() - 0.5) * 0.45;
                this.radius = Math.random() * 1.6 + 0.9;
                this.baseAlpha = Math.random() * 0.35 + 0.15;
                this.alpha = this.baseAlpha;
                
                // Cool purple & cyan particle color palette
                const rand = Math.random();
                if (rand < 0.4) {
                    this.rgb = '168, 85, 247'; // Violet/Purple
                } else if (rand < 0.75) {
                    this.rgb = '34, 211, 238'; // Cyan
                } else {
                    this.rgb = '244, 63, 94';  // Soft Pink/Magenta
                }
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= (dx / dist) * force * 1.6;
                        this.y -= (dy / dist) * force * 1.6;
                        this.alpha = Math.min(0.8, this.baseAlpha + 0.35);
                    } else {
                        this.alpha = this.baseAlpha;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.rgb}, ${this.alpha})`;
                ctx.shadowColor = `rgba(${this.rgb}, 0.5)`;
                ctx.shadowBlur = 6;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        class Pulse {
            constructor(p1, p2) {
                this.p1 = p1; this.p2 = p2;
                this.progress = 0;
                this.speed = Math.random() * 0.02 + 0.012;
            }
            update() { this.progress += this.speed; }
            draw() {
                const x = this.p1.x + (this.p2.x - this.p1.x) * this.progress;
                const y = this.p1.y + (this.p2.y - this.p1.y) * this.progress;
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#c084fc';
                ctx.shadowColor = '#c084fc';
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        function initParticles() {
            particles = [];
            pulses = [];
            const count = Math.min(Math.floor((width * height) / 14000), 65);
            for (let i = 0; i < count; i++) particles.push(new Particle());
        }

        function connectParticles() {
            const maxDist = 135;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.16;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                        if (Math.random() < 0.0003 && pulses.length < 6) {
                            pulses.push(new Pulse(particles[i], particles[j]));
                        }
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => { p.update(); p.draw(); });
            connectParticles();
            for (let i = pulses.length - 1; i >= 0; i--) {
                pulses[i].update(); pulses[i].draw();
                if (pulses[i].progress >= 1) pulses.splice(i, 1);
            }
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            if (e.clientY <= rect.bottom) {
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            } else { mouse.x = null; mouse.y = null; }
        });
        window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

        resizeCanvas();
        animate();
    }


    // ==========================================
    // 3. PROJECT CATEGORY FILTERING
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => { card.style.display = 'none'; }, 250);
                }
            });
        });
    });


    // ==========================================
    // 4. TOAST NOTIFICATION & CLIPBOARD
    // ==========================================
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    let toastTimeout;

    function showToast(msg) {
        if (!toast || !toastMessage) return;
        toastMessage.innerText = msg;
        toast.classList.remove('translate-y-24', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-24', 'opacity-0');
        }, 3000);
    }

    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const emailDisplay = document.getElementById('emailDisplay');
    if (copyEmailBtn && emailDisplay) {
        copyEmailBtn.addEventListener('click', () => {
            const email = emailDisplay.innerText.trim();
            navigator.clipboard.writeText(email).then(() => {
                showToast(`Copied ${email}`);
            }).catch(() => { showToast('Email: ' + email); });
        });
    }


    // ==========================================
    // 5. CONTACT FORM
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('senderName')?.value || 'Guest';
            const email = document.getElementById('senderEmail')?.value || '';
            const subject = document.getElementById('senderSubject')?.value || 'Inquiry';
            const message = document.getElementById('senderMessage')?.value || '';
            const mailtoLink = `mailto:sawinkumar13@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
            window.location.href = mailtoLink;
            showToast('Opening mail client...');
            contactForm.reset();
        });
    }


    // ==========================================
    // 6. MOBILE MENU TOGGLE
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });
    }


    // ==========================================
    // 7. NAVBAR SCROLL SPY
    // ==========================================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (!navbar) return;
        if (window.scrollY > 40) {
            navbar.style.borderBottomColor = 'rgba(168, 85, 247, 0.2)';
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        } else {
            navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.06)';
            navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        }

        let currentId = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 110;
            if (window.scrollY >= top && window.scrollY < top + sec.offsetHeight) {
                currentId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active-nav');
            } else {
                link.classList.remove('active-nav');
            }
        });
    });

});
