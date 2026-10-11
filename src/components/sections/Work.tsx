"use client";

import { useEffect, useRef, useState } from "react";
import { PROFILE, PROJECTS, SKILLS, type ProjectArt } from "@/lib/data";
import { SectionHead } from "@/components/ui/SectionHead";
import { TechLogo } from "@/components/ui/TechLogo";
import { ArrowUpRight } from "@/components/ui/Icons";

const bar = (w: string, h = 6, tone = "var(--soft)") => <i className="ln" style={{ width: w, height: h, background: tone }} />;

const WING_TIPS: [number, number][] = [[26, 34], [38, 54], [52, 72], [68, 86], [88, 96]];

/** Pure CSS/JSX grayscale mock-ups. They hint at the deliverable; they are not screenshots. */
function Art({ kind }: { kind: ProjectArt }) {
  switch (kind) {
    case "logo":
      return (
        <div className="a-center">
          <svg viewBox="0 0 240 150" width="78%" role="img" aria-label="Abstract wings mark">
            <g stroke="#0d0d0d" strokeLinecap="round" fill="none">
              {WING_TIPS.map(([x, y], i) => (
                <g key={i} opacity={1 - i * 0.12}>
                  <path d={`M112 ${96 - i * 3} Q${(112 + x) / 2} ${y - 6} ${x} ${y}`} strokeWidth={9 - i} />
                  <path d={`M128 ${96 - i * 3} Q${240 - (112 + x) / 2} ${y - 6} ${240 - x} ${y}`} strokeWidth={9 - i} />
                </g>
              ))}
            </g>
            <path d="M120 92l6 8-6 9-6-9z" fill="#0d0d0d" />
          </svg>
          <p className="a-word">TIMBERWINGS</p>
        </div>
      );
    case "offer":
      return (
        <div className="a-center">
          <div className="a-paper">
            <div className="a-row a-between">
              <span className="a-dot" />
              <span className="a-title">Offer Letter</span>
            </div>
            {bar("48%", 8, "var(--ink)")}
            <div className="a-gap" />
            {bar("100%")}
            {bar("94%")}
            {bar("98%")}
            {bar("62%")}
            <div className="a-gap" />
            {bar("100%")}
            {bar("88%")}
            {bar("72%")}
            <div className="a-sign">
              <svg viewBox="0 0 90 26" width="90" aria-hidden="true">
                <path d="M2 18c10-16 14-16 12-4s6 10 14-6c4-8 4 6 10 4s8-8 12-2 8 6 14 0" fill="none" stroke="#0d0d0d" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              {bar("46%", 4)}
            </div>
          </div>
        </div>
      );
    case "certificate":
      return (
        <div className="a-center">
          <div className="a-cert">
            <div className="a-cert-in">
              <span className="a-dot" />
              <p className="a-cert-t">Certificate of Completion</p>
              <p className="a-cert-s">Presented to</p>
              <p className="a-cert-n">Recipient Name</p>
              <div className="a-stack">
                {bar("86%", 5)}
                {bar("72%", 5)}
              </div>
              <span className="a-seal" aria-hidden="true" />
            </div>
          </div>
        </div>
      );
    case "branding":
      return (
        <div className="a-branding">
          <div className="a-post">
            <div className="a-row">
              <span className="a-dot" />
              <div className="a-stack">
                {bar("60%", 6, "var(--ink)")}
                {bar("36%", 4)}
              </div>
            </div>
            {bar("100%")}
            {bar("80%")}
            <div className="a-img" />
          </div>
          <div className="a-insta">
            <div className="a-grid">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} style={{ background: i % 4 === 0 ? "var(--ink)" : i % 3 === 0 ? "#bdbab4" : "var(--soft)" }} />
              ))}
            </div>
          </div>
          <div className="a-reel">
            <span className="a-play" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 16 16"><path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8-5.2a.6.6 0 0 0 0-1L5.4 2.3a.6.6 0 0 0-.9.5z" fill="#fff" /></svg>
            </span>
            <div className="a-reel-bars">{bar("70%", 5, "rgba(255,255,255,.7)")}{bar("40%", 5, "rgba(255,255,255,.45)")}</div>
          </div>
        </div>
      );
    case "records":
      return (
        <div className="a-center">
          <div className="a-table">
            <div className="a-side">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="a-row">
                  <svg width="16" height="14" viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M2 4a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" /></svg>
                  {bar(`${70 - i * 8}%`, 5)}
                </div>
              ))}
            </div>
            <div className="a-list">
              <div className="a-head">{bar("30%", 6, "var(--ink)")}{bar("18%", 6, "var(--faint)")}{bar("14%", 6, "var(--faint)")}</div>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="a-line">{bar(`${40 - (i % 3) * 6}%`, 5)}{bar("20%", 5)}{bar("12%", 5)}</div>
              ))}
            </div>
          </div>
        </div>
      );
  }
}

export function Work() {
  const [open, setOpen] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const hoverOpen = (i: number) => {
    if (window.innerWidth < 1100) return; // vertical accordion: tap only
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(i), 90);
  };
  const cancelHover = () => {
    if (timer.current) clearTimeout(timer.current);
  };

  return (
    <section id="work" className="sec work" aria-labelledby="work-h">
      <div className="wrap">
        <SectionHead index="03" label="Selected work" lead="Things I've" accent="made." id="work-h" />
        <p className="work-sub rv">
          Everything I designed and managed at {PROFILE.company}. Hover, focus or tap a panel to open it.
        </p>

        <div className="acc rv" onMouseLeave={cancelHover}>
          {PROJECTS.map((p, i) => {
            const isOpen = open === i;
            return (
              <article
                key={p.id}
                className={`panel ${isOpen ? "is-open" : ""}`}
                onMouseEnter={() => hoverOpen(i)}
                onFocus={() => setOpen(i)}
              >
                <button
                  type="button"
                  className="spine"
                  aria-expanded={isOpen}
                  aria-controls={`panel-${p.id}`}
                  onClick={() => setOpen(i)}
                >
                  <span className="sp-n">{p.index}</span>
                  <span className="sp-t">{p.title}</span>
                  <span className="sp-plus" aria-hidden="true">+</span>
                </button>

                <div className="body" id={`panel-${p.id}`} inert={!isOpen}>
                  <div className="b-left">
                    <p className="b-k">
                      {p.index} — {p.kicker}
                    </p>
                    <h3 className="b-t">{p.title}</h3>
                    <p className="b-d">{p.description}</p>
                    <ul className="b-f">
                      {p.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    {p.tech.length > 0 && (
                      <ul className="b-chips" aria-label="Skills used">
                        {p.tech.map((id) => (
                          <li key={id}>
                            <TechLogo id={id} size={16} />
                            {SKILLS.find((s) => s.id === id)?.name}
                          </li>
                        ))}
                      </ul>
                    )}
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        View on GitHub <ArrowUpRight />
                      </a>
                    )}
                  </div>
                  <div className="b-right">
                    <div className="art">
                      <span className="art-label">Illustrative UI</span>
                      <Art kind={p.art} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style>{`
        .work .sec-head { margin-bottom: 18px; }
        .work-sub { margin: 0 0 40px; color: var(--mute); max-width: 56ch; }

        .acc { display: flex; gap: 10px; height: min(78svh, 600px); }
        .panel { position: relative; flex: 1 1 0; min-width: 0; container-type: inline-size; overflow: hidden; border-radius: 28px; background: var(--card); box-shadow: inset 0 0 0 1px var(--line); transition: flex-grow .9s var(--ease), box-shadow .6s var(--ease); }
        .panel.is-open { flex-grow: 8; box-shadow: inset 0 0 0 1px var(--line), 0 40px 80px -44px rgba(13,13,13,.45); }

        .spine { position: absolute; inset: 0; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 22px 0; transition: opacity .35s var(--ease); }
        .panel.is-open .spine { opacity: 0; pointer-events: none; }
        .sp-n { font-family: var(--f-mono); font-size: 12px; color: var(--mute); }
        .sp-t { writing-mode: vertical-rl; transform: rotate(180deg); font-weight: 700; font-size: 22px; letter-spacing: -0.03em; white-space: nowrap; }
        .sp-plus { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; box-shadow: inset 0 0 0 1px rgba(13,13,13,.2); font-size: 20px; line-height: 1; transition: transform .5s var(--ease), background .3s var(--ease), color .3s var(--ease); }
        .spine:hover .sp-plus { transform: rotate(90deg); background: var(--ink); color: #fff; }

        .body { position: absolute; inset: 0; min-width: 600px; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr); gap: 24px; padding: 34px; opacity: 0; pointer-events: none; transition: opacity .35s var(--ease); }
        .panel.is-open .body { opacity: 1; pointer-events: auto; transition: opacity .6s var(--ease) .3s; }
        .b-left { display: flex; flex-direction: column; min-height: 0; }
        .b-k { margin: 0 0 14px; font-family: var(--f-mono); font-size: 12px; color: var(--mute); }
        .b-t { margin: 0 0 14px; font-size: clamp(30px, 3.4vw, 46px); font-weight: 700; letter-spacing: -0.045em; line-height: 1; }
        .b-d { margin: 0 0 18px; color: var(--ink-2); font-size: 16px; line-height: 1.55; }
        .b-f { margin: auto 0 18px; padding: 0; list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; font-size: 14px; }
        .b-f li { padding-left: 16px; position: relative; }
        .b-f li::before { content: ""; position: absolute; left: 0; top: .55em; width: 6px; height: 6px; border-radius: 50%; background: var(--ink); }
        .b-chips { margin: 0 0 20px; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: 6px; }
        .b-chips li { display: inline-flex; align-items: center; gap: 7px; height: 30px; padding: 0 12px 0 8px; border-radius: 999px; font-size: 12.5px; font-weight: 500; box-shadow: inset 0 0 0 1px rgba(13,13,13,.14); color: var(--ink); }
        .b-left .btn { margin-top: auto; align-self: flex-start; }

        .b-right { min-width: 0; min-height: 0; }
        .art { position: relative; height: 100%; border-radius: 20px; background: var(--paper); overflow: hidden; clip-path: inset(0 100% 0 0 round 20px); transition: clip-path 1s var(--ease); }
        .panel.is-open .art { clip-path: inset(0 0 0 0 round 20px); transition-delay: .45s; }
        .art-label { position: absolute; z-index: 2; top: 12px; left: 12px; height: 24px; padding: 0 10px; display: inline-flex; align-items: center; border-radius: 999px; background: #fff; font-family: var(--f-mono); font-size: 10.5px; color: var(--mute); box-shadow: inset 0 0 0 1px var(--line); }

        /* mock-up pieces */
        .ln { display: block; border-radius: 99px; }
        .a-center { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 46px 22px 22px; }
        .a-word { margin: 0; font-weight: 700; letter-spacing: .24em; font-size: 14px; }
        .a-dot { width: 18px; height: 18px; border-radius: 50%; background: var(--ink); flex: none; }
        .a-row { display: flex; align-items: center; gap: 10px; }
        .a-between { justify-content: space-between; }
        .a-stack { display: grid; gap: 6px; width: 100%; }
        .a-gap { height: 8px; }
        .a-paper { width: min(78%, 280px); display: grid; gap: 9px; padding: 22px; background: #fff; border-radius: 10px; box-shadow: 0 24px 40px -24px rgba(13,13,13,.35), inset 0 0 0 1px var(--line); }
        .a-title { font-weight: 700; font-size: 15px; letter-spacing: -0.02em; }
        .a-sign { margin-top: 10px; display: grid; gap: 6px; }
        .a-cert { width: min(88%, 330px); aspect-ratio: 1.58; padding: 8px; background: #fff; border-radius: 8px; box-shadow: 0 24px 40px -24px rgba(13,13,13,.35), inset 0 0 0 1px var(--line); }
        .a-cert-in { position: relative; height: 100%; border: 1.5px solid var(--ink); border-radius: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 10px 14px; text-align: center; }
        .a-cert-t { margin: 4px 0 0; font-family: var(--f-serif); font-size: clamp(15px, 2cqw, 20px); line-height: 1.1; }
        .a-cert-s { margin: 0; font-size: 9.5px; color: var(--mute); }
        .a-cert-n { margin: 0 0 4px; font-weight: 700; font-size: 15px; letter-spacing: -0.02em; }
        .a-seal { position: absolute; right: 12px; top: 10px; width: 26px; height: 26px; border-radius: 50%; box-shadow: inset 0 0 0 1.5px var(--ink); background: var(--soft); }
        .a-branding { height: 100%; display: grid; grid-template-columns: 1.2fr 1fr .7fr; gap: 12px; align-items: center; padding: 52px 18px 18px; }
        .a-post { display: grid; gap: 8px; padding: 12px; background: #fff; border-radius: 12px; box-shadow: inset 0 0 0 1px var(--line); }
        .a-img { height: 74px; border-radius: 8px; background: #bdbab4; }
        .a-insta { padding: 8px; background: #fff; border-radius: 12px; box-shadow: inset 0 0 0 1px var(--line); }
        .a-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
        .a-grid span { aspect-ratio: 1; border-radius: 3px; }
        .a-reel { position: relative; aspect-ratio: 9 / 16; border-radius: 14px; background: var(--ink); display: grid; place-items: center; overflow: hidden; }
        .a-reel-bars { position: absolute; left: 10px; right: 10px; bottom: 12px; display: grid; gap: 5px; }
        .a-table { width: 88%; height: 74%; display: grid; grid-template-columns: .8fr 2fr; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 24px 40px -26px rgba(13,13,13,.35), inset 0 0 0 1px var(--line); margin-top: 20px; }
        .a-side { padding: 14px 12px; display: grid; align-content: start; gap: 12px; border-right: 1px solid var(--line); color: var(--mute); }
        .a-list { padding: 14px; display: grid; align-content: start; gap: 12px; }
        .a-head, .a-line { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 10px; align-items: center; }
        .a-head { padding-bottom: 10px; border-bottom: 1px solid var(--line); }

        /* narrow open panel: single column, art below */
        @container (max-width: 560px) {
          .body { grid-template-columns: minmax(0, 1fr); min-width: 0; padding: 26px; }
          .b-right { display: none; }
        }

        /* vertical accordion */
        @media (max-width: 1099px) {
          .acc { flex-direction: column; height: auto; }
          .panel { flex: none; max-height: 76px; transition: max-height .8s var(--ease), box-shadow .6s var(--ease); }
          .panel.is-open { max-height: 1500px; }
          .spine { position: relative; flex-direction: row; height: 76px; padding: 0 22px; gap: 16px; justify-content: flex-start; }
          .sp-t { writing-mode: horizontal-tb; transform: none; flex: 1; text-align: left; font-size: 20px; }
          .panel.is-open .spine { opacity: 1; pointer-events: auto; }
          .panel.is-open .sp-plus { transform: rotate(45deg); }
          .body { position: relative; inset: auto; min-width: 0; grid-template-columns: minmax(0, 1fr); padding: 4px 22px 26px; }
          .panel.is-open .body { transition-delay: .2s; }
          .b-right { display: block !important; }
          .art { height: 280px; clip-path: inset(0 0 0 0 round 20px); }
          .b-left .btn { margin-top: 6px; }
        }
        @media (max-width: 520px) { .b-f { grid-template-columns: 1fr; } }
        @media (prefers-reduced-motion: reduce) {
          .panel, .art, .body, .spine { transition: none; }
        }
      `}</style>
    </section>
  );
}
