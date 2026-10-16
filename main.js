/**
 * Sawin Kumar Portfolio — Interactive Luxury Galaxy & Cosmic Aurora Engine
 * - Dynamic Starfield with Multi-Layer Parallax & Warp Physics
 * - Scroll-Reactive Speed & Shifting Cosmic Nebula Colors
 * - Constellation Clustering at Footer
 * - Silk Scroll Reveals & Showpiece Photo Entrance
 * - Project Filter, Clipboard, and Contact System
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. INTERACTIVE GALAXY & SCROLL-REACTIVE STARFIELD
    // =========================================================================
    const canvas = document.getElementById('galaxyCanvas');
    const nebulaBackdrop = document.querySelector('.nebula-layer');

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = 0;
        let height = 0;
        let dpr = 1;

        // Starfield Configuration
        const STAR_COUNT = 220;
        let stars = [];
        
        // Physics & Scroll Reactivity State
        let targetSpeed = 0.45;
        let currentSpeed = 0.45;
        let scrollY = window.scrollY;
        let lastScrollY = window.scrollY;
        let scrollVelocity = 0;
        let maxScroll = 1;
        let scrollProgress = 0;

        // Nebula Color Stops across the journey
        // Top: Electric Cyan & Deep Violet
        // Middle: Cosmic Purple & Amethyst
        // Bottom: Bioluminescent Emerald & Cosmic Indigo
        const nebulaPalettes = [
            { c1: 'rgba(0, 242, 254, 0.22)', c2: 'rgba(107, 0, 255, 0.25)', c3: 'rgba(42, 245, 152, 0.12)', c4: 'rgba(107, 0, 255, 0.18)' }, // Hero
            { c1: 'rgba(107, 0, 255, 0.25)', c2: 'rgba(168, 85, 247, 0.24)', c3: 'rgba(0, 242, 254, 0.15)', c4: 'rgba(236, 72, 153, 0.15)' }, // Middle
            { c1: 'rgba(0, 255, 135, 0.20)', c2: 'rgba(107, 0, 255, 0.24)', c3: 'rgba(0, 242, 254, 0.18)', c4: 'rgba(42, 245, 152, 0.15)' }  // Bottom
        ];

        function resizeCanvas() {
            dpr = window.devicePixelRatio || 1;
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
            initStars();
        }

        class Star {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = Math.random() * width;
                this.y = initial ? Math.random() * height : -10;
                
                // 3 Depth Layers
                // Layer 1: distant tiny star (slow, faint)
                // Layer 2: mid-range twinkle star
                // Layer 3: bright foreground cosmic star
                const depthRand = Math.random();
                if (depthRand < 0.60) {
                    this.layer = 1;
                    this.baseSize = Math.random() * 0.8 + 0.5;
                    this.speedMult = 0.5;
                    this.baseAlpha = Math.random() * 0.4 + 0.2;
                    this.color = '#cbd5e1';
                } else if (depthRand < 0.90) {
                    this.layer = 2;
                    this.baseSize = Math.random() * 1.2 + 0.9;
                    this.speedMult = 1.0;
                    this.baseAlpha = Math.random() * 0.5 + 0.4;
                    this.color = Math.random() > 0.5 ? '#00F2FE' : '#c084fc';
                } else {
                    this.layer = 3;
                    this.baseSize = Math.random() * 1.8 + 1.4;
                    this.speedMult = 1.6;
                    this.baseAlpha = Math.random() * 0.4 + 0.6;
                    this.color = Math.random() > 0.6 ? '#00F2FE' : '#ffffff';
                }

                this.size = this.baseSize;
                this.alpha = this.baseAlpha;
                this.twinklePhase = Math.random() * Math.PI * 2;
                this.twinkleSpeed = Math.random() * 0.03 + 0.015;
            }

            update(globalSpeed, isWarping, isClustering) {
                // Move vertically with parallax speed multiplier
                const effectiveSpeed = globalSpeed * this.speedMult;
                this.y += effectiveSpeed;

                // Subtle lateral drift
                this.x += (Math.sin(this.twinklePhase) * 0.15) * this.speedMult;

                // Twinkle cycle
                this.twinklePhase += this.twinkleSpeed;
                this.alpha = this.baseAlpha + Math.sin(this.twinklePhase) * 0.25;
                if (this.alpha < 0.1) this.alpha = 0.1;
                if (this.alpha > 1) this.alpha = 1;

                // Wrap around edges
                if (this.y > height + 20) {
                    this.y = -10;
                    this.x = Math.random() * width;
                } else if (this.y < -20) {
                    this.y = height + 10;
                }

                if (this.x < -10) this.x = width + 5;
                if (this.x > width + 10) this.x = -5;
            }

            draw(streakLength, isClustering) {
                ctx.save();
                ctx.globalAlpha = this.alpha;

                // If warping in middle sections, draw a smooth star streak
                if (streakLength > 1.5 && this.layer >= 2) {
                    const grad = ctx.createLinearGradient(this.x, this.y, this.x, this.y - streakLength * this.speedMult);
                    grad.addColorStop(0, this.color);
                    grad.addColorStop(1, 'transparent');
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = this.size * 0.9;
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(this.x, this.y - streakLength * this.speedMult);
                    ctx.stroke();
                } else {
                    // Normal glowing star
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    if (this.layer === 3) {
                        ctx.shadowColor = this.color;
                        ctx.shadowBlur = isClustering ? 10 : 6;
                    }
                    ctx.fill();
                }
                ctx.restore();
            }
        }

        function initStars() {
            stars = [];
            for (let i = 0; i < STAR_COUNT; i++) {
                stars.push(new Star());
            }
        }

        // Draw Constellation Lines when clustered at footer
        function drawConstellations(clusterStrength) {
            if (clusterStrength <= 0.05) return;
            const maxConnectDist = 95 * clusterStrength;

            ctx.save();
            ctx.lineWidth = 0.6;

            for (let i = 0; i < stars.length; i++) {
                if (stars[i].layer < 2) continue;
                for (let j = i + 1; j < stars.length; j++) {
                    if (stars[j].layer < 2) continue;
                    const dx = stars[i].x - stars[j].x;
                    const dy = stars[i].y - stars[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxConnectDist) {
                        const alpha = (1 - dist / maxConnectDist) * 0.22 * clusterStrength;
                        ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(stars[i].x, stars[i].y);
                        ctx.lineTo(stars[j].x, stars[j].y);
                        ctx.stroke();
                    }
                }
            }
            ctx.restore();
        }

        // Scroll listener to compute scroll velocity & progress
        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
            maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
            scrollProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
            
            const delta = Math.abs(scrollY - lastScrollY);
            scrollVelocity = Math.min(delta * 0.15, 8);
            lastScrollY = scrollY;
        }, { passive: true });

        // Update Nebula Colors smoothly
        function updateNebulaColors(progress) {
            if (!nebulaBackdrop) return;

            let pIndex, t;
            if (progress < 0.5) {
                pIndex = 0;
                t = progress / 0.5;
            } else {
                pIndex = 1;
                t = (progress - 0.5) / 0.5;
            }

            const pA = nebulaPalettes[pIndex];
            const pB = nebulaPalettes[pIndex + 1] || nebulaPalettes[pIndex];

            // Set CSS variables for smooth background transition
            nebulaBackdrop.style.setProperty('--nebula-color-1', t < 0.5 ? pA.c1 : pB.c1);
            nebulaBackdrop.style.setProperty('--nebula-color-2', t < 0.5 ? pA.c2 : pB.c2);
            nebulaBackdrop.style.setProperty('--nebula-color-3', t < 0.5 ? pA.c3 : pB.c3);
            nebulaBackdrop.style.setProperty('--nebula-color-4', t < 0.5 ? pA.c4 : pB.c4);
        }

        // Animation Loop (60 FPS with lerped physics)
        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Determine scroll region states:
            // 1. Top (progress < 0.15): Calm slow stars
            // 2. Middle (0.15 <= progress < 0.85): Parallax warp streak
            // 3. Bottom (progress >= 0.85): Constellation cluster
            let baseSpeed = 0.4;
            let streakLength = 0;
            let clusterStrength = 0;

            if (scrollProgress < 0.15) {
                // Top: Calm drifting
                baseSpeed = 0.45;
                streakLength = scrollVelocity * 1.5;
            } else if (scrollProgress >= 0.15 && scrollProgress < 0.85) {
                // Middle: Faster warp speed & star streaks
                baseSpeed = 1.35 + scrollVelocity * 1.2;
                streakLength = Math.max(baseSpeed * 4.5, scrollVelocity * 3.5);
            } else {
                // Bottom: Slows down into constellation cluster
                const footerFactor = (scrollProgress - 0.85) / 0.15;
                baseSpeed = 0.35 * (1 - footerFactor * 0.5);
                clusterStrength = footerFactor;
            }

            // Smooth interpolation (lerp) of speed
            targetSpeed = baseSpeed + scrollVelocity * 0.6;
            currentSpeed += (targetSpeed - currentSpeed) * 0.08;

            // Decay scroll velocity smoothly
            scrollVelocity *= 0.92;
            if (scrollVelocity < 0.01) scrollVelocity = 0;

            // Render Stars
            const isWarping = streakLength > 2.0;
            const isClustering = clusterStrength > 0.1;

            for (let i = 0; i < stars.length; i++) {
                stars[i].update(currentSpeed, isWarping, isClustering);
                stars[i].draw(streakLength, isClustering);
            }

            // Draw Constellations at bottom
            drawConstellations(clusterStrength);

            // Update nebula colors
            updateNebulaColors(scrollProgress);

            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
    }


    // =========================================================================
    // 2. SIGNATURE PHOTO ENTRANCE (SLIDE IN + SCALE + GLOW TRIGGER)
    // =========================================================================
    const photoShowpiece = document.querySelector('.reveal-photo');
    if (photoShowpiece) {
        // Trigger photo reveal with cinematic delay after page load
        setTimeout(() => {
            photoShowpiece.classList.add('active');
        }, 300);
    }


    // =========================================================================
    // 3. SCROLL-TRIGGERED SECTION & TEXT REVEALS (IntersectionObserver)
    // =========================================================================
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('active'));
    }


    // =========================================================================
    // 4. PROJECT CATEGORY FILTERING
    // =========================================================================
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
                    card.style.transform = 'translateY(12px)';
                    setTimeout(() => { card.style.display = 'none'; }, 250);
                }
            });
        });
    });


    // =========================================================================
    // 5. TOAST NOTIFICATION & CLIPBOARD
    // =========================================================================
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

    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const emailDisplay = document.getElementById('emailDisplay');
    if (copyEmailBtn && emailDisplay) {
        copyEmailBtn.addEventListener('click', () => {
            const email = emailDisplay.innerText.trim();
            navigator.clipboard.writeText(email).then(() => {
                showToast(`Copied ${email} to clipboard!`);
            }).catch(() => { showToast('Email: ' + email); });
        });
    }


    // =========================================================================
    // 6. CONTACT FORM DISPATCH
    // =========================================================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('senderName')?.value || 'Guest';
            const email = document.getElementById('senderEmail')?.value || '';
            const subject = document.getElementById('senderSubject')?.value || 'Opportunity / Collaboration';
            const message = document.getElementById('senderMessage')?.value || '';
            const mailtoLink = `mailto:sawinkumar13@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
            window.location.href = mailtoLink;
            showToast('Opening default email client...');
            contactForm.reset();
        });
    }


    // =========================================================================
    // 7. MOBILE MENU TOGGLE
    // =========================================================================
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


    // =========================================================================
    // 8. NAVBAR SCROLL SPY & FROSTED BLUR ENHANCEMENT
    // =========================================================================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (!navbar) return;
        if (window.scrollY > 40) {
            navbar.style.borderBottomColor = 'rgba(0, 242, 254, 0.2)';
            navbar.style.backgroundColor = 'rgba(5, 5, 10, 0.88)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(107, 0, 255, 0.12)';
        } else {
            navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
            navbar.style.backgroundColor = 'rgba(5, 5, 10, 0.6)';
            navbar.style.boxShadow = 'none';
        }

        let currentId = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
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
    }, { passive: true });

});
