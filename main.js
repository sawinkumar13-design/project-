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
    // 1. POINTER POSITION & VOLUMETRIC SMOKE EMITTER ENGINE
    // =========================================================================
    let targetMouseX = window.innerWidth * 0.5;
    let targetMouseY = window.innerHeight * 0.5;
    let mouseX = window.innerWidth * 0.5;
    let mouseY = window.innerHeight * 0.5;
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

    const activeWisps = [];
    const MAX_WISPS = 35;

    // Emits soft volumetric vapor wisps directly from the pointer
    function emitPointerSmoke(px, py, vx, vy, isIdle = false) {
        if (activeWisps.length > MAX_WISPS) {
            const oldest = activeWisps.shift();
            if (oldest.el && oldest.el.parentNode) oldest.el.parentNode.removeChild(oldest.el);
        }

        const wisp = document.createElement('div');
        wisp.className = 'pointer-smoke-wisp';

        const initialSize = isIdle ? (Math.random() * 8 + 18) : (Math.random() * 12 + 24);
        const targetExpansion = isIdle ? (initialSize * 2.2) : (initialSize * 3.2 + Math.random() * 14);
        const rot = (Math.random() - 0.5) * 60;

        wisp.style.left = `${px}px`;
        wisp.style.top = `${py}px`;
        wisp.style.width = `${initialSize}px`;
        wisp.style.height = `${initialSize}px`;
        wisp.style.opacity = isIdle ? '0.35' : (Math.random() * 0.2 + 0.58).toFixed(2);
        wisp.style.transform = `translate3d(-50%, -50%, 0) scale(0.6) rotate(0deg)`;
        wisp.style.transition = 'transform 1.35s cubic-bezier(0.12, 0.75, 0.35, 1), opacity 1.35s cubic-bezier(0.2, 0.7, 0.3, 1)';

        document.body.appendChild(wisp);

        // Buoyancy drift (slightly upward) and drag opposing motion
        const driftX = (Math.random() - 0.5) * 22 - (vx || 0) * 0.25;
        const driftY = (Math.random() - 0.5) * 18 - (vy || 0) * 0.25 - (Math.random() * 18 + 12);

        requestAnimationFrame(() => {
            wisp.style.opacity = '0';
            wisp.style.transform = `translate3d(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px), 0) scale(${targetExpansion / initialSize}) rotate(${rot}deg)`;
        });

        const wispObj = { el: wisp };
        activeWisps.push(wispObj);

        setTimeout(() => {
            if (wisp.parentNode) wisp.parentNode.removeChild(wisp);
            const idx = activeWisps.indexOf(wispObj);
            if (idx !== -1) activeWisps.splice(idx, 1);
        }, 1400);
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

            // Emit smoke vapor wisps while moving
            if (moveDist > 2.5 && (now - lastMoteTime > 22)) {
                lastMoteTime = now;
                emitPointerSmoke(targetMouseX, targetMouseY, vx, vy);
                if (moveDist > 16) {
                    emitPointerSmoke((targetMouseX + prevMouseX) * 0.5, (targetMouseY + prevMouseY) * 0.5, vx, vy);
                }
            }
            prevMouseX = targetMouseX;
            prevMouseY = targetMouseY;
        }, { passive: true });

        // Gentle idle smoke breath when mouse pauses
        setInterval(() => {
            if (isMouseOnScreen && (performance.now() - lastMoveTime > 400)) {
                emitPointerSmoke(targetMouseX, targetMouseY, 0, 0, true);
            }
        }, 650);

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
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

            const smokeUniforms = {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2(width, height) },
                uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                uMouseVel: { value: new THREE.Vector2(0, 0) },
                uScroll: { value: 0 }
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

                // Fast Simplex 2D Noise
                vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

                float snoise(vec2 v) {
                    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                    vec2 i  = floor(v + dot(v, C.yy));
                    vec2 x0 = v -   i + dot(i, C.xx);
                    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                    vec4 x12 = x0.xyxy + C.xxzz;
                    x12.xy -= i1;
                    i = mod289(i);
                    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
                    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
                    m = m * m;
                    m = m * m;
                    vec3 x = 2.0 * fract(p * C.www) - 1.0;
                    vec3 h = abs(x) - 0.5;
                    vec3 ox = floor(x + 0.5);
                    vec3 a0 = x - ox;
                    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
                    vec3 g;
                    g.x  = a0.x  * x0.x  + h.x  * x0.y;
                    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                    return 130.0 * dot(m, g);
                }

                // 3-Octave Fast FBM with 2D rotation for rich, natural turbulence
                float fbm(vec2 p, float t) {
                    float v = 0.0;
                    float a = 0.5;
                    mat2 rot = mat2(0.87, 0.49, -0.49, 0.87);
                    for (int i = 0; i < 3; i++) {
                        v += a * snoise(p + vec2(t * 0.14, -t * 0.20));
                        p = rot * p * 2.06 + vec2(100.0, 50.0);
                        a *= 0.48;
                    }
                    return v * 0.5 + 0.5;
                }

                float hash(vec2 p) {
                    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
                }

                void main() {
                    vec2 uv = vUv;
                    vec2 normUv = vec2(uv.x, 1.0 - uv.y);
                    float aspect = uResolution.x / uResolution.y;

                    // Slow, graceful continuous time
                    float slowTime = uTime * 0.07;

                    // Composition: Emitter in Upper-Right Corner and Right Edge
                    vec2 urPoint = vec2(0.96, 0.08);
                    vec2 urDistVec = (normUv - urPoint) * vec2(1.0, 1.35);
                    float distUR = length(urDistVec);
                    float cornerSmoke = smoothstep(1.25, 0.12, distUR);

                    float rightEdgeSmoke = smoothstep(0.42, 0.96, normUv.x) * smoothstep(1.0, 0.15, normUv.y) * 0.82;
                    float topWisps = smoothstep(0.45, 0.02, normUv.y) * smoothstep(0.30, 0.88, normUv.x) * 0.52;

                    float emitterMask = max(cornerSmoke * 0.95, max(rightEdgeSmoke, topWisps));

                    // Negative Space: Left side and center remain dark obsidian charcoal
                    float negativeSpace = smoothstep(0.24, 0.72, normUv.x + (1.0 - normUv.y) * 0.46);
                    emitterMask *= negativeSpace;

                    // Mouse Pointer Swirl & Displacement
                    vec2 mPos = vec2(uMouse.x, 1.0 - uMouse.y);
                    vec2 mDiff = (normUv - mPos) * vec2(aspect, 1.0);
                    float mDist = length(mDiff);
                    float mInfluence = smoothstep(0.38, 0.0, mDist);
                    vec2 mSwirl = vec2(-mDiff.y, mDiff.x) * mInfluence * 0.48;
                    vec2 mPush = vec2(uMouseVel.x, -uMouseVel.y) * mInfluence * 0.85;

                    // Base Domain with Organic Upward and Inward Drift
                    vec2 p = normUv * vec2(3.0 * aspect, 3.0);
                    p.y -= slowTime * 0.38; // upward drift
                    p.x -= slowTime * 0.26; // inward drift toward center
                    p += mSwirl + mPush;

                    // Multi-Layer Domain Warping for Volumetric Vapor Curls
                    vec2 q = vec2(
                        fbm(p + vec2(0.0, 0.0), slowTime),
                        fbm(p + vec2(5.2, 1.3), slowTime)
                    );

                    vec2 r = vec2(
                        fbm(p + 2.8 * q + vec2(1.7, 9.2), slowTime * 1.15),
                        fbm(p + 2.8 * q + vec2(8.3, 2.8), slowTime * 1.15)
                    );

                    float rawDensity = fbm(p + 3.2 * r, slowTime * 0.85);
                    float smoke = smoothstep(0.18, 0.82, rawDensity) * emitterMask;

                    // Low-Key Cinematic Lighting Palette (High Contrast & Visible Vapor)
                    vec3 cBaseBlack    = vec3(0.024, 0.025, 0.032); // #060608
                    vec3 cCharcoal     = vec3(0.075, 0.082, 0.098); // #131519
                    vec3 cGraphite     = vec3(0.180, 0.195, 0.225); // #2e3239
                    vec3 cSmokySilver  = vec3(0.580, 0.615, 0.675); // #949dad visible smoky silver
                    vec3 cSilverRim    = vec3(0.820, 0.850, 0.910); // #d1d9e8 specular rim
                    vec3 cCoolBlue     = vec3(0.110, 0.165, 0.255); // #1c2a41 subtle cool blue

                    // Directional Backlighting from Upper-Right Emitter
                    vec2 lightDir = normalize(urPoint - normUv);
                    vec2 smokeGrad = normalize((r - vec2(0.5)) + vec2(0.001));
                    float rimLight = pow(max(0.0, dot(smokeGrad, lightDir)), 2.2);

                    // Subtle cool-blue ambient illumination near bottom center
                    float coolGlow = exp(-length((normUv - vec2(0.5, 0.88)) * vec2(1.0, 1.4)) * 3.2);

                    // Compositing with high aesthetic contrast & visible volumetric body
                    vec3 col = mix(cBaseBlack, cCharcoal, smoke * 0.85);
                    col = mix(col, cGraphite, smoothstep(0.12, 0.60, smoke));
                    col = mix(col, cSmokySilver, smoothstep(0.35, 0.88, smoke) * 0.75);
                    col += cSilverRim * (rimLight * smoke * 0.65);
                    col += cCoolBlue * (coolGlow * 0.35);

                    // Faint atmospheric scanline & delicate grain
                    float horiz = sin(normUv.y * uResolution.y * 1.5) * 0.005;
                    float grain = (hash(normUv * uResolution.xy + fract(uTime * 17.3)) - 0.5) * 0.020;
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
                    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate3d(-50%, -50%, 0)`;

                    auraX += (targetMouseX - auraX) * 0.09;
                    auraY += (targetMouseY - auraY) * 0.09;
                    cursorAura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0) translate3d(-50%, -50%, 0)`;
                }

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
        }
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

}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}
