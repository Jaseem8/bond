export interface BondInputs {
  faceValue: number;
  annualCouponRate: number; // e.g. 0.05 for 5%
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
  ytm: number;
  totalInterestEarned: number;
  isPremium: boolean;
  isDiscount: boolean;
  cashFlowSchedule: CashFlowRow[];
}

// ─── Bond Price & Derivative (for Newton-Raphson) ────────────────────────────

function bondPrice(
  periodicRate: number,
  coupon: number,
  faceValue: number,
  periods: number,
): number {
  let price = 0;
  for (let t = 1; t <= periods; t++) {
    price += coupon / Math.pow(1 + periodicRate, t);
  }
  price += faceValue / Math.pow(1 + periodicRate, periods);
  return price;
}

function bondPriceDerivative(
  periodicRate: number,
  coupon: number,
  faceValue: number,
  periods: number,
): number {
  let deriv = 0;
  for (let t = 1; t <= periods; t++) {
    deriv -= (t * coupon) / Math.pow(1 + periodicRate, t + 1);
  }
  deriv -= (periods * faceValue) / Math.pow(1 + periodicRate, periods + 1);
  return deriv;
}

// ─── YTM via Newton-Raphson ───────────────────────────────────────────────────

export function calculateYTM(
  marketPrice: number,
  coupon: number,
  faceValue: number,
  periods: number,
  frequency: number,
  tolerance = 1e-10,
  maxIterations = 1000,
): number {
  // Initial guess: approximate yield = coupon / price
  let r = coupon / marketPrice;

  for (let i = 0; i < maxIterations; i++) {
    const price = bondPrice(r, coupon, faceValue, periods);
    const diff = price - marketPrice;
    if (Math.abs(diff) < tolerance) break;
    const deriv = bondPriceDerivative(r, coupon, faceValue, periods);
    if (deriv === 0) break;
    r -= diff / deriv;
  }

  return r * frequency; // annualise
}

// ─── Cash Flow Schedule ───────────────────────────────────────────────────────

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
      paymentDate: paymentDate.toISOString().split('T')[0],
      couponPayment: +couponPayment.toFixed(4),
      cumulativeInterest: +cumulative.toFixed(4),
      remainingPrincipal: faceValue,
    });
  }
  return rows;
}

// ─── Main Calculator ──────────────────────────────────────────────────────────

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
    ytm: +ytm.toFixed(6),
    totalInterestEarned: +totalInterestEarned.toFixed(4),
    isPremium: marketPrice > faceValue,
    isDiscount: marketPrice < faceValue,
    cashFlowSchedule: buildCashFlowSchedule(inputs),
  };
}
