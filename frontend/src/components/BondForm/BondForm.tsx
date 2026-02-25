import React from 'react';
import './BondForm.css';

interface Props {
  form: {
    faceValue: string;
    annualCouponRate: string;
    marketPrice: string;
    yearsToMaturity: string;
    couponFrequency: '1' | '2';
  };
  loading: boolean;
  takingLonger?: boolean;
  error: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function BondForm({ form, loading, takingLonger, error, onChange, onSubmit }: Props) {
  return (
    <form className="bond-form" onSubmit={onSubmit} noValidate>
      <div className="form-header">
        <span className="form-icon">📑</span>
        <h2>Instrument Configuration</h2>
      </div>

      <div className="form-fields">
        <label className="form-label">
          <span className="label-text">Face Value ($)</span>
          <input
            type="number"
            name="faceValue"
            value={form.faceValue}
            onChange={onChange}
            min={1}
            required
            placeholder="e.g. 1000"
            className="form-input"
          />
        </label>

        <label className="form-label">
          <span className="label-text">Annual Coupon Rate (%)</span>
          <input
            type="number"
            name="annualCouponRate"
            value={form.annualCouponRate}
            onChange={onChange}
            min={0}
            max={100}
            step={0.01}
            required
            placeholder="e.g. 5"
            className="form-input"
          />
        </label>

        <label className="form-label">
          <span className="label-text">Market Price ($)</span>
          <input
            type="number"
            name="marketPrice"
            value={form.marketPrice}
            onChange={onChange}
            min={1}
            required
            placeholder="e.g. 950"
            className="form-input"
          />
        </label>

        <label className="form-label">
          <span className="label-text">Years to Maturity</span>
          <input
            type="number"
            name="yearsToMaturity"
            value={form.yearsToMaturity}
            onChange={onChange}
            min={1}
            max={100}
            required
            placeholder="e.g. 10"
            className="form-input"
          />
        </label>

        <label className="form-label">
          <span className="label-text">Coupon Frequency</span>
          <select
            name="couponFrequency"
            value={form.couponFrequency}
            onChange={onChange}
            className="form-select"
          >
            <option value="1">Annual (1×/year)</option>
            <option value="2">Semi-Annual (2×/year)</option>
          </select>
        </label>
      </div>

      {error && <p className="form-error">⚠ {error}</p>}

      <button type="submit" className="form-submit" disabled={loading}>
        {loading ? (
          <span className="btn-loading">
            <span className="spinner" />
            {takingLonger ? 'Waking up server…' : 'Calculating…'}
          </span>
        ) : (
          '⚡ Calculate'
        )}
      </button>

      {loading && takingLonger && (
        <p className="loading-note">
          ☕ The server is waking up after being idle. This may take up to 60 seconds.
        </p>
      )}
    </form>
  );
}
