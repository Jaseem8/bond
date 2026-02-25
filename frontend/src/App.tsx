import { useEffect, useState } from 'react';
import { BondForm } from './components/BondForm/BondForm';
import { BondResults } from './components/BondResults/BondResults';
import { BondLoading } from './components/BondLoading/BondLoading';
import { useBondForm } from './hooks/useBondForm';
import { pingServer } from './api/api';
import './App.css';

export default function App() {
  const { form, results, loading, takingLonger, error, handleChange, handleSubmit: originalHandleSubmit } =
    useBondForm();
  
  const [activeTab, setActiveTab] = useState<'form' | 'results'>('form');

  // Auto-switch to results tab on mobile when submitting
  const handleSubmit = async (e: React.FormEvent) => {
    await originalHandleSubmit(e);
    if (window.innerWidth <= 860) {
      setActiveTab('results');
    }
  };

  // "Wake up" the backend immediately on mount (Render Free Tier)
  useEffect(() => {
    pingServer();
  }, []);

  return (
    <div className="app">
      {/* ── Compact single-bar header ── */}
      <header className="app-header">
        <div className="header-left">
          <span className="logo-icon">🌐</span>
          <span className="logo-text">BondSphere</span>
          <span className="header-title">Precision Yield Analytics</span>
        </div>
        {/* <span className="header-badge">TypeScript · React · NestJS</span> */}
      </header>

      {/* ── Two-column main — fills exactly the remaining vh ── */}
      <main className={`app-main active-tab-${activeTab}`}>
        <aside className="form-col">
          <BondForm
            form={form}
            loading={loading}
            takingLonger={takingLonger}
            error={error}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </aside>

        <section className="results-col">
          {loading ? (
            <BondLoading isTakingLonger={takingLonger} />
          ) : results ? (
            <BondResults results={results} />
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔭</div>
              <h3>Configure Instrument</h3>
              <p>
                Enter the bond specifications on the left to begin 
                <strong> Intelligence Analysis</strong>.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* ── Mobile Navigation Bar ── */}
      <nav className="mobile-nav">
        <button 
          className={`nav-item ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          <span className="nav-icon">⚙️</span>
          <span className="nav-text">Configure</span>
        </button>
        <button 
          className={`nav-item ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          <span className="nav-icon">📈</span>
          <span className="nav-text">Performance</span>
        </button>
      </nav>
    </div>
  );
}
