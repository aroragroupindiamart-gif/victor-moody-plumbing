export interface ConceptToken {
  name: string;
  palette: {
    bg: string;
    surface: string;
    surfaceAlt: string;
    ink: string;
    text: string;
    muted: string;
    accent: string;
    accentHover: string;
    accentText: string;
    gold: string;
    line: string;
  };
  font: string;
  cta: { minHeight: number; mobile: string; stickyBar: boolean; radius: string };
}

export const tokens: Record<string, ConceptToken> = {
  dispatch: {
    name: "Dispatch Command",
    palette: {
      bg: "#0B1220",        // ink navy
      surface: "#111C33",
      surfaceAlt: "#182747",
      ink: "#0B1220",
      text: "#F8FAFC",      // on bg: 15.9:1
      muted: "#CBD5E1",     // on bg: 10.4:1
      accent: "#E11D48",    // signal red
      accentHover: "#BE123C",
      accentText: "#FFFFFF",
      gold: "#FBBF24",
      line: "#263453",
    },
    font: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    cta: { minHeight: 56, mobile: "w-full", stickyBar: true, radius: "rounded-xl" },
  },
  credential: {
    name: "Credential Premium",
    palette: {
      bg: "#FFFFFF",
      surface: "#F1F6FB",
      surfaceAlt: "#E2ECF7",
      ink: "#0F2A44",       // on white: 13.6:1
      text: "#0F2A44",
      muted: "#3D5A76",     // on white: 6.9:1
      accent: "#0B5CAD",    // trust blue
      accentHover: "#084C8F",
      accentText: "#FFFFFF",
      gold: "#B45309",
      line: "#CBDCEC",
    },
    font: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    cta: { minHeight: 56, mobile: "w-full", stickyBar: true, radius: "rounded-full" },
  },
  journey: {
    name: "Guided Journey",
    palette: {
      bg: "#FAF7F2",        // warm neutral
      surface: "#FFFFFF",
      surfaceAlt: "#F0E9DF",
      ink: "#1C2B29",
      text: "#1C2B29",      // on bg: 13.8:1
      muted: "#43534F",     // on bg: 7.4:1
      accent: "#0F766E",    // deep teal
      accentHover: "#0B5E57",
      accentText: "#FFFFFF",
      gold: "#B45309",
      line: "#DDD2C2",
    },
    font: "'Source Serif 4', Georgia, serif / 'Inter', system-ui, sans-serif",
    cta: { minHeight: 56, mobile: "w-full", stickyBar: true, radius: "rounded-2xl" },
  },
  hyperlocal: {
    name: "Hyperlocal Proof",
    palette: {
      bg: "#FFF9EC",        // cream
      surface: "#FFFFFF",
      surfaceAlt: "#F3EAD3",
      ink: "#14342B",
      text: "#14342B",      // on cream: 12.4:1
      muted: "#3E5A50",     // on cream: 6.8:1
      accent: "#166534",    // deep green
      accentHover: "#14532D",
      accentText: "#FFFFFF",
      gold: "#B45309",
      line: "#E0D3B4",
    },
    font: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    cta: { minHeight: 56, mobile: "w-full", stickyBar: true, radius: "rounded-xl" },
  },
  onethumb: {
    name: "One-Thumb Speed",
    palette: {
      bg: "#FFFFFF",
      surface: "#F8FAFC",
      surfaceAlt: "#EEF2F7",
      ink: "#0A0A0A",
      text: "#0A0A0A",      // on white: 19.8:1
      muted: "#3F4756",     // on white: 9.2:1
      accent: "#C2410C",    // burnt orange
      accentHover: "#9A3412",
      accentText: "#FFFFFF",
      gold: "#0A0A0A",
      line: "#E2E8F0",
    },
    font: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    cta: { minHeight: 64, mobile: "w-full", stickyBar: true, radius: "rounded-2xl" },
  },
};
