import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminLayout from '../components/Layout/AdminLayout';
import { masterAPI } from '../utils/api';
import './MasterPage.css';

const TABS = [
  { key: 'districts',      label: 'District',        icon: '🗺️' },
  { key: 'unions',         label: 'Union',            icon: '🔗' },
  { key: 'assemblies',     label: 'Assembly',         icon: '🏛️' },
  { key: 'areas',          label: 'Area',             icon: '📍' },
  { key: 'administrations',label: 'Administration',   icon: '⚙️' },
  { key: 'positions',      label: 'Position',         icon: '👤' },
];

// Cascading parent fields per type
const PARENTS = {
  districts:       [],
  unions:          ['district'],
  assemblies:      ['district','union'],
  areas:           ['district','union','assembly'],
  administrations: ['district','union','assembly','area'],
  positions:       [],
};

const PARENT_LABELS = { district:'District', union:'Union', assembly:'Assembly', area:'Area' };

export default function MasterPage() {
  const navigate  = useNavigate();
  const [tab,     setTab]     = useState('districts');
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(false);

  // All master data for dropdowns
  const [allData, setAllData] = useState({ districts:[], unions:[], assemblies:[], areas:[] });

  // Form state
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState({ name:'', district:'', union:'', assembly:'', area:'' });
  const [saving,  setSaving]  = useState(false);
  const [delItem, setDelItem] = useState(null);
  const [search,  setSearch]  = useState('');

  // Cascaded dropdown options
  const [opts, setOpts] = useState({ unions:[], assemblies:[], areas:[] });

  // Load master lookup data
  useEffect(() => {
    masterAPI.districts.getAll().then(r => setAllData(p => ({...p, districts: r.data}))).catch(()=>{});
  }, []);

  // When district changes in form, load unions
  useEffect(() => {
    if (form.district) {
      masterAPI.unions.getAll({ district: form.district })
        .then(r => setOpts(p => ({...p, unions: r.data, assemblies:[], areas:[] })))
        .catch(()=>{});
    } else {
      setOpts(p => ({...p, unions:[], assemblies:[], areas:[]}));
    }
  }, [form.district]);

  // When union changes in form, load assemblies
  useEffect(() => {
    if (form.union) {
      masterAPI.assemblies.getAll({ district: form.district, union: form.union })
        .then(r => setOpts(p => ({...p, assemblies: r.data, areas:[] })))
        .catch(()=>{});
    } else {
      setOpts(p => ({...p, assemblies:[], areas:[]}));
    }
  }, [form.union]);

  // When assembly changes in form, load areas
  useEffect(() => {
    if (form.assembly) {
      masterAPI.areas.getAll({ district: form.district, union: form.union, assembly: form.assembly })
        .then(r => setOpts(p => ({...p, areas: r.data })))
        .catch(()=>{});
    } else {
      setOpts(p => ({...p, areas:[]}));
    }
  }, [form.assembly]);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const r = await masterAPI[tab].getAll();
      setItems(r.data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [tab]);

  useEffect(() => { loadItems(); setSearch(''); }, [tab]);

  const openAdd = () => {
    setEditing(null);
    setForm({ name:'', district:'', union:'', assembly:'', area:'' });
    setModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name:     item.name || '',
      district: item.district?._id || item.district || '',
      union:    item.union?._id    || item.union    || '',
      assembly: item.assembly?._id || item.assembly || '',
      area:     item.area?._id     || item.area     || '',
    });
    setModal(true);
  };

  const setF = (k, v) => {
    setForm(prev => {
      const next = {...prev, [k]: v};
      // Reset children when parent changes
      if (k === 'district') { next.union=''; next.assembly=''; next.area=''; }
      if (k === 'union')    { next.assembly=''; next.area=''; }
      if (k === 'assembly') { next.area=''; }
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const parents = PARENTS[tab];
      const payload = { name: form.name.trim() };
      parents.forEach(p => { if (form[p]) payload[p] = form[p]; });

      if (editing) {
        await masterAPI[tab].update(editing._id, payload);
        toast.success(`${TABS.find(t=>t.key===tab).label} updated!`);
      } else {
        await masterAPI[tab].create(payload);
        toast.success(`${TABS.find(t=>t.key===tab).label} added!`);
      }
      setModal(false);
      loadItems();
      // Reload allData if district was changed
      if (tab==='districts') masterAPI.districts.getAll().then(r=>setAllData(p=>({...p,districts:r.data}))).catch(()=>{});
    } catch (e) { toast.error(e.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await masterAPI[tab].delete(id);
      toast.success('Deleted successfully');
      setDelItem(null);
      loadItems();
    } catch { toast.error('Delete failed'); }
  };

  const parents = PARENTS[tab];
  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  const currentTab = TABS.find(t => t.key === tab);

  // Helper to get display name for parent fields in table
  const getParentName = (item, key) => item[key]?.name || '—';

  return (
    <AdminLayout title="Master Module">
      {/* Tab Bar */}
      <div className="mp-tabs">
        {TABS.map(t => (
          <button key={t.key} className={`mp-tab ${tab===t.key?'active':''}`}
            onClick={() => setTab(t.key)}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="mp-header">
        <div>
          <h2 className="section-title">{currentTab.icon} {currentTab.label} Management</h2>
          <p className="section-subtitle">{filtered.length} record{filtered.length!==1?'s':''} found</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add {currentTab.label}</button>
      </div>

      {/* Search */}
      <div className="mp-search-bar">
        <input className="mp-search" type="text"
          placeholder={`Search ${currentTab.label.toLowerCase()}...`}
          value={search} onChange={e => setSearch(e.target.value)}/>
      </div>

      {/* Table */}
      <div className="card" style={{padding:0, overflow:'hidden'}}>
        {loading
          ? <div className="spinner"/>
          : filtered.length === 0
            ? <div className="empty-state"><div className="es-icon">📂</div><p>{search?'No results found.':'No records yet. Click "+ Add" to create one.'}</p></div>
            : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{width:50}}>#</th>
                    <th>{currentTab.label} Name</th>
                    {parents.map(p => <th key={p}>{PARENT_LABELS[p]}</th>)}
                    <th style={{width:120}}>Added On</th>
                    <th style={{width:160}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, i) => (
                    <tr key={item._id}>
                      <td style={{color:'var(--text-muted)',fontWeight:600,fontSize:12}}>{i+1}</td>
                      <td style={{fontWeight:600}}>{item.name}</td>
                      {parents.map(p => <td key={p} style={{color:'var(--text-secondary)',fontSize:13}}>{getParentName(item,p)}</td>)}
                      <td style={{color:'var(--text-muted)',fontSize:12}}>{new Date(item.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <div style={{display:'flex',gap:8}}>
                          <button className="btn btn-outline btn-sm" onClick={()=>openEdit(item)}>✏️ Edit</button>
                          <button className="btn btn-sm" style={{background:'var(--danger-light)',color:'var(--danger)'}} onClick={()=>setDelItem(item)}>🗑 Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
        }
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={()=>setModal(false)}>
          <div className="modal mp-modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? `Edit ${currentTab.label}` : `Add New ${currentTab.label}`}</h3>
              <button className="modal-close" onClick={()=>setModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {/* District selector */}
              {parents.includes('district') && (
                <div className="form-group">
                  <label>District *</label>
                  <select value={form.district} onChange={e=>setF('district',e.target.value)}>
                    <option value="">-- Select District --</option>
                    {allData.districts.map(d=><option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>
              )}
              {/* Union selector */}
              {parents.includes('union') && (
                <div className="form-group">
                  <label>Union {form.district?'*':'(select district first)'}</label>
                  <select value={form.union} onChange={e=>setF('union',e.target.value)} disabled={!form.district}>
                    <option value="">-- Select Union --</option>
                    {opts.unions.map(u=><option key={u._id} value={u._id}>{u.name}</option>)}
                  </select>
                </div>
              )}
              {/* Assembly selector */}
              {parents.includes('assembly') && (
                <div className="form-group">
                  <label>Assembly {form.union?'*':'(select union first)'}</label>
                  <select value={form.assembly} onChange={e=>setF('assembly',e.target.value)} disabled={!form.union}>
                    <option value="">-- Select Assembly --</option>
                    {opts.assemblies.map(a=><option key={a._id} value={a._id}>{a.name}</option>)}
                  </select>
                </div>
              )}
              {/* Area selector */}
              {parents.includes('area') && (
                <div className="form-group">
                  <label>Area {form.assembly?'*':'(select assembly first)'}</label>
                  <select value={form.area} onChange={e=>setF('area',e.target.value)} disabled={!form.assembly}>
                    <option value="">-- Select Area --</option>
                    {opts.areas.map(a=><option key={a._id} value={a._id}>{a.name}</option>)}
                  </select>
                </div>
              )}
              {/* Name field always last */}
              <div className="form-group">
                <label>{currentTab.label} Name *</label>
                <input type="text" placeholder={`Enter ${currentTab.label.toLowerCase()} name`}
                  value={form.name} onChange={e=>setF('name',e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&handleSave()}
                  autoFocus={parents.length===0}/>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {delItem && (
        <div className="modal-overlay" onClick={()=>setDelItem(null)}>
          <div className="modal modal-sm" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="modal-close" onClick={()=>setDelItem(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Delete <strong>"{delItem.name}"</strong>? This cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={()=>setDelItem(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={()=>handleDelete(delItem._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
