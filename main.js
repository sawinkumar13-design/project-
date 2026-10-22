/**
 * Sawin Kumar Portfolio — Photorealistic Volumetric Smoke & Cinematic Intro Reveal
 * - Photorealistic Volumetric Smoke Engine using Custom Three.js GLSL Shaders
 * - Smoke emerging from upper-right corner & right edge, drifting inward toward center
 * - Negative space preservation (left side & center almost completely dark)
 * - Low-key cinematic lighting (black, charcoal, graphite, muted smoky silver, diffused cool-blue)
 * - Real-time Mouse fluid impulse & tangential swirling eddies in smoke field
 * - Interactive pointer smoke emission (curling volumetric vapor wisps billowing from pointer)
 * - Phase 1: Full-Screen Cinematic Intro ("SAWIN KUMAR", watermark duplicates, tagline, "[ CLICK TO ENTER ]")
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
    // 0.5 THEME ACCENT COLOR SWITCHER & AMBIENT AUDIO CONTROLLER
    // =========================================================================
    const THEMES = {
        cyan: {
            name: 'Cyan',
            hex: '#06b6d4',
            rgb: '6, 182, 212',
            glow: 'rgba(6, 182, 212, 0.4)',
            hover: '#22d3ee'
        },
        violet: {
            name: 'Violet',
            hex: '#8b5cf6',
            rgb: '139, 92, 246',
            glow: 'rgba(139, 92, 246, 0.4)',
            hover: '#a78bfa'
        },
        emerald: {
            name: 'Emerald',
            hex: '#10b981',
            rgb: '16, 185, 129',
            glow: 'rgba(16, 185, 129, 0.4)',
            hover: '#34d399'
        },
        amber: {
            name: 'Amber',
            hex: '#f59e0b',
            rgb: '245, 158, 11',
            glow: 'rgba(245, 158, 11, 0.4)',
            hover: '#fbbf24'
        }
    };
    window.THEMES = THEMES;

    let currentThemeKey = 'cyan';
    try {
        const saved = localStorage.getItem('sawin-portfolio-theme');
        if (saved && THEMES[saved]) currentThemeKey = saved;
    } catch (e) {}
    window.currentThemeKey = currentThemeKey;

    const themeSwitcherBtn = document.getElementById('themeSwitcherBtn');
    const themeDropdownMenu = document.getElementById('themeDropdownMenu');
    const currentThemeLabel = document.getElementById('currentThemeLabel');

    function applyTheme(themeKey) {
        if (!THEMES[themeKey]) return;
        currentThemeKey = themeKey;
        window.currentThemeKey = themeKey;
        const theme = THEMES[themeKey];

        // 1. Update CSS root variables
        document.documentElement.style.setProperty('--accent', theme.hex);
        document.documentElement.style.setProperty('--accent-rgb', theme.rgb);
        document.documentElement.style.setProperty('--accent-glow', theme.glow);
        document.documentElement.style.setProperty('--accent-hover', theme.hover);

        // 2. Set global data-theme attribute on <html> for whole-portfolio color swapping
        document.documentElement.setAttribute('data-theme', themeKey);

        // 3. Persist in localStorage
        try {
            localStorage.setItem('sawin-portfolio-theme', themeKey);
        } catch (e) {}

        // 4. Update dropdown UI indicators
        if (currentThemeLabel) currentThemeLabel.textContent = theme.name;

        const allThemeOptionBtns = document.querySelectorAll('.theme-option-btn, .mobile-theme-btn');
        allThemeOptionBtns.forEach(btn => {
            const key = btn.getAttribute('data-theme');
            const checkIcon = btn.querySelector('.theme-check');
            if (key === themeKey) {
                btn.classList.add('active-theme', 'border-accent-dynamic');
                if (checkIcon) checkIcon.classList.remove('opacity-0');
            } else {
                btn.classList.remove('active-theme', 'border-accent-dynamic');
                if (checkIcon) checkIcon.classList.add('opacity-0');
            }
        });

        // 5. Update WebGL smoke accent color
        if (typeof window.updateSmokeAccent === 'function') {
            window.updateSmokeAccent(theme.hex);
        }
    }
    window.applyTheme = applyTheme;

    // Dropdown toggle logic
    let isThemeDropdownOpen = false;
    function openThemeDropdown() {
        const menu = document.getElementById('themeDropdownMenu') || themeDropdownMenu;
        const btn = document.getElementById('themeSwitcherBtn') || themeSwitcherBtn;
        if (!menu) return;
        isThemeDropdownOpen = true;
        menu.classList.add('open');
        if (btn) {
            btn.classList.add('active-open');
            btn.setAttribute('aria-expanded', 'true');
        }
    }
    window.openThemeDropdown = openThemeDropdown;

    function closeThemeDropdown() {
        const menu = document.getElementById('themeDropdownMenu') || themeDropdownMenu;
        const btn = document.getElementById('themeSwitcherBtn') || themeSwitcherBtn;
        if (!menu) return;
        isThemeDropdownOpen = false;
        menu.classList.remove('open');
        if (btn) {
            btn.classList.remove('active-open');
            btn.setAttribute('aria-expanded', 'false');
        }
    }
    window.closeThemeDropdown = closeThemeDropdown;

    function toggleThemeDropdown(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        if (isThemeDropdownOpen) {
            closeThemeDropdown();
        } else {
            openThemeDropdown();
        }
    }
    window.toggleThemeDropdown = toggleThemeDropdown;

    if (themeSwitcherBtn) {
        themeSwitcherBtn.addEventListener('click', toggleThemeDropdown);
    }

    // Bind option click events (Desktop & Mobile)
    function bindThemeButtons() {
        const btns = document.querySelectorAll('.theme-option-btn, .mobile-theme-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (e && e.stopPropagation) e.stopPropagation();
                const selectedTheme = btn.getAttribute('data-theme');
                if (selectedTheme) {
                    applyTheme(selectedTheme);
                    closeThemeDropdown();
                }
            });
        });
    }
    bindThemeButtons();

    // Click outside to dismiss
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('themeDropdownMenu') || themeDropdownMenu;
        const btn = document.getElementById('themeSwitcherBtn') || themeSwitcherBtn;
        if (isThemeDropdownOpen && menu && !menu.contains(e.target) && (!btn || !btn.contains(e.target))) {
            closeThemeDropdown();
        }
    });

    // Keyboard navigation (Escape)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isThemeDropdownOpen) {
            closeThemeDropdown();
            if (themeSwitcherBtn) themeSwitcherBtn.focus();
        }
    });

    // Initialize Theme immediately
    applyTheme(currentThemeKey);

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

    const cursorContainer = document.getElementById('smokeCursor') || document.getElementById('singularityCursor');
    const cursorDot = cursorContainer ? cursorContainer.querySelector('.cursor-dot') : null;
    const cursorRing = cursorContainer ? cursorContainer.querySelector('.cursor-ring') : null;
    const cursorAura = cursorContainer ? cursorContainer.querySelector('.cursor-aura') : null;

    let ringX = window.innerWidth * 0.5;
    let ringY = window.innerHeight * 0.5;
    let auraX = window.innerWidth * 0.5;
    let auraY = window.innerHeight * 0.5;

    // Lightweight 2D canvas overlay for pointer smoke wisps (0 DOM allocations)
    let pointerSmokeCanvas = document.getElementById('pointerSmokeCanvas');
    if (!pointerSmokeCanvas) {
        pointerSmokeCanvas = document.createElement('canvas');
        pointerSmokeCanvas.id = 'pointerSmokeCanvas';
        pointerSmokeCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;';
        document.body.appendChild(pointerSmokeCanvas);
    }
    const pCtx = pointerSmokeCanvas ? pointerSmokeCanvas.getContext('2d') : null;

    function resizePointerCanvas() {
        if (!pointerSmokeCanvas) return;
        pointerSmokeCanvas.width = window.innerWidth;
        pointerSmokeCanvas.height = window.innerHeight;
    }
    resizePointerCanvas();
    window.addEventListener('resize', resizePointerCanvas, { passive: true });

    const pointerParticles = [];
    const MAX_POINTER_PARTICLES = 30;

    function emitPointerSmoke(px, py, vx, vy, isIdle = false) {
        if (!pCtx) return;
        if (pointerParticles.length >= MAX_POINTER_PARTICLES) {
            pointerParticles.shift();
        }
        pointerParticles.push({
            x: px,
            y: py,
            vx: (vx || 0) * 0.12 + (Math.random() - 0.5) * 0.8,
            vy: (vy || 0) * 0.12 - (Math.random() * 0.7 + 0.6), // natural buoyancy drift upward
            r: isIdle ? 16 : 22,
            maxLife: isIdle ? 36 : 48,
            life: 0,
            growth: isIdle ? 0.42 : 0.68,
            alpha: isIdle ? 0.22 : 0.38
        });
    }

    function renderPointerSmoke() {
        if (!pCtx) return;
        pCtx.clearRect(0, 0, pointerSmokeCanvas.width, pointerSmokeCanvas.height);
        for (let i = pointerParticles.length - 1; i >= 0; i--) {
            const p = pointerParticles[i];
            p.life++;
            if (p.life >= p.maxLife) {
                pointerParticles.splice(i, 1);
                continue;
            }
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.96;
            p.vy *= 0.96;
            p.r += p.growth;

            const progress = p.life / p.maxLife;
            const currentAlpha = (1 - progress) * p.alpha;

            const grad = pCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
            grad.addColorStop(0, `rgba(215, 226, 245, ${currentAlpha.toFixed(3)})`);
            grad.addColorStop(0.38, `rgba(148, 163, 184, ${(currentAlpha * 0.55).toFixed(3)})`);
            grad.addColorStop(0.75, `rgba(50, 60, 80, ${(currentAlpha * 0.18).toFixed(3)})`);
            grad.addColorStop(1, 'rgba(10, 10, 15, 0)');

            pCtx.fillStyle = grad;
            pCtx.beginPath();
            pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            pCtx.fill();
        }
    }

    if (!isTouchDevice && cursorContainer) {
        window.addEventListener('mousemove', (e) => {
            const vx = e.clientX - targetMouseX;
            const vy = e.clientY - targetMouseY;
            const moveDist = Math.hypot(vx, vy);

            mouseVelX = vx * 0.4 + mouseVelX * 0.6;
            mouseVelY = vy * 0.4 + mouseVelY * 0.6;

            targetMouseX = e.clientX;
            targetMouseY = e.clientY;
            normMouseX = e.clientX / window.innerWidth;
            normMouseY = e.clientY / window.innerHeight;

            if (!isMouseOnScreen) {
                isMouseOnScreen = true;
                cursorContainer.style.opacity = '1';
            }

            if (cursorDot) {
                cursorDot.style.transform = `translate3d(${targetMouseX}px, ${targetMouseY}px, 0) translate3d(-50%, -50%, 0)`;
            }

            const now = performance.now();
            lastMoveTime = now;

            // Emit smooth vapor particles on movement (rate-limited, 0 DOM overhead)
            if (moveDist > 3 && (now - lastMoteTime > 30)) {
                lastMoteTime = now;
                emitPointerSmoke(targetMouseX, targetMouseY, vx, vy);
                if (moveDist > 20) {
                    emitPointerSmoke((targetMouseX + prevMouseX) * 0.5, (targetMouseY + prevMouseY) * 0.5, vx, vy);
                }
            }
            prevMouseX = targetMouseX;
            prevMouseY = targetMouseY;
        }, { passive: true });

        // Gentle idle breath when mouse rests
        setInterval(() => {
            if (isMouseOnScreen && (performance.now() - lastMoveTime > 450)) {
                emitPointerSmoke(targetMouseX, targetMouseY, 0, 0, true);
            }
        }, 700);

        document.addEventListener('mouseleave', () => {
            isMouseOnScreen = false;
            cursorContainer.style.opacity = '0';
        });

        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .glossy-card, .tool-chip, .filter-btn, .cosmic-btn-primary, [role="button"]');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorContainer.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorContainer.classList.remove('hovering'));
        });
    }


    // =========================================================================
    // 2. PHOTOREALISTIC VOLUMETRIC SMOKE ENGINE (THREE.JS GLSL SHADER)
    // =========================================================================
    const canvas = document.getElementById('smokeCanvas') || document.getElementById('singularityCanvas') || document.getElementById('galaxyCanvas');

    let updateAllSectionProps = () => {};

    if (canvas && typeof THREE !== 'undefined') {
        try {
            let width = window.innerWidth;
            let height = window.innerHeight;

            const scene = new THREE.Scene();
            const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
            camera.position.set(0, 0, 0);

            const renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                antialias: false,
                powerPreference: 'high-performance',
                depth: false,
                stencil: false,
                alpha: false
            });
            renderer.setSize(width, height);
            // Cap at 1.0 to eliminate fill-rate bottleneck and maintain 60 FPS
            renderer.setPixelRatio(1.0);

            const smokeUniforms = {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2(width, height) },
                uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                uMouseVel: { value: new THREE.Vector2(0, 0) },
                uScroll: { value: 0 },
                uAccentColor: { value: new THREE.Color(THEMES[currentThemeKey].hex) }
            };

            window.updateSmokeAccent = function(hex) {
                if (smokeUniforms && smokeUniforms.uAccentColor) {
                    smokeUniforms.uAccentColor.value.set(hex);
                }
            };

            const smokeVertexShader = `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position.xy, 0.0, 1.0);
                }
            `;

            const smokeFragmentShader = `
                precision highp float;
                varying vec2 vUv;
                uniform float uTime;
                uniform vec2 uResolution;
                uniform vec2 uMouse;
                uniform vec2 uMouseVel;
                uniform float uScroll;
                uniform vec3 uAccentColor;

                // Ultra-fast smooth value noise with bicubic interpolation
                float hash(vec2 p) {
                    p = fract(p * vec2(123.34, 456.21));
                    p += dot(p, p + 45.32);
                    return fract(p.x * p.y);
                }

                float noise(vec2 p) {
                    vec2 i = floor(p);
                    vec2 f = fract(p);
                    vec2 u = f * f * (3.0 - 2.0 * f);
                    return mix(
                        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
                        u.y
                    );
                }

                // 2-Octave Fast Smooth FBM
                float fbm(vec2 p) {
                    float v = noise(p) * 0.62;
                    v += noise(p * 2.08 + vec2(1.7, 9.2)) * 0.38;
                    return v;
                }

                void main() {
                    vec2 uv = vUv;
                    vec2 normUv = vec2(uv.x, 1.0 - uv.y);
                    float aspect = uResolution.x / uResolution.y;

                    float slowTime = uTime * 0.08;

                    // Composition: Emitter in Upper-Right Corner and Right Edge
                    vec2 urPoint = vec2(0.96, 0.08);
                    vec2 urDistVec = (normUv - urPoint) * vec2(1.0, 1.35);
                    float distUR = length(urDistVec);
                    float cornerSmoke = 1.0 - smoothstep(0.12, 1.25, distUR);

                    float rightEdgeSmoke = smoothstep(0.42, 0.96, normUv.x) * (1.0 - smoothstep(0.15, 1.0, normUv.y)) * 0.82;
                    float topWisps = (1.0 - smoothstep(0.02, 0.45, normUv.y)) * smoothstep(0.30, 0.88, normUv.x) * 0.52;

                    float emitterMask = max(cornerSmoke * 0.95, max(rightEdgeSmoke, topWisps));

                    // Negative Space: Left side and center remain dark obsidian charcoal
                    float negativeSpace = smoothstep(0.24, 0.72, normUv.x + (1.0 - normUv.y) * 0.46);
                    emitterMask *= negativeSpace;

                    // Mouse Pointer Swirl & Displacement
                    vec2 mPos = vec2(uMouse.x, 1.0 - uMouse.y);
                    vec2 mDiff = (normUv - mPos) * vec2(aspect, 1.0);
                    float mDist = length(mDiff);
                    float mInfluence = 1.0 - smoothstep(0.0, 0.38, mDist);
                    vec2 mSwirl = vec2(-mDiff.y, mDiff.x) * mInfluence * 0.55;
                    vec2 mPush = vec2(uMouseVel.x, -uMouseVel.y) * mInfluence * 0.85;

                    // Base coordinates with upward & inward drift
                    vec2 p = normUv * vec2(2.8 * aspect, 2.8);
                    p.y -= slowTime * 0.35;
                    p.x -= slowTime * 0.22;
                    p += mSwirl + mPush;

                    // Trigonometric curling domain warp
                    vec2 curlWarp = vec2(
                        sin(p.y * 1.5 + slowTime * 1.2),
                        cos(p.x * 1.4 - slowTime * 0.9)
                    ) * 0.42;

                    vec2 q = vec2(fbm(p + curlWarp), fbm(p + curlWarp + vec2(4.3, 1.8)));
                    vec2 r = vec2(fbm(p + 2.2 * q + vec2(1.7, 9.2)), fbm(p + 2.2 * q + vec2(8.3, 2.8)));

                    float rawDensity = fbm(p + 2.6 * r);
                    float smoke = smoothstep(0.18, 0.82, rawDensity) * emitterMask;

                    // Low-Key Cinematic Lighting Palette (High Contrast & Visible Vapor)
                    vec3 cBaseBlack    = vec3(0.024, 0.025, 0.032); // #060608
                    vec3 cCharcoal     = vec3(0.075, 0.082, 0.098); // #131519
                    vec3 cGraphite     = vec3(0.180, 0.195, 0.225); // #2e3239
                    vec3 cSmokySilver  = vec3(0.580, 0.615, 0.675); // #949dad visible smoky silver
                    vec3 cSilverRim    = vec3(0.820, 0.850, 0.910); // #d1d9e8 specular rim

                    // Directional Backlighting from Upper-Right Emitter
                    vec2 lightDir = normalize(urPoint - normUv);
                    vec2 smokeGrad = normalize((r - vec2(0.5)) + vec2(0.001));
                    float rimLight = pow(max(0.0, dot(smokeGrad, lightDir)), 2.2);

                    // Subtle ambient illumination near bottom center with dynamic theme tint
                    float coolGlow = exp(-length((normUv - vec2(0.5, 0.88)) * vec2(1.0, 1.4)) * 3.2);

                    // Compositing
                    vec3 col = mix(cBaseBlack, cCharcoal, smoke * 0.85);
                    col = mix(col, cGraphite, smoothstep(0.12, 0.60, smoke));
                    col = mix(col, cSmokySilver, smoothstep(0.35, 0.88, smoke) * 0.75);
                    col += cSilverRim * (rimLight * smoke * 0.65);
                    col += uAccentColor * (rimLight * smoke * 0.28 + coolGlow * 0.25);

                    // Faint atmospheric scanline & delicate grain
                    float horiz = sin(normUv.y * uResolution.y * 1.5) * 0.004;
                    float grain = (hash(normUv * uResolution.xy + fract(uTime * 17.3)) - 0.5) * 0.018;
                    col += horiz + grain;

                    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
                }
            `;

            const smokeGeo = new THREE.PlaneGeometry(2, 2);
            const smokeMat = new THREE.ShaderMaterial({
                uniforms: smokeUniforms,
                vertexShader: smokeVertexShader,
                fragmentShader: smokeFragmentShader,
                depthWrite: false,
                depthTest: false
            });

            const smokeQuad = new THREE.Mesh(smokeGeo, smokeMat);
            smokeQuad.frustumCulled = false;
            scene.add(smokeQuad);

            function resizeSmoke() {
                width = window.innerWidth;
                height = window.innerHeight;
                renderer.setSize(width, height);
                smokeUniforms.uResolution.value.set(width, height);
            }
            window.addEventListener('resize', resizeSmoke, { passive: true });

            let lastFrameTime = performance.now();
            let smoothMouseX = 0.5;
            let smoothMouseY = 0.5;
            let smoothVelX = 0;
            let smoothVelY = 0;

            function smokeAnimate(currentTime) {
                const delta = Math.min((currentTime - lastFrameTime) * 0.001, 0.1);
                lastFrameTime = currentTime;

                smokeUniforms.uTime.value = currentTime * 0.001;

                // Smooth pointer lerp
                smoothMouseX += (normMouseX - smoothMouseX) * 0.1;
                smoothMouseY += (normMouseY - smoothMouseY) * 0.1;
                smokeUniforms.uMouse.value.set(smoothMouseX, smoothMouseY);

                smoothVelX += (mouseVelX - smoothVelX) * 0.12;
                smoothVelY += (mouseVelY - smoothVelY) * 0.12;
                smokeUniforms.uMouseVel.value.set(smoothVelX * 0.005, smoothVelY * 0.005);
                mouseVelX *= 0.9;
                mouseVelY *= 0.9;

                // Cursor outer ring & aura lagged follower
                if (!isTouchDevice && cursorRing && cursorAura) {
                    ringX += (targetMouseX - ringX) * 0.16;
                    ringY += (targetMouseY - ringY) * 0.16;
                    cursorRing.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0) translate3d(-50%, -50%, 0)`;

                    auraX += (targetMouseX - auraX) * 0.09;
                    auraY += (targetMouseY - auraY) * 0.09;
                    cursorAura.style.transform = `translate3d(${auraX.toFixed(1)}px, ${auraY.toFixed(1)}px, 0) translate3d(-50%, -50%, 0)`;
                }

                // Render pointer vapor particles
                renderPointerSmoke();

                // Subtle dynamic sway on the live smoke vapor trail behind hero portrait
                const auroraTrailEl = document.querySelector('.aurora-trail-left');
                if (auroraTrailEl) {
                    auroraTrailEl.style.transform = `translate3d(${(smoothMouseX - 0.5) * 32}px, ${(smoothMouseY - 0.5) * -24}px, 0)`;
                }

                try {
                    renderer.render(scene, camera);
                } catch (renderErr) {
                    console.warn('Render issue:', renderErr);
                }

                requestAnimationFrame(smokeAnimate);
            }

            requestAnimationFrame(smokeAnimate);
        } catch (err) {
            console.warn('Smoke WebGL initialization fallback:', err);
            // Fallback loop if WebGL init fails
            function fallbackPointerLoop() {
                renderPointerSmoke();
                requestAnimationFrame(fallbackPointerLoop);
            }
            requestAnimationFrame(fallbackPointerLoop);
        }
    } else {
        // Fallback loop if Three.js not present
        function fallbackPointerLoop() {
            renderPointerSmoke();
            requestAnimationFrame(fallbackPointerLoop);
        }
        requestAnimationFrame(fallbackPointerLoop);
    }


    // =========================================================================
    // 3. 3D FLOATING CORNER PROPS ENGINE (FOR ALL SLIDES EXCEPT FIRST TWO)
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

    updateAllSectionProps = function() {
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
    };

    // Dedicated animation loop for 3D props (guarantees continuous levitation regardless of WebGL state)
    function propsAnimateLoop() {
        updateAllSectionProps();
        requestAnimationFrame(propsAnimateLoop);
    }
    requestAnimationFrame(propsAnimateLoop);


    // =========================================================================
    // 4. DYNAMIC GLASS BORDER GLARE & 3D PERSPECTIVE TILT
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
    const navbar = document.getElementById('navbar');
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

            // 2. Bot Shield: Skip automated search bots, web crawlers, and headless runners
            if (navigator.webdriver) return;
            const ua = (navigator.userAgent || '').toLowerCase();
            if (/bot|crawler|spider|crawling|headless|lighthouse/i.test(ua)) return;

            sessionStorage.setItem('sawin_portfolio_visited', 'true');

            const referrer = document.referrer || 'Direct Visit';
            const screenRes = `${window.screen?.width || window.innerWidth}x${window.screen?.height || window.innerHeight}`;
            const isTouch = window.matchMedia('(pointer: coarse)').matches;
            const deviceType = isTouch ? 'Mobile / Tablet' : 'Desktop / Laptop';
            const timestamp = new Date().toLocaleString();

            // Web3Forms endpoint (https://web3forms.com)
            // Replace with your Web3Forms Access Key to activate live inbox delivery
            const accessKey = window.VISITOR_ALERT_KEY || 'YOUR_ACCESS_KEY_HERE';
            if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
                return;
            }

            const payload = {
                access_key: accessKey,
                subject: '👀 New Visitor Opened Your Portfolio!',
                from_name: 'Portfolio Visitor Alert',
                to_email: 'sawinkumar13@gmail.com',
                message: `Someone just opened your portfolio website!\n\n` +
                         `⏰ Time: ${timestamp}\n` +
                         `📱 Device: ${deviceType}\n` +
                         `🖥️ Screen: ${screenRes}\n` +
                         `🔗 Referred By: ${referrer}\n` +
                         `🌐 URL: ${window.location.href}`
            };

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload),
                mode: 'cors'
            }).catch(() => {});
        } catch (e) {}
    }

    // Trigger silently after 1.8s without delaying visual render
    setTimeout(sendVisitorAlert, 1800);

}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}
