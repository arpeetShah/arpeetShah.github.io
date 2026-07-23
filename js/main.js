import Scene from "./scene.js";
import Chapters from "./chapters.js";
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
  role1: "WRITE.",
  role2: "BUILD.",
  role3: "SERVE.",
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
    lede: "What I'm focused on right now.",
    updated: "Updated July 2026",
    items: [
      "Keeping The Pulse's every-Sunday streak alive and growing readership.",
      "Landing Orvexa's first clients and sharpening our content playbook.",
      "Training for tennis season and staying sharp in cricket.",
      "Saturdays at the mandir — and building toward the pre-med path.",
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
        { src: "images/pulse-article.png", caption: "An article layout" },
        { src: "images/pulse-social.png", caption: "Instagram / TikTok" },
      ],
    },
    {
      title: "Orvexa",
      kicker: "The Business",
      color: "#ffb26e",
      model: "box",
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
        { src: "images/orvexa-1.png", caption: "Orvexa — brand / site" },
        { src: "images/orvexa-2.png", caption: "Product or dashboard" },
      ],
    },
    {
      title: "Writing",
      kicker: "How I Think",
      color: "#b98bff",
      model: "torus",
      link: { label: "Read the articles", url: "https://arpeetshah.github.io/the-pulse/articles.html" },
      blurb: "Research-backed writing, peer to peer — never talking down to the reader.",
      lede: "Every article starts with a question I couldn't answer.",
      body: [
        "Something I've noticed, a tension I keep running into, something that doesn't add up. Then I actually go research it. I read studies. I check sources. I look for the thing that's true, not just the thing that sounds good.",
        "Then I write it peer to peer — not like a textbook, not like a news wire. Short paragraphs. Plain language. No jargon unless I explain it. Every claim that matters has a source at the bottom of the page.",
        "It's the part of my life that's taught me the most: you understand something only once you can explain it simply.",
      ],
      stats: [
        { k: "Beats", v: "5 categories" },
        { k: "Approach", v: "Cited & researched" },
        { k: "Voice", v: "Peer to peer" },
      ],
      media: [
        { caption: '"Grades vs. Having Fun"' },
        { caption: '"Your Brain After 10 PM"' },
        { caption: "Research notes & sources" },
      ],
    },
    {
      title: "Code & Craft",
      kicker: "What I'm Building",
      color: "#ff7ac6",
      model: "icosahedron",
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
        { src: "images/portfolio-hero.png", caption: "This portfolio — WebGL galaxy" },
        { src: "images/code-1.png", caption: "A project screenshot" },
      ],
    },
    {
      title: "Two Sports",
      kicker: "Where I Compete",
      color: "#7ce7a8",
      model: "octahedron",
      blurb: "Cricket for seven years at the national level, tennis for three at Emerson High.",
      lede: "Two sports that demand two completely different kinds of nerve.",
      body: [
        "I've played <strong>cricket for seven years</strong>, including at national tournaments, and I've been on the <strong>Emerson High School tennis team</strong> for three.",
        "Cricket taught me the long game — matches that stretch for hours where staying focused <em>is</em> the skill. Tennis taught me the opposite lesson: you're alone out there, nobody is coming to fix the next point for you. I've been named <strong>MVP at multiple cricket tournaments</strong> and won several tennis tournaments.",
        "Competing is also why I write about athletic performance and recruiting for The Pulse. It's my own life, not just a beat I cover.",
      ],
      stats: [
        { k: "Cricket", v: "7 years · national level" },
        { k: "Tennis", v: "Emerson HS · 3 years" },
        { k: "Honors", v: "Multiple cricket MVPs" },
        { k: "Tennis titles", v: "Multiple tournament wins" },
      ],
      media: [
        { src: "images/sport-game.jpg", caption: "Match day" },
        { src: "images/sport-team.jpg", caption: "The team" },
      ],
    },
    {
      title: "Tutoring",
      kicker: "Passing It On",
      color: "#ff9f7a",
      model: "torus",
      blurb: "Free tutoring for younger kids who need the help. Not a business — just the right thing.",
      lede: "I tutor younger kids for free. That's the whole model.",
      body: [
        "Any younger student who needs help can get it from me, and it doesn't cost them anything. I'm not doing it to make money or add a line to a résumé — <strong>I'm doing it for them</strong>.",
        "It turns out teaching something is the fastest way to find out whether you actually understand it. It's made me a better writer, too: if I can't explain something simply to a kid, I don't know it well enough to publish it.",
      ],
      stats: [
        { k: "What", v: "1-on-1 tutoring" },
        { k: "Who", v: "Younger students" },
        { k: "Cost", v: "Free, always" },
      ],
      media: [{ src: "images/tutoring.jpg", caption: "Tutoring" }],
    },
    {
      title: "Seva",
      kicker: "What I Show Up For",
      color: "#b98bff",
      model: "icosahedron",
      blurb: "Seven hours every Saturday at BAPS Shri Swaminarayan Mandir — where my values come from.",
      lede: "Every Saturday. Seven hours. No exceptions.",
      body: [
        "I volunteer at <strong>BAPS Shri Swaminarayan Mandir</strong> every Saturday, usually around seven hours. It's my faith and the foundation of my life — nearly every value I have traces back to there.",
        "It's the part of my week that keeps everything else in proportion. Whatever is happening with school, tennis, The Pulse or Orvexa, Saturday resets it.",
        "It also taught me the thing I try to carry everywhere else: <strong>showing up consistently matters more than showing up impressively.</strong>",
      ],
      stats: [
        { k: "Where", v: "BAPS Shri Swaminarayan Mandir" },
        { k: "When", v: "Every Saturday" },
        { k: "Hours", v: "~7 per week" },
      ],
      media: [{ src: "images/service.jpg", caption: "Seva at the mandir" }],
    },
    {
      title: "Family",
      kicker: "What Shaped Me",
      color: "#ffd76e",
      model: "dodecahedron",
      blurb: "My mom, my dad, and my older brother — the people behind everything else on this site.",
      lede: "Everything here traces back to three people.",
      body: [
        "My mom and dad live with me here in McKinney, and both have built stable careers. My older brother is up in <strong>Minnesota</strong> — working, settled, and the one who went first.",
        "We spend a lot of time together, and that's deliberate. Family isn't the thing I fit around everything else; it's the thing everything else fits around.",
      ],
      stats: [
        { k: "Family", v: "Mom, Dad, Brother" },
        { k: "Brother", v: "Minnesota" },
      ],
      media: [{ src: "images/roots.jpg", caption: "Family" }],
    },
    {
      title: "McKinney",
      kicker: "Where I'm From",
      color: "#ffb26e",
      model: "sphere",
      link: {
        label: "Read my McKinney story",
        url: "https://arpeetshah.github.io/the-pulse/articles/mckinney-startup-scene.html",
      },
      blurb: "A Texas suburb with a lot more going on than most people realize.",
      lede: "Home base — and a beat I actually cover.",
      body: [
        "McKinney, Texas. I write a Local Spotlights column about it: teen founders, small business owners, and the people quietly rewriting what a Texas suburb looks like.",
        "Reporting on my own town taught me there's a story on basically every street if you bother to ask.",
        "It's home base for all of it — school at <strong>Emerson High</strong>, tennis, the mandir on Saturdays, and my family. Everything on this site happens within about fifteen minutes of here.",
      ],
      stats: [
        { k: "Based in", v: "McKinney, TX" },
        { k: "School", v: "Emerson High School" },
        { k: "Column", v: "Local Spotlights" },
      ],
      media: [{ src: "images/mckinney.jpg", caption: "Downtown McKinney" }],
    },
    {
      title: "What's Next",
      kicker: "Where I'm Going",
      color: "#6ee7ff",
      model: "torusKnot",
      blurb: "Medicine — hopefully Johns Hopkins — plus tennis, and time with the people who matter.",
      lede: "I want to be a doctor.",
      body: [
        "The goal is <strong>medicine</strong>, and <strong>Johns Hopkins</strong> is the target. The reason is the same one behind The Pulse and the free tutoring: I want the work I do to actually help the community I'm standing in.",
        "Alongside that — keep getting seriously good at tennis, keep growing The Pulse and Orvexa, and keep spending real time with my family. Not everything has to be a career move.",
        "If you're building something interesting, I'd like to hear about it.",
      ],
      stats: [
        { k: "Goal", v: "Medicine" },
        { k: "Dream school", v: "Johns Hopkins" },
        { k: "Also", v: "Tennis · The Pulse · Orvexa" },
      ],
      media: [{ src: "images/portrait.jpg", caption: "Portrait" }],
    },
  ],

  writing: [
    {
      title: "You Don't Have to Choose Between Grades and Having Fun — You Just Have to Know When",
      excerpt: "Every high schooler is navigating the same tension. Here's what nobody tells you about handling it — and the research that backs it up.",
      category: "Mental Health", cat: "mental", date: "May 18, 2025", url: "https://arpeetshah.github.io/the-pulse/articles/grades-and-fun.html",
    },
    {
      title: "How to Start Making Real Money Before You Graduate",
      excerpt: "You don't need a work permit or a boss. Here's what actually works for high schoolers who want to earn on their own terms.",
      category: "Money", cat: "money", date: "May 11, 2025", url: "https://arpeetshah.github.io/the-pulse/articles/making-money-in-high-school.html",
    },
    {
      title: "Why Your Brain Actually Works Differently After 10 PM",
      excerpt: "There's a reason late-night studying feels different. The science of your teen brain explains everything — including why you can't fall asleep.",
      category: "Science", cat: "science", date: "May 4, 2025", url: "https://arpeetshah.github.io/the-pulse/articles/brain-at-night.html",
    },
    {
      title: "The Truth About Getting Recruited That Nobody Told Me",
      excerpt: "College sports recruitment is a game most high schoolers play without knowing the rules. Here's what I learned from coaches and athletes.",
      category: "Sports", cat: "sports", date: "Apr 27, 2025", url: "https://arpeetshah.github.io/the-pulse/articles/sports-recruiting-truth.html",
    },
    {
      title: "McKinney Has a Startup Scene and Most Locals Have No Idea",
      excerpt: "From teen founders to small business owners rewriting what a Texas suburb looks like — here's what's quietly building in our backyard.",
      category: "Local", cat: "local", date: "Apr 20, 2025", url: "https://arpeetshah.github.io/the-pulse/articles/mckinney-startup-scene.html",
    },
  ],

  // Anything still set to "#" is hidden automatically, so there are
  // never dead links. Paste a real URL in and it appears.
  socials: [
    { label: "The Pulse", url: "https://arpeetshah.github.io/the-pulse/" },
    { label: "GitHub", url: "https://github.com/arpeetShah" },
    { label: "Orvexa", url: "#" },      // TODO: Orvexa site
    { label: "Instagram", url: "#" },   // TODO: instagram.com/yourhandle
    { label: "TikTok", url: "#" },      // TODO: tiktok.com/@yourhandle
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
  if (!ring || matchMedia("(pointer: coarse)").matches) return;

  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
  addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; });

  const render = () => {
    rx += (x - rx) * 0.18;
    ry += (y - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    dot.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(render);
  };
  render();

  document.addEventListener("pointerover", (e) => {
    if (e.target.closest("[data-cursor]")) ring.classList.add("is-hover");
  });
  document.addEventListener("pointerout", (e) => {
    if (e.target.closest("[data-cursor]")) ring.classList.remove("is-hover");
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

  const onScroll = ({ scroll, limit }) => {
    const t = limit > 0 ? scroll / limit : 0;
    scene.setProgress(t);
    scrollBar.style.width = t * 100 + "%";

    if (chapters) {
      const rect = workSection.getBoundingClientRect();
      const total = workSection.offsetHeight - window.innerHeight;
      chapters.setProgress(total > 0 ? -rect.top / total : 0);
    }
  };
  lenis.on("scroll", onScroll);
  onScroll({ scroll: window.scrollY, limit: document.body.scrollHeight - window.innerHeight });

  const introTl = gsap.timeline({ defaults: { ease: "expo.out" } });
  introTl
    .from(".hero__eyebrow", { yPercent: 120, opacity: 0, duration: 1 })
    .from(".hero__title .line span", { yPercent: 120, duration: 1.2, stagger: 0.12 }, "-=0.7")
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
