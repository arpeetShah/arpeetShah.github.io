import * as THREE from "three";

/* Small rotating 3D object shown inside a chapter's detail panel. */

const GEOS = {
  torusKnot: () => new THREE.TorusKnotGeometry(0.72, 0.24, 160, 24),
  icosahedron: () => new THREE.IcosahedronGeometry(1.05, 0),
  octahedron: () => new THREE.OctahedronGeometry(1.1, 0),
  torus: () => new THREE.TorusGeometry(0.82, 0.3, 24, 90),
  box: () => new THREE.BoxGeometry(1.35, 1.35, 1.35),
  sphere: () => new THREE.SphereGeometry(1.05, 48, 32),
  dodecahedron: () => new THREE.DodecahedronGeometry(1.08, 0),
};

export default class ModelViewer {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    this.camera.position.set(0, 0, 4.2);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(2, 3, 4);
    this.scene.add(key);
    this.rim = new THREE.PointLight(0x6ee7ff, 22, 18);
    this.rim.position.set(-3, -2, 2);
    this.scene.add(this.rim);

    this.mesh = null;
    this.wire = null;
    this._raf = null;
  }

  show(kind = "icosahedron", color = "#6ee7ff") {
    this.dispose();
    const geo = (GEOS[kind] || GEOS.icosahedron)();
    const col = new THREE.Color(color);

    this.mesh = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({
        color: col,
        roughness: 0.25,
        metalness: 0.65,
        flatShading: kind === "icosahedron" || kind === "octahedron" || kind === "dodecahedron",
      })
    );
    this.wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(geo),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 })
    );
    this.scene.add(this.mesh, this.wire);
    this.rim.color = col;

    this.resize();
    if (!this._raf) this._loop();
  }

  resize() {
    const w = this.canvas.clientWidth || 300;
    const h = this.canvas.clientHeight || 300;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  _loop() {
    if (this.mesh) {
      this.mesh.rotation.y += 0.006;
      this.mesh.rotation.x += 0.0022;
      this.wire.rotation.copy(this.mesh.rotation);
    }
    this.renderer.render(this.scene, this.camera);
    this._raf = requestAnimationFrame(() => this._loop());
  }

  dispose() {
    [this.mesh, this.wire].forEach((o) => {
      if (!o) return;
      this.scene.remove(o);
      o.geometry.dispose();
      o.material.dispose();
    });
    this.mesh = this.wire = null;
  }
}
