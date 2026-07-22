import * as THREE from "three";

/* ============================================================
   Particle field: a sphere that morphs into a spiral galaxy.
   - custom GLSL shader, additive glow
   - reacts to cursor (parallax) and scroll (uProgress + camera)
   ============================================================ */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;   // 0..1 driven by scroll
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2  uMouse;      // lerped, -1..1

  attribute vec3  aTarget;   // galaxy formation
  attribute float aScale;
  attribute float aRandom;

  varying float vMix;
  varying float vRandom;

  // cheap hash noise
  vec3 curl(vec3 p){
    float x = sin(p.y * 1.7 + uTime) + sin(p.z * 1.3 - uTime * 0.6);
    float y = sin(p.z * 1.5 - uTime * 0.8) + sin(p.x * 1.1 + uTime * 0.4);
    float z = sin(p.x * 1.9 + uTime * 0.5) + sin(p.y * 1.2 - uTime);
    return vec3(x, y, z);
  }

  void main() {
    float p = smoothstep(0.0, 1.0, uProgress);
    vMix = p;
    vRandom = aRandom;

    vec3 pos = mix(position, aTarget, p);

    // organic drift
    vec3 flow = curl(pos * 0.35 + aRandom * 6.28);
    pos += flow * (0.05 + p * 0.12) * (0.4 + aRandom);

    // gentle breathing
    pos *= 1.0 + sin(uTime * 0.6 + aRandom * 10.0) * 0.015;

    // cursor parallax — push field opposite to mouse, depth-weighted
    pos.x += uMouse.x * (0.35 + aRandom * 0.5);
    pos.y += uMouse.y * (0.35 + aRandom * 0.5);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = uSize * aScale * uPixelRatio * (26.0 / -mvPosition.z);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uColorA;   // core
  uniform vec3 uColorB;   // mid
  uniform vec3 uColorC;   // edge

  varying float vMix;
  varying float vRandom;

  void main() {
    // soft round glow
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d);
    alpha = pow(alpha, 2.4);

    vec3 col = mix(uColorA, uColorB, vRandom);
    col = mix(col, uColorC, vMix * 0.6);

    gl_FragColor = vec4(col, alpha * 0.5);
  }
`;

export default class Scene {
  constructor(canvas) {
    this.canvas = canvas;
    this.mouse = new THREE.Vector2(0, 0);
    this.mouseTarget = new THREE.Vector2(0, 0);
    this.progress = 0;
    this.progressTarget = 0;
    this.clock = new THREE.Clock();

    this._initRenderer();
    this._initScene();
    this._initParticles();
    this._bind();
    this.resize();
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x000000, 0);
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(this.pixelRatio);
  }

  _initScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    this.camera.position.set(0, 0, 7);
    this.group = new THREE.Group();
    this.scene.add(this.group);
  }

  _initParticles() {
    const COUNT = 14000;
    const positions = new Float32Array(COUNT * 3);
    const targets = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const randoms = new Float32Array(COUNT);

    const sphereR = 2.6;
    const arms = 4;

    for (let i = 0; i < COUNT; i++) {
      // ---- base: fibonacci sphere ----
      const t = i / COUNT;
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = sphereR * (0.55 + Math.pow(Math.random(), 0.7) * 0.45);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      // ---- target: spiral galaxy disc, facing the camera (XY plane) ----
      const gr = Math.pow(Math.random(), 0.6) * 4.0;
      const branch = (i % arms) / arms * Math.PI * 2;
      const spin = gr * 0.9;
      const spread = (Math.random() - 0.5) * (0.35 + gr * 0.08);
      targets[i * 3] = Math.cos(branch + spin) * gr + spread;
      targets[i * 3 + 1] = Math.sin(branch + spin) * gr + spread;
      targets[i * 3 + 2] = (Math.random() - 0.5) * (0.6 - gr * 0.09) + spread * 0.4;

      scales[i] = 0.4 + Math.random() * 1.4;
      randoms[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

    this.uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uSize: { value: 1.3 },
      uPixelRatio: { value: this.pixelRatio },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color("#6ee7ff") },
      uColorB: { value: new THREE.Color("#b98bff") },
      uColorC: { value: new THREE.Color("#ff7ac6") },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(geo, mat);
    this.group.add(this.points);
  }

  _bind() {
    window.addEventListener("pointermove", (e) => {
      this.mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseTarget.y = -((e.clientY / window.innerHeight) * 2 - 1);
    });
  }

  /** progress 0..1 across the whole page (driven by scroll module) */
  setProgress(v) {
    this.progressTarget = v;
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    // slightly smaller particles on small screens
    this.uniforms.uSize.value = w < 700 ? 1.0 : 1.3;
  }

  update() {
    const t = this.clock.getElapsedTime();
    this.uniforms.uTime.value = t;

    // smooth mouse + progress
    this.mouse.lerp(this.mouseTarget, 0.05);
    this.uniforms.uMouse.value.copy(this.mouse);
    this.progress += (this.progressTarget - this.progress) * 0.06;
    this.uniforms.uProgress.value = this.progress;

    // constant slow rotation + progress-driven tilt
    this.group.rotation.y = t * 0.05 + this.mouse.x * 0.3;
    this.group.rotation.x = this.progress * 0.9 - 0.15 + this.mouse.y * 0.2;

    // camera dollies in a touch as galaxy forms
    this.camera.position.z = 7 - this.progress * 1.6;

    this.renderer.render(this.scene, this.camera);
  }
}
