import type { Location, Service } from "./data";

export type EnrichedLocation = Location;
export type ServiceItem = Service;

export function generateLocalNarratives(loc: EnrichedLocation, svc: ServiceItem) {
  const isHeater = svc.service_slug.includes("heater") || svc.base_keywords.some(k => k.includes("water heater"));
  const isDrain = svc.service_slug.includes("drain") || svc.service_slug.includes("sewer") || svc.service_slug.includes("clog");
  const isToilet = svc.service_slug.includes("toilet");
  const isPipe = svc.service_slug.includes("pipe") || svc.service_slug.includes("leak") || svc.service_slug.includes("burst");

  // 1. Water Quality & Mineral Dynamics Block (Each sentence is locally anchored)
  let waterDynamics = "";
  if (loc.water_hardness_ppm >= 180) {
    waterDynamics = `Municipal water delivered across ${loc.place_name} by the ${loc.water_district_name} registers at an elevated ${loc.water_hardness_ppm} PPM (${loc.water_hardness_desc}). In residential ${svc.service_name.toLowerCase()} applications throughout ${loc.place_name}, this high concentration of dissolved calcium carbonate and magnesium significantly accelerates scale build-up inside heat exchangers, internal valve seats, and fixture aerators. Without routine maintenance or whole-home filtration in ${loc.county_name} County, mineral sedimentation hardens at the base of equipment, dropping thermal transfer efficiency by up to 25% and causing early element burnout or premature pressure relief valve leaks.`;
  } else if (loc.water_hardness_ppm >= 100) {
    waterDynamics = `Water testing across ${loc.place_name} indicates an average mineral content of ${loc.water_hardness_ppm} PPM (${loc.water_hardness_desc}). While within safe municipal parameters, this moderate mineral level leaves noticeable white chalky scale around ${loc.place_name} faucet cartridges, shower diverters, and heating elements. Over a 3- to 5-year operational lifecycle in ${loc.place_name}, progressive calcification can constrict interior pipe diameter and cause intermittent pressure fluctuations across upper-level plumbing fixtures.`;
  } else {
    waterDynamics = `The ${loc.water_district_name} delivers water testing at ${loc.water_hardness_ppm} PPM, categorized as ${loc.water_hardness_desc} water. While naturally soft water prevents calcium scaling inside ${loc.place_name} pipes and fixtures, its low mineral index increases the natural corrosiveness of standing water against legacy copper and brass fittings. In older properties throughout ${loc.place_name}, our specialists carefully inspect fixture connections for pinhole oxidation and galvanic corrosion caused by acidic municipal pH balances.`;
  }

  // 2. Housing Construction Era & Infrastructure Diagnostic (Locally anchored)
  let housingDiagnostic = "";
  if (loc.pct_pre_1975_homes >= 50) {
    housingDiagnostic = `Approximately ${loc.pct_pre_1975_homes}% of residential properties in ${loc.place_name} date back to the pre-1975 building boom, with an average construction era around ${loc.median_home_age}. Homes from this period across ${loc.place_name} were predominantly plumbed with ${loc.dominant_pipe_era.replace(/_/g, " ")}. Today, these legacy ${loc.place_name} systems frequently present internal rust buildup that restricts flow volume, failing galvanized nipples at wall transitions, and brittle cast-iron underground sewer laterals vulnerable to shifting soils and tree root intrusions.`;
  } else if (loc.pct_pre_1975_homes >= 25) {
    housingDiagnostic = `With a median residential construction year of ${loc.median_home_age}, neighborhoods across ${loc.place_name} feature a mixture of mid-century architectural additions and modern developments. Properties constructed between 1975 and 1995 in ${loc.county_name} County typically utilize copper distribution lines paired with PVC or ABS drainage stacks. When addressing ${svc.service_name.toLowerCase()} in ${loc.place_name}, our technicians evaluate solder-joint integrity, check for undersized water supply lines, and confirm proper atmospheric venting across secondary branch circuits.`;
  } else {
    housingDiagnostic = `Featuring newer residential developments with a median construction year of ${loc.median_home_age}, ${loc.place_name} homes predominantly incorporate modern PEX supply piping and engineered composite manifold systems. While modern PEX eliminates traditional metal corrosion and pinhole risks in ${loc.place_name}, these systems remain sensitive to excessive municipal pressure surges and improper crimp-ring tensions. Our ${loc.place_name} diagnostic process includes calibrated hydrostatic testing to verify lines remain within optimal operating limits.`;
  }

  // 3. Climate, Soil & Freeze Protocol (Locally anchored)
  let climateProtocol = "";
  if (loc.frost_line_depth_inches >= 30) {
    climateProtocol = `Due to ${loc.place_name}'s ${loc.climate_zone} climate and a regional frost line reaching ${loc.frost_line_depth_inches} inches deep, local plumbing codes mandate strict thermal freeze protection. Winter sub-freezing cold snaps in ${loc.place_name} pose an immediate hazard to uninsulated exterior hose bibbs, crawlspace water lines, and unheated garage supply loops. Rapid ice expansion inside uninsulated lines in ${loc.county_name} County creates hydrostatic pressure spikes exceeding 2,000 PSI, frequently resulting in catastrophic wall bursts upon thawing.`;
  } else if (loc.frost_line_depth_inches >= 10) {
    climateProtocol = `Operating in a ${loc.climate_zone} climate with a typical ${loc.frost_line_depth_inches}-inch frost depth, ${loc.place_name} experiences episodic winter freezes alongside humid summer moisture. Rapid seasonal temperature swings across ${loc.place_name} cause continuous thermal expansion and contraction across exterior plumbing runs. We ensure all ${loc.place_name} external supply fixtures feature frost-proof vacuum breakers and closed-cell pipe insulation to withstand sudden seasonal cold fronts.`;
  } else {
    climateProtocol = `In ${loc.place_name}'s warm ${loc.climate_zone} climate with a minimal ${loc.frost_line_depth_inches}-inch frost requirement, underground infrastructure faces unique soil challenges rather than deep freezing. Regional soil expansion and contraction during dry summer months across ${loc.place_name} put shearing stress on subterranean sewer laterals and slab-penetration water lines. In addition, intense ambient heat in ${loc.county_name} County accelerates UV degradation of outdoor shutoff valves and solar-exposed piping.`;
  }

  // 4. Municipal Compliance & Permitting Box
  const complianceSpecs = {
    utilityDistrict: loc.water_district_name,
    hardnessRating: `${loc.water_hardness_ppm} PPM (${loc.water_hardness_desc})`,
    psiStandard: loc.municipal_psi_standard,
    permitDepartment: loc.permit_authority,
    inspectionRequirement: isHeater || isPipe ? `Mandatory ${loc.place_name} municipal sign-off on pressure vessels and main line alterations` : `Standard trade compliance under ${loc.place_name} administrative building code`
  };

  return {
    waterDynamics,
    housingDiagnostic,
    climateProtocol,
    complianceSpecs
  };
}
