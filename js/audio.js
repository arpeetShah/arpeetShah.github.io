/* ============================================================
   Ambient pad, synthesised live with the Web Audio API.
   No audio files — a slow, warm chord that breathes.

   .muffle(true) sweeps a lowpass down + adds resonance so the
   sound "bubbles down" underwater while a chapter is open.
   ============================================================ */

const OPEN_HZ = 14000;
const MUFFLED_HZ = 340;
const VOL = 0.32;
const VOL_MUFFLED = 0.2;

export default class Ambience {
  constructor() {
    this.ctx = null;
    this.on = false;
    this._muffled = false;
  }

  _build() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctx();
    const ctx = this.ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0.0001;

    this.filter = ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = OPEN_HZ;
    this.filter.Q.value = 0.5;

    // a touch of space
    const delay = ctx.createDelay(1.0);
    delay.delayTime.value = 0.38;
    const fb = ctx.createGain();
    fb.gain.value = 0.32;
    const wet = ctx.createGain();
    wet.gain.value = 0.28;

    this.filter.connect(this.master);
    this.filter.connect(delay);
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(wet);
    wet.connect(this.master);
    this.master.connect(ctx.destination);

    // open, warm sus chord — A2 · E3 · A3 · B3 · E4
    const chord = [110, 164.81, 220, 246.94, 329.63];
    this.voices = chord.map((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 ? "sine" : "triangle";
      osc.frequency.value = f;
      osc.detune.value = Math.random() * 8 - 4;

      const g = ctx.createGain();
      g.gain.value = 0.085;

      // slow breathing so the pad never sits still
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.04 + Math.random() * 0.07;
      const lfoAmt = ctx.createGain();
      lfoAmt.gain.value = 0.045;
      lfo.connect(lfoAmt);
      lfoAmt.connect(g.gain);

      osc.connect(g);
      g.connect(this.filter);
      osc.start();
      lfo.start();
      return { osc, lfo, g };
    });
  }

  async enable() {
    if (!this.ctx) this._build();
    if (this.ctx.state === "suspended") await this.ctx.resume();
    this.on = true;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), t);
    this.master.gain.linearRampToValueAtTime(this._muffled ? VOL_MUFFLED : VOL, t + 1.8);
    return true;
  }

  disable() {
    if (!this.ctx) return false;
    this.on = false;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(0.0001, t + 0.7);
    return false;
  }

  /** true = sink underwater, false = surface */
  muffle(on) {
    this._muffled = on;
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    this.filter.frequency.cancelScheduledValues(t);
    this.filter.frequency.setValueAtTime(Math.max(this.filter.frequency.value, 1), t);
    this.filter.frequency.exponentialRampToValueAtTime(on ? MUFFLED_HZ : OPEN_HZ, t + 0.6);

    this.filter.Q.cancelScheduledValues(t);
    this.filter.Q.setValueAtTime(this.filter.Q.value, t);
    this.filter.Q.linearRampToValueAtTime(on ? 4.5 : 0.5, t + 0.6);

    if (this.on) {
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setValueAtTime(this.master.gain.value, t);
      this.master.gain.linearRampToValueAtTime(on ? VOL_MUFFLED : VOL, t + 0.6);
    }
  }

  async toggle() {
    return this.on ? this.disable() : await this.enable();
  }
}
