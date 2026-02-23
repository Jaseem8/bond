# Step 03 — Backend: NestJS API

> **Previous:** [Step 02 — Backend Core Logic](./step-02-backend-core-logic.md) | **Next:** [Step 04 — Frontend React Setup](./step-04-frontend-react-setup.md)

---

## 🎯 Goal

Expose the bond calculator as a REST API endpoint using NestJS:

```
POST /bond/calculate
```

---

## 📚 What You'll Learn

- NestJS module / controller / service pattern
- How to validate request bodies with `class-validator` DTOs
- How to enable CORS so the React dev server can call the API

---

## 📁 Files to Create

```
backend/src/bond/
├── bond.module.ts
├── bond.controller.ts
├── bond.service.ts
├── bond.utils.ts         ← already created in Step 02
└── dto/
    └── calculate-bond.dto.ts
```

---

## 💻 Code

### `dto/calculate-bond.dto.ts`
```typescript
import { IsNumber, IsIn, IsPositive, Min, Max } from 'class-validator';

export class CalculateBondDto {
  @IsNumber()
  @IsPositive()
  faceValue: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  annualCouponRate: number;   // 0.05 = 5%

  @IsNumber()
  @IsPositive()
  marketPrice: number;

  @IsNumber()
  @IsPositive()
  yearsToMaturity: number;

  @IsIn([1, 2])
  couponFrequency: 1 | 2;
}
```

### `bond.service.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { calculateBond, BondOutputs } from './bond.utils';
import { CalculateBondDto } from './dto/calculate-bond.dto';

@Injectable()
export class BondService {
  calculate(dto: CalculateBondDto): BondOutputs {
    return calculateBond(dto);
  }
}
```

### `bond.controller.ts`
```typescript
import { Body, Controller, Post } from '@nestjs/common';
import { BondService } from './bond.service';
import { CalculateBondDto } from './dto/calculate-bond.dto';

@Controller('bond')
export class BondController {
  constructor(private readonly bondService: BondService) {}

  @Post('calculate')
  calculate(@Body() dto: CalculateBondDto) {
    return this.bondService.calculate(dto);
  }
}
```

### `bond.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { BondController } from './bond.controller';
import { BondService } from './bond.service';

@Module({
  controllers: [BondController],
  providers: [BondService],
})
export class BondModule {}
```

### Update `app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { BondModule } from './bond/bond.module';

@Module({ imports: [BondModule] })
export class AppModule {}
```

### Update `main.ts` — enable CORS & validation
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:5173' });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(3000);
}
bootstrap();
```

---

## 🏃 Install class-validator

```bash
cd backend
npm install class-validator class-transformer
```

---

## ✅ Test with cURL

```bash
curl -X POST http://localhost:3000/bond/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "faceValue": 1000,
    "annualCouponRate": 0.05,
    "marketPrice": 950,
    "yearsToMaturity": 10,
    "couponFrequency": 1
  }'
```

Expected response shape:
```json
{
  "currentYield": 0.052631,
  "ytm": 0.055839,
  "totalInterestEarned": 500,
  "isPremium": false,
  "isDiscount": true,
  "cashFlowSchedule": [...]
}
```

---

## 💡 Key NestJS Concepts

| Concept | Role |
|---------|------|
| `@Module` | Groups related code together (like an Angular NgModule) |
| `@Controller` | Maps HTTP routes to handler methods |
| `@Injectable` / `@Body` | Dependency injection + request-body binding |
| `ValidationPipe` | Automatically validates & transforms DTOs on every request |
| `class-validator` | Decorator-based validators (e.g. `@IsPositive()`) |

---

## 🚀 Commit

```bash
git add backend/src/bond
git commit -m "feat(backend): add NestJS BondModule with POST /bond/calculate endpoint"
```
