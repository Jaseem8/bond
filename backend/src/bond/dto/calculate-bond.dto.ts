import { IsNumber, IsIn, IsPositive, Min, Max } from 'class-validator';

export class CalculateBondDto {
  @IsNumber()
  @IsPositive()
  @Max(1000000000) // 1 Billion limit to prevent extreme calculation overflows
  faceValue: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  annualCouponRate: number; // decimal — e.g. 0.05 for 5%

  @IsNumber()
  @IsPositive()
  @Max(1000000000)
  marketPrice: number;

  @IsNumber()
  @Min(0.1)
  @Max(100) // Hard limit of 100 years to prevent DoS attacking cash flow loops
  yearsToMaturity: number;

  @IsIn([1, 2])
  couponFrequency: 1 | 2;
}
