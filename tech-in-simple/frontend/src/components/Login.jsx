import React, { useState } from 'react';

const Login = ({ setToken, setView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login Failed");
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setView('explain');
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="brutal-card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2 style={{ borderBottom: '4px solid #000', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>LOGIN</h2>
      {err && <p style={{color: 'red', fontWeight: 'bold', marginBottom: '1rem'}}>{err}</p>}
      <label className="label-title">Username</label>
      <input className="brutal-input" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
      
      <label className="label-title" style={{marginTop: '1rem', display: 'block'}}>Password</label>
      <input className="brutal-input" type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
      
      <button className="brutal-btn" style={{marginTop: '1.5rem', width: '100%'}}>SIGN IN</button>
      <p style={{marginTop: '1.5rem', textAlign: 'center', fontWeight: '500'}}>
        No account? <span style={{textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => setView('register')}>Register Here</span>
      </p>
    </form>
  );
};

export default Login;
