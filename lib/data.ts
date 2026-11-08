import locationsRaw from "./data/locations-enriched.json";
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
  water_hardness_ppm: number;
  water_hardness_desc: string;
  median_home_age: number;
  pct_pre_1975_homes: number;
  dominant_pipe_era: string;
  frost_line_depth_inches: number;
  climate_zone: string;
  municipal_psi_standard: string;
  water_district_name: string;
  permit_authority: string;
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
const locationBySlugOnly = new Map<string, Location>();
const serviceBySlug = new Map<string, Service>();

for (const loc of ALL_LOCATIONS) {
  locationByKey.set(`${loc.state_code}|${loc.place_slug}`, loc);
  locationById.set(loc.id, loc);
  if (!locationBySlugOnly.has(loc.place_slug)) {
    locationBySlugOnly.set(loc.place_slug, loc);
  }
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
  return ALL_SERVICES;
}

export async function getStates(): Promise<StateRow[]> {
  const map = new Map<string, StateRow>();
  for (const loc of ALL_LOCATIONS) {
    const pages = ALL_SERVICES.length;
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
  const topMetros = POPULATION_SORTED_LOCATIONS.filter((l) => l.population >= 100000);
  if (topMetros.length === 0) return ALL_LOCATIONS.slice(0, count);

  const maxOffset = Math.max(1, topMetros.length - count);
  const offset = Math.abs(salt * 7) % maxOffset;
  return topMetros.slice(offset, offset + count);
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

export function getLocationBySlugOnly(placeSlug: string): Location | null {
  return locationBySlugOnly.get(placeSlug.toLowerCase()) ?? null;
}

export async function getLocationById(id: number): Promise<Location | null> {
  return locationById.get(id) ?? null;
}

export async function getService(serviceSlug: string): Promise<Service | null> {
  return serviceBySlug.get(serviceSlug) ?? null;
}

export async function getServicesByLocationTier(_tier: number): Promise<Service[]> {
  return ALL_SERVICES;
}

export async function getServicesByLocation(locationId: number): Promise<Service[]> {
  const loc = locationById.get(locationId);
  if (!loc) return [];
  return ALL_SERVICES;
}

export async function isServiceAllowedForTier(_serviceId: number, _locationTier: number): Promise<boolean> {
  return true;
}

export async function getSiblingServices(locationId: number, serviceId: number, limit = 5): Promise<Service[]> {
  const loc = locationById.get(locationId);
  if (!loc) return [];
  const pool = ALL_SERVICES.filter((s) => s.id !== serviceId);
  return pool
    .slice()
    .sort((a, b) => shuffleKey(a.id, locationId) - shuffleKey(b.id, locationId))
    .slice(0, limit);
}

export async function getNearbyLocations(locationId: number, stateCode: string, limit = 3): Promise<Location[]> {
  return ALL_LOCATIONS.filter(
    (l) => l.state_code === stateCode && l.id !== locationId
  )
    .sort((a, b) => b.population - a.population)
    .slice(0, limit);
}

/* ================================================================
 * 16-WEEK PROGRESSIVE CRAWL-BUDGET DRIP ENGINE
 * Prevents queue clogging & algorithmic suppression by matching
 * natural domain authority growth over 112 days (16 weeks).
 * ================================================================ */

export function getDaysElapsed(): number {
  const launchStr = LAUNCH_DATE || process.env.NEXT_PUBLIC_LAUNCH_DATE || new Date().toISOString().split("T")[0];
  const launch = new Date(launchStr).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - launch) / (1000 * 60 * 60 * 24)));
}

/**
 * 16-Week Progressive Metro Growth:
 * - Weeks 1-2   (Days 0-14)  : Top 100 Metros
 * - Weeks 3-4   (Days 15-28) : Top 250 Cities
 * - Weeks 5-6   (Days 29-42) : Top 500 Cities
 * - Weeks 7-8   (Days 43-56) : Top 800 Cities
 * - Weeks 9-10  (Days 57-70) : Top 1,200 Cities
 * - Weeks 11-12 (Days 71-84) : Top 1,600 Cities
 * - Weeks 13-14 (Days 85-98) : Top 2,000 Cities
 * - Weeks 15-16+ (Days 99+)  : All 2,249 Cities
 */
export function getDripLocationsCount(days = getDaysElapsed()): number {
  const envCount = process.env.NEXT_PUBLIC_DRIP_COUNT;
  if (envCount && !isNaN(Number(envCount))) {
    return Math.min(Number(envCount), POPULATION_SORTED_LOCATIONS.length);
  }

  if (days < 14) {
    return Math.min(60 + Math.floor(days * 3), 100);
  }
  if (days < 28) {
    return Math.min(100 + Math.floor((days - 14) * 11), 250);
  }
  if (days < 42) {
    return Math.min(250 + Math.floor((days - 28) * 18), 500);
  }
  if (days < 56) {
    return Math.min(500 + Math.floor((days - 42) * 21), 800);
  }
  if (days < 70) {
    return Math.min(800 + Math.floor((days - 56) * 29), 1200);
  }
  if (days < 84) {
    return Math.min(1200 + Math.floor((days - 70) * 29), 1600);
  }
  if (days < 98) {
    return Math.min(1600 + Math.floor((days - 84) * 29), 2000);
  }
  if (days < 112) {
    return Math.min(2000 + Math.floor((days - 98) * 18), POPULATION_SORTED_LOCATIONS.length);
  }

  return POPULATION_SORTED_LOCATIONS.length;
}

/**
 * 16-Week Progressive Service Expansion:
 * - Weeks 1-2   (Days 0-14)  : Core 10 High-Intent Emergency Services
 * - Weeks 3-4   (Days 15-28) : Top 15 Services
 * - Weeks 5-6   (Days 29-42) : Top 25 Services
 * - Weeks 7-8   (Days 43-56) : Top 35 Services
 * - Weeks 9-10  (Days 57-70) : Top 50 Services
 * - Weeks 11-12 (Days 71-84) : Top 75 Services
 * - Weeks 13-14 (Days 85-98) : Top 100 Services
 * - Weeks 15-16 (Days 99-112): Top 125 Services
 * - Day 112+ (Week 16+)      : All 150 Services (Full Inventory)
 */
export function getDripServicesCount(days = getDaysElapsed()): number {
  if (days < 14) return 10;
  if (days < 28) return 15;
  if (days < 42) return 25;
  if (days < 56) return 35;
  if (days < 70) return 50;
  if (days < 84) return 75;
  if (days < 98) return 100;
  if (days < 112) return 125;
  return ALL_SERVICES.length;
}

export async function getDripLocations(): Promise<Location[]> {
  const count = getDripLocationsCount();
  return POPULATION_SORTED_LOCATIONS.slice(0, count);
}

export async function getDripServices(): Promise<Service[]> {
  const count = getDripServicesCount();
  return ALL_SERVICES.slice(0, count);
}

export async function isLocationAllowed(stateCode: string, placeSlug: string): Promise<boolean> {
  const loc = await getLocation(stateCode, placeSlug);
  return loc !== null;
}

export async function getDripLocationsByState(stateCode: string): Promise<Location[]> {
  const dripLocs = await getDripLocations();
  return dripLocs.filter((l) => l.state_code === stateCode);
}

export async function isLocationAndServiceAllowed(stateCode: string, placeSlug: string, serviceSlug: string): Promise<boolean> {
  const [loc, svc] = await Promise.all([getLocation(stateCode, placeSlug), getService(serviceSlug)]);
  return loc !== null && svc !== null;
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
