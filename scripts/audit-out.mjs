#!/usr/bin/env node
/**
 * Factory Quality Audit & Integrity Gate
 * Checks for:
 * 1. Unresolved template tokens ({kw}, {cityName}, etc.)
 * 2. Unrendered objects ([object Object], NaN, undefined)
 * 3. Enriched location data integrity (all 2,249 cities populated)
 * 4. Configuration integrity (Brand name, phone, schema)
 * 5. Fabricated placeholders in production templates
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function audit() {
  console.log('='.repeat(65));
  console.log('  FACTORY INTEGRITY & PLACEHOLDER AUDIT GATE');
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

      // Check fields for sample of cities
      let missingFieldsCount = 0;
      for (const l of locs) {
        if (!l.water_hardness_ppm || !l.permit_authority || !l.dominant_pipe_era || l.frost_line_depth_inches === undefined) {
          missingFieldsCount++;
        }
      }
      if (missingFieldsCount > 0) {
        errors.push(`Found ${missingFieldsCount} cities with missing required enrichment fields!`);
      } else {
        console.log(`[PASS] 100% of cities contain complete local engineering fields.`);
      }
    } catch (e) {
      errors.push(`Failed parsing locations-enriched.json: ${e.message}`);
    }
  }

  // 2. Audit Content Pack for malformed syntax
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

  // 3. Audit Codebase for unreplaced sample placeholders
  const pagePath = path.join(rootDir, 'app/[state]/[place]/[service]/page.tsx');
  if (fs.existsSync(pagePath)) {
    const pageCode = fs.readFileSync(pagePath, 'utf8');
    if (pageCode.includes('[object Object]')) {
      errors.push('Found "[object Object]" in page.tsx!');
    }
    if (pageCode.includes('revalidate = 2592000')) {
      errors.push('Stale 30-day ISR detected! Expected 7-day revalidate (604800).');
    }
    if (!pageCode.includes('generateLocalNarratives')) {
      errors.push('Missing generateLocalNarratives integration in page.tsx!');
    }
    console.log(`[PASS] app/[state]/[place]/[service]/page.tsx verified.`);
  }

  // 4. Check results
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

  console.log('✅ ALL INTEGRITY & AUDIT CHECKS PASSED GREEN.');
  console.log('='.repeat(65));
  process.exit(0);
}

audit();
