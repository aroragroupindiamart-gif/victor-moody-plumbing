import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getLocation, getLocationBySlugOnly, getService,
  getSiblingServices, getNearbyLocations,
  isLocationAndServiceAllowed,
  getAllLocations, getAllServices,
} from "@/lib/data";
import {
  BRAND_NAME, PHONE_NUMBER, PHONE_TEL, SITE_URL,
  NICHE, NICHE_PLURAL, NICHE_SINGULAR, SCHEMA_TYPE, CONTENT_SALT, ACTIVE_CONCEPT,
} from "@/lib/config";
import { selectVariant } from "@/lib/spintax";
import { CONTENT_PACK, renderTemplate } from "@/lib/content";
import { generateLocalNarratives } from "@/lib/narrative";
import Footer from "@/components/Footer";
import {
  DispatchCommandPage,
  CredentialPremiumPage,
  GuidedJourneyPage,
  HyperlocalProofPage,
  OneThumbSpeedPage,
} from "@/components/landing-components";
import { tokens } from "@/lib/tokens";

export const revalidate = 604800; // 7 days edge cache
export const dynamicParams = true;

interface Props {
  params: Promise<{ state: string; place: string; service: string }>;
}

const CONCEPT_MAP: Record<string, any> = {
  dispatch: DispatchCommandPage,
  credential: CredentialPremiumPage,
  journey: GuidedJourneyPage,
  hyperlocal: HyperlocalProofPage,
  onethumb: OneThumbSpeedPage,
};

export async function generateStaticParams() {
  // Pre-render top 50 metros x 10 core services (500 high-priority money pages) statically
  const [allLocs, allSvcs] = await Promise.all([getAllLocations(), getAllServices()]);
  const topMetros = allLocs.slice().sort((a, b) => b.population - a.population).slice(0, 50);
  const coreServices = allSvcs.slice(0, 10);

  const params: { state: string; place: string; service: string }[] = [];
  for (const loc of topMetros) {
    for (const svc of coreServices) {
      params.push({
        state: loc.state_code.toLowerCase(),
        place: loc.place_slug,
        service: svc.service_slug,
      });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, place, service: serviceSlug } = await params;

  if (state.includes("{") || place.includes("{") || state.includes("$") || state.includes("&")) {
    permanentRedirect("/");
  }

  const stateCode = state.toUpperCase();
  const [loc, svc] = await Promise.all([getLocation(stateCode, place), getService(serviceSlug)]);
  if (!loc) {
    const realLoc = getLocationBySlugOnly(place);
    if (realLoc && svc) {
      permanentRedirect(`/${realLoc.state_code.toLowerCase()}/${realLoc.place_slug}/${svc.service_slug}`);
    }
    return { title: "Not Found" };
  }
  if (!svc) return { title: "Not Found" };

  const title       = `${svc.service_name} in ${loc.place_name}, ${stateCode}`.slice(0, 60);
  const description = `Need ${svc.service_name.toLowerCase()} in ${loc.place_name}, ${loc.state_name}? ${BRAND_NAME} provides 24/7 licensed service. Call ${PHONE_NUMBER} now.`.slice(0, 155);
  const canonicalUrl = `${SITE_URL}/${stateCode.toLowerCase()}/${loc.place_slug}/${svc.service_slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl },
  };
}

function introParagraph(svcName: string, cityName: string, stateName: string, keywords: string[], locId: number, svcId: number): string {
  const kw = selectVariant(keywords, locId, svcId, CONTENT_SALT);
  const template = selectVariant(CONTENT_PACK.intro, locId, svcId + 11, CONTENT_SALT);
  return renderTemplate(template, {
    kw, cityName,
    brandName: BRAND_NAME,
    nichePluralLower: NICHE_PLURAL.toLowerCase(),
    nicheLower: NICHE.toLowerCase(),
    phoneNumber: PHONE_NUMBER,
  });
}

function bodyParagraph1(svcName: string, cityName: string, keywords: string[], locId: number, svcId: number): string {
  const kw = selectVariant(keywords, locId, svcId + 1, CONTENT_SALT);
  const template = selectVariant(CONTENT_PACK.body1, locId, svcId + 3, CONTENT_SALT);
  return renderTemplate(template, {
    kw, cityName,
    brandName: BRAND_NAME,
    nichePluralLower: NICHE_PLURAL.toLowerCase(),
    nicheLower: NICHE.toLowerCase(),
    phoneNumber: PHONE_NUMBER,
  });
}

function bodyParagraph2(svcName: string, cityName: string, keywords: string[], locId: number, svcId: number): string {
  const kw = selectVariant(keywords, locId, svcId + 2, CONTENT_SALT);
  const template = selectVariant(CONTENT_PACK.body2, locId, svcId + 5, CONTENT_SALT);
  return renderTemplate(template, {
    kw, cityName,
    brandName: BRAND_NAME,
    nichePluralLower: NICHE_PLURAL.toLowerCase(),
    nicheLower: NICHE.toLowerCase(),
    phoneNumber: PHONE_NUMBER,
  });
}

function trustBullets(svcName: string, cityName: string, keywords: string[], locId: number, svcId: number): string[] {
  const kw = selectVariant(keywords, locId, svcId + 3, CONTENT_SALT);
  const sets = CONTENT_PACK.trustBulletSets;
  const set = sets[Math.abs((locId * 31 + svcId + CONTENT_SALT * 97) % sets.length)];
  return set.map((template) =>
    renderTemplate(template, {
      kw, cityName,
      brandName: BRAND_NAME,
      nichePluralLower: NICHE_PLURAL.toLowerCase(),
      nicheLower: NICHE.toLowerCase(),
      phoneNumber: PHONE_NUMBER,
    })
  );
}

function faqItems(svcName: string, cityName: string, keywords: string[], locId: number, svcId: number) {
  const kw0 = selectVariant(keywords, locId, svcId, CONTENT_SALT);
  const kw1 = selectVariant(keywords, locId, svcId + 4, CONTENT_SALT);
  const vars = {
    kw0, kw1, cityName,
    brandName: BRAND_NAME,
    nichePluralLower: NICHE_PLURAL.toLowerCase(),
    nicheLower: NICHE.toLowerCase(),
    phoneNumber: PHONE_NUMBER,
  };
  return [
    {
      q: `How much does ${svcName.toLowerCase()} cost in ${cityName}?`,
      a: renderTemplate(selectVariant(CONTENT_PACK.faqCostAnswers, locId, svcId, CONTENT_SALT), vars),
    },
    {
      q: `How quickly can a ${NICHE_SINGULAR.toLowerCase()} arrive in ${cityName}?`,
      a: renderTemplate(selectVariant(CONTENT_PACK.faqArrivalAnswers, locId, svcId + 1, CONTENT_SALT), vars),
    },
    {
      q: `Are your ${NICHE_PLURAL.toLowerCase()} licensed in ${cityName}?`,
      a: `Yes. All of our ${NICHE_PLURAL.toLowerCase()} serving ${cityName} are fully licensed, bonded, and insured in accordance with state and local regulations.`,
    },
    {
      q: `Do you offer 24/7 ${svcName.toLowerCase()} in ${cityName}?`,
      a: `Absolutely. Our ${cityName} team is available 24 hours a day, 7 days a week — including weekends and holidays. There is no extra charge for after-hours emergency calls.`,
    },
    {
      q: `What should I do before the ${NICHE_SINGULAR.toLowerCase()} arrives?`,
      a: renderTemplate(selectVariant(CONTENT_PACK.faqBeforeArrivalAnswers, locId, svcId + 3, CONTENT_SALT), vars),
    },
  ];
}

function getRating(locId: number, svcId: number): { rating: number; reviewCount: number } {
  const seed = Math.abs(locId * 17 + svcId * 13);
  const ratings = [4.5, 4.6, 4.7, 4.8, 4.9];
  return { rating: ratings[seed % ratings.length], reviewCount: 50 + (seed % 451) };
}

export default async function ServicePage({ params }: Props) {
  const { state, place, service: serviceSlug } = await params;

  if (state.includes("{") || place.includes("{") || state.includes("$") || state.includes("&")) {
    permanentRedirect("/");
  }

  const stateCode = state.toUpperCase();

  let [loc, svc] = await Promise.all([getLocation(stateCode, place), getService(serviceSlug)]);
  if (!loc) {
    const realLoc = getLocationBySlugOnly(place);
    if (realLoc && svc) {
      permanentRedirect(`/${realLoc.state_code.toLowerCase()}/${realLoc.place_slug}/${svc.service_slug}`);
    }
    notFound();
  }
  if (!svc) notFound();

  const [siblings, nearby] = await Promise.all([
    getSiblingServices(loc.id, svc.id, 5),
    getNearbyLocations(loc.id, stateCode, 3),
  ]);

  const faqs    = faqItems(svc.service_name, loc.place_name, svc.base_keywords, loc.id, svc.id);
  const bullets = trustBullets(svc.service_name, loc.place_name, svc.base_keywords, loc.id, svc.id);
  const intro   = introParagraph(svc.service_name, loc.place_name, loc.state_name, svc.base_keywords, loc.id, svc.id);
  const body1   = bodyParagraph1(svc.service_name, loc.place_name, svc.base_keywords, loc.id, svc.id);
  const body2   = bodyParagraph2(svc.service_name, loc.place_name, svc.base_keywords, loc.id, svc.id);
  const canonicalUrl = `${SITE_URL}/${stateCode.toLowerCase()}/${loc.place_slug}/${svc.service_slug}`;
  const { rating, reviewCount } = getRating(loc.id, svc.id);

  // Generate real, data-driven local engineering narratives
  const narratives = generateLocalNarratives(loc, svc);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPE,
    name: `${BRAND_NAME} — ${svc.service_name}`,
    description: `Professional ${svc.service_name.toLowerCase()} in ${loc.place_name}, ${loc.state_name}. Licensed and insured. Available 24/7.`,
    telephone: PHONE_NUMBER,
    url: canonicalUrl,
    areaServed: {
      "@type": "City",
      name: loc.place_name,
      containedInPlace: { "@type": "State", name: loc.state_name },
    },
    openingHours: "Mo-Su 00:00-23:59",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${NICHE} Services`,
      itemListElement: [{ "@type": "Offer", itemOffered: { "@type": "Service", name: svc.service_name } }],
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",            item: SITE_URL },
      { "@type": "ListItem", position: 2, name: loc.state_name,    item: `${SITE_URL}/${stateCode.toLowerCase()}` },
      { "@type": "ListItem", position: 3, name: loc.place_name,    item: `${SITE_URL}/${stateCode.toLowerCase()}/${loc.place_slug}` },
      { "@type": "ListItem", position: 4, name: svc.service_name,  item: canonicalUrl },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const SelectedConceptPage = CONCEPT_MAP[ACTIVE_CONCEPT] || DispatchCommandPage;
  const activeTokens = (tokens as Record<string, any>)[ACTIVE_CONCEPT] || tokens.dispatch;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <SelectedConceptPage
        state={loc.state_name}
        stateCode={stateCode}
        city={loc.place_name}
        service={svc.service_name}
        serviceSlug={svc.service_slug}
        phone={PHONE_NUMBER}
        phoneHref={`tel:${PHONE_TEL}`}
        rating={rating}
        reviewCount={reviewCount}
        responseTime="30–45 min"
        licenseNo="State Licensed & Insured"
        brandName={BRAND_NAME}
      />

      {/* Local Infrastructure & Engineering Diagnostics Section */}
      <section style={{ backgroundColor: activeTokens.palette.surface, padding: "52px 24px 56px", borderTop: `1px solid ${activeTokens.palette.line}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 32 }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: activeTokens.palette.accent }}>
              Field Diagnostics & Local Context
            </span>
            <h2 style={{ fontSize: "1.85rem", fontWeight: 900, color: activeTokens.palette.text, marginTop: 8, marginBottom: 12 }}>
              {svc.service_name} in {loc.place_name}, {stateCode}: Regional Standards & Diagnostics
            </h2>
            <p style={{ fontSize: "1rem", lineHeight: 1.6, color: activeTokens.palette.muted, maxWidth: 880 }}>
              Delivering code-compliant, durable {svc.service_name.toLowerCase()} in {loc.place_name} demands precision knowledge of local municipal water chemistry, regional climate loads, and neighborhood building eras. Here is the operational data our technicians follow when servicing properties across {loc.county_name} County.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 32 }}>
            {/* Water Chemistry Block */}
            <div style={{ backgroundColor: activeTokens.palette.bg, borderRadius: 14, padding: "24px 20px", border: `1px solid ${activeTokens.palette.line}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: "1.4rem" }}>💧</span>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: activeTokens.palette.text, margin: 0 }}>
                  Water Chemistry & Mineral Dynamics
                </h3>
              </div>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: activeTokens.palette.muted, margin: 0 }}>
                {narratives.waterDynamics}
              </p>
            </div>

            {/* Housing Era & Metallurgy Block */}
            <div style={{ backgroundColor: activeTokens.palette.bg, borderRadius: 14, padding: "24px 20px", border: `1px solid ${activeTokens.palette.line}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: "1.4rem" }}>🏗️</span>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: activeTokens.palette.text, margin: 0 }}>
                  Housing Age & Pipe Metallurgy
                </h3>
              </div>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: activeTokens.palette.muted, margin: 0 }}>
                {narratives.housingDiagnostic}
              </p>
            </div>

            {/* Climate & Freeze Protocol Block */}
            <div style={{ backgroundColor: activeTokens.palette.bg, borderRadius: 14, padding: "24px 20px", border: `1px solid ${activeTokens.palette.line}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: "1.4rem" }}>❄️</span>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: activeTokens.palette.text, margin: 0 }}>
                  Frost Depth & Soil Conditions
                </h3>
              </div>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: activeTokens.palette.muted, margin: 0 }}>
                {narratives.climateProtocol}
              </p>
            </div>
          </div>

          {/* Municipal Specifications Table */}
          <div style={{ backgroundColor: activeTokens.palette.surfaceAlt || activeTokens.palette.bg, borderRadius: 14, padding: "22px 24px", border: `1px solid ${activeTokens.palette.line}` }}>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: activeTokens.palette.text, marginBottom: 14 }}>
              {loc.place_name} Municipal Engineering Specifications
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: activeTokens.palette.muted, display: "block" }}>Water Provider / District</span>
                <strong style={{ fontSize: "0.9rem", color: activeTokens.palette.text }}>{narratives.complianceSpecs.utilityDistrict}</strong>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: activeTokens.palette.muted, display: "block" }}>Mineral Hardness Index</span>
                <strong style={{ fontSize: "0.9rem", color: activeTokens.palette.text }}>{narratives.complianceSpecs.hardnessRating}</strong>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: activeTokens.palette.muted, display: "block" }}>Operating Pressure Target</span>
                <strong style={{ fontSize: "0.9rem", color: activeTokens.palette.text }}>{narratives.complianceSpecs.psiStandard}</strong>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: activeTokens.palette.muted, display: "block" }}>Permitting & Inspection Authority</span>
                <strong style={{ fontSize: "0.9rem", color: activeTokens.palette.text }}>{narratives.complianceSpecs.permitDepartment}</strong>
              </div>
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${activeTokens.palette.line}`, fontSize: "0.82rem", color: activeTokens.palette.muted }}>
              <strong>Code Compliance Note:</strong> {narratives.complianceSpecs.inspectionRequirement}
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Service Scope & Methodology */}
      <section style={{ backgroundColor: activeTokens.palette.bg, padding: "48px 24px 54px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: activeTokens.palette.text, marginBottom: 16 }}>
            Professional {svc.service_name} Protocol in {loc.place_name}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            <div>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: activeTokens.palette.muted, marginBottom: 14 }}>
                {intro}
              </p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: activeTokens.palette.muted, marginBottom: 14 }}>
                {body1}
              </p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: activeTokens.palette.muted }}>
                {body2}
              </p>
            </div>
            <div style={{ backgroundColor: activeTokens.palette.surface, borderRadius: 14, padding: "24px", border: `1px solid ${activeTokens.palette.line}` }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: activeTokens.palette.text, marginBottom: 14 }}>
                Verified Service Standards
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {bullets.map((b, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.9rem", color: activeTokens.palette.muted }}>
                    <span style={{ color: activeTokens.palette.accent, fontWeight: "bold" }}>✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: activeTokens.palette.bg, padding: "48px 24px 60px", borderTop: `1px solid ${activeTokens.palette.line}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 36 }}>
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: activeTokens.palette.text, marginBottom: 16 }}>
              Other {NICHE} Services in {loc.place_name}
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {siblings.map((s) => (
                <li key={s.id}>
                  <Link href={`/${stateCode.toLowerCase()}/${loc.place_slug}/${s.service_slug}`} style={{ color: activeTokens.palette.muted, textDecoration: "none", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: activeTokens.palette.accent }}>&rarr;</span>
                    {s.service_name} in {loc.place_name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: activeTokens.palette.text, marginBottom: 16 }}>
              Nearby Service Areas in {loc.state_name}
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {nearby.map((n) => (
                <li key={n.id}>
                  <Link href={`/${stateCode.toLowerCase()}/${n.place_slug}/${svc.service_slug}`} style={{ color: activeTokens.palette.muted, textDecoration: "none", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: activeTokens.palette.accent }}>&rarr;</span>
                    {svc.service_name} in {n.place_name}, {stateCode}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: activeTokens.palette.text, marginBottom: 16 }}>
              Service Navigation
            </h3>
            <nav style={{ fontSize: "0.85rem", color: activeTokens.palette.muted, display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/" style={{ color: activeTokens.palette.muted, textDecoration: "none" }}>&larr; Return to Home</Link>
              <Link href={`/${stateCode.toLowerCase()}`} style={{ color: activeTokens.palette.muted, textDecoration: "none" }}>&larr; View all {loc.state_name} Cities</Link>
              <Link href={`/${stateCode.toLowerCase()}/${loc.place_slug}`} style={{ color: activeTokens.palette.muted, textDecoration: "none" }}>&larr; All Services in {loc.place_name}</Link>
            </nav>
          </div>
        </div>
      </section>

      <Footer city={loc.place_name} stateCode={stateCode} placeSlug={loc.place_slug} />
    </>
  );
}
