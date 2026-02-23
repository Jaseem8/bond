import { BondForm } from './components/BondForm/BondForm';
import { BondResults } from './components/BondResults/BondResults';
import { useBondForm } from './hooks/useBondForm';
import './App.css';

export default function App() {
  const { form, results, loading, error, handleChange, handleSubmit } =
    useBondForm();

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
      <main className="app-main">
        <aside className="form-col">
          <BondForm
            form={form}
            loading={loading}
            error={error}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </aside>

        <section className="results-col">
          {results ? (
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
    </div>
  );
}
