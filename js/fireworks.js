/* Firework + confetti bursts on the contact section. 2D canvas, additive glow. */

const COLORS = ["#6ee7ff", "#b98bff", "#ff7ac6", "#7ce7a8", "#ffb26e", "#ffd76e"];

export default class Fireworks {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.running = false;
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    const r = this.canvas.getBoundingClientRect();
    this.w = r.width || this.canvas.clientWidth;
    this.h = r.height || this.canvas.clientHeight;
    this.dpr = Math.min(window.devicePixelRatio, 2);
    this.canvas.width = this.w * this.dpr;
    this.canvas.height = this.h * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  burst(x, y, count = 74, color = null) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = Math.random() * 4.6 + 1.1;
      this.particles.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 1,
        decay: 0.007 + Math.random() * 0.012,
        size: Math.random() * 2.3 + 1,
        color: color || COLORS[(Math.random() * COLORS.length) | 0],
        strip: Math.random() < 0.28,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.32,
      });
    }
    this._run();
  }

  /** a staggered volley across the section */
  celebrate() {
    if (!this.w) this.resize();
    const pts = [
      [0.5, 0.4], [0.27, 0.32], [0.73, 0.34],
      [0.4, 0.52], [0.62, 0.5], [0.5, 0.28],
    ];
    pts.forEach((p, i) =>
      setTimeout(() => this.burst(this.w * p[0], this.h * p[1], 60 + ((Math.random() * 30) | 0)), i * 240)
    );
  }

  _run() {
    if (this.running) return;
    this.running = true;
    this._loop();
  }

  _loop() {
    const c = this.ctx;
    c.clearRect(0, 0, this.w, this.h);
    c.globalCompositeOperation = "lighter";

    this.particles = this.particles.filter((p) => p.life > 0);
    for (const p of this.particles) {
      p.vy += 0.045;
      p.vx *= 0.986;
      p.vy *= 0.986;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= p.decay;

      c.globalAlpha = Math.max(p.life, 0);
      c.fillStyle = p.color;
      if (p.strip) {
        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.rot);
        c.fillRect(-p.size, -p.size * 2.6, p.size * 2, p.size * 5.2);
        c.restore();
      } else {
        c.beginPath();
        c.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        c.fill();
      }
    }

    c.globalAlpha = 1;
    c.globalCompositeOperation = "source-over";

    if (this.particles.length) requestAnimationFrame(() => this._loop());
    else {
      this.running = false;
      c.clearRect(0, 0, this.w, this.h);
    }
  }
}
