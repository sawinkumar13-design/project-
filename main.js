/**
 * Sawin Kumar — Portfolio Interactions & Integrations
 * Minimal, high-performance, accessible scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // 1. SILENT VISITOR NOTIFICATION ENGINE (ZERO UI IMPACT)
    // =========================================================================
    function sendVisitorAlert() {
        try {
            if (sessionStorage.getItem('sawin_portfolio_visited')) return;
            if (navigator.webdriver) return;

            const ua = (navigator.userAgent || '').toLowerCase();
            if (/bot|crawler|spider|crawling|headless|lighthouse/i.test(ua)) return;

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
                message: `Hello Sawin,\n\nA new visitor just opened your portfolio website!\n\n` +
                         `• Timestamp: ${timestamp}\n` +
                         `• Device: ${deviceType}\n` +
                         `• Screen Resolution: ${screenRes}\n` +
                         `• Referral Source: ${referrer}\n` +
                         `• Live URL: ${window.location.href}\n\n` +
                         `This alert was delivered automatically upon visit.`
            };

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload),
                mode: 'cors',
                keepalive: true
            }).catch(() => {});
        } catch (e) {}
    }

    setTimeout(sendVisitorAlert, 400);

    // =========================================================================
    // 2. TOAST NOTIFICATION SYSTEM
    // =========================================================================
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    let toastTimeout;

    function showToast(message) {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }
    window.showToast = showToast;

    // =========================================================================
    // 3. COPY EMAIL TO CLIPBOARD
    // =========================================================================
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = 'sawinkumar13@gmail.com';
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(() => {
                    showToast('Copied ' + email + ' to clipboard');
                }).catch(() => {
                    showToast('Email: ' + email);
                });
            } else {
                showToast('Email: ' + email);
            }
        });
    }

    // =========================================================================
    // 4. CONTACT FORM DISPATCH & SANITIZATION
    // =========================================================================
    const contactForm = document.getElementById('contactForm');
    let lastSubmitTime = 0;

    function sanitizeInput(str) {
        if (!str) return '';
        return String(str)
            .replace(/[<>]/g, '')
            .replace(/[\r\n]+/g, ' ')
            .trim();
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Bot check (honeypot)
            const honeypot = document.getElementById('formWebsiteTrap');
            if (honeypot && honeypot.value.trim() !== '') {
                contactForm.reset();
                showToast('Message dispatched');
                return;
            }

            // Rate limit
            const now = Date.now();
            if (now - lastSubmitTime < 5000) {
                showToast('Please wait a few seconds before resubmitting');
                return;
            }

            const rawName = document.getElementById('senderName')?.value || '';
            const rawEmail = document.getElementById('senderEmail')?.value || '';
            const rawSubject = document.getElementById('senderSubject')?.value || '';
            const rawMessage = document.getElementById('senderMessage')?.value || '';

            const name = sanitizeInput(rawName).slice(0, 80);
            const email = sanitizeInput(rawEmail).slice(0, 100);
            const subject = sanitizeInput(rawSubject || 'Software Engineering Opportunity').slice(0, 120);
            const message = String(rawMessage).replace(/[<>]/g, '').trim().slice(0, 2000);

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailPattern.test(email)) {
                showToast('Please enter a valid email address');
                return;
            }

            if (!message || message.length < 5) {
                showToast('Please enter a descriptive message');
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
    // 5. PROJECT CATEGORY FILTERING
    // =========================================================================
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterTabs.length > 0 && projectCards.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const selectedCategory = tab.getAttribute('data-category');

                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category') || '';
                    if (selectedCategory === 'all' || cardCategory.includes(selectedCategory)) {
                        card.style.display = 'block';
                        requestAnimationFrame(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(8px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 200);
                    }
                });
            });
        });
    }

    // =========================================================================
    // 6. MOBILE MENU DRAWER
    // =========================================================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // =========================================================================
    // 7. ACTIVE NAVIGATION SCROLL SPY
    // =========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 140;
        let currentId = '';

        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
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
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // =========================================================================
    // 8. RESTRAINED SCROLL REVEALS
    // =========================================================================
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        reveals.forEach(el => revealObserver.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('active'));
    }

    // Initialize Lucide icons if available
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
});
