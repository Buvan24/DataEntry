import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/Layout/AdminLayout';
import { reportAPI } from '../utils/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    reportAPI.stats().then(r => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="dash-welcome fade-up">
        <div>
          <h2 className="section-title">Welcome, Administrator 👋</h2>
          <p className="section-subtitle">Manage system configuration and generate reports</p>
        </div>
        {stats && (
          <div className="dash-stat-pill">
            <div className="dash-stat-num">{stats.total}</div>
            <div className="dash-stat-lbl">Total Members</div>
          </div>
        )}
      </div>

      {/* Stats bar chart */}
      {stats && stats.byDistrict && stats.byDistrict.filter(d=>d.name).length > 0 && (
        <div className="card dash-district-bar" style={{marginBottom:28}}>
          <div style={{fontFamily:'var(--font-display)',fontSize:16,fontWeight:700,color:'var(--primary)',marginBottom:14}}>Members by District</div>
          <div className="dash-bars">
            {stats.byDistrict.filter(d=>d.name).slice(0,8).map((d,i) => (
              <div key={i} className="dash-bar-item">
                <div className="dash-bar-label">{d.name}</div>
                <div className="dash-bar-track">
                  <div className="dash-bar-fill" style={{width:`${Math.min(100,(d.count/(stats.total||1))*100)}%`}}/>
                </div>
                <div className="dash-bar-count">{d.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Master Module - single card */}
      <div className="dash-section-lbl"><span className="badge badge-gold">MASTER MODULE</span></div>
      <div className="dash-single-card card" onClick={() => navigate('/admin/master')}>
        <div className="dash-sc-left">
          <div className="dash-sc-icon">⚙️</div>
          <div>
            <div className="dash-sc-title">Master Module</div>
            <div className="dash-sc-sub">Manage District · Union · Assembly · Area · Administration · Position</div>
          </div>
        </div>
        <div className="dash-sc-arrow">→</div>
      </div>

      {/* Reports */}
      <div className="dash-section-lbl" style={{marginTop:24}}><span className="badge badge-green">REPORTS</span></div>
      <div className="dash-reports-grid">
        <button className="dash-report-card" onClick={() => navigate('/admin/reports?type=biography')}>
          <div className="dash-report-icon">📋</div>
          <div>
            <div className="dash-report-title">Biography Report</div>
            <div className="dash-report-sub">Search &amp; view full member details</div>
          </div>
          <span className="dash-report-arrow">→</span>
        </button>
        <button className="dash-report-card" onClick={() => navigate('/admin/reports?type=category')}>
          <div className="dash-report-icon">📊</div>
          <div>
            <div className="dash-report-title">Category Wise Report</div>
            <div className="dash-report-sub">Filter by District / Assembly / Position</div>
          </div>
          <span className="dash-report-arrow">→</span>
        </button>
      </div>
    </AdminLayout>
  );
}
