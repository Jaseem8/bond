import { useState, useEffect } from 'react';
import './BondLoading.css';

interface Props {
  isTakingLonger?: boolean;
}

const MESSAGES = [
  'Initializing analytical engine...',
  'Processing yield curves...',
  'Calculating net present values...',
  'Benchmarking volatility factors...',
  'Compiling cash flow intelligence...',
  'Optimizing bisection convergence...',
];

export function BondLoading({ isTakingLonger }: Props) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bond-loading">
      <div className="loading-visual">
        <div className="radar-circle"></div>
        <div className="radar-circle delay-1"></div>
        <div className="radar-circle delay-2"></div>
        <div className="center-node">
          <span className="node-icon">📊</span>
        </div>
        <div className="scanning-line"></div>
      </div>

      <div className="loading-content">
        <h3 className="loading-title">
          {isTakingLonger ? 'Deep System Initialization' : 'Processing Intelligence'}
        </h3>
        <p className="loading-msg">
          {isTakingLonger 
            ? 'The server is waking up from standby. This usually takes 30-60 seconds on the first request.' 
            : MESSAGES[messageIndex]
          }
        </p>
      </div>

      <div className="loading-progress-bar">
        <div className="progress-fill"></div>
      </div>
    </div>
  );
}
