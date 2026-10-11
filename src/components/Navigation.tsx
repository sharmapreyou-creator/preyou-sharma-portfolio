"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { vars } from "@/lib/css";
import { useScroll } from "@/lib/scroll";

export function Navigation() {
  const { scrollToTarget, lock, unlock } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [ind, setInd] = useState<{ x: number; w: number } | null>(null);

  /* scroll state + progress bar (rAF throttled, writes straight to the DOM) */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      barRef.current?.style.setProperty("--p", String(max > 0 ? Math.min(1, y / max) : 0));
      setScrolled(y > 40);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* which section is under the middle of the screen */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  /* slide the ink indicator under the active link */
  const measure = useCallback(() => {
    const el = linkRefs.current[active];
    const pill = pillRef.current;
    if (!el || !pill) return setInd(null);
    setInd({ x: el.offsetLeft, w: el.offsetWidth });
  }, [active]);
  useLayoutEffect(() => {
    measure();
  }, [measure]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  /* mobile overlay: lock page scroll, Esc closes */
  useEffect(() => {
    if (!open) return;
    lock();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unlock();
    };
  }, [open, lock, unlock]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    // let the overlay release the scroll lock before scrolling
    setTimeout(() => scrollToTarget(`#${id}`), open ? 60 : 0);
  };

  return (
    <>
      <div className="nav-progress" ref={barRef} aria-hidden="true" />
      <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="nav-inner">
          <a
            href="#top"
            className="nav-brand"
            aria-label={`${PROFILE.name}, back to top`}
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget(0);
            }}
          >
            <span className="nav-mark" aria-hidden="true">
              {PROFILE.initials}
            </span>
            <span className="nav-name">{PROFILE.name}</span>
          </a>

          <nav aria-label="Main" className="nav-desktop">
            <ul className="nav-pill" ref={pillRef}>
              {ind && <li aria-hidden="true" className="nav-ind" style={{ transform: `translateX(${ind.x}px)`, width: ind.w }} />}
              {NAV.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    ref={(el) => {
                      linkRefs.current[n.id] = el;
                    }}
                    className={active === n.id ? "is-active" : ""}
                    aria-current={active === n.id ? "true" : undefined}
                    onClick={(e) => go(e, n.id)}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className="nav-menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={`menu ${open ? "is-open" : ""}`} aria-hidden={!open} role="dialog" aria-label="Menu">
        <ul>
          {NAV.map((n, i) => (
            <li key={n.id} style={vars({ "--i": i })}>
              <a href={`#${n.id}`} tabIndex={open ? 0 : -1} onClick={(e) => go(e, n.id)}>
                <span className="menu-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="menu-l">{n.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="menu-foot">{PROFILE.email}</p>
      </div>

      <style>{`
        .nav-progress { position: fixed; z-index: 70; inset: 0 0 auto 0; height: 2px; background: transparent; pointer-events: none; }
        .nav-progress::after { content: ""; display: block; height: 100%; background: var(--ink); transform-origin: 0 50%; transform: scaleX(var(--p, 0)); }

        .nav { position: fixed; z-index: 60; inset: 0 0 auto 0; padding: 14px var(--gutter); pointer-events: none; }
        .nav-inner { max-width: 1320px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .nav-inner > * { pointer-events: auto; }

        .nav-brand { display: inline-flex; align-items: center; gap: 12px; }
        .nav-mark {
          display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%;
          font-weight: 700; font-size: 14px; letter-spacing: -0.02em;
          box-shadow: inset 0 0 0 1.5px var(--ink); background: transparent; color: var(--ink);
          transition: background .5s var(--ease), color .5s var(--ease), transform .8s var(--ease);
        }
        .nav.is-scrolled .nav-mark { background: var(--ink); color: #fff; }
        .nav-brand:hover .nav-mark { transform: rotate(360deg); }
        .nav-name { font-weight: 600; letter-spacing: -0.02em; font-size: 15px; transition: opacity .4s var(--ease), transform .5s var(--ease); }
        .nav.is-scrolled .nav-name { opacity: 0; transform: translateX(-8px); pointer-events: none; }

        .nav-pill {
          position: relative; display: flex; gap: 2px; list-style: none; margin: 0; padding: 5px; border-radius: 999px;
          transition: background .4s var(--ease), box-shadow .4s var(--ease), backdrop-filter .4s var(--ease);
        }
        .nav.is-scrolled .nav-pill {
          background: rgba(255,255,255,.72); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
          box-shadow: inset 0 0 0 1px var(--line), 0 10px 30px -18px rgba(13,13,13,.4);
        }
        .nav-pill a { position: relative; z-index: 1; display: block; padding: 9px 18px; border-radius: 999px; font-size: 14px; font-weight: 500; letter-spacing: -0.01em; color: var(--ink-2); transition: color .4s var(--ease); }
        .nav-pill a:hover { color: var(--ink); }
        .nav-pill a.is-active { color: #fff; }
        .nav-ind { position: absolute; z-index: 0; left: 5px; top: 5px; bottom: 5px; border-radius: 999px; background: var(--ink); transition: transform .6s var(--ease), width .6s var(--ease); }

        .nav-menu-btn { display: none; height: 42px; padding: 0 20px; border-radius: 999px; font-weight: 600; font-size: 14px; background: rgba(255,255,255,.8); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); box-shadow: inset 0 0 0 1px var(--line); }

        .menu {
          position: fixed; z-index: 55; inset: 0; background: var(--paper); display: flex; flex-direction: column; justify-content: center;
          padding: 96px var(--gutter) 40px; clip-path: circle(0% at calc(100% - 52px) 36px); visibility: hidden;
          transition: clip-path .9s var(--ease), visibility 0s .9s;
        }
        .menu.is-open { clip-path: circle(150% at calc(100% - 52px) 36px); visibility: visible; transition: clip-path .9s var(--ease), visibility 0s; }
        .menu ul { list-style: none; margin: 0; padding: 0; }
        .menu li { overflow: hidden; border-bottom: 1px solid var(--line); }
        .menu a { display: flex; align-items: baseline; gap: 18px; padding: 16px 0; transform: translateY(100%); transition: transform .8s var(--ease); transition-delay: 0s; }
        .menu.is-open a { transform: none; transition-delay: calc(.25s + var(--i, 0) * 70ms); }
        .menu-n { font-family: var(--f-mono); font-size: 12px; color: var(--mute); }
        .menu-l { font-size: clamp(40px, 12vw, 64px); font-weight: 700; letter-spacing: -0.045em; line-height: 1; }
        .menu-foot { margin: 28px 0 0; font-family: var(--f-mono); font-size: 12px; color: var(--mute); }

        @media (max-width: 860px) {
          .nav-desktop { display: none; }
          .nav-menu-btn { display: inline-flex; align-items: center; }
          .nav { z-index: 65; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-brand:hover .nav-mark { transform: none; }
          .nav-ind, .menu, .menu a { transition: none; }
        }
      `}</style>
    </>
  );
}
