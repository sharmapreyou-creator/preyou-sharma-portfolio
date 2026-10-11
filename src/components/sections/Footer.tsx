"use client";

import { PROFILE } from "@/lib/data";
import { useScroll } from "@/lib/scroll";
import { ArrowUp } from "@/components/ui/Icons";

export function Footer() {
  const { scrollToTarget } = useScroll();
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <p>
          © {new Date().getFullYear()} {PROFILE.name}
        </p>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget(0);
          }}
          className="foot-top"
        >
          Back to top <ArrowUp />
        </a>
        <p>Built with Next.js</p>
      </div>
      <style>{`
        .foot { border-top: 1px solid var(--line); padding: 26px 0 30px; font-size: 13.5px; color: var(--mute); }
        .foot-in { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
        .foot p { margin: 0; }
        .foot-top { display: inline-flex; align-items: center; gap: 8px; color: var(--ink); font-weight: 600; }
        .foot-top:hover { text-decoration: underline; text-underline-offset: 4px; }
      `}</style>
    </footer>
  );
}
