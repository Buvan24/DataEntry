import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminLayout from '../components/Layout/AdminLayout';
import { reportAPI, masterAPI } from '../utils/api';
import './ReportsPage.css';

export default function ReportsPage() {
  const [searchParams] = useSearchParams();
  const [tab,     setTab]     = useState(searchParams.get('type') || 'biography');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [bioSearch, setBioSearch] = useState('');
  const [filters,  setFilters]  = useState({ district:'', assembly:'', administration:'', position:'', area:'', union:'' });
  const [masters,  setMasters]  = useState({ districts:[], assemblies:[], administrations:[], positions:[], areas:[], unions:[] });

  useEffect(() => { loadMasters(); }, []);

  const loadMasters = async () => {
    try {
      const [d,a,adm,p,ar,u] = await Promise.all([
        masterAPI.districts.getAll(), masterAPI.assemblies.getAll(),
        masterAPI.administrations.getAll(), masterAPI.positions.getAll(),
        masterAPI.areas.getAll(), masterAPI.unions.getAll(),
      ]);
      setMasters({ districts:d.data, assemblies:a.data, administrations:adm.data, positions:p.data, areas:ar.data, unions:u.data });
    } catch {}
  };

  const generate = async () => {
    setLoading(true);
    try {
      let res;
      if (tab==='biography') {
        res = await reportAPI.biography({ search:bioSearch });
      } else {
        const params = {};
        Object.entries(filters).forEach(([k,v]) => { if(v) params[k]=v; });
        res = await reportAPI.category(params);
      }
      setMembers(res.data);
      setGenerated(true);
      if (res.data.length===0) toast('No records found for selected filters.');
    } catch { toast.error('Failed to generate report'); }
    finally { setLoading(false); }
  };

  const setF = (k,v) => setFilters(f=>({...f,[k]:v}));

  const clearFilters = () => { setFilters({ district:'', assembly:'', administration:'', position:'', area:'', union:'' }); setBioSearch(''); setMembers([]); setGenerated(false); };

  const FILTER_FIELDS = [
    { label:'District',       key:'district',       opts:masters.districts },
    { label:'Union',          key:'union',          opts:masters.unions },
    { label:'Assembly',       key:'assembly',       opts:masters.assemblies },
    { label:'Area',           key:'area',           opts:masters.areas },
    { label:'Administration', key:'administration', opts:masters.administrations },
    { label:'Position',       key:'position',       opts:masters.positions },
  ];

  return (
    <AdminLayout title="Reports">
      <div className="rp-tabs">
        <button className={`rp-tab ${tab==='biography'?'active':''}`} onClick={()=>{setTab('biography');setMembers([]);setGenerated(false);}}>
          📋 Biography Report
        </button>
        <button className={`rp-tab ${tab==='category'?'active':''}`} onClick={()=>{setTab('category');setMembers([]);setGenerated(false);}}>
          📊 Category Wise Report
        </button>
      </div>

      <div className="card rp-filter-card">
        <h3 className="rp-filter-title">{tab==='biography'?'Search Members':'Apply Filters'}</h3>
        {tab==='biography' ? (
          <div className="rp-bio-row">
            <input type="text" className="rp-search-input" placeholder="Search by name, phone, or voter ID (leave blank for all)..."
              value={bioSearch} onChange={e=>setBioSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&generate()}/>
          </div>
        ) : (
          <div className="form-grid-3">
            {FILTER_FIELDS.map(f=>(
              <div className="form-group" key={f.key}>
                <label>{f.label}</label>
                <select value={filters[f.key]} onChange={e=>setF(f.key,e.target.value)}>
                  <option value="">All {f.label}s</option>
                  {f.opts.map(o=><option key={o._id} value={o._id}>{o.name}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}
        <div className="rp-filter-actions">
          <button className="btn btn-primary" onClick={generate} disabled={loading}>
            {loading?'⏳ Generating...':'📊 Generate Report'}
          </button>
          {generated && <button className="btn btn-outline" onClick={clearFilters}>✕ Clear</button>}
          {members.length>0 && <button className="btn btn-outline" onClick={()=>window.print()}>🖨 Print</button>}
        </div>
      </div>

      {loading && <div className="spinner"/>}

      {!loading && generated && members.length>0 && (
        <div className="rp-results fade-up">
          <div className="rp-results-header">
            <div>
              <div className="section-title" style={{fontSize:17}}>{tab==='biography'?'Biography Report':'Category Wise Report'}</div>
              <div className="section-subtitle" style={{marginBottom:0}}>{members.length} member{members.length!==1?'s':''} found</div>
            </div>
            <div className="rp-export-btns">
              <button className="btn btn-outline btn-sm" onClick={()=>window.print()}>🖨 Print</button>
            </div>
          </div>

          <div className="card" style={{padding:0,overflow:'hidden'}}>
            <div className="rp-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{width:45}}>#</th>
                    <th>Name</th>
                    <th>Father Name</th>
                    <th>Phone</th>
                    <th>Voter ID</th>
                    <th>District</th>
                    <th>Assembly</th>
                    <th>Administration</th>
                    <th>Position</th>
                    <th>Join Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m,i)=>(
                    <tr key={m._id}>
                      <td style={{color:'var(--text-muted)',fontWeight:600,fontSize:12}}>{i+1}</td>
                      <td style={{fontWeight:600}}>{m.name}</td>
                      <td style={{color:'var(--text-secondary)'}}>{m.fatherName||'—'}</td>
                      <td>{m.phone||'—'}</td>
                      <td style={{fontSize:12,color:'var(--text-secondary)'}}>{m.voterId||'—'}</td>
                      <td>{m.district?.name||'—'}</td>
                      <td>{m.assembly?.name||'—'}</td>
                      <td>{m.administration?.name||'—'}</td>
                      <td>{m.position?.name?<span className="badge badge-gold">{m.position.name}</span>:'—'}</td>
                      <td style={{fontSize:12}}>{m.joinDate?new Date(m.joinDate).toLocaleDateString('en-IN'):'—'}</td>
                      <td>{m.resignDate?<span className="badge" style={{background:'#fff0f0',color:'#c0392b'}}>Resigned</span>:<span className="badge badge-green">Active</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!loading && !generated && (
        <div className="empty-state">
          <div className="es-icon">📊</div>
          <p>Use the filters above and click "Generate Report" to view member data.</p>
        </div>
      )}
    </AdminLayout>
  );
}
