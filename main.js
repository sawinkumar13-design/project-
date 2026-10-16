/**
 * Sawin Kumar Portfolio — Interactive Luxury Galaxy, Cosmic Aurora & Pointer Engine
 * - Dynamic Starfield with Multi-Layer Parallax, Warp Physics & Pointer Interaction
 * - Ambient Trailing Cursor Spotlight & 3D Interactive Card Tilt
 * - Scroll-Reactive Speed & Shifting Cosmic Nebula Colors
 * - Constellation Clustering at Footer
 * - Scroll-Fill Hollow-to-Solid Section Typography
 * - Magnetic Primary CTA Button
 * - Sticky Stacking Project Filter & Contact System
 */

document.addEventListener('DOMContentLoaded', () => {

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    // =========================================================================
    // 1. POINTER POSITION STATE & SMOOTH LERP
    // =========================================================================
    let targetMouseX = window.innerWidth / 2;
    let targetMouseY = window.innerHeight / 2;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isMouseOnScreen = false;
    let spawnStardust = null;

    window.addEventListener('mousemove', (e) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
        if (!isMouseOnScreen) {
            isMouseOnScreen = true;
            const glow = document.getElementById('cursorGlow');
            if (glow) glow.style.opacity = '1';
        }
        if (!isTouchDevice && Math.random() > 0.45 && typeof spawnStardust === 'function') {
            spawnStardust(e.clientX, e.clientY);
        }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        isMouseOnScreen = false;
        const glow = document.getElementById('cursorGlow');
        if (glow) glow.style.opacity = '0';
    });


    // =========================================================================
    // 2. INTERACTIVE GALAXY & SCROLL-REACTIVE STARFIELD
    // =========================================================================
    const canvas = document.getElementById('galaxyCanvas');
    const nebulaBackdrop = document.querySelector('.nebula-layer');
    const auroraTrail = document.querySelector('.aurora-trail-left');
    const cursorGlow = document.getElementById('cursorGlow');

    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = 0;
        let height = 0;
        let dpr = 1;

        // Starfield Configuration
        const STAR_COUNT = 230;
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
                this.originX = this.x;
                
                // 3 Depth Layers
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

            update(globalSpeed, isWarping, isClustering, pointerX, pointerY) {
                // Move vertically with parallax speed multiplier
                const effectiveSpeed = globalSpeed * this.speedMult;
                this.y += effectiveSpeed;

                // Subtle lateral drift
                this.x += (Math.sin(this.twinklePhase) * 0.15) * this.speedMult;

                // Pointer Parallax Offset (3D Shift)
                if (!isTouchDevice) {
                    const centerOffsetX = (pointerX - width / 2) / (width / 2);
                    const centerOffsetY = (pointerY - height / 2) / (height / 2);
                    this.x += centerOffsetX * (this.layer * 0.35);
                    this.y += centerOffsetY * (this.layer * 0.2);

                    // Gentle pointer repel within radius
                    const dx = this.x - pointerX;
                    const dy = this.y - pointerY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const repelRadius = 120;
                    if (dist < repelRadius && dist > 1) {
                        const force = (1 - dist / repelRadius) * 1.8 * (this.layer * 0.6);
                        this.x += (dx / dist) * force;
                        this.y += (dy / dist) * force;
                    }
                }

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

        // =====================================================================
        // SHOOTING STARS & STARDUST ENGINE (COOL DYNAMIC COSMIC BACKGROUND)
        // =====================================================================
        class ShootingStar {
            constructor() {
                this.reset();
            }

            reset() {
                this.active = false;
                this.length = Math.random() * 85 + 75;
                this.speed = Math.random() * 12 + 15;
                this.size = Math.random() * 1.5 + 1.2;
                this.angle = (Math.PI / 180) * (Math.random() * 20 + 25);
                this.dx = Math.cos(this.angle) * this.speed;
                this.dy = Math.sin(this.angle) * this.speed;
                this.x = Math.random() * (width * 0.85);
                this.y = Math.random() * (height * 0.45) - 40;
                this.opacity = 1;
                this.trailColor = Math.random() > 0.4 ? '#00F2FE' : '#c084fc';
                this.life = 0;
                this.maxLife = Math.random() * 32 + 24;
            }

            spawn() {
                this.reset();
                this.active = true;
            }

            update() {
                if (!this.active) return;
                this.x += this.dx;
                this.y += this.dy;
                this.life++;
                this.opacity = Math.max(0, 1 - (this.life / this.maxLife));
                if (this.life >= this.maxLife || this.x > width + 100 || this.y > height + 100) {
                    this.active = false;
                }
            }

            draw() {
                if (!this.active || this.opacity <= 0) return;
                ctx.save();
                ctx.globalAlpha = this.opacity;
                const tailX = this.x - Math.cos(this.angle) * this.length;
                const tailY = this.y - Math.sin(this.angle) * this.length;
                const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
                grad.addColorStop(0, '#ffffff');
                grad.addColorStop(0.25, this.trailColor);
                grad.addColorStop(1, 'transparent');

                ctx.strokeStyle = grad;
                ctx.lineWidth = this.size;
                ctx.lineCap = 'round';
                ctx.shadowColor = this.trailColor;
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(tailX, tailY);
                ctx.stroke();

                // Glowing starhead
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 1.35, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        const shootingStars = [new ShootingStar(), new ShootingStar(), new ShootingStar()];
        let meteorCooldown = 0;

        // Interactive Pointer Stardust Particles
        const stardust = [];
        const MAX_STARDUST = 45;
        spawnStardust = function(px, py) {
            if (stardust.length > MAX_STARDUST) stardust.shift();
            stardust.push({
                x: px + (Math.random() - 0.5) * 14,
                y: py + (Math.random() - 0.5) * 14,
                size: Math.random() * 2 + 1,
                alpha: 0.9,
                color: Math.random() > 0.5 ? '#00F2FE' : '#c084fc',
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8 - 0.3
            });
        };

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

            nebulaBackdrop.style.setProperty('--nebula-color-1', t < 0.5 ? pA.c1 : pB.c1);
            nebulaBackdrop.style.setProperty('--nebula-color-2', t < 0.5 ? pA.c2 : pB.c2);
            nebulaBackdrop.style.setProperty('--nebula-color-3', t < 0.5 ? pA.c3 : pB.c3);
            nebulaBackdrop.style.setProperty('--nebula-color-4', t < 0.5 ? pA.c4 : pB.c4);
        }

        // Animation Loop (60 FPS with lerped physics, shooting stars & mouse parallax)
        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Lerp mouse coordinates
            mouseX += (targetMouseX - mouseX) * 0.08;
            mouseY += (targetMouseY - mouseY) * 0.08;

            // Update Trailing Ambient Cursor Spotlight
            if (cursorGlow && !isTouchDevice) {
                cursorGlow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate3d(-50%, -50%, 0)`;
            }

            // Sway Aurora Trail behind Photo slightly with mouse movement
            if (auroraTrail && !isTouchDevice) {
                const swayX = ((mouseX - width / 2) / width) * 20;
                const swayY = ((mouseY - height / 2) / height) * 15;
                auroraTrail.style.transform = `translate3d(${swayX}px, ${swayY}px, 0) scale(${1 + Math.abs(swayX) * 0.003})`;
            }

            // Determine scroll region states
            let baseSpeed = 0.4;
            let streakLength = 0;
            let clusterStrength = 0;

            if (scrollProgress < 0.15) {
                baseSpeed = 0.45;
                streakLength = scrollVelocity * 1.5;
            } else if (scrollProgress >= 0.15 && scrollProgress < 0.85) {
                baseSpeed = 1.35 + scrollVelocity * 1.2;
                streakLength = Math.max(baseSpeed * 4.5, scrollVelocity * 3.5);
            } else {
                const footerFactor = (scrollProgress - 0.85) / 0.15;
                baseSpeed = 0.35 * (1 - footerFactor * 0.5);
                clusterStrength = footerFactor;
            }

            targetSpeed = baseSpeed + scrollVelocity * 0.6;
            currentSpeed += (targetSpeed - currentSpeed) * 0.08;

            scrollVelocity *= 0.92;
            if (scrollVelocity < 0.01) scrollVelocity = 0;

            const isWarping = streakLength > 2.0;
            const isClustering = clusterStrength > 0.1;

            // 1. Draw Starfield
            for (let i = 0; i < stars.length; i++) {
                stars[i].update(currentSpeed, isWarping, isClustering, mouseX, mouseY);
                stars[i].draw(streakLength, isClustering);
            }

            // 2. Spawn, Update & Draw Shooting Stars (Cool Background Feature)
            meteorCooldown++;
            const spawnInterval = scrollVelocity > 1.8 ? 40 : 85;
            if (meteorCooldown > spawnInterval) {
                const inactiveStar = shootingStars.find(s => !s.active);
                if (inactiveStar) {
                    inactiveStar.spawn();
                    meteorCooldown = 0;
                }
            }

            for (let i = 0; i < shootingStars.length; i++) {
                shootingStars[i].update();
                shootingStars[i].draw();
            }

            // 3. Update & Draw Interactive Cursor Stardust
            for (let i = stardust.length - 1; i >= 0; i--) {
                const p = stardust[i];
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.016;
                if (p.alpha <= 0) {
                    stardust.splice(i, 1);
                    continue;
                }
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            drawConstellations(clusterStrength);
            updateNebulaColors(scrollProgress);
            updateAllSectionProps();

            requestAnimationFrame(animate);
        }

        // =========================================================================
        // 3D FLOATING CORNER PROPS ENGINE (FOR ALL SLIDES EXCEPT FIRST TWO)
        // =========================================================================
        const propSectionIds = ['education', 'skills', 'projects', 'achievements', 'contact'];
        const sectionPropsMap = [];

        propSectionIds.forEach(id => {
            const sectionEl = document.getElementById(id);
            if (!sectionEl) return;
            const props = sectionEl.querySelectorAll('.skill-prop, .section-prop');
            if (props.length === 0) return;

            const state = {
                section: sectionEl,
                props: props,
                targetNormX: 0,
                targetNormY: 0,
                normX: 0,
                normY: 0
            };

            // Pop-In Trigger via IntersectionObserver with bouncy entrance
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            props.forEach(prop => prop.classList.add('active'));
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.08 });
                observer.observe(sectionEl);
            } else {
                props.forEach(prop => prop.classList.add('active'));
            }

            // Mouse-Move listener over Section for 3D tilt
            if (!isTouchDevice) {
                sectionEl.addEventListener('mousemove', (e) => {
                    const rect = sectionEl.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    state.targetNormX = (e.clientX - centerX) / (rect.width / 2);
                    state.targetNormY = (e.clientY - centerY) / (rect.height / 2);
                }, { passive: true });

                sectionEl.addEventListener('mouseleave', () => {
                    state.targetNormX = 0;
                    state.targetNormY = 0;
                });
            }

            sectionPropsMap.push(state);
        });

        function updateAllSectionProps() {
            if (sectionPropsMap.length === 0) return;

            sectionPropsMap.forEach(item => {
                const rect = item.section.getBoundingClientRect();
                const inView = rect.top < window.innerHeight + 120 && rect.bottom > -120;
                if (!inView) return;

                // Smooth lerp mouse coordinates
                item.normX += (item.targetNormX - item.normX) * 0.08;
                item.normY += (item.targetNormY - item.normY) * 0.08;

                // Compute vertical scroll parallax factor relative to viewport center
                const centerOffset = (rect.top + rect.height / 2 - window.innerHeight / 2) / (window.innerHeight / 2);

                item.props.forEach(prop => {
                    if (!prop.classList.contains('active')) return;
                    const parallaxLayer = prop.querySelector('.skill-prop-parallax, .prop-parallax');
                    if (!parallaxLayer) return;

                    const speed = parseFloat(parallaxLayer.getAttribute('data-speed') || '0.25');
                    const depth = parseFloat(parallaxLayer.getAttribute('data-depth') || '1.0');

                    // Parallax shifts vertically opposite to scroll
                    const scrollYOffset = centerOffset * -42 * speed;

                    // Pointer shifts and 3D tilts opposite to cursor
                    const mouseXOffset = item.normX * -24 * depth;
                    const mouseYOffset = item.normY * -18 * depth;
                    const rotX = item.normY * 12 * depth;
                    const rotY = item.normX * -12 * depth;

                    parallaxLayer.style.transform = `translate3d(${mouseXOffset.toFixed(1)}px, ${(scrollYOffset + mouseYOffset).toFixed(1)}px, 0) perspective(700px) rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg)`;
                });
            });
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
    }


    // =========================================================================
    // 3. DYNAMIC GLASS BORDER GLARE & 3D PERSPECTIVE TILT
    // =========================================================================
    if (!isTouchDevice) {
        const tiltCards = document.querySelectorAll('.glossy-card, .photo-rectangular-card');

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const percentX = Math.round((x / rect.width) * 100);
                const percentY = Math.round((y / rect.height) * 100);

                // Set CSS variables for cursor tracking glare
                card.style.setProperty('--mouse-x', `${percentX}%`);
                card.style.setProperty('--mouse-y', `${percentY}%`);

                // Compute subtle 3D tilt angles
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const tiltX = ((y - centerY) / centerY) * -5.5;
                const tiltY = ((x - centerX) / centerX) * 5.5;

                card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.012, 1.012, 1.012)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                card.style.setProperty('--mouse-x', `50%`);
                card.style.setProperty('--mouse-y', `50%`);
            });
        });
    }


    // =========================================================================
    // 4. MAGNETIC PRIMARY CTA BUTTON
    // =========================================================================
    if (!isTouchDevice) {
        const magneticBtns = document.querySelectorAll('.magnetic-btn');

        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - (rect.left + rect.width / 2);
                const y = e.clientY - (rect.top + rect.height / 2);
                btn.style.transform = `translate3d(${x * 0.28}px, ${y * 0.28}px, 0) scale(1.03)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate3d(0, 0, 0) scale(1)';
            });
        });
    }


    // =========================================================================
    // 5. SIGNATURE PHOTO ENTRANCE (SLIDE IN + SCALE + GLOW TRIGGER)
    // =========================================================================
    const photoShowpiece = document.querySelector('.reveal-photo');
    if (photoShowpiece) {
        setTimeout(() => {
            photoShowpiece.classList.add('active');
        }, 300);
    }


    // =========================================================================
    // 6. SCROLL-FILL HOLLOW-TO-SOLID SECTION TYPOGRAPHY & REVEALS
    // =========================================================================
    const scrollFillTitles = document.querySelectorAll('.scroll-fill-title');
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        // Section Header Scroll-Fill Observer
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scroll-fill-active');
                } else {
                    // Optional: remove if you want re-hollow on scroll up
                    // entry.target.classList.remove('scroll-fill-active');
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

        scrollFillTitles.forEach(title => titleObserver.observe(title));

        // General Card & Text Reveal Observer
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        scrollFillTitles.forEach(title => title.classList.add('scroll-fill-active'));
        revealElements.forEach(el => el.classList.add('active'));
    }


    // =========================================================================
    // 7. PROJECT CATEGORY FILTERING (STICKY CARDS COMPATIBLE)
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
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(12px)';
                    setTimeout(() => { card.style.display = 'none'; }, 220);
                }
            });
        });
    });


    // =========================================================================
    // 8. TOAST NOTIFICATION & CLIPBOARD
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
    // 9. CONTACT FORM DISPATCH
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
    // 10. MOBILE MENU TOGGLE
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
    // 11. NAVBAR SCROLL SPY & BLUR ENHANCEMENT
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
            const top = sec.offsetTop - 140;
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
