# Step 09 — Testing

> **Previous:** [Step 08 — Styling & UX](./step-08-styling-ux.md) | **Next:** [Step 10 — GitHub & Deployment](./step-10-github-deployment.md)

---

## 🎯 Goal

Write unit tests for the critical bond math logic and at minimum one integration-level test for the NestJS endpoint.

---

## 📚 What You'll Learn

- How Jest is already wired into NestJS projects
- How to write pure function unit tests
- Basic NestJS `supertest` endpoint testing
- Why testing the math separately from the HTTP layer is important

---

## 📁 Test Files

```
backend/
├── src/bond/
│   ├── bond.utils.spec.ts        ← pure function tests
│   └── bond.controller.spec.ts  ← HTTP layer test
```

---

## 💻 Code

### `bond.utils.spec.ts` — unit tests for math
```typescript
import { calculateBond, calculateYTM } from './bond.utils';

describe('calculateBond', () => {
  const baseInput = {
    faceValue: 1000,
    annualCouponRate: 0.05,
    marketPrice: 1000,   // at par
    yearsToMaturity: 10,
    couponFrequency: 1 as const,
  };

  it('computes currentYield correctly', () => {
    const result = calculateBond(baseInput);
    expect(result.currentYield).toBeCloseTo(0.05, 4);
  });

  it('YTM ≈ coupon rate when bond is at par', () => {
    const result = calculateBond(baseInput);
    expect(result.ytm).toBeCloseTo(0.05, 3);
  });

  it('YTM > coupon rate when bond trades at discount', () => {
    const result = calculateBond({ ...baseInput, marketPrice: 900 });
    expect(result.ytm).toBeGreaterThan(0.05);
  });

  it('YTM < coupon rate when bond trades at premium', () => {
    const result = calculateBond({ ...baseInput, marketPrice: 1100 });
    expect(result.ytm).toBeLessThan(0.05);
  });

  it('isPremium flag is true when market > face', () => {
    const result = calculateBond({ ...baseInput, marketPrice: 1050 });
    expect(result.isPremium).toBe(true);
    expect(result.isDiscount).toBe(false);
  });

  it('isDiscount flag is true when market < face', () => {
    const result = calculateBond({ ...baseInput, marketPrice: 950 });
    expect(result.isDiscount).toBe(true);
    expect(result.isPremium).toBe(false);
  });

  it('totalInterestEarned = coupon * periods', () => {
    const result = calculateBond(baseInput);
    // 1000 * 5% * 10 years = 500
    expect(result.totalInterestEarned).toBeCloseTo(500, 2);
  });

  it('cashFlowSchedule has correct number of rows', () => {
    const annual = calculateBond(baseInput);
    expect(annual.cashFlowSchedule).toHaveLength(10);

    const semiAnnual = calculateBond({ ...baseInput, couponFrequency: 2 });
    expect(semiAnnual.cashFlowSchedule).toHaveLength(20);
  });

  it('cumulative interest increases monotonically', () => {
    const { cashFlowSchedule } = calculateBond(baseInput);
    for (let i = 1; i < cashFlowSchedule.length; i++) {
      expect(cashFlowSchedule[i].cumulativeInterest).toBeGreaterThan(
        cashFlowSchedule[i - 1].cumulativeInterest,
      );
    }
  });
});
```

### `bond.controller.spec.ts` — HTTP integration test
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { BondModule } from './bond.module';

describe('POST /bond/calculate', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BondModule],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  });

  afterAll(() => app.close());

  it('returns 201 with valid inputs', () => {
    return request(app.getHttpServer())
      .post('/bond/calculate')
      .send({
        faceValue: 1000,
        annualCouponRate: 0.05,
        marketPrice: 950,
        yearsToMaturity: 10,
        couponFrequency: 1,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('ytm');
        expect(res.body).toHaveProperty('currentYield');
        expect(res.body.cashFlowSchedule).toHaveLength(10);
      });
  });

  it('returns 400 for missing fields', () => {
    return request(app.getHttpServer())
      .post('/bond/calculate')
      .send({ faceValue: 1000 })
      .expect(400);
  });

  it('returns 400 for invalid couponFrequency', () => {
    return request(app.getHttpServer())
      .post('/bond/calculate')
      .send({
        faceValue: 1000,
        annualCouponRate: 0.05,
        marketPrice: 950,
        yearsToMaturity: 10,
        couponFrequency: 4,   // invalid — only 1 or 2 allowed
      })
      .expect(400);
  });
});
```

---

## 🏃 Run Tests

```bash
cd backend
npm run test           # unit tests
npm run test:cov       # with coverage report
npm run test:e2e       # end-to-end (if configured)
```

---

## 💡 Key Concepts

| Concept | Explanation |
|---------|-------------|
| `describe` / `it` | Jest's way of grouping and naming tests |
| `toBeCloseTo` | Essential for floating-point comparisons (never use `toBe` for decimals) |
| `supertest` | Makes real HTTP requests to the NestJS app without a real server running |
| `beforeAll` | Runs once before the test suite — good for setting up the app |
| Validation test | Proves that the DTO guards actually reject bad input |

---

## 🚀 Commit

```bash
git add backend/src/bond/*.spec.ts
git commit -m "test(backend): add unit tests for bond math and HTTP endpoint"
```
