import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './AdminLayout.css';

const NAV = [
  { label:'Dashboard',      path:'/admin',         icon:'🏠' },
  { label:'Master Module',  path:'/admin/master',  icon:'⚙️' },
  { label:'Reports',        path:'/admin/reports', icon:'📊' },
];

export default function AdminLayout({ children, title }) {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/'); };

  return (
    <div className="al-root">
      <aside className={`al-sidebar ${open ? 'open' : ''}`}>
        <div className="al-brand">
          <div className="al-brand-icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#c9a84c" strokeWidth="2" fill="rgba(201,168,76,.2)"/>
            </svg>
          </div>
          <div>
            <div className="al-brand-name">BioManager</div>
            <div className="al-brand-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="al-nav">
          {NAV.map(n => (
            <button key={n.path}
              className={`al-link ${location.pathname.startsWith(n.path) && (n.path !== '/admin' || location.pathname === '/admin') ? 'active' : ''}`}
              onClick={() => { navigate(n.path); setOpen(false); }}>
              <span className="al-link-icon">{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>

        <div className="al-sidebar-footer">
          <button className="al-home-btn" onClick={() => { navigate('/'); setOpen(false); }}>
            🏡 &nbsp;Go to Home
          </button>
          <button className="al-logout" onClick={handleLogout}>⏻ &nbsp;Logout</button>
        </div>
      </aside>

      <div className="al-main">
        <header className="al-topbar">
          <button className="al-hamburger" onClick={() => setOpen(!open)}>☰</button>
          <h1 className="al-topbar-title">{title}</h1>
          <button className="al-topbar-home" onClick={() => navigate('/')}>🏡 Home</button>
          <div className="al-avatar">A</div>
        </header>
        <main className="al-content">{children}</main>
      </div>

      {open && <div className="al-overlay" onClick={() => setOpen(false)} />}
    </div>
  );
}
