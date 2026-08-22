const FALLBACK_VIDEOS = [
  { id: "OLzJZoZG5H8", title: "pickle animations trailer", thumbnail: "https://i.ytimg.com/vi/OLzJZoZG5H8/hqdefault.jpg", isShort: false },
  { id: "zx5aziGVCm0", title: "computer virus",            thumbnail: "https://i.ytimg.com/vi/zx5aziGVCm0/hqdefault.jpg", isShort: false },
  { id: "1boXXjJdjag", title: "Channel trailer (better)",  thumbnail: "https://i.ytimg.com/vi/1boXXjJdjag/hqdefault.jpg", isShort: false },
  { id: "uL2Bv4NBcIQ", title: "Sans vs a pickle",          thumbnail: "https://i.ytimg.com/vi/uL2Bv4NBcIQ/hqdefault.jpg", isShort: false },
  { id: "Pq9Kw7ktcbc", title: "numbers 1-20 in Swedish",   thumbnail: "https://i.ytimg.com/vi/Pq9Kw7ktcbc/hqdefault.jpg", isShort: false },
  { id: "T0zDuZcsbXc", title: "School stories",            thumbnail: "https://i.ytimg.com/vi/T0zDuZcsbXc/hqdefault.jpg", isShort: false },
  { id: "rM8RcO-Azek", title: "Switch 2 review & more",    thumbnail: "https://i.ytimg.com/vi/rM8RcO-Azek/hqdefault.jpg", isShort: false },
];

let videos = FALLBACK_VIDEOS;
let selectedVideoIndex = null;

const dom = {
  heroContent: document.getElementById("hero-content"),
  glow1:       document.getElementById("parallax-glow-1"),
  glow2:       document.getElementById("parallax-glow-2"),
  glow3:       document.getElementById("parallax-glow-3"),
  glow4:       document.getElementById("parallax-glow-4"),
  videoScroll: document.getElementById("video-scroll"),
  videoTrack:  document.getElementById("video-track"),
  navbar:      document.getElementById("navbar"),
  backToTop:   document.getElementById("back-to-top"),
  cursorDot:   document.getElementById("cursor-dot"),
  cursorRing:  document.getElementById("cursor-ring"),
};

let scrollRafPending = false;
let lastScrollY = window.scrollY;
let navbarScrolled = false;
let backToTopVisible = false;

function onScrollFrame() {
  scrollRafPending = false;
  const y = lastScrollY;

  if (dom.heroContent) dom.heroContent.style.transform = `translateY(${y * 0.3}px)`;
  if (dom.glow1) dom.glow1.style.transform = `translateY(${y * -0.25}px)`;
  if (dom.glow3) dom.glow3.style.transform = `translateY(${y * -0.25}px)`;
  if (dom.glow2) dom.glow2.style.transform = `translateY(${y * -0.45}px)`;
  if (dom.glow4) dom.glow4.style.transform = `translateY(${y * -0.65}px)`;

  if (dom.videoScroll && dom.videoTrack) {
    const rect = dom.videoScroll.getBoundingClientRect();
    const progress = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0), 1);
    dom.videoTrack.style.transform = `translateX(${-progress * 50}%)`;
  }

  const shouldBeScrolled = y > 50;
  if (shouldBeScrolled !== navbarScrolled) {
    navbarScrolled = shouldBeScrolled;
    dom.navbar?.classList.toggle("scrolled", navbarScrolled);
  }

  const shouldShowBtt = y > window.innerHeight * 0.5;
  if (shouldShowBtt !== backToTopVisible) {
    backToTopVisible = shouldShowBtt;
    dom.backToTop?.classList.toggle("visible", backToTopVisible);
  }
}

window.addEventListener("scroll", () => {
  lastScrollY = window.scrollY;
  if (!scrollRafPending) {
    scrollRafPending = true;
    requestAnimationFrame(onScrollFrame);
  }
}, { passive: true });

if (window.matchMedia("(pointer: fine)").matches) {
  let mouseX = -999, mouseY = -999;
  let ringX = -999,  ringY = -999;
  let firstMove = true;
  let isHovering = false;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (firstMove) {
      firstMove = false;
      ringX = mouseX;
      ringY = mouseY;
      if (dom.cursorDot)  dom.cursorDot.style.opacity  = "1";
      if (dom.cursorRing) dom.cursorRing.style.opacity = "1";
    }

    isHovering = !!e.target.closest("a, button");

    if (dom.cursorDot) {
      dom.cursorDot.style.opacity   = isHovering ? "0" : "1";
      dom.cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }
    if (dom.cursorRing) {
      dom.cursorRing.style.backgroundColor = isHovering ? "rgba(74, 222, 128, 0.1)" : "transparent";
    }
  }, { passive: true });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    if (dom.cursorRing) {
      dom.cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`;
    }
    requestAnimationFrame(animateRing);
  })();

  document.addEventListener("mouseleave", () => {
    if (dom.cursorDot)  dom.cursorDot.style.opacity  = "0";
    if (dom.cursorRing) dom.cursorRing.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    if (!firstMove) {
      if (dom.cursorDot)  dom.cursorDot.style.opacity  = "1";
      if (dom.cursorRing) dom.cursorRing.style.opacity = "1";
    }
  });
}

fetch("https://inv.thepixora.com/api/v1/channels/UCX7iVX9LYVub_JnySHIMGyA")
  .then(r => r.json())
  .then(d => {
    if (typeof d !== "object" || !d.subCount) throw new Error("bad response");

    const el = document.getElementById("subscriber-count");
    if (el && d.subCount) el.textContent = d.subCount.toLocaleString();

    const banner = d.authorBanners?.[0];
    if (banner) {
      const img = document.getElementById("hero-banner-img");
      const bannerEl = document.getElementById("hero-banner");
      if (img && bannerEl) {
        img.src = banner.url;
        bannerEl.classList.add("visible");
      }
    }

    if (Array.isArray(d.latestVideos) && d.latestVideos.length > 0) {
      videos = d.latestVideos.map(v => {
        const thumb = v.videoThumbnails?.find(t => t.quality === "high") ?? v.videoThumbnails?.[0];
        return {
          id:        v.videoId,
          title:     v.title,
          thumbnail: thumb?.url ?? `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
          isShort:   v.lengthSeconds > 0 && v.lengthSeconds <= 60,
        };
      });
      renderVideos();
    }
  })
  .catch(() => {
    const el = document.getElementById("subscriber-count");
    if (el) el.textContent = "121";
  });

setTimeout(() => {
  dom.heroContent?.classList.add("visible");
  document.querySelectorAll(".hero-animated-item").forEach(el => el.classList.add("visible"));
}, 100);

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  }
}, { threshold: 0.1, rootMargin: "-50px" });

["drawings-header", "socials-header", "drawings-preview-header"].forEach(id => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});

function makeDrawingCard(src, idx) {
  const el = document.createElement("div");
  el.className = "drawing-card";
  el.style.transitionDelay = `${(idx % 6) * 100}ms`;
  if (src) {
    el.innerHTML = `<img src="${src}" alt="Drawing ${idx + 1}" loading="lazy" decoding="async" />`;
  } else {
    el.innerHTML = `<img src="/icons/photo.svg" alt="" aria-hidden="true" class="drawing-placeholder-icon" />`;
  }
  return el;
}

function renderDrawings(filenames) {
  const drawingsGrid = document.getElementById("drawings-grid");
  if (drawingsGrid) {
    const frag = document.createDocumentFragment();
    filenames.forEach((name, i) => {
      const card = makeDrawingCard(`/drawings/${encodeURIComponent(name)}`, i);
      frag.appendChild(card);
      observer.observe(card);
    });
    drawingsGrid.appendChild(frag);
  }

  const previewGrid = document.getElementById("drawings-preview-grid");
  if (previewGrid) {
    const frag = document.createDocumentFragment();
    filenames.slice(0, 4).forEach((name, i) => {
      const card = makeDrawingCard(`/drawings/${encodeURIComponent(name)}`, i);
      frag.appendChild(card);
      observer.observe(card);
    });
    previewGrid.appendChild(frag);
  }
}

fetch("/drawings/index.json")
  .then(r => r.json())
  .then(renderDrawings)
  .catch(() => renderDrawings([]));

const socials = [
  { name: "YouTube", icon: "/icons/youtube.svg", href: "https://www.youtube.com/@PickleAnimationYT", modifier: "social-link--youtube" },
  { name: "Discord", icon: "/icons/discord.svg", href: "https://discord.gg/ZpM9KEP7SH",                                          modifier: "social-link--discord"  },
];

const socialsGrid = document.getElementById("socials-grid");
if (socialsGrid) {
  const frag = document.createDocumentFragment();
  socials.forEach((s, idx) => {
    const el = document.createElement("a");
    el.href = s.href;
    el.className = `social-link ${s.modifier}`;
    el.style.transitionDelay = `${idx * 100}ms`;
    el.innerHTML = `<img src="${s.icon}" alt="" aria-hidden="true" class="icon" /><span>${s.name}</span>`;
    frag.appendChild(el);
    observer.observe(el);
  });
  socialsGrid.appendChild(frag);
}

function renderVideos() {
  if (!dom.videoTrack) return;
  const frag = document.createDocumentFragment();
  [...videos, ...videos].forEach((video, idx) => {
    const el = document.createElement("button");
    el.className = "video-card";
    el.dataset.index = String(idx % videos.length);
    el.innerHTML = `
      <img src="${video.thumbnail}" alt="${video.title}" class="video-card-thumbnail" loading="lazy" decoding="async" />
      <div class="video-card-play">
        <div class="video-card-play-btn">
          <img src="/icons/play.svg" alt="" aria-hidden="true" />
        </div>
      </div>
      <div class="video-card-info">
        <h3 class="video-card-title">${video.title}</h3>
        <p class="video-card-meta">YouTube <span class="video-card-dot"></span> Watch now</p>
      </div>
    `;
    frag.appendChild(el);
  });
  dom.videoTrack.innerHTML = "";
  dom.videoTrack.appendChild(frag);
}

dom.videoTrack?.addEventListener("click", (e) => {
  const card = e.target.closest(".video-card");
  if (card) openVideoModal(Number(card.dataset.index));
});

renderVideos();

const videoModal = document.getElementById("video-modal");
const videoModalContent = document.getElementById("video-modal-content");
const videoIframe = document.getElementById("video-iframe");

function openVideoModal(index) {
  selectedVideoIndex = index;
  const video = videos[index];
  videoModalContent?.classList.toggle("short", !!video.isShort);
  if (videoIframe) videoIframe.src = `https://www.youtube.com/embed/${video.id}?autoplay=1`;
  if (videoModal) {
    videoModal.classList.remove("hidden");
    requestAnimationFrame(() => {
      videoModal.classList.add("open");
      videoModalContent?.classList.add("open");
    });
  }
  document.body.classList.add("modal-open");
}

function closeVideoModal() {
  videoModal?.classList.remove("open");
  videoModalContent?.classList.remove("open");
  setTimeout(() => {
    videoModal?.classList.add("hidden");
    if (videoIframe) videoIframe.src = "";
    selectedVideoIndex = null;
    document.body.classList.remove("modal-open");
  }, 300);
}

document.getElementById("video-close")?.addEventListener("click", closeVideoModal);
videoModal?.addEventListener("click", closeVideoModal);
videoModalContent?.addEventListener("click", e => e.stopPropagation());

document.getElementById("video-prev")?.addEventListener("click", (e) => {
  e.stopPropagation();
  openVideoModal(selectedVideoIndex - 1 < 0 ? videos.length - 1 : selectedVideoIndex - 1);
});
document.getElementById("video-next")?.addEventListener("click", (e) => {
  e.stopPropagation();
  openVideoModal((selectedVideoIndex + 1) % videos.length);
});

dom.backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", (e) => {
    const href = anchor.getAttribute("href");
    if (href === "#") { e.preventDefault(); return; }
    const target = document.querySelector(href);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
  });
});

const path = window.location.pathname.toLowerCase();
const navMap = [
  { el: document.getElementById("nav-drawings"), match: p => p.includes("drawings") },
  { el: document.getElementById("nav-home"),     match: () => true },
];
for (const { el, match } of navMap) {
  if (el && match(path)) { el.classList.add("active"); break; }
}
