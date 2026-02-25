export interface BondInputs {
  faceValue: number;
  annualCouponRate: number; // decimal (e.g. 0.05 for 5%)
  marketPrice: number;
  yearsToMaturity: number;
  couponFrequency: 1 | 2; // 1 = annual, 2 = semi-annual
}

export interface CashFlowRow {
  period: number;
  paymentDate: string;
  couponPayment: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

export interface BondOutputs {
  currentYield: number;
  ytm: number | null; // can be null if not solvable
  totalInterestEarned: number;
  isPremium: boolean;
  isDiscount: boolean;
  cashFlowSchedule: CashFlowRow[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Bond Price Function (Pure, Deterministic)
// ─────────────────────────────────────────────────────────────────────────────

function bondPrice(
  r: number,
  coupon: number,
  faceValue: number,
  periods: number,
): number {
  let price = 0;

  for (let t = 1; t <= periods; t++) {
    price += coupon / Math.pow(1 + r, t);
  }

  price += faceValue / Math.pow(1 + r, periods);
  return price;
}

// ─────────────────────────────────────────────────────────────────────────────
// YTM via Bisection (Stable, Handles Negative Yields)
// ─────────────────────────────────────────────────────────────────────────────

export function calculateYTM(
  marketPrice: number,
  coupon: number,
  faceValue: number,
  periods: number,
  frequency: number,
  tolerance = 1e-8,
  maxIterations = 200,
): number | null {
  // Periodic yield bounds
  let low = -0.9999;  // cannot go to -1
  let high = 1.0;     // 100% per period upper bound
  let mid = 0;

  const f = (r: number) =>
    bondPrice(r, coupon, faceValue, periods) - marketPrice;

  const fLow = f(low);
  const fHigh = f(high);

  // Root must be bracketed
  if (fLow * fHigh > 0) {
    return null;
  }

  for (let i = 0; i < maxIterations; i++) {
    mid = (low + high) / 2;
    const value = f(mid);

    if (Math.abs(value) < tolerance) {
      break;
    }

    if (value > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }

  const periodicYTM = mid;

  // Annualise
  const annualYTM = periodicYTM * frequency;

  // Safety: if extremely close to -100%, cap slightly above
  if (periodicYTM <= -0.9998) {
    return -0.9998 * frequency;
  }

  return annualYTM;
}

// ─────────────────────────────────────────────────────────────────────────────
// Cash Flow Schedule
// ─────────────────────────────────────────────────────────────────────────────

export function buildCashFlowSchedule(
  inputs: BondInputs,
  startDate: Date = new Date(),
): CashFlowRow[] {
  const { faceValue, annualCouponRate, yearsToMaturity, couponFrequency } =
    inputs;

  const periods = yearsToMaturity * couponFrequency;
  const couponPayment = (faceValue * annualCouponRate) / couponFrequency;
  const monthsPerPeriod = 12 / couponFrequency;

  const rows: CashFlowRow[] = [];
  let cumulative = 0;

  for (let p = 1; p <= periods; p++) {
    cumulative += couponPayment;

    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + p * monthsPerPeriod);

    rows.push({
      period: p,
      paymentDate: paymentDate.toISOString().split("T")[0],
      couponPayment: +couponPayment.toFixed(4),
      cumulativeInterest: +cumulative.toFixed(4),
      remainingPrincipal:
        p === periods ? 0 : faceValue, // principal paid at maturity
    });
  }

  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Calculator
// ─────────────────────────────────────────────────────────────────────────────

export function calculateBond(inputs: BondInputs): BondOutputs {
  const {
    faceValue,
    annualCouponRate,
    marketPrice,
    yearsToMaturity,
    couponFrequency,
  } = inputs;

  const annualCoupon = faceValue * annualCouponRate;
  const periodicCoupon = annualCoupon / couponFrequency;
  const periods = yearsToMaturity * couponFrequency;

  const currentYield = annualCoupon / marketPrice;

  const ytm = calculateYTM(
    marketPrice,
    periodicCoupon,
    faceValue,
    periods,
    couponFrequency,
  );

  const totalInterestEarned = periodicCoupon * periods;

  return {
    currentYield: +currentYield.toFixed(6),
    ytm: ytm !== null ? +ytm.toFixed(6) : null,
    totalInterestEarned: +totalInterestEarned.toFixed(4),
    isPremium: marketPrice > faceValue,
    isDiscount: marketPrice < faceValue,
    cashFlowSchedule: buildCashFlowSchedule(inputs),
  };
}