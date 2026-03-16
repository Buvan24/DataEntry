import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { memberAPI, masterAPI } from '../utils/api';
import './DataEntryPage.css';

const EMPTY = {
  name:'', fatherName:'', dob:'', phone:'', address:'',
  partNumber:'', voterSerial:'', voterId:'', aadharNumber:'', partyMembership:'',
  district:'', union:'', assembly:'', area:'', administration:'', position:'',
  joinDate:'', resignDate:'',
};

// Simple uncontrolled text input — no cursor jump issues
function TextInput({ label, name, formRef, placeholder, type='text', span=false }) {
  return (
    <div className="form-group" style={span ? { gridColumn:'1/-1' } : {}}>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder || label}
        defaultValue={formRef.current[name] || ''}
        onChange={e => { formRef.current[name] = e.target.value; }}
      />
    </div>
  );
}

export default function DataEntryPage() {
  const navigate   = useNavigate();
  // formRef holds all text/date values — avoids re-renders on every keystroke
  const formRef    = useRef({ ...EMPTY });
  const [formKey,  setFormKey]   = useState(0); // bump to re-mount inputs (on clear/load)
  const [selects,  setSelects]   = useState({
    district:'', union:'', assembly:'', area:'', administration:'', position:''
  });
  const [masters,  setMasters]   = useState({
    districts:[], unions:[], assemblies:[], areas:[], administrations:[], positions:[]
  });
  const [saving,   setSaving]    = useState(false);
  const [currentId,setCurrentId] = useState(null);
  const [searchTerm,setSearchTerm]= useState('');
  const [searchRes, setSearchRes] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearch,setShowSearch]= useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => { loadBaseMasters(); }, []);

  const loadBaseMasters = async () => {
    try {
      const [d, p] = await Promise.all([
        masterAPI.districts.getAll(),
        masterAPI.positions.getAll(),
      ]);
      setMasters(m => ({ ...m, districts: d.data, positions: p.data }));
    } catch { toast.error('Failed to load dropdowns'); }
  };

  // Cascading selects
  const setSel = useCallback((key, value) => {
    setSelects(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'district')  { next.union=''; next.assembly=''; next.area=''; next.administration=''; }
      if (key === 'union')     { next.assembly=''; next.area=''; next.administration=''; }
      if (key === 'assembly')  { next.area=''; next.administration=''; }
      if (key === 'area')      { next.administration=''; }
      return next;
    });
  }, []);

  useEffect(() => {
    if (selects.district) {
      masterAPI.unions.getAll({ district: selects.district })
        .then(r => setMasters(m => ({ ...m, unions: r.data, assemblies:[], areas:[], administrations:[] })))
        .catch(() => {});
    } else {
      setMasters(m => ({ ...m, unions:[], assemblies:[], areas:[], administrations:[] }));
    }
  }, [selects.district]);

  useEffect(() => {
    if (selects.union) {
      masterAPI.assemblies.getAll({ district: selects.district, union: selects.union })
        .then(r => setMasters(m => ({ ...m, assemblies: r.data, areas:[], administrations:[] })))
        .catch(() => {});
    } else {
      setMasters(m => ({ ...m, assemblies:[], areas:[], administrations:[] }));
    }
  }, [selects.union]);

  useEffect(() => {
    if (selects.assembly) {
      masterAPI.areas.getAll({ district: selects.district, union: selects.union, assembly: selects.assembly })
        .then(r => setMasters(m => ({ ...m, areas: r.data, administrations:[] })))
        .catch(() => {});
    } else {
      setMasters(m => ({ ...m, areas:[], administrations:[] }));
    }
  }, [selects.assembly]);

  useEffect(() => {
    if (selects.area) {
      masterAPI.administrations.getAll({
        district: selects.district, union: selects.union,
        assembly: selects.assembly, area: selects.area
      })
        .then(r => setMasters(m => ({ ...m, administrations: r.data })))
        .catch(() => {});
    } else {
      setMasters(m => ({ ...m, administrations:[] }));
    }
  }, [selects.area]);

  // Build payload from both formRef (text) and selects (dropdowns)
  const buildPayload = () => {
    const payload = { ...formRef.current, ...selects };
    Object.keys(payload).forEach(k => {
      if (payload[k] === '' || payload[k] === null || payload[k] === undefined) delete payload[k];
    });
    return payload;
  };

  const handleSave = async () => {
    const name = formRef.current.name?.trim();
    if (!name) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const payload = buildPayload();
      if (currentId) {
        await memberAPI.update(currentId, payload);
        toast.success('Record updated!');
      } else {
        await memberAPI.create(payload);
        toast.success('Member saved!');
        handleClear();
      }
    } catch (e) { toast.error(e.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleClear = () => {
    formRef.current = { ...EMPTY };
    setSelects({ district:'', union:'', assembly:'', area:'', administration:'', position:'' });
    setCurrentId(null);
    setFormKey(k => k + 1); // re-mount all inputs with blank defaultValue
    setMasters(m => ({ ...m, unions:[], assemblies:[], areas:[], administrations:[] }));
    toast('Form cleared');
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setSearching(true);
    try {
      const r = await memberAPI.getAll({ search: searchTerm });
      setSearchRes(r.data);
      setShowSearch(true);
    } catch { toast.error('Search failed'); }
    finally { setSearching(false); }
  };

  const loadMember = async (member) => {
    // Load cascading dropdown options for this member
    const distId = member.district?._id || member.district || '';
    const unionId= member.union?._id    || member.union    || '';
    const asmId  = member.assembly?._id || member.assembly || '';
    const areaId = member.area?._id     || member.area     || '';

    try {
      const [u, a, ar, adm] = await Promise.all([
        distId  ? masterAPI.unions.getAll({ district: distId }) : Promise.resolve({data:[]}),
        unionId ? masterAPI.assemblies.getAll({ district: distId, union: unionId }) : Promise.resolve({data:[]}),
        asmId   ? masterAPI.areas.getAll({ district: distId, union: unionId, assembly: asmId }) : Promise.resolve({data:[]}),
        areaId  ? masterAPI.administrations.getAll({ district: distId, union: unionId, assembly: asmId, area: areaId }) : Promise.resolve({data:[]}),
      ]);
      setMasters(m => ({ ...m, unions: u.data, assemblies: a.data, areas: ar.data, administrations: adm.data }));
    } catch {}

    const d2s = d => d ? d.slice(0, 10) : '';
    // Load text fields into ref
    formRef.current = {
      name:            member.name            || '',
      fatherName:      member.fatherName      || '',
      dob:             d2s(member.dob),
      phone:           member.phone           || '',
      address:         member.address         || '',
      partNumber:      member.partNumber      || '',
      voterSerial:     member.voterSerial     || '',
      voterId:         member.voterId         || '',
      aadharNumber:    member.aadharNumber    || '',
      partyMembership: member.partyMembership || '',
      joinDate:        d2s(member.joinDate),
      resignDate:      d2s(member.resignDate),
    };
    // Load dropdown selects
    setSelects({
      district:       distId,
      union:          unionId,
      assembly:       asmId,
      area:           areaId,
      administration: member.administration?._id || member.administration || '',
      position:       member.position?._id       || member.position       || '',
    });
    setCurrentId(member._id);
    setFormKey(k => k + 1); // re-mount inputs with loaded values
    setShowSearch(false);
    setSearchTerm('');
    toast.success(`Loaded: ${member.name}`);
  };

  const Sel = ({ label, field, opts, disabled=false }) => (
    <div className="form-group">
      <label>{label}</label>
      <select
        value={selects[field] || ''}
        onChange={e => setSel(field, e.target.value)}
        disabled={disabled}
      >
        <option value="">-- Select {label} --</option>
        {opts.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
      </select>
    </div>
  );

  const TABS = ['personal','identification','classification','membership'];
  const TAB_LABELS = {
    personal:'Personal Details',
    identification:'Identification',
    classification:'Classification',
    membership:'Membership'
  };

  return (
    <div className="de-root">
      <header className="de-header">
        <button className="de-back" onClick={() => navigate('/')}>← Home</button>
        <div className="de-header-mid">
          <div className="de-header-title">Biography Entry Form</div>
          <div className="de-header-sub">Data Entry Module</div>
        </div>
        <div className="de-header-right">
          {currentId
            ? <span className="badge badge-green">Editing Record</span>
            : <span className="badge badge-dark">New Entry</span>}
        </div>
      </header>

      <div className="de-body">
        {/* Search Bar */}
        <div className="de-search-card card">
          <div className="de-search-row">
            <div className="de-search-wrap">
              <span className="de-search-icon">🔍</span>
              <input
                className="de-search-input"
                type="text"
                placeholder="Search existing member by name, phone or voter ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button className="btn btn-primary" onClick={handleSearch} disabled={searching}>
              {searching ? '...' : 'Search'}
            </button>
            <button className="btn btn-outline" onClick={handleClear}>🧹 Clear</button>
          </div>

          {showSearch && (
            <div className="de-search-results">
              <div className="de-sr-header">
                <span>{searchRes.length} result(s) for &quot;{searchTerm}&quot;</span>
                <button onClick={() => setShowSearch(false)}>✕</button>
              </div>
              {searchRes.length === 0
                ? <p className="de-sr-empty">No members found.</p>
                : searchRes.map(m => (
                  <button key={m._id} className="de-sr-item" onClick={() => loadMember(m)}>
                    <div className="de-sr-name">{m.name}</div>
                    <div className="de-sr-meta">
                      {m.phone || 'No phone'} · {m.position?.name || 'No position'} · {m.district?.name || 'No district'}
                    </div>
                  </button>
                ))
              }
            </div>
          )}
        </div>

        {/* Section Tabs */}
        <div className="de-tabs">
          {TABS.map(s => (
            <button key={s} className={`de-tab ${activeTab===s?'active':''}`} onClick={() => setActiveTab(s)}>
              {TAB_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Form — key prop forces full remount when formKey changes */}
        <div className="card de-form-card" key={formKey}>

          {activeTab === 'personal' && (
            <>
              <div className="divider"><span>Personal Details</span></div>
              <div className="form-grid-2">
                <TextInput label="Full Name *"  name="name"       formRef={formRef} placeholder="Enter full name"/>
                <TextInput label="Father Name"  name="fatherName" formRef={formRef} placeholder="Father's full name"/>
              </div>
              <div className="form-grid-2">
                <TextInput label="Date of Birth" name="dob"   formRef={formRef} type="date"/>
                <TextInput label="Cell Number"   name="phone" formRef={formRef} type="tel" placeholder="Mobile number"/>
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  placeholder="Full residential address"
                  defaultValue={formRef.current.address || ''}
                  onChange={e => { formRef.current.address = e.target.value; }}
                />
              </div>
            </>
          )}

          {activeTab === 'identification' && (
            <>
              <div className="divider"><span>Identification Details</span></div>
              <div className="form-grid-2">
                <TextInput label="Part Number"          name="partNumber"      formRef={formRef} placeholder="Electoral part number"/>
                <TextInput label="Voter Serial Number"  name="voterSerial"     formRef={formRef} placeholder="Serial number"/>
                <TextInput label="Voter ID Number"      name="voterId"         formRef={formRef} placeholder="EPIC number"/>
                <TextInput label="Aadhar Number"        name="aadharNumber"    formRef={formRef} placeholder="12-digit Aadhar"/>
                <TextInput label="Party Membership No." name="partyMembership" formRef={formRef} placeholder="Party membership number" span/>
              </div>
            </>
          )}

          {activeTab === 'classification' && (
            <>
              <div className="divider"><span>Administrative Classification</span></div>
              <p className="de-cascade-hint">💡 Select in order: District → Union → Assembly → Area → Administration</p>
              <div className="form-grid-2">
                <Sel label="District"       field="district"       opts={masters.districts}/>
                <Sel label="Union"          field="union"          opts={masters.unions}          disabled={!selects.district}/>
                <Sel label="Assembly"       field="assembly"       opts={masters.assemblies}       disabled={!selects.union}/>
                <Sel label="Area"           field="area"           opts={masters.areas}            disabled={!selects.assembly}/>
                <Sel label="Administration" field="administration" opts={masters.administrations}  disabled={!selects.area}/>
                <Sel label="Position"       field="position"       opts={masters.positions}/>
              </div>
            </>
          )}

          {activeTab === 'membership' && (
            <>
              <div className="divider"><span>Membership Information</span></div>
              <div className="form-grid-2">
                <TextInput label="Join Date"      name="joinDate"   formRef={formRef} type="date"/>
                <TextInput label="Resigning Date" name="resignDate" formRef={formRef} type="date"/>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="de-actions">
            <button className="btn btn-primary de-btn-save" onClick={handleSave} disabled={saving}>
              {saving ? '⏳ Saving...' : currentId ? '💾 Update Record' : '💾 Save Record'}
            </button>
            <button className="btn btn-outline de-btn-clear" onClick={handleClear}>
              🧹 Clear Form
            </button>
            <div className="de-nav-btns">
              {TABS.indexOf(activeTab) > 0 && (
                <button className="btn btn-outline" onClick={() => setActiveTab(TABS[TABS.indexOf(activeTab)-1])}>← Prev</button>
              )}
              {TABS.indexOf(activeTab) < TABS.length-1 && (
                <button className="btn btn-accent" onClick={() => setActiveTab(TABS[TABS.indexOf(activeTab)+1])}>Next →</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
