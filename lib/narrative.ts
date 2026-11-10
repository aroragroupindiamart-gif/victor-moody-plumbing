import type { Location, Service } from "./data";

export type EnrichedLocation = Location;
export type ServiceItem = Service;

export function generateLocalNarratives(loc: EnrichedLocation, svc: ServiceItem) {
  const isHeater = svc.service_slug.includes("heater") || svc.base_keywords.some(k => k.includes("water heater"));
  const isDrain = svc.service_slug.includes("drain") || svc.service_slug.includes("sewer") || svc.service_slug.includes("clog");
  const isToilet = svc.service_slug.includes("toilet");
  const isPipe = svc.service_slug.includes("pipe") || svc.service_slug.includes("leak") || svc.service_slug.includes("burst");

  const homeYear = loc.median_home_year || loc.median_home_age;
  const utilityName = loc.water_district_verified && loc.water_district_name
    ? loc.water_district_name
    : `municipal water utility serving ${loc.place_name}`;
  const permitOffice = loc.permit_authority || `${loc.place_name} Building and Safety Department`;

  // 1. Water Quality & Mineral Dynamics Block (Each sentence is locally anchored)
  let waterDynamics = "";
  if (loc.water_hardness_ppm >= 180) {
    waterDynamics = `Municipal water delivered across ${loc.place_name} registers at an elevated ${loc.water_hardness_ppm} PPM (${loc.water_hardness_desc}). In residential ${svc.service_name.toLowerCase()} applications throughout ${loc.place_name}, this high concentration of dissolved calcium carbonate and magnesium significantly accelerates scale build-up inside ${isToilet ? "fill valve seals and tank components" : isDrain ? "drain traps and waste lines" : "heat exchangers and internal valve seats"}. Without routine maintenance or whole-home filtration in ${loc.county_name} County, mineral sedimentation hardens at the base of equipment, dropping operational efficiency and causing premature fixture degradation.`;
  } else if (loc.water_hardness_ppm >= 100) {
    waterDynamics = `Water testing across ${loc.place_name} indicates an average mineral content of ${loc.water_hardness_ppm} PPM (${loc.water_hardness_desc}). While within safe municipal parameters, this moderate mineral level leaves noticeable white chalky scale around ${loc.place_name} faucet cartridges, shower diverters, and ${isToilet ? "toilet fill valves" : isDrain ? "waste interceptors" : "heating elements"}. Over a 3- to 5-year operational lifecycle in ${loc.place_name}, progressive calcification can constrict interior flow capacity and cause intermittent pressure fluctuations across fixtures.`;
  } else {
    waterDynamics = `Water delivered across ${loc.place_name} tests at ${loc.water_hardness_ppm} PPM, categorized as ${loc.water_hardness_desc} water. While naturally soft water prevents calcium scaling inside ${loc.place_name} pipes and fixtures, its low mineral index increases the natural corrosiveness of standing water against legacy copper and brass fittings. In older properties throughout ${loc.place_name}, our specialists carefully inspect fixture connections for pinhole oxidation and galvanic corrosion caused by acidic municipal pH balances.`;
  }

  // 2. Housing Construction Era & Infrastructure Diagnostic (Locally anchored)
  let housingDiagnostic = "";
  if (loc.pct_pre_1975_homes >= 50) {
    housingDiagnostic = `Approximately ${loc.pct_pre_1975_homes}% of residential properties in ${loc.place_name} date back to the pre-1975 building boom, with a median construction year of ${homeYear}. Homes from this period across ${loc.place_name} were predominantly plumbed with ${loc.dominant_pipe_era.replace(/_/g, " ")}. Today, these legacy ${loc.place_name} systems frequently present ${isDrain ? "brittle cast-iron underground sewer laterals vulnerable to shifting soils and tree root intrusions" : isToilet ? "corroded closet flanges and undersized 3-inch drain stacks" : "internal rust buildup that restricts flow volume and failing galvanized nipples at wall transitions"}.`;
  } else if (loc.pct_pre_1975_homes >= 25) {
    housingDiagnostic = `With a median residential construction year of ${homeYear}, neighborhoods across ${loc.place_name} feature a mixture of mid-century architectural additions and modern developments. Properties constructed between 1975 and 1995 in ${loc.county_name} County typically utilize copper distribution lines paired with PVC or ABS drainage stacks. When addressing ${svc.service_name.toLowerCase()} in ${loc.place_name}, our technicians evaluate ${isDrain ? "drain slope gradients and camera-inspect main sewer branches" : isToilet ? "wax ring seals and water consumption efficiency" : "solder-joint integrity and atmospheric venting across branch circuits"}.`;
  } else {
    housingDiagnostic = `Featuring newer residential developments with a median construction year of ${homeYear}, ${loc.place_name} homes predominantly incorporate modern PEX supply piping and engineered composite manifold systems. While modern PEX eliminates traditional metal corrosion in ${loc.place_name}, these systems remain sensitive to ${isDrain ? "improper secondary stack venting and pipe sagging" : isToilet ? "excessive municipal supply surges past standard 60 PSI" : "excessive municipal pressure surges and improper crimp-ring tensions"}. Our ${loc.place_name} diagnostic process includes calibrated pressure testing to verify lines remain within optimal operating limits.`;
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
  let inspectionReq = `Standard trade compliance under ${loc.place_name} administrative building code.`;
  if (isHeater || isPipe) {
    inspectionReq = `Mandatory ${loc.place_name} municipal sign-off on pressure vessels and main line alterations.`;
  } else if (isDrain) {
    inspectionReq = `Municipal health and backflow compliance certification for main sewer laterals and trap seals in ${loc.place_name}.`;
  } else if (isToilet) {
    inspectionReq = `WaterSense high-efficiency certification and backflow prevention under ${loc.place_name} municipal standards.`;
  }

  const complianceSpecs = {
    utilityDistrict: utilityName,
    hardnessRating: `${loc.water_hardness_ppm} PPM (${loc.water_hardness_desc})`,
    psiStandard: loc.municipal_psi_standard,
    permitDepartment: permitOffice,
    inspectionRequirement: inspectionReq
  };

  return {
    waterDynamics,
    housingDiagnostic,
    climateProtocol,
    complianceSpecs
  };
}
