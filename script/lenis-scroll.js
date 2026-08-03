import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

document.addEventListener("DOMContentLoaded", () => {
  const isOnboardingPage = () =>
    /onboarding/i.test(window.location.pathname);

  // Mobile onboarding uses native scroll — Lenis + keyboard/inputs fight and
  // yank the page back while filling the form. Desktop Lenis stays untouched.
  const useNativeScroll = () =>
    window.innerWidth <= 900 && isOnboardingPage();

  if (useNativeScroll()) {
    window.__lenis = null;
    return;
  }

  let isMobile = window.innerWidth <= 900;

  const getScrollSettings = (mobile) =>
    mobile
      ? {
          duration: 0.8,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: "vertical",
          gestureDirection: "vertical",
          smooth: true,
          smoothTouch: true,
          touchMultiplier: 1.5,
          infinite: false,
          lerp: 0.09,
          wheelMultiplier: 1,
          orientation: "vertical",
          smoothWheel: true,
          syncTouch: true,
        }
      : {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: "vertical",
          gestureDirection: "vertical",
          smooth: true,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false,
          lerp: 0.1,
          wheelMultiplier: 1,
          orientation: "vertical",
          smoothWheel: true,
          syncTouch: true,
        };

  let lenis = new Lenis(getScrollSettings(isMobile));
  window.__lenis = lenis;

  lenis.on("scroll", ScrollTrigger.update);

  const tickerFn = (time) => {
    if (window.__lenis) window.__lenis.raf(time * 1000);
  };
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

  const handleResize = () => {
    if (useNativeScroll()) {
      if (lenis) {
        lenis.destroy();
        lenis = null;
        window.__lenis = null;
      }
      return;
    }

    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 900;

    if (!lenis || wasMobile !== isMobile) {
      if (lenis) lenis.destroy();
      lenis = new Lenis(getScrollSettings(isMobile));
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
    }
  };

  window.addEventListener("resize", handleResize);
});
