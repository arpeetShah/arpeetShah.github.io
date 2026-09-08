import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const $ = (id) => document.getElementById(id);
// document-relative top position — offsetTop is relative to the nearest
// positioned ancestor, which breaks once sections use position:relative.
const pageTop = (el) => el.getBoundingClientRect().top + window.scrollY;

/* ---------------- content ---------------- */
const PULSE = {
  lede: "A weekly publication where I turn real medical and health research into something a teenager will actually read.",
  purpose: [
    "I couldn't find health and science writing made for people my age — not dumbed down, not clickbait, just real research explained like a human being wrote it. So I made it.",
    "Every claim that matters has a citation at the bottom of the page. It's careful, it's honest, and it's <strong>free — always</strong>.",
  ],
  articles: [
    {
      featured: true,
      date: "Sep 5, 2026",
      title: "The Voice That Shows Up Before Everything That Matters.",
      excerpt: "It's not weakness. It's neuroscience — why self-doubt shows up right before everything that matters, and what to do with it.",
      substack: "https://arpeetshah.substack.com/p/the-voice-that-shows-up-before-everything",
      pdf: "../articles/the-voice-that-shows-up-before-everything-that-matters.pdf",
    },
    {
      date: "Aug 16, 2026",
      title: "I Taught a Computer to Read Brain Waves for Seizures.",
      excerpt: "One patient broke the pattern — what building a seizure classifier actually taught me.",
      substack: "https://arpeetshah.substack.com/p/i-taught-a-computer-to-read-brain",
      pdf: "../articles/i-taught-a-computer-to-read-brain-waves-for-seizures.pdf",
    },
    {
      date: "Aug 9, 2026",
      title: "The Science Behind Every Decision You've Ever Regretted",
      excerpt: "A near-fall on a 14,000-foot cliff led me to real research on why teen brains are wired for risk.",
      substack: "https://arpeetshah.substack.com/p/i-was-two-feet-from-a-14000-foot",
      pdf: "../articles/the-science-behind-every-decision-youve-ever-regretted.pdf",
    },
  ],
};

function hydratePulse() {
  $("pulseLede").textContent = PULSE.lede;
  $("pulsePurpose").innerHTML = PULSE.purpose.map((p) => `<p class="reveal">${p}</p>`).join("");

  $("pulseArticles").innerHTML = PULSE.articles
    .map(
      (a) => `
        <div class="p-article reveal${a.featured ? " is-featured" : ""}">
          <span class="p-article__date">${a.date}</span>
          <div>
            <div class="p-article__title">${a.title}</div>
            <div class="p-article__excerpt">${a.excerpt}</div>
          </div>
          <div class="p-article__links">
            <a href="${a.substack}" target="_blank" rel="noopener">Substack ↗</a>
            <a href="${a.pdf}" target="_blank" rel="noopener">PDF ↓</a>
          </div>
        </div>`
    )
    .join("");
}

/* ---------------- name gate: pop up, hold ~1.5s, dissolve into the photo ---------------- */
function runGate() {
  const gate = $("gate");
  const name = gate.querySelector(".gate__name");
  const frame = $("heroPhotoFrame");

  document.documentElement.style.overflow = "hidden";

  const tl = gsap.timeline({
    onComplete: () => {
      document.documentElement.style.overflow = "";
      gate.style.display = "none";
    },
  });
  tl.set(frame, { opacity: 0 });
  tl.to(name, { opacity: 1, duration: 0.5, ease: "power2.out" });
  tl.to({}, { duration: 1.5 }); // hold
  tl.to(name, { opacity: 0, duration: 0.4, ease: "power1.in" });
  tl.to(gate, { opacity: 0, duration: 0.6, ease: "power1.inOut" }, "<");
  tl.to(frame, { opacity: 1, duration: 0.7, ease: "power1.out" }, "<0.1");
}

/* ---------------- hero photo: slow "reach toward camera" zoom, flows into About's frame ---------------- */
function initHeroPhoto() {
  const img = $("heroPhotoImg");
  const reach = $("heroPhotoReach");
  const caption = $("heroPhotoCaption");
  const frame = $("heroPhotoFrame");

  gsap.set(img, { scale: 1.12 });
  gsap.set(reach, { opacity: 0, scale: 0.3 });

  ScrollTrigger.create({
    trigger: "#heroPhotoZoomWrap",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.4,
    onUpdate: (self) => {
      const p = self.progress;
      gsap.set(img, {
        scale: gsap.utils.interpolate(1.12, 1.34, gsap.utils.clamp(0, 1, p / 0.85)),
        xPercent: gsap.utils.interpolate(0, -3, gsap.utils.clamp(0, 1, p / 0.85)),
      });

      // a soft light "reaching" toward the viewer, near the hand, peaking mid-scroll
      const reachT = gsap.utils.clamp(0, 1, (p - 0.12) / 0.4);
      const reachOut = gsap.utils.clamp(0, 1, (p - 0.55) / 0.3);
      gsap.set(reach, {
        opacity: Math.min(reachT, 1 - reachOut) * 0.9,
        scale: gsap.utils.interpolate(0.3, 1.15, reachT),
      });

      const capIn = gsap.utils.clamp(0, 1, p / 0.1);
      const capOut = gsap.utils.clamp(0, 1, (p - 0.75) / 0.2);
      gsap.set(caption, { opacity: Math.min(capIn, 1 - capOut), y: 26 * (1 - capIn) });

      const frameOut = gsap.utils.clamp(0, 1, (p - 0.82) / 0.18);
      gsap.set(frame, { opacity: 1 - frameOut });
    },
  });
}

/* ---------------- pulse monitor zoom (visual only) ---------------- */
function initPulseZoom() {
  const monitor = $("monitor");
  const reveal = $("pulseReveal");

  gsap.set(monitor, { scale: 0.42, opacity: 1 });
  gsap.set(reveal, { opacity: 0, y: 24 });

  function applyProgress(p) {
    const scale = gsap.utils.interpolate(0.42, 1.5, gsap.utils.clamp(0, 1, p / 0.62));
    gsap.set(monitor, {
      scale,
      opacity: 1 - gsap.utils.clamp(0, 1, (p - 0.5) / 0.25),
    });
    const revealT = gsap.utils.clamp(0, 1, (p - 0.55) / 0.3);
    gsap.set(reveal, { opacity: revealT, y: 24 * (1 - revealT) });
    reveal.classList.toggle("is-visible", revealT > 0.6);
  }

  ScrollTrigger.create({
    trigger: "#pulseZoomWrap",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.4,
    onUpdate: (self) => applyProgress(self.progress),
    onRefresh: (self) => applyProgress(self.progress),
  });
}

/* ---------------- continuous theme color: light -> dull pink (Pulse) -> dark ----------------
   A single interpolated color, recomputed from live scroll position on every
   tick — never a hard class swap — so the wash is genuinely smooth. */
const THEME_STOPS = {
  light: { bg: [246, 242, 236], fg: [20, 21, 26], muted: [107, 111, 122] },
  pink: { bg: [124, 51, 73], fg: [251, 238, 242], muted: [231, 189, 201] },
  dark: { bg: [5, 6, 8], fg: [238, 240, 244], muted: [139, 144, 160] },
};
function lerp3(a, b, t) {
  return [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t));
}
function css(c) {
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

function updateTheme() {
  const pulseZoomWrap = $("pulseZoomWrap");
  const researchEl = $("research");

  const pulseStart = pageTop(pulseZoomWrap);
  const pulseEnd = pulseStart + pulseZoomWrap.offsetHeight - window.innerHeight;
  const researchTop = pageTop(researchEl);
  const darkStart = researchTop - window.innerHeight * 0.9;
  const darkEnd = researchTop - window.innerHeight * 0.1;

  const y = window.scrollY;
  let t; // 0 = light, 1 = pink, 2 = dark
  if (y <= pulseStart) {
    t = 0;
  } else if (y < pulseEnd) {
    const local = gsap.utils.clamp(0, 1, (y - pulseStart) / Math.max(1, pulseEnd - pulseStart));
    t = gsap.utils.clamp(0, 1, local / 0.55);
  } else if (y < darkStart) {
    t = 1;
  } else if (y < darkEnd) {
    t = 1 + gsap.utils.clamp(0, 1, (y - darkStart) / Math.max(1, darkEnd - darkStart));
  } else {
    t = 2;
  }

  const [a, b, frac] = t <= 1 ? [THEME_STOPS.light, THEME_STOPS.pink, t] : [THEME_STOPS.pink, THEME_STOPS.dark, t - 1];
  const bg = lerp3(a.bg, b.bg, frac);
  const fg = lerp3(a.fg, b.fg, frac);
  const muted = lerp3(a.muted, b.muted, frac);

  const root = document.documentElement.style;
  root.setProperty("--live-bg", css(bg));
  root.setProperty("--live-fg", css(fg));
  root.setProperty("--live-muted", css(muted));
}

/* ---------------- horizontal pulse tracker: heart travels left -> right, line trails behind ---------------- */
function initTracker() {
  const fill = $("trackerFill");
  const heart = $("trackerHeart");
  const wrap = $("trackerCheckpoints");

  const sections = Array.from(document.querySelectorAll("main > section[data-checkpoint]"));
  const checkpointEls = sections.map((sec) => {
    const dot = document.createElement("div");
    dot.className = "tracker__checkpoint";
    dot.dataset.label = sec.dataset.checkpoint;
    wrap.appendChild(dot);
    return { el: sec, dot };
  });

  const trackLeft = 6, trackSpan = 88; // matches CSS left:6% / right:6%

  function layout() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    checkpointEls.forEach((cp) => {
      cp.frac = docHeight > 0 ? pageTop(cp.el) / docHeight : 0;
      cp.dot.style.left = `${trackLeft + cp.frac * trackSpan}%`;
    });
  }

  function update() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? gsap.utils.clamp(0, 1, window.scrollY / docHeight) : 0;
    const pos = trackLeft + progress * trackSpan;

    fill.style.width = `${pos - trackLeft}%`;
    heart.style.left = `${pos}%`;

    let activeIdx = 0;
    checkpointEls.forEach((cp, i) => {
      if (progress >= (cp.frac ?? 0) - 0.02) activeIdx = i;
    });
    checkpointEls.forEach(({ dot }, i) => dot.classList.toggle("is-active", i === activeIdx));

    updateTheme();
  }

  layout();
  update();
  window.addEventListener("resize", () => { layout(); update(); });
  window.addEventListener("scroll", update, { passive: true });
  ScrollTrigger.addEventListener("refresh", () => { layout(); update(); });
}

/* ---------------- reveal: fade content in on enter, fade out on exit, both directions ---------------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { threshold: 0.12, rootMargin: "-8% 0px -8% 0px" }
  );
  els.forEach((el) => io.observe(el));
}

hydratePulse();
runGate();
initHeroPhoto();
initPulseZoom();
initTracker();
initReveal();
$("year").textContent = new Date().getFullYear();

window.addEventListener("load", () => ScrollTrigger.refresh());
