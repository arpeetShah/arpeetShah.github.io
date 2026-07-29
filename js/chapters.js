import * as THREE from "three";

/* ============================================================
   3D chapter flythrough.
   Each chapter is a rotating 3D object (its signature geometry)
   living in depth along -Z. Scroll pulls them toward the camera:
   they rise in from the lower-right, grow and centre at the focus
   plane, then pass by and fade. Click the focused one to open it.
   ============================================================ */

const SPACING = 6;
const FOCUS_DIST = 5.2;

function makeGeometry(kind) {
  switch (kind) {
    case "torusKnot": return new THREE.TorusKnotGeometry(0.68, 0.22, 180, 28);
    case "octahedron": return new THREE.OctahedronGeometry(1.15, 0);
    case "torus": return new THREE.TorusGeometry(0.8, 0.3, 26, 90);
    case "box": return new THREE.BoxGeometry(1.4, 1.4, 1.4);
    case "sphere": return new THREE.SphereGeometry(1.08, 48, 32);
    case "dodecahedron": return new THREE.DodecahedronGeometry(1.12, 0);
    case "icosahedron":
    default: return new THREE.IcosahedronGeometry(1.15, 0);
  }
}

export default class Chapters {
  constructor(canvas, chapters, opts = {}) {
    this.canvas = canvas;
    this.chapters = chapters;
    this.onFocus = opts.onFocus || (() => {});
    this.onSelect = opts.onSelect || (() => {});

    this.progress = 0;
    this.progressTarget = 0;
    this.focused = -1;
    this.hovered = -1;
    this.mouse = new THREE.Vector2(0, 0);
    this.mouseTarget = new THREE.Vector2(0, 0);
    this.pointer = new THREE.Vector2(-2, -2);
    this.clock = new THREE.Clock();

    this._init();
  }

  _init() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 300);
    this.camera.position.set(0, 0, 0);

    // lighting
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(3, 4, 5);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0x88aaff, 0.6);
    fill.position.set(-4, -2, 2);
    this.scene.add(fill);

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.raycaster = new THREE.Raycaster();
    this.cards = [];      // one wrapper group per chapter
    this.solids = [];     // solid meshes for raycasting

    this.chapters.forEach((ch, i) => {
      const geo = makeGeometry(ch.model);
      const col = new THREE.Color(ch.color || "#6ee7ff");
      const flat = ["icosahedron", "octahedron", "dodecahedron"].includes(ch.model);

      const solid = new THREE.Mesh(
        geo,
        new THREE.MeshStandardMaterial({
          color: col,
          emissive: col.clone().multiplyScalar(0.28),
          metalness: 0.45,
          roughness: 0.32,
          flatShading: flat,
          transparent: true,
          opacity: 1,
        })
      );
      const wire = new THREE.LineSegments(
        new THREE.WireframeGeometry(geo),
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.14 })
      );
      solid.add(wire);

      const wrap = new THREE.Group();
      wrap.add(solid);
      wrap.position.z = -(FOCUS_DIST + i * SPACING);
      wrap.userData.index = i;
      wrap.userData.spin = 0.004 + (i % 3) * 0.0018;

      this.group.add(wrap);
      this.cards.push(wrap);
      solid.userData.index = i;
      this.solids.push(solid);
    });

    this._bind();
    this.resize();
    this._loop();
  }

  setProgress(p) { this.progressTarget = THREE.MathUtils.clamp(p, 0, 1); }

  _bind() {
    this.canvas.addEventListener("pointermove", (e) => {
      const r = this.canvas.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      this.mouseTarget.set(nx * 2 - 1, -(ny * 2 - 1));
      this.pointer.set(nx * 2 - 1, -(ny * 2 - 1));
    });
    this.canvas.addEventListener("pointerleave", () => {
      this.mouseTarget.set(0, 0);
      this.pointer.set(-2, -2);
    });
    this.canvas.addEventListener("click", () => {
      if (this.hovered >= 0) this.onSelect(this.hovered);
      else if (this.focused >= 0) this.onSelect(this.focused);
    });
    window.addEventListener("resize", () => this.resize());
    // self-correct if the canvas is sized after construction (e.g. late layout)
    if (window.ResizeObserver) {
      this._ro = new ResizeObserver(() => this.resize());
      this._ro.observe(this.canvas);
    }
  }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  _loop() {
    const t = this.clock.getElapsedTime();
    this.progress += (this.progressTarget - this.progress) * 0.08;
    this.mouse.lerp(this.mouseTarget, 0.06);

    const travel = (this.chapters.length - 1) * SPACING + SPACING * 0.9;
    this.group.position.z = this.progress * travel;

    let bestIdx = -1;
    let bestAbs = Infinity;

    this.cards.forEach((wrap, i) => {
      const worldZ = wrap.position.z + this.group.position.z;
      const dz = worldZ + FOCUS_DIST; // 0 at focus plane

      // k: 0 at focus, 1 far away in the distance
      const k = THREE.MathUtils.clamp(-dz / (SPACING * 2.1), 0, 1);

      // rise in from the lower-right, settle at centre
      wrap.position.x = k * 4.6 + this.mouse.x * 0.3 * (1 - k);
      wrap.position.y = -k * 3.0 + Math.sin(t * 0.5 + i) * 0.08 + this.mouse.y * 0.22 * (1 - k);

      // scale up as it reaches focus
      wrap.scale.setScalar(1.4 - k * 0.6);

      // continuous tumble + mouse tilt
      const solid = wrap.children[0];
      solid.rotation.y += wrap.userData.spin;
      solid.rotation.x = Math.sin(t * 0.4 + i) * 0.25 + this.mouse.y * 0.25 * (1 - k);
      solid.rotation.z += wrap.userData.spin * 0.4;

      // opacity: fade in from deep space, fade out past the camera
      let op;
      if (dz > 0) op = 1 - dz / (SPACING * 0.7);
      else op = 1 - THREE.MathUtils.smoothstep(-dz, SPACING * 2.2, SPACING * 3.4);
      op = THREE.MathUtils.clamp(op, 0, 1);
      solid.material.opacity = op;
      solid.children[0].material.opacity = op * 0.16;
      wrap.visible = op > 0.02;
      wrap.renderOrder = -Math.round(worldZ * 100);

      if (Math.abs(dz) < bestAbs && dz < SPACING * 0.4) {
        bestAbs = Math.abs(dz);
        bestIdx = i;
      }
    });

    if (bestIdx !== this.focused) {
      this.focused = bestIdx;
      this.onFocus(bestIdx);
    }

    // hover detection
    let hover = -1;
    if (this.pointer.x > -1.5) {
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const hits = this.raycaster.intersectObjects(
        this.solids.filter((s) => s.parent.visible && s.material.opacity > 0.5)
      );
      if (hits.length) hover = hits[0].object.userData.index;
    }
    if (hover !== this.hovered) {
      this.hovered = hover;
      document.body.classList.toggle("is-card-hover", hover >= 0);
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this._loop());
  }
}
