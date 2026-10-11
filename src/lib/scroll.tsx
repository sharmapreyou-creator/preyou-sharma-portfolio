"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "./hooks";

type Target = string | number | HTMLElement;

interface ScrollApi {
  scrollToTarget: (target: Target) => void;
  lock: () => void;
  unlock: () => void;
}

const noop: ScrollApi = { scrollToTarget: () => {}, lock: () => {}, unlock: () => {} };
const Ctx = createContext<ScrollApi>(noop);

export const useScroll = () => useContext(Ctx);

/** Smooth scrolling with Lenis. Disabled entirely when the visitor prefers reduced motion. */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const l = new Lenis({ duration: 1.1, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.current = l;
    let raf = 0;
    const loop = (time: number) => {
      l.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      l.destroy();
      lenis.current = null;
    };
  }, []);

  const scrollToTarget = useCallback((target: Target) => {
    if (lenis.current) {
      lenis.current.scrollTo(target as never, { duration: 1.3 });
      return;
    }
    if (typeof target === "number") window.scrollTo(0, target);
    else {
      const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
      el?.scrollIntoView();
    }
  }, []);

  const lock = useCallback(() => {
    lenis.current?.stop();
    document.documentElement.style.overflow = "hidden";
  }, []);

  const unlock = useCallback(() => {
    lenis.current?.start();
    document.documentElement.style.overflow = "";
  }, []);

  const api = useMemo(() => ({ scrollToTarget, lock, unlock }), [scrollToTarget, lock, unlock]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
