"use client";
/**
 * Hongda Plumbing — 5 Premium Landing Page Concepts (2026 Redesign)
 * =================================================================
 * One self-contained file. React + Tailwind CSS only. No other deps.
 * Replaces the current leaf template (dark slate / standard cards) on
 * hongdaplumbing.com — /[state]/[city]/[service]
 *
 * USAGE — map route params to props (all 5 pages take the SAME props):
 *
 *   // Next.js App Router example: app/[state]/[city]/[service]/page.jsx
 *   import { DispatchCommandPage } from "./hongda-landing-components";
 *
 *   export default function Page({ params, data }) {
 *     return (
 *       <DispatchCommandPage
 *         state="Alaska"              // params.state, title-cased
 *         stateCode="AK"              // params.state, upper-cased
 *         city="Kodiak"               // params.city, title-cased
 *         service="Emergency Plumber" // params.service, title-cased
 *         serviceSlug="emergency-plumber"
 *         phone="(855) 391-3175"
 *         phoneHref="tel:+18553913175"
 *         responseTime={data.responseTime} // e.g. from dispatch data.
 *                                          // DO NOT hardcode a promise.
 *                                          // Falls back to "—".
 *         licenseNo={data.licenseNo}       // real licence no. only
 *         rating={4.8}                     // from your review source
 *         reviewCount={337}                // from your review source
 *       />
 *     );
 *   }
 *
 *   Swap the page component to A/B test concepts — props do not change:
 *   DispatchCommandPage | CredentialPremiumPage | GuidedJourneyPage
 *   HyperlocalProofPage | OneThumbSpeedPage
 *
 * ACCESSIBILITY (built in, do not remove):
 *   - aria-label on every call link, aria-expanded on FAQ buttons
 *   - focus-visible rings on all interactive elements
 *   - body-text contrast >= 4.5:1 in every palette below
 *   - touch targets >= 48px; primary CTA min-height 56px
 *
 * HONESTY NOTE: ReviewCard takes `sample: true` for placeholder reviews
 * and renders a visible SAMPLE tag. Replace with real, sourced reviews
 * (and set sample: false) before using any review in production.
 */

import React, { useId, useState } from "react";

/* ================================================================
 * 1. DESIGN TOKENS — one object per concept
 * ================================================================ */
import { tokens } from "@/lib/tokens";
export { tokens };
const _localTokens = {
  dispatch: {
    name: "Dispatch Command",
    palette: {
      bg: "#0B1220",        // ink navy
      surface: "#111C33",
      surfaceAlt: "#182747",
      ink: "#0B1220",
      text: "#F8FAFC",      // on bg: 15.9:1
      muted: "#CBD5E1",     // on bg: 10.4:1
      accent: "#E11D48",    // signal red — large text / CTA bg only
      accentHover: "#BE123C",
      accentText: "#FFFFFF", // on accent: 4.8:1
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
      accentText: "#FFFFFF", // on accent: 6.2:1
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
      accentText: "#FFFFFF", // on accent: 5.5:1
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
      accentText: "#FFFFFF", // on accent: 6.9:1
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
      accent: "#C2410C",    // single accent — burnt orange
      accentHover: "#9A3412",
      accentText: "#FFFFFF", // on accent: 5.4:1
      gold: "#0A0A0A",
      line: "#E2E8F0",
    },
    font: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    cta: { minHeight: 64, mobile: "w-full", stickyBar: true, radius: "rounded-2xl" },
  },
};

/** Fallback props — Kodiak, AK leaf currently live on hongdaplumbing.com */
export const DEFAULT_PROPS = {
  state: "Alaska",
  stateCode: "AK",
  city: "Kodiak",
  service: "Emergency Plumber",
  serviceSlug: "emergency-plumber",
  phone: "(855) 391-3175",
  phoneHref: "tel:+18553913175",
  responseTime: "—",
  licenseNo: "",
  rating: 4.8,
  reviewCount: 337,
};

const withDefaults = (p = {}) => ({ ...DEFAULT_PROPS, ...p });
const focusRing =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-current";

/* ================================================================
 * 2. SHARED COMPONENTS
 * ================================================================ */

/** Primary tap-to-call button. Full-width on mobile, min 56px tall. */
export function TapToCallButton({
  phone, phoneHref, label, sublabel, className = "",
  style, dark = false,
}) {
  return (
    <a
      href={phoneHref}
      aria-label={`Call now: ${phone}`}
      style={style}
      className={`flex min-h-[56px] w-full items-center justify-center gap-3 px-6 py-3 text-center text-lg font-extrabold tracking-tight shadow-lg transition sm:w-auto ${focusRing} ${className}`}
    >
      <span aria-hidden="true" className="text-2xl leading-none">☎</span>
      <span className="leading-tight">
        {label || `Call ${phone}`}
        {sublabel ? (
          <span className={`block text-xs font-semibold ${dark ? "text-white/85" : "opacity-80"}`}>
            {sublabel}
          </span>
        ) : null}
      </span>
    </a>
  );
}

/**
 * Mobile sticky bottom bar — the conversion anchor on every concept.
 * Big Call button + one secondary action. Hidden on >=sm where an
 * inline CTA is already in view; add page bottom padding (pb-24 sm:pb-0).
 */
export function StickyCallBar({ phone, phoneHref, accent = "#E11D48", secondaryLabel = "What to do now ↓" }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.18)] backdrop-blur sm:hidden">
      <div className="flex items-stretch gap-2">
        <a
          href={phoneHref}
          aria-label={`Call now: ${phone}`}
          style={{ backgroundColor: accent }}
          className={`flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-xl px-4 text-base font-extrabold text-white ${focusRing}`}
        >
          <span aria-hidden="true">☎</span> Call {phone}
        </a>
        <a
          href="#triage"
          className={`flex min-h-[56px] items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-bold text-white ${focusRing}`}
        >
          {secondaryLabel}
        </a>
      </div>
      <p className="mt-1.5 text-center text-[11px] font-semibold text-slate-600">
        24/7 · No extra charge for nights or weekends
      </p>
    </div>
  );
}

/** Slim top dispatch bar — above the hero on urgency-led concepts. */
export function DispatchTopBar({ city, stateCode, phone, phoneHref, dark = true }) {
  return (
    <div className={dark ? "bg-black/30 text-white" : "bg-slate-900 text-white"}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 text-xs font-bold sm:text-sm">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          24/7 EMERGENCY DISPATCH — {city}, {stateCode}
        </span>
        <a href={phoneHref} aria-label={`Call dispatch: ${phone}`} className={`underline underline-offset-4 ${focusRing}`}>
          {phone}
        </a>
      </div>
    </div>
  );
}

/** Token-driven response time. Never hardcode a time promise here. */
export function ResponseTimeIndicator({ responseTime = "—", label = "Average response time", className = "" }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-bold ${className}`} role="status">
      <span aria-hidden="true">⚡</span>
      <span>{label}: <strong>{responseTime}</strong></span>
    </div>
  );
}

/** Star rating summary — numbers are props, sourced from your review data. */
export function RatingSummary({ rating = 4.8, reviewCount = 337, className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-label={`Rated ${rating} out of 5 from ${reviewCount} reviews`}>
      <span aria-hidden="true" className="text-lg tracking-tight text-amber-500">★★★★★</span>
      <span className="text-sm font-bold">{rating} <span className="font-semibold opacity-75">({reviewCount} reviews)</span></span>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, sub, className = "" }) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow ? <p className="text-xs font-extrabold uppercase tracking-[0.18em] opacity-70">{eyebrow}</p> : null}
      <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
      {sub ? <p className="mt-2 text-base leading-relaxed opacity-80">{sub}</p> : null}
    </div>
  );
}

const BADGES = [
  { icon: "🛡", label: "Licensed" },
  { icon: "✓", label: "Bonded" },
  { icon: "✓", label: "Insured" },
  { icon: "◈", label: "Upfront Pricing Guarantee" },
  { icon: "✕", label: "Zero Hidden Fees" },
];

/**
 * Trust badge row. Pass real `licenseNo` + `verifyHref` — when absent,
 * the licence line is omitted entirely (never invent a number).
 */
export function TrustBadgeRow({ licenseNo = "", verifyHref = "", className = "" }) {
  return (
    <div className={className}>
      <ul className="flex flex-wrap gap-2" aria-label="Credentials">
        {BADGES.map((b) => (
          <li key={b.label} className="inline-flex min-h-[48px] items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-bold">
            <span aria-hidden="true">{b.icon}</span>{b.label}
          </li>
        ))}
      </ul>
      {licenseNo ? (
        <p className="mt-2 text-xs font-semibold opacity-75">
          Licence No. {licenseNo}
          {verifyHref ? (
            <> · <a href={verifyHref} className={`underline underline-offset-2 ${focusRing}`}>Verify licence</a></>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}

/** Full-width credential band — for the trust-first concept. */
export function CredentialBand({ licenseNo = "", verifyHref = "", rating, reviewCount }) {
  return (
    <section aria-label="Licensed, bonded and insured" className="border-y border-[#CBDCEC] bg-[#F1F6FB]">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-5 sm:grid-cols-3">
        <div><p className="font-extrabold text-[#0F2A44]">Licensed, Bonded &amp; Insured</p>
          <p className="text-sm text-[#3D5A76]">{licenseNo ? `Licence No. ${licenseNo}` : "Credentials shown on arrival & on your quote"}{verifyHref ? <> · <a className={`underline ${focusRing}`} href={verifyHref}>Verify</a></> : null}</p></div>
        <div><p className="font-extrabold text-[#0F2A44]">Upfront Pricing Guarantee</p>
          <p className="text-sm text-[#3D5A76]">Written quote before work starts. The price agreed is the price you pay.</p></div>
        <div><p className="font-extrabold text-[#0F2A44]">Zero Hidden Fees</p>
          <RatingSummary rating={rating} reviewCount={reviewCount} className="text-[#0F2A44]" /></div>
      </div>
    </section>
  );
}

/**
 * Technician verification card. No stock-photo person: initials avatar.
 * Set real name / licence via props when a tech is actually assigned.
 */
export function TechnicianCard({
  name = "Your assigned technician", initials = "✓",
  licenseNo = "", city = "",
}) {
  return (
    <article className="flex gap-4 rounded-2xl border bg-white p-4 shadow-sm">
      <div aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#0B5CAD] text-xl font-extrabold text-white">{initials}</div>
      <div className="text-sm">
        <h3 className="text-base font-extrabold text-[#0F2A44]">{name}</h3>
        <ul className="mt-1 space-y-1 font-semibold text-[#3D5A76]">
          <li>✓ Background-checked &amp; ID-verified</li>
          <li>✓ Licensed{licenseNo ? ` — No. ${licenseNo}` : ""} · Serving {city}</li>
          <li>✓ You get their photo &amp; ETA by text before arrival</li>
        </ul>
      </div>
    </article>
  );
}

/** Customer review card. `sample: true` (default) shows a SAMPLE tag. */
export function ReviewCard({ name, service, date, stars = 5, text, sample = true, className = "" }) {
  return (
    <article className={`rounded-2xl border bg-white p-5 shadow-sm ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <span aria-label={`${stars} out of 5 stars`} className="text-amber-500" aria-hidden="false">{"★".repeat(stars)}<span className="sr-only">{stars} stars</span></span>
        {sample ? <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold tracking-widest text-slate-600">SAMPLE</span> : null}
      </div>
      <p className="mt-2 leading-relaxed text-slate-800">“{text}”</p>
      <footer className="mt-3 text-sm font-bold text-slate-900">{name}
        <span className="block font-semibold text-slate-600">{service} · {date}</span></footer>
    </article>
  );
}

/** 3-step journey: Dispatch → Diagnostic & Upfront Quote → Repair + Warranty */
export function JourneyStepper({ phone, phoneHref, accent = "#0F766E" }) {
  const steps = [
    { n: "1", t: "Immediate Dispatch", d: "Call once. A local tech is dispatched and you get a photo + ETA by text.", cta: true },
    { n: "2", t: "On-Site Diagnostic & Upfront Quote", d: "We find the cause, show you the problem, and give a written upfront price before any work." },
    { n: "3", t: "Same-Day Repair with Warranty", d: "Most emergencies fixed on the spot, from a fully stocked van — backed by a workmanship warranty." },
  ];
  return (
    <ol className="relative grid gap-6 sm:grid-cols-3 sm:gap-8">
      <span aria-hidden="true" className="absolute left-6 top-0 h-full w-0.5 bg-black/10 sm:left-0 sm:top-6 sm:h-0.5 sm:w-full" />
      {steps.map((s) => (
        <li key={s.n} className="relative flex gap-4 sm:block">
          <span style={{ backgroundColor: accent }} className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-extrabold text-white shadow">{s.n}</span>
          <div className="sm:mt-4">
            <h3 className="font-extrabold">{s.t}</h3>
            <p className="mt-1 text-sm leading-relaxed opacity-80">{s.d}</p>
            {s.cta ? <a href={phoneHref} aria-label={`Call now: ${phone}`} className={`mt-2 inline-flex min-h-[48px] items-center font-extrabold underline underline-offset-4 ${focusRing}`}>Start step 1 — call {phone}</a> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** "Do this right now" — genuinely useful triage, earns the call. */
export function TriageCard({ city, phone, phoneHref }) {
  const items = [
    "Shut off the main water valve (usually near the meter / street side of the house).",
    "Turn off power to a leaking water heater at the breaker — don't touch it if standing water is near electrics.",
    "Move valuables off the floor, put towels down, and take 2–3 photos for insurance.",
    "Don't use chemical drain cleaner on a backup — it makes the job more hazardous.",
  ];
  return (
    <section id="triage" aria-labelledby="triage-h" className="scroll-mt-24 rounded-2xl border-2 border-amber-400 bg-amber-50 p-5 text-slate-900">
      <h2 id="triage-h" className="text-lg font-extrabold">⚠ Do this right now — before we arrive in {city}</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 font-medium leading-relaxed">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ol>
      <p className="mt-3 text-sm font-semibold">Not sure where your valve is? <a href={phoneHref} aria-label={`Call now: ${phone}`} className={`underline underline-offset-2 ${focusRing}`}>Call {phone}</a> — dispatch will walk you through it.</p>
    </section>
  );
}

/** Accessible FAQ accordion: real <button>s, aria-expanded, keyboard native. */
export function FaqAccordion({ faqs, className = "" }) {
  const [open, setOpen] = useState(0);
  const baseId = useId();
  return (
    <div className={`divide-y rounded-2xl border bg-white ${className}`}>
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <h3>
              <button type="button" aria-expanded={isOpen} aria-controls={`${baseId}-${i}`} id={`${baseId}-b-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className={`flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-3 text-left font-bold text-slate-900 ${focusRing}`}>
                {f.q}<span aria-hidden="true" className="text-xl">{isOpen ? "−" : "+"}</span>
              </button>
            </h3>
            <div id={`${baseId}-${i}`} role="region" aria-labelledby={`${baseId}-b-${i}`} hidden={!isOpen} className="px-5 pb-5 leading-relaxed text-slate-700">{f.a}</div>
          </div>
        );
      })}
    </div>
  );
}

/** Default FAQ set — wording mirrors the live leaf page, tightened. */
export const defaultFaqs = ({ city, phone, responseTime }) => [
  { q: `How much does an emergency plumber cost in ${city}?`, a: `It depends on the job. You get a written, upfront quote after an on-site diagnostic — before any work begins. No hidden fees, and no extra charge for nights or weekends. Call ${phone} for a quote.` },
  { q: `How quickly can a plumber arrive in ${city}?`, a: responseTime && responseTime !== "—" ? `Average response time in ${city} is currently ${responseTime}. Emergency calls are answered 24/7.` : `Emergency calls in ${city} are answered 24/7 and dispatched as fast as possible — call for a live ETA.` },
  { q: `Are your plumbers licensed in ${city}?`, a: `Yes — technicians serving ${city} are licensed, bonded and insured in line with state and local regulations. Credentials are shown on arrival and on your quote.` },
  { q: `Do you offer 24/7 emergency service?`, a: `Yes — 24 hours a day, 7 days a week, including weekends and holidays, with no extra after-hours charge.` },
  { q: `What should I do before the plumber arrives?`, a: `Shut off the main water valve if you can, clear the work area, and see the "Do this right now" checklist above. Dispatch can walk you through it on the call.` },
];

/** Closing CTA band used at the foot of concepts 1–4. */
export function FinalCtaBand({ city, service, phone, phoneHref, dark = true }) {
  return (
    <section className={dark ? "bg-slate-900 text-white" : "bg-[#0B5CAD] text-white"}>
      <div className="mx-auto max-w-6xl px-4 py-10 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Need a {service} in {city}? Call now.</h2>
        <p className="mt-2 opacity-85">Available 24/7, 365 days a year. Free estimate on major jobs.</p>
        <div className="mt-5 flex justify-center">
          <TapToCallButton phone={phone} phoneHref={phoneHref} dark className="rounded-xl bg-white !text-slate-900" sublabel="Tap to call — answered 24/7" />
        </div>
      </div>
    </section>
  );
}

/* ================================================================
 * 3. CONCEPT 1 — DISPATCH COMMAND
 * Urgency-first. Dark ink-navy + signal-red, dispatch-ticket aesthetic.
 * Structure: top bar → ticket hero → timeline → features → triage →
 *            trust row → FAQ (3) → final CTA → sticky bar
 * ================================================================ */
export function DispatchCommandPage(rawProps) {
  const p = withDefaults(rawProps);
  const t = tokens.dispatch;
  const faqs = defaultFaqs(p).slice(0, 3);
  return (
    <main style={{ fontFamily: t.font, backgroundColor: t.palette.bg, color: t.palette.text }} className="min-h-screen pb-24 sm:pb-0">
      <DispatchTopBar {...p} />
      <section className="mx-auto max-w-6xl px-4 pt-8 sm:pt-12">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-red-400">● Dispatch open — {p.city}, {p.stateCode}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">
          {p.service} in {p.city}, {p.stateCode}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
          Burst pipe, sewer backup or a leaking water heater? One call dispatches a licensed local plumber — no after-hours surcharge.
        </p>
        {/* Dispatch ticket */}
        <div className="mt-6 rounded-2xl border border-dashed p-5" style={{ borderColor: t.palette.line, backgroundColor: t.palette.surface }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="font-mono text-xs uppercase tracking-widest text-slate-400">Ticket</p>
              <p className="font-extrabold">{p.serviceSlug.toUpperCase()} — {p.city.toUpperCase()}</p></div>
            <ResponseTimeIndicator responseTime={p.responseTime} className="border-red-500/50 bg-red-500/10 text-red-100" />
            <RatingSummary rating={p.rating} reviewCount={p.reviewCount} />
          </div>
          <div className="mt-5">
            <TapToCallButton {...p} style={{ backgroundColor: t.palette.accent, color: "#fff" }} className={t.cta.radius} sublabel="Tap to call — dispatch answers 24/7" dark />
          </div>
          {/* Response timeline */}
          <ol className="mt-6 grid grid-cols-3 gap-2 text-center text-xs font-bold text-slate-300" aria-label="What happens after you call">
            <li className="rounded-lg bg-white/5 px-2 py-3">1 · CALL<br /><span className="font-semibold text-slate-400">Answered live, 24/7</span></li>
            <li className="rounded-lg bg-white/5 px-2 py-3">2 · DISPATCH<br /><span className="font-semibold text-slate-400">Photo + ETA by text</span></li>
            <li className="rounded-lg bg-white/5 px-2 py-3">3 · ARRIVE<br /><span className="font-semibold text-slate-400">Upfront quote first</span></li>
          </ol>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {[["24/7 Service", "Around the clock — no extra charge for nights or weekends."],
          ["Rapid Response", `Most ${p.city} calls dispatched within the hour.`],
          [`${p.city}-Wide`, `All neighbourhoods across ${p.city} and surrounding areas.`],
          ["Licensed & Insured", "Licensed, bonded, with comprehensive liability insurance."]
        ].map(([h, d]) => (
          <article key={h} className="rounded-2xl p-5" style={{ backgroundColor: t.palette.surface }}>
            <h2 className="font-extrabold">{h}</h2><p className="mt-1 text-sm leading-relaxed text-slate-300">{d}</p>
          </article>
        ))}
      </section>
      <section className="mx-auto max-w-6xl space-y-8 px-4 pb-12">
        <TriageCard {...p} />
        <TrustBadgeRow licenseNo={p.licenseNo} className="[&_li]:border-slate-600" />
        <div><SectionHeading eyebrow="Fast answers" title="Emergency questions" className="text-white" />
          <FaqAccordion faqs={faqs} className="mt-4 border-slate-700 [&_button]:!text-slate-900" /></div>
      </section>
      <FinalCtaBand {...p} />
      <StickyCallBar {...p} accent={t.palette.accent} />
    </main>
  );
}

/* ================================================================
 * 4. CONCEPT 2 — CREDENTIAL PREMIUM
 * Trust-first. Light/airy white + trust-blue, contractor-premium.
 * Structure: credential band → calm hero → technician card →
 *            reviews → guarantee band → FAQ (3) → final CTA
 * ================================================================ */
export function CredentialPremiumPage(rawProps) {
  const p = withDefaults(rawProps);
  const t = tokens.credential;
  return (
    <main style={{ fontFamily: t.font, color: t.palette.text }} className="min-h-screen bg-white pb-24 sm:pb-0">
      <DispatchTopBar {...p} dark={false} />
      <CredentialBand licenseNo={p.licenseNo} rating={p.rating} reviewCount={p.reviewCount} />
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:pt-14">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0B5CAD]">Licensed · Bonded · Insured</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
          {p.service} in {p.city}, {p.stateCode} — priced upfront, done right.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#3D5A76]">
          A calm, professional fix for a stressful problem. Written quote before work starts, a verified technician, and zero hidden fees.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <TapToCallButton {...p} style={{ backgroundColor: t.palette.accent, color: "#fff" }} className={t.cta.radius} sublabel="Free estimate on major jobs" dark />
          <RatingSummary rating={p.rating} reviewCount={p.reviewCount} />
          <ResponseTimeIndicator responseTime={p.responseTime} className="border-[#CBDCEC] bg-[#F1F6FB] text-[#0F2A44]" />
        </div>
        <TrustBadgeRow licenseNo={p.licenseNo} className="mt-7 [&_li]:border-[#CBDCEC] [&_li]:bg-[#F1F6FB]" />
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHeading eyebrow="Who shows up" title="A verified technician — not a stranger" sub="You know who is coming, that they are checked, and when they will arrive." />
          <div className="mt-4"><TechnicianCard licenseNo={p.licenseNo} city={p.city} /></div>
        </div>
        <div>
          <SectionHeading eyebrow="Customer feedback" title={`What ${p.city} homeowners say`} />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {/* SAMPLE reviews — replace with real, sourced reviews (sample:false) */}
            <ReviewCard sample name="Sample homeowner" service={p.service} date="Sample date" text="Showed up when promised, explained the problem clearly, and the final price matched the written quote." />
            <ReviewCard sample name="Sample homeowner" service={p.service} date="Sample date" text="Got the technician's photo and ETA by text before arrival. Felt safe letting them in at 11pm." />
          </div>
        </div>
      </section>
      <section aria-label="Our guarantee" className="bg-[#0F2A44] text-white">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 text-center sm:grid-cols-3">
          {[["Upfront Pricing Guarantee", "Written quote first. Approved by you."],
            ["Zero Hidden Fees", "No after-hours, weekend or 'surprise' charges."],
            ["Warranty-Backed Work", "Same-day repair, workmanship guaranteed."]
          ].map(([h, d]) => <div key={h}><p className="font-extrabold">{h}</p><p className="mt-1 text-sm text-slate-300">{d}</p></div>)}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeading eyebrow="Before you book" title="Common questions" />
        <FaqAccordion faqs={defaultFaqs(p).slice(0, 3)} className="mt-4" />
      </section>
      <FinalCtaBand {...p} dark={false} />
      <StickyCallBar {...p} accent={t.palette.accent} />
    </main>
  );
}

/* ================================================================
 * 5. CONCEPT 3 — GUIDED JOURNEY
 * Process-first. Warm neutrals + deep teal, editorial serif headings.
 * Structure: reassuring hero → 3-step stepper → triage → about/trust
 *            → FULL FAQ accordion → final CTA → sticky bar
 * ================================================================ */
export function GuidedJourneyPage(rawProps) {
  const p = withDefaults(rawProps);
  const t = tokens.journey;
  return (
    <main style={{ fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: t.palette.bg, color: t.palette.text }} className="min-h-screen pb-24 sm:pb-0">
      <DispatchTopBar {...p} />
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:pt-14">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0F766E]">Here is exactly what happens next</p>
        <h1 style={{ fontFamily: "Georgia, serif" }} className="mt-3 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
          {p.service} in {p.city}, {p.stateCode} — three steps, no surprises.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#43534F]">
          Emergencies feel chaotic. The process should not. Call once and follow the same clear path every {p.city} homeowner gets.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <TapToCallButton {...p} style={{ backgroundColor: t.palette.accent, color: "#fff" }} className={t.cta.radius} sublabel="Step 1 takes 60 seconds" dark />
          <RatingSummary rating={p.rating} reviewCount={p.reviewCount} />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeading eyebrow="The journey" title="From flooded floor to fixed — today" />
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <JourneyStepper phone={p.phone} phoneHref={p.phoneHref} accent={t.palette.accent} />
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-12 lg:grid-cols-2">
        <TriageCard {...p} />
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <SectionHeading eyebrow={`About our ${p.service.toLowerCase()}`} title={`Why ${p.city} residents trust us`} />
          <ul className="mt-4 space-y-2.5 font-medium leading-relaxed">
            <li>✓ Rapid response — most jobs dispatched within the hour</li>
            <li>✓ Expert diagnosis — fixed right the first time</li>
            <li>✓ Evenings &amp; weekends at no extra charge</li>
            <li>✓ Fully equipped vans for on-the-spot repairs</li>
          </ul>
          <TrustBadgeRow licenseNo={p.licenseNo} className="mt-5 [&_li]:border-[#DDD2C2]" />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <SectionHeading eyebrow="FAQ" title="Homeowner emergency questions, answered" sub="Costs, arrival times, licensing, after-hours charges and what to do first." />
        <FaqAccordion faqs={defaultFaqs(p)} className="mt-4" />
      </section>
      <FinalCtaBand {...p} />
      <StickyCallBar {...p} accent={t.palette.accent} />
    </main>
  );
}

/* ================================================================
 * 6. CONCEPT 4 — HYPERLOCAL PROOF
 * Locality-first. City-forward hero, deep green + cream.
 * Pass `neighbourhoods` (real areas you serve) + local reviews via props.
 * Structure: city hero → neighbourhood chips → local reviews →
 *            service-area strip → triage → FAQ (3) → final CTA
 * ================================================================ */
export function HyperlocalProofPage(rawProps) {
  const p = withDefaults(rawProps);
  const t = tokens.hyperlocal;
  // Placeholder chips — replace with the real neighbourhoods for this city.
  const neighbourhoods = rawProps.neighbourhoods || [`Downtown ${p.city}`, `Greater ${p.city}`, `${p.city} surrounding areas`];
  return (
    <main style={{ fontFamily: t.font, backgroundColor: t.palette.bg, color: t.palette.text }} className="min-h-screen pb-24 sm:pb-0">
      <DispatchTopBar {...p} />
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:pt-14">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#166534]">{p.city}, {p.state} · Local, not a call centre</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black leading-[1.03] tracking-tight sm:text-6xl">
          Your {p.city} {p.service.toLowerCase()}.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#3E5A50]">
          Serving all of {p.city} — every neighbourhood, around the clock. Licensed plumbers who know {p.city} homes, priced upfront.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <TapToCallButton {...p} style={{ backgroundColor: t.palette.accent, color: "#fff" }} className={t.cta.radius} sublabel={`Local dispatch in ${p.city}`} dark />
          <RatingSummary rating={p.rating} reviewCount={p.reviewCount} />
          <ResponseTimeIndicator responseTime={p.responseTime} className="border-[#E0D3B4] bg-white" />
        </div>
        <ul className="mt-7 flex flex-wrap gap-2" aria-label={`Areas served in ${p.city}`}>
          {neighbourhoods.map((n) => <li key={n} className="inline-flex min-h-[48px] items-center rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">📍 {n}</li>)}
        </ul>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeading eyebrow="Local proof" title={`Recent words from ${p.city}`} sub="Replace sample cards with real, sourced local reviews before launch." />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* SAMPLE reviews — replace with real, sourced reviews (sample:false) */}
          <ReviewCard sample name="Sample homeowner" service={p.service} date="Sample date" text={`Fast arrival in ${p.city}, upfront quote, and the leak was fixed the same visit.`} />
          <ReviewCard sample name="Sample homeowner" service="Sewer backup" date="Sample date" text="Crew knew the area, showed up with everything needed, and left the place clean." />
          <ReviewCard sample name="Sample homeowner" service="Water heater leak" date="Sample date" text="No weekend surcharge and no pressure — just a clear price and a proper repair." />
        </div>
      </section>
      <section aria-label="Service area" className="bg-[#166534] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 font-bold">
          <span>📍 Service area: {p.city}, {p.stateCode} — city-wide</span>
          <span>Open 24 hours · 365 days</span>
          <a href={p.phoneHref} aria-label={`Call now: ${p.phone}`} className={`underline underline-offset-4 ${focusRing}`}>{p.phone}</a>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 lg:grid-cols-2">
        <TriageCard {...p} />
        <div>
          <SectionHeading eyebrow="Quick answers" title={`${p.city} FAQ`} />
          <FaqAccordion faqs={defaultFaqs(p).slice(0, 3)} className="mt-4" />
        </div>
      </section>
      <FinalCtaBand {...p} />
      <StickyCallBar {...p} accent={t.palette.accent} />
    </main>
  );
}

/* ================================================================
 * 7. CONCEPT 5 — ONE-THUMB SPEED
 * Minimal conversion machine. The CTA IS the hero. Oversized type,
 * one accent, near-zero scroll: proof (3) + mini-FAQ (3) + call.
 * No StickyCallBar — the hero CTA never leaves the first screen.
 * ================================================================ */
export function OneThumbSpeedPage(rawProps) {
  const p = withDefaults(rawProps);
  const t = tokens.onethumb;
  return (
    <main style={{ fontFamily: t.font, color: t.palette.text }} className="min-h-screen bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 text-sm font-extrabold">
        <span>{p.brandName || "Premier Emergency Plumbing"}</span>
        <span className="inline-flex items-center gap-1.5 font-bold text-[#3F4756]">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Open now · 24/7
        </span>
      </div>
      <section className="mx-auto max-w-3xl px-4 pt-6 text-center sm:pt-10">
        <h1 className="text-5xl font-black leading-[0.98] tracking-tight sm:text-7xl">
          {p.service}<br />{p.city}, {p.stateCode}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg font-medium leading-relaxed text-[#3F4756]">
          Licensed &amp; insured. Upfront price before work starts. No after-hours charge.
        </p>
        <div className="mt-7">
          <TapToCallButton {...p} style={{ backgroundColor: t.palette.accent, color: "#fff", minHeight: 64 }}
            className="w-full !rounded-2xl text-xl shadow-xl" label={`☎ Call ${p.phone}`} sublabel="Tap to call — answered 24/7" dark />
        </div>
        <div className="mt-4 flex justify-center"><RatingSummary rating={p.rating} reviewCount={p.reviewCount} /></div>
        <ResponseTimeIndicator responseTime={p.responseTime} className="mt-3 border-slate-200 bg-slate-50" />
        <ul className="mx-auto mt-8 grid max-w-lg gap-2 text-left font-bold" aria-label="Why call">
          <li className="rounded-xl bg-slate-50 px-4 py-3">✓ Licensed, bonded &amp; insured{p.licenseNo ? ` — No. ${p.licenseNo}` : ""}</li>
          <li className="rounded-xl bg-slate-50 px-4 py-3">✓ Upfront written quote — zero hidden fees</li>
          <li className="rounded-xl bg-slate-50 px-4 py-3">✓ Same-day repair, warranty-backed</li>
        </ul>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-10">
        <FaqAccordion faqs={defaultFaqs(p).slice(0, 3)} />
        <div className="mt-6">
          <TapToCallButton {...p} style={{ backgroundColor: t.palette.accent, color: "#fff", minHeight: 64 }}
            className="w-full !rounded-2xl text-xl" label={`☎ Call ${p.phone}`} dark />
        </div>
        <p className="mt-6 text-center text-xs font-semibold text-slate-500">
          {p.brandName || "Premier Emergency Plumbing"} — {p.service} in {p.city}, {p.state}. Open 24 hours.
          In an emergency, shut off your main water valve first, then call.
        </p>
      </section>
    </main>
  );
}

/* ================================================================
 * 8. A/B PREVIEW — drop <ConceptPreview /> on a staging route only.
 * ================================================================ */
export const CONCEPTS = {
  dispatch: DispatchCommandPage,
  credential: CredentialPremiumPage,
  journey: GuidedJourneyPage,
  hyperlocal: HyperlocalProofPage,
  onethumb: OneThumbSpeedPage,
};

export function ConceptPreview(props) {
  const [key, setKey] = useState("dispatch");
  const Page = CONCEPTS[key];
  return (
    <div>
      <nav aria-label="Choose concept" className="sticky top-0 z-[60] flex gap-2 overflow-x-auto bg-black px-3 py-2">
        {Object.entries(tokens).map(([k, v]) => (
          <button key={k} type="button" onClick={() => setKey(k)} aria-pressed={key === k}
            className={`min-h-[48px] shrink-0 rounded-lg px-4 text-sm font-bold ${key === k ? "bg-white text-black" : "bg-white/15 text-white"} ${focusRing}`}>
            {v.name}
          </button>
        ))}
      </nav>
      <Page {...props} />
    </div>
  );
}

export default DispatchCommandPage;
