"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EDUCATION, FACTS, PROFILE, PROJECTS } from "@/lib/data";
import { vars } from "@/lib/css";
import { prefersReducedMotion } from "@/lib/hooks";
import { SectionHead } from "@/components/ui/SectionHead";
import { ArrowDown, ArrowUpRight } from "@/components/ui/Icons";

function barcode(seed: string) {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; i < 34; i++) {
    const c = seed.charCodeAt(i % seed.length) + i * 7;
    const w = 1 + (c % 3);
    if (i % 2 === 0) bars.push({ x, w });
    x += w + 1;
  }
  return { bars, width: x };
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const swingRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const code = useMemo(() => barcode(PROFILE.name.toUpperCase().replace(/\s/g, "")), []);

  /* damped pendulum: pointer velocity -> angle, spring back, plus a gentle idle sway */
  useEffect(() => {
    const section = sectionRef.current;
    const swing = swingRef.current;
    if (!section || !swing || prefersReducedMotion()) return;

    let angle = 0;
    let vel = 0;
    let lastX: number | null = null;
    let lastT = performance.now();
    let raf = 0;
    const start = performance.now();
    const K = 0.012; // spring stiffness per frame
    const C = 0.03; // damping per frame

    const onMove = (e: PointerEvent) => {
      if (lastX !== null) vel += Math.max(-40, Math.min(40, e.clientX - lastX)) * 0.018;
      lastX = e.clientX;
      vel = Math.max(-3.2, Math.min(3.2, vel));
    };
    const onLeave = () => {
      lastX = null;
    };

    const loop = (now: number) => {
      const dt = Math.min(2.5, (now - lastT) / 16.67);
      lastT = now;
      const idle = Math.sin((now - start) / 1100) * 0.7 + Math.sin((now - start) / 2300) * 0.35;
      vel += (-K * (angle - idle) - C * vel) * dt;
      angle += vel * dt;
      angle = Math.max(-14, Math.min(14, angle));
      swing.style.transform = `rotate(${angle.toFixed(3)}deg)`;
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !raf) {
        lastT = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(section);
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const mba = EDUCATION.find((e) => e.id === "mba");
  const bsc = EDUCATION.find((e) => e.id === "bsc");
  const strapText = `${PROFILE.name.toUpperCase()}  ·  ${PROFILE.role.toUpperCase()}  ·  `;

  return (
    <section id="about" ref={sectionRef} className="sec about" aria-labelledby="about-h">
      <div className="wrap about-grid">
        {/* left */}
        <div className="about-left">
          <SectionHead index="01" label="About" lead="Hi, I'm" accent={`${PROFILE.firstName}.`} id="about-h" />
          <p className="about-sum rv" style={vars({ "--i": 1 })}>
            {PROFILE.resumeSummary}
          </p>
          <p className="about-extra rv" style={vars({ "--i": 2 })}>
            {PROFILE.extraLine}
          </p>
          <div className="about-btns rv" style={vars({ "--i": 3 })}>
            <a href={PROFILE.resume} download className="btn btn-primary">
              Résumé <ArrowDown />
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              LinkedIn <ArrowUpRight />
            </a>
          </div>
        </div>

        {/* centre: lanyard + ID card */}
        <div className="about-mid">
          <div className="swing" ref={swingRef}>
            <div className="strap" aria-hidden="true">
              <div className="strap-track">
                {[0, 1].map((k) => (
                  <span key={k}>{strapText.repeat(4)}</span>
                ))}
              </div>
            </div>
            <div className="clip" aria-hidden="true">
              <i />
            </div>

            <div
              className={`idcard ${flipped ? "is-flipped" : ""}`}
              role="button"
              tabIndex={0}
              aria-pressed={flipped}
              aria-label={`${PROFILE.name}'s ID card. Press to flip it.`}
              onClick={() => {
                if (window.matchMedia("(hover: none)").matches) setFlipped((f) => !f);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setFlipped((f) => !f);
                }
              }}
            >
              <div className="idflip">
                {/* front */}
                <div className="face front">
                  <div className="band">
                    <span>HR ID</span>
                  </div>
                  <div className="photo-wrap">
                    <div className="photo-ring">
                      <div className="photo">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/portrait-bust.webp" width={480} height={600} alt={`Portrait of ${PROFILE.name}`} />
                      </div>
                    </div>
                  </div>
                  <h3 className="id-name">{PROFILE.name}</h3>
                  <p className="id-role">{PROFILE.role}</p>
                  <dl className="id-rows">
                    <div>
                      <dt>Dept.</dt>
                      <dd>{PROFILE.dept}</dd>
                    </div>
                    <div>
                      <dt>Location</dt>
                      <dd>{PROFILE.city}, MP</dd>
                    </div>
                    <div>
                      <dt>Experience</dt>
                      <dd>2.5+ years</dd>
                    </div>
                  </dl>
                  <div className="id-foot" aria-hidden="true">
                    <svg viewBox={`0 0 ${code.width} 26`} height="26" preserveAspectRatio="none" className="barcode">
                      {code.bars.map((b, i) => (
                        <rect key={i} x={b.x} y="0" width={b.w} height="26" fill="#0d0d0d" />
                      ))}
                    </svg>
                    <span className="holo" />
                  </div>
                </div>

                {/* back */}
                <div className="face back">
                  <p className="back-k">What I am</p>
                  <ul>
                    <li>{PROFILE.role} at {PROFILE.company}</li>
                    <li>MBA in HR &amp; Finance, {mba?.score}</li>
                    <li>B.Sc. in Electronics, {bsc?.score}</li>
                    <li>2.5+ years in end-to-end recruitment</li>
                    <li>{PROJECTS.length} projects: logo, offer letter, certificate, branding, records</li>
                  </ul>
                  <p className="sig">{PROFILE.name}</p>
                  <p className="found">If found, say hello · {PROFILE.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* right */}
        <div className="about-right">
          <div className="facts rv" style={vars({ "--i": 1 })}>
            <p className="facts-k">Quick facts</p>
            <dl>
              {FACTS.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.label === "Email" ? <a href={`mailto:${PROFILE.email}`}>{f.value}</a> : f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <blockquote className="quote rv" style={vars({ "--i": 2 })}>
            &ldquo;{PROFILE.quote}&rdquo;
          </blockquote>
        </div>
      </div>

      <style>{`
        .about { overflow: clip; }
        .about-grid { display: grid; grid-template-columns: minmax(0, 1fr) 320px minmax(0, 1fr); gap: clamp(28px, 4vw, 64px); align-items: stretch; }
        .about-left .sec-head { margin-bottom: 28px; }
        .about-sum { margin: 0 0 18px; font-size: clamp(17px, 1.35vw, 20px); line-height: 1.6; color: var(--ink-2); max-width: 54ch; }
        .about-extra { margin: 0 0 30px; color: var(--mute); max-width: 54ch; }
        .about-btns { display: flex; flex-wrap: wrap; gap: 10px; }

        /* lanyard */
        .about-mid { --anchor: calc(var(--pad-y) + 20px); position: relative; min-height: 560px; display: flex; justify-content: center; }
        .swing { position: absolute; top: calc(var(--anchor) * -1); left: 50%; margin-left: -150px; width: 300px; display: flex; flex-direction: column; align-items: center; transform-origin: 50% 0; z-index: 3; will-change: transform; }
        .strap { width: 30px; height: calc(var(--anchor) + 40px); overflow: hidden; background: var(--ink); border-radius: 2px; position: relative; box-shadow: inset 0 0 0 1px rgba(255,255,255,.06); }
        .strap-track { display: flex; flex-direction: column; align-items: center; animation: strap 14s linear infinite; }
        .strap-track span { writing-mode: vertical-rl; white-space: pre; padding: 6px 0; font-size: 10.5px; font-weight: 600; letter-spacing: .18em; color: rgba(255,255,255,.85); }
        @keyframes strap { to { transform: translateY(-50%); } }
        .clip { position: relative; z-index: 2; width: 26px; height: 30px; margin: -2px 0 -14px; border-radius: 6px 6px 10px 10px; background: linear-gradient(90deg, #b9b7b2, #f4f3f0 45%, #9b9994); box-shadow: 0 2px 4px rgba(13,13,13,.25), inset 0 0 0 1px rgba(13,13,13,.18); }
        .clip i { position: absolute; left: 50%; bottom: 6px; width: 10px; height: 10px; margin-left: -5px; border-radius: 50%; background: var(--paper); box-shadow: inset 0 0 0 1px rgba(13,13,13,.3); }

        .idcard { position: relative; z-index: 1; width: 300px; height: 404px; perspective: 1400px; cursor: pointer; outline-offset: 6px; border-radius: 22px; }
        .idflip { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform .9s var(--ease); }
        .idcard.is-flipped .idflip { transform: rotateY(180deg); }
        @media (hover: hover) { .idcard:hover .idflip { transform: rotateY(180deg); } }
        .face { position: absolute; inset: 0; border-radius: 22px; overflow: hidden; backface-visibility: hidden; -webkit-backface-visibility: hidden; box-shadow: inset 0 0 0 1px var(--line), 0 40px 70px -34px rgba(13,13,13,.45), 0 10px 24px -14px rgba(13,13,13,.25); }
        .front { background: #fff; display: flex; flex-direction: column; align-items: center; }
        .band { position: relative; align-self: stretch; height: 42px; background: var(--ink); color: #fff; display: flex; align-items: center; justify-content: flex-start; padding-left: 22px; font-family: var(--f-mono); font-size: 11px; letter-spacing: .28em; }
        .photo-wrap { margin-top: 18px; padding: 8px; border-radius: 22px; box-shadow: 0 0 0 10px rgba(13,13,13,.035); }
        .photo-ring { padding: 3px; border-radius: 18px; background: linear-gradient(145deg, #e9e6e0, #8f8d89 50%, #e9e6e0); }
        .photo { width: 128px; height: 156px; overflow: hidden; border-radius: 15px; background: #fff; }
        .photo img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 8%; transition: transform .8s var(--ease); }
        .idcard:hover .photo img { transform: scale(1.07); }
        .id-name { margin: 14px 0 0; font-size: 21px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.1; }
        .id-role { margin: 3px 0 10px; font-family: var(--f-mono); font-size: 11px; color: var(--mute); }
        .id-rows { align-self: stretch; margin: 0; padding: 0 24px; display: grid; gap: 5px; }
        .id-rows div { display: flex; justify-content: space-between; gap: 12px; font-size: 12.5px; border-bottom: 1px dashed var(--line); padding-bottom: 5px; }
        .id-rows dt { color: var(--mute); font-family: var(--f-mono); font-size: 11px; }
        .id-rows dd { margin: 0; font-weight: 600; text-align: right; }
        .id-foot { align-self: stretch; margin-top: auto; padding: 0 24px 16px; display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }
        .barcode { width: 150px; opacity: .85; }
        .holo { width: 34px; height: 34px; border-radius: 50%; background: conic-gradient(from 20deg, #f2f1ee, #a9a6a0, #ffffff, #77756f, #e9e6e0, #bdbab4, #f2f1ee); box-shadow: inset 0 0 0 1px rgba(13,13,13,.15); }

        .back { transform: rotateY(180deg); background: var(--ink); color: #fff; padding: 34px 26px 24px; display: flex; flex-direction: column; }
        .back-k { margin: 0 0 14px; font-family: var(--f-serif); font-style: italic; font-size: 30px; line-height: 1; }
        .back ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 9px; font-size: 13.5px; color: rgba(255,255,255,.82); }
        .back li { padding-left: 14px; position: relative; }
        .back li::before { content: ""; position: absolute; left: 0; top: .62em; width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,.5); }
        .sig { margin: auto 0 4px; font-family: var(--f-serif); font-style: italic; font-size: 28px; border-bottom: 1px solid rgba(255,255,255,.25); padding-bottom: 6px; }
        .found { margin: 8px 0 0; font-family: var(--f-mono); font-size: 10.5px; color: rgba(255,255,255,.55); word-break: break-word; }

        /* right column */
        .about-right { display: flex; flex-direction: column; justify-content: space-between; gap: 40px; }
        .facts-k { margin: 0 0 8px; font-family: var(--f-mono); font-size: 12px; color: var(--mute); }
        .facts dl { margin: 0; }
        .facts dl > div { display: grid; grid-template-columns: 110px minmax(0, 1fr); gap: 14px; padding: 14px 0; border-top: 1px solid var(--line); }
        .facts dl > div:last-child { border-bottom: 1px solid var(--line); }
        .facts dt { font-family: var(--f-mono); font-size: 12px; color: var(--mute); padding-top: 3px; }
        .facts dd { margin: 0; font-weight: 500; letter-spacing: -0.01em; overflow-wrap: anywhere; }
        .facts dd a { background: linear-gradient(currentColor, currentColor) 0 100% / 100% 1px no-repeat; }
        .quote { margin: 0; font-family: var(--f-serif); font-style: italic; font-size: clamp(24px, 2.2vw, 32px); line-height: 1.2; color: var(--ink-2); padding-left: 20px; border-left: 2px solid var(--ink); }

        @media (max-width: 1100px) {
          .about-grid { grid-template-columns: minmax(0, 1fr) 320px; }
          .about-right { grid-column: 1 / -1; grid-row: 2; }
          .about-mid { grid-row: 1; grid-column: 2; }
          .about-left { grid-column: 1; grid-row: 1; }
        }
        @media (max-width: 820px) {
          .about-grid { grid-template-columns: minmax(0, 1fr); }
          .about-left, .about-mid, .about-right { grid-column: 1; grid-row: auto; }
          .about-mid { --anchor: 40px; min-height: 0; height: 520px; margin-top: 40px; }
          .strap::before { content: ""; position: absolute; top: 6px; left: 50%; width: 10px; height: 10px; margin-left: -5px; border-radius: 50%; background: var(--paper); z-index: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .strap-track { animation: none; }
          .idflip { transition: none; }
        }
      `}</style>
    </section>
  );
}
