import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { initAnimations } from "./anime";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // ── Init page transition animations ──────────────────────
  initAnimations();

  // ── SVG path scroll draw ─────────────────────────────────
  const fillPath = document.getElementById("tl-fill-path");

  if (fillPath) {
    const totalLength = fillPath.getTotalLength();

    // Start fully hidden
    gsap.set(fillPath, {
      strokeDasharray: totalLength,
      strokeDashoffset: totalLength,
    });

    // Animate draw as user scrolls through the timeline section
    ScrollTrigger.create({
      trigger: "#log-timeline",
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1.2,
      onUpdate: (self) => {
        const offset = totalLength * (1 - self.progress);
        gsap.set(fillPath, { strokeDashoffset: offset });
      },
    });
  }

  // ── Card scroll-reveal ────────────────────────────────────
  const cards = document.querySelectorAll(".tl-card");

  cards.forEach((card, i) => {
    // Cards on left side slide in from left, right side from right
    const isFlipRow = card.closest(".tl-row-flip") !== null;
    const xFrom = isFlipRow ? 60 : -60;

    gsap.fromTo(
      card,
      { opacity: 0, x: xFrom, y: 20 },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
        delay: 0.05 * i,
      }
    );
  });

  // ── Node pulse animation ──────────────────────────────────
  const nodes = document.querySelectorAll(".tl-node");

  nodes.forEach((node, i) => {
    gsap.fromTo(
      node,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: node,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        delay: 0.1,
      }
    );

    // Idle pulse ring
    gsap.to(node, {
      boxShadow: "0 0 0 12px rgba(10,10,10,0.06)",
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: i * 0.25,
    });
  });

  // ── Hero title word-by-word reveal ───────────────────────
  const heroTitle = document.querySelector(".log-hero-title");
  if (heroTitle) {
    const split = SplitText.create(heroTitle, { type: "words,chars" });
    gsap.from(split.chars, {
      opacity: 0,
      y: 40,
      stagger: 0.04,
      duration: 0.7,
      ease: "power3.out",
      delay: 0.5,
    });
  }

  // ── Outro heading reveal ──────────────────────────────────
  const outroHeading = document.querySelector(".log-outro-heading");
  if (outroHeading) {
    const splitOutro = SplitText.create(outroHeading, { type: "words" });
    gsap.from(splitOutro.words, {
      opacity: 0,
      y: 30,
      stagger: 0.12,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: outroHeading,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  }

  // ── Outro links slide in ──────────────────────────────────
  gsap.from(".log-outro-link", {
    opacity: 0,
    y: 20,
    stagger: 0.12,
    duration: 0.7,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".log-outro-links",
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  });

  // ── Tag hover micro-animation ─────────────────────────────
  document.querySelectorAll(".tl-tag").forEach((tag) => {
    tag.addEventListener("mouseenter", () => {
      gsap.to(tag, { scale: 1.06, duration: 0.25, ease: "power2.out" });
    });
    tag.addEventListener("mouseleave", () => {
      gsap.to(tag, { scale: 1, duration: 0.25, ease: "power2.out" });
    });
  });
});
