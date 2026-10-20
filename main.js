/**
 * Sawin Kumar Portfolio — Aesthetic Interactive Singularity & Ethereal Nebula
 * - Three.js WebGL Engine with Custom GLSL Procedural Shaders
 * - Central Singularity with Relativistic Photon Ring & Pulsating Horizon
 * - Flowing Accretion Disk Vortex & Gravitational Lensing Arc (Einstein Ring)
 * - Orbiting 3D Stardust Particle Stream with Keplerian & Micro-Gravity Dynamics
 * - Volumetric Ethereal Deep Space Nebula Layer (Low-Saturation Cinematic Palette)
 * - Minimal Animated Custom Cursor with Stardust Particles & Damped Magnetic Lag
 * - 3D Floating Corner Props Parallax Engine for Slides 3-7
 * - Smooth Perspective Tilt, Magnetic CTA, Scroll-Fill Typography & Filter Systems
 */

document.addEventListener('DOMContentLoaded', () => {

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    // =========================================================================
    // 1. POINTER POSITION & CUSTOM ANIMATED CURSOR ENGINE
    // =========================================================================
    let targetMouseX = window.innerWidth / 2;
    let targetMouseY = window.innerHeight / 2;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let normMouseX = 0;
    let normMouseY = 0;
    let isMouseOnScreen = false;

    // Custom Cursor DOM Elements (Desktop Only)
    const cursorContainer = document.getElementById('singularityCursor');
    const cursorDot = cursorContainer ? cursorContainer.querySelector('.cursor-dot') : null;
    const cursorRing = cursorContainer ? cursorContainer.querySelector('.cursor-ring') : null;
    const cursorAura = cursorContainer ? cursorContainer.querySelector('.cursor-aura') : null;

    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;
    let auraX = window.innerWidth / 2;
    let auraY = window.innerHeight / 2;

    // Ephemeral Stardust Particles following cursor
    const cursorParticles = [];
    const MAX_CURSOR_PARTICLES = 25;

    function spawnCursorMote(px, py) {
        if (cursorParticles.length > MAX_CURSOR_PARTICLES) {
            const old = cursorParticles.shift();
            if (old.el && old.el.parentNode) old.el.parentNode.removeChild(old.el);
        }
        const mote = document.createElement('div');
        mote.className = 'cursor-mote';
        mote.style.position = 'fixed';
        mote.style.left = `${px + (Math.random() - 0.5) * 8}px`;
        mote.style.top = `${py + (Math.random() - 0.5) * 8}px`;
        mote.style.width = `${Math.random() * 2.5 + 1.2}px`;
        mote.style.height = mote.style.width;
        mote.style.borderRadius = '50%';
        mote.style.pointerEvents = 'none';
        mote.style.zIndex = '9998';
        mote.style.backgroundColor = Math.random() > 0.5 ? '#63788A' : '#30203F';
        mote.style.boxShadow = '0 0 5px rgba(99, 120, 138, 0.6)';
        mote.style.opacity = '0.85';
        mote.style.transition = 'opacity 0.75s ease-out, transform 0.75s ease-out';
        mote.style.transform = 'translate3d(-50%, -50%, 0) scale(1)';
        document.body.appendChild(mote);

        const particleObj = {
            el: mote,
            createdAt: performance.now(),
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6 - 0.25
        };
        cursorParticles.push(particleObj);

        requestAnimationFrame(() => {
            mote.style.opacity = '0';
            mote.style.transform = `translate3d(-50%, -50%, 0) scale(0.2) translate3d(${particleObj.vx * 24}px, ${particleObj.vy * 24}px, 0)`;
        });

        setTimeout(() => {
            if (mote.parentNode) mote.parentNode.removeChild(mote);
            const idx = cursorParticles.indexOf(particleObj);
            if (idx !== -1) cursorParticles.splice(idx, 1);
        }, 800);
    }

    if (!isTouchDevice && cursorContainer) {
        window.addEventListener('mousemove', (e) => {
            targetMouseX = e.clientX;
            targetMouseY = e.clientY;
            normMouseX = (e.clientX / window.innerWidth) * 2 - 1;
            normMouseY = -(e.clientY / window.innerHeight) * 2 + 1;

            if (!isMouseOnScreen) {
                isMouseOnScreen = true;
                cursorContainer.style.opacity = '1';
            }

            // Dot moves instantly
            if (cursorDot) {
                cursorDot.style.transform = `translate3d(${targetMouseX}px, ${targetMouseY}px, 0) translate3d(-50%, -50%, 0)`;
            }

            // Spawn subtle stardust motes on movement
            if (Math.random() > 0.55) {
                spawnCursorMote(targetMouseX, targetMouseY);
            }
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
            isMouseOnScreen = false;
            cursorContainer.style.opacity = '0';
        });

        // Hover effect over interactive targets
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .glossy-card, .tool-chip, .filter-btn, .cosmic-btn-primary, [role="button"]');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorContainer.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorContainer.classList.remove('hovering'));
        });
    }


    // =========================================================================
    // 2. AESTHETIC INTERACTIVE SINGULARITY & ETHEREAL NEBULA (THREE.JS SHADERS)
    // =========================================================================
    const canvas = document.getElementById('singularityCanvas') || document.getElementById('galaxyCanvas');

    let updateAllSectionProps = () => {};

    if (canvas && typeof THREE !== 'undefined') {
        let width = window.innerWidth;
        let height = window.innerHeight;

        // Scene, Camera & Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
        camera.position.set(0, 0, 8.2);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0x050609, 1.0);

        // Singularity Hierarchy Group (Pivots, tilts, and breathes in 3D)
        const singularityGroup = new THREE.Group();
        scene.add(singularityGroup);

        // Uniforms for Shaders
        const sharedUniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(width, height) },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uScroll: { value: 0 }
        };

        // ---------------------------------------------------------------------
        // A. Volumetric Ethereal Nebula Background Layer (Far Z-Plane)
        // ---------------------------------------------------------------------
        const nebulaGeo = new THREE.PlaneGeometry(42, 26);
        const nebulaMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: sharedUniforms.uTime,
                uResolution: sharedUniforms.uResolution,
                uMouse: sharedUniforms.uMouse
            },
            depthWrite: false,
            depthTest: false,
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision highp float;
                uniform float uTime;
                uniform vec2 uResolution;
                uniform vec2 uMouse;
                varying vec2 vUv;

                vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

                float snoise(vec2 v) {
                    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                    vec2 i  = floor(v + dot(v, C.yy));
                    vec2 x0 = v -   i + dot(i, C.xx);
                    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                    vec4 x12 = x0.xyxy + C.xxzz;
                    x12.xy -= i1;
                    i = mod289(i);
                    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
                    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                    m = m*m;
                    m = m*m;
                    vec3 x = 2.0 * fract(p * C.www) - 1.0;
                    vec3 h = abs(x) - 0.5;
                    vec3 ox = floor(x + 0.5);
                    vec3 a0 = x - ox;
                    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
                    vec3 g;
                    g.x  = a0.x  * x0.x  + h.x  * x0.y;
                    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                    return 130.0 * dot(m, g);
                }

                float fbm(vec2 p) {
                    float total = 0.0;
                    float amp = 0.5;
                    for (int i = 0; i < 4; i++) {
                        total += snoise(p) * amp;
                        p = p * 2.05 + vec2(13.4, 27.2);
                        amp *= 0.5;
                    }
                    return total;
                }

                void main() {
                    vec2 uv = vUv;
                    vec2 centeredUv = uv - 0.5;
                    centeredUv.x *= uResolution.x / uResolution.y;

                    float t = uTime * 0.028;
                    vec2 p = centeredUv * 1.35 + uMouse * 0.09;

                    float n1 = fbm(p + vec2(t * 0.35, t * 0.22));
                    float n2 = fbm(p * 1.75 - vec2(t * 0.28, t * 0.45) + vec2(n1 * 0.7));
                    float nebulaVal = smoothstep(-0.25, 0.75, n2);

                    // Low-saturation cinematic palette
                    vec3 cMidnight = vec3(0.0196, 0.0235, 0.0353); // #050609
                    vec3 cDarkNavy = vec3(0.0392, 0.0627, 0.1255); // #0A1020
                    vec3 cMutedIndigo = vec3(0.0980, 0.0824, 0.1804); // #19152E
                    vec3 cDeepViolet = vec3(0.1882, 0.1255, 0.2471); // #30203F
                    vec3 cDesatTeal = vec3(0.0706, 0.2039, 0.2196); // #123438

                    float cycle = sin(uTime * 0.035) * 0.5 + 0.5;
                    vec3 nebulaColor1 = mix(cDarkNavy, cMutedIndigo, n1 * 0.5 + 0.5);
                    vec3 nebulaColor2 = mix(cDeepViolet, cDesatTeal, cycle);
                    vec3 finalNebula = mix(nebulaColor1, nebulaColor2, nebulaVal * 0.65);

                    vec3 finalColor = mix(cMidnight, finalNebula, nebulaVal * 0.52);

                    float distFromCenter = length(centeredUv);
                    float vignette = smoothstep(1.35, 0.35, distFromCenter);
                    finalColor *= (0.42 + 0.58 * vignette);

                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `
        });
        const nebulaMesh = new THREE.Mesh(nebulaGeo, nebulaMat);
        nebulaMesh.position.z = -13;
        scene.add(nebulaMesh);

        // ---------------------------------------------------------------------
        // B. The Singularity Event Horizon Sphere (Heart of the Singularity)
        // ---------------------------------------------------------------------
        const horizonGeo = new THREE.SphereGeometry(1.22, 64, 64);
        const horizonMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: sharedUniforms.uTime,
                uMouse: sharedUniforms.uMouse
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                uniform float uTime;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    // Organic breathing pulse
                    float breath = sin(uTime * 0.7) * 0.025;
                    vec3 pos = position * (1.0 + breath);
                    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
                    vViewPosition = -mvPos.xyz;
                    gl_Position = projectionMatrix * mvPos;
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                uniform float uTime;
                void main() {
                    vec3 viewDir = normalize(vViewPosition);
                    vec3 normal = normalize(vNormal);
                    float NdotV = dot(normal, viewDir);
                    float fresnel = 1.0 - max(NdotV, 0.0);
                    fresnel = pow(fresnel, 4.8);

                    float breath = sin(uTime * 0.7) * 0.5 + 0.5;
                    vec3 cSilverBlue = vec3(0.3882, 0.4706, 0.5412); // #63788A
                    vec3 cDeepViolet = vec3(0.1882, 0.1255, 0.2471); // #30203F
                    vec3 cTeal = vec3(0.0706, 0.2039, 0.2196);       // #123438

                    vec3 photonRing = mix(cDeepViolet, cSilverBlue, fresnel * (0.8 + 0.2 * breath));
                    photonRing = mix(photonRing, cTeal, 0.22);
                    vec3 coreBlack = vec3(0.012, 0.014, 0.02);
                    vec3 finalColor = mix(coreBlack, photonRing, fresnel * 0.95);
                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `
        });
        const horizonSphere = new THREE.Mesh(horizonGeo, horizonMat);
        singularityGroup.add(horizonSphere);

        // ---------------------------------------------------------------------
        // C. Flowing Accretion Disk Vortex (Gravitational Energy Filaments)
        // ---------------------------------------------------------------------
        const diskGeo = new THREE.RingGeometry(1.36, 6.4, 160, 48);
        const diskMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: sharedUniforms.uTime,
                uMouse: sharedUniforms.uMouse
            },
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexShader: `
                varying vec3 vLocalPos;
                varying vec2 vUv;
                void main() {
                    vLocalPos = position;
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision highp float;
                varying vec3 vLocalPos;
                varying vec2 vUv;
                uniform float uTime;
                uniform vec2 uMouse;

                vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

                float snoise(vec2 v) {
                    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                    vec2 i  = floor(v + dot(v, C.yy));
                    vec2 x0 = v -   i + dot(i, C.xx);
                    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                    vec4 x12 = x0.xyxy + C.xxzz;
                    x12.xy -= i1;
                    i = mod289(i);
                    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
                    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                    m = m*m;
                    m = m*m;
                    vec3 x = 2.0 * fract(p * C.www) - 1.0;
                    vec3 h = abs(x) - 0.5;
                    vec3 ox = floor(x + 0.5);
                    vec3 a0 = x - ox;
                    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
                    vec3 g;
                    g.x  = a0.x  * x0.x  + h.x  * x0.y;
                    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                    return 130.0 * dot(m, g);
                }

                void main() {
                    float r = length(vLocalPos.xy);
                    float theta = atan(vLocalPos.y, vLocalPos.x);

                    float innerR = 1.36;
                    float outerR = 6.4;
                    if (r < innerR || r > outerR) discard;

                    float normR = (r - innerR) / (outerR - innerR);

                    // Keplerian differential angular velocity
                    float orbitalSpeed = 1.6 / pow(r, 1.25);
                    float flowAngle = theta - uTime * orbitalSpeed;

                    // Mouse gravitational warp
                    float mouseDist = length(uMouse);
                    float mouseAngle = atan(uMouse.y, uMouse.x);
                    float warp = sin(flowAngle - mouseAngle) * 0.22 * mouseDist * (1.0 - normR);

                    vec2 noiseCoord1 = vec2((flowAngle + warp) * 3.2, r * 3.8);
                    vec2 noiseCoord2 = vec2((flowAngle * 5.6 - uTime * 0.36), r * 7.6);
                    float n1 = snoise(noiseCoord1);
                    float n2 = snoise(noiseCoord2);
                    float filament = pow(max(0.0, n1 * 0.6 + n2 * 0.4 + 0.3), 1.7);

                    float radialFalloff = smoothstep(0.0, 0.07, normR) * smoothstep(1.0, 0.32, normR);
                    float beaming = 0.88 + 0.32 * sin(theta + 0.35);

                    vec3 cNavy = vec3(0.0392, 0.0627, 0.1255);       // #0A1020
                    vec3 cIndigo = vec3(0.0980, 0.0824, 0.1804);     // #19152E
                    vec3 cViolet = vec3(0.1882, 0.1255, 0.2471);     // #30203F
                    vec3 cTeal = vec3(0.0706, 0.2039, 0.2196);       // #123438
                    vec3 cSilverBlue = vec3(0.3882, 0.4706, 0.5412); // #63788A

                    vec3 color = mix(cSilverBlue, cTeal, smoothstep(0.0, 0.28, normR));
                    color = mix(color, cViolet, smoothstep(0.2, 0.65, normR));
                    color = mix(color, cNavy, smoothstep(0.55, 1.0, normR));

                    color *= (0.65 + 0.65 * filament) * beaming;
                    float alpha = radialFalloff * (0.35 + 0.65 * filament);
                    alpha = clamp(alpha, 0.0, 0.82);

                    gl_FragColor = vec4(color, alpha);
                }
            `
        });
        const accretionDisk = new THREE.Mesh(diskGeo, diskMat);
        accretionDisk.rotation.x = Math.PI * 0.35;
        singularityGroup.add(accretionDisk);

        // ---------------------------------------------------------------------
        // D. Secondary Gravitational Lensing Arc (Einstein Ring)
        // ---------------------------------------------------------------------
        const arcGeo = new THREE.RingGeometry(1.35, 3.8, 96, 24);
        const arcMat = diskMat.clone();
        const lensingArc = new THREE.Mesh(arcGeo, arcMat);
        lensingArc.rotation.y = Math.PI * 0.08;
        lensingArc.rotation.z = Math.PI * 0.04;
        singularityGroup.add(lensingArc);

        // ---------------------------------------------------------------------
        // E. Orbiting 3D Stardust Particle Stream
        // ---------------------------------------------------------------------
        const PARTICLE_COUNT = 4500;
        const particleGeo = new THREE.BufferGeometry();
        const pPositions = new Float32Array(PARTICLE_COUNT * 3);
        const pOrbits = new Float32Array(PARTICLE_COUNT * 3);
        const pPhases = new Float32Array(PARTICLE_COUNT);
        const pSizes = new Float32Array(PARTICLE_COUNT);
        const pColors = new Float32Array(PARTICLE_COUNT * 3);

        const paletteColors = [
            new THREE.Color(0x63788A), // Silver-blue
            new THREE.Color(0x123438), // Desaturated teal
            new THREE.Color(0x30203F), // Deep violet
            new THREE.Color(0x19152E), // Muted indigo
            new THREE.Color(0x0A1020)  // Dark navy
        ];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const r = 1.45 + Math.pow(Math.random(), 1.7) * 7.5;
            const theta0 = Math.random() * Math.PI * 2;
            const speedMult = 0.8 + Math.random() * 0.45;

            pOrbits[i * 3 + 0] = r;
            pOrbits[i * 3 + 1] = theta0;
            pOrbits[i * 3 + 2] = speedMult;

            pPhases[i] = Math.random() * Math.PI * 2;
            pSizes[i] = Math.random() * 1.5 + 0.8;

            const col = paletteColors[Math.floor(Math.random() * paletteColors.length)];
            pColors[i * 3 + 0] = col.r;
            pColors[i * 3 + 1] = col.g;
            pColors[i * 3 + 2] = col.b;

            pPositions[i * 3 + 0] = r * Math.cos(theta0);
            pPositions[i * 3 + 1] = 0;
            pPositions[i * 3 + 2] = r * Math.sin(theta0);
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
        particleGeo.setAttribute('aOrbit', new THREE.BufferAttribute(pOrbits, 3));
        particleGeo.setAttribute('aPhase', new THREE.BufferAttribute(pPhases, 1));
        particleGeo.setAttribute('aSize', new THREE.BufferAttribute(pSizes, 1));
        particleGeo.setAttribute('aColor', new THREE.BufferAttribute(pColors, 3));

        const particleMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: sharedUniforms.uTime,
                uMouse: sharedUniforms.uMouse
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexShader: `
                attribute vec3 aOrbit;
                attribute float aPhase;
                attribute float aSize;
                attribute vec3 aColor;

                uniform float uTime;
                uniform vec2 uMouse;

                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    float r = aOrbit.x;
                    float theta0 = aOrbit.y;
                    float speedMult = aOrbit.z;

                    float omega = (0.75 / pow(r, 1.15)) * speedMult;
                    float theta = theta0 + uTime * omega;

                    float x = r * cos(theta);
                    float z = r * sin(theta);
                    float y = sin(theta * 2.5 + aPhase + uTime * 0.35) * (0.075 * r) + cos(theta * 3.0 + aPhase) * 0.04;

                    vec3 pos = vec3(x, y, z);

                    // Mouse pointer gravitational deflection
                    vec3 mouseWorld = vec3(uMouse.x * 4.2, uMouse.y * 2.8, 0.0);
                    vec3 toMouse = pos - mouseWorld;
                    float distToMouse = length(toMouse);
                    float influenceRadius = 3.2;
                    if (distToMouse < influenceRadius && distToMouse > 0.05) {
                        float force = (1.0 - distToMouse / influenceRadius) * 0.28;
                        vec3 swirl = vec3(-toMouse.y, toMouse.x, toMouse.z * 0.5) * force;
                        pos += swirl;
                    }

                    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
                    gl_Position = projectionMatrix * mvPos;

                    gl_PointSize = aSize * (150.0 / -mvPos.z);
                    gl_PointSize = clamp(gl_PointSize, 1.0, 16.0);

                    vColor = aColor;

                    float innerFade = smoothstep(1.36, 1.9, r);
                    float outerFade = smoothstep(9.0, 5.5, r);
                    vAlpha = innerFade * outerFade * 0.85;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    vec2 coord = gl_PointCoord - vec2(0.5);
                    float dist = length(coord);
                    if (dist > 0.5) discard;

                    float intensity = exp(-dist * dist * 6.5);
                    gl_FragColor = vec4(vColor, vAlpha * intensity);
                }
            `
        });

        const particleSystem = new THREE.Points(particleGeo, particleMat);
        particleSystem.rotation.x = Math.PI * 0.35;
        singularityGroup.add(particleSystem);

        // ---------------------------------------------------------------------
        // F. Window Resize & Scroll Reactivity
        // ---------------------------------------------------------------------
        function resizeSingularity() {
            width = window.innerWidth;
            height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            sharedUniforms.uResolution.value.set(width, height);
        }

        window.addEventListener('resize', resizeSingularity, { passive: true });

        let scrollY = window.scrollY;
        let maxScroll = 1;
        let scrollProgress = 0;

        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
            maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
            scrollProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
            sharedUniforms.uScroll.value = scrollProgress;
        }, { passive: true });

        // ---------------------------------------------------------------------
        // G. Continuous 60 FPS Animation Loop
        // ---------------------------------------------------------------------
        const clock = new THREE.Clock();

        function singularityAnimate() {
            const elapsedTime = clock.getElapsedTime();
            sharedUniforms.uTime.value = elapsedTime;

            // Damped Mouse Coordinates (Lerp)
            mouseX += (targetMouseX - mouseX) * 0.06;
            mouseY += (targetMouseY - mouseY) * 0.06;

            const lerpNormX = (mouseX / width) * 2 - 1;
            const lerpNormY = -(mouseY / height) * 2 + 1;
            sharedUniforms.uMouse.value.set(lerpNormX, lerpNormY);

            // Update Custom Cursor Magnetic Outer Ring & Aura
            if (!isTouchDevice && cursorRing && cursorAura) {
                ringX += (targetMouseX - ringX) * 0.16;
                ringY += (targetMouseY - ringY) * 0.16;
                cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate3d(-50%, -50%, 0)`;

                auraX += (targetMouseX - auraX) * 0.09;
                auraY += (targetMouseY - auraY) * 0.09;
                cursorAura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0) translate3d(-50%, -50%, 0)`;
            }

            // Camera subtle parallax & tilt toward cursor
            camera.position.x = lerpNormX * 0.65;
            camera.position.y = lerpNormY * 0.45;
            camera.position.z = 8.2 + scrollProgress * 0.8;
            camera.lookAt(0, 0, 0);

            // Singularity Group continuous slow rotation and mouse tilt
            singularityGroup.rotation.y = elapsedTime * 0.08 + lerpNormX * 0.35;
            singularityGroup.rotation.x = 0.15 - lerpNormY * 0.25;

            // Render 3D Scene
            renderer.render(scene, camera);

            // Update 3D Corner Props for Slides 3-7 in the same loop
            updateAllSectionProps();

            requestAnimationFrame(singularityAnimate);
        }

        singularityAnimate();
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
    const revealElements = document.querySelectorAll('.reveal');

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
