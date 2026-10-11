"use client";

import { RefObject, useEffect, useState } from "react";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Reactive version of prefers-reduced-motion (false on the server). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

interface InViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  once?: boolean;
}

/** true while (or once, with `once`) the element is inside the viewport. */
export function useInView<T extends Element>(ref: RefObject<T | null>, opts: InViewOptions = {}): boolean {
  const { threshold = 0.15, rootMargin = "0px", once = false } = opts;
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, rootMargin, once]);
  return inView;
}

/**
 * Calls `onProgress(p)` (0..1) while the element scrolls through the viewport.
 * p is 0 when the element's top reaches `anchor` (fraction of viewport height)
 * and 1 when its bottom does. rAF-throttled; no React re-renders.
 */
export function useScrollProgress<T extends Element>(
  ref: RefObject<T | null>,
  onProgress: (p: number) => void,
  anchor = 0.6,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * anchor - r.top) / Math.max(1, r.height);
      onProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, onProgress, anchor]);
}
