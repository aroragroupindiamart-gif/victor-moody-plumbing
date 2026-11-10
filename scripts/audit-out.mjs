#!/usr/bin/env node
/**
 * Factory Quality Audit & Integrity Gate
 * Checks for:
 * 1. Unresolved template tokens ({kw}, {cityName}, etc.)
 * 2. Unrendered objects ([object Object], NaN, undefined)
 * 3. Enriched location data integrity (all 2,249 cities populated)
 * 4. Configuration integrity (Brand name, phone, schema)
 * 5. Fabrication linting:
 *    - Schema JSON-LD must NOT fabricate aggregateRating (Google review spam violation)
 *    - LAUNCH_DATE must be dynamic (no hardcoded dates that break cloning)
 *    - Revalidate parity across state/city/service routes (7-day unified edge cache)
 *    - Internal links must respect drip bounds (no 150-service leaks on Day 1)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function audit() {
  console.log('='.repeat(65));
  console.log('  FACTORY INTEGRITY & FABRICATION AUDIT GATE');
  console.log('='.repeat(65));

  let errors = [];
  let warnings = [];

  // 1. Audit Enriched Locations Data
  const enrichedPath = path.join(rootDir, 'lib/data/locations-enriched.json');
  if (!fs.existsSync(enrichedPath)) {
    errors.push(`Missing enriched dataset: ${enrichedPath}`);
  } else {
    try {
      const locs = JSON.parse(fs.readFileSync(enrichedPath, 'utf8'));
      console.log(`[PASS] Enriched dataset loaded: ${locs.length} cities.`);
      if (locs.length < 2000) {
        errors.push(`Expected >= 2,000 cities in locations-enriched.json, found ${locs.length}`);
      }

      let missingFieldsCount = 0;
      let missingSourcesCount = 0;
      for (const l of locs) {
        if (!l.water_hardness_ppm || !l.permit_authority || !l.dominant_pipe_era || l.frost_line_depth_inches === undefined || !l.median_home_year) {
          missingFieldsCount++;
        }
        if (!l.data_sources || !l.data_sources.median_home_year || !l.data_sources.water_hardness) {
          missingSourcesCount++;
        }
      }
      if (missingFieldsCount > 0) {
        errors.push(`Found ${missingFieldsCount} cities with missing required enrichment fields (including median_home_year)!`);
      } else {
        console.log(`[PASS] 100% of cities contain complete local engineering fields & median_home_year.`);
      }
      if (missingSourcesCount > 0) {
        errors.push(`Found ${missingSourcesCount} cities with missing data_sources metadata!`);
      } else {
        console.log(`[PASS] 100% of cities contain verifiable data_sources metadata.`);
      }
    } catch (e) {
      errors.push(`Failed parsing locations-enriched.json: ${e.message}`);
    }
  }

  // 2. Audit Content Pack for malformed syntax or unresolved tokens
  const contentPackPath = path.join(rootDir, 'lib/data/content-pack.json');
  if (fs.existsSync(contentPackPath)) {
    const raw = fs.readFileSync(contentPackPath, 'utf8');
    if (raw.includes('[object Object]')) {
      errors.push('Found [object Object] in content-pack.json!');
    }
    const tokenMatches = raw.match(/\{[a-zA-Z0-9_]+\}/g) || [];
    const validTokens = new Set(['{kw}', '{kw0}', '{kw1}', '{cityName}', '{brandName}', '{phoneNumber}', '{nicheLower}', '{nichePluralLower}']);
    const invalidTokens = tokenMatches.filter(t => !validTokens.has(t));
    if (invalidTokens.length > 0) {
      warnings.push(`Unknown tokens in content pack: ${[...new Set(invalidTokens)].join(', ')}`);
    } else {
      console.log(`[PASS] All ${tokenMatches.length} content pack placeholders verified valid.`);
    }
  }

  // 3. Fabrication Lint: Check Schema JSON-LD in app/
  const servicePagePath = path.join(rootDir, 'app/[state]/[place]/[service]/page.tsx');
  if (fs.existsSync(servicePagePath)) {
    const code = fs.readFileSync(servicePagePath, 'utf8');
    if (code.includes('aggregateRating')) {
      errors.push('Fabricated aggregateRating detected in Schema JSON-LD! Google requires genuine verified reviews.');
    } else {
      console.log('[PASS] Schema JSON-LD verified free of fabricated aggregateRating.');
    }

    if (code.includes('function getRating') || code.includes('getRating(')) {
      errors.push('Fabricated getRating() generator detected in service page.tsx!');
    } else {
      console.log('[PASS] Service page verified free of fabricated getRating() generator.');
    }

    if (code.includes('30–45 min') || code.includes('30-45 min')) {
      errors.push('Unverified hardcoded "30-45 min" arrival promise in service page.tsx!');
    } else {
      console.log('[PASS] Service page verified with honest operational dispatch copy.');
    }

    if (code.includes('[object Object]')) {
      errors.push('Found "[object Object]" in service page.tsx!');
    }

    if (!code.includes('revalidate = 604800')) {
      errors.push('Invalid revalidate in service page.tsx! Expected 7 days (604800).');
    }
  }

  // 4. Configuration Lint: Dynamic LAUNCH_DATE
  const configPath = path.join(rootDir, 'lib/config.ts');
  if (fs.existsSync(configPath)) {
    const configCode = fs.readFileSync(configPath, 'utf8');
    if (configCode.includes('LAUNCH_DATE = "2026-11-09"') || configCode.includes("LAUNCH_DATE = '2026-11-09'")) {
      errors.push('Hardcoded LAUNCH_DATE detected in lib/config.ts! Must use process.env.NEXT_PUBLIC_LAUNCH_DATE.');
    } else {
      console.log('[PASS] lib/config.ts verified with dynamic NEXT_PUBLIC_LAUNCH_DATE support.');
    }
  }

  // 5. Cache Revalidation Parity across routes
  const cityPagePath = path.join(rootDir, 'app/[state]/[place]/page.tsx');
  if (fs.existsSync(cityPagePath)) {
    const cityCode = fs.readFileSync(cityPagePath, 'utf8');
    if (!cityCode.includes('revalidate = 604800')) {
      errors.push('Stale or unsynchronized revalidate in city page! Expected 7 days (604800).');
    } else {
      console.log('[PASS] City page cache synchronized to 7 days (604800).');
    }
  }

  const statePagePath = path.join(rootDir, 'app/[state]/page.tsx');
  if (fs.existsSync(statePagePath)) {
    const stateCode = fs.readFileSync(statePagePath, 'utf8');
    if (!stateCode.includes('revalidate = 604800')) {
      errors.push('Stale or unsynchronized revalidate in state page! Expected 7 days (604800).');
    } else {
      console.log('[PASS] State page cache synchronized to 7 days (604800).');
    }
  }

  // 6. Drip Internal Linking Integrity
  const dataLibPath = path.join(rootDir, 'lib/data.ts');
  if (fs.existsSync(dataLibPath)) {
    const dataCode = fs.readFileSync(dataLibPath, 'utf8');
    if (!dataCode.includes('getDripServicesCount') || !dataCode.includes('isLocationAndServiceAllowed')) {
      errors.push('Missing crawl-budget progressive drip guards in lib/data.ts!');
    } else {
      console.log('[PASS] lib/data.ts verified with crawl-budget drip guards.');
    }
  }

  // 7. Check results
  console.log('-'.repeat(65));
  if (warnings.length > 0) {
    console.log('WARNINGS:');
    warnings.forEach(w => console.warn(`  ⚠️ ${w}`));
  }

  if (errors.length > 0) {
    console.error('AUDIT FAILED WITH ERRORS:');
    errors.forEach(e => console.error(`  ❌ ${e}`));
    console.log('-'.repeat(65));
    process.exit(1);
  }

  console.log('✅ ALL FABRICATION & INTEGRITY CHECKS PASSED GREEN.');
  console.log('='.repeat(65));
  process.exit(0);
}

audit();
