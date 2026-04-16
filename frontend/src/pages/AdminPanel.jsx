import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function AdminPanel() {
  const [portfolios, setPortfolios] = useState([]);
  const [tab, setTab]               = useState('pending');
  const [comments, setComments]     = useState({});
  const [msg, setMsg]               = useState({ text:'', type:'' });
  const [stats, setStats]           = useState({ pending:0, approved:0, rejected:0, total:0 });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const { data } = await API.get('/admin/all');
    const p = data.portfolios;
    setPortfolios(p);
    setStats({
      total:    p.length,
      pending:  p.filter(x => x.status==='pending').length,
      approved: p.filter(x => x.status==='approved').length,
      rejected: p.filter(x => x.status==='rejected').length,
    });
  };

  const handleApprove = async (id) => {
    try {
      await API.put(`/admin/approve/${id}`);
      setMsg({ text:'✅ Portfolio approved!', type:'success' });
      fetchAll();
    } catch (err) {
      setMsg({ text:'❌ ' + err.response?.data?.message, type:'error' });
    }
  };

  const handleReject = async (id) => {
    if (!comments[id]) return setMsg({ text:'⚠ Please enter a rejection reason', type:'error' });
    try {
      await API.put(`/admin/reject/${id}`, { comment: comments[id] });
      setMsg({ text:'Portfolio rejected with feedback', type:'success' });
      fetchAll();
    } catch (err) {
      setMsg({ text:'❌ ' + err.response?.data?.message, type:'error' });
    }
  };

  const filtered = portfolios.filter(p =>
    tab === 'all' ? true : p.status === tab
  );

  const tabs = [
    { key:'pending',  label:`Pending (${stats.pending})` },
    { key:'approved', label:`Approved (${stats.approved})` },
    { key:'rejected', label:`Rejected (${stats.rejected})` },
    { key:'all',      label:`All (${stats.total})` },
  ];

  const statusMap = {
    draft:    { color:'#7a7a9a', bg:'rgba(122,122,154,0.15)', label:'Draft'    },
    pending:  { color:'#f59e0b', bg:'rgba(245,158,11,0.12)',  label:'Pending'  },
    approved: { color:'#22d3a5', bg:'rgba(34,211,165,0.12)',  label:'Approved' },
    rejected: { color:'#ef4444', bg:'rgba(239,68,68,0.12)',   label:'Rejected' },
  };

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header} className="fade-up">
        <div style={s.adminBadge}>
          <div style={s.adminIcon}>👑</div>
          <div>
            <h1 style={s.title}>Admin Dashboard</h1>
            <p style={s.sub}>Review and manage submitted portfolios</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={s.statsGrid} className="fade-up">
        {[
          { label:'Total',    value:stats.total,    color:'#6c63ff' },
          { label:'Pending',  value:stats.pending,  color:'#f59e0b' },
          { label:'Approved', value:stats.approved, color:'#22d3a5' },
          { label:'Rejected', value:stats.rejected, color:'#ef4444' },
        ].map(sc => (
          <div key={sc.label} style={s.statCard}>
            <div style={{ ...s.statNum, color:sc.color }}>{sc.value}</div>
            <div style={s.statLabel}>{sc.label}</div>
          </div>
        ))}
      </div>

      {msg.text && (
        <div style={{ ...s.alert, ...(msg.type==='success' ? s.alertSuccess : s.alertError) }}>
          {msg.text}
        </div>
      )}

      {/* Tabs */}
      <div style={s.tabs}>
        {tabs.map(t => (
          <button key={t.key} style={{ ...s.tab, ...(tab===t.key ? s.tabActive : {}) }}
            onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Portfolio list */}
      {filtered.length === 0 ? (
        <div style={s.empty}>
          <p style={{ color:'#7a7a9a', fontSize:15 }}>No portfolios in this category</p>
        </div>
      ) : (
        <div style={s.list}>
          {filtered.map(p => {
            const st = statusMap[p.status] || statusMap.draft;
            return (
              <div key={p._id} style={s.card}>
                <div style={s.cardBar} />
                <div style={s.cardHeader}>
                  <div style={s.submitter}>
                    <div style={s.avatar}>{p.user?.name?.charAt(0) || '?'}</div>
                    <div>
                      <div style={s.subName}>{p.fullName}</div>
                      <div style={s.subMeta}>
                        {p.user?.email} · {p.profession || 'General'} · {p.template || 'modern'} template
                      </div>
                    </div>
                  </div>
                  <div style={{ ...s.badge, color:st.color, background:st.bg }}>{st.label}</div>
                </div>

                {p.tagline && <p style={s.tagline}>{p.tagline}</p>}
                {p.about   && <p style={s.about}>{p.about.substring(0, 150)}{p.about.length > 150 ? '...' : ''}</p>}

                {p.skills?.length > 0 && (
                  <div style={s.skillsRow}>
                    {p.skills.map(sk => <span key={sk} style={s.skill}>{sk}</span>)}
                  </div>
                )}

                <div style={s.metaRow}>
                  <span style={s.metaItem}>👁 {p.views || 0} views</span>
                  {p.username && <span style={s.metaItem}>🔗 /portfolio/{p.username}</span>}
                  <span style={s.metaItem}>📅 {new Date(p.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Previous admin comment */}
                {p.adminComment && (
                  <div style={s.prevComment}>
                    <span style={{ color:'#f59e0b', fontSize:12, fontWeight:600 }}>Previous feedback: </span>
                    <span style={{ color:'#a0a0c0', fontSize:12 }}>{p.adminComment}</span>
                  </div>
                )}

                {/* Actions */}
                {p.status === 'pending' && (
                  <div style={s.actionSection}>
                    <textarea style={s.commentInput} rows={2}
                      placeholder="Rejection reason (required to reject, optional for approval)..."
                      value={comments[p._id] || ''}
                      onChange={e => setComments({ ...comments, [p._id]: e.target.value })}
                    />
                    <div style={s.btnRow}>
                      <button style={s.approveBtn} onClick={() => handleApprove(p._id)}>✅ Approve</button>
                      <button style={s.rejectBtn}  onClick={() => handleReject(p._id)}>❌ Reject with Feedback</button>
                    </div>
                  </div>
                )}

                {p.status === 'approved' && (
                  <div style={s.approvedNote}>✅ Approved — publicly visible</div>
                )}
                {p.status === 'rejected' && (
                  <div style={s.rejectedNote}>❌ Rejected — user can edit and resubmit</div>
                )}
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
  header: { marginBottom:28 },
  adminBadge: { display:'flex', alignItems:'center', gap:16,
                background:'linear-gradient(135deg,rgba(245,200,66,0.08),transparent)',
                border:'1px solid rgba(245,200,66,0.2)', borderRadius:16, padding:'20px 24px' },
  adminIcon: { fontSize:36, width:56, height:56, background:'rgba(245,200,66,0.15)',
               borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center' },
  title: { fontFamily:'Syne,sans-serif', fontSize:28, fontWeight:800, color:'#f5c842' },
  sub:   { color:'#7a7a9a', fontSize:14, marginTop:2 },

  statsGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:28 },
  statCard:  { background:'#13131a', border:'1px solid #2a2a3d', borderRadius:14, padding:20, textAlign:'center' },
  statNum:   { fontFamily:'Syne,sans-serif', fontSize:32, fontWeight:800, marginBottom:4 },
  statLabel: { color:'#7a7a9a', fontSize:12, textTransform:'uppercase', letterSpacing:'0.5px' },

  alert: { padding:'12px 16px', borderRadius:10, fontSize:13, marginBottom:20 },
  alertSuccess: { background:'rgba(34,211,165,0.1)', border:'1px solid rgba(34,211,165,0.25)', color:'#22d3a5' },
  alertError:   { background:'rgba(239,68,68,0.1)',  border:'1px solid rgba(239,68,68,0.25)',  color:'#ef4444' },

  tabs: { display:'flex', gap:4, marginBottom:24, background:'#13131a',
          border:'1px solid #2a2a3d', borderRadius:12, padding:4 },
  tab:  { flex:1, padding:'9px 0', background:'transparent', border:'none',
          color:'#7a7a9a', fontSize:13, cursor:'pointer', borderRadius:8, transition:'all .2s' },
  tabActive: { background:'#1c1c27', color:'#f0f0ff', fontWeight:500 },

  empty: { background:'#13131a', border:'1px solid #2a2a3d', borderRadius:16,
           padding:'60px 20px', textAlign:'center' },
  list: { display:'flex', flexDirection:'column', gap:16 },
  card: { background:'#13131a', border:'1px solid #2a2a3d', borderRadius:16,
          padding:24, position:'relative', overflow:'hidden' },
  cardBar: { position:'absolute', top:0, left:0, right:0, height:3,
             background:'linear-gradient(90deg,#f5c842,#ff6584)' },

  cardHeader: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 },
  submitter:  { display:'flex', alignItems:'center', gap:12 },
  avatar: { width:44, height:44, borderRadius:12,
            background:'linear-gradient(135deg,#6c63ff,#ff6584)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:700, fontSize:18, color:'#fff', flexShrink:0 },
  subName: { fontFamily:'Syne,sans-serif', fontSize:17, fontWeight:700, color:'#f0f0ff' },
  subMeta: { color:'#7a7a9a', fontSize:12, marginTop:2 },
  badge:   { padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:600, whiteSpace:'nowrap' },

  tagline: { color:'#6c63ff', fontSize:13, marginBottom:8 },
  about:   { color:'#a0a0c0', fontSize:13, lineHeight:1.6, marginBottom:12 },

  skillsRow: { display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 },
  skill: { padding:'3px 10px', borderRadius:20, background:'rgba(108,99,255,0.1)',
           border:'1px solid rgba(108,99,255,0.2)', color:'#6c63ff', fontSize:11 },

  metaRow:  { display:'flex', gap:16, marginBottom:14 },
  metaItem: { fontSize:12, color:'#7a7a9a' },

  prevComment: { background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)',
                 borderRadius:8, padding:'8px 12px', marginBottom:14 },

  actionSection: { borderTop:'1px solid #2a2a3d', paddingTop:16, marginTop:4 },
  commentInput: { width:'100%', padding:'10px 14px', background:'#1c1c27',
                  border:'1px solid #2a2a3d', borderRadius:10, color:'#f0f0ff',
                  fontSize:13, fontFamily:'DM Sans,sans-serif', outline:'none',
                  marginBottom:12, boxSizing:'border-box', resize:'vertical' },
  btnRow:     { display:'flex', gap:10 },
  approveBtn: { padding:'10px 22px', background:'rgba(34,211,165,0.12)',
                border:'1px solid rgba(34,211,165,0.3)', color:'#22d3a5',
                borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer' },
  rejectBtn:  { padding:'10px 22px', background:'rgba(239,68,68,0.1)',
                border:'1px solid rgba(239,68,68,0.25)', color:'#ef4444',
                borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer' },

  approvedNote: { background:'rgba(34,211,165,0.08)', border:'1px solid rgba(34,211,165,0.2)',
                  borderRadius:8, padding:'8px 14px', color:'#22d3a5', fontSize:13, marginTop:8 },
  rejectedNote: { background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)',
                  borderRadius:8, padding:'8px 14px', color:'#ef4444', fontSize:13, marginTop:8 },
};