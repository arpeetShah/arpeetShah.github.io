import Scene from "./scene.js";
import Chapters from "./chapters.js?b=33";
import ModelViewer from "./modelviewer.js";
import Ambience from "./audio.js";
import Fireworks from "./fireworks.js";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   ⬇⬇⬇  EDIT ALL YOUR CONTENT HERE  ⬇⬇⬇
   ============================================================ */
const CONTENT = {
  name: "Arpeet Shah",
  navMark: "ARPEET SHAH",
  role1: "Write.",
  role2: "Build.",
  role3: "Serve.",
  eyebrow: "WRITER · FOUNDER · ATHLETE — MCKINNEY, TX",
  heroSub:
    "I write The Pulse, co-founded a marketing agency, compete in cricket and tennis, and build the things that carry it all.",

  bio1:
    "I'm Arpeet — a high school student in McKinney, Texas. I write The Pulse, a weekly publication for high schoolers. I co-founded Orvexa, a social media marketing agency for small local businesses. I play cricket and tennis, and I tutor younger kids for free.",
  bio2:
    "Saturdays are for seva at BAPS Shri Swaminarayan Mandir, and most of the rest of my time goes to my family. After high school, I want to study medicine.",

  focus: ["Writing & Journalism", "Content & Marketing", "Web Development", "Research"],
  toolkit: ["JavaScript", "HTML / CSS", "Python", "Three.js", "Figma", "Notion"],

  email: "arpeet.s.shah@gmail.com",

  // "Now" — what you're focused on this season. Update the date + items freely.
  now: {
    lede: "What I'm focused on right now — and where it's headed.",
    updated: "Updated July 2026",
    items: [
      "Keeping The Pulse's every-Sunday streak alive and growing readership.",
      "Landing Orvexa's first clients and sharpening our content playbook.",
      "Training for tennis season and staying sharp in cricket.",
      "The long game: studying medicine — hopefully at Johns Hopkins — to do work that helps the community I'm in.",
    ],
  },

  /* ----------------------------------------------------------
     CHAPTERS — the 3D cards that fly toward you.
     Each one is an aspect of your life. Everything marked
     "TODO" is my best guess — rewrite it in your own words.
     `media`: give an item a `src` to use a real photo, e.g.
        { src: "images/pulse-home.jpg", caption: "The Pulse homepage" }
     otherwise it renders a labelled placeholder tile.
     `model`: torusKnot | icosahedron | octahedron | torus | box
              | sphere | dodecahedron
     ---------------------------------------------------------- */
  chapters: [
    {
      title: "The Pulse",
      kicker: "What I Built",
      color: "#6ee7ff",
      model: "torusKnot",
      image: "images/pulse-home.png",
      link: { label: "Read The Pulse", url: "https://arpeetshah.github.io/the-pulse/" },
      blurb: "A weekly publication for high schoolers — founded, researched, written and coded by me.",
      lede: "I couldn't find media written for people like me. So I built it.",
      body: [
        "The Pulse is a weekly publication covering what actually matters to high schoolers — sports and performance, money and entrepreneurship, mental health, science, and local stories worth knowing.",
        "I do all of it: pick the topic, read the studies, check the sources, write the piece, design the site, and ship it. It goes out every Sunday morning. It's free, and it always will be.",
        "The model is simple — <strong>real topics, real research, real voice</strong>. No fluff, no filler, no condescension.",
      ],
      stats: [
        { k: "Founded", v: "2025" },
        { k: "Cadence", v: "Every Sunday" },
        { k: "Role", v: "Founder / Writer / Dev" },
        { k: "Price", v: "Free, always" },
      ],
      media: [
        { src: "images/pulse-home.png", caption: "The Pulse homepage" },
        { src: "images/pulse-social.png", caption: "@read_thepulse" },
      ],
    },
    {
      title: "Orvexa",
      kicker: "The Business",
      color: "#ffb26e",
      model: "box",
      image: "images/orvexa-1.png",
      link: { label: "Visit Orvexa", url: "https://arpeetshah.github.io/orvexa/" },
      blurb: "A social media marketing agency I co-founded to get small local businesses seen.",
      lede: "Great local businesses lose to whoever posts better. We're trying to fix that.",
      body: [
        "Orvexa is a social media marketing agency I co-founded. We work with <strong>small local businesses</strong> — the ones with a real product and almost no marketing presence — and build them a presence that actually reflects how good they are.",
        "I'm co-founder and <strong>lead of content creation</strong>. I plan what goes out, make it, and shape the voice each business uses online. It's the same instinct behind The Pulse: figure out what people actually want to see, then go make it.",
        "We've built the model and are bringing on our first clients now. It's the part of my life where I'm learning the most the fastest — pitching, listening to owners, and finding out what a business really needs versus what it thinks it needs.",
      ],
      stats: [
        { k: "Role", v: "Co-founder · Content Lead" },
        { k: "Clients", v: "Small local business" },
        { k: "Stage", v: "Building client base" },
      ],
      media: [
        { src: "images/orvexa-1.png", caption: "Orvexa Media Strategies" },
        { src: "images/orvexa-2.png", caption: "Launch announcement" },
        { src: "images/orvexa-logo.png", caption: "Brand mark" },
      ],
    },
    {
      title: "Code & Craft",
      kicker: "What I'm Building",
      color: "#ff7ac6",
      model: "icosahedron",
      image: "images/code-1.png",
      link: { label: "See the code on GitHub", url: "https://github.com/arpeetShah" },
      blurb: "When the tool I need doesn't exist, I build it — sites, shaders, experiments.",
      lede: "I build the things that carry the writing.",
      body: [
        "I built The Pulse's site from scratch, and this portfolio too — WebGL, custom GLSL shaders, a GPU particle galaxy, and the 3D flythrough you just scrolled through.",
        "I like the part of engineering that's closest to design: how something <strong>feels</strong> when you move through it. Motion, timing, weight, response.",
        "Code is the through-line for everything else here — it's how The Pulse reaches people, how Orvexa shows its work, and how this site exists at all. I'm mostly self-taught, which means I learn by shipping something slightly harder than the last thing.",
      ],
      stats: [
        { k: "Stack", v: "JS · Three.js · Python" },
        { k: "Focus", v: "Creative dev" },
        { k: "Built", v: "2 sites & counting" },
      ],
      media: [
        { src: "images/portfolio-hero.png", caption: "This portfolio" },
        { src: "images/code-1.png", caption: "Projects on GitHub" },
        { src: "images/portfolio-contact.png", caption: "Particle-field contact" },
      ],
    },
  ],

  // "Life" — the human side, shown as calm cards inside About.
  life: [
    {
      title: "Two Sports",
      kicker: "Where I compete",
      body: "Cricket for seven years at the national level — multiple tournament MVPs — and three years on the Emerson High School tennis team, with several titles. One taught me the long game; the other taught me that when it's tight, nobody's coming to fix the next point but me.",
      stats: [
        { k: "Cricket", v: "7 yrs · national · MVPs" },
        { k: "Tennis", v: "Emerson HS · 3 yrs · titles" },
      ],
    },
    {
      title: "Service & Faith",
      kicker: "What I show up for",
      body: "I tutor younger students for free — not for pay, just because they need it. And every Saturday I spend about seven hours doing seva at BAPS Shri Swaminarayan Mandir. It's the foundation of my values, and it keeps everything else in proportion.",
      stats: [
        { k: "Tutoring", v: "Free, 1-on-1" },
        { k: "Seva", v: "~7 hrs every Saturday" },
      ],
    },
    {
      title: "Home & Family",
      kicker: "Where I'm from",
      body: "McKinney, Texas — my mom, my dad, and my older brother up in Minnesota who went first. Home base for all of it, and a place I care enough about to cover in The Pulse's Local Spotlights. Family isn't the thing I fit around everything else; it's the thing everything else fits around.",
      stats: [
        { k: "Based in", v: "McKinney, TX" },
        { k: "Family", v: "Mom · Dad · Brother" },
      ],
    },
  ],

  writing: [
    {
      title: "How I Stopped Choking Under Pressure",
      excerpt: "Losing points I should've won taught me that pressure isn't the enemy — panicking about the pressure is. Here's what actually helped.",
      category: "Sports", cat: "sports", date: "June 1, 2025", url: "https://arpeetshah.github.io/the-pulse/articles/choking-under-pressure.html",
    },
    {
      title: "How to Actually Study — Not Just Reread Your Notes",
      excerpt: "Rereading your notes feels productive and barely works. Here's what actually makes things stick — backed by real cognitive science.",
      category: "Science", cat: "science", date: "May 25, 2025", url: "https://arpeetshah.github.io/the-pulse/articles/how-to-actually-study.html",
    },
    {
      title: "You Don't Have to Choose Between Grades and Having Fun — You Just Have to Know When",
      excerpt: "Every high schooler is navigating the same tension. Here's what nobody tells you about handling it — and the research that backs it up.",
      category: "Mental Health", cat: "mental", date: "May 18, 2025", url: "https://arpeetshah.github.io/the-pulse/articles/grades-and-fun.html",
    },
    {
      title: "Why Your Brain Actually Works Differently After 10 PM",
      excerpt: "There's a reason late-night studying feels different. The science of your teen brain explains everything — including why you can't fall asleep.",
      category: "Science", cat: "science", date: "May 4, 2025", url: "https://arpeetshah.github.io/the-pulse/articles/brain-at-night.html",
    },
  ],

  // Anything still set to "#" is hidden automatically, so there are
  // never dead links. Paste a real URL in and it appears.
  socials: [
    { label: "The Pulse", url: "https://arpeetshah.github.io/the-pulse/" },
    { label: "Orvexa", url: "https://arpeetshah.github.io/orvexa/" },
    { label: "GitHub", url: "https://github.com/arpeetShah" },
    { label: "Instagram", url: "https://www.instagram.com/read_thepulse/" },
    { label: "TikTok", url: "https://www.tiktok.com/@read_thepulse" },
    { label: "Résumé", url: "resume.html" },
    { label: "Email", url: "mailto:arpeet.s.shah@gmail.com" },
  ],
};
/* ============================================================
   ⬆⬆⬆  END OF CONTENT  ⬆⬆⬆
   ============================================================ */

const $ = (id) => document.getElementById(id);
let lenisRef = null;
let modelViewer = null;
let ambience = null;

/* ---------------- Populate DOM ---------------- */
function hydrate() {
  const set = (sel, val) => document.querySelectorAll(sel).forEach((el) => (el.textContent = val));

  set("#navName", CONTENT.navMark);
  set("#footName", CONTENT.name);
  set("[data-name]", CONTENT.name);
  set("[data-eyebrow]", CONTENT.eyebrow);
  set("[data-h1a]", CONTENT.role1);
  set("[data-h1b]", CONTENT.role2);
  set("[data-h1c]", CONTENT.role3);
  set("[data-sub]", CONTENT.heroSub);
  set("[data-bio-1]", CONTENT.bio1);
  set("[data-bio-2]", CONTENT.bio2);
  $("year").textContent = new Date().getFullYear();

  const email = $("contactEmail");
  email.textContent = CONTENT.email;
  email.href = `mailto:${CONTENT.email}`;

  const list = (id, arr) => ($(id).innerHTML = arr.map((x) => `<li>${x}</li>`).join(""));
  list("focusList", CONTENT.focus);
  list("toolkitList", CONTENT.toolkit);

  // Now section
  if (CONTENT.now) {
    $("nowLede").textContent = CONTENT.now.lede;
    $("nowUpdated").textContent = CONTENT.now.updated;
    $("nowList").innerHTML = CONTENT.now.items.map((x) => `<li>${x}</li>`).join("");
  }

  // Life cards (About)
  if (CONTENT.life) {
    $("lifeCards").innerHTML = CONTENT.life
      .map(
        (c) => `
        <div class="life__card reveal-up">
          <span class="life__kicker">${c.kicker}</span>
          <h3 class="life__title">${c.title}</h3>
          <p class="life__body">${c.body}</p>
          <dl class="life__stats">${(c.stats || [])
            .map((s) => `<div><dt>${s.k}</dt><dd>${s.v}</dd></div>`)
            .join("")}</dl>
        </div>`
      )
      .join("");
  }

  $("writing-list").innerHTML = CONTENT.writing
    .map(
      (a) => `
      <a class="article" href="${a.url}" data-cursor ${
        a.url.startsWith("http") ? 'target="_blank" rel="noopener"' : ""
      }>
        <div class="article__top">
          <span class="article__cat" data-cat="${a.cat}">${a.category}</span>
          <span class="article__date">${a.date}</span>
        </div>
        <h3 class="article__title">${a.title}</h3>
        <p class="article__excerpt">${a.excerpt}</p>
        <span class="article__link">Read article</span>
      </a>`
    )
    .join("");

  // only render links that actually go somewhere
  $("socials").innerHTML = CONTENT.socials
    .filter((s) => s.url && s.url !== "#")
    .map((s) => {
      const ext = s.url.startsWith("http");
      return `<a href="${s.url}" data-cursor${ext ? ' target="_blank" rel="noopener"' : ""}>${s.label}</a>`;
    })
    .join("");
}

/* ---------------- Custom cursor ---------------- */
function initCursor() {
  const ring = document.querySelector(".cursor");
  const dot = document.querySelector(".cursor-dot");
  const label = $("cursorLabel");
  if (!ring || matchMedia("(pointer: coarse)").matches) return;

  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
  let hoverLabel = null;
  addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; });

  // what should the cursor say for a given clickable element?
  const labelFor = (el) => {
    if (el.closest(".article")) return "Read";
    if (el.closest(".chapters__open, .detail__cta, .showcase__cta")) return "Open";
    const explicit = el.getAttribute("data-cursor");
    if (el.matches("a[href^='mailto']")) return "Email";
    if (el.matches("a[target='_blank']")) return "Visit";
    return explicit && explicit.length ? explicit : "View";
  };

  const render = () => {
    rx += (x - rx) * 0.18;
    ry += (y - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    dot.style.transform = `translate(${x}px, ${y}px)`;

    // clickable 3D chapter objects flag the body; surface an "Open" label
    const cardHover = document.body.classList.contains("is-card-hover");
    const text = cardHover ? "Open" : hoverLabel;
    if (text) {
      if (label.textContent !== text) label.textContent = text;
      label.classList.add("show");
      ring.classList.add("is-hover");
    } else {
      label.classList.remove("show");
      if (!hoverLabel) ring.classList.remove("is-hover");
    }
    label.style.left = x + "px";
    label.style.top = y + "px";
    requestAnimationFrame(render);
  };
  render();

  document.addEventListener("pointerover", (e) => {
    const el = e.target.closest("[data-cursor]");
    if (el) { ring.classList.add("is-hover"); hoverLabel = labelFor(el); }
  });
  document.addEventListener("pointerout", (e) => {
    if (e.target.closest("[data-cursor]")) { ring.classList.remove("is-hover"); hoverLabel = null; }
  });
}

/* ---------------- Preloader ---------------- */
function preload() {
  return new Promise((resolve) => {
    const pct = $("loadPct");
    const ekg = $("loadEkg");
    const len = ekg ? ekg.getTotalLength() : 0;
    if (ekg) {
      ekg.style.strokeDasharray = len;
      ekg.style.strokeDashoffset = len;
    }
    let p = 0;
    const tick = () => {
      p = Math.min(100, p + Math.random() * 12 + 4);
      pct.textContent = Math.floor(p);
      if (ekg) ekg.style.strokeDashoffset = len * (1 - p / 100);
      if (p < 100) setTimeout(tick, 90);
      else setTimeout(resolve, 250);
    };
    tick();
  });
}

/* ---------------- Chapter detail overlay ---------------- */
function openDetail(i) {
  const c = CONTENT.chapters[i];
  if (!c) return;

  $("dKicker").textContent = c.kicker;
  $("dTitle").textContent = c.title;
  $("dLede").textContent = c.lede || c.blurb;

  // "visit the real thing" button — hidden when there's no link yet
  const link = $("dLink");
  if (c.link && c.link.url && c.link.url !== "#") {
    link.style.display = "";
    link.href = c.link.url;
    link.innerHTML = `${c.link.label || "Visit"} <i>↗</i>`;
  } else {
    link.style.display = "none";
  }
  $("dBody").innerHTML = (c.body || []).map((p) => `<p>${p}</p>`).join("");
  $("dStats").innerHTML = (c.stats || [])
    .map((s) => `<div><dt>${s.k}</dt><dd>${s.v}</dd></div>`)
    .join("");

  const media = c.media || [];
  $("dMediaHead").style.display = media.length ? "" : "none";
  $("dMedia").innerHTML = media
    .map((m) =>
      m.src
        ? `<figure class="detail__shot" data-caption="${m.caption || ""}"><img src="${m.src}" alt="${m.caption || ""}" /></figure>`
        : `<figure class="detail__shot detail__shot--ph"><span>${m.caption || "Add a photo"}</span></figure>`
    )
    .join("");

  // if an image file isn't there yet, fall back to the labelled placeholder
  $("dMedia").querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      const fig = img.closest(".detail__shot");
      if (!fig) return;
      fig.classList.add("detail__shot--ph");
      fig.innerHTML = `<span>${fig.dataset.caption || "Add a photo"}</span>`;
    });
  });

  const el = $("detail");
  el.querySelector(".detail__scroll").scrollTop = 0;
  el.classList.add("is-open");
  el.setAttribute("aria-hidden", "false");
  lenisRef && lenisRef.stop();
  ambience && ambience.muffle(true); // sound sinks underwater

  if (!modelViewer) modelViewer = new ModelViewer($("dModel"));
  window.__model = modelViewer; // exposed for debugging
  modelViewer.show(c.model, c.color);
  requestAnimationFrame(() => modelViewer.resize());

  gsap.fromTo(".detail__inner", { y: 46, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: "expo.out" });
}

function closeDetail() {
  const el = $("detail");
  el.classList.remove("is-open");
  el.setAttribute("aria-hidden", "true");
  lenisRef && lenisRef.start();
  ambience && ambience.muffle(false); // and comes back up
}

/* ---------------- Ambient sound ---------------- */
function initSound() {
  ambience = new Ambience();
  window.__ambience = ambience; // exposed for debugging
  const btn = $("soundToggle");
  const label = btn.querySelector(".nav__sound-label");

  const paint = (on) => {
    btn.classList.toggle("is-on", on);
    btn.setAttribute("aria-pressed", String(on));
    label.textContent = on ? "Sound on" : "Sound";
  };

  btn.addEventListener("click", async () => {
    const on = await ambience.toggle();
    paint(on);
    try { localStorage.setItem("pf-sound", on ? "1" : "0"); } catch {}
  });

  // Browsers block autoplay, so returning visitors who had sound on
  // get it back on their first interaction.
  let wanted = false;
  try { wanted = localStorage.getItem("pf-sound") === "1"; } catch {}
  if (wanted) {
    const kick = async () => { paint(await ambience.enable()); };
    window.addEventListener("pointerdown", kick, { once: true });
  }
}

/* ---------------- Contact celebration ---------------- */
function initContactFx() {
  const canvas = $("contactFx");
  const fx = new Fireworks(canvas);
  window.__fx = fx; // exposed for debugging
  setTimeout(() => fx.resize(), 200);

  ScrollTrigger.create({
    trigger: ".contact",
    start: "top 65%",
    onEnter: () => { fx.resize(); fx.celebrate(); },
    onEnterBack: () => fx.celebrate(),
  });

  $("contactEmail").addEventListener("click", (e) => {
    const r = canvas.getBoundingClientRect();
    fx.burst(e.clientX - r.left, e.clientY - r.top, 95);
  });

  return fx;
}

/* ---------------- Chapters flythrough ---------------- */
function initChapters() {
  const section = $("work");
  // enough scroll runway for every card to fly past
  section.style.height = CONTENT.chapters.length * 70 + 60 + "vh";

  const rail = $("chRail");
  rail.innerHTML = CONTENT.chapters.map(() => `<span class="chapters__tick"></span>`).join("");
  const ticks = [...rail.children];

  const focusEl = $("chFocus");
  const kicker = $("chKicker"), title = $("chTitle"), blurb = $("chBlurb"), openBtn = $("chOpen");
  const els = [kicker, title, blurb, openBtn];

  const chapters = new Chapters($("chapters-gl"), CONTENT.chapters, {
    onFocus: (i) => {
      ticks.forEach((t, ti) => t.classList.toggle("is-active", ti === i));
      if (i < 0) {
        gsap.to(focusEl, { opacity: 0, duration: 0.3 });
        return;
      }
      const c = CONTENT.chapters[i];
      gsap.to(focusEl, { opacity: 1, duration: 0.3 });
      gsap.timeline()
        .to(els, { y: -14, opacity: 0, duration: 0.22, stagger: 0.03, ease: "power2.in" })
        .add(() => {
          kicker.textContent = c.kicker;
          title.textContent = c.title;
          blurb.textContent = c.blurb;
        })
        .fromTo(els, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.05, ease: "expo.out" });
    },
    onSelect: (i) => openDetail(i),
  });

  openBtn.addEventListener("click", () => {
    if (chapters.focused >= 0) openDetail(chapters.focused);
  });

  $("detailClose").addEventListener("click", closeDetail);
  $("detail").addEventListener("click", (e) => {
    if (e.target.id === "detail" || e.target.classList.contains("detail__scroll")) closeDetail();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && $("detail").classList.contains("is-open")) closeDetail();
  });

  return chapters;
}

/* ---------------- Scroll + reveals ---------------- */
function initScroll(scene, chapters) {
  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
  lenisRef = lenis;
  window.__lenis = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const scrollBar = $("scrollBar");
  const workSection = $("work");
  const bgFade = $("bgFade");
  const webgl = $("webgl");
  const vignette = document.querySelector(".vignette");
  const heart = $("heart");
  const scrollCue = $("scrollCue");
  const root = document.documentElement;

  // heart flows across + down the page, easing toward its scroll targets
  let heartX = window.innerWidth * 0.14, heartTargetX = heartX;
  let heartY = window.innerHeight * 0.2, heartTargetY = heartY;
  const heartLoop = () => {
    heartX += (heartTargetX - heartX) * 0.06;
    heartY += (heartTargetY - heartY) * 0.06;
    if (heart) {
      heart.style.left = heartX.toFixed(1) + "px";
      heart.style.top = heartY.toFixed(1) + "px";
    }
    requestAnimationFrame(heartLoop);
  };
  heartLoop();

  const hex = (h) => [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  const INK_DARK = hex("05060a"), INK_LIGHT = hex("eef0f4");
  const lerpN = (a, b, t) => a + (b - a) * t;
  const mixInk = (t) =>
    `rgb(${INK_DARK.map((c, i) => Math.round(c + (INK_LIGHT[i] - c) * t)).join(",")})`;

  // dark jewel tones the background washes through as you scroll deeper
  const DARK_STOPS = [
    [10, 12, 28],   // deep indigo
    [22, 10, 30],   // deep violet
    [28, 10, 22],   // deep plum
    [8, 20, 26],    // deep teal
    [14, 12, 30],   // back toward indigo
  ];
  const paletteColor = (p) => {
    const n = DARK_STOPS.length - 1;
    const x = Math.min(Math.max(p, 0), 1) * n;
    const i = Math.min(Math.floor(x), n - 1);
    const f = x - i;
    return DARK_STOPS[i].map((c, k) => lerpN(c, DARK_STOPS[i + 1][k], f));
  };

  const onScroll = () => {
    const scroll = Number.isFinite(lenis.scroll) ? lenis.scroll : window.scrollY || 0;
    const limit = lenis.limit > 0 ? lenis.limit : document.body.scrollHeight - window.innerHeight;
    const t = limit > 0 ? scroll / limit : 0;
    scene.setProgress(t);
    scrollBar.style.width = t * 100 + "%";

    // white -> black transition over the first ~0.85 viewport of scroll
    const vh = window.innerHeight;
    const denom = vh * 0.85;
    const fade = denom > 0 ? Math.min(Math.max(scroll / denom, 0), 1) : 0;
    // background washes: white at the top -> evolving dark jewel tones
    const dark = paletteColor(t);
    const bg = dark.map((c) => Math.round(lerpN(255, c, fade)));
    bgFade.style.background = `rgb(${bg[0]},${bg[1]},${bg[2]})`;
    webgl.style.opacity = fade;
    vignette.style.opacity = fade;
    root.style.setProperty("--ink", mixInk(Math.min(fade * 1.35, 1)));

    // heart flows across + down the page as you scroll
    heartTargetY = (0.22 + t * 0.62) * vh;
    heartTargetX = (0.1 + 0.78 * (0.5 - 0.5 * Math.cos(t * Math.PI * 3))) * window.innerWidth;

    // keep-scrolling cue stays until you're near the very bottom
    scrollCue.classList.toggle("show", t < 0.92);

    if (chapters) {
      const rect = workSection.getBoundingClientRect();
      const total = workSection.offsetHeight - window.innerHeight;
      chapters.setProgress(total > 0 ? -rect.top / total : 0);
    }
  };
  lenis.on("scroll", onScroll);
  window.addEventListener("resize", onScroll);
  onScroll();
  requestAnimationFrame(onScroll);
  setTimeout(onScroll, 400);

  // per-section label that fades in as each section crosses the middle
  const sectionLabel = $("sectionLabel"), sectionNum = $("sectionNum"), sectionName = $("sectionName");
  const SECTIONS = [
    { id: "work", num: "01", name: "Work" },
    { id: "writing", num: "02", name: "Writing" },
    { id: "about", num: "03", name: "About" },
    { id: "now", num: "04", name: "Now & Next" },
    { id: "contact", num: "05", name: "Contact" },
  ];
  const secObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const s = SECTIONS.find((x) => x.id === e.target.id);
        if (s) {
          sectionNum.textContent = s.num;
          sectionName.textContent = s.name;
          sectionLabel.classList.add("show");
        } else {
          sectionLabel.classList.remove("show"); // hero / intro
        }
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );
  ["hero", "intro", ...SECTIONS.map((s) => s.id)].forEach((id) => {
    const el = $(id);
    if (el) secObs.observe(el);
  });

  const introTl = gsap.timeline({ defaults: { ease: "expo.out" } });
  introTl
    .from(".hero__eyebrow", { yPercent: 120, opacity: 0, duration: 1 })
    .from(".hero__title .line span", { yPercent: 120, duration: 1.2, stagger: 0.12 }, "-=0.7")
    .from(".hero__tagline", { y: 24, opacity: 0, duration: 1 }, "-=0.8")
    .from(".hero__sub", { y: 30, opacity: 0, duration: 1 }, "-=0.7")
    .from(".hero__scroll", { opacity: 0, duration: 1 }, "-=0.6")
    .from(".nav", { opacity: 0, y: -20, duration: 1 }, "-=0.9");

  gsap.utils.toArray(".reveal-up").forEach((el) => {
    gsap.from(el, {
      y: 60, opacity: 0, duration: 1.1, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  });

  gsap.to(gsap.utils.toArray(".intro__text .w"), {
    opacity: 1, stagger: 0.5, ease: "none",
    scrollTrigger: { trigger: ".intro", start: "top 60%", end: "bottom 70%", scrub: true },
  });

  gsap.utils.toArray(".article").forEach((el) => {
    gsap.from(el, {
      y: 50, opacity: 0, duration: 1, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 92%" },
    });
  });

  return introTl;
}

/* ---------------- Boot ---------------- */
async function boot() {
  // always start at the hero — never restore a mid-flythrough scroll position
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  hydrate();
  initCursor();

  const scene = new Scene($("webgl"));
  window.__scene = scene;
  window.addEventListener("resize", () => scene.resize());

  const chapters = initChapters();
  window.__chapters = chapters;

  const loop = () => { scene.update(); requestAnimationFrame(loop); };
  loop();

  initSound();
  const introTl = initScroll(scene, chapters);
  initContactFx();
  introTl.pause();

  await preload();
  $("preloader").classList.add("is-done");
  introTl.play();
  ScrollTrigger.refresh();
}

boot();
