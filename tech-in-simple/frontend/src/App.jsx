import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import Result from './components/Result';
import SavedTopics from './components/SavedTopics';
import Login from './components/Login';
import Register from './components/Register';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('Teacher');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // Auth state
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [view, setView] = useState(token ? 'explain' : 'login'); 
  const [saving, setSaving] = useState(false);
  
  // UX State
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const displayMessage = (msg, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 5000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleExplain = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setResult(null);
    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      const response = await fetch(`${API_BASE}/api/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, style, language })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Network error');
      
      if (data.one_liner) data.oneLine = data.one_liner;
      
      data.topic = topic;
      setResult(data);
    } catch (err) {
      displayMessage('Failed to explain: ' + err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTopic = async () => {
    if (!result || !result.topic) return;
    setSaving(true);
    try {
      const payload = {
        topic: result.topic,
        responses: {
          kid: result.kid, student: result.student, interview: result.interview,
          analogy: result.analogy, one_liner: result.oneLine 
        }
      };
      
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE}/api/save`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        displayMessage("Explanation saved successfully to your history!");
      } else {
        displayMessage("Failed to save topic.", true);
      }
    } catch (err) {
      displayMessage("Error saving topic.", true);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setView('login');
    displayMessage("Logged out successfully");
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            onClick={() => token ? setView('explain') : setView('login')}
          >
            <Sparkles size={44} strokeWidth={3} /> TECH IN SIMPLE
          </h1>
          <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>Uncomplicating complex concepts. Brutally simple.</p>
        </div>
        
        {token && (
          <div className="header-actions">
            <button 
              className="brutal-btn" 
              onClick={() => { setView(view === 'explain' ? 'saved' : 'explain'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{ background: view === 'explain' ? '#fff' : '#000', color: view === 'explain' ? '#000' : '#fff' }}
            >
              {view === 'explain' ? 'VIEW SAVED HISTORY' : 'BACK TO SEARCH'}
            </button>
            <button 
              className="brutal-btn" 
              onClick={handleLogout}
              style={{ background: '#000', color: '#fff' }}
            >
              LOGOUT
            </button>
          </div>
        )}
      </header>

      {/* Global Toast Messages */}
      {errorMsg && <div className="brutal-card" style={{ background: '#000', color: '#fff', border: '5px solid #000', padding: '1rem', fontWeight: 900, marginBottom: '2rem' }}>⚠️ {errorMsg}</div>}
      {successMsg && <div className="brutal-card" style={{ background: '#fff', color: '#000', border: '5px solid #000', padding: '1rem', fontWeight: 900, marginBottom: '2rem' }}>✅ {successMsg}</div>}

      <main>
        {view === 'login' && <Login setToken={setToken} setView={setView} displayMessage={displayMessage} />}
        {view === 'register' && <Register setToken={setToken} setView={setView} displayMessage={displayMessage} />}
        
        {view === 'explain' && (
          <>
            <form onSubmit={handleExplain} className="brutal-card">
              <div className="form-row">
                <div style={{ flex: 2 }}>
                  <label className="label-title" htmlFor="topic">Topic to Explain</label>
                  <input id="topic" type="text" className="brutal-input" placeholder="e.g. React Hooks, Docker" value={topic} onChange={(e) => setTopic(e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label-title" htmlFor="style">Explanation Style</label>
                  <select id="style" className="brutal-select" style={{ width: '100%' }} value={style} onChange={(e) => setStyle(e.target.value)}>
                    <option value="Teacher">Teacher (Structured)</option>
                    <option value="Funny">Funny (Witty)</option>
                    <option value="Friend">Friend (Casual)</option>
                    <option value="One-line">One-line (Concise)</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label-title" htmlFor="language">Language</label>
                  <select id="language" className="brutal-select" style={{ width: '100%' }} value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Japanese">Japanese</option>
                    <option value="German">German</option>
                    <option value="French">French</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="brutal-btn" style={{ width: '100%' }} disabled={loading || !topic.trim()}>
                {loading ? <><Loader2 className="animate-spin" /> SYNTHESIZING...</> : 'EXPLAIN COMPREHENSIVELY'}
              </button>
            </form>

            {loading && <div style={{ textAlign: 'center', marginTop: '3rem' }}><h2 className="animate-pulse">Synthesizing explanations...</h2></div>}

            {!loading && result && (
              <>
                 <Result data={result} />
                 <button onClick={handleSaveTopic} disabled={saving} style={{ width: '100%', marginTop: '1.5rem', background: '#000', color: '#fff', border: '5px solid #000', padding: '1.2rem', fontSize: '1.5rem', fontWeight: 900, cursor: 'pointer' }}>
                   {saving ? 'SAVING...' : '💾 SAVE THIS EXPLANATION'}
                 </button>
              </>
            )}
          </>
        )}

        {view === 'saved' && <SavedTopics />}
      </main>
    </div>
  );
}

export default App;
