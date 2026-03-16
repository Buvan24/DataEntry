import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="home-root">
      <div className="home-bg" />
      <div className="home-container fade-up">
        <div className="home-header">
          <div className="home-emblem">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="29" stroke="#c9a84c" strokeWidth="1.5"/>
              <circle cx="30" cy="30" r="19" stroke="rgba(201,168,76,0.3)" strokeWidth="1"/>
              <circle cx="30" cy="30" r="8" fill="#c9a84c"/>
              <path d="M30 6 L30 54 M6 30 L54 30" stroke="rgba(201,168,76,0.2)" strokeWidth="1"/>
            </svg>
          </div>
          <h1 className="home-title">Biography<br/>Management<br/>System</h1>
          <p className="home-subtitle">Secure member data management platform</p>
        </div>

        <div className="home-sep"><span>Select your role to continue</span></div>

        <div className="home-cards">
          <button className="home-card" onClick={() => navigate('/data-entry')}>
            <div className="home-card-icon">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="home-card-body">
              <div className="home-card-title">Data Entry</div>
              <div className="home-card-desc">Enter and manage member biography details</div>
            </div>
            <span className="home-card-arrow">→</span>
          </button>

          <button className="home-card home-card-admin" onClick={() => navigate('/admin/login')}>
            <div className="home-card-icon">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="home-card-body">
              <div className="home-card-title">Administrator</div>
              <div className="home-card-desc">Manage settings, reports and configuration</div>
            </div>
            <span className="home-card-arrow">→</span>
          </button>
        </div>

        <p className="home-footer">Biography Management System &copy; {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
