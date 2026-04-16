import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function MyPortfolios() {
  const [portfolios, setPortfolios] = useState([]);
  const [msg, setMsg]               = useState({ text:'', type:'' });
  const navigate = useNavigate();

  useEffect(() => { fetch(); }, []);

  const fetch = async () => {
    try {
      const { data } = await API.get('/portfolio/my-portfolios');
      setPortfolios(data.portfolios);
    } catch { setPortfolios([]); }
  };

  const handleSubmit = async (id) => {
    try {
      await API.put(`/portfolio/submit/${id}`);
      setMsg({ text:'✅ Submitted for admin approval!', type:'success' });
      fetch();
    } catch (err) {
      setMsg({ text:'❌ ' + (err.response?.data?.message || 'Error'), type:'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this portfolio?')) return;
    try {
      await API.delete(`/portfolio/delete/${id}`);
      setMsg({ text:'🗑 Portfolio deleted', type:'success' });
      fetch();
    } catch (err) {
      setMsg({ text:'❌ ' + (err.response?.data?.message || 'Error'), type:'error' });
    }
  };

  const statusMap = {
    draft:    { color:'#7a7a9a', bg:'rgba(122,122,154,0.15)', label:'Draft'    },
    pending:  { color:'#f59e0b', bg:'rgba(245,158,11,0.12)',  label:'⏳ Pending' },
    approved: { color:'#22d3a5', bg:'rgba(34,211,165,0.12)',  label:'✅ Approved'},
    rejected: { color:'#ef4444', bg:'rgba(239,68,68,0.12)',   label:'❌ Rejected'},
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>My Portfolios</h1>
          <p style={s.sub}>Manage all your portfolios in one place</p>
        </div>
        <button style={s.createBtn} onClick={() => navigate('/create-portfolio')}>
          + Create New
        </button>
      </div>

      {msg.text && (
        <div style={{ ...s.alert, ...(msg.type==='success' ? s.alertSuccess : s.alertError) }}>
          {msg.text}
        </div>
      )}

      {portfolios.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>📂</div>
          <p style={s.emptyText}>No portfolios yet</p>
          <p style={s.emptySub}>Click "Create New" to build your first portfolio</p>
        </div>
      ) : (
        <div style={s.list}>
          {portfolios.map(p => {
            const st = statusMap[p.status] || statusMap.draft;
            return (
              <div key={p._id} style={s.card} className="card-hover">
                <div style={s.cardBar} />
                <div style={s.cardMain}>
                  <div style={s.cardLeft}>
                    <div style={s.cardTop}>
                      <h3 style={s.name}>{p.fullName}</h3>
                      <div style={{ ...s.badge, color:st.color, background:st.bg }}>{st.label}</div>
                    </div>
                    <p style={s.tagline}>{p.tagline}</p>
                    <div style={s.meta}>
                      <span style={s.metaItem}>🏷 {p.profession || 'General'}</span>
                      <span style={s.metaItem}>◈ {p.template || 'modern'} template</span>
                      <span style={s.metaItem}>👁 {p.views || 0} views</span>
                      {p.username && <span style={s.metaItem}>🔗 /portfolio/{p.username}</span>}
                    </div>

                    {/* Admin feedback for rejected */}
                    {p.status === 'rejected' && p.adminComment && (
                      <div style={s.feedbackBox}>
                        <span style={s.feedbackLabel}>💬 Admin Feedback:</span>
                        <span style={s.feedbackText}> {p.adminComment}</span>
                      </div>
                    )}

                    {/* Skills */}
                    {p.skills?.length > 0 && (
                      <div style={s.skillsRow}>
                        {p.skills.slice(0, 5).map(sk => (
                          <span key={sk} style={s.skill}>{sk}</span>
                        ))}
                        {p.skills.length > 5 && (
                          <span style={s.skillMore}>+{p.skills.length - 5}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={s.actions}>
                    {p.status === 'approved' && p.username && (
                      <button style={s.viewBtn}
                        onClick={() => navigate(`/portfolio/${p.username}`)}>
                        👁 View
                      </button>
                    )}
                    {(p.status === 'draft' || p.status === 'rejected') && (
                      <>
                        <button style={s.editBtn}
                          onClick={() => navigate(`/create-portfolio?edit=${p._id}`)}>
                          ✏ Edit
                        </button>
                        <button style={s.submitBtn} onClick={() => handleSubmit(p._id)}>
                          🚀 Submit
                        </button>
                      </>
                    )}
                    <button style={s.deleteBtn} onClick={() => handleDelete(p._id)}>
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding:40, maxWidth:1000 },
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 },
  title: { fontFamily:'Syne,sans-serif', fontSize:32, fontWeight:800, color:'#f0f0ff' },
  sub:   { color:'#7a7a9a', fontSize:15, marginTop:4 },
  createBtn: { padding:'11px 24px', background:'linear-gradient(135deg,#6c63ff,#8b5cf6)',
               color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer' },

  alert: { padding:'12px 16px', borderRadius:10, fontSize:13, marginBottom:20 },
  alertSuccess: { background:'rgba(34,211,165,0.1)', border:'1px solid rgba(34,211,165,0.25)', color:'#22d3a5' },
  alertError:   { background:'rgba(239,68,68,0.1)',  border:'1px solid rgba(239,68,68,0.25)',  color:'#ef4444' },

  empty: { background:'#13131a', border:'1px solid #2a2a3d', borderRadius:20,
           padding:'80px 20px', textAlign:'center' },
  emptyIcon: { fontSize:48, marginBottom:12 },
  emptyText: { fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, color:'#f0f0ff', marginBottom:6 },
  emptySub:  { color:'#7a7a9a', fontSize:14 },

  list: { display:'flex', flexDirection:'column', gap:16 },
  card: { background:'#13131a', border:'1px solid #2a2a3d', borderRadius:16,
          padding:24, position:'relative', overflow:'hidden' },
  cardBar: { position:'absolute', top:0, left:0, right:0, height:3,
             background:'linear-gradient(90deg,#6c63ff,#ff6584)' },
  cardMain: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16 },
  cardLeft: { flex:1 },
  cardTop:  { display:'flex', alignItems:'center', gap:12, marginBottom:4 },
  name:    { fontFamily:'Syne,sans-serif', fontSize:18, fontWeight:700, color:'#f0f0ff' },
  badge:   { padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:600, whiteSpace:'nowrap' },
  tagline: { color:'#6c63ff', fontSize:13, marginBottom:10 },
  meta:    { display:'flex', flexWrap:'wrap', gap:12, marginBottom:10 },
  metaItem: { fontSize:12, color:'#7a7a9a' },

  feedbackBox: { background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)',
                 borderRadius:8, padding:'8px 12px', marginBottom:12 },
  feedbackLabel: { color:'#ef4444', fontSize:12, fontWeight:600 },
  feedbackText:  { color:'#f87171', fontSize:12 },

  skillsRow: { display:'flex', flexWrap:'wrap', gap:6 },
  skill:    { padding:'3px 10px', borderRadius:20, background:'rgba(108,99,255,0.1)',
              border:'1px solid rgba(108,99,255,0.2)', color:'#6c63ff', fontSize:11 },
  skillMore: { padding:'3px 10px', borderRadius:20, background:'#1c1c27',
               color:'#7a7a9a', fontSize:11 },

  actions: { display:'flex', flexDirection:'column', gap:8, flexShrink:0 },
  viewBtn:   { padding:'8px 16px', background:'rgba(34,211,165,0.1)', border:'1px solid rgba(34,211,165,0.25)',
               color:'#22d3a5', borderRadius:8, fontSize:12, cursor:'pointer' },
  editBtn:   { padding:'8px 16px', background:'rgba(108,99,255,0.1)', border:'1px solid rgba(108,99,255,0.25)',
               color:'#6c63ff', borderRadius:8, fontSize:12, cursor:'pointer' },
  submitBtn: { padding:'8px 16px', background:'rgba(34,211,165,0.1)', border:'1px solid rgba(34,211,165,0.25)',
               color:'#22d3a5', borderRadius:8, fontSize:12, cursor:'pointer' },
  deleteBtn: { padding:'8px 14px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)',
               color:'#ef4444', borderRadius:8, fontSize:13, cursor:'pointer' },
};