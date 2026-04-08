import React, { useEffect, useState } from 'react';

const SavedTopics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/saved', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        
        if (res.ok) {
            setTopics(data);
        } else {
            console.error("Failed to fetch topics:", data.error);
        }
      } catch (err) {
        console.error("Failed to fetch topics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const handleRemove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/saved/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setTopics(topics.filter(t => t._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading saved topics...</div>;
  }

  if (topics.length === 0) {
    return <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.5rem', fontWeight: 'bold' }}>No saved topics yet. Go learn something!</div>;
  }

  return (
    <div className="saved-topics">
      <h2 style={{ borderBottom: '4px solid #000', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'inline-block' }}>
        Saved Explanations History
      </h2>
      <div className="brutal-grid">
        {topics.map((t) => (
          <div key={t._id} className="brutal-card" style={{ marginBottom: '0', position: 'relative' }}>
            <button 
              onClick={() => handleRemove(t._id)}
              style={{
                position: 'absolute',
                top: '-0.5rem',
                right: '-0.5rem',
                background: '#fff',
                color: '#000',
                border: '4px solid #000',
                padding: '0.2rem 0.6rem',
                fontSize: '1rem',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '4px 4px 0 #000',
                transition: 'all 0.1s'
              }}
              onMouseEnter={(e) => { e.target.style.background = '#000'; e.target.style.color = '#fff'; e.target.style.transform = 'translate(-2px, -2px)'; e.target.style.boxShadow = '6px 6px 0 #fff' }}
              onMouseLeave={(e) => { e.target.style.background = '#fff'; e.target.style.color = '#000'; e.target.style.transform = 'translate(0, 0)'; e.target.style.boxShadow = '4px 4px 0 #000' }}
            >
              X
            </button>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', paddingRight: '2rem' }}>{t.topic}</h3>
            
            <div style={{ marginBottom: '0.5rem' }}>
              <span className="brutal-badge" style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', marginBottom: '0.5rem', display: 'inline-block' }}>⚡ One-Liner</span>
              <p style={{ fontWeight: 500 }}>{t.responses?.one_liner || t.responses?.oneLine}</p>
            </div>

            <div>
              <span className="brutal-badge" style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', marginBottom: '0.5rem', display: 'inline-block', background: '#000', color: '#fff' }}>💡 Analogy</span>
              <p style={{ fontWeight: 500 }}>{t.responses?.analogy}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedTopics;
