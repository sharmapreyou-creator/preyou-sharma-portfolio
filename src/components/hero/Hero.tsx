"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HERO_TRANSCRIPT, PROFILE } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";
import { useScroll } from "@/lib/scroll";
import { ArrowDown } from "@/components/ui/Icons";

export function Hero() {
  const { scrollToTarget } = useScroll();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);

  // refs so the observer / unlock handlers always see the latest intent
  const wantPlay = useRef(true); // false only while reduced motion is on and nobody pressed play
  const userMuted = useRef(false); // visitor pressed the button to turn the voice off
  const unlocked = useRef(false);

  const playWithSound = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return false;
    try {
      v.muted = false;
      await v.play();
      setSoundOn(true);
      setBlocked(false);
      return true;
    } catch {
      v.muted = true;
      return false;
    }
  }, []);

  /* try autoplay with sound; fall back to muted and wait for the first gesture */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    wantPlay.current = !prefersReducedMotion();

    const removeUnlock = () => {
      window.removeEventListener("pointerdown", onGesture, true);
      window.removeEventListener("keydown", onGesture, true);
      window.removeEventListener("touchend", onGesture, true);
    };
    async function onGesture(e: Event) {
      if (unlocked.current || userMuted.current) return;
      if ((e.target as Element | null)?.closest?.("[data-sound-btn]")) return; // the button handles itself
      if (!wantPlay.current) return;
      if (await playWithSound()) {
        unlocked.current = true;
        removeUnlock();
      }
    }

    (async () => {
      if (!wantPlay.current) return;
      if (await playWithSound()) {
        unlocked.current = true;
        return;
      }
      v.muted = true;
      v.play().catch(() => {});
      setBlocked(true);
      window.addEventListener("pointerdown", onGesture, true);
      window.addEventListener("keydown", onGesture, true);
      window.addEventListener("touchend", onGesture, true);
    })();

    return removeUnlock;
  }, [playWithSound]);

  /* the voice only runs while the hero is mostly on screen */
  useEffect(() => {
    const el = sectionRef.current;
    const v = videoRef.current;
    if (!el || !v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.intersectionRatio >= 0.35;
        if (visible && wantPlay.current) {
          v.play().catch(() => {
            v.muted = true;
            setSoundOn(false);
            v.play().catch(() => {});
          });
        } else if (!visible) {
          v.pause();
        }
      },
      { threshold: [0, 0.35, 0.6, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggleSound = async () => {
    const v = videoRef.current;
    if (!v) return;
    if (soundOn) {
      v.muted = true;
      userMuted.current = true;
      setSoundOn(false);
    } else {
      userMuted.current = false;
      wantPlay.current = true;
      if (await playWithSound()) unlocked.current = true;
    }
  };

  return (
    <section id="top" ref={sectionRef} className="hero" aria-label="Introduction">
      <div className="hero-ghost" aria-hidden="true">
        {PROFILE.firstName.toUpperCase()}
      </div>

      <div className="hero-stage">
        <video
          ref={videoRef}
          className="hero-video"
          muted
          loop
          playsInline
          preload="auto"
          aria-label={`Animated video of ${PROFILE.firstName} introducing herself`}
        >
          <source src="/hero/hero.webm" type="video/webm" />
          <source src="/hero/hero.mp4" type="video/mp4" />
        </video>
        <p className="sr-only-text">{HERO_TRANSCRIPT}</p>

        <button
          type="button"
          data-sound-btn
          className={`hero-sound ${blocked && !soundOn ? "is-blocked" : ""}`}
          aria-label={soundOn ? "Pause the voice" : "Play the voice"}
          onClick={toggleSound}
        >
          {soundOn ? (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <rect x="3.5" y="2.5" width="3" height="11" rx="1" fill="currentColor" />
              <rect x="9.5" y="2.5" width="3" height="11" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8-5.2a.6.6 0 0 0 0-1L5.4 2.3a.6.6 0 0 0-.9.5z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>

      <div className="hero-copy">
        <h1 className="hero-h1">
          <span className="sr-only-text">{PROFILE.name}, </span>
          <span className="hero-line">
            <span>HR</span>
          </span>
          <span className="hero-line">
            <span>
              <em>Executive.</em>
            </span>
          </span>
        </h1>
        <div className="hero-cta">
          <a
            href="#work"
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#work");
            }}
          >
            Explore work
          </a>
          <a
            href="#contact"
            className="btn btn-ghost"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#contact");
            }}
          >
            Let&rsquo;s talk
          </a>
          <a href={PROFILE.resume} download className="btn btn-ghost">
            Résumé <ArrowDown />
          </a>
        </div>
      </div>

      <style>{`
        .hero { position: relative; min-height: 100svh; display: grid; grid-template-columns: minmax(0, 1fr); place-items: center; overflow: clip; padding: 56px max(var(--gutter), calc((100% - 1320px) / 2 + var(--gutter))) 0; }
        .hero > * { grid-area: 1 / 1; }

        .hero-ghost {
          align-self: center; justify-self: center; z-index: 0; user-select: none; white-space: nowrap;
          font-weight: 800; letter-spacing: -0.05em; line-height: .8; font-size: clamp(110px, 25vw, 400px);
          color: transparent; -webkit-text-stroke: 1.5px rgba(13,13,13,.16); transform: translateY(-6%);
          animation: ghost-in 1.6s var(--ease) both;
        }
        @keyframes ghost-in { from { opacity: 0; transform: translateY(2%) } to { opacity: 1; transform: translateY(-6%) } }

        .hero-stage { position: relative; align-self: end; } /* no z-index here: it would trap the video's multiply blend inside the stage */
        .hero-video {
          height: min(96svh, 1040px); aspect-ratio: 768 / 960; width: auto; max-width: 100%; object-fit: contain;
          background: #fff; mix-blend-mode: multiply;
        }
        .sr-only-text { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

        .hero-sound {
          position: absolute; right: 10%; bottom: 8%; z-index: 2; width: 46px; height: 46px; border-radius: 50%;
          display: grid; place-items: center; background: var(--ink); color: #fff;
          box-shadow: 0 12px 28px -12px rgba(13,13,13,.6); transition: transform .5s var(--ease), background .3s var(--ease);
        }
        .hero-sound:hover { transform: scale(1.08); background: #2a2a2a; }
        .hero-sound.is-blocked::before {
          content: ""; position: absolute; inset: 0; border-radius: 50%; border: 1.5px solid var(--ink);
          animation: ping 1.8s var(--ease) infinite;
        }
        @keyframes ping { from { transform: scale(1); opacity: .55 } to { transform: scale(2.1); opacity: 0 } }

        .hero-copy { position: relative; z-index: 2; align-self: end; justify-self: start; padding-bottom: clamp(28px, 6vh, 64px); max-width: 440px; }
        .hero-h1 { margin: 0 0 28px; font-weight: 700; letter-spacing: -0.045em; line-height: .96; font-size: clamp(48px, 6vw, 92px); }
        .hero-h1 em { font-family: var(--f-serif); font-style: italic; font-weight: 400; letter-spacing: -0.02em; color: var(--mute); }
        .hero-line { display: block; overflow: hidden; padding-bottom: .12em; margin-bottom: -.12em; }
        .hero-line > span { display: block; animation: line-up 1.1s var(--ease) both; }
        .hero-line:last-child > span { animation-delay: .12s; }
        @keyframes line-up { from { transform: translateY(110%) } to { transform: none } }
        .hero-cta { display: flex; flex-wrap: wrap; gap: 10px; animation: fade-up 1s .35s var(--ease) both; }
        @keyframes fade-up { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: none } }

        @media (max-width: 860px) {
          .hero { display: flex; flex-direction: column; align-items: center; padding: 64px var(--gutter) 0; }
          .hero-ghost { position: absolute; top: 24%; left: 50%; transform: translate(-50%, 0); animation: none; font-size: 20vw; }
          .hero-video { height: 62svh; }
          .hero-sound { right: 6%; bottom: 6%; }
          .hero-copy { align-self: stretch; max-width: none; padding: 8px 0 44px; }
          .hero-h1 { font-size: clamp(48px, 15vw, 76px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-ghost, .hero-line > span, .hero-cta { animation: none; }
          .hero-sound.is-blocked::before { animation: none; opacity: .4; }
        }
      `}</style>
    </section>
  );
}
