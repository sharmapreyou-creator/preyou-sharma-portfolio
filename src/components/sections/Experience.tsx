"use client";

import { useCallback, useRef } from "react";
import { TIMELINE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import { useScroll } from "@/lib/scroll";
import { SectionHead } from "@/components/ui/SectionHead";

/** Education and experience as one path. The spine draws as you scroll; each stop lights up when the spine reaches it. */
export function Experience() {
  const { scrollToTarget } = useScroll();
  const pathRef = useRef<HTMLDivElement>(null);
  const stops = useRef<(HTMLLIElement | null)[]>([]);

  const onProgress = useCallback((p: number) => {
    const path = pathRef.current;
    if (!path) return;
    path.style.setProperty("--p", String(p));
    const h = path.offsetHeight;
    stops.current.forEach((li) => {
      if (!li) return;
      li.classList.toggle("on", li.offsetTop + 22 <= p * h);
    });
  }, []);
  useScrollProgress(pathRef, onProgress, 0.62);

  return (
    <section id="experience" className="sec exp" aria-labelledby="exp-h">
      <div className="wrap">
        <SectionHead index="04" label="Experience" lead="My path so" accent="far." id="exp-h" />

        <div className="path" ref={pathRef}>
          <div className="spine" aria-hidden="true">
            <i />
          </div>
          <ol>
            {TIMELINE.map((s, i) => (
              <li
                key={s.id}
                className="stop"
                ref={(el) => {
                  stops.current[i] = el;
                }}
              >
                <span className="node" aria-hidden="true" />
                <div className="when">
                  <span>{s.when}</span>
                  <small>{s.kind}</small>
                </div>
                <div className="what">
                  <h3>{s.title}</h3>
                  <p className="place">{s.place}</p>
                  <ul>
                    {s.detail.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
            <li
              className="stop next"
              ref={(el) => {
                stops.current[TIMELINE.length] = el;
              }}
            >
              <span className="node" aria-hidden="true" />
              <div className="when">
                <span>Next</span>
              </div>
              <a
                href="#contact"
                className="next-card"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#contact");
                }}
              >
                <span className="nx-t">
                  Next — <em>Your team?</em>
                </span>
                <span className="nx-s">Let&rsquo;s talk</span>
              </a>
            </li>
          </ol>
        </div>
      </div>

      <style>{`
        .exp .sec-head { margin-bottom: clamp(40px, 6vw, 72px); }
        .path { --sx: 236px; position: relative; }
        .path ol { list-style: none; margin: 0; padding: 0; }
        .spine { position: absolute; top: 0; bottom: 0; left: var(--sx); width: 2px; margin-left: -1px; background: var(--line); border-radius: 2px; }
        .spine i { display: block; width: 100%; height: 100%; background: var(--ink); transform-origin: 50% 0; transform: scaleY(var(--p, 0)); border-radius: 2px; }

        .stop { position: relative; display: grid; grid-template-columns: var(--sx) minmax(0, 1fr); padding-bottom: clamp(44px, 7vw, 84px); }
        .stop:last-child { padding-bottom: 0; }
        .node { position: absolute; left: var(--sx); top: 8px; width: 16px; height: 16px; margin-left: -8px; border-radius: 50%; background: var(--paper); box-shadow: inset 0 0 0 2px var(--faint); transition: background .5s var(--ease), box-shadow .5s var(--ease), transform .6s var(--ease); z-index: 1; }
        .stop.on .node { background: var(--ink); box-shadow: inset 0 0 0 2px var(--ink), 0 0 0 6px rgba(13,13,13,.08); transform: scale(1.08); }

        .when { padding-right: 36px; text-align: right; font-family: var(--f-mono); font-size: 13px; color: var(--mute); padding-top: 5px; transition: color .5s var(--ease); }
        .when small { display: block; margin-top: 4px; font-size: 11px; color: var(--faint); }
        .stop.on .when { color: var(--ink); }

        .what { padding-left: 44px; opacity: .32; transform: translateX(8px); transition: opacity .7s var(--ease), transform .7s var(--ease); }
        .stop.on .what, .stop.on .next-card { opacity: 1; transform: none; }
        .what h3 { margin: 0; font-size: clamp(26px, 3vw, 40px); font-weight: 700; letter-spacing: -0.04em; line-height: 1.05; }
        .place { margin: 8px 0 0; color: var(--mute); font-size: 16px; }
        .what ul { margin: 18px 0 0; padding: 0; list-style: none; display: grid; gap: 8px; max-width: 62ch; color: var(--ink-2); font-size: 15.5px; }
        .what li { padding-left: 18px; position: relative; }
        .what li::before { content: ""; position: absolute; left: 0; top: .72em; width: 8px; height: 1.5px; background: var(--faint); }

        .next-card { margin-left: 44px; display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 12px 24px; padding: 26px 28px; border-radius: 24px; border: 1.5px dashed rgba(13,13,13,.28); opacity: .4; transform: translateX(8px); transition: opacity .7s var(--ease), transform .7s var(--ease), background .35s var(--ease), border-color .35s var(--ease); }
        .next-card:hover { background: #fff; border-color: var(--ink); }
        .nx-t { font-size: clamp(24px, 3vw, 38px); font-weight: 700; letter-spacing: -0.04em; line-height: 1; }
        .nx-t em { font-family: var(--f-serif); font-style: italic; font-weight: 400; color: var(--mute); letter-spacing: -0.02em; }
        .nx-s { font-weight: 600; font-size: 15px; }

        @media (max-width: 760px) {
          .path { --sx: 11px; }
          .stop { grid-template-columns: minmax(0, 1fr); padding-left: 38px; }
          .node { top: 4px; }
          .when { text-align: left; padding: 0 0 8px; }
          .when small { display: inline; margin-left: 10px; }
          .what { padding-left: 0; }
          .next-card { margin-left: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .spine i, .node, .what, .next-card { transition: none; }
        }
      `}</style>
    </section>
  );
}
