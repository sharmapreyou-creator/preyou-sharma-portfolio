import type { ReactNode } from "react";

/**
 * Logos for the skills tiles and the inspector.
 *
 * BRAND: simple monogram marks in each tool's brand colour. These are drawn here
 * (no downloads at build time) and are NOT the official artwork. To use the real
 * logos, drop the official SVGs into public/logos and swap them in below.
 * CONCEPT: thin line icons for skills that have no brand (recruitment, payroll...).
 */

interface Brand {
  color: string;
  glyph: ReactNode;
  plain?: boolean; // draws its own tile instead of a coloured square
}

const T = (props: { children: ReactNode; size?: number }) => (
  <text x="24" y="32" textAnchor="middle" fontSize={props.size ?? 24} fontWeight="700" fill="#fff" fontFamily="Arial, Helvetica, sans-serif">
    {props.children}
  </text>
);

export const BRAND: Record<string, Brand> = {
  linkedin: { color: "#0A66C2", glyph: <T>in</T> },
  "linkedin-page": { color: "#0A66C2", glyph: <T>in</T> },
  indeed: { color: "#2164F3", glyph: <T>i</T> },
  naukri: { color: "#4A90E2", glyph: <T>N</T> },
  internshala: { color: "#00A5EC", glyph: <T>I</T> },
  excel: { color: "#217346", glyph: <T>X</T> },
  word: { color: "#2B579A", glyph: <T>W</T> },
  powerpoint: { color: "#D24726", glyph: <T>P</T> },
  "instagram-page": {
    color: "#E4405F",
    glyph: (
      <g fill="none" stroke="#fff" strokeWidth="2.6">
        <rect x="11" y="11" width="26" height="26" rx="8" />
        <circle cx="24" cy="24" r="6.2" />
        <circle cx="31.6" cy="16.4" r="1.2" fill="#fff" stroke="none" />
      </g>
    ),
  },
  claude: {
    color: "#D97757",
    glyph: (
      <g stroke="#fff" strokeWidth="3" strokeLinecap="round">
        {[0, 45, 90, 135].map((a) => (
          <line key={a} x1="24" y1="11" x2="24" y2="37" transform={`rotate(${a} 24 24)`} />
        ))}
      </g>
    ),
  },
  chatgpt: {
    color: "#10A37F",
    glyph: <polygon points="24,10 36,17 36,31 24,38 12,31 12,17" fill="none" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />,
  },
  heygen: { color: "#111111", glyph: <T>H</T> },
  elevenlabs: {
    color: "#111111",
    glyph: (
      <g fill="#fff">
        <rect x="16.5" y="12" width="5" height="24" rx="1" />
        <rect x="26.5" y="12" width="5" height="24" rx="1" />
      </g>
    ),
  },
  "google-drive": {
    color: "#0066DA",
    plain: true,
    glyph: (
      <g fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 9L9 36" stroke="#00AC47" />
        <path d="M24 9L39 36" stroke="#FFBA00" />
        <path d="M11 37h26" stroke="#0066DA" />
      </g>
    ),
  },
};

const ICONS: Record<string, ReactNode> = {
  briefcase: (<><rect x="3" y="7" width="18" height="13" rx="2.5" /><path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2M3 13h18" /></>),
  upload: (<><path d="M12 16V5M7.5 9.5L12 5l4.5 4.5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></>),
  searchdoc: (<><path d="M6 3h8l4 4v6" /><path d="M6 3v18h6" /><circle cx="16" cy="17" r="3" /><path d="M18.2 19.2L21 22" /></>),
  phone: <path d="M6 3h3l1.5 4-2 1.3a11 11 0 0 0 5.2 5.2L15 11.5l4 1.5v3a2 2 0 0 1-2.2 2A14 14 0 0 1 4 5.2 2 2 0 0 1 6 3z" />,
  search: (<><circle cx="10" cy="10" r="6" /><path d="M15 15l5.5 5.5" /></>),
  calendar: (<><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>),
  calendarcheck: (<><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4M9 15l2 2 4-4" /></>),
  video: (<><rect x="3" y="6" width="13" height="12" rx="2.5" /><path d="M16 10.5l5-3v9l-5-3z" /></>),
  document: (<><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></>),
  userplus: (<><circle cx="10" cy="8" r="3.2" /><path d="M4 20c0-3.5 2.7-6 6-6 1.2 0 2.3.3 3.2.9" /><path d="M18 13v6M15 16h6" /></>),
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  play: (<><rect x="5" y="3" width="14" height="18" rx="3" /><path d="M10.5 9.5l4 2.5-4 2.5z" /></>),
  megaphone: (<><path d="M4 10v4l10 4V6z" /><path d="M14 9a4 4 0 0 1 0 6M7 14.5l1 5h2.5l-.8-3.7" /></>),
  nib: (<><path d="M12 3l5 8-5 10-5-10z" /><circle cx="12" cy="11" r="1.4" /></>),
  pen: (<><path d="M4 20l1-4L16 5l3 3L8 19z" /><path d="M14 7l3 3" /></>),
  link: (<><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6" /></>),
  chat: <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 4v-4H6a2 2 0 0 1-2-2z" />,
  people: (<><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.4" /><path d="M16.5 14.2c2.6.2 4.5 2.4 4.5 5.3" /></>),
  rupee: <path d="M7 5h10M7 9h10M10 5c4 0 6 2 6 4s-2 4-6 4H8l7 7" />,
  receipt: (<><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6" /></>),
  clock: (<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>),
  shield: (<><path d="M12 3l7 3v5c0 5-3.2 8.4-7 10-3.8-1.6-7-5-7-10V6z" /><path d="M9 12l2.2 2.2L15.5 10" /></>),
  percent: (<><path d="M18 6L6 18" /><circle cx="7.5" cy="7.5" r="2.3" /><circle cx="16.5" cy="16.5" r="2.3" /></>),
};

export const CONCEPT: Record<string, string> = {
  "end-to-end-recruitment": "briefcase",
  "job-posting": "upload",
  "resume-screening": "searchdoc",
  "cold-calling": "phone",
  "candidate-sourcing": "search",
  "interview-scheduling": "calendar",
  interviews: "video",
  "offer-letter-prep": "document",
  onboarding: "userplus",
  "employee-records": "folder",
  "reel-creation": "play",
  "content-creation": "megaphone",
  "logo-design": "nib",
  "offer-letter-design": "pen",
  "client-coordination": "link",
  "meeting-scheduling": "calendarcheck",
  communication: "chat",
  "stakeholder-coordination": "people",
  "salary-structure": "rupee",
  payslip: "receipt",
  lop: "clock",
  pf: "shield",
  esi: "shield",
  "professional-tax": "percent",
  tds: "percent",
};

export const isBrand = (id: string) => id in BRAND;
export const brandColor = (id: string) => BRAND[id]?.color;

interface Props {
  id: string;
  size?: number;
  className?: string;
}

/** Brand mark if the skill is a tool, otherwise a thin line icon. Decorative: the name is always shown beside it. */
export function TechLogo({ id, size = 40, className }: Props) {
  const brand = BRAND[id];
  if (brand) {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        {brand.plain ? (
          <rect x="1" y="1" width="46" height="46" rx="11" fill="#fff" stroke="rgba(13,13,13,.12)" />
        ) : (
          <rect width="48" height="48" rx="11" fill={brand.color} />
        )}
        {brand.glyph}
      </svg>
    );
  }
  const icon = ICONS[CONCEPT[id]];
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {icon ?? <circle cx="12" cy="12" r="7" />}
    </svg>
  );
}
