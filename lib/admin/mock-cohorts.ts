// Mock data for NYC cold-start cohort analysis
// 12 cohorts across real NYC neighborhoods, each with metric time series + member list

export type CohortType = "merchant" | "creator";
export type CohortStatus = "active" | "completed" | "paused";

export interface RetentionPoint {
  day: number; // D0, D7, D14, D30, D60, D90
  rate: number; // 0-1
}

export interface MetricSeries {
  date: string; // ISO date
  value: number;
}

export interface CohortMember {
  id: string;
  name: string;
  handle?: string;
  neighborhood: string;
  joinedAt: string;
  type: CohortType;
  activationDate?: string;
  status: "active" | "churned" | "paused";
  gmv: number; // gross merchandise value
  ltv: number; // lifetime value
  campaigns: number;
  tier?: string; // creator tier
}

export interface Cohort {
  id: string;
  name: string;
  type: CohortType;
  neighborhood: string;
  borough: string;
  startDate: string;
  endDate?: string;
  status: CohortStatus;
  size: number;

  // Key metrics
  activationRate: number; // 0-1, % who completed first action
  retentionD7: number; // 0-1
  retentionD30: number; // 0-1
  gmv: number; // total USD
  ltv: number; // avg per member USD
  avgCampaigns: number;

  // Retention curve D0-D90
  retentionCurve: RetentionPoint[];

  // 30-point time series for charts
  gmvSeries: MetricSeries[];
  activationSeries: MetricSeries[];

  // Members
  members: CohortMember[];

  // Experiment metadata
  experimentTags: string[];
  notes?: string;
}

// --- Helper: generate 30-day series ---
function genSeries(
  startDate: string,
  baseValue: number,
  growthRate: number,
  noise: number = 0.15,
): MetricSeries[] {
  const series: MetricSeries[] = [];
  const start = new Date(startDate);
  let val = baseValue;
  for (let i = 0; i < 30; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    val = val * (1 + growthRate + (Math.random() - 0.5) * noise);
    series.push({
      date: d.toISOString().slice(0, 10),
      value: Math.round(val * 100) / 100,
    });
  }
  return series;
}

function genActivationSeries(startDate: string, size: number): MetricSeries[] {
  const series: MetricSeries[] = [];
  const start = new Date(startDate);
  let activated = 0;
  const target = Math.floor(size * (0.6 + Math.random() * 0.3));
  for (let i = 0; i < 30; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const daily =
      i < 7
        ? Math.floor(target * 0.12 * (1 - i * 0.04))
        : Math.floor(target * 0.02 * (1 - i * 0.01));
    activated = Math.min(activated + Math.max(0, daily), target);
    series.push({ date: d.toISOString().slice(0, 10), value: activated });
  }
  return series;
}

function retentionCurve(d7: number, d30: number): RetentionPoint[] {
  // Smooth interpolation D0→D90
  const d60 = d30 * 0.72 + (Math.random() - 0.5) * 0.05;
  const d90 = d30 * 0.55 + (Math.random() - 0.5) * 0.05;
  return [
    { day: 0, rate: 1.0 },
    { day: 7, rate: d7 },
    { day: 14, rate: (d7 + d30) / 2 },
    { day: 30, rate: d30 },
    { day: 60, rate: Math.max(0.05, d60) },
    { day: 90, rate: Math.max(0.03, d90) },
  ];
}

function genMembers(
  cohortId: string,
  type: CohortType,
  neighborhood: string,
  count: number,
  startDate: string,
): CohortMember[] {
  const merchantNames = [
    "Bed-Stuy Grill",
    "Fulton Café",
    "Marcus BBQ",
    "Crown Fried",
    "Tivoli Bakery",
    "Park Slope Provisions",
    "Atlantic Market",
    "Franklin Ave Deli",
    "Brownsville Kitchen",
    "Navy Yard Bites",
    "East New York Eats",
    "Canarsie Fresh",
    "Flatbush Flavors",
    "Coney Island Seafood",
    "Greenpoint Pantry",
    "Bushwick Brew",
    "Ridgewood Roast",
    "Astoria Gyros",
    "Jackson Noodle House",
    "Forest Hills Patisserie",
    "Jamaica Center Market",
    "Harlem Soul",
    "Sugar Hill Kitchen",
    "Hamilton Heights Bistro",
    "Inwood Commons",
    "Washington Heights Taquería",
    "Dyckman Deli",
    "South Bronx Bodega",
    "Hunts Point Produce",
    "Grand Concourse Grill",
    "Riverdale Table",
    "Parkchester Plates",
    "City Island Clam Bar",
    "Fordham Brew Co",
  ];
  const creatorNames = [
    "@nyc.nomad",
    "@brooklynbites",
    "@bedstuyeat",
    "@harlemfoodie",
    "@bronxlocal",
    "@queenseats",
    "@statenislandlive",
    "@fultonstreetfood",
    "@crownhightslife",
    "@boerumsocial",
    "@williamsburgwalk",
    "@greenpointhops",
    "@astorialife",
    "@jacksonheights_food",
    "@foresthillsfresh",
    "@jamaicaave",
    "@harlemharlem",
    "@sugarhill_nyc",
    "@inwood.eats",
    "@dyckman_local",
    "@southbronx_vibes",
    "@huntspoint_fresh",
    "@gconcourse",
    "@cityisland_fish",
  ];

  const names = type === "merchant" ? merchantNames : creatorNames;
  const statuses: CohortMember["status"][] = [
    "active",
    "active",
    "active",
    "churned",
    "paused",
  ];
  const tiers = ["Seed", "Explorer", "Operator", "Proven", "Closer"];

  return Array.from({ length: count }, (_, i) => {
    const idx = (i + cohortId.charCodeAt(0)) % names.length;
    const status = statuses[(i + idx) % statuses.length];
    const gmv =
      status === "active"
        ? 800 + Math.round(Math.random() * 4200)
        : 200 + Math.round(Math.random() * 1200);
    const activationDaysOffset = Math.floor(Math.random() * 14);
    const activationDate = new Date(startDate);
    activationDate.setDate(activationDate.getDate() + activationDaysOffset);

    return {
      id: `${cohortId}-member-${i + 1}`,
      name: names[idx % names.length],
      handle: type === "creator" ? names[idx % names.length] : undefined,
      neighborhood,
      joinedAt: startDate,
      type,
      activationDate:
        status !== "churned"
          ? activationDate.toISOString().slice(0, 10)
          : undefined,
      status,
      gmv,
      ltv: Math.round(gmv * (0.8 + Math.random() * 0.4)),
      campaigns:
        status === "active"
          ? 1 + Math.floor(Math.random() * 8)
          : Math.floor(Math.random() * 3),
      tier: type === "creator" ? tiers[(i + idx) % tiers.length] : undefined,
    };
  });
}

// --- 12 Cohorts ---
export const mockCohorts: Cohort[] = [
  {
    id: "cohort-001",
    name: "Week 1 BedStuy Food",
    type: "merchant",
    neighborhood: "Bedford-Stuyvesant",
    borough: "Brooklyn",
    startDate: "2024-11-04",
    status: "completed",
    size: 24,
    activationRate: 0.83,
    retentionD7: 0.79,
    retentionD30: 0.62,
    gmv: 78400,
    ltv: 3267,
    avgCampaigns: 4.2,
    retentionCurve: retentionCurve(0.79, 0.62),
    gmvSeries: genSeries("2024-11-04", 1200, 0.035),
    activationSeries: genActivationSeries("2024-11-04", 24),
    members: genMembers(
      "cohort-001",
      "merchant",
      "Bedford-Stuyvesant",
      24,
      "2024-11-04",
    ),
    experimentTags: ["neighborhood-first", "food-heavy", "qr-v1"],
    notes: "First NYC cohort. Proved QR attribution works at street level.",
  },
  {
    id: "cohort-002",
    name: "Week 1 Harlem Creators",
    type: "creator",
    neighborhood: "Harlem",
    borough: "Manhattan",
    startDate: "2024-11-04",
    status: "completed",
    size: 31,
    activationRate: 0.74,
    retentionD7: 0.71,
    retentionD30: 0.55,
    gmv: 62100,
    ltv: 2003,
    avgCampaigns: 3.1,
    retentionCurve: retentionCurve(0.71, 0.55),
    gmvSeries: genSeries("2024-11-04", 900, 0.028),
    activationSeries: genActivationSeries("2024-11-04", 31),
    members: genMembers("cohort-002", "creator", "Harlem", 31, "2024-11-04"),
    experimentTags: ["creator-first", "manhattan-launch", "qr-v1"],
    notes:
      "Strong nano-creator activation, higher churn than merchant cohorts.",
  },
  {
    id: "cohort-003",
    name: "Week 2 Crown Heights Mixed",
    type: "merchant",
    neighborhood: "Crown Heights",
    borough: "Brooklyn",
    startDate: "2024-11-11",
    status: "completed",
    size: 28,
    activationRate: 0.86,
    retentionD7: 0.82,
    retentionD30: 0.68,
    gmv: 91200,
    ltv: 3257,
    avgCampaigns: 5.1,
    retentionCurve: retentionCurve(0.82, 0.68),
    gmvSeries: genSeries("2024-11-11", 1800, 0.041),
    activationSeries: genActivationSeries("2024-11-11", 28),
    members: genMembers(
      "cohort-003",
      "merchant",
      "Crown Heights",
      28,
      "2024-11-11",
    ),
    experimentTags: ["week-2-expansion", "brooklyn-core", "qr-v2"],
  },
  {
    id: "cohort-004",
    name: "Week 2 Astoria QR Test",
    type: "creator",
    neighborhood: "Astoria",
    borough: "Queens",
    startDate: "2024-11-11",
    status: "completed",
    size: 19,
    activationRate: 0.68,
    retentionD7: 0.63,
    retentionD30: 0.44,
    gmv: 38700,
    ltv: 2037,
    avgCampaigns: 2.7,
    retentionCurve: retentionCurve(0.63, 0.44),
    gmvSeries: genSeries("2024-11-11", 700, 0.022),
    activationSeries: genActivationSeries("2024-11-11", 19),
    members: genMembers("cohort-004", "creator", "Astoria", 19, "2024-11-11"),
    experimentTags: ["queens-pilot", "qr-v2", "low-activation"],
    notes: "Activation lagged — onboarding friction in QR flow. Fixed in v2.1.",
  },
  {
    id: "cohort-005",
    name: "Week 3 South Bronx Food",
    type: "merchant",
    neighborhood: "South Bronx",
    borough: "Bronx",
    startDate: "2024-11-18",
    status: "completed",
    size: 22,
    activationRate: 0.77,
    retentionD7: 0.73,
    retentionD30: 0.57,
    gmv: 54300,
    ltv: 2468,
    avgCampaigns: 3.8,
    retentionCurve: retentionCurve(0.73, 0.57),
    gmvSeries: genSeries("2024-11-18", 1100, 0.031),
    activationSeries: genActivationSeries("2024-11-18", 22),
    members: genMembers(
      "cohort-005",
      "merchant",
      "South Bronx",
      22,
      "2024-11-18",
    ),
    experimentTags: ["bronx-launch", "bodega-heavy", "week-3"],
  },
  {
    id: "cohort-006",
    name: "Week 4 Greenpoint Creators",
    type: "creator",
    neighborhood: "Greenpoint",
    borough: "Brooklyn",
    startDate: "2024-11-25",
    status: "completed",
    size: 36,
    activationRate: 0.89,
    retentionD7: 0.84,
    retentionD30: 0.71,
    gmv: 112600,
    ltv: 3128,
    avgCampaigns: 5.9,
    retentionCurve: retentionCurve(0.84, 0.71),
    gmvSeries: genSeries("2024-11-25", 2200, 0.048),
    activationSeries: genActivationSeries("2024-11-25", 36),
    members: genMembers(
      "cohort-006",
      "creator",
      "Greenpoint",
      36,
      "2024-11-25",
    ),
    experimentTags: [
      "top-performer",
      "creator-dense",
      "week-4",
      "referral-test",
    ],
    notes:
      "Best D30 retention across all cohorts. Referral program drove re-engagement.",
  },
  {
    id: "cohort-007",
    name: "Month 2 Jackson Heights",
    type: "merchant",
    neighborhood: "Jackson Heights",
    borough: "Queens",
    startDate: "2024-12-02",
    status: "active",
    size: 41,
    activationRate: 0.81,
    retentionD7: 0.78,
    retentionD30: 0.63,
    gmv: 134500,
    ltv: 3280,
    avgCampaigns: 4.6,
    retentionCurve: retentionCurve(0.78, 0.63),
    gmvSeries: genSeries("2024-12-02", 3100, 0.044),
    activationSeries: genActivationSeries("2024-12-02", 41),
    members: genMembers(
      "cohort-007",
      "merchant",
      "Jackson Heights",
      41,
      "2024-12-02",
    ),
    experimentTags: ["month-2", "queens-expansion", "multi-ethnic-market"],
  },
  {
    id: "cohort-008",
    name: "Month 2 Washington Heights",
    type: "creator",
    neighborhood: "Washington Heights",
    borough: "Manhattan",
    startDate: "2024-12-02",
    status: "active",
    size: 29,
    activationRate: 0.72,
    retentionD7: 0.68,
    retentionD30: 0.51,
    gmv: 67800,
    ltv: 2338,
    avgCampaigns: 3.4,
    retentionCurve: retentionCurve(0.68, 0.51),
    gmvSeries: genSeries("2024-12-02", 1600, 0.033),
    activationSeries: genActivationSeries("2024-12-02", 29),
    members: genMembers(
      "cohort-008",
      "creator",
      "Washington Heights",
      29,
      "2024-12-02",
    ),
    experimentTags: ["month-2", "upper-manhattan", "spanish-speaking"],
  },
  {
    id: "cohort-009",
    name: "Month 2 Bushwick Digital",
    type: "creator",
    neighborhood: "Bushwick",
    borough: "Brooklyn",
    startDate: "2024-12-09",
    status: "active",
    size: 44,
    activationRate: 0.91,
    retentionD7: 0.87,
    retentionD30: 0.74,
    gmv: 148900,
    ltv: 3384,
    avgCampaigns: 6.7,
    retentionCurve: retentionCurve(0.87, 0.74),
    gmvSeries: genSeries("2024-12-09", 3800, 0.052),
    activationSeries: genActivationSeries("2024-12-09", 44),
    members: genMembers("cohort-009", "creator", "Bushwick", 44, "2024-12-09"),
    experimentTags: [
      "high-performer",
      "arts-district",
      "tiktok-heavy",
      "month-2",
    ],
    notes:
      "Highest activation and GMV. Bushwick creator density is exceptional.",
  },
  {
    id: "cohort-010",
    name: "Month 3 Jamaica Ave Merchants",
    type: "merchant",
    neighborhood: "Jamaica",
    borough: "Queens",
    startDate: "2025-01-06",
    status: "active",
    size: 38,
    activationRate: 0.79,
    retentionD7: 0.74,
    retentionD30: 0.6,
    gmv: 119200,
    ltv: 3137,
    avgCampaigns: 4.4,
    retentionCurve: retentionCurve(0.74, 0.6),
    gmvSeries: genSeries("2025-01-06", 2800, 0.039),
    activationSeries: genActivationSeries("2025-01-06", 38),
    members: genMembers("cohort-010", "merchant", "Jamaica", 38, "2025-01-06"),
    experimentTags: ["month-3", "queens-corridor", "high-density"],
  },
  {
    id: "cohort-011",
    name: "Month 3 Fordham Bronx",
    type: "merchant",
    neighborhood: "Fordham",
    borough: "Bronx",
    startDate: "2025-01-13",
    status: "active",
    size: 27,
    activationRate: 0.74,
    retentionD7: 0.69,
    retentionD30: 0.54,
    gmv: 71600,
    ltv: 2651,
    avgCampaigns: 3.9,
    retentionCurve: retentionCurve(0.69, 0.54),
    gmvSeries: genSeries("2025-01-13", 1700, 0.036),
    activationSeries: genActivationSeries("2025-01-13", 27),
    members: genMembers("cohort-011", "merchant", "Fordham", 27, "2025-01-13"),
    experimentTags: ["month-3", "bronx-expansion", "near-campus"],
  },
  {
    id: "cohort-012",
    name: "Month 3 Park Slope Premium",
    type: "merchant",
    neighborhood: "Park Slope",
    borough: "Brooklyn",
    startDate: "2025-01-20",
    status: "active",
    size: 33,
    activationRate: 0.88,
    retentionD7: 0.83,
    retentionD30: 0.7,
    gmv: 158700,
    ltv: 4809,
    avgCampaigns: 5.5,
    retentionCurve: retentionCurve(0.83, 0.7),
    gmvSeries: genSeries("2025-01-20", 4200, 0.051),
    activationSeries: genActivationSeries("2025-01-20", 33),
    members: genMembers(
      "cohort-012",
      "merchant",
      "Park Slope",
      33,
      "2025-01-20",
    ),
    experimentTags: ["premium-market", "high-ltv", "month-3", "brooklyn-south"],
    notes:
      "Highest LTV cohort. Park Slope merchants skew toward fine dining and specialty retail.",
  },
];

export function getCohortById(id: string): Cohort | undefined {
  return mockCohorts.find((c) => c.id === id);
}

export function getCohortStats() {
  const total = mockCohorts.length;
  const active = mockCohorts.filter((c) => c.status === "active").length;
  const totalMembers = mockCohorts.reduce((s, c) => s + c.size, 0);
  const avgActivation =
    mockCohorts.reduce((s, c) => s + c.activationRate, 0) / total;
  const totalGmv = mockCohorts.reduce((s, c) => s + c.gmv, 0);
  const avgRetentionD30 =
    mockCohorts.reduce((s, c) => s + c.retentionD30, 0) / total;
  return {
    total,
    active,
    totalMembers,
    avgActivation,
    totalGmv,
    avgRetentionD30,
  };
}
