import { categories } from './stack-data';

export type TimeRange = '1W' | '1M' | '3M' | '6M' | '1Y';

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface ChartSummary {
  currentValue: number;
  previousValue: number;
  changeAmount: number;
  changePercent: number;
  direction: 'up' | 'down' | 'flat';
}

export interface ChartDataSet {
  points: ChartDataPoint[];
  summary: ChartSummary;
}

// Deterministic seeded random
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getDaysForRange(range: TimeRange): number {
  switch (range) {
    case '1W': return 7;
    case '1M': return 30;
    case '3M': return 90;
    case '6M': return 180;
    case '1Y': return 365;
  }
}

function generateDates(days: number): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

function computeSummary(points: ChartDataPoint[]): ChartSummary {
  const first = points[0]?.value ?? 0;
  const last = points[points.length - 1]?.value ?? 0;
  const change = last - first;
  const pct = first !== 0 ? (change / first) * 100 : 0;
  return {
    currentValue: last,
    previousValue: first,
    changeAmount: Math.round(change * 100) / 100,
    changePercent: Math.round(pct * 10) / 10,
    direction: change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'flat',
  };
}

/** Market service price trend for a category + location */
export function generatePriceTrendData(category: string, location: string, range: TimeRange): ChartDataSet {
  const cat = categories.find(c => c.name === category);
  const basePrice = cat ? parseInt(cat.avgPrice.replace(/[^0-9]/g, '')) : 200;
  const seed = hashString(category + location);
  const days = getDaysForRange(range);
  const dates = generateDates(days);

  const points: ChartDataPoint[] = dates.map((date, i) => {
    const wave = Math.sin((i / days) * Math.PI * 2.5 + seed * 0.01) * 0.12;
    const noise = (seededRandom(seed + i * 7) - 0.5) * 0.06;
    const drift = (i / days) * 0.08; // slight upward trend
    const value = Math.round(basePrice * (1 + wave + noise + drift));
    return { date, value };
  });

  return { points, summary: computeSummary(points) };
}

/** Vendor cumulative earnings trend */
export function generateEarningsTrendData(totalEarnings: number, range: TimeRange): ChartDataSet {
  const days = getDaysForRange(range);
  const dates = generateDates(days);
  const dailyAvg = totalEarnings / 365; // annualized daily average
  let cumulative = totalEarnings - dailyAvg * days;
  if (cumulative < 0) cumulative = totalEarnings * 0.3;

  const points: ChartDataPoint[] = dates.map((date, i) => {
    // Jobs happen on ~70% of days, with variable amounts
    const hasJob = seededRandom(i * 13 + 42) > 0.3;
    const jobAmount = hasJob ? dailyAvg * (0.5 + seededRandom(i * 17 + 99) * 1.5) : 0;
    cumulative += jobAmount;
    return { date, value: Math.round(cumulative) };
  });

  // Scale so last point matches totalEarnings
  const lastVal = points[points.length - 1].value;
  if (lastVal !== 0) {
    const scale = totalEarnings / lastVal;
    points.forEach(p => { p.value = Math.round(p.value * scale); });
  }

  return { points, summary: computeSummary(points) };
}

/** Consumer points growth over time */
export function generatePointsGrowthData(currentPoints: number, lifetimePoints: number, range: TimeRange): ChartDataSet {
  const days = getDaysForRange(range);
  const dates = generateDates(days);
  const dailyAvg = lifetimePoints / 365;
  let cumulative = lifetimePoints - dailyAvg * days;
  if (cumulative < 0) cumulative = lifetimePoints * 0.2;

  const points: ChartDataPoint[] = dates.map((date, i) => {
    // Points earned on ~60% of days
    const earnsPoints = seededRandom(i * 23 + 77) > 0.4;
    const earned = earnsPoints ? dailyAvg * (0.3 + seededRandom(i * 31 + 55) * 2) : 0;
    cumulative += earned;
    return { date, value: Math.round(cumulative) };
  });

  // Scale so last point matches lifetimePoints
  const lastVal = points[points.length - 1].value;
  if (lastVal !== 0) {
    const scale = lifetimePoints / lastVal;
    points.forEach(p => { p.value = Math.round(p.value * scale); });
  }

  return { points, summary: computeSummary(points) };
}
