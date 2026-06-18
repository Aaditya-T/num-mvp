import { useState } from 'react';

export default function PinLockScreen({ onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const msgBuffer = new TextEncoder().encode(pin);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Check SHA-256 hash for 3737
      if (hash === 'f021014960c5f61b68f18f5ec06e3d02982b069f2230cc120b6ca3061868d6e2') { // 3737
        sessionStorage.setItem('operator_authenticated', 'true');
        onSuccess();
      } else {
        setError('Incorrect PIN. Access Denied.');
        setPin('');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pin-lock-overlay">
      <div className="pin-lock-card">
        <div className="pin-lock-header">
          <div className="lock-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="lock-icon-svg" style={{ width: '28px', height: '28px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2>Operator Portal</h2>
          <p>This section is restricted. Please enter the Operator PIN to proceed.</p>
        </div>
        <form onSubmit={handleSubmit} className="pin-lock-form">
          <div className="pin-input-group">
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              autoFocus
              disabled={isLoading}
              className="pin-digit-input"
            />
          </div>
          {error && <div className="pin-error-msg">{error}</div>}
          <button type="submit" disabled={isLoading || pin.length < 4} className="pin-submit-btn">
            {isLoading ? 'Verifying...' : 'Unlock Portal'}
          </button>
        </form>
      </div>
    </div>
  );
}
