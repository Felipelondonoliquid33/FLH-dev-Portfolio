import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

document.addEventListener("DOMContentLoaded", () => {
  // ── Guards ──────────────────────────────────────
  const isMobile = window.innerWidth < 1000;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) return;

  // ── Custom Cursor ──────────────────────────────
  if (!isMobile) {
    const dot = document.querySelector("[data-dot]");
    const ring = document.querySelector("[data-ring]");
    let dotX = 0, dotY = 0, ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    gsap.ticker.add(() => {
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;

      if (dot) gsap.set(dot, { x: dotX - 3, y: dotY - 3 });
      if (ring) gsap.set(ring, { x: ringX - 16, y: ringY - 16 });
    });

    // Hover ring expand
    const hoverTargets = document.querySelectorAll(
      ".q-item, .q-card, .onboard-outro-link, .q-vibe-card, .q-inline, a"
    );
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", () => ring?.classList.add("cursor-hover"));
      el.addEventListener("mouseleave", () => ring?.classList.remove("cursor-hover"));
    });
  }

  // ── Progress Bar ───────────────────────────────
  const progressFill = document.querySelector("[data-progress]");
  const segments = document.querySelectorAll("[data-segment]");

  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.3,
    onUpdate: (self) => {
      if (progressFill) {
        gsap.set(progressFill, { scaleX: self.progress });
      }
      // Activate segments
      const sectionProgress = self.progress * 4;
      segments.forEach((seg, i) => {
        seg.classList.toggle("active", sectionProgress >= i + 0.5);
      });
    },
  });

  // ── Scramble Text Utility ──────────────────────
  const GLYPHS = "!<>-_/[]{}=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  function scrambleTo(el, finalText, duration = 0.8) {
    const proxy = { progress: 0 };
    gsap.to(proxy, {
      progress: 1,
      duration,
      ease: "none",
      onUpdate: () => {
        const solved = Math.floor(proxy.progress * finalText.length);
        let out = finalText.slice(0, solved);
        for (let i = solved; i < finalText.length; i++) {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        el.textContent = out;
      },
    });
  }

  // ── Hero Title Split Reveal ────────────────────
  const heroTitle = document.querySelector("[data-split-hero]");
  if (heroTitle) {
    const split = SplitText.create(heroTitle, { type: "words,chars", charsClass: "hero-char" });
    gsap.from(split.chars, {
      yPercent: 120,
      rotate: 8,
      opacity: 0,
      stagger: 0.04,
      duration: 0.9,
      ease: "power4.out",
      delay: 0.4,
    });
  }

  // ── Hero Label Scramble ────────────────────────
  const heroLabel = document.querySelector(".onboard-hero-label p");
  if (heroLabel) {
    const originalText = heroLabel.textContent;
    gsap.set(heroLabel, { opacity: 0 });
    gsap.to(heroLabel, {
      opacity: 1,
      duration: 0.1,
      delay: 0.2,
      onComplete: () => scrambleTo(heroLabel, originalText, 1),
    });
  }

  // ── Hero Sub fade in ──────────────────────────
  gsap.from(".onboard-hero-sub p", {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    delay: 1,
  });

  // ── Hero Bottom Bar ───────────────────────────
  gsap.from(".onboard-hero-bottom-bar .container > *", {
    y: 15,
    opacity: 0,
    stagger: 0.15,
    duration: 0.6,
    ease: "power3.out",
    delay: 1.2,
  });

  // ── Intro Card ─────────────────────────────────
  const introCard = document.querySelector("[data-intro-card]");
  if (introCard) {
    const glow = introCard.querySelector(".intro-card-glow");

    // Entrance
    gsap.from(introCard, {
      y: 60,
      opacity: 0,
      scale: 0.96,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: introCard,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    // Mouse-follow glow
    if (!isMobile && glow) {
      introCard.addEventListener("mousemove", (e) => {
        const rect = introCard.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        gsap.to(glow, {
          background: `radial-gradient(ellipse at ${x}% ${y}%, rgba(177, 193, 239, 0.2), transparent 50%)`,
          duration: 0.4,
        });
      });
    }
  }

  // ── Section Titles — Split Reveal ──────────────
  document.querySelectorAll("[data-split-section]").forEach((el) => {
    const split = SplitText.create(el, { type: "words,chars" });

    ScrollTrigger.create({
      trigger: el,
      start: "top 82%",
      toggleActions: "play none none reverse",
      onEnter: () => {
        gsap.from(split.chars, {
          yPercent: 120,
          rotate: 6,
          opacity: 0,
          stagger: 0.03,
          duration: 0.7,
          ease: "power4.out",
        });
      },
      onLeaveBack: () => {
        gsap.set(split.chars, { yPercent: 120, opacity: 0 });
      },
    });
  });

  // ── Section Subtitles — Scramble ───────────────
  document.querySelectorAll("[data-scramble-text]").forEach((el) => {
    const finalText = el.getAttribute("data-scramble-text");

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      toggleActions: "play none none reverse",
      onEnter: () => scrambleTo(el, finalText, 0.9),
      onLeaveBack: () => {
        el.textContent = finalText;
      },
    });
  });

  // ── Q Cards — Click Flip ───────────────────────
  document.querySelectorAll("[data-q-card]").forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
  });

  // ── Q Cards — Mobile Entrance (no pin) ────────
  if (isMobile) {
    document.querySelectorAll("#section-01 [data-q-card]").forEach((card, i) => {
      gsap.from(card, {
        y: 80 + i * 20,
        opacity: 0,
        rotate: i % 2 === 0 ? -3 : 3,
        scale: 0.95,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
        delay: i * 0.12,
      });
    });
  }

  // ── Question Items — Staggered Reveal ─────────
  document.querySelectorAll("[data-question-list]").forEach((list) => {
    const items = list.querySelectorAll("[data-q-item]");

    items.forEach((item, i) => {
      gsap.from(item, {
        x: -40,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
        delay: i * 0.08,
      });
    });
  });

  // ── Checkbox Toggle ────────────────────────────
  document.querySelectorAll(".q-item").forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("checked");

      const box = item.querySelector(".q-checkbox-box");
      if (box) {
        if (item.classList.contains("checked")) {
          gsap.fromTo(box, { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
        }
      }
    });
  });

  // ── Inline Questions ───────────────────────────
  document.querySelectorAll(".q-inline").forEach((el) => {
    gsap.from(el, {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // ── Vibe Cards ─────────────────────────────────
  document.querySelectorAll(".q-vibe-card").forEach((card, i) => {
    gsap.from(card, {
      y: 50,
      opacity: 0,
      scale: 0.96,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
      delay: i * 0.15,
    });
  });

  // ── Outro Title ────────────────────────────────
  const outroTitle = document.querySelector("[data-split-outro]");
  if (outroTitle) {
    const split = SplitText.create(outroTitle, { type: "words,chars" });

    ScrollTrigger.create({
      trigger: outroTitle,
      start: "top 80%",
      toggleActions: "play none none reverse",
      onEnter: () => {
        gsap.from(split.chars, {
          yPercent: 100,
          opacity: 0,
          stagger: 0.04,
          duration: 0.8,
          ease: "power4.out",
        });
      },
    });
  }

  // ── Outro Links — Magnetic ─────────────────────
  if (!isMobile) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const quickX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
      const quickY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });

      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        quickX(x * 0.3);
        quickY(y * 0.3);
      });

      el.addEventListener("mouseleave", () => {
        quickX(0);
        quickY(0);
      });
    });
  }

  // ── Outro Links Entrance ──────────────────────
  gsap.from(".onboard-outro-link", {
    y: 20,
    opacity: 0,
    stagger: 0.12,
    duration: 0.7,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".onboard-outro-links",
      start: "top 90%",
      toggleActions: "play none none reverse",
    },
  });

  // ── Section 01 — Card Stack Scroll-Driven ─────
  if (!isMobile) {
    const cardsContainer = document.querySelector("#section-01 .onboard-cards");
    const qCardsAll = document.querySelectorAll("#section-01 [data-q-card]");

    if (cardsContainer && qCardsAll.length > 0) {
      // Hide cards initially — the pinned ScrollTrigger reveals them
      qCardsAll.forEach((card, i) => {
        gsap.set(card, {
          y: 100 + i * 40,
          rotate: i % 2 === 0 ? -4 : 4,
          scale: 0.9,
          opacity: 0,
        });
      });

      ScrollTrigger.create({
        trigger: cardsContainer,
        start: "top 20%",
        end: `+=${window.innerHeight * 1.5}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          qCardsAll.forEach((card, i) => {
            const cardProgress = gsap.utils.clamp(0, 1, (progress - i * 0.18) / 0.6);
            const eased = cardProgress * cardProgress * (3 - 2 * cardProgress);
            const y = gsap.utils.interpolate(100 + i * 40, 0, eased);
            const rot = gsap.utils.interpolate(i % 2 === 0 ? -4 : 4, 0, eased);
            const scale = gsap.utils.interpolate(0.9, 1, eased);
            gsap.set(card, { y, rotate: rot, scale, opacity: Math.min(eased * 3, 1) });
          });
        },
      });
    }
  }
});
