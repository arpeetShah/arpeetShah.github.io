import * as THREE from "three";

/* ============================================================
   3D work flythrough — floating project panels.
   Each project flies toward the camera one at a time (centred
   depth stack; the focused one fills the frame, the rest hide
   behind it). Panels can be browser-window mockups OR full-bleed
   photo cards, with per-card aspect ratio and size.
   ============================================================ */

const SPACING = 6;
const FOCUS_DIST = 5.0;
const BASE_H = 2.31;   // world height (all cards share height; width varies by aspect)
const BASE_TH = 660;   // logical texture height
const SCALE = 2.2;     // supersample -> crisp textures

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function hexA(hex, a) {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}
function domainOf(url) {
  if (!url) return "";
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
function coverDraw(ctx, img, x, y, w, h) {
  const ir = img.width / img.height, br = w / h;
  let sw = img.width, sh = img.height, sx = 0, sy = 0;
  if (ir > br) { sw = img.height * br; sx = (img.width - sw) / 2; }
  else { sh = img.width / br; sy = (img.height - sh) / 2; }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawPanel(canvas, ch, img) {
  const ctx = canvas.getContext("2d");
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  ctx.imageSmoothingQuality = "high";
  const LW = canvas.width / SCALE, LH = canvas.height / SCALE;
  const color = ch.color || "#6ee7ff";
  const pad = 16, r = 34;
  ctx.clearRect(0, 0, LW, LH);

  /* ---- full-bleed photo card (e.g. the portrait / skills card) ---- */
  if (ch.variant === "photo") {
    ctx.save();
    roundRect(ctx, pad, pad, LW - pad * 2, LH - pad * 2, r);
    ctx.clip();
    if (img) coverDraw(ctx, img, pad, pad, LW - pad * 2, LH - pad * 2);
    else { ctx.fillStyle = "#0c0e14"; ctx.fillRect(pad, pad, LW - pad * 2, LH - pad * 2); }
    const grad = ctx.createLinearGradient(0, LH * 0.45, 0, LH);
    grad.addColorStop(0, "rgba(6,7,11,0)");
    grad.addColorStop(1, "rgba(6,7,11,0.92)");
    ctx.fillStyle = grad;
    ctx.fillRect(pad, pad, LW - pad * 2, LH - pad * 2);
    ctx.restore();

    ctx.fillStyle = hexA(color, 0.95);
    ctx.font = "600 24px Inter, Arial, sans-serif";
    ctx.textBaseline = "alphabetic";
    ctx.fillText((ch.kicker || "").toUpperCase(), pad + 42, LH - 96);
    ctx.fillStyle = "#f4f6fa";
    ctx.font = "700 66px Inter, Arial, sans-serif";
    ctx.fillText(ch.title, pad + 40, LH - 44);

    roundRect(ctx, pad, pad, LW - pad * 2, LH - pad * 2, r);
    ctx.strokeStyle = hexA(color, 0.5);
    ctx.lineWidth = 2;
    ctx.stroke();
    return;
  }

  /* ---- browser-window panel ---- */
  const barH = 62;
  roundRect(ctx, pad, pad, LW - pad * 2, LH - pad * 2, r);
  const g = ctx.createLinearGradient(0, pad, 0, LH - pad);
  g.addColorStop(0, "#11141c");
  g.addColorStop(1, "#0a0c12");
  ctx.fillStyle = g;
  ctx.fill();

  ctx.save();
  roundRect(ctx, pad, pad, LW - pad * 2, LH - pad * 2, r);
  ctx.clip();
  const rg = ctx.createRadialGradient(LW * 0.5, pad, 0, LW * 0.5, pad, LW * 0.7);
  rg.addColorStop(0, hexA(color, 0.28));
  rg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, LW, LH);

  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fillRect(pad, pad, LW - pad * 2, barH);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, k) => {
    ctx.beginPath();
    ctx.fillStyle = hexA(c, 0.85);
    ctx.arc(pad + 34 + k * 26, pad + barH / 2, 7, 0, Math.PI * 2);
    ctx.fill();
  });
  roundRect(ctx, pad + 130, pad + barH / 2 - 15, LW - pad * 2 - 160, 30, 15);
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "500 20px Inter, Arial, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(ch.domain || domainOf(ch.link && ch.link.url), pad + 156, pad + barH / 2 + 1);

  const cx = pad, cy = pad + barH, cw = LW - pad * 2, chH = LH - pad - cy;
  if (img) {
    coverDraw(ctx, img, cx, cy, cw, chH);
  } else {
    ctx.textBaseline = "top";
    ctx.fillStyle = "#f2f4f8";
    ctx.font = "700 72px Inter, Arial, sans-serif";
    ctx.fillText(ch.title, cx + 48, cy + 54);
    ctx.fillStyle = hexA(color, 0.95);
    ctx.font = "600 24px Inter, Arial, sans-serif";
    ctx.fillText((ch.kicker || "").toUpperCase(), cx + 50, cy + 30);
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.font = "400 26px Inter, Arial, sans-serif";
    ctx.fillText((ch.blurb || "").slice(0, 74), cx + 48, cy + 148);
    const ty = cy + 210;
    for (let k = 0; k < 3; k++) {
      roundRect(ctx, cx + 48 + k * ((cw - 96 - 40) / 3 + 20), ty, (cw - 96 - 40) / 3, 150, 16);
      ctx.fillStyle = hexA(color, 0.13 + k * 0.05);
      ctx.fill();
    }
    ctx.fillStyle = hexA(color, 0.9);
    ctx.font = "600 24px Inter, Arial, sans-serif";
    ctx.fillText("Explore  →", cx + 48, cy + chH - 56);
  }
  ctx.restore();

  roundRect(ctx, pad, pad, LW - pad * 2, LH - pad * 2, r);
  ctx.strokeStyle = hexA(color, 0.45);
  ctx.lineWidth = 2;
  ctx.stroke();
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
    this._maxAniso = this.renderer.capabilities.getMaxAnisotropy();

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 300);
    this.camera.position.set(0, 0, 0);

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.raycaster = new THREE.Raycaster();
    this.cards = [];

    this.chapters.forEach((ch, i) => {
      const aspect = ch.aspect || 1.6;
      const lw = Math.round(BASE_TH * aspect), lh = BASE_TH;
      const canvas = document.createElement("canvas");
      canvas.width = lw * SCALE; canvas.height = lh * SCALE;
      drawPanel(canvas, ch, null);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = this._maxAniso;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.generateMipmaps = true;

      if (ch.image) {
        const im = new Image();
        im.crossOrigin = "anonymous";
        im.onload = () => { drawPanel(canvas, ch, im); tex.needsUpdate = true; };
        im.src = ch.image;
      }

      const geo = new THREE.PlaneGeometry(BASE_H * aspect, BASE_H);
      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
      );
      mesh.position.z = -(FOCUS_DIST + i * SPACING);
      mesh.userData.index = i;
      mesh.userData.sway = Math.random() * 6.28;
      mesh.userData.sizeMul = ch.sizeMul || 1;
      this.group.add(mesh);
      this.cards.push(mesh);
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

    let bestIdx = -1, bestAbs = Infinity;

    this.cards.forEach((mesh, i) => {
      const worldZ = mesh.position.z + this.group.position.z;
      const dz = worldZ + FOCUS_DIST;
      const mul = mesh.userData.sizeMul;

      const near = THREE.MathUtils.clamp(1 - Math.abs(dz) / (SPACING * 1.4), 0, 1);
      mesh.position.x = this.mouse.x * 0.22 * near;
      mesh.position.y = Math.sin(t * 0.4 + mesh.userData.sway) * 0.04 + this.mouse.y * 0.13 * near;
      mesh.rotation.y = this.mouse.x * 0.1 * near;
      mesh.rotation.x = 0.015 + this.mouse.y * -0.06 * near;

      if (dz > 0) {
        mesh.scale.setScalar((1.4 + dz * 0.22) * mul);
        mesh.material.opacity = Math.max(0, 1 - dz / (SPACING * 0.5));
      } else {
        const kk = Math.min(-dz / (SPACING * 1.8), 1);
        mesh.scale.setScalar((1.4 - kk * 0.22) * mul);
        mesh.material.opacity = 1;
      }
      mesh.visible = mesh.material.opacity > 0.02;
      mesh.renderOrder = Math.round(worldZ * 100);

      if (Math.abs(dz) < bestAbs && dz < SPACING * 0.4) { bestAbs = Math.abs(dz); bestIdx = i; }
    });

    if (bestIdx !== this.focused) { this.focused = bestIdx; this.onFocus(bestIdx); }

    let hover = -1;
    if (this.pointer.x > -1.5) {
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const hits = this.raycaster.intersectObjects(this.cards.filter((c) => c.visible && c.material.opacity > 0.5));
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
