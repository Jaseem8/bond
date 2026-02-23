import { IsNumber, IsIn, IsPositive, Min, Max } from 'class-validator';

export class CalculateBondDto {
  @IsNumber()
  @IsPositive()
  faceValue: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  annualCouponRate: number; // decimal — e.g. 0.05 for 5%

  @IsNumber()
  @IsPositive()
  marketPrice: number;

  @IsNumber()
  @IsPositive()
  yearsToMaturity: number;

  @IsIn([1, 2])
  couponFrequency: 1 | 2;
}
