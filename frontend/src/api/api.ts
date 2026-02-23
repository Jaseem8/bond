import type { BondInputs, BondResults } from '../types/bond.types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function calculateBond(inputs: BondInputs): Promise<BondResults> {
  const response = await fetch(`${BASE_URL}/bond/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputs),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const msg = Array.isArray(error?.message)
      ? error.message.join(', ')
      : (error?.message ?? 'Calculation failed');
    throw new Error(msg);
  }

  return response.json();
}
