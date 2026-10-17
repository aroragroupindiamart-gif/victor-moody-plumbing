import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getLocation, getService,
  getSiblingServices, getNearbyLocations,
  isServiceAllowedForTier,
} from "@/lib/data";
import {
  BRAND_NAME, PHONE_NUMBER, PHONE_TEL, SITE_URL,
  NICHE, NICHE_PLURAL, NICHE_SINGULAR, SCHEMA_TYPE, CONTENT_SALT, ACTIVE_CONCEPT,
} from "@/lib/config";
import { selectVariant } from "@/lib/spintax";
import { CONTENT_PACK, renderTemplate } from "@/lib/content";
import Footer from "@/components/Footer";
import { CONCEPTS } from "@/components/landing-components";

export const revalidate = 2592000; // 30 days
export const dynamicParams = true;

interface Props {
  params: Promise<{ state: string; place: string; service: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, place, service: serviceSlug } = await params;
  const stateCode = state.toUpperCase();
  const [loc, svc] = await Promise.all([getLocation(stateCode, place), getService(serviceSlug)]);
  if (!loc || !svc) return { title: "Not Found" };
  if (!(await isServiceAllowedForTier(svc.id, loc.tier))) return { title: "Not Found" };

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
  const stateCode = state.toUpperCase();

  const [loc, svc] = await Promise.all([getLocation(stateCode, place), getService(serviceSlug)]);
  if (!loc || !svc) notFound();
  if (!(await isServiceAllowedForTier(svc.id, loc.tier))) notFound();

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

  const SelectedConceptPage = (CONCEPTS as Record<string, any>)[ACTIVE_CONCEPT] || CONCEPTS.dispatch;

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

      <Footer city={loc.place_name} stateCode={stateCode} placeSlug={loc.place_slug} />
    </>
  );
}
