import locationsRaw from "./data/locations.json";
import servicesRaw from "./data/services.json";
import { LAUNCH_DATE } from "./config";

export interface Service {
  id: number;
  service_name: string;
  service_slug: string;
  service_tier: number;
  base_keywords: string[];
}

export interface Location {
  id: number;
  state_code: string;
  state_name: string;
  county_name: string;
  place_name: string;
  place_slug: string;
  place_type: string;
  population: number;
  area_code: string;
  tier: number;
}

export interface StateRow {
  state_code: string;
  state_name: string;
  location_count: number;
  page_count: number;
}

const ALL_LOCATIONS = locationsRaw as unknown as Location[];
const ALL_SERVICES  = servicesRaw  as unknown as Service[];

// Sort all US locations by population descending (Tier 1 Metro Priority)
const POPULATION_SORTED_LOCATIONS = ALL_LOCATIONS.slice().sort(
  (a, b) => b.population - a.population || a.place_name.localeCompare(b.place_name)
);

const locationByKey = new Map<string, Location>();
const locationById  = new Map<number, Location>();
const serviceBySlug = new Map<string, Service>();

for (const loc of ALL_LOCATIONS) {
  locationByKey.set(`${loc.state_code}|${loc.place_slug}`, loc);
  locationById.set(loc.id, loc);
}
for (const svc of ALL_SERVICES) {
  serviceBySlug.set(svc.service_slug, svc);
}

function shuffleKey(serviceId: number, locationId: number): number {
  let h = Math.imul(serviceId, 2654435761) ^ Math.imul(locationId, 2246822519);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  return (h ^ (h >>> 16)) >>> 0;
}

export async function getAllLocations(): Promise<Location[]> {
  return ALL_LOCATIONS;
}

export async function getAllServices(): Promise<Service[]> {
  return getDripServices();
}

export async function getStates(): Promise<StateRow[]> {
  const map = new Map<string, StateRow>();
  for (const loc of ALL_LOCATIONS) {
    const pages = ROUTE3_MAX_SERVICES;
    const entry = map.get(loc.state_code);
    if (entry) {
      entry.location_count++;
      entry.page_count += pages;
    } else {
      map.set(loc.state_code, {
        state_code: loc.state_code,
        state_name: loc.state_name,
        location_count: 1,
        page_count: pages,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) =>
    b.location_count - a.location_count || a.state_name.localeCompare(b.state_name)
  );
}

export async function getFeaturedLocations(salt = 0, count = 16): Promise<Location[]> {
  const dripLocs = await getDripLocations();
  if (dripLocs.length <= count) return dripLocs;

  const maxOffset = Math.max(1, dripLocs.length - count);
  const offset = Math.abs(salt * 7) % maxOffset;
  return dripLocs.slice(offset, offset + count);
}

export async function getStateByCode(stateCode: string): Promise<StateRow | null> {
  const states = await getStates();
  return states.find((s) => s.state_code === stateCode) ?? null;
}

export async function getLocationsByState(stateCode: string): Promise<Location[]> {
  return ALL_LOCATIONS.filter((l) => l.state_code === stateCode).sort(
    (a, b) => b.population - a.population || a.place_name.localeCompare(b.place_name)
  );
}

export async function getLocation(stateCode: string, placeSlug: string): Promise<Location | null> {
  return locationByKey.get(`${stateCode}|${placeSlug}`) ?? null;
}

export async function getLocationById(id: number): Promise<Location | null> {
  return locationById.get(id) ?? null;
}

export async function getService(serviceSlug: string): Promise<Service | null> {
  return serviceBySlug.get(serviceSlug) ?? null;
}

export async function getServicesByLocationTier(_tier: number): Promise<Service[]> {
  return getDripServices();
}

export async function getServicesByLocation(_locationId: number): Promise<Service[]> {
  return getDripServices();
}

export async function isServiceAllowedForTier(_serviceId: number, _locationTier: number): Promise<boolean> {
  return true;
}

export async function getSiblingServices(locationId: number, serviceId: number, limit = 5): Promise<Service[]> {
  const loc = locationById.get(locationId);
  if (!loc) return [];
  const dripSvcs = await getDripServices();
  const pool = dripSvcs.filter((s) => s.id !== serviceId);
  return pool.slice(0, limit);
}

export async function getNearbyLocations(locationId: number, stateCode: string, limit = 3): Promise<Location[]> {
  const dripLocs = await getDripLocations();
  const stateDripLocs = dripLocs.filter((l) => l.state_code === stateCode && l.id !== locationId);
  if (stateDripLocs.length > 0) {
    return stateDripLocs.slice(0, limit);
  }
  return dripLocs.filter((l) => l.id !== locationId).slice(0, limit);
}

/* ================================================================
 * ROUTE 3 HYBRID PLAN: STRICT 21-DAY DRIP ENGINE (~650-700 URL CEILING)
 * ================================================================ */

export const ROUTE3_MAX_CITIES = 200; // Hard ceiling: Top 200 US Metros only
export const ROUTE3_MAX_SERVICES = 3;  // Hard ceiling: 3 Core Infrastructure Services only

// LOCKED Spec v3 §4: The 12 Wave-1 Launch Cities (AZ & CA GSC-Validated Clusters)
export const WAVE1_LOCATIONS_DEF = [
  { state: "AZ", slug: "mesa" },
  { state: "AZ", slug: "gilbert" },
  { state: "AZ", slug: "phoenix" },
  { state: "AZ", slug: "scottsdale" },
  { state: "AZ", slug: "tucson" },
  { state: "AZ", slug: "goodyear" },
  { state: "AZ", slug: "flagstaff" },
  { state: "CA", slug: "sacramento" },
  { state: "CA", slug: "redlands" },
  { state: "CA", slug: "murrieta" },
  { state: "CA", slug: "san-marcos" },
  { state: "CA", slug: "santa-rosa" },
];

const WAVE1_LOC_KEYS = new Set(WAVE1_LOCATIONS_DEF.map((w) => `${w.state}|${w.slug}`));
const WAVE1_ACTUAL_LOCS = WAVE1_LOCATIONS_DEF
  .map((w) => locationByKey.get(`${w.state}|${w.slug}`))
  .filter((l): l is Location => Boolean(l));

const NON_WAVE1_POPULATION = POPULATION_SORTED_LOCATIONS.filter(
  (l) => !WAVE1_LOC_KEYS.has(`${l.state_code}|${l.place_slug}`)
);

// Route 3 200 Metros Pool: Wave-1 first (12 cities), then top metros by population
export const ROUTE3_METROS_POOL = [...WAVE1_ACTUAL_LOCS, ...NON_WAVE1_POPULATION].slice(0, ROUTE3_MAX_CITIES);

// Route 3 Core Target Verticals
export const ROUTE3_SERVICE_SLUGS = [
  "water-pressure-problems",       // 1. Water Pressure Diagnostics & PRVs
  "backflow-preventer-testing",    // 2. Municipal Backflow Testing & Prevention
  "pipe-replacement",             // 3. Whole-Home Repiping
];

export interface LocalInfrastructureData {
  water_district_name: string;
  local_water_hardness: string;
  municipal_psi_standard: string;
  county_backflow_compliance_dept: string;
}

export const LOCAL_INFRASTRUCTURE_DATA: Record<string, LocalInfrastructureData> = {
  "AZ|phoenix": {
    water_district_name: "City of Phoenix Water Services Department",
    local_water_hardness: "Very Hard (12–18 GPG / 205–308 ppm from Salt/Verde Rivers)",
    municipal_psi_standard: "City supply 50–90+ PSI; PRV mandatory if static pressure >80 PSI (UPC 608.2)",
    county_backflow_compliance_dept: "City of Phoenix Cross-Connection Control / Maricopa County Environmental Services",
  },
  "AZ|mesa": {
    water_district_name: "City of Mesa Water Resources",
    local_water_hardness: "Extremely Hard (15–22 GPG / 256–376 ppm from CAP & Salt River)",
    municipal_psi_standard: "City main pressure 55–85 PSI; PRV required for residential lines >80 PSI",
    county_backflow_compliance_dept: "City of Mesa Backflow Prevention Program (Annual ADEQ certification)",
  },
  "AZ|gilbert": {
    water_district_name: "Town of Gilbert Water Department",
    local_water_hardness: "Very Hard (14–20 GPG / 240–342 ppm)",
    municipal_psi_standard: "Distribution pressure 60–90 PSI; PRV mandatory per Gilbert Town Code Chapter 10",
    county_backflow_compliance_dept: "Town of Gilbert Environmental Compliance Division",
  },
  "AZ|scottsdale": {
    water_district_name: "Scottsdale Water",
    local_water_hardness: "Very Hard (14–22 GPG / 240–376 ppm)",
    municipal_psi_standard: "70–95 PSI due to desert elevation gradients; PRVs strongly recommended/enforced",
    county_backflow_compliance_dept: "Scottsdale Cross-Connection Control Division",
  },
  "AZ|tucson": {
    water_district_name: "Tucson Water",
    local_water_hardness: "Moderately to Very Hard (8–16 GPG / 137–274 ppm)",
    municipal_psi_standard: "Static pressure 45–80 PSI; PRV required if >80 PSI per Unified Plumbing Code",
    county_backflow_compliance_dept: "Tucson Water Backflow Prevention Section / Pima County DEQ",
  },
  "AZ|goodyear": {
    water_district_name: "City of Goodyear Water Services / EPCOR Water",
    local_water_hardness: "Extremely Hard (18–26 GPG / 308–445 ppm)",
    municipal_psi_standard: "Main operating pressure 50–85 PSI; PRVs standard on residential builds",
    county_backflow_compliance_dept: "City of Goodyear Environmental Services",
  },
  "AZ|flagstaff": {
    water_district_name: "City of Flagstaff Utilities",
    local_water_hardness: "Moderately Hard (4–8 GPG / 68–137 ppm from Lake Mary Wellfields)",
    municipal_psi_standard: "Mountain elevation variance 60–100+ PSI; PRVs required to prevent freeze-thaw bursts",
    county_backflow_compliance_dept: "City of Flagstaff Cross-Connection Control Program",
  },
  "CA|sacramento": {
    water_district_name: "City of Sacramento Department of Utilities",
    local_water_hardness: "Soft to Moderately Hard (3–6 GPG / 51–103 ppm from American & Sacramento Rivers)",
    municipal_psi_standard: "45–75 PSI; California Plumbing Code (CPC 608.2) mandates approved PRV if >80 PSI",
    county_backflow_compliance_dept: "Sacramento County Environmental Management Dept (EMD) / City Cross-Connection",
  },
  "CA|redlands": {
    water_district_name: "City of Redlands Municipal Utilities & Engineering Dept",
    local_water_hardness: "Hard (10–16 GPG / 171–274 ppm from Santa Ana River)",
    municipal_psi_standard: "Foothill gravity gradients generate up to 90–110 PSI; PRVs essential",
    county_backflow_compliance_dept: "San Bernardino County Division of Environmental Health Services",
  },
  "CA|murrieta": {
    water_district_name: "Western Municipal Water District / Rancho California Water District",
    local_water_hardness: "Hard to Very Hard (11–17 GPG / 188–290 ppm)",
    municipal_psi_standard: "55–85 PSI; PRV required where incoming pressure exceeds 80 PSI per CPC",
    county_backflow_compliance_dept: "Riverside County Department of Environmental Health",
  },
  "CA|san-marcos": {
    water_district_name: "Vallecitos Water District",
    local_water_hardness: "Hard (12–16 GPG / 205–274 ppm imported from Metropolitan Water District)",
    municipal_psi_standard: "50–85 PSI; District regulations mandate PRVs for connections >80 PSI",
    county_backflow_compliance_dept: "San Diego County Dept of Environmental Health & Quality (DEHQ)",
  },
  "CA|santa-rosa": {
    water_district_name: "Santa Rosa Water",
    local_water_hardness: "Moderately Hard (5–9 GPG / 85–154 ppm from Russian River collector wells)",
    municipal_psi_standard: "45–80 PSI; PRV installation enforced under Sonoma County / Santa Rosa Municipal Code",
    county_backflow_compliance_dept: "City of Santa Rosa Environmental Services Cross-Connection Control",
  },
};

export function getLocalInfrastructure(stateCode: string, placeSlug: string): LocalInfrastructureData {
  const key = `${stateCode.toUpperCase()}|${placeSlug.toLowerCase()}`;
  if (LOCAL_INFRASTRUCTURE_DATA[key]) {
    return LOCAL_INFRASTRUCTURE_DATA[key];
  }
  return {
    water_district_name: `Local Municipal Water Utility of ${placeSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`,
    local_water_hardness: "Regional Municipal Supply (10–18 GPG Average)",
    municipal_psi_standard: "Uniform Plumbing Code (UPC 608.2) Standard: 50–80 PSI Max",
    county_backflow_compliance_dept: "County Environmental Health Division Cross-Connection Program",
  };
}

export function getDripLocationsCount(): number {
  const envCount = process.env.NEXT_PUBLIC_DRIP_COUNT;
  if (envCount && !isNaN(Number(envCount))) {
    return Math.min(Number(envCount), ROUTE3_MAX_CITIES);
  }
  const launchStr = LAUNCH_DATE || process.env.NEXT_PUBLIC_LAUNCH_DATE || new Date().toISOString().split("T")[0];
  const launch = new Date(launchStr).getTime();
  const now = Date.now();
  const daysElapsed = Math.max(0, Math.floor((now - launch) / (1000 * 60 * 60 * 24)));

  // Day 1: 12 Audited Wave-1 cities (12 * 3 = 36 landing pages + 9 hubs = 46 URLs)
  // Day 7: ~66 cities (~200 landing pages)
  // Day 14: ~130 cities (~400 landing pages)
  // Day 21+: 200 cities max (200 * 3 = 600 landing pages + hubs = ~650-700 URLs Lifetime Ceiling)
  const allowed = Math.min(12 + daysElapsed * 9, ROUTE3_MAX_CITIES);
  return allowed;
}

export function getDripServicesCount(_daysElapsed = 0): number {
  return ROUTE3_MAX_SERVICES;
}

export async function getDripLocations(): Promise<Location[]> {
  const count = getDripLocationsCount();
  return ROUTE3_METROS_POOL.slice(0, count);
}

export async function getDripServices(): Promise<Service[]> {
  const selected = ROUTE3_SERVICE_SLUGS
    .map((slug) => serviceBySlug.get(slug))
    .filter((s): s is Service => Boolean(s));

  if (selected.length === 3) {
    return selected;
  }
  return ALL_SERVICES.slice(0, ROUTE3_MAX_SERVICES);
}

export async function isLocationAllowed(stateCode: string, placeSlug: string): Promise<boolean> {
  const dripLocs = await getDripLocations();
  return dripLocs.some((l) => l.state_code === stateCode && l.place_slug === placeSlug);
}

export async function getDripLocationsByState(stateCode: string): Promise<Location[]> {
  const dripLocs = await getDripLocations();
  return dripLocs.filter((l) => l.state_code === stateCode);
}

export async function isLocationAndServiceAllowed(stateCode: string, placeSlug: string, serviceSlug: string): Promise<boolean> {
  const isLocAllowed = await isLocationAllowed(stateCode, placeSlug);
  if (!isLocAllowed) return false;

  const dripSvcs = await getDripServices();
  return dripSvcs.some((s) => s.service_slug === serviceSlug);
}

export async function getDripStates(): Promise<StateRow[]> {
  const dripLocs = await getDripLocations();
  const dripSvcs = await getDripServices();
  const stateMap = new Map<string, { state_code: string; state_name: string; location_count: number; page_count: number }>();

  for (const loc of dripLocs) {
    const existing = stateMap.get(loc.state_code);
    if (existing) {
      existing.location_count++;
      existing.page_count += dripSvcs.length;
    } else {
      stateMap.set(loc.state_code, {
        state_code: loc.state_code,
        state_name: loc.state_name,
        location_count: 1,
        page_count: dripSvcs.length,
      });
    }
  }

  return Array.from(stateMap.values()).sort((a, b) =>
    b.location_count - a.location_count || a.state_name.localeCompare(b.state_name)
  );
}
