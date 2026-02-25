import { useState, useCallback } from 'react';
import type { BondInputs, BondResults } from '../types/bond.types';
import { calculateBond } from '../api/api';

interface FormState {
  faceValue: string;
  annualCouponRate: string;
  marketPrice: string;
  yearsToMaturity: string;
  couponFrequency: '1' | '2';
}

const initialForm: FormState = {
  faceValue: '1000',
  annualCouponRate: '5',
  marketPrice: '950',
  yearsToMaturity: '10',
  couponFrequency: '1',
};

export function useBondForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [results, setResults] = useState<BondResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [takingLonger, setTakingLonger] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Basic Frontend Validation & Sanitization
      const faceVal = Number(form.faceValue);
      const coupon = Number(form.annualCouponRate);
      const price = Number(form.marketPrice);
      const years = Number(form.yearsToMaturity);

      if (faceVal <= 0 || price <= 0 || years <= 0) {
        setError('Values must be greater than zero.');
        return;
      }
      
      if (years > 100) {
        setError('Maximum maturity is 100 years.');
        return;
      }

      if (faceVal > 1_000_000_000 || price > 1_000_000_000) {
        setError('Values are too large for calculation.');
        return;
      }

      setLoading(true);
      setTakingLonger(false);
      setError(null);

      // Show "Waking up" message after 3 seconds
      const timer = setTimeout(() => setTakingLonger(true), 3000);
      
      try {
        const inputs: BondInputs = {
          faceValue: faceVal,
          annualCouponRate: coupon / 100, // % → decimal
          marketPrice: price,
          yearsToMaturity: years,
          couponFrequency: Number(form.couponFrequency) as 1 | 2,
        };
        const data = await calculateBond(inputs);
        setResults(data);
      } catch (err: unknown) {
        // Sanitize error message to prevent XSS or detail leakage
        const rawMsg = err instanceof Error ? err.message : 'Something went wrong';
        setError(rawMsg.replace(/<[^>]*>?/gm, '')); // Simple sanitization
      } finally {
        clearTimeout(timer);
        setLoading(false);
        setTakingLonger(false);
      }
    },
    [form],
  );

  return { form, results, loading, takingLonger, error, handleChange, handleSubmit };
}
