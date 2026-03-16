import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './AdminLoginPage.css';

export default function AdminLoginPage() {
  const [form, setForm]     = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [show, setShow]     = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome, Administrator!');
      navigate('/admin');
    } catch {
      toast.error('Invalid credentials. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-root">
      <div className="login-bg" />
      <button className="login-back" onClick={() => navigate('/')}>← Back to Home</button>

      <div className="login-card fade-up">
        <div className="login-icon">
          <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#c9a84c" strokeWidth="2" fill="rgba(201,168,76,.15)"/>
          </svg>
        </div>
        <h2 className="login-title">Admin Login</h2>
        <p className="login-sub">Enter your credentials to continue</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="admin@biography.com" value={form.email}
              onChange={e => setForm({...form, email:e.target.value})} required autoFocus/>
          </div>
          <div className="form-group" style={{position:'relative'}}>
            <label>Password</label>
            <input type={show?'text':'password'} placeholder="••••••••" value={form.password}
              onChange={e => setForm({...form, password:e.target.value})} required/>
            <button type="button" className="pwd-toggle" onClick={() => setShow(!show)}>{show?'🙈':'👁'}</button>
          </div>
          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <div className="login-hint">
          <span>Default credentials:</span>
          <code>admin@biography.com / Admin@123</code>
        </div>
      </div>
    </div>
  );
}
