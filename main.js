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

document.addEventListener('DOMContentLoaded', () => {

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    // =========================================================================
    // 0. CINEMATIC INTRO SCREEN & HERO REVEAL CONTROLLER
    // =========================================================================
    const introOverlay = document.getElementById('cinematicIntro');
    const enterBtn = document.getElementById('enterPortfolioBtn');
    const navbar = document.getElementById('navbar');
    let hasEntered = false;

    function enterPortfolio() {
        if (hasEntered) return;
        hasEntered = true;

        if (enterBtn) enterBtn.classList.add('fading-out');

        if (introOverlay) {
            introOverlay.classList.add('has-entered');
            setTimeout(() => {
                introOverlay.style.display = 'none';
            }, 1000);
        }

        if (navbar) {
            navbar.classList.remove('navbar-hidden');
        }

        // Staggered smooth hero reveal
        const heroPhoto = document.querySelector('.reveal-photo');
        if (heroPhoto) {
            setTimeout(() => {
                heroPhoto.classList.add('active');
            }, 250);
        }
    }

    if (enterBtn) {
        enterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            enterPortfolio();
        });
    }

    if (introOverlay) {
        introOverlay.addEventListener('click', () => {
            enterPortfolio();
        });
    }

    window.addEventListener('keydown', (e) => {
        if (!hasEntered && (e.key === 'Enter' || e.key === ' ')) {
            enterPortfolio();
        }
    });

    // Auto-enter timer fallback after 3.2s so passive visitors seamlessly transition
    setTimeout(() => {
        if (!hasEntered) {
            enterPortfolio();
        }
    }, 3200);


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

        const initialSize = isIdle ? (Math.random() * 8 + 14) : (Math.random() * 12 + 18);
        const targetExpansion = isIdle ? (initialSize * 2.4) : (initialSize * 3.6 + Math.random() * 15);
        const rot = (Math.random() - 0.5) * 60;

        wisp.style.left = `${px}px`;
        wisp.style.top = `${py}px`;
        wisp.style.width = `${initialSize}px`;
        wisp.style.height = `${initialSize}px`;
        wisp.style.opacity = isIdle ? '0.18' : (Math.random() * 0.15 + 0.32).toFixed(2);
        wisp.style.transform = `translate3d(-50%, -50%, 0) scale(0.6) rotate(0deg)`;
        wisp.style.transition = 'transform 1.4s cubic-bezier(0.12, 0.75, 0.35, 1), opacity 1.4s cubic-bezier(0.2, 0.7, 0.3, 1)';

        document.body.appendChild(wisp);

        // Buoyancy drift (slightly upward) and drag opposing motion
        const driftX = (Math.random() - 0.5) * 20 - (vx || 0) * 0.22;
        const driftY = (Math.random() - 0.5) * 16 - (vy || 0) * 0.22 - (Math.random() * 16 + 10);

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
        }, 1450);
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
        let width = window.innerWidth;
        let height = window.innerHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: false,
            powerPreference: 'high-performance',
            depth: false,
            stencil: false
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
                gl_Position = vec4(position, 1.0);
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

            // Fast Simplex 2D/3D Noise
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

            float fbm(vec2 p, float t) {
                float v = 0.0;
                float a = 0.5;
                mat2 rot = mat2(cos(0.52), sin(0.52), -sin(0.52), cos(0.52));
                for (int i = 0; i < 5; i++) {
                    v += a * snoise(p + vec2(t * 0.12, -t * 0.18));
                    p = rot * p * 2.02 + vec2(120.0, 60.0);
                    a *= 0.48;
                }
                return v * 0.5 + 0.5;
            }

            // Multi-layer domain warping for organic volumetric vapor curls
            float getSmokeDensity(vec2 p, float t) {
                vec2 q = vec2(
                    fbm(p + vec2(0.0, 0.0), t),
                    fbm(p + vec2(5.2, 1.3), t)
                );

                vec2 r = vec2(
                    fbm(p + 2.6 * q + vec2(1.7, 9.2), t * 1.15),
                    fbm(p + 2.6 * q + vec2(8.3, 2.8), t * 1.15)
                );

                float d = fbm(p + 3.2 * r, t * 0.85);
                return smoothstep(0.22, 0.78, d);
            }

            float hash(vec2 p) {
                return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
            }

            void main() {
                vec2 uv = vUv;
                vec2 normUv = vec2(uv.x, 1.0 - uv.y);
                float aspect = uResolution.x / uResolution.y;

                // Slow, graceful, continuous time
                float slowTime = uTime * 0.065;

                // Composition: Emitter in Upper-Right Corner and Right Edge
                vec2 urPoint = vec2(0.96, 0.06);
                vec2 urDistVec = (normUv - urPoint) * vec2(1.0, 1.45);
                float distUR = length(urDistVec);
                float cornerSmoke = smoothstep(1.15, 0.12, distUR);

                float rightEdgeSmoke = smoothstep(0.48, 0.98, normUv.x) * smoothstep(1.0, 0.15, normUv.y) * 0.74;
                float topWisps = smoothstep(0.48, 0.04, normUv.y) * smoothstep(0.35, 0.88, normUv.x) * 0.42;

                float emitterMask = max(cornerSmoke * 0.95, max(rightEdgeSmoke, topWisps));

                // Large Negative Space: Keep left side and center almost completely black
                float negativeSpace = smoothstep(0.28, 0.78, normUv.x + (1.0 - normUv.y) * 0.42);
                emitterMask *= negativeSpace;

                // Mouse Pointer Interaction in the smoke field
                vec2 mPos = vec2(uMouse.x, 1.0 - uMouse.y);
                vec2 mDiff = (normUv - mPos) * vec2(aspect, 1.0);
                float mDist = length(mDiff);
                float mInfluence = smoothstep(0.38, 0.0, mDist);

                vec2 mSwirl = vec2(-mDiff.y, mDiff.x) * mInfluence * 0.42;
                vec2 mPush = vec2(uMouseVel.x, -uMouseVel.y) * mInfluence * 0.75;

                // Base Domain Coordinates with Gentle Inward & Upward Drift
                vec2 p = normUv * vec2(3.2 * aspect, 3.2);
                p.y -= slowTime * 0.36; // upward drift
                p.x -= slowTime * 0.24; // inward drift toward center
                p += mSwirl + mPush;

                float smoke = getSmokeDensity(p, slowTime);
                smoke *= emitterMask;

                // Low-Key Cinematic Lighting Palette
                vec3 cBaseBlack   = vec3(0.027, 0.027, 0.035); // #070709
                vec3 cCharcoal    = vec3(0.067, 0.071, 0.082); // #111215
                vec3 cGraphite    = vec3(0.133, 0.141, 0.165); // #22242a
                vec3 cSmokySilver = vec3(0.420, 0.445, 0.495); // #6b7280 muted smoky silver
                vec3 cCoolBlue    = vec3(0.086, 0.125, 0.196); // #162032 diffused cool-blue glow

                // Soft Backlighting from Upper-Right Edge revealing smoke contours
                vec2 lightDir = normalize(urPoint - normUv);
                float eps = 0.007;
                float sX = getSmokeDensity(p + vec2(eps, 0.0), slowTime) * emitterMask;
                float sY = getSmokeDensity(p + vec2(0.0, eps), slowTime) * emitterMask;
                vec2 grad = normalize(vec2(sX - smoke, sY - smoke) + vec2(0.0001));
                float rim = pow(max(0.0, dot(grad, lightDir)), 2.6) * 1.5;

                // Faint diffused cool-blue glow near lower center (barely illuminating darkness)
                float coolGlow = exp(-length((normUv - vec2(0.5, 0.88)) * vec2(1.0, 1.4)) * 3.4);

                // Color compositing
                vec3 col = mix(cBaseBlack, cCharcoal, smoke * 0.75);
                col = mix(col, cGraphite, smoke * smoke);
                col += cSmokySilver * (rim * smoke * 0.85);
                col += cCoolBlue * (coolGlow * 0.38);

                // Fine Atmospheric Detail: Faint horizontal texture & delicate film grain
                float horiz = sin(normUv.y * uResolution.y * 1.6) * 0.006;
                float grain = (hash(normUv * uResolution.xy + fract(uTime * 17.3)) - 0.5) * 0.022;
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

            renderer.render(scene, camera);

            // Update 3D Corner Props for Slides 3-7 in the same loop
            updateAllSectionProps();

            requestAnimationFrame(smokeAnimate);
        }

        requestAnimationFrame(smokeAnimate);
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

    // Auto-trigger the hero photo reveal animation on load with smooth slide-in
    const heroPhotoWrap = document.querySelector('.reveal-photo');
    if (heroPhotoWrap) {
        setTimeout(() => {
            heroPhotoWrap.classList.add('active');
        }, 120);
    }

    if ('IntersectionObserver' in window) {
        // Hollow-to-Solid Scroll Fill Typography
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scroll-fill-active');
                    titleObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

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

});
