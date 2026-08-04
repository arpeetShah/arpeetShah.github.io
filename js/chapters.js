import * as THREE from "three";

/* ============================================================
   3D work flythrough.
   Each project is a floating "browser panel" that flies toward
   the camera as you scroll — rises from the lower-right, grows
   and centres at the focus plane, then passes by. Each panel
   shows a real screenshot if one is provided, otherwise a clean
   auto-generated mockup. Click the focused one to open it.
   ============================================================ */

const SPACING = 6;
const FOCUS_DIST = 5.0;
const PW = 3.7, PH = 2.31;         // panel size (16:10)
const TW = 1024, TH = 640;         // logical drawing size
const SCALE = 2.2;                  // supersample factor -> crisp textures

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
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0); // draw in logical coords, render at SCALE res
  ctx.imageSmoothingQuality = "high";
  const color = ch.color || "#6ee7ff";
  const pad = 16, r = 34, barH = 62;
  ctx.clearRect(0, 0, TW, TH);

  // panel body
  roundRect(ctx, pad, pad, TW - pad * 2, TH - pad * 2, r);
  const g = ctx.createLinearGradient(0, pad, 0, TH - pad);
  g.addColorStop(0, "#11141c");
  g.addColorStop(1, "#0a0c12");
  ctx.fillStyle = g;
  ctx.fill();

  // brand glow at top
  ctx.save();
  roundRect(ctx, pad, pad, TW - pad * 2, TH - pad * 2, r);
  ctx.clip();
  const rg = ctx.createRadialGradient(TW * 0.5, pad, 0, TW * 0.5, pad, TW * 0.7);
  rg.addColorStop(0, hexA(color, 0.28));
  rg.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, TW, TH);
  ctx.restore();

  // browser chrome bar
  ctx.save();
  roundRect(ctx, pad, pad, TW - pad * 2, TH - pad * 2, r);
  ctx.clip();
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fillRect(pad, pad, TW - pad * 2, barH);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, k) => {
    ctx.beginPath();
    ctx.fillStyle = hexA(c, 0.85);
    ctx.arc(pad + 34 + k * 26, pad + barH / 2, 7, 0, Math.PI * 2);
    ctx.fill();
  });
  // url pill
  roundRect(ctx, pad + 130, pad + barH / 2 - 15, TW - pad * 2 - 160, 30, 15);
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "500 20px Inter, Arial, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(ch.domain || domainOf(ch.link && ch.link.url), pad + 156, pad + barH / 2 + 1);

  // content area (below the bar)
  const cx = pad, cy = pad + barH, cw = TW - pad * 2, chH = TH - pad - cy;

  if (img) {
    coverDraw(ctx, img, cx, cy, cw, chH);
  } else {
    // ---- clean mockup ----
    ctx.fillStyle = "#f2f4f8";
    ctx.font = "700 72px Inter, Arial, sans-serif";
    ctx.textBaseline = "top";
    ctx.fillText(ch.title, cx + 48, cy + 54);

    ctx.fillStyle = hexA(color, 0.95);
    ctx.font = "600 24px Inter, Arial, sans-serif";
    ctx.fillText((ch.kicker || "").toUpperCase(), cx + 50, cy + 30);

    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.font = "400 26px Inter, Arial, sans-serif";
    const blurb = (ch.blurb || "").slice(0, 74);
    ctx.fillText(blurb, cx + 48, cy + 148);

    // faux content tiles
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

  // border
  roundRect(ctx, pad, pad, TW - pad * 2, TH - pad * 2, r);
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

    const geo = new THREE.PlaneGeometry(PW, PH, 1, 1);
    this.chapters.forEach((ch, i) => {
      const canvas = document.createElement("canvas");
      canvas.width = TW * SCALE; canvas.height = TH * SCALE;
      drawPanel(canvas, ch, null);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = this._maxAniso;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.generateMipmaps = true;

      // upgrade to a real screenshot if one is provided
      if (ch.image) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => { drawPanel(canvas, ch, img); tex.needsUpdate = true; };
        img.src = ch.image;
      }

      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
      );
      mesh.position.z = -(FOCUS_DIST + i * SPACING);
      mesh.userData.index = i;
      mesh.userData.sway = Math.random() * 6.28;
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
      const dz = worldZ + FOCUS_DIST; // 0 at focus, <0 further back, >0 past the camera

      // centred stack — only subtle float + cursor parallax, no corner sweep
      const near = THREE.MathUtils.clamp(1 - Math.abs(dz) / (SPACING * 1.4), 0, 1);
      mesh.position.x = this.mouse.x * 0.22 * near;
      mesh.position.y = Math.sin(t * 0.4 + mesh.userData.sway) * 0.04 + this.mouse.y * 0.13 * near;
      mesh.rotation.y = this.mouse.x * 0.1 * near;
      mesh.rotation.x = 0.015 + this.mouse.y * -0.06 * near;

      if (dz > 0) {
        // flying past the camera: grow + fade out, revealing the next
        mesh.scale.setScalar(1.4 + dz * 0.22);
        mesh.material.opacity = Math.max(0, 1 - dz / (SPACING * 0.5));
      } else {
        const kk = Math.min(-dz / (SPACING * 1.8), 1); // 0 at focus -> 1 far back
        mesh.scale.setScalar(1.4 - kk * 0.22);
        mesh.material.opacity = 1; // opaque; hidden behind the focused one
      }
      mesh.visible = mesh.material.opacity > 0.02;
      mesh.renderOrder = Math.round(worldZ * 100); // nearer draws on top -> clean occlusion

      if (Math.abs(dz) < bestAbs && dz < SPACING * 0.4) { bestAbs = Math.abs(dz); bestIdx = i; }
    });

    if (bestIdx !== this.focused) { this.focused = bestIdx; this.onFocus(bestIdx); }

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
