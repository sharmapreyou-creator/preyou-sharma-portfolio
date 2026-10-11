import type { CSSProperties } from "react";

/** Typed helper for inline CSS custom properties: style={vars({ "--i": 2 })} */
export const vars = (v: Record<string, string | number>) => v as CSSProperties;
