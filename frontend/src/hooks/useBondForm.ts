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
      setLoading(true);
      setError(null);
      try {
        const inputs: BondInputs = {
          faceValue: Number(form.faceValue),
          annualCouponRate: Number(form.annualCouponRate) / 100, // % → decimal
          marketPrice: Number(form.marketPrice),
          yearsToMaturity: Number(form.yearsToMaturity),
          couponFrequency: Number(form.couponFrequency) as 1 | 2,
        };
        const data = await calculateBond(inputs);
        setResults(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    },
    [form],
  );

  return { form, results, loading, error, handleChange, handleSubmit };
}
