"use client";

import { useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { vars } from "@/lib/css";
import { SectionHead } from "@/components/ui/SectionHead";
import { ArrowUpRight, Check, Copy } from "@/components/ui/Icons";

function Letters({ text }: { text: string }) {
  const hop = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    if (el.classList.contains("hop")) return;
    el.classList.add("hop");
  };
  return (
    <>
      {Array.from(text).map((c, i) =>
        c === " " ? (
          <span key={i} aria-hidden="true">
            {"\u00A0"}
          </span>
        ) : (
          <span
            key={i}
            className="ch"
            aria-hidden="true"
            onPointerEnter={hop}
            onAnimationEnd={(e) => e.currentTarget.classList.remove("hop")}
          >
            {c}
          </span>
        ),
      )}
    </>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = PROFILE.email;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* nothing else to try */
      }
      ta.remove();
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  const ring = "say hello · say hello · say hello · ";

  return (
    <section id="contact" className="sec contact" aria-labelledby="contact-h">
      <div className="wrap">
        <p className="tag rv">
          <span>05</span>
          <span aria-hidden="true">—</span>
          <span>Contact</span>
        </p>
        <h2 id="contact-h" className="c-h rv" aria-label="Let's build something together.">
          <span className="c-line">
            <Letters text="Let's build" />
          </span>
          <span className="c-line">
            <Letters text="something" /> <span className="accent">
              <Letters text="together." />
            </span>
          </span>
        </h2>

        <div className="c-grid">
          <div className="c-main">
            <div className="c-mail rv">
              <a className="c-email" href={`mailto:${PROFILE.email}`}>
                {PROFILE.email}
              </a>
              <button type="button" className="c-copy" onClick={copy}>
                {copied ? <Check /> : <Copy />}
                <span aria-live="polite">{copied ? "Copied ✓" : "Copy"}</span>
              </button>
            </div>

            <ul className="c-list rv" style={vars({ "--i": 1 })}>
              <li>
                <span>Phone</span>
                <a href={PROFILE.phoneHref}>{PROFILE.phone}</a>
              </li>
              <li>
                <span>LinkedIn</span>
                <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
                  {PROFILE.linkedinLabel} <ArrowUpRight />
                </a>
              </li>
              <li>
                <span>Location</span>
                <p>{PROFILE.location}</p>
              </li>
            </ul>
          </div>

          <a className="badge rv" href={`mailto:${PROFILE.email}`} aria-label="Say hello by email">
            <svg viewBox="0 0 120 120" width="150" height="150" aria-hidden="true">
              <defs>
                <path id="ring" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
              </defs>
              <g className="spin">
                <text fontSize="10.5" fontWeight="600" letterSpacing="2.6" fill="currentColor" fontFamily="var(--f-sans)">
                  <textPath href="#ring">{ring}</textPath>
                </text>
              </g>
            </svg>
            <span className="b-arrow">
              <ArrowUpRight size={22} />
            </span>
          </a>
        </div>
      </div>

      <style>{`
        .contact { padding-bottom: clamp(60px, 8vw, 110px); }
        .c-h { margin: 0 0 clamp(40px, 6vw, 72px); font-weight: 700; letter-spacing: -0.05em; line-height: .95; font-size: clamp(44px, 10.4vw, 168px); }
        .c-line { display: block; }
        .c-h .accent { letter-spacing: -0.03em; }
        .ch { display: inline-block; cursor: default; }
        .ch.hop { animation: hop .6s var(--ease); }
        @keyframes hop { 0% { transform: translateY(0) } 35% { transform: translateY(-.14em) } 100% { transform: translateY(0) } }

        .c-grid { display: flex; justify-content: space-between; align-items: flex-end; gap: 40px; flex-wrap: wrap; }
        .c-main { flex: 1 1 520px; min-width: 0; }
        .c-mail { display: flex; align-items: center; flex-wrap: wrap; gap: 14px 18px; margin-bottom: 36px; }
        .c-email { font-size: clamp(22px, 4vw, 52px); font-weight: 600; letter-spacing: -0.04em; line-height: 1.1; text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: .18em; overflow-wrap: anywhere; transition: opacity .3s var(--ease); }
        .c-email:hover { opacity: .65; }
        .c-copy { display: inline-flex; align-items: center; gap: 8px; height: 38px; padding: 0 16px; border-radius: 999px; font-size: 13.5px; font-weight: 600; box-shadow: inset 0 0 0 1px rgba(13,13,13,.22); transition: background .3s var(--ease), color .3s var(--ease); }
        .c-copy:hover { background: var(--ink); color: #fff; }

        .c-list { margin: 0; padding: 0; list-style: none; max-width: 640px; }
        .c-list li { display: grid; grid-template-columns: 110px minmax(0, 1fr); gap: 14px; padding: 15px 0; border-top: 1px solid var(--line); align-items: baseline; }
        .c-list li:last-child { border-bottom: 1px solid var(--line); }
        .c-list span { font-family: var(--f-mono); font-size: 12px; color: var(--mute); }
        .c-list a, .c-list p { margin: 0; font-weight: 500; font-size: 17px; letter-spacing: -0.01em; display: inline-flex; align-items: center; gap: 8px; overflow-wrap: anywhere; }
        .c-list a:hover { text-decoration: underline; text-underline-offset: 4px; }

        .badge { position: relative; width: 150px; height: 150px; color: var(--ink); flex: none; }
        .spin { transform-origin: 60px 60px; animation: spin 22s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg) } }
        .b-arrow { position: absolute; inset: 0; margin: auto; width: 54px; height: 54px; border-radius: 50%; background: var(--ink); color: #fff; display: grid; place-items: center; transition: transform .5s var(--ease); }
        .badge:hover .b-arrow { transform: rotate(45deg) scale(1.06); }

        @media (max-width: 640px) {
          .c-list li { grid-template-columns: 82px minmax(0, 1fr); }
          .badge { width: 120px; height: 120px; }
          .badge svg { width: 120px; height: 120px; }
          .b-arrow { width: 44px; height: 44px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .spin, .ch.hop { animation: none; }
        }
      `}</style>
    </section>
  );
}
