import type { BondInputs, BondResults } from '../types/bond.types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function calculateBond(inputs: BondInputs): Promise<BondResults> {
  try {
    const response = await fetch(`${BASE_URL}/bond/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs),
    });

    // Handle HTTP errors (4xx, 5xx)
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const msg = Array.isArray(error?.message)
        ? error.message.join(', ')
        : (error?.message ?? 'Calculation failed');
      throw new Error(msg);
    }

    // Handle successful response
    return await response.json();
  } catch (err) {
    // This catches network errors AND the errors we throw above
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('An unexpected error occurred during calculation');
  }
}

