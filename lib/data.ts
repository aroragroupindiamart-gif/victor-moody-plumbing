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
    a.state_name.localeCompare(b.state_name)
  );
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

export function getDripCount(totalStatesCount: number): number {
  const envCount = process.env.NEXT_PUBLIC_DRIP_COUNT;
  if (envCount && !isNaN(Number(envCount))) {
    return Math.min(Number(envCount), totalStatesCount);
  }
  const launchStr = LAUNCH_DATE || process.env.NEXT_PUBLIC_LAUNCH_DATE;
  if (!launchStr) return totalStatesCount;

  const launch = new Date(launchStr).getTime();
  const now = Date.now();
  const daysElapsed = Math.max(0, Math.floor((now - launch) / (1000 * 60 * 60 * 24)));

  if (daysElapsed < 7) return Math.min(3, totalStatesCount);   // Week 1: 3 states (~8k-10k pages)
  if (daysElapsed < 14) return Math.min(10, totalStatesCount); // Week 2: 10 states (~35k pages)
  if (daysElapsed < 21) return Math.min(25, totalStatesCount); // Week 3: 25 states (~85k pages)
  return totalStatesCount;                                     // Week 4+: All 50 states (200k pages)
}

export async function getDripStates(): Promise<StateRow[]> {
  const allStates = await getStates();
  const count = getDripCount(allStates.length);
  return allStates.slice(0, count);
}
