"use client";

import { useMemo, useRef, useState } from "react";
import { PROJECTS, SKILLS, SKILL_GROUPS, type SkillGroupId } from "@/lib/data";
import { vars } from "@/lib/css";
import { useInView } from "@/lib/hooks";
import { SectionHead } from "@/components/ui/SectionHead";
import { TechLogo, brandColor, isBrand } from "@/components/ui/TechLogo";

type Filter = "all" | SkillGroupId;

export function Skills() {
  const gridRef = useRef<HTMLDivElement>(null);
  const seen = useInView(gridRef, { threshold: 0.12, once: true });
  const [filter, setFilter] = useState<Filter>("all");
  const [activeId, setActiveId] = useState(SKILLS[0].id);

  const groupLabel = useMemo(() => Object.fromEntries(SKILL_GROUPS.map((g) => [g.id, g.label])), []);
  const active = SKILLS.find((s) => s.id === activeId) ?? SKILLS[0];
  const activeIndex = SKILLS.findIndex((s) => s.id === active.id);
  const usedIn = PROJECTS.filter((p) => p.tech.includes(active.id));
  const tint = brandColor(active.id);
  const inGroup = SKILLS.filter((s) => s.group === active.group).length;

  return (
    <section id="skills" className="sec skills" aria-labelledby="skills-h">
      <div className="wrap">
        <SectionHead index="02" label="Skills" lead="The periodic table of my" accent="skills." id="skills-h" />

        <div className="chips rv" role="group" aria-label="Filter skills by family">
          <button type="button" className={`chip ${filter === "all" ? "is-on" : ""}`} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
            All <span>{SKILLS.length}</span>
          </button>
          {SKILL_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`chip ${filter === g.id ? "is-on" : ""}`}
              aria-pressed={filter === g.id}
              onClick={() => setFilter(g.id)}
            >
              {g.label} <span>{SKILLS.filter((s) => s.group === g.id).length}</span>
            </button>
          ))}
        </div>

        <div className="sk-layout">
          <div ref={gridRef} className={`sk-grid ${seen ? "is-in" : ""}`} role="group" aria-label="Skills">
            {SKILLS.map((s, i) => {
              const row = Math.floor(i / 8);
              const col = i % 8;
              const dim = filter !== "all" && s.group !== filter;
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`tile ${active.id === s.id ? "is-active" : ""} ${dim ? "is-dim" : ""}`}
                  style={vars({ "--d": `${(row + col) * 40}ms`, "--col": String(col) })}
                  onMouseEnter={() => setActiveId(s.id)}
                  onFocus={() => setActiveId(s.id)}
                  onClick={() => setActiveId(s.id)}
                  aria-label={`${s.name}, ${groupLabel[s.group]}`}
                  aria-describedby="skill-inspector"
                >
                  <span className="t-num">{i + 1}</span>
                  <span className="t-sym">{s.symbol}</span>
                  <span className="t-name">{s.name}</span>
                </button>
              );
            })}
          </div>

          <aside id="skill-inspector" className="inspector" aria-live="polite" aria-label="Skill details">
            <div className="insp-card card">
              <div className="insp-stage" style={tint ? vars({ "--tint": tint }) : undefined}>
                <div key={active.id} className={`insp-logo ${isBrand(active.id) ? "has-brand" : ""}`}>
                  <TechLogo id={active.id} size={isBrand(active.id) ? 150 : 128} />
                </div>
              </div>
              <p className="insp-meta">
                <span>No. {activeIndex + 1}</span>
                <span>{active.symbol}</span>
              </p>
              <h3 className="insp-name">{active.name}</h3>
              <p className="insp-fam">{groupLabel[active.group]}</p>
              {usedIn.length > 0 ? (
                <div className="insp-used">
                  <p>Used in</p>
                  <ul>
                    {usedIn.map((p) => (
                      <li key={p.id}>{p.title}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="insp-note">
                  One of {inGroup} skills in {groupLabel[active.group]}.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .skills .sec-head { margin-bottom: 36px; }
        .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
        .chip { height: 38px; padding: 0 16px; border-radius: 999px; font-size: 14px; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; box-shadow: inset 0 0 0 1px rgba(13,13,13,.16); transition: background .35s var(--ease), color .35s var(--ease), transform .4s var(--ease); }
        .chip span { font-family: var(--f-mono); font-size: 11px; opacity: .55; }
        .chip:hover { transform: translateY(-1px); background: rgba(13,13,13,.05); }
        .chip.is-on { background: var(--ink); color: #fff; box-shadow: none; }

        .sk-layout { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: clamp(20px, 3vw, 40px); align-items: start; }
        .sk-grid { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 8px; }
        .tile {
          position: relative; aspect-ratio: 1 / 1.08; min-width: 0; padding: 9px 9px 10px; border-radius: 14px; text-align: left; background: var(--card);
          box-shadow: inset 0 0 0 1px var(--line); display: flex; flex-direction: column; justify-content: space-between; overflow: hidden;
          opacity: 0; transform: translateY(14px) scale(.96);
          transition: opacity .7s var(--ease), transform .7s var(--ease), background .35s var(--ease), color .35s var(--ease), box-shadow .35s var(--ease);
        }
        .sk-grid.is-in .tile { opacity: 1; transform: none; transition-delay: var(--d, 0ms), var(--d, 0ms), 0ms, 0ms, 0ms; }
        .sk-grid.is-in .tile.is-dim { opacity: .22; transition-delay: 0ms; }
        .tile:hover, .tile.is-active { background: var(--ink); color: #fff; box-shadow: none; }
        .sk-grid.is-in .tile:hover { transform: translateY(-3px); transition-delay: 0ms; }
        .t-num { font-family: var(--f-mono); font-size: 10px; opacity: .55; }
        .t-sym { font-size: clamp(22px, 2.6vw, 38px); font-weight: 700; letter-spacing: -0.05em; line-height: 1; }
        .t-name { font-size: clamp(8.5px, .78vw, 11px); line-height: 1.15; font-weight: 500; letter-spacing: -0.005em; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow-wrap: anywhere; }

        .inspector { position: sticky; top: 96px; }
        .insp-card { padding: 20px; box-shadow: inset 0 0 0 1px var(--line), 0 40px 70px -40px rgba(13,13,13,.35); }
        .insp-stage { position: relative; height: 200px; display: grid; place-items: center; border-radius: 18px; background: var(--paper); overflow: hidden; }
        .insp-stage::before { content: ""; position: absolute; inset: 0; opacity: .0; background: radial-gradient(closest-side at 50% 50%, color-mix(in srgb, var(--tint, transparent) 22%, transparent), transparent); }
        .insp-stage:has(.has-brand)::before { opacity: 1; }
        .insp-logo { position: relative; color: var(--ink); animation: pop .6s var(--ease) both; }
        @keyframes pop { 0% { transform: scale(.7); opacity: 0 } 60% { transform: scale(1.06); opacity: 1 } 100% { transform: scale(1) } }
        .insp-logo svg { max-width: none; }
        .insp-meta { display: flex; justify-content: space-between; margin: 18px 0 6px; font-family: var(--f-mono); font-size: 12px; color: var(--mute); }
        .insp-name { margin: 0; font-size: 26px; line-height: 1.08; font-weight: 700; letter-spacing: -0.04em; }
        .insp-fam { margin: 6px 0 0; color: var(--mute); font-size: 14px; }
        .insp-used { margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--line); }
        .insp-used p { margin: 0 0 6px; font-family: var(--f-mono); font-size: 11px; color: var(--mute); }
        .insp-used ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 4px; font-weight: 500; font-size: 14.5px; }
        .insp-note { margin: 16px 0 0; padding-top: 14px; border-top: 1px solid var(--line); color: var(--mute); font-size: 14px; }

        @media (max-width: 900px) {
          .sk-layout { grid-template-columns: minmax(0, 1fr); }
          .sk-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .inspector { position: static; order: 2; }
          .t-sym { font-size: clamp(24px, 7vw, 36px); }
          .t-name { font-size: clamp(9px, 2.4vw, 12px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .tile { opacity: 1; transform: none; transition: background .2s, color .2s; }
          .insp-logo { animation: none; }
        }
      `}</style>
    </section>
  );
}
