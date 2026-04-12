import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  fullName:'', tagline:'', about:'', email:'', phone:'',
  linkedin:'', github:'', skills:'', achievements:''
};

const Dashboard = () => {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState({ text:'', type:'' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchPortfolios(); }, []);

  const fetchPortfolios = async () => {
    try {
      const { data } = await API.get('/portfolio/my-portfolios');
      setPortfolios(data.portfolios);
    } catch { setPortfolios([]); }
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async e => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      achievements: form.achievements.split(',').map(a => a.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await API.put(`/portfolio/update/${editingId}`, payload);
        setMsg({ text:'✅ Portfolio updated!', type:'success' });
      } else {
        await API.post('/portfolio/create', payload);
        setMsg({ text:'✅ Portfolio created!', type:'success' });
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchPortfolios();
    } catch (err) {
      setMsg({ text:'❌ ' + (err.response?.data?.message || 'Error saving'), type:'error' });
    } finally { setLoading(false); }
  };

  const handleEdit = (p) => {
    setForm({
      ...p,
      skills: p.skills.join(', '),
      achievements: p.achievements.join(', '),
    });
    setEditingId(p._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitApproval = async (id) => {
    try {
      await API.put(`/portfolio/submit/${id}`);
      setMsg({ text:'✅ Submitted for admin approval!', type:'success' });
      fetchPortfolios();
    } catch (err) {
      setMsg({ text:'❌ ' + (err.response?.data?.message || 'Error'), type:'error' });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const statusColors = {
    draft:    { bg:'rgba(122,122,154,0.15)', color:'#7a7a9a',  border:'rgba(122,122,154,0.3)',  label:'Draft' },
    pending:  { bg:'rgba(245,158,11,0.12)',  color:'#f59e0b',  border:'rgba(245,158,11,0.3)',   label:'⏳ Pending' },
    approved: { bg:'rgba(34,211,165,0.12)',  color:'#22d3a5',  border:'rgba(34,211,165,0.3)',   label:'✅ Approved' },
    rejected: { bg:'rgba(239,68,68,0.12)',   color:'#ef4444',  border:'rgba(239,68,68,0.3)',    label:'❌ Rejected' },
  };

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h2 style={s.title}>My Portfolios</h2>
          <p style={s.sub}>Hello, {user?.name} 👋 — manage all your portfolios here</p>
        </div>
        {!showForm && (
          <button style={s.createBtn} onClick={() => setShowForm(true)}>
            + Create Portfolio
          </button>
        )}
      </div>

      {/* Alert message */}
      {msg.text && (
        <div style={{ ...s.alert, ...(msg.type==='success' ? s.alertSuccess : s.alertError) }}>
          {msg.text}
        </div>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>{editingId ? '✏️ Edit Portfolio' : '🆕 Create New Portfolio'}</h3>
          <form onSubmit={handleSave}>

            <div style={s.sectionLabel}>Basic Info</div>
            <div style={s.grid2}>
              <div>
                <label style={s.label}>Full Name</label>
                <input style={s.input} name="fullName" placeholder="Your full name"
                  value={form.fullName} onChange={handleChange} required/>
              </div>
              <div>
                <label style={s.label}>Tagline</label>
                <input style={s.input} name="tagline" placeholder="e.g. Full Stack Developer"
                  value={form.tagline} onChange={handleChange}/>
              </div>
            </div>

            <label style={s.label}>About</label>
            <textarea style={{...s.input, height:90}} name="about"
              placeholder="Write a short bio about yourself..."
              value={form.about} onChange={handleChange}/>

            <div style={s.sectionLabel}>Contact</div>
            <div style={s.grid2}>
              <div>
                <label style={s.label}>Email</label>
                <input style={s.input} name="email" type="email" placeholder="your@email.com"
                  value={form.email} onChange={handleChange}/>
              </div>
              <div>
                <label style={s.label}>Phone</label>
                <input style={s.input} name="phone" placeholder="+91 9876543210"
                  value={form.phone} onChange={handleChange}/>
              </div>
              <div>
                <label style={s.label}>LinkedIn URL</label>
                <input style={s.input} name="linkedin" placeholder="linkedin.com/in/yourname"
                  value={form.linkedin} onChange={handleChange}/>
              </div>
              <div>
                <label style={s.label}>GitHub URL</label>
                <input style={s.input} name="github" placeholder="github.com/yourname"
                  value={form.github} onChange={handleChange}/>
              </div>
            </div>

            <div style={s.sectionLabel}>Skills & Achievements</div>
            <label style={s.label}>Skills <span style={s.hint}>(comma separated)</span></label>
            <input style={s.input} name="skills" placeholder="React, Node.js, MongoDB, Python"
              value={form.skills} onChange={handleChange}/>

            <label style={s.label}>Achievements <span style={s.hint}>(comma separated)</span></label>
            <input style={s.input} name="achievements"
              placeholder="Hackathon Winner 2024, Top 10 CodeChef"
              value={form.achievements} onChange={handleChange}/>

            <div style={s.btnRow}>
              <button style={s.saveBtn} type="submit" disabled={loading}>
                {loading ? 'Saving...' : editingId ? 'Update Portfolio' : 'Create Portfolio'}
              </button>
              <button style={s.cancelBtn} type="button" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Portfolio List */}
      {portfolios.length === 0 && !showForm && (
        <div style={s.empty}>
          <div style={s.emptyIcon}>📁</div>
          <p style={s.emptyText}>No portfolios yet</p>
          <p style={s.emptySub}>Click "Create Portfolio" to build your first one</p>
          <button style={s.createBtn} onClick={() => setShowForm(true)}>+ Create Portfolio</button>
        </div>
      )}

      {portfolios.map(p => {
        const st = statusColors[p.status] || statusColors.draft;
        return (
          <div key={p._id} style={s.card}>
            <div style={s.cardTop}>
              <div style={s.stripAccent}/>
              <div style={s.cardLeft}>
                <h3 style={s.cardName}>{p.fullName}</h3>
                <p style={s.cardTag}>{p.tagline}</p>
              </div>
              <div style={{ ...s.badge, background: st.bg, color: st.color, border:`1px solid ${st.border}` }}>
                {st.label}
              </div>
            </div>

            {p.about && <p style={s.cardAbout}>{p.about}</p>}

            {p.skills?.length > 0 && (
              <div style={s.skillsRow}>
                {p.skills.map(sk => (
                  <span key={sk} style={s.skillTag}>{sk}</span>
                ))}
              </div>
            )}

            {p.status === 'rejected' && p.adminComment && (
              <div style={s.rejectionBox}>
                <strong>Admin feedback:</strong> {p.adminComment}
              </div>
            )}

            <div style={s.cardActions}>
              <button style={s.editBtn} onClick={() => handleEdit(p)}>✏️ Edit</button>
              {(p.status === 'draft' || p.status === 'rejected') && (
                <button style={s.submitBtn} onClick={() => handleSubmitApproval(p._id)}>
                  🚀 Submit for Approval
                </button>
              )}
              {p.status === 'approved' && (
                <span style={s.approvedNote}>🎉 Publicly visible</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const s = {
  page: { maxWidth:780, margin:'40px auto', padding:'0 20px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 },
  title: { fontFamily:'Syne,sans-serif', fontSize:28, fontWeight:800, color:'#f0f0ff' },
  sub: { color:'#7a7a9a', fontSize:14, marginTop:4 },
  createBtn: { padding:'11px 24px', background:'linear-gradient(135deg,#6c63ff,#8b5cf6)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans,sans-serif', whiteSpace:'nowrap' },

  alert: { padding:'12px 16px', borderRadius:10, fontSize:13, marginBottom:20 },
  alertSuccess: { background:'rgba(34,211,165,0.1)', border:'1px solid rgba(34,211,165,0.25)', color:'#22d3a5' },
  alertError: { background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', color:'#ef4444' },

  formCard: { background:'#13131a', border:'1px solid #2a2a3d', borderRadius:20, padding:32, marginBottom:28 },
  formTitle: { fontFamily:'Syne,sans-serif', fontSize:18, fontWeight:700, color:'#f0f0ff', marginBottom:24 },
  sectionLabel: { fontSize:11, fontWeight:700, color:'#6c63ff', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:14, marginTop:8, paddingBottom:8, borderBottom:'1px solid #2a2a3d' },
  grid2: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:4 },
  label: { display:'block', fontSize:12, color:'#7a7a9a', marginBottom:6, fontWeight:500 },
  hint: { color:'#4a4a6a', fontWeight:400 },
  input: { width:'100%', padding:'11px 14px', background:'#1c1c27', border:'1px solid #2a2a3d', borderRadius:10, color:'#f0f0ff', fontSize:14, fontFamily:'DM Sans,sans-serif', outline:'none', marginBottom:16, boxSizing:'border-box', resize:'vertical' },
  btnRow: { display:'flex', gap:12, marginTop:8 },
  saveBtn: { padding:'11px 28px', background:'linear-gradient(135deg,#6c63ff,#8b5cf6)', color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans,sans-serif' },
  cancelBtn: { padding:'11px 20px', background:'transparent', border:'1px solid #2a2a3d', color:'#7a7a9a', borderRadius:10, fontSize:14, cursor:'pointer', fontFamily:'DM Sans,sans-serif' },

  empty: { textAlign:'center', padding:'80px 20px', background:'#13131a', border:'1px solid #2a2a3d', borderRadius:20 },
  emptyIcon: { fontSize:48, marginBottom:12 },
  emptyText: { fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, color:'#f0f0ff', marginBottom:6 },
  emptySub: { color:'#7a7a9a', fontSize:14, marginBottom:24 },

  card: { background:'#13131a', border:'1px solid #2a2a3d', borderRadius:20, padding:28, marginBottom:20, position:'relative', overflow:'hidden' },
  stripAccent: { position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#6c63ff,#ff6584)' },
  cardTop: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 },
  cardLeft: { flex:1 },
  cardName: { fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, color:'#f0f0ff', marginBottom:4 },
  cardTag: { color:'#6c63ff', fontSize:14 },
  badge: { padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:600, whiteSpace:'nowrap', marginLeft:12 },
  cardAbout: { color:'#a0a0c0', fontSize:14, lineHeight:1.7, marginBottom:16 },
  skillsRow: { display:'flex', flexWrap:'wrap', gap:8, marginBottom:16 },
  skillTag: { padding:'4px 14px', borderRadius:20, background:'rgba(108,99,255,0.12)', border:'1px solid rgba(108,99,255,0.25)', color:'#6c63ff', fontSize:12 },
  rejectionBox: { background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, padding:'12px 16px', color:'#ef4444', fontSize:13, marginBottom:16 },
  cardActions: { display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' },
  editBtn: { padding:'9px 20px', background:'transparent', border:'1px solid #2a2a3d', color:'#f0f0ff', borderRadius:10, fontSize:13, cursor:'pointer', fontFamily:'DM Sans,sans-serif' },
  submitBtn: { padding:'9px 20px', background:'rgba(34,211,165,0.12)', border:'1px solid rgba(34,211,165,0.3)', color:'#22d3a5', borderRadius:10, fontSize:13, cursor:'pointer', fontFamily:'DM Sans,sans-serif' },
  approvedNote: { color:'#22d3a5', fontSize:13 },
};

export default Dashboard;