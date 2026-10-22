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
  return ALL_LOCATIONS.filter(
    (l) => l.state_code === stateCode && l.id !== locationId
  )
    .sort((a, b) => b.population - a.population)
    .slice(0, limit);
}

/* ================================================================
 * ROUTE 3 HYBRID PLAN: STRICT 21-DAY DRIP ENGINE (~650-700 URL CEILING)
 * ================================================================ */

export const ROUTE3_MAX_CITIES = 200; // Hard ceiling: Top 200 US Metros only
export const ROUTE3_MAX_SERVICES = 3;  // Hard ceiling: 3 Core Infrastructure Services only

// Route 3 Core Target Verticals
export const ROUTE3_SERVICE_SLUGS = [
  "water-pressure-problems",       // 1. Water Pressure Diagnostics & PRVs
  "backflow-preventer-testing",    // 2. Municipal Backflow Testing & Prevention
  "pipe-replacement",             // 3. Whole-Home Repiping
];

export function getDripLocationsCount(): number {
  const envCount = process.env.NEXT_PUBLIC_DRIP_COUNT;
  if (envCount && !isNaN(Number(envCount))) {
    return Math.min(Number(envCount), ROUTE3_MAX_CITIES);
  }
  const launchStr = LAUNCH_DATE || process.env.NEXT_PUBLIC_LAUNCH_DATE || new Date().toISOString().split("T")[0];
  const launch = new Date(launchStr).getTime();
  const now = Date.now();
  const daysElapsed = Math.max(0, Math.floor((now - launch) / (1000 * 60 * 60 * 24)));

  // Day 1: 12 Wave-1 cities (12 * 3 = 36 landing pages + hubs = ~45-50 URLs)
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
  return POPULATION_SORTED_LOCATIONS.slice(0, count);
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
