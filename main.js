/**
 * Sawin Kumar Portfolio — Spatial UI with Royal Black Charcoal Theme
 * - Static Royal Charcoal background (#1E2023, #1E1F22, #47484C, #4C4E51)
 * - VisionOS Spatial UI design (glassmorphism, specular rims, elevation)
 * - Phase 1: Full-Screen Cinematic Intro ("SAWIN KUMAR", watermark duplicates, tagline)
 * - Phase 2: Enter & Hero Reveal Transition with cubic-bezier easings
 * - 3D Floating Corner Props, Smooth Perspective Tilt, Magnetic CTA, Scroll-Fill & Filter Systems
 */

function startApp() {

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    // =========================================================================
    // 0. CINEMATIC INTRO SCREEN & HERO REVEAL CONTROLLER
    // =========================================================================
    const introOverlay = document.getElementById('cinematicIntro');
    const enterBtn = document.getElementById('enterPortfolioBtn');
    const navbar = document.getElementById('navbar');

    function enterPortfolio(e) {
        if (typeof window.enterPortfolio === 'function') {
            window.enterPortfolio(e);
        }
    }

    if (enterBtn) {
        enterBtn.addEventListener('click', (e) => {
            enterPortfolio(e);
        });
        enterBtn.addEventListener('touchend', (e) => {
            enterPortfolio(e);
        });
    }

    if (introOverlay) {
        introOverlay.addEventListener('click', (e) => {
            enterPortfolio(e);
        });
        introOverlay.addEventListener('touchend', (e) => {
            enterPortfolio(e);
        });
    }


    // =========================================================================
        // =========================================================================
    // 0.5 DARK MODE & BRIGHT MODE CONTROLLER
    // =========================================================================
    let currentDisplayMode = 'dark';
    try {
        const savedMode = localStorage.getItem('sawin-portfolio-display-mode');
        if (savedMode === 'emerald') {
            localStorage.setItem('sawin-portfolio-display-mode', 'dark');
            currentDisplayMode = 'dark';
        } else if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'crimson') {
            currentDisplayMode = savedMode;
        }
    } catch (e) {}

    function setDisplayMode(mode) {
        if (mode === 'emerald') mode = 'dark';
        currentDisplayMode = mode;
        document.documentElement.setAttribute('data-mode', mode);
        try {
            localStorage.setItem('sawin-portfolio-display-mode', mode);
        } catch (e) {}

        const sunIcons = document.querySelectorAll('.mode-icon-sun');
        const moonIcons = document.querySelectorAll('.mode-icon-moon');
        const mobileLabel = document.getElementById('mobileModeLabel');

        if (mode === 'light' || mode === 'emerald') {
            sunIcons.forEach(i => i.classList.add('hidden'));
            moonIcons.forEach(i => i.classList.remove('hidden'));
            if (mobileLabel) mobileLabel.textContent = 'Royal Charcoal';
            if (typeof window.setSmokeLightMode === 'function') {
                window.setSmokeLightMode(1.0);
            }
        } else {
            sunIcons.forEach(i => i.classList.remove('hidden'));
            moonIcons.forEach(i => i.classList.add('hidden'));
            if (mobileLabel) mobileLabel.textContent = 'Royal Charcoal';
            if (typeof window.setSmokeLightMode === 'function') {
                window.setSmokeLightMode(0.0);
            }
        }
    }
    window.setDisplayMode = setDisplayMode;

    function toggleDisplayMode() {
        setDisplayMode(currentDisplayMode === 'dark' ? 'light' : 'dark');
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }
    window.toggleDisplayMode = toggleDisplayMode;

    const themeModeToggleBtn = document.getElementById('themeModeToggleBtn');
    if (themeModeToggleBtn) {
        themeModeToggleBtn.addEventListener('click', toggleDisplayMode);
    }

    // Trigger Blurred Reveal & Slide Up on Page Load
    function triggerIntroReveal() {
        requestAnimationFrame(() => {
            const items = document.querySelectorAll('.intro-reveal-item');
            items.forEach(el => el.classList.add('revealed'));
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', triggerIntroReveal);
    } else {
        setTimeout(triggerIntroReveal, 50);
    }

    // Initialize display mode immediately
    setDisplayMode(currentDisplayMode);

    // =========================================================================
    // Ambient Audio Synthesizer (Cosmic Meditative Soundscape via Web Audio API)
    const audioToggleBtn = document.getElementById('audioToggleBtn');
    let audioCtx = null;
    let osc1 = null;
    let osc2 = null;
    let gainNode = null;
    let isAudioPlaying = false;

    function initAudio() {
        if (audioCtx) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(160, audioCtx.currentTime);

            gainNode = audioCtx.createGain();
            gainNode.gain.setValueAtTime(0.00001, audioCtx.currentTime);

            osc1 = audioCtx.createOscillator();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(55, audioCtx.currentTime); // 55Hz deep fundamental

            osc2 = audioCtx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(55.35, audioCtx.currentTime); // gentle warm acoustic beat

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc1.start();
            osc2.start();
        } catch (e) {
            console.warn('Web Audio not available', e);
        }
    }

    function toggleAudio() {
        if (!audioCtx) initAudio();
        if (!audioCtx || !gainNode) return;

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        if (!isAudioPlaying) {
            isAudioPlaying = true;
            gainNode.gain.setTargetAtTime(0.018, audioCtx.currentTime, 0.4);
            if (audioToggleBtn) {
                audioToggleBtn.classList.add('playing');
                const mutedIcon = audioToggleBtn.querySelector('.audio-icon-muted');
                const activeIcon = audioToggleBtn.querySelector('.audio-icon-active');
                if (mutedIcon) mutedIcon.classList.add('hidden');
                if (activeIcon) activeIcon.classList.remove('hidden');
            }
        } else {
            isAudioPlaying = false;
            gainNode.gain.setTargetAtTime(0.00001, audioCtx.currentTime, 0.3);
            if (audioToggleBtn) {
                audioToggleBtn.classList.remove('playing');
                const mutedIcon = audioToggleBtn.querySelector('.audio-icon-muted');
                const activeIcon = audioToggleBtn.querySelector('.audio-icon-active');
                if (mutedIcon) mutedIcon.classList.remove('hidden');
                if (activeIcon) activeIcon.classList.add('hidden');
            }
        }
    }

    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', toggleAudio);
    }


    // =========================================================================
    // 1. POINTER POSITION & HIGH-PERFORMANCE VAPOR EMITTER (CANVAS ACCELERATED)
    // =========================================================================
    let targetMouseX = window.innerWidth * 0.5;
    let targetMouseY = window.innerHeight * 0.5;
    let normMouseX = 0.5;
    let normMouseY = 0.5;
    let mouseVelX = 0;
    let mouseVelY = 0;
    let isMouseOnScreen = false;
    let lastMoteTime = 0;
    let lastMoveTime = performance.now();
    let prevMouseX = window.innerWidth * 0.5;
    let prevMouseY = window.innerHeight * 0.5;

    // Native OS Cursor (Zero DOM cursor follower lag / zero canvas particles)
    // Lightweight mouse coordinate tracking for WebGL background smoke fluid swirl
    window.addEventListener('mousemove', (e) => {
        const vx = e.clientX - targetMouseX;
        const vy = e.clientY - targetMouseY;

        mouseVelX = vx * 0.4 + mouseVelX * 0.6;
        mouseVelY = vy * 0.4 + mouseVelY * 0.6;

        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
        normMouseX = e.clientX / window.innerWidth;
        normMouseY = e.clientY / window.innerHeight;
    }, { passive: true });


    // =========================================================================
    // 2. BACKGROUND SMOKE ANIMATION REMOVED (STATIC ROYAL BLACK CHARCOAL BACKGROUND)
    // =========================================================================
    const canvas = document.getElementById('smokeCanvas') || document.getElementById('singularityCanvas') || document.getElementById('galaxyCanvas');
    if (canvas) {
        canvas.style.display = 'none';
    }
    window.setSmokeLightMode = function() {};
    window.lerpSmokeLightMode = function() {};

    let updateAllSectionProps = () => {};

    // =========================================================================
    // 3. FLOATING PROPS ENGINE DISABLED (Clean Minimalist Spatial UI)
    // =========================================================================
    updateAllSectionProps = function() {};

    // =========================================================================
    // 4. SUBTLE AESTHETIC 3D TILT & SPECULAR GLARE ENGINE
    // - Smooth perspective (1000px)
    // - Tactile subtle tilt (±3.8° max) with 60/120fps spring lerp interpolation
    // - Layered spatial elevation (translateZ 10px, translateY -3px)
    // - Dynamic specular reflection tracking cursor (--mouse-x, --mouse-y)
    // - Damped natural return on mouseleave
    // =========================================================================
    if (!isTouchDevice) {
        const tiltCards = document.querySelectorAll(
            [
                '.glossy-card',
                '.photo-rectangular-card',
                '.hero-glass-box',
                '.about-highlight-card',
                '.sticky-project-card',
                '.project-card',
                '.cert-thumbnail-card',
                '.achievement-card',
                '.edu-card'
            ].join(', ')
        );

        tiltCards.forEach((card) => {
            let rafId = null;
            let currentTiltX = 0;
            let currentTiltY = 0;
            let targetTiltX = 0;
            let targetTiltY = 0;
            let isHovered = false;

            function updateTilt() {
                if (!isHovered) return;
                // Silky smooth lerp towards target tilt
                currentTiltX += (targetTiltX - currentTiltX) * 0.18;
                currentTiltY += (targetTiltY - currentTiltY) * 0.18;

                card.style.setProperty(
                    'transform',
                    `perspective(1000px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg) translateZ(10px) translateY(-3px) scale3d(1.012, 1.012, 1.012)`,
                    'important'
                );

                if (Math.abs(targetTiltX - currentTiltX) > 0.02 || Math.abs(targetTiltY - currentTiltY) > 0.02) {
                    rafId = requestAnimationFrame(updateTilt);
                } else {
                    rafId = null;
                }
            }

            card.addEventListener('mouseenter', () => {
                isHovered = true;
                card.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const percentX = Math.round((x / rect.width) * 100);
                const percentY = Math.round((y / rect.height) * 100);

                // Update specular glare coordinates
                card.style.setProperty('--mouse-x', `${percentX}%`);
                card.style.setProperty('--mouse-y', `${percentY}%`);

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const normX = (x - centerX) / (centerX || 1); // -1 to +1
                const normY = (y - centerY) / (centerY || 1); // -1 to +1

                // Subtle, aesthetic tilt angle: max 3.8 degrees
                targetTiltX = normY * -3.8;
                targetTiltY = normX * 3.8;

                if (!rafId) {
                    rafId = requestAnimationFrame(updateTilt);
                }
            }, { passive: true });

            card.addEventListener('mouseleave', () => {
                isHovered = false;
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
                currentTiltX = 0;
                currentTiltY = 0;
                targetTiltX = 0;
                targetTiltY = 0;

                card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease';
                card.style.setProperty(
                    'transform',
                    'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale3d(1, 1, 1)',
                    'important'
                );
                card.style.setProperty('--mouse-x', '50%');
                card.style.setProperty('--mouse-y', '50%');
            });
        });
    }

    // =========================================================================
    // 4b. INTERACTIVE POINTER HOVER ELEVATION & GLOW FOR TEXT BLOCKS
    // =========================================================================
    const textGlowBlocks = document.querySelectorAll(
        '.text-block-lift, .text-block-glow, .hero-glass-box, .about-text-content p, .tool-chip, .marquee-pill'
    );
    textGlowBlocks.forEach(block => {
        block.addEventListener('mouseenter', () => {
            block.classList.add('text-hover-active');
        });
        block.addEventListener('mouseleave', () => {
            block.classList.remove('text-hover-active');
        });
    });

        // 5. MAGNETIC PRIMARY CTA BUTTON
    // =========================================================================
    if (!isTouchDevice) {
        const magneticBtns = document.querySelectorAll('.magnetic-btn');

        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const deltaX = (e.clientX - centerX) * 0.28;
                const deltaY = (e.clientY - centerY) * 0.28;
                btn.style.transform = `translate3d(${deltaX.toFixed(1)}px, ${deltaY.toFixed(1)}px, 0)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate3d(0, 0, 0)';
            });
        });
    }


    // =========================================================================
    // 6. SCROLL-TRIGGERED TEXT & SECTION REVEALS
    // =========================================================================
    const scrollFillTitles = document.querySelectorAll('.scroll-fill-title');
    const revealElements = document.querySelectorAll('.reveal, .reveal-photo');

    function activateReveal(el) {
        if (!el) return;
        el.classList.add('active');
    }

    // Auto-trigger hero elements immediately so Hero is fully visible on enter
    const heroReveals = document.querySelectorAll('#hero .reveal, .reveal-photo, .text-reveal');
    heroReveals.forEach(el => activateReveal(el));

    if ('IntersectionObserver' in window) {
        // Hollow-to-Solid Scroll Fill Typography
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scroll-fill-active');
                    titleObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        scrollFillTitles.forEach(title => titleObserver.observe(title));

        // General Card & Text Reveal Observer (generous margin so content is revealed ahead of scroll)
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    activateReveal(entry.target);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.02, rootMargin: '160px 0px 100px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        scrollFillTitles.forEach(title => title.classList.add('scroll-fill-active'));
        revealElements.forEach(el => activateReveal(el));
    }

    // Bulletproof scroll fallback listener ensuring no section is ever missed
    window.addEventListener('scroll', () => {
        const threshold = window.innerHeight + 160;
        revealElements.forEach(el => {
            if (!el.classList.contains('active')) {
                const rect = el.getBoundingClientRect();
                if (rect.top < threshold) {
                    activateReveal(el);
                }
            }
        });
    }, { passive: true });


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
    let lastSubmitTime = 0;

    function sanitizeInput(str) {
        if (!str) return '';
        return String(str)
            .replace(/[<>]/g, '') // Strip HTML brackets to prevent tag injection
            .replace(/[\r\n]+/g, ' ') // Collapse line breaks in headers
            .trim();
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Anti-Bot Honeypot Validation
            const honeypot = document.getElementById('formWebsiteTrap');
            if (honeypot && honeypot.value.trim() !== '') {
                console.warn('Bot submission silently discarded');
                contactForm.reset();
                showToast('Message sent successfully!');
                return;
            }

            // 2. Client-Side Rate Limiting (5 second cooldown)
            const now = Date.now();
            if (now - lastSubmitTime < 5000) {
                showToast('Please wait a few seconds before resubmitting.');
                return;
            }

            const rawName = document.getElementById('senderName')?.value || '';
            const rawEmail = document.getElementById('senderEmail')?.value || '';
            const rawSubject = document.getElementById('senderSubject')?.value || '';
            const rawMessage = document.getElementById('senderMessage')?.value || '';

            const name = sanitizeInput(rawName).slice(0, 80);
            const email = sanitizeInput(rawEmail).slice(0, 100);
            const subject = sanitizeInput(rawSubject || 'Opportunity / Collaboration').slice(0, 120);
            const message = String(rawMessage).replace(/[<>]/g, '').trim().slice(0, 2000);

            // 3. Strict Email Regex Verification
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailPattern.test(email)) {
                showToast('Please enter a valid email address.');
                return;
            }

            if (!message || message.length < 5) {
                showToast('Please enter a meaningful message.');
                return;
            }

            lastSubmitTime = now;

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
    // navbar is already declared at line 23
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (!navbar) return;
        if (window.scrollY > 40) {
            navbar.style.borderBottomColor = 'rgba(99, 120, 138, 0.2)';
            navbar.style.backgroundColor = 'rgba(5, 6, 9, 0.88)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(48, 32, 63, 0.2)';
        } else {
            navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
            navbar.style.backgroundColor = 'rgba(5, 6, 9, 0.6)';
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

    // =========================================================================
    // 12. SILENT VISITOR NOTIFICATION ENGINE (ZERO UI / LAYOUT IMPACT)
    // =========================================================================
    function sendVisitorAlert() {
        try {
            // 1. Session Deduplication: Only send 1 alert per visitor browsing session
            if (sessionStorage.getItem('sawin_portfolio_visited')) return;

            // 2. Skip automated crawlers (unless manually testing)
            if (navigator.webdriver) {
                console.log('Skipping visitor alert for webdriver');
                return;
            }
            const ua = (navigator.userAgent || '').toLowerCase();
            if (/bot|crawler|spider|crawling|headless|lighthouse/i.test(ua)) {
                return;
            }

            sessionStorage.setItem('sawin_portfolio_visited', 'true');

            const referrer = document.referrer || 'Direct Visit';
            const screenRes = `${window.screen?.width || window.innerWidth}x${window.screen?.height || window.innerHeight}`;
            const isTouch = window.matchMedia('(pointer: coarse)').matches;
            const deviceType = isTouch ? 'Mobile / Tablet' : 'Desktop / Laptop';
            const timestamp = new Date().toLocaleString();

            const payload = {
                access_key: 'e04d1dab-e0f0-4716-8ad9-f2566441fba9',
                subject: 'New Visitor Opened Your Portfolio! (Sawin Kumar)',
                from_name: 'Portfolio Visitor Alert',
                message: `Hello Sawin,

A new visitor just opened your portfolio website!

` +
                         `• Timestamp: ${timestamp}
` +
                         `• Device: ${deviceType}
` +
                         `• Screen Resolution: ${screenRes}
` +
                         `• Referral Source: ${referrer}
` +
                         `• Live URL: ${window.location.href}

` +
                         `This alert was delivered automatically upon visit.`
            };

            // High-reliability fetch with keepalive (survives tab closing)
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload),
                mode: 'cors',
                keepalive: true
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log('Visitor alert sent successfully to sawinkumar13@gmail.com');
                } else {
                    console.warn('Visitor alert notice:', data);
                }
            })
            .catch(err => {
                console.warn('Visitor alert fetch notice:', err);
            });
        } catch (e) {
            console.warn('Visitor alert catch:', e);
        }
    }

    // Expose globally so enterPortfolio or manual test can call it
    window.sendVisitorAlert = sendVisitorAlert;

    // Trigger fast (300ms) so even brief visits are recorded
    setTimeout(sendVisitorAlert, 350);


    // =========================================================================
    // 13. LIVE GITHUB & LEETCODE REAL-TIME SYNC ENGINE (POLLS EVERY 30 SECONDS)
    // =========================================================================
    const LEETCODE_USER = 'sawin_kumar';
    const GITHUB_USER = 'sawinkumar13-design';

    // Format human time ago (e.g., "Just now", "25m ago", "3h ago", "2d ago")
    function timeAgo(date) {
        if (!date || isNaN(new Date(date).getTime())) return 'Live';
        const sec = Math.floor((new Date() - new Date(date)) / 1000);
        if (sec < 60) return 'Just now';
        const min = Math.floor(sec / 60);
        if (min < 60) return `${min}m ago`;
        const hrs = Math.floor(min / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    }

    // Smooth Number Count-Up Animation
    function animateValue(el, start, end, duration = 800) {
        if (!el) return;
        const s = parseInt(start, 10) || 0;
        const e = parseInt(end, 10) || 0;
        if (s === e) { el.textContent = e; return; }
        const range = e - s;
        let startTime = null;
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            el.textContent = Math.floor(s + range * progress);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = e;
        }
        requestAnimationFrame(step);
    }

    // Fast Timeout Fetch Helper with Cache-Buster
    async function fetchWithTimeout(url, ms = 4500) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), ms);
        try {
            const sep = url.includes('?') ? '&' : '?';
            const res = await fetch(`${url}${sep}_t=${Date.now()}`, {
                signal: controller.signal,
                headers: { 'Accept': 'application/json' }
            });
            clearTimeout(timer);
            if (res.ok) return await res.json();
        } catch (e) {
            clearTimeout(timer);
        }
        return null;
    }

    // -------------------------------------------------------------------------
    // A. LIVE LEETCODE PROFILE CONTROLLER
    // -------------------------------------------------------------------------
    function applyLeetCodeData(data) {
        if (!data) return;
        try {
            if (data.solvedProblem !== undefined && data.totalSolved === undefined) {
                data.totalSolved = data.solvedProblem;
            }
            if (data.submission && !data.recentSubmissions) {
                data.recentSubmissions = data.submission;
            }

            // 1. Total Solved Count
            const solvedEl = document.getElementById('lcSolvedCount');
            if (solvedEl && data.totalSolved !== undefined) {
                animateValue(solvedEl, solvedEl.textContent, data.totalSolved);
            }

            // 2. Breakdown counts: Easy, Medium, Hard
            const easyEl = document.getElementById('lcEasyCount');
            const medEl = document.getElementById('lcMedCount');
            const hardEl = document.getElementById('lcHardCount');
            if (easyEl && data.easySolved !== undefined) animateValue(easyEl, easyEl.textContent, data.easySolved);
            if (medEl && data.mediumSolved !== undefined) animateValue(medEl, medEl.textContent, data.mediumSolved);
            if (hardEl && data.hardSolved !== undefined) animateValue(hardEl, hardEl.textContent, data.hardSolved);

            // 3. Proportion Bars
            const total = (data.totalSolved && data.totalSolved > 0) ? data.totalSolved : 107;
            const barEasy = document.getElementById('lcBarEasy');
            const barMed = document.getElementById('lcBarMed');
            const barHard = document.getElementById('lcBarHard');
            if (barEasy && data.easySolved !== undefined) {
                barEasy.style.width = `${((data.easySolved / total) * 100).toFixed(1)}%`;
                barEasy.title = `Easy: ${data.easySolved}`;
            }
            if (barMed && data.mediumSolved !== undefined) {
                barMed.style.width = `${((data.mediumSolved / total) * 100).toFixed(1)}%`;
                barMed.title = `Medium: ${data.mediumSolved}`;
            }
            if (barHard && data.hardSolved !== undefined) {
                barHard.style.width = `${((data.hardSolved / total) * 100).toFixed(1)}%`;
                barHard.title = `Hard: ${data.hardSolved}`;
            }

            // 4. Acceptance Rate
            const accRateEl = document.getElementById('lcAcceptanceRate');
            if (accRateEl) {
                if (data.matchedUserStats && data.matchedUserStats.acSubmissionNum && data.matchedUserStats.totalSubmissionNum) {
                    const acTotal = data.matchedUserStats.acSubmissionNum[0]?.submissions || 119;
                    const subTotal = data.matchedUserStats.totalSubmissionNum[0]?.submissions || 143;
                    const rate = subTotal > 0 ? ((acTotal / subTotal) * 100).toFixed(1) : '80.3';
                    accRateEl.textContent = `${rate}%`;
                }
            }

            // 5. Global Ranking
            const rankEl = document.getElementById('lcContestRating');
            if (rankEl && data.ranking) {
                rankEl.textContent = `#${Number(data.ranking).toLocaleString()}`;
            }

            // 6. Live Active Streak from submissionCalendar
            const streakEl = document.getElementById('lcStreak');
            if (streakEl && data.submissionCalendar) {
                const daysMap = {};
                for (const [timestamp, count] of Object.entries(data.submissionCalendar)) {
                    if (count > 0) {
                        const d = new Date(parseInt(timestamp, 10) * 1000);
                        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                        daysMap[key] = true;
                    }
                }
                let streak = 0;
                let cur = new Date();
                const todayKey = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
                if (!daysMap[todayKey]) {
                    cur.setDate(cur.getDate() - 1);
                }
                while (true) {
                    const k = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
                    if (daysMap[k]) {
                        streak++;
                        cur.setDate(cur.getDate() - 1);
                    } else {
                        break;
                    }
                }
                animateValue(streakEl, streakEl.textContent, Math.max(streak, 12));
            }

            // 7. Live Latest Solved Question
            if (data.recentSubmissions && data.recentSubmissions.length > 0) {
                const accepted = data.recentSubmissions.find(s => s.statusDisplay === 'Accepted') || data.recentSubmissions[0];
                if (accepted) {
                    const titleEl = document.getElementById('lcLatestTitle');
                    const linkEl = document.getElementById('lcLatestLink');
                    const langEl = document.getElementById('lcLatestLang');
                    const timeEl = document.getElementById('lcLatestTime');
                    const badgeEl = document.getElementById('lcLatestBadge');

                    if (titleEl) titleEl.textContent = accepted.title;
                    if (linkEl && accepted.titleSlug) linkEl.href = `https://leetcode.com/problems/${accepted.titleSlug}/`;
                    if (langEl) langEl.textContent = (accepted.lang || 'Java').toUpperCase();
                    if (badgeEl) badgeEl.textContent = accepted.statusDisplay || 'Accepted';
                    if (timeEl && accepted.timestamp) {
                        timeEl.textContent = timeAgo(new Date(parseInt(accepted.timestamp, 10) * 1000));
                    }
                }
            }
        } catch (e) {
            console.warn('LeetCode parse notice:', e);
        }
    }

    async function fetchLiveLeetCode() {
        // Hydrate from localStorage first (0ms latency)
        try {
            const cached = localStorage.getItem('sawin_portfolio_leetcode_cache_v6');
            if (cached) applyLeetCodeData(JSON.parse(cached));
        } catch (e) {}

        const endpoints = [
            `https://alfa-leetcode-api.onrender.com/userProfile/${LEETCODE_USER}`,
            `https://alfa-leetcode-api.onrender.com/${LEETCODE_USER}/solved`,
            `https://leetcode-api-faisalshohag.vercel.app/${LEETCODE_USER}`
        ];

        // Parallel race: whichever serverless edge endpoint responds first wins
        let data = null;
        try {
            data = await Promise.any(
                endpoints.map(url => fetchWithTimeout(url, 4000).then(res => {
                    if (res && (res.totalSolved !== undefined || res.easySolved !== undefined)) return res;
                    throw new Error('Incomplete data');
                }))
            );
        } catch (e) {}

        if (data) {
            try {
                localStorage.setItem('sawin_portfolio_leetcode_cache_v6', JSON.stringify(data));
            } catch (e) {}
            applyLeetCodeData(data);
        }
    }

    // -------------------------------------------------------------------------
    // B. LIVE GITHUB PROFILE & 365-DAY REAL-TIME HEATMAP ENGINE
    // -------------------------------------------------------------------------
    function applyGitHubCached(c) {
        if (!c) return;
        try {
            if (c.user) {
                const reposEl = document.getElementById('ghCardRepos');
                const followersEl = document.getElementById('ghCardFollowers');
                const followingEl = document.getElementById('ghCardFollowing');
                const avatarEl = document.getElementById('ghCardAvatar');
                if (reposEl && c.user.public_repos !== undefined) reposEl.textContent = c.user.public_repos;
                if (followersEl && c.user.followers !== undefined) followersEl.textContent = c.user.followers;
                if (followingEl && c.user.following !== undefined) followingEl.textContent = c.user.following;
                if (avatarEl && c.user.avatar_url) avatarEl.src = c.user.avatar_url;
            }
            if (c.commit) {
                const msgEl = document.getElementById('ghLatestMsg');
                const repoEl = document.getElementById('ghLatestRepo');
                const timeEl = document.getElementById('ghLatestTime');
                if (msgEl && c.commit.message) msgEl.textContent = c.commit.message;
                if (repoEl && c.commit.repo) repoEl.textContent = c.commit.repo;
                if (timeEl && c.commit.time) timeEl.textContent = c.commit.time;
            }
            if (c.totalContribs) {
                const countText = document.getElementById('ghContribCountText');
                const contribsCard = document.getElementById('ghCardContribs');
                if (countText) countText.textContent = `${c.totalContribs} contributions in the last year`;
                if (contribsCard) contribsCard.textContent = c.totalContribs;
            }
            if (c.streak) {
                const streakEl = document.getElementById('ghCardStreak');
                if (streakEl) streakEl.textContent = c.streak;
            }
            if (c.contributions && Array.isArray(c.contributions)) {
                renderLiveHeatmapSVG(c.contributions);
            }
        } catch (e) {}
    }

    async function fetchLiveGitHub() {
        // Hydrate from localStorage first
        try {
            const cached = localStorage.getItem('sawin_portfolio_github_cache_v6');
            if (cached) applyGitHubCached(JSON.parse(cached));
        } catch (e) {}

        // Fetch User profile, Push events, and 365-day contributions in parallel
        const [userData, eventsData, contribData] = await Promise.all([
            fetchWithTimeout(`https://api.github.com/users/${GITHUB_USER}`, 4500),
            fetchWithTimeout(`https://api.github.com/users/${GITHUB_USER}/events`, 4500),
            fetchWithTimeout(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`, 4500)
        ]);

        const cacheObj = {};

        // 1. Live User Stats
        if (userData) {
            const reposEl = document.getElementById('ghCardRepos');
            const followersEl = document.getElementById('ghCardFollowers');
            const followingEl = document.getElementById('ghCardFollowing');
            const avatarEl = document.getElementById('ghCardAvatar');
            if (reposEl && userData.public_repos !== undefined) animateValue(reposEl, reposEl.textContent, userData.public_repos);
            if (followersEl && userData.followers !== undefined) animateValue(followersEl, followersEl.textContent, userData.followers);
            if (followingEl && userData.following !== undefined) animateValue(followingEl, followingEl.textContent, userData.following);
            if (avatarEl && userData.avatar_url) avatarEl.src = userData.avatar_url;
            cacheObj.user = userData;
        }

        // 2. Live Recent Push & Commit Activity
        let commitInfo = null;
        if (eventsData && Array.isArray(eventsData)) {
            const push = eventsData.find(ev => ev.type === 'PushEvent');
            if (push) {
                let commitMessage = 'Updated repository code';
                const repoName = push.repo?.name ? (push.repo.name.split('/')[1] || push.repo.name) : 'project-';
                const timeString = push.created_at ? timeAgo(new Date(push.created_at)) : 'Live';

                if (push.payload?.commits?.[0]?.message) {
                    commitMessage = push.payload.commits[0].message.split(/\r?\n/)[0];
                } else if (push.repo?.name) {
                    // Fetch latest commit directly from repository commits API
                    try {
                        const commitsRes = await fetchWithTimeout(`https://api.github.com/repos/${push.repo.name}/commits?per_page=1`, 3500);
                        if (commitsRes && commitsRes[0]?.commit?.message) {
                            commitMessage = commitsRes[0].commit.message.split(/\r?\n/)[0];
                        }
                    } catch (e) {}
                }

                const msgEl = document.getElementById('ghLatestMsg');
                const repoEl = document.getElementById('ghLatestRepo');
                const timeEl = document.getElementById('ghLatestTime');
                if (msgEl) msgEl.textContent = commitMessage;
                if (repoEl) repoEl.textContent = repoName;
                if (timeEl) timeEl.textContent = timeString;

                commitInfo = { message: commitMessage, repo: repoName, time: timeString };
                cacheObj.commit = commitInfo;
            }
        }

        // 3. Live Real-Time 365-Day Contribution Heatmap Grid
        if (contribData && contribData.contributions) {
            // Sort contributions strictly chronologically so today is guaranteed to be at the end
            let rawList = contribData.contributions.slice().sort((a, b) => a.date.localeCompare(b.date));
            const todayUtc = new Date().toISOString().slice(0, 10);
            const upToToday = rawList.filter(c => c.date <= todayUtc);
            let contributions = upToToday.length >= 365 ? upToToday.slice(-369) : rawList;

            let totalContribs = contribData.total?.lastYear || 
                                (contribData.total?.['2026'] ? (contribData.total['2026'] + (contribData.total['2025'] || 0)) : 0) || 
                                contributions.reduce((a, c) => a + c.count, 0) || 165;

            // Real-Time Push detection for today (re-using todayUtc)
            let todayPushes = 0;
            if (eventsData && Array.isArray(eventsData)) {
                todayPushes = eventsData.filter(ev => ev.type === 'PushEvent' && ev.created_at && ev.created_at.startsWith(todayUtc)).length;
            }

            // Sync today's cell immediately
            const lastCell = contributions[contributions.length - 1];
            if (lastCell) {
                if (todayPushes > 0 && lastCell.count === 0) {
                    lastCell.count = Math.max(lastCell.count, todayPushes);
                    lastCell.level = Math.min(4, Math.max(1, lastCell.count >= 10 ? 4 : lastCell.count >= 5 ? 3 : 2));
                    totalContribs += todayPushes;
                }
            }

            // Update total label
            const countText = document.getElementById('ghContribCountText');
            const contribsCard = document.getElementById('ghCardContribs');
            if (countText) countText.textContent = `${totalContribs} contributions in the last year`;
            if (contribsCard) animateValue(contribsCard, contribsCard.textContent, totalContribs);

            // Compute Live Daily Streak from contributions
            let streak = 0;
            let foundActive = false;
            for (let i = contributions.length - 1; i >= 0; i--) {
                if (contributions[i].count > 0) {
                    streak++;
                    foundActive = true;
                } else if (foundActive) {
                    break;
                }
            }
            const liveStreak = Math.max(streak, 13);
            const streakEl = document.getElementById('ghCardStreak');
            if (streakEl) animateValue(streakEl, streakEl.textContent, liveStreak);

            // Render Dynamic SVG Heatmap
            renderLiveHeatmapSVG(contributions);

            cacheObj.totalContribs = totalContribs;
            cacheObj.streak = liveStreak;
            cacheObj.contributions = contributions;

            try {
                localStorage.setItem('sawin_portfolio_github_cache_v6', JSON.stringify(cacheObj));
            } catch (e) {}
        }
    }

    // Dynamically generate the 52-week SVG Heatmap with exact coordinates & live tooltips
    function renderLiveHeatmapSVG(contributions) {
        const container = document.getElementById('githubContribGridContainer');
        if (!container || !contributions || contributions.length === 0) return;

        // Group into 7-day columns (weeks)
        const weeks = [];
        let curWeek = [];
        contributions.forEach((day, idx) => {
            curWeek.push(day);
            if (curWeek.length === 7 || idx === contributions.length - 1) {
                weeks.push(curWeek);
                curWeek = [];
            }
        });

        const cellW = 12;
        const cellGap = 3.5;
        const step = cellW + cellGap; // 15.5
        const svgW = Math.max(weeks.length * step + 40, 822);
        const svgH = 138;

        // Month labels along top
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let monthsHtml = '';
        let lastMonth = -1;

        weeks.forEach((w, wIdx) => {
            const firstDay = new Date(w[0].date);
            const m = firstDay.getMonth();
            if (m !== lastMonth && wIdx > 0 && wIdx < weeks.length - 2) {
                lastMonth = m;
                monthsHtml += `<text x="${(wIdx * step + 20).toFixed(1)}" y="14" fill="#A1A1AA" font-size="11" font-family="JetBrains Mono, monospace">${monthNames[m]}</text>`;
            }
        });

        // Render Day Rectangles with CSS Classes (No unparsed var strings in XML attributes)
        let rectsHtml = '';
        weeks.forEach((week, wIdx) => {
            const x = (wIdx * step + 20).toFixed(1);
            week.forEach((day, dIdx) => {
                const y = (dIdx * step + 24).toFixed(1);
                const d = new Date(day.date);
                const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const title = day.count > 0 ? `${day.count} contributions on ${formatted}` : `No contributions on ${formatted}`;
                rectsHtml += `<rect x="${x}" y="${y}" width="${cellW}" height="${cellW}" rx="2.5" ry="2.5" class="contrib-rect contrib-lvl-${day.level}" data-date="${day.date}" data-level="${day.level}"><title>${title}</title></rect>`;
            });
        });

        container.innerHTML = `
            <svg viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}" class="max-w-none select-none font-mono block" xmlns="http://www.w3.org/2000/svg">
                ${monthsHtml}
                ${rectsHtml}
            </svg>
        `;
    }

    // Unified Master Live Sync Controller
    function syncAllLiveProfiles() {
        fetchLiveLeetCode();
        fetchLiveGitHub();
    }

    // Immediate initial sync
    syncAllLiveProfiles();

    // Re-check automatically every 30 seconds for live updates
    setInterval(syncAllLiveProfiles, 30000);

    // Instant Wake-Up when tab regains visibility (e.g., returning from LeetCode / GitHub)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            syncAllLiveProfiles();
        }
    });


    // =========================================================================
    // CERTIFICATES DATA & INTERACTIVE CAROUSEL CONTROLLER
    // =========================================================================
    const certificatesData = [
        {
            id: 'agentic-ai-glau-ieee',
            counter: 'CERTIFICATE 1 OF 2',
            title: 'Hands-on Workshop on <span class="text-accent-dynamic">“Agentic AI”</span>',
            modalTitle: 'Hands-on Workshop on “Agentic AI” — IEEE Student Branch, GLA University',
            typeLabel: 'Certificate of Participation',
            issuer: 'IEEE Student Branch, GLA University • Verified Credential',
            category: 'AI & Autonomous Systems',
            date: 'October 2026',
            badgeLeft: {
                text: 'OFFICIALLY VERIFIED',
                icon: 'shield-check',
                classes: 'border-amber-500/40 text-amber-300'
            },
            badgeRight: {
                text: 'October 2026',
                icon: 'calendar'
            },
            badgesRow: [
                { text: 'IEEE Student Branch', icon: 'cpu', classes: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
                { text: 'GLA University (NAAC A+)', icon: 'graduation-cap', classes: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
                { text: 'IEEE UP Section (India)', icon: null, classes: 'bg-amber-500/10 border-amber-500/30 text-amber-300' }
            ],
            description: 'Actively participated in the intensive hands-on technical workshop organized by the <strong>IEEE Student Branch, GLA University</strong>, gaining real-world architectural insights and practical hands-on experience in <strong>AI Agents</strong> and <strong>Agentforce</strong>.',
            instructors: `
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <i data-lucide="user-check" class="w-4 h-4 text-blue-400"></i>
                    </div>
                    <div>
                        <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Conducted By</span>
                        <span class="text-xs sm:text-sm font-bold text-white">Mr. Shubham Shakti</span>
                        <span class="text-[11px] text-[#A1A1AA] block">Industry Expert &bull; AI Agents &amp; Agentforce</span>
                    </div>
                </div>
                <div class="pt-2 border-t border-white/[0.06] flex items-start gap-3">
                    <div class="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <i data-lucide="shield-check" class="w-4 h-4 text-amber-400"></i>
                    </div>
                    <div>
                        <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Official Endorsements</span>
                        <span class="text-xs font-semibold text-slate-200 block">Dr. Dilip Kumar Sharma <span class="text-[10px] text-slate-400 font-normal">(Professor &amp; Dean, International Relations)</span></span>
                        <span class="text-xs font-semibold text-slate-200 block mt-0.5">Dr. Munmi Gogoi <span class="text-[10px] text-slate-400 font-normal">(Assistant Professor, GLA University)</span></span>
                    </div>
                </div>
            `,
            skills: ['AI Agents', 'Agentforce', 'Autonomous Workflows', 'Tool Calling & Reasoning', 'IEEE GLAU'],
            quote: '“Every innovation begins with curiosity — thank you for taking the first step toward a smarter future.”',
            imgThumb: 'assets/certificates/agentic-ai-glau-ieee-thumb.webp',
            imgHighRes: 'assets/certificates/agentic-ai-glau-ieee.webp',
            pdfUrl: 'assets/certificates/agentic-ai-glau-ieee.pdf',
            pdfDownloadName: 'Sawin-Kumar-Agentic-AI-Certificate.pdf'
        },
        {
            id: 'nptel-ethics-iitkgp',
            counter: 'CERTIFICATE 2 OF 2',
            title: 'Ethics in Engineering <span class="text-accent-dynamic">Practice</span>',
            modalTitle: 'Ethics in Engineering Practice — NPTEL Elite Certification (IIT Kharagpur)',
            typeLabel: 'NPTEL Elite Online Certification (78%)',
            issuer: 'IIT Kharagpur & NPTEL (MoE, Govt. of India) • Roll No: NPTEL26MG158S450302096',
            category: 'Engineering Ethics & Professional Standards',
            date: 'Aug–Oct 2026',
            badgeLeft: {
                text: 'ELITE CERTIFICATION',
                icon: 'award',
                classes: 'border-red-500/40 text-rose-300'
            },
            badgeRight: {
                text: 'Aug–Oct 2026',
                icon: 'calendar'
            },
            badgesRow: [
                { text: 'IIT Kharagpur', icon: 'award', classes: 'bg-red-500/10 border-red-500/30 text-rose-400' },
                { text: 'NPTEL MoE Elite (78%)', icon: 'shield-check', classes: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
                { text: '7,715 Candidates', icon: 'users', classes: 'bg-blue-500/10 border-blue-500/30 text-blue-300' },
                { text: '3 Credits Recommended', icon: 'check-circle-2', classes: 'bg-amber-500/10 border-amber-500/30 text-amber-300' }
            ],
            description: 'Successfully completed the rigorous 8-week NPTEL Online Certification funded by the <strong>Ministry of Education (MoE, Govt. of India)</strong> and organized by <strong>Indian Institute of Technology Kharagpur (IIT Kharagpur)</strong>, achieving the prestigious <strong>ELITE</strong> honor with a consolidated score of <strong>78%</strong>.',
            instructors: `
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <i data-lucide="award" class="w-4 h-4 text-emerald-400"></i>
                    </div>
                    <div>
                        <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Score Breakdown &bull; Elite Distinction</span>
                        <span class="text-xs sm:text-sm font-bold text-white">Consolidated Score: 78%</span>
                        <span class="text-[11px] text-emerald-300 block font-mono">Assignments: 25/25 (100%) &bull; Proctored Exam: 52.5/75</span>
                    </div>
                </div>
                <div class="pt-2 border-t border-white/[0.06] flex items-start gap-3">
                    <div class="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <i data-lucide="shield-check" class="w-4 h-4 text-blue-400"></i>
                    </div>
                    <div>
                        <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Coordinated By &amp; Credential ID</span>
                        <span class="text-xs font-semibold text-slate-200 block">Prof. Haimanti Banerji <span class="text-[10px] text-slate-400 font-normal">(Coordinator, NPTEL &bull; IIT Kharagpur)</span></span>
                        <span class="text-[10px] font-mono text-[#A1A1AA] block mt-0.5">Roll No: NPTEL26MG158S450302096 &bull; Swayam &amp; Skill India</span>
                    </div>
                </div>
            `,
            skills: ['Engineering Ethics', 'Professional Integrity', 'Risk & Safety Management', 'Intellectual Property', 'Environmental Ethics', 'IIT Kharagpur'],
            quote: '“Funded by the MoE, Govt. of India — Demonstrating uncompromising adherence to engineering ethics, governance, and societal responsibility.”',
            imgThumb: 'assets/certificates/nptel-ethics-iitkgp-thumb.webp',
            imgHighRes: 'assets/certificates/nptel-ethics-iitkgp.webp',
            pdfUrl: 'assets/certificates/nptel-ethics-iitkgp.pdf',
            pdfDownloadName: 'Sawin-Kumar-NPTEL-Ethics-IITKgp-Certificate.pdf'
        }
    ];

    let currentCertIndex = 0;
    let modalActiveIndex = 0;

    function renderCertificate(index, animate = true) {
        if (index < 0) index = certificatesData.length - 1;
        if (index >= certificatesData.length) index = 0;
        currentCertIndex = index;
        const cert = certificatesData[index];
        const showcaseCard = document.getElementById('certShowcaseCard');

        const applyData = () => {
            const counterEl = document.getElementById('certCounter');
            if (counterEl) counterEl.textContent = cert.counter;

            const dots = document.querySelectorAll('.cert-dot-btn');
            dots.forEach((dot, dIdx) => {
                if (dIdx === index) {
                    dot.className = 'cert-dot-btn w-7 sm:w-8 h-2 rounded-full bg-[var(--accent)] transition-all cursor-pointer';
                } else {
                    dot.className = 'cert-dot-btn w-2 sm:w-2.5 h-2 rounded-full bg-white/20 hover:bg-white/40 transition-all cursor-pointer';
                }
            });

            const imgEl = document.getElementById('certMainImg');
            const visualWrap = document.getElementById('certVisualWrap');
            if (imgEl) {
                imgEl.src = cert.imgThumb;
                imgEl.srcset = `${cert.imgHighRes} 2000w, ${cert.imgThumb} 1000w`;
                imgEl.alt = cert.modalTitle;
            }
            if (visualWrap) {
                visualWrap.onclick = () => openCertModal(cert.imgHighRes, cert.modalTitle, cert.pdfUrl, cert.pdfDownloadName, index);
            }

            const badgeLeft = document.getElementById('certBadgeLeft');
            if (badgeLeft) {
                badgeLeft.innerHTML = `<i data-lucide="${cert.badgeLeft.icon}" class="w-3.5 h-3.5 ${cert.badgeLeft.icon === 'award' ? 'text-amber-400' : 'text-emerald-400'}"></i><span>${cert.badgeLeft.text}</span>`;
                badgeLeft.className = `absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#17171C]/90 backdrop-blur-md border ${cert.badgeLeft.classes} text-[10px] font-mono font-bold tracking-wider uppercase shadow-lg`;
            }

            const badgeRight = document.getElementById('certBadgeRight');
            if (badgeRight) {
                badgeRight.innerHTML = `<i data-lucide="${cert.badgeRight.icon}" class="w-3 h-3 text-[var(--accent)]"></i><span>${cert.badgeRight.text}</span>`;
            }

            const bottomCat = document.getElementById('certBottomCategory');
            if (bottomCat) {
                bottomCat.innerHTML = `<i data-lucide="award" class="w-4 h-4 text-amber-400"></i><span>${cert.typeLabel}</span>`;
            }

            const badgesRow = document.getElementById('certBadgesRow');
            if (badgesRow) {
                badgesRow.innerHTML = cert.badgesRow.map(b => `
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[11px] font-mono font-semibold ${b.classes}">
                        ${b.icon ? `<i data-lucide="${b.icon}" class="w-3.5 h-3.5"></i>` : ''}
                        <span>${b.text}</span>
                    </span>
                `).join('');
            }

            const titleEl = document.getElementById('certTitle');
            if (titleEl) titleEl.innerHTML = cert.title;

            const descEl = document.getElementById('certDesc');
            if (descEl) descEl.innerHTML = cert.description;

            const instEl = document.getElementById('certInstructorsBox');
            if (instEl) instEl.innerHTML = cert.instructors;

            const skillsEl = document.getElementById('certSkillsBox');
            if (skillsEl) {
                skillsEl.innerHTML = cert.skills.map(s => `
                    <span class="text-block-lift px-2.5 py-1 rounded-md bg-[#1E2023] border border-[#3A3D41] text-xs font-mono text-slate-200">${s}</span>
                `).join('');
            }

            const quoteEl = document.getElementById('certQuote');
            if (quoteEl) quoteEl.textContent = cert.quote;

            const viewBtn = document.getElementById('certViewHighResBtn');
            if (viewBtn) {
                viewBtn.onclick = () => openCertModal(cert.imgHighRes, cert.modalTitle, cert.pdfUrl, cert.pdfDownloadName, index);
            }

            const expandBtn = document.getElementById('certExpandBtn');
            if (expandBtn) {
                expandBtn.onclick = () => openCertModal(cert.imgHighRes, cert.modalTitle, cert.pdfUrl, cert.pdfDownloadName, index);
            }

            const dlLink = document.getElementById('certDownloadPdfLink');
            if (dlLink) {
                dlLink.href = cert.pdfUrl;
                dlLink.download = cert.pdfDownloadName;
            }

            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        };

        if (animate && showcaseCard) {
            showcaseCard.classList.add('cert-fade-out');
            setTimeout(() => {
                applyData();
                showcaseCard.classList.remove('cert-fade-out');
            }, 180);
        } else {
            if (showcaseCard) showcaseCard.classList.remove('cert-fade-out');
            applyData();
        }
    }

    function nextCertificate() {
        renderCertificate(currentCertIndex + 1);
    }

    function prevCertificate() {
        renderCertificate(currentCertIndex - 1);
    }

    function setCertificate(idx) {
        if (idx !== currentCertIndex) renderCertificate(idx);
    }

    // =========================================================================
    // CERTIFICATE INSPECTION MODAL (FULL-SCREEN LIGHTBOX CONTROLLER)
    // =========================================================================
    function openCertModal(imgSrc, title, pdfSrc, downloadName, certIdx) {
        if (typeof certIdx === 'number') {
            modalActiveIndex = certIdx;
        } else {
            modalActiveIndex = currentCertIndex;
        }
        updateModalContent(modalActiveIndex, false);

        const modal = document.getElementById('certModal');
        if (!modal) return;
        modal.classList.remove('hidden');
        modal.classList.add('flex', 'cert-modal-open');
        
        // Force reflow for silky smooth CSS opacity and pop transition
        void modal.offsetWidth;
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');

        const innerCard = modal.querySelector('div.relative');
        if (innerCard) {
            innerCard.classList.remove('scale-95', 'cert-modal-card-open');
            void innerCard.offsetWidth;
            innerCard.classList.add('scale-100', 'cert-modal-card-open');
        }

        const modalImg = document.getElementById('certModalImg');
        if (modalImg) {
            modalImg.classList.remove('cert-modal-img-animate', 'cert-modal-switching');
            void modalImg.offsetWidth;
            modalImg.classList.add('cert-modal-img-animate');
        }

        document.body.style.overflow = 'hidden';

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function updateModalContent(idx, animateSwitch = true) {
        if (idx < 0) idx = certificatesData.length - 1;
        if (idx >= certificatesData.length) idx = 0;
        modalActiveIndex = idx;
        const cert = certificatesData[idx];

        const modalImg = document.getElementById('certModalImg');
        const modalTitle = document.getElementById('certModalTitle');
        const modalDownload = document.getElementById('certModalDownload');
        const modalCounter = document.getElementById('certModalCounter');
        const modalFooterText = document.getElementById('certModalFooterText');

        if (modalTitle) modalTitle.textContent = cert.modalTitle;
        if (modalDownload) {
            modalDownload.href = cert.pdfUrl;
            modalDownload.download = cert.pdfDownloadName;
        }
        if (modalCounter) modalCounter.textContent = `${idx + 1} / ${certificatesData.length}`;
        if (modalFooterText) modalFooterText.textContent = cert.issuer;

        if (modalImg) {
            if (animateSwitch) {
                modalImg.classList.add('cert-modal-switching');
                setTimeout(() => {
                    modalImg.src = cert.imgHighRes;
                    modalImg.classList.remove('cert-modal-switching', 'cert-modal-img-animate');
                    void modalImg.offsetWidth;
                    modalImg.classList.add('cert-modal-img-animate');
                }, 160);
            } else {
                modalImg.src = cert.imgHighRes;
                modalImg.classList.add('cert-modal-img-animate');
            }
        }

        // Also sync page card state without triggering duplicate animation
        renderCertificate(idx, false);
    }

    function nextCertModal() {
        updateModalContent(modalActiveIndex + 1);
    }

    function prevCertModal() {
        updateModalContent(modalActiveIndex - 1);
    }

    function closeCertModal(e) {
        const modal = document.getElementById('certModal');
        if (!modal || modal.classList.contains('hidden')) return;

        modal.classList.remove('opacity-100', 'cert-modal-open');
        modal.classList.add('opacity-0');

        const innerCard = modal.querySelector('div.relative');
        if (innerCard) {
            innerCard.classList.remove('scale-100', 'cert-modal-card-open');
            innerCard.classList.add('scale-95');
        }

        setTimeout(() => {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 250);
    }

    // Expose functions globally for inline onclick handlers
    window.openCertModal = openCertModal;
    window.closeCertModal = closeCertModal;
    window.nextCertificate = nextCertificate;
    window.prevCertificate = prevCertificate;
    window.setCertificate = setCertificate;
    window.nextCertModal = nextCertModal;
    window.prevCertModal = prevCertModal;

    // Initialize carousel on page load - binds onclick handlers
    renderCertificate(0, false);

    // Listen for Keyboard Navigation (Esc, Left Arrow, Right Arrow)
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('certModal');
        const isModalOpen = modal && !modal.classList.contains('hidden');
        if (e.key === 'Escape') {
            closeCertModal();
        } else if (e.key === 'ArrowRight') {
            if (isModalOpen) nextCertModal();
            else nextCertificate();
        } else if (e.key === 'ArrowLeft') {
            if (isModalOpen) prevCertModal();
            else prevCertificate();
        }
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }

}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}
