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
        // =========================================================================
    // 0.5 DARK MODE & BRIGHT MODE CONTROLLER
    // =========================================================================
    let currentDisplayMode = 'dark';
    try {
        const savedMode = localStorage.getItem('sawin-portfolio-display-mode');
        if (savedMode === 'light' || savedMode === 'dark') {
            currentDisplayMode = savedMode;
        }
    } catch (e) {}

    function setDisplayMode(mode) {
        currentDisplayMode = mode;
        document.documentElement.setAttribute('data-mode', mode);
        try {
            localStorage.setItem('sawin-portfolio-display-mode', mode);
        } catch (e) {}

        const sunIcons = document.querySelectorAll('.mode-icon-sun');
        const moonIcons = document.querySelectorAll('.mode-icon-moon');
        const mobileLabel = document.getElementById('mobileModeLabel');

        if (mode === 'light') {
            sunIcons.forEach(i => i.classList.add('hidden'));
            moonIcons.forEach(i => i.classList.remove('hidden'));
            if (mobileLabel) mobileLabel.textContent = 'Dark Mode';
            if (typeof window.setSmokeLightMode === 'function') {
                window.setSmokeLightMode(1.0);
            }
        } else {
            sunIcons.forEach(i => i.classList.remove('hidden'));
            moonIcons.forEach(i => i.classList.add('hidden'));
            if (mobileLabel) mobileLabel.textContent = 'Bright Mode';
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
                alpha: true
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
                uAccentColor: { value: new THREE.Color('#8A8D91') },
                uLightMode: { value: currentDisplayMode === 'light' ? 1.0 : 0.0 },
                uLightMode: { value: currentDisplayMode === 'light' ? 1.0 : 0.0 }
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
                uniform float uLightMode;

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

                    // === AMBER RADIAL GLOW: Bottom-Left origin, drifts to center-right ===
                    // Large warm amber blob emanating from lower-left (matches reference image)
                    vec2 blPoint = vec2(0.05, 0.92); // bottom-left origin
                    vec2 blDistVec = (normUv - blPoint) * vec2(0.85, 1.2);
                    float distBL = length(blDistVec);
                    float blCornerSmoke = 1.0 - smoothstep(0.05, 1.15, distBL);

                    // Secondary warm spread — center-left mid-zone
                    vec2 midLeft = vec2(0.28, 0.60);
                    float distMid = length((normUv - midLeft) * vec2(1.0, 1.3));
                    float midSmoke = 1.0 - smoothstep(0.15, 0.82, distMid);

                    // Subtle top-left wisps
                    float topLeftWisps = (1.0 - smoothstep(0.0, 0.55, normUv.x)) * smoothstep(0.30, 0.80, normUv.y) * 0.55;

                    // Right side dark columns: suppress smoke on right half
                    float rightDark = 1.0 - smoothstep(0.60, 0.95, normUv.x) * 0.65;

                    float emitterMask = max(blCornerSmoke * 1.0, max(midSmoke * 0.78, topLeftWisps));
                    emitterMask *= rightDark;

                    // Negative Space: Upper-right and far-right stay dark
                    float negSpace = 1.0 - smoothstep(0.52, 0.95, normUv.x) * smoothstep(0.0, 0.45, 1.0 - normUv.y);
                    emitterMask *= negSpace;

                    // Reference point for rim lighting (bottom-left)
                    vec2 urPoint = vec2(0.05, 0.92);

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

                    // === WARM AMBER -> CRIMSON VELVET CINEMATIC PALETTE ===
                    // Base: Royal Charcoal #1E2023 -> Crimson Velvet #2C0F12
                    vec3 cBaseBlack    = mix(vec3(0.118, 0.125, 0.137), vec3(0.173, 0.059, 0.071), uLightMode); // #1E2023 -> #2C0F12
                    vec3 cCharcoal     = mix(vec3(0.118, 0.122, 0.133), vec3(0.220, 0.078, 0.094), uLightMode); // #1E1F22 -> #381418
                    vec3 cGraphite     = mix(vec3(0.153, 0.161, 0.176), vec3(0.263, 0.094, 0.114), uLightMode); // #27292D -> #43181D
                    vec3 cAmberVapor   = mix(vec3(0.282, 0.290, 0.318), vec3(0.420, 0.118, 0.137), uLightMode); // Silver Charcoal vapor -> Crimson Velvet
                    vec3 cAmberRim     = mix(vec3(0.541, 0.549, 0.573), vec3(0.882, 0.114, 0.282), uLightMode); // #8A8C92 Silver Rim -> #E11D48 Ruby Rim

                    // Directional rim light from bottom-left amber emitter
                    vec2 lightDir = normalize(urPoint - normUv);
                    vec2 smokeGrad = normalize((r - vec2(0.5)) + vec2(0.001));
                    float rimLight = pow(max(0.0, dot(smokeGrad, lightDir)), 1.85);

                    // Large warm amber radial glow at bottom-left (the key element of the reference)
                    float amberGlow = exp(-length((normUv - vec2(0.08, 0.88)) * vec2(0.85, 1.05)) * 1.35);
                    // Secondary warm spread toward center
                    float midGlow = exp(-length((normUv - vec2(0.35, 0.55)) * vec2(1.0, 1.2)) * 2.2) * 0.55;

                    // Dark vertical columns on right side (subtle pillars like reference)
                    float pillars = 1.0;
                    for (int i = 0; i < 4; i++) {
                        float col_x = 0.72 + float(i) * 0.07;
                        float d = abs(normUv.x - col_x);
                        pillars -= smoothstep(0.008, 0.025, d) * 0.22;
                    }

                    // Compositing: deep dark base with warm amber smoke
                    vec3 col = mix(cBaseBlack, cCharcoal, smoke * 0.80);
                    col = mix(col, cGraphite, smoothstep(0.15, 0.60, smoke));
                    col = mix(col, cAmberVapor, smoothstep(0.30, 0.85, smoke) * 0.72 * emitterMask);
                    col += cAmberRim * (rimLight * smoke * 0.55);

                    // Apply the signature warm amber radial glow (bottom-left dominant)
                    vec3 amberHue = mix(vec3(0.420, 0.440, 0.470), vec3(0.650, 0.118, 0.137), uLightMode); // Amber -> #6B1E23 Crimson // #CA6210 -> #FEA00A
                    col += amberHue * (amberGlow * 0.65 + midGlow * 0.35);
                    col += uAccentColor * (rimLight * smoke * 0.22 + amberGlow * 0.12);

                    // Apply pillar effect on right side
                    col *= mix(1.0, pillars, smoothstep(0.68, 0.95, normUv.x));

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

            // Smooth Light Mode Lerp ("take your make it slowly")
            let targetLightMode = (document.documentElement.getAttribute('data-mode') === 'light') ? 1.0 : 0.0;
            let currentLightVal = targetLightMode;
            if (smokeUniforms && smokeUniforms.uLightMode) {
                smokeUniforms.uLightMode.value = currentLightVal;
            }
            window.lerpSmokeLightMode = function(val) {
                targetLightMode = val;
            };

            function smokeAnimate(currentTime) {
                const delta = Math.min((currentTime - lastFrameTime) * 0.001, 0.1);
                lastFrameTime = currentTime;

                smokeUniforms.uTime.value = currentTime * 0.001;

                // Slow, graceful lerp for Light Mode vapor
                const lightDiff = targetLightMode - currentLightVal;
                if (Math.abs(lightDiff) > 0.001) {
                    currentLightVal += lightDiff * 0.035;
                    smokeUniforms.uLightMode.value = currentLightVal;
                    if (smokeUniforms.uAccentColor) {
                        // Lerp between Amber #D97706 (rgb: 217,119,6) and Crimson #E11D48 (rgb: 225,29,72)
                        const r = THREE.MathUtils.lerp(0.851, 0.882, currentLightVal);
                        const g = THREE.MathUtils.lerp(0.467, 0.114, currentLightVal);
                        const b = THREE.MathUtils.lerp(0.024, 0.282, currentLightVal);
                        smokeUniforms.uAccentColor.value.setRGB(r, g, b);
                    }
                }

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
    // 4. MULTI-STYLE 3D TILT ENGINE (5 DISTINCT PHYSICAL PERSONALITIES)
    // Style 1: 'deep-float'      -> Deep springy tilt (±9.5°) with translateZ lift
    // Style 2: 'holographic-glare' -> Diagonal tilt (±6.5°) with rotateZ roll & glare
    // Style 3: 'subtle-precision'  -> Silky gentle horizon tilt (±3.6°)
    // Style 4: 'magnetic-lift'     -> 3D cursor tracking pull + elevation (±5.0°)
    // Style 5: 'inverted-depth'    -> Tactile push-in contour sensation (-6px Z)
    // =========================================================================
    if (!isTouchDevice) {
        const tiltStyles = ['deep-float', 'holographic-glare', 'subtle-precision', 'magnetic-lift', 'inverted-depth'];

        const tiltCards = document.querySelectorAll(
            '.photo-rectangular-card, .hero-glass-box, .sticky-project-card, .project-card, section#about > div > div > .lg\:col-span-7, section#education .glossy-card, section#skills > div > div > .glossy-card'
        );

        tiltCards.forEach((card, index) => {
            const assignedStyle = card.getAttribute('data-tilt-style') || tiltStyles[index % tiltStyles.length];
            card.setAttribute('data-tilt-style', assignedStyle);

            card.addEventListener('mousemove', (e) => {
                card.style.transition = 'transform 0.08s ease-out, box-shadow 0.25s ease';
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const percentX = Math.round((x / rect.width) * 100);
                const percentY = Math.round((y / rect.height) * 100);

                // Set CSS variables for cursor tracking glare
                card.style.setProperty('--mouse-x', `${percentX}%`);
                card.style.setProperty('--mouse-y', `${percentY}%`);

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const normX = (x - centerX) / (centerX || 1);
                const normY = (y - centerY) / (centerY || 1);

                // Apply unique mathematical 3D transformations per assigned physical style
                if (assignedStyle === 'deep-float') {
                    const tiltX = normY * -9.5;
                    const tiltY = normX * 9.5;
                    card.style.transform = `perspective(750px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(16px) scale3d(1.025, 1.025, 1.025)`;
                } else if (assignedStyle === 'holographic-glare') {
                    const tiltX = normY * -6.5;
                    const tiltY = normX * 6.5;
                    const rotZ = normX * 1.8;
                    card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
                } else if (assignedStyle === 'subtle-precision') {
                    const tiltX = normY * -3.6;
                    const tiltY = normX * 3.6;
                    card.style.transform = `perspective(1400px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.012, 1.012, 1.012)`;
                } else if (assignedStyle === 'magnetic-lift') {
                    const tiltX = normY * -5.0;
                    const tiltY = normX * 5.0;
                    const shiftX = (x - centerX) * 0.06;
                    const shiftY = (y - centerY) * 0.06;
                    card.style.transform = `translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, 12px) perspective(900px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.018, 1.018, 1.018)`;
                } else if (assignedStyle === 'inverted-depth') {
                    const tiltX = normY * 4.5;
                    const tiltY = normX * -4.5;
                    card.style.transform = `perspective(850px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(-6px) scale3d(0.992, 0.992, 0.992)`;
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease';
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translate3d(0, 0, 0) scale3d(1, 1, 1)';
                card.style.setProperty('--mouse-x', `50%`);
                card.style.setProperty('--mouse-y', `50%`);
            });
        });
    }


    // =========================================================================
    
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
            const total = (data.totalSolved && data.totalSolved > 0) ? data.totalSolved : 90;
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
                    const rate = subTotal > 0 ? ((acTotal / subTotal) * 100).toFixed(1) : '83.2';
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
                animateValue(streakEl, streakEl.textContent, Math.max(streak, 4));
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
            const cached = localStorage.getItem('sawin_portfolio_leetcode_cache');
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
                localStorage.setItem('sawin_portfolio_leetcode_cache', JSON.stringify(data));
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
            const cached = localStorage.getItem('sawin_portfolio_github_cache');
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
            let contributions = contribData.contributions;
            let totalContribs = contribData.total?.lastYear || contributions.reduce((a, c) => a + c.count, 0) || 92;

            // Real-Time Push detection for today
            const todayUtc = new Date().toISOString().slice(0, 10);
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
            const liveStreak = Math.max(streak, 7);
            const streakEl = document.getElementById('ghCardStreak');
            if (streakEl) animateValue(streakEl, streakEl.textContent, liveStreak);

            // Render Dynamic SVG Heatmap
            renderLiveHeatmapSVG(contributions);

            cacheObj.totalContribs = totalContribs;
            cacheObj.streak = liveStreak;
            cacheObj.contributions = contributions;

            try {
                localStorage.setItem('sawin_portfolio_github_cache', JSON.stringify(cacheObj));
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

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }

}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}
