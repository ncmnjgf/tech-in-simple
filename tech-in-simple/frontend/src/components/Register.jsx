import React, { useState } from 'react';

const Register = ({ setToken, setView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration Failed");
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setView('explain');
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="brutal-card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2 style={{ borderBottom: '4px solid #000', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>REGISTER</h2>
      {err && <p style={{color: 'red', fontWeight: 'bold', marginBottom: '1rem'}}>{err}</p>}
      <label className="label-title">Username</label>
      <input className="brutal-input" placeholder="Choose a username" value={username} onChange={e => setUsername(e.target.value)} />
      
      <label className="label-title" style={{marginTop: '1rem', display: 'block'}}>Password</label>
      <input className="brutal-input" type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} />
      
      <button className="brutal-btn" style={{marginTop: '1.5rem', width: '100%', background: '#000', color: '#fff'}}>CREATE ACCOUNT</button>
      <p style={{marginTop: '1.5rem', textAlign: 'center', fontWeight: '500'}}>
        Already registered? <span style={{textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => setView('login')}>Sign In Here</span>
      </p>
    </form>
  );
};

export default Register;
