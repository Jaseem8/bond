import { Injectable } from '@nestjs/common';
import { calculateBond, BondOutputs } from './bond.utils';
import { CalculateBondDto } from './dto/calculate-bond.dto';

@Injectable()
export class BondService {
  calculate(dto: CalculateBondDto): BondOutputs {
    return calculateBond(dto);
  }
}
