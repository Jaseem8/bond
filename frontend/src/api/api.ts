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
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      throw new Error('Server is taking longer to respond than expected. It might be waking up from sleep (Render Free Tier). Please wait 30 seconds and try again.');
    }
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('An unexpected error occurred during calculation');
  }
}

/**
 * Simple GET call to "warm up" the server (Render Free Tier)
 */
export async function pingServer(): Promise<void> {
  try {
    await fetch(BASE_URL, { method: 'GET' });
  } catch (err) {
    // Silently fail as this is just a warm-up call
    console.log('Warm-up call delayed or failed: server is likely sleeping.');
  }
}

