import * as THREE from "three";

/* ============================================================
   3D chapter flythrough.
   Cards live in depth along -Z. Scroll pulls them toward the
   camera: they appear small in the bottom-right, sweep in to
   centre as they reach the focus plane, then pass by and fade.
   Click a card to open its detail view.
   ============================================================ */

const SPACING = 6;      // world units between cards
const FOCUS_DIST = 4.6; // distance from camera where a card is "in focus"
const CARD_W = 3.5;
const CARD_H = 2.2;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function hexA(hex, a) {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}

function wrap(ctx, text, maxW) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
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
    this.pointer = new THREE.Vector2(-2, -2); // NDC for raycast
    this.clock = new THREE.Clock();

    this._init();
  }

  _init() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 300);
    this.camera.position.set(0, 0, 0);

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.raycaster = new THREE.Raycaster();
    this.cards = [];

    const geo = new THREE.PlaneGeometry(CARD_W, CARD_H, 1, 1);
    this.chapters.forEach((ch, i) => {
      const mat = new THREE.MeshBasicMaterial({
        map: this._makeCardTexture(ch, i),
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.z = -(FOCUS_DIST + i * SPACING);
      mesh.userData.index = i;
      this.group.add(mesh);
      this.cards.push(mesh);
    });

    this._bind();
    this.resize();
    this._loop();
  }

  _makeCardTexture(ch, i) {
    const W = 1024, H = 644;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    const color = ch.color || "#6ee7ff";
    const pad = 18;
    const r = 34;

    // glass panel
    roundRect(ctx, pad, pad, W - pad * 2, H - pad * 2, r);
    const g = ctx.createLinearGradient(pad, pad, W - pad, H - pad);
    g.addColorStop(0, hexA(color, 0.22));
    g.addColorStop(0.55, "rgba(10,12,18,0.92)");
    g.addColorStop(1, "rgba(6,7,11,0.96)");
    ctx.fillStyle = g;
    ctx.fill();

    // glow border
    ctx.strokeStyle = hexA(color, 0.5);
    ctx.lineWidth = 2;
    ctx.stroke();

    // corner accent
    const rg = ctx.createRadialGradient(W * 0.16, H * 0.16, 0, W * 0.16, H * 0.16, W * 0.5);
    rg.addColorStop(0, hexA(color, 0.3));
    rg.addColorStop(1, "rgba(0,0,0,0)");
    roundRect(ctx, pad, pad, W - pad * 2, H - pad * 2, r);
    ctx.fillStyle = rg;
    ctx.fill();

    // index
    ctx.fillStyle = hexA(color, 0.9);
    ctx.font = '600 26px Inter, Arial, sans-serif';
    ctx.textBaseline = "top";
    ctx.fillText(String(i + 1).padStart(2, "0"), 64, 62);

    // kicker
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = '500 22px Inter, Arial, sans-serif';
    ctx.fillText((ch.kicker || "").toUpperCase(), 118, 64);

    // title
    ctx.fillStyle = "#f2f4f8";
    ctx.font = '700 76px Inter, Arial, sans-serif';
    const lines = wrap(ctx, ch.title, W - 150);
    lines.slice(0, 3).forEach((ln, k) => ctx.fillText(ln, 64, 170 + k * 82));

    // hint
    ctx.fillStyle = hexA(color, 0.95);
    ctx.font = '600 24px Inter, Arial, sans-serif';
    ctx.fillText("EXPLORE  →", 64, H - 110);

    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 4;
    return t;
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

    // pull the whole stack toward the camera
    const travel = (this.chapters.length - 1) * SPACING + SPACING * 0.9;
    this.group.position.z = this.progress * travel;

    let bestIdx = -1;
    let bestAbs = Infinity;

    this.cards.forEach((card, i) => {
      const worldZ = card.position.z + this.group.position.z;
      const dz = worldZ + FOCUS_DIST; // 0 when exactly at focus plane

      // k: 0 at focus, 1 when far away in the distance
      const k = THREE.MathUtils.clamp(-dz / (SPACING * 2.1), 0, 1);

      // sweep in from the bottom-right
      card.position.x = k * 5.0 + this.mouse.x * 0.25 * (1 - k);
      card.position.y = -k * 3.2 + Math.sin(t * 0.5 + i) * 0.06 + this.mouse.y * 0.18 * (1 - k);
      card.rotation.y = -k * 0.55 - this.mouse.x * 0.06;
      card.rotation.z = k * 0.1;
      card.rotation.x = this.mouse.y * 0.05;

      // opacity: fade in from deep space, fade out once past the camera
      let op;
      if (dz > 0) op = 1 - dz / (SPACING * 0.75);           // passed focus, flying by
      else op = 1 - THREE.MathUtils.smoothstep(-dz, SPACING * 2.2, SPACING * 3.4); // approaching
      card.material.opacity = THREE.MathUtils.clamp(op, 0, 1);
      card.visible = card.material.opacity > 0.01;
      card.renderOrder = -Math.round(worldZ * 100);

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
        this.cards.filter((c) => c.visible && c.material.opacity > 0.5)
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
