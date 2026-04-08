import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

const Result = ({ data }) => {
  const [simplifications, setSimplifications] = useState({});
  const [elaborations, setElaborations] = useState({});
  const [loadingKey, setLoadingKey] = useState(null);
  const [elaboratingKey, setElaboratingKey] = useState(null);

  if (!data) return null;

  const handleSimplify = async (key, text) => {
    setLoadingKey(key);
    try {
      const response = await fetch('http://localhost:5000/api/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const result = await response.json();
      if (result.simplified) {
        setSimplifications(prev => ({ ...prev, [key]: result.simplified }));
      }
    } catch (err) {
      alert('Failed to simplify');
    }
    setLoadingKey(null);
  };

  const handleElaborate = async (key, text) => {
    setElaboratingKey(key);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE}/api/elaborate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, topic: data.topic })
      });
      const result = await response.json();
      if (result.elaboration) {
        setElaborations(prev => ({ ...prev, [key]: result.elaboration }));
      }
    } catch (err) {
      alert('Failed to elaborate');
    }
    setElaboratingKey(null);
  };

  const renderCard = (key, title, emoji, borderStyle = 'solid', bg = '#fff', color = '#000') => {
    const text = simplifications[key] || data[key] || data.oneLine; // fallback for oneLine
    const actualText = key === 'oneLine' && !data[key] ? data.oneLine : text;
    // For original string, use data[key] or data.oneLine
    const originalText = key === 'oneLine' ? data.oneLine : data[key];

    return (
      <div className="brutal-card interactive" style={{ borderStyle, background: bg, color: color, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <span className="brutal-badge" style={bg === '#000' ? { background: '#fff', color: '#000', border: 'none' } : {}}>
            {emoji} {title}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              type="button"
              onClick={() => handleSimplify(key, originalText)}
              disabled={loadingKey === key || elaboratingKey === key}
              style={{
                background: bg === '#000' ? '#fff' : '#000',
                color: bg === '#000' ? '#000' : '#fff',
                border: '2px solid #000',
                padding: '0.25rem 0.5rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.8rem'
              }}
            >
              {loadingKey === key ? <RefreshCw size={14} className="animate-spin" /> : 'MAKE SIMPLER'}
            </button>
            <button 
              type="button"
              onClick={() => handleElaborate(key, originalText)}
              disabled={elaboratingKey === key || loadingKey === key}
              style={{
                background: bg === '#000' ? '#000' : '#fff',
                color: bg === '#000' ? '#fff' : '#000',
                border: bg === '#000' ? '2px solid #fff' : '2px solid #000',
                padding: '0.25rem 0.5rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.8rem'
              }}
            >
              {elaboratingKey === key ? <RefreshCw size={14} className="animate-spin" /> : 'ASK WHY?'}
            </button>
          </div>
        </div>
        <p style={{ fontSize: '1.15rem', fontWeight: 500, marginTop: '1rem' }}>{actualText}</p>
        
        {elaborations[key] && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: `4px solid ${color}` }}>
            <strong style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>🧠 DEEP DIVE LOGIC:</strong>
            <p style={{ fontSize: '1.05rem', fontWeight: 400, opacity: 0.95 }}>{elaborations[key]}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="result-container" style={{ marginTop: '3rem' }}>
      <h2 style={{ borderBottom: '4px solid #000', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'inline-block' }}>
        Explanation Unlocked
      </h2>

      {renderCard('kid', 'Kid Level', '🟢')}
      {renderCard('student', 'Student Level', '🟡')}
      {renderCard('interview', 'Interview Level', '🔴')}
      {renderCard('analogy', 'Real-Life Analogy', '💡', 'solid', '#000', '#fff')}
      {renderCard('oneLine', 'One-Liner', '⚡', 'dashed')}
    </div>
  );
};

export default Result;
