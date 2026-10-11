import type { ReactNode } from "react";

interface Props {
  index: string;
  label: string;
  /** Heading text, ending with the one serif-italic accent word. */
  lead: ReactNode;
  accent: string;
  id?: string;
}

/** "03 — Selected work" tag + bold heading that ends in one serif italic word. */
export function SectionHead({ index, label, lead, accent, id }: Props) {
  return (
    <header className="sec-head">
      <p className="tag rv">
        <span>{index}</span>
        <span aria-hidden="true">—</span>
        <span>{label}</span>
      </p>
      <h2 className="h2 rv-mask" id={id}>
        <span>
          {lead} <em>{accent}</em>
        </span>
      </h2>
    </header>
  );
}
