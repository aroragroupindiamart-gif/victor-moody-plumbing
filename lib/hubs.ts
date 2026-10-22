export interface AuthorityHub {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: "water-pressure" | "backflow" | "repipe" | "cost-guide";
  badge: string;
  summary: string;
  diagnosticTree: {
    question: string;
    scenarioA: { condition: string; diagnosis: string; action: string };
    scenarioB: { condition: string; diagnosis: string; action: string };
  };
  keyCodesAndStandards: string[];
  symptoms: string[];
  technicalOverview: string;
  faqs: { q: string; a: string }[];
}

export const AUTHORITY_HUBS: AuthorityHub[] = [
  {
    slug: "low-water-pressure",
    title: "Low Water Pressure Diagnostics & Troubleshooting Guide",
    metaTitle: "Low Water Pressure Diagnostics & Repair Guide | 24/7 Specialist Network",
    metaDescription: "Comprehensive diagnostic tree for sudden or gradual low water pressure. Troubleshoot PRVs, municipal supply lines, and fixture restrictions.",
    category: "water-pressure",
    badge: "Diagnostic Protocol",
    summary: "Low water pressure can originate from isolated fixture clogging, a malfunctioning pressure reducing valve (PRV), or municipal distribution anomalies. Use this diagnostic tree to identify your pressure failure mode before calling for certified technician dispatch.",
    diagnosticTree: {
      question: "Is low pressure isolated to one fixture or across the entire property?",
      scenarioA: {
        condition: "Single Fixture (Faucet, Showerhead, or Hose Bib)",
        diagnosis: "Aerator sediment calcification, clogged cartridge screen, or localized supply line kink.",
        action: "Clean aerator screen and inspect angle stop valve. If pressure remains restricted, cartridge replacement is indicated."
      },
      scenarioB: {
        condition: "Whole Property (All fixtures, hot and cold lines simultaneously)",
        diagnosis: "Failed Pressure Reducing Valve (PRV), municipal gate valve throttling, or hidden main supply line rupture.",
        action: "Check the outdoor PRV bell housing for corrosion and verify street curb stop is fully open. Contact a licensed diagnostic technician immediately."
      }
    },
    keyCodesAndStandards: [
      "Uniform Plumbing Code (UPC) Section 608.2: Pressure Regulation",
      "International Plumbing Code (IPC) Section 604.8: Water-Pressure Reducing Valves",
      "AWWA Standard C511: Reduced Pressure Principle Backflow & Pressure Assemblies"
    ],
    symptoms: [
      "Trickling showerheads when laundry or irrigation cycles activate",
      "Gradual pressure degradation over months indicating heavy mineral scale inside aging pipes",
      "Sudden, overnight pressure drop suggesting PRV diaphragm rupture or municipal utility main repairs",
      "Air sputtering or cloudy water accompanying low flow"
    ],
    technicalOverview: "Residential water distribution requires balanced hydrostatic head pressure between 45 and 65 PSI. When pressure drops below 40 PSI, standard appliances, tankless water heaters, and modern multi-head showers fail to operate effectively. Certified diagnostic testing isolates upstream utility delivery from downstream distribution restrictions.",
    faqs: [
      {
        q: "Why did my water pressure suddenly drop overnight?",
        a: "A sudden drop across all fixtures usually points to either a ruptured diaphragm inside your Pressure Reducing Valve (PRV), an emergency municipal water main shutdown, or a major subterranean pipe rupture on your private supply line."
      },
      {
        q: "Can mineral scale cause low water pressure in Arizona and California homes?",
        a: "Yes. High mineral hardness (12–22 GPG) across Southwestern municipal supplies causes calcium carbonate scale to accumulate inside galvanized steel and copper piping, choking water flow over time."
      },
      {
        q: "What should I tell the dispatch coordinator when I call?",
        a: "Specify whether the pressure drop affects one fixture or the whole house, whether hot and cold water are equally affected, your approximate home construction year, and your exact local ZIP code."
      }
    ]
  },
  {
    slug: "high-water-pressure-pressure-reducing-valve",
    title: "High Water Pressure Hazards & Pressure Reducing Valve (PRV) Guide",
    metaTitle: "High Water Pressure Hazards & PRV Replacement Guide",
    metaDescription: "Understand the risks of excessive water pressure exceeding 80 PSI. Learn failed PRV symptoms, water hammer hazards, and valve replacement protocols.",
    category: "water-pressure",
    badge: "Safety & Code Compliance",
    summary: "Water pressure exceeding 80 PSI voids appliance warranties, destroys washing machine solenoids, and triggers sudden pipe ruptures. Discover how Pressure Reducing Valves protect your residential plumbing network.",
    diagnosticTree: {
      question: "Are pipes banging during shutoff, or is water hissing through toilet valves?",
      scenarioA: {
        condition: "Banging / Shuddering Pipes (Water Hammer)",
        diagnosis: "Excessive velocity and pressure wave reflection caused by main pressure above 75–80 PSI.",
        action: "Test static pressure with a hose-bib gauge. If static pressure exceeds 80 PSI, calibrate or replace your PRV immediately."
      },
      scenarioB: {
        condition: "Weeping Temperature & Pressure (T&P) Relief Valve on Water Heater",
        diagnosis: "Thermal expansion combined with failed PRV check valve creating closed system over-pressurization.",
        action: "Inspect water heater expansion tank charge and replace the failed PRV to prevent water tank rupture."
      }
    },
    keyCodesAndStandards: [
      "UPC 608.2: Pressure Reducing Valves required where static pressure exceeds 80 PSI (552 kPa)",
      "ASSE 1003: Performance Requirements for Water Pressure Reducing Valves for Domestic Systems",
      "ASME A112.26.1M: Water Hammer Arresters Standard"
    ],
    symptoms: [
      "Water pressure gauge reading above 80 PSI at an outdoor hose bib",
      "Loud banging noises (water hammer) when faucets or dishwasher valves snap shut",
      "Toilet fill valves hissing or running intermittently without flapper leaks",
      "Premature appliance breakdowns (washing machine hoses, ice maker supply lines)"
    ],
    technicalOverview: "Municipal water mains often run at 90 to 140 PSI to ensure adequate firefighting capacity and hill delivery. Home plumbing systems are engineered for a maximum safe threshold of 80 PSI. A calibrated Pressure Reducing Valve (PRV) down-regulates municipal surges to a stable 50–65 PSI.",
    faqs: [
      {
        q: "What is considered dangerous water pressure for a home?",
        a: "Any static pressure exceeding 80 PSI is classified as hazardous by both the Uniform Plumbing Code (UPC) and International Plumbing Code (IPC), and will void most manufacturer warranties for dishwashers and water heaters."
      },
      {
        q: "How long does a Pressure Reducing Valve (PRV) typically last?",
        a: "In hard water environments (like Arizona and Southern California), PRV diaphragms and internal springs typically last 7 to 12 years before mineral crusting and rubber degradation cause pressure creep."
      },
      {
        q: "How can I tell if my PRV has failed?",
        a: "Common indicators include erratic water pressure, loud humming or vibrating sounds inside the walls when water runs, leaking from the PRV bell housing, and static pressure tests exceeding 80 PSI."
      }
    ]
  },
  {
    slug: "water-pressure-testing",
    title: "Residential Water Pressure Testing & Gauge Diagnostic Protocol",
    metaTitle: "Water Pressure Testing & Diagnostic Protocol | Certified Procedures",
    metaDescription: "Step-by-step residential water pressure testing procedures. Learn how to measure static vs dynamic pressure, diagnose surges, and interpret PSI readings.",
    category: "water-pressure",
    badge: "Testing Protocol",
    summary: "Accurate water pressure testing requires measuring static baseline PSI, dynamic operational draw, and overnight pressure surges. Follow our certified diagnostic protocol to benchmark your residential system.",
    diagnosticTree: {
      question: "Does your gauge reading spike overnight compared to daytime baseline?",
      scenarioA: {
        condition: "Static Pressure Increases by >15 PSI at Night",
        diagnosis: "Municipal distribution pressure surge during low neighborhood demand periods; failing PRV lock-up.",
        action: "Install a dual-stage PRV or thermal expansion control assembly to prevent midnight pipe ruptures."
      },
      scenarioB: {
        condition: "Pressure Drops by >25 PSI When a Second Faucet Opens",
        diagnosis: "Severe dynamic restriction (volume bottleneck) caused by pipe corrosion or undersized supply lines.",
        action: "Conduct comprehensive flow rate testing (GPM) across main service line and branch distribution manifolds."
      }
    },
    keyCodesAndStandards: [
      "ASME B40.100: Pressure Gauges and Gauge Attachments Standards",
      "UPC 604.0: Sizing of Water Supply Systems",
      "IAPMO IGC 154: Static and Dynamic Water Pressure Testing Protocols"
    ],
    symptoms: [
      "Inconsistent shower performance when secondary appliances operate",
      "Unexplained pinhole leaks appearing on copper or polybutylene pipes",
      "Visible vibrations on washing machine hoses during fill cycles",
      "Damp drywall near main water entry point"
    ],
    technicalOverview: "Static water pressure measures hydrostatic force with zero fixtures in use. Dynamic water pressure measures residual head while fixtures are active. A properly engineered residential system maintains 50–65 PSI static pressure with less than a 10–15 PSI drop during peak simultaneous fixture usage.",
    faqs: [
      {
        q: "Where should water pressure be tested on a house?",
        a: "Testing should be conducted at an unregulated outdoor hose bib directly downstream of the main shutoff valve and PRV, using a calibrated liquid-filled 0–160 PSI pressure gauge with a lazy-hand peak indicator."
      },
      {
        q: "What is the difference between water pressure and water volume?",
        a: "Water pressure (PSI) is the speed and push of water within the pipe. Water volume (GPM — Gallons Per Minute) is the physical amount of water passing through. Corroded pipes often show normal static pressure but suffer severe dynamic pressure drop due to constricted volume."
      },
      {
        q: "Why do municipal pressures spike in the early morning hours?",
        a: "Between 1:00 AM and 5:00 AM, residential demand is near zero across the city grid, causing municipal line pressures to peak. Without an effective PRV, this surge impacts your home's internal fittings."
      }
    ]
  },
  {
    slug: "backflow-testing",
    title: "Municipal Backflow Testing & Annual Certification Guide",
    metaTitle: "Annual Backflow Testing & Certification | ASSE-Certified Specialists",
    metaDescription: "Annual municipal backflow preventer inspection and testing guide. Learn cross-connection compliance, test procedures, and city notification handling.",
    category: "backflow",
    badge: "Mandatory Compliance",
    summary: "Annual backflow testing is mandated by municipal water departments and state health codes to prevent cross-contamination of public drinking water. Discover compliance deadlines, test protocols, and certification filing.",
    diagnosticTree: {
      question: "Did you receive an annual backflow testing compliance notice from your water utility?",
      scenarioA: {
        condition: "Notice Received with 30-Day Compliance Deadline",
        diagnosis: "Routine mandatory annual inspection required under Safe Drinking Water Act and local administrative codes.",
        action: "Schedule an ASSE 5110 certified backflow tester immediately. Test results must be submitted directly to the city portal."
      },
      scenarioB: {
        condition: "Backflow Device Relief Valve Spitting or Continuously Leaking",
        diagnosis: "Fouled check valve seat, debris lodged in first check spring, or failed relief valve diaphragm.",
        action: "Shut off upstream isolation valve and schedule emergency backflow repair. Never cap or plug the relief port."
      }
    },
    keyCodesAndStandards: [
      "Federal Safe Drinking Water Act (SDWA) Section 1414",
      "ASSE Standard 5110: Professional Qualifications for Backflow Prevention Assembly Testers",
      "USC Foundation for Cross-Connection Control and Hydraulic Research Specifications",
      "UPC Chapter 6 / CPC Section 603: Cross-Connection Control"
    ],
    symptoms: [
      "Official annual compliance letter or fine warning from municipal water district",
      "Water spitting or steady discharge from the differential pressure relief port",
      "Discolored or sulfur-scented water appearing after irrigation cycles",
      "Visible scale, rust, or mineral encrustation on test cocks and shutoff ball valves"
    ],
    technicalOverview: "Backflow occurs via back-siphonage (negative municipal supply pressure) or back-pressure (downstream pressure exceeding supply). Backflow preventers feature dual independent check valves and differential relief mechanisms that isolate hazardous cross-connections (irrigation systems, boilers, commercial lines) from municipal drinking water.",
    faqs: [
      {
        q: "Is annual backflow testing legally required?",
        a: "Yes. State health administrative codes and municipal water authorities legally require annual inspection and certified gauge testing for all commercial, industrial, multi-family, and residential backflow assemblies with dedicated irrigation meters."
      },
      {
        q: "What happens if a property fails to submit annual backflow certification?",
        a: "Municipal water authorities issue non-compliance notices followed by administrative fines. Continued failure results in termination of water service to the property to protect the municipal main."
      },
      {
        q: "Who is authorized to test a backflow preventer?",
        a: "Only technicians holding valid ASSE 5110 certification and registered with the local county environmental management department or municipal water utility are legally authorized to test and file reports."
      }
    ]
  },
  {
    slug: "backflow-preventer-repair-installation",
    title: "Backflow Preventer Device Installation, Rebuilding & Valve Repair",
    metaTitle: "Backflow Preventer Installation & Repair | RPZ, DCVA & PVB Assemblies",
    metaDescription: "Professional installation, rebuilding, and repair of backflow preventer assemblies (RPZ, DCVA, PVB). Learn freeze protection, repair kits, and code mandates.",
    category: "backflow",
    badge: "Hardware & Engineering",
    summary: "From high-hazard Reduced Pressure Zone (RPZ) devices to residential Pressure Vacuum Breakers (PVB), proper installation, freeze protection enclosures, and valve rebuilds ensure permanent cross-connection safety.",
    diagnosticTree: {
      question: "Which backflow assembly type is installed on your property?",
      scenarioA: {
        condition: "RPZ (Reduced Pressure Zone / ASSE 1013) Assembly",
        diagnosis: "High-hazard protection suitable for chemical injection, commercial boilers, and submerged irrigation heads.",
        action: "Requires 12\" minimum ground clearance and dedicated air gap drainage. Rebuild internal rubber kits if relief port leaks."
      },
      scenarioB: {
        condition: "PVB (Pressure Vacuum Breaker / ASSE 1020) Assembly",
        diagnosis: "Low-hazard irrigation protection operating strictly under continuous pressure without back-pressure risk.",
        action: "Must be installed at least 12\" above the highest downstream sprinkler head. Protect from winter freeze with insulated enclosures."
      }
    },
    keyCodesAndStandards: [
      "ASSE 1013: Reduced Pressure Principle Backflow Preventers",
      "ASSE 1020: Pressure Vacuum Breaker Assembly",
      "ASSE 1015: Double Check Backflow Prevention Assemblies",
      "ASSE 1060: Performance Requirements for Outdoor Enclosures for Backflow Assemblies"
    ],
    symptoms: [
      "Continuous water stream flowing from the air gap drain beneath the RPZ",
      "Cracked brass body or blown canopy bonnet following sub-freezing winter weather",
      "Failure to hold 1.0 PSI minimum differential during annual differential pressure gauge test",
      "Stuck or corroded shutoff ball valves that refuse to isolate during servicing"
    ],
    technicalOverview: "Backflow preventer assemblies contain elastomeric discs, stainless steel springs, and precision-machined bronze or stainless steel seats. When foreign debris or mineral scale lodges in check seats, the assembly fails to seal against back-siphonage. Factory OEM rebuild kits restore assemblies to full municipal compliance without complete replacement.",
    faqs: [
      {
        q: "Why does my RPZ backflow device keep dumping water?",
        a: "An RPZ relief valve discharges when the pressure differential between the supply and intermediate zone drops below 2.0 PSI. This is commonly caused by dirt or mineral scale lodged in the first check valve, or back-pressure from downstream equipment."
      },
      {
        q: "How do I protect my outdoor backflow preventer from winter freezing?",
        a: "Assemblies installed above ground must be protected with ASSE 1060 insulated enclosures and self-regulating heat trace tape, or winterized by draining internal water prior to freezing temperatures."
      },
      {
        q: "Can a leaking backflow preventer be repaired or must it be replaced?",
        a: "Over 85% of backflow failures can be repaired on-site using manufacturer OEM rebuild kits containing new rubber diaphragms, check discs, and springs, saving substantial replacement costs."
      }
    ]
  },
  {
    slug: "whole-house-repipe",
    title: "Whole-House Repiping Guide: PEX-A vs Copper Repiping Comparison",
    metaTitle: "Whole-House Repipe Guide: PEX-A vs Copper Repiping Analysis",
    metaDescription: "Comprehensive whole-home repiping guide. Compare PEX-A expansion piping vs Copper Type L, review timelines, permit requirements, and disruption factors.",
    category: "repipe",
    badge: "Structural Infrastructure",
    summary: "Recurring slab leaks, discolored water, and low flow signify total pipe failure. Compare modern PEX-A expansion tubing against Type L Copper, review installation timelines, and understand the full repiping workflow.",
    diagnosticTree: {
      question: "Are your existing supply lines galvanized steel, polybutylene, or leaking copper in concrete slab?",
      scenarioA: {
        condition: "Galvanized Steel or Polybutylene Throughout Property",
        diagnosis: "Systemic end-of-life pipe degradation with imminent micro-fracture or internal occlusion risk.",
        action: "Schedule a complete non-invasive overhead PEX-A repipe. Spot repairs are ineffective on deteriorated pipe stock."
      },
      scenarioB: {
        condition: "Multiple Pinhole Leaks in Slab Foundation (Slab Leaks)",
        diagnosis: "Electrolytic soil corrosion or water chemistry pitting of buried copper lines.",
        action: "Bypass under-slab lines via ceiling and attic PEX-A routing, eliminating foundation jackhammering and future slab leaks."
      }
    },
    keyCodesAndStandards: [
      "ASTM F876/F877: Standard Specification for Crosslinked Polyethylene (PEX) Tubing",
      "ASTM B88: Standard Specification for Seamless Copper Water Tube (Type L & K)",
      "NSF/ANSI 61 & 14: Drinking Water System Components & Health Effects",
      "UPC Chapter 6 / IPC Section 605: Water Supply System Materials"
    ],
    symptoms: [
      "Multiple recurring pinhole leaks within 12–24 months",
      "Rust-colored, yellow, or murky water appearing when faucets run after hours of non-use",
      "Unexplained spike in monthly water utility bills indicating under-slab piping rupture",
      "Warm spots on concrete slab flooring or sound of rushing water beneath walls"
    ],
    technicalOverview: "Whole-home repiping replaces failing supply lines with continuous, flexible PEX-A (expansion fitting) or rigid Type L copper piping routed through attics, crawlspaces, and wall cavities. PEX-A expansion systems eliminate buried solder joints, resist scale accumulation, and flex during freeze-thaw cycles without bursting.",
    faqs: [
      {
        q: "How long does a whole-house repipe take?",
        a: "For an average 1,500 to 2,500 square foot single-family home, the plumbing installation takes 1 to 2 days, with water restored each evening. Drywall patching, texturing, and inspection take an additional 2 to 3 days."
      },
      {
        q: "Which is better for repiping: PEX-A or Copper?",
        a: "PEX-A (cross-linked polyethylene with expansion rings) is the modern industry standard due to its flexibility, absence of hidden joints, immunity to acidic pitting, and 25-year manufacturer warranty. Type L Copper remains preferred for exposed mechanical rooms and direct sunlight exposure."
      },
      {
        q: "Do I need a city permit for a whole-house repipe?",
        a: "Yes. All municipal building departments require a plumbing permit, a rough-in pressure inspection (holding 100 PSI static air or water test), and a final inspection sign-off to ensure safety and preserve property value."
      }
    ]
  },
  {
    slug: "polybutylene-pipe-replacement",
    title: "Polybutylene (PB2110) Pipe Identification & Replacement Guide",
    metaTitle: "Polybutylene Pipe Replacement & Identification Guide | PB2110 Risks",
    metaDescription: "Identify PB2110 polybutylene pipes in homes built between 1978 and 1995. Learn about micro-fractures, insurance cancellation risks, and repiping solutions.",
    category: "repipe",
    badge: "Risk Mitigation",
    summary: "Installed in millions of homes between 1978 and 1995, grey polybutylene (PB2110) pipes suffer catastrophic degradation when exposed to municipal chlorine. Learn identification protocols and insurance mitigation steps.",
    diagnosticTree: {
      question: "Do you have flexible grey plastic pipes with copper or plastic crimp rings near your water heater or sinks?",
      scenarioA: {
        condition: "Grey Plastic Stamped with 'PB2110' Near Water Meter or Manifold",
        diagnosis: "Confirmed Polybutylene plumbing. Active micro-fracture risk from municipal chloramine oxidation.",
        action: "Schedule a comprehensive repipe consultation. Polybutylene degrades from the inside out and can burst without warning."
      },
      scenarioB: {
        condition: "Homeowners Insurance Policy Denied or Premium Surcharged",
        diagnosis: "Major underwriters (State Farm, Allstate, Travelers) routinely exclude PB2110 properties from water damage coverage.",
        action: "Repipe with certified PEX-A and obtain an official licensed plumbing completion certificate for insurance reinstatement."
      }
    },
    keyCodesAndStandards: [
      "ASTM D3309: Standard Specification for Polybutylene (PB) Plastic Hot- and Cold-Water Distribution Systems (Withdrawn)",
      "Class Action Settlement Cox v. Shell Oil Co. ($950M fund, expired)",
      "California & Arizona Residential Building Codes: Prohibited Pipe Materials"
    ],
    symptoms: [
      "Dull grey flexible plastic tubing entering water heater or passing through basement joists",
      "Stamping reading 'PB2110', 'Qest', or 'Vanguard' along pipe length",
      "Flaking or micro-cracking visible around acetal (plastic) or aluminum crimp rings",
      "Notice of non-renewal or water-damage exclusion from homeowner insurance carrier"
    ],
    technicalOverview: "Polybutylene is an extruded plastic resin that reacts chemically with chlorine and chloramines added to municipal drinking water for disinfection. The oxidant breaks down the polymer chain, creating microscopic fissures along the pipe interior and fitting interfaces until structural failure occurs under normal line pressure.",
    faqs: [
      {
        q: "Can polybutylene pipes be repaired with spot fixes?",
        a: "No. While transition couplings exist for temporary emergencies, spot repairs leave the remaining brittle polybutylene intact. Because degradation is systemic across the entire plumbing network, whole-home repiping is the only permanent solution."
      },
      {
        q: "Will homeowners insurance cover water damage from a polybutylene pipe burst?",
        a: "Many insurance carriers now insert specific water damage exclusion riders or refuse coverage entirely for homes with polybutylene supply lines. Upgrading to PEX-A restores full insurability."
      },
      {
        q: "How can I confirm if my home has polybutylene piping?",
        a: "Inspect the water line where it enters through the foundation wall, the shutoff valves beneath bathroom sinks, and the connections entering your water heater. Look for flexible grey tubing with plastic or copper crimp bands."
      }
    ]
  },
  {
    slug: "cast-iron-galvanized-pipe-replacement",
    title: "Cast Iron & Galvanized Pipe Replacement & Rehabilitation Guide",
    metaTitle: "Cast Iron & Galvanized Pipe Replacement Guide | Pre-1975 Upgrades",
    metaDescription: "Upgrading pre-1975 cast iron drain stacks and galvanized steel water lines. Learn about channel rot, sewer camera inspections, and replacement options.",
    category: "repipe",
    badge: "Legacy Infrastructure",
    summary: "Homes built before 1975 feature cast iron waste stacks and galvanized steel supply lines reaching the end of their 50-year service life. Learn how video camera diagnostic inspection guides modern replacement.",
    diagnosticTree: {
      question: "Are you experiencing recurrent drain backups, foul sewer odors, or severely rusty tap water?",
      scenarioA: {
        condition: "Sewer Drain Slowdown & Channel Rot in Cast Iron",
        diagnosis: "Sulfuric acid corrosion has eroded the pipe bottom, causing toilet paper and solids to catch on jagged iron ridges.",
        action: "Perform a high-definition sewer camera inspection to assess pipe wall structural integrity and root intrusion."
      },
      scenarioB: {
        condition: "Severe Rust Stains & Restricted Water Flow in Galvanized Steel",
        diagnosis: "Internal zinc plating has depleted; iron oxide tuberculation has occluded up to 80% of pipe diameter.",
        action: "Replace supply lines with PEX-A to restore full water volume and eliminate heavy metal contamination."
      }
    },
    keyCodesAndStandards: [
      "ASTM A74: Standard Specification for Cast Iron Soil Pipe and Fittings",
      "ASTM A53: Standard Specification for Pipe, Steel, Black and Hot-Dipped, Zinc-Coated (Galvanized)",
      "UPC Chapter 7 / IPC Chapter 7: Sanitary Drainage Systems"
    ],
    symptoms: [
      "Frequent drain clogs requiring repeated mechanical cable snaking",
      "Sewer gas odors permeating bathrooms or crawlspace areas",
      "Brownish or black flakes visible in tap water after leaving home for a weekend",
      "Cracking, weeping, or white mineral efflorescence along cast iron vertical waste stacks"
    ],
    technicalOverview: "Cast iron and galvanized pipes corrode through oxidation and biochemical reactions. Hydrogen sulfide gas inside drain lines converts into sulfuric acid, eating away the crown and invert of cast iron pipes. Modern replacement utilizes Schedule 40 PVC/ABS for drainage and expansion PEX-A for potable supply.",
    faqs: [
      {
        q: "What is cast iron 'channel rot'?",
        a: "Channel rot occurs when constant acidic wastewater flow erodes the bottom trough of horizontal cast iron sewer lines, eventually cutting through the metal entirely and washing away soil beneath the foundation."
      },
      {
        q: "Can old cast iron sewer pipes be descaled instead of replaced?",
        a: "Mechanical hydro-jet descaling can remove rust ridges in pipes with sufficient remaining wall thickness. However, if a camera inspection reveals bottom channeling or cracks, structural replacement or cured-in-place pipe lining (CIPP) is required."
      },
      {
        q: "How does galvanized pipe corrosion affect drinking water quality?",
        a: "As galvanized zinc coating erodes, raw steel oxidizes into iron oxide. This causes yellow-brown water, metallic taste, and can harbor accumulated lead from legacy solder joints and galvanized impurities."
      }
    ]
  },
  {
    slug: "pipe-pressure-backflow-cost-guide",
    title: "Infrastructure Plumbing Cost Guide: Repiping, PRV & Backflow Realities",
    metaTitle: "Plumbing Infrastructure Cost Guide: Repiping, PRVs & Backflow Rates",
    metaDescription: "Realistic price factors for whole-home repiping, pressure reducing valves, and backflow preventer testing. Understand cost drivers and quote variances.",
    category: "cost-guide",
    badge: "Transparent Pricing Guide",
    summary: "Plumbing infrastructure pricing depends on home square footage, foundation accessibility, municipal permit fees, and pipe materials. Discover realistic cost benchmarks and why phone flat rates are misleading.",
    diagnosticTree: {
      question: "What primary infrastructure service are you planning for your property?",
      scenarioA: {
        condition: "Whole-House Repiping (Single-Family Residential)",
        diagnosis: "Cost driven by fixture count (bathrooms), stories, accessibility (attic/crawlspace vs concrete slab), and drywall repair scope.",
        action: "Request an on-site evaluation measuring linear footage and manifold routing before accepting a binding contract."
      },
      scenarioB: {
        condition: "Pressure Reducing Valve (PRV) or Backflow Testing & Repair",
        diagnosis: "Cost driven by valve diameter (3/4\" vs 1\" vs 2\"), accessibility, and certified municipal filing requirements.",
        action: "Verify the quote includes all city certification filing fees and static pressure calibration."
      }
    },
    keyCodesAndStandards: [
      "RSMeans Plumbing Cost Data Benchmarks",
      "Local Municipal Permit and Plan Check Fee Schedules",
      "Uniform Plumbing Code Requirements for Pressure and Backflow Inspections"
    ],
    symptoms: [
      "Wide price discrepancies between contractor estimates",
      "Hidden charges for drywall patching, permit acquisition, or disposal fees",
      "Quotes provided over the phone without on-site diagnostic inspection",
      "Contractors demanding full payment before municipal rough-in signoff"
    ],
    technicalOverview: "Infrastructure plumbing projects require substantial labor, certified testing instrumentation, and municipal regulatory compliance. Accurate quotes cannot be generated blindly over the phone; an on-site technician must inspect access, measure pipe diameters, test existing static pressure, and identify local municipal requirements.",
    faqs: [
      {
        q: "What are the primary cost factors in whole-house repiping?",
        a: "Key variables include total home square footage, number of plumbing fixtures (toilets, sinks, tubs, hose bibs), architectural access (attic and crawlspace are significantly lower cost than concrete slab routing), material choice (PEX-A vs Copper), and drywall restoration scope."
      },
      {
        q: "Why do estimates vary so significantly between plumbing companies?",
        a: "Lower estimates often omit city permit fees, use lower-grade crimp fittings instead of full-expansion PEX-A, or exclude drywall repair and painting entirely, leaving homeowners with unexpected secondary contractors."
      },
      {
        q: "What is typically included in a professional PRV replacement?",
        a: "A comprehensive replacement includes removing the failed valve, installing a lead-free ASSE 1003 brass PRV, adding union fittings for future maintenance, calibrating static pressure to 55–65 PSI, testing water hammer response, and verifying thermal expansion protection."
      }
    ]
  }
];

export function getAuthorityHub(slug: string): AuthorityHub | null {
  return AUTHORITY_HUBS.find((h) => h.slug === slug) ?? null;
}
