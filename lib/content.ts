import pack from "./data/content-pack.json" with { type: "json" };

export interface ContentPack {
  intro: string[];
  body1: string[];
  body2: string[];
  trustBulletSets: string[][];
  faqCostAnswers: string[];
  faqArrivalAnswers: string[];
  faqBeforeArrivalAnswers: string[];
}

export const CONTENT_PACK = pack as ContentPack;

export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_match, key: string) => vars[key] ?? "");
}
