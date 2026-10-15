/**
 * Sawin Kumar - AI & Machine Learning Portfolio
 * Core Interactive Scripts: Neural Canvas, AI Sandbox, Project Filters & UI Controls
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. NEURAL NETWORK PARTICLES CANVAS
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
            width = canvas.width = rect.width * dpr;
            height = canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            width = rect.width;
            height = rect.height;
            initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;
                this.radius = Math.random() * 2 + 1.5;
                this.baseAlpha = Math.random() * 0.5 + 0.3;
                this.alpha = this.baseAlpha;
                this.color = Math.random() > 0.4 ? 'rgba(34, 211, 238, ' : 'rgba(99, 102, 241, ';
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= (dx / dist) * force * 2;
                        this.y -= (dy / dist) * force * 2;
                        this.alpha = Math.min(1, this.baseAlpha + 0.4);
                    } else {
                        this.alpha = this.baseAlpha;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.alpha + ')';
                ctx.shadowColor = '#06b6d4';
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        class Pulse {
            constructor(p1, p2) {
                this.p1 = p1;
                this.p2 = p2;
                this.progress = 0;
                this.speed = Math.random() * 0.02 + 0.015;
            }

            update() {
                this.progress += this.speed;
            }

            draw() {
                const currentX = this.p1.x + (this.p2.x - this.p1.x) * this.progress;
                const currentY = this.p1.y + (this.p2.y - this.p1.y) * this.progress;

                ctx.beginPath();
                ctx.arc(currentX, currentY, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = '#22d3ee';
                ctx.shadowColor = '#22d3ee';
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        function initParticles() {
            particles = [];
            pulses = [];
            const count = Math.min(Math.floor((width * height) / 12000), 75);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            const maxDistance = 140;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const alpha = (1 - distance / maxDistance) * 0.25;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();

                        // Randomly trigger synapse firing pulse
                        if (Math.random() < 0.0003 && pulses.length < 8) {
                            pulses.push(new Pulse(particles[i], particles[j]));
                        }
                    }
                }
            }
        }

        let animationFrameId;
        function animate() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            connectParticles();

            // Animate Action Potentials (synapse pulses)
            for (let i = pulses.length - 1; i >= 0; i--) {
                pulses[i].update();
                pulses[i].draw();
                if (pulses[i].progress >= 1) {
                    pulses.splice(i, 1);
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            if (e.clientY <= rect.bottom) {
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            } else {
                mouse.x = null;
                mouse.y = null;
            }
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        resizeCanvas();
        animate();
    }


    // ==========================================
    // 2. COUNTER ANIMATION FOR METRICS
    // ==========================================
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const startCounting = (counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const isDecimal = target % 1 !== 0;
        let count = 0;
        const increment = target / 40;

        const updateCount = () => {
            count += increment;
            if (count < target) {
                counter.innerText = isDecimal ? count.toFixed(1) + '%' : Math.ceil(count) + (counter.innerText.includes('+') ? '+' : (counter.innerText.includes('x') ? 'x' : ''));
                setTimeout(updateCount, 25);
            } else {
                if (counter.getAttribute('data-target') === '99.2') {
                    counter.innerText = '99.2%';
                } else if (counter.getAttribute('data-target') === '15') {
                    counter.innerText = '15+';
                } else if (counter.getAttribute('data-target') === '4') {
                    counter.innerText = '4x';
                } else {
                    counter.innerText = target;
                }
            }
        };
        updateCount();
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounting(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
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
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });


    // ==========================================
    // 4. INTERACTIVE AI PLAYGROUND (CLIENT-SIDE)
    // ==========================================
    const aiInput = document.getElementById('aiInputText');
    const runDemoBtn = document.getElementById('runAiDemoBtn');
    const tokensList = document.getElementById('tokensList');
    const tokenCountLabel = document.getElementById('tokenCountLabel');
    const posScore = document.getElementById('posScore');
    const posBar = document.getElementById('posBar');
    const neuScore = document.getElementById('neuScore');
    const neuBar = document.getElementById('neuBar');
    const negScore = document.getElementById('negScore');
    const negBar = document.getElementById('negBar');
    const embeddingSlice = document.getElementById('embeddingSlice');
    const sampleButtons = document.querySelectorAll('.sample-prompt-btn');

    // Sample Prompts click listener
    sampleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sampleText = btn.getAttribute('data-text');
            if (aiInput) {
                aiInput.value = sampleText;
                executeAiAnalysis(sampleText);
            }
        });
    });

    if (runDemoBtn && aiInput) {
        runDemoBtn.addEventListener('click', () => {
            const text = aiInput.value.trim() || aiInput.placeholder;
            executeAiAnalysis(text);
        });
    }

    function executeAiAnalysis(text) {
        // Visual button state during simulated compute
        if (runDemoBtn) {
            runDemoBtn.disabled = true;
            runDemoBtn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Computing Inferences...</span>
            `;
        }

        setTimeout(() => {
            // 1. Tokenizer simulation (Byte-Pair Encoding approximation)
            const words = text.split(/(\s+|[.,!?;:()"])/).filter(Boolean);
            const tokens = [];
            tokens.push({ text: '<s>', id: 1, isSpecial: true });

            words.forEach((word) => {
                if (word.trim() === '') return;
                if (word.length > 7) {
                    const mid = Math.floor(word.length / 2);
                    tokens.push({ text: word.slice(0, mid), id: Math.floor(Math.random() * 28000 + 1000) });
                    tokens.push({ text: '##' + word.slice(mid), id: Math.floor(Math.random() * 28000 + 1000) });
                } else {
                    tokens.push({ text: word, id: Math.floor(Math.random() * 28000 + 1000) });
                }
            });
            tokens.push({ text: '</s>', id: 2, isSpecial: true });

            // Render Tokens
            if (tokensList) {
                tokensList.innerHTML = '';
                tokens.forEach((tok, index) => {
                    const span = document.createElement('span');
                    span.className = tok.isSpecial ? 'token-chip token-chip-special' : 'token-chip';
                    span.innerHTML = `<span>${tok.text}</span><span class="text-[9px] opacity-60 font-mono">#${tok.id}</span>`;
                    tokensList.appendChild(span);
                });
            }
            if (tokenCountLabel) {
                tokenCountLabel.innerText = `${tokens.length} Tokens`;
            }

            // 2. Sentiment Head Heuristic Analysis
            const lower = text.toLowerCase();
            const positiveWords = ['revolutionary', 'accuracy', 'faster', 'win', 'transformed', 'great', 'success', 'advantage', 'unprecedented', 'intelligent', 'cutting-edge', 'robust', 'scale'];
            const negativeWords = ['error', 'mismatch', 'unhandled', 'fail', 'bad', 'loss', 'bug', 'hallucination', 'bottleneck', 'leak'];

            let posCount = 0;
            let negCount = 0;

            positiveWords.forEach(w => { if (lower.includes(w)) posCount += 2; });
            negativeWords.forEach(w => { if (lower.includes(w)) negCount += 2; });

            let positive = 30 + (posCount * 20) - (negCount * 15);
            let negative = 10 + (negCount * 25) - (posCount * 10);
            let neutral = 60;

            positive = Math.max(2, Math.min(94, positive));
            negative = Math.max(1, Math.min(92, negative));
            neutral = Math.max(4, 100 - positive - negative);

            // Re-normalize to 100
            const total = positive + neutral + negative;
            positive = Math.round((positive / total) * 100);
            negative = Math.round((negative / total) * 100);
            neutral = 100 - positive - negative;

            // Animate Scores
            if (posScore) posScore.innerText = `${positive}%`;
            if (posBar) posBar.style.width = `${positive}%`;
            if (neuScore) neuScore.innerText = `${neutral}%`;
            if (neuBar) neuBar.style.width = `${neutral}%`;
            if (negScore) negScore.innerText = `${negative}%`;
            if (negBar) negBar.style.width = `${negative}%`;

            // 3. Dense Embedding Vector Sample
            if (embeddingSlice) {
                embeddingSlice.innerHTML = '';
                for (let i = 0; i < 8; i++) {
                    const val = (Math.random() * 2 - 1).toFixed(4);
                    const tag = document.createElement('span');
                    tag.className = 'px-2 py-1 rounded bg-dark-950 border border-white/10 text-cyan-300';
                    tag.innerText = `d${i}: ${val > 0 ? '+' : ''}${val}`;
                    embeddingSlice.appendChild(tag);
                }
                const dots = document.createElement('span');
                dots.className = 'text-slate-500 self-center text-xs';
                dots.innerText = '... +760 dims';
                embeddingSlice.appendChild(dots);
            }

            // Reset button
            if (runDemoBtn) {
                runDemoBtn.disabled = false;
                runDemoBtn.innerHTML = `
                    <i data-lucide="play" class="w-4 h-4 fill-white"></i>
                    <span>Execute Transformer Analysis</span>
                `;
                lucide.createIcons();
            }

            showToast('Inference computed successfully!');
        }, 350);
    }

    // Run initial demo on load
    if (aiInput) {
        executeAiAnalysis(aiInput.placeholder);
    }


    // ==========================================
    // 5. TOAST NOTIFICATION & CLIPBOARD UTILITIES
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
        }, 3200);
    }

    // Copy Email Button
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const emailDisplay = document.getElementById('emailDisplay');
    if (copyEmailBtn && emailDisplay) {
        copyEmailBtn.addEventListener('click', () => {
            const email = emailDisplay.innerText.trim();
            navigator.clipboard.writeText(email).then(() => {
                showToast(`Copied ${email} to clipboard!`);
            }).catch(() => {
                showToast('Email: ' + email);
            });
        });
    }

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('senderName')?.value || 'Guest';
            const email = document.getElementById('senderEmail')?.value || '';
            const subject = document.getElementById('senderSubject')?.value || 'Collaboration Inquiry';
            const message = document.getElementById('senderMessage')?.value || '';

            // Construct mailto link
            const mailtoLink = `mailto:sawinkumar13@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
            window.location.href = mailtoLink;

            showToast('Opening default mail client...');
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
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
            } else {
                mobileMenu.classList.add('hidden');
            }
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }


    // ==========================================
    // 7. NAVBAR SCROLL SPY & BLUR EFFECT
    // ==========================================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (!navbar) return;
        if (window.scrollY > 40) {
            navbar.classList.add('bg-dark-950/90', 'border-white/10', 'shadow-lg');
            navbar.classList.remove('bg-dark-950/75', 'border-white/5');
        } else {
            navbar.classList.remove('bg-dark-950/90', 'border-white/10', 'shadow-lg');
            navbar.classList.add('bg-dark-950/75', 'border-white/5');
        }

        // Active state spy
        let currentSectionId = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            const height = sec.offsetHeight;
            if (window.scrollY >= top && window.scrollY < top + height) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentSectionId}`) {
                link.classList.add('text-cyan-400');
                link.classList.remove('text-slate-300');
            } else if (href !== '#playground') {
                link.classList.remove('text-cyan-400');
                link.classList.add('text-slate-300');
            }
        });
    });

});
