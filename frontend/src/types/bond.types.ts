export interface BondInputs {
  faceValue: number;
  annualCouponRate: number; // decimal — 0.05 = 5%
  marketPrice: number;
  yearsToMaturity: number;
  couponFrequency: 1 | 2;
}

export interface CashFlowRow {
  period: number;
  paymentDate: string;
  couponPayment: number;
  cumulativeInterest: number;
  remainingPrincipal: number;
}

export interface BondResults {
  currentYield: number;
  ytm: number;
  totalInterestEarned: number;
  isPremium: boolean;
  isDiscount: boolean;
  cashFlowSchedule: CashFlowRow[];
}
