import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [stats, setStats] = useState({ total:0, approved:0, pending:0, views:0 });

  useEffect(() => {
    API.get('/portfolio/my-portfolios').then(({ data }) => {
      const p = data.portfolios;
      setPortfolios(p);
      setStats({
        total:    p.length,
        approved: p.filter(x => x.status==='approved').length,
        pending:  p.filter(x => x.status==='pending').length,
        views:    p.reduce((a, x) => a + (x.views || 0), 0),
      });
    }).catch(() => {});
  }, []);

  const statCards = [
    { label:'Total Portfolios', value: stats.total,    color:'#6c63ff', icon:'◈' },
    { label:'Approved',         value: stats.approved, color:'#22d3a5', icon:'✓' },
    { label:'Pending Review',   value: stats.pending,  color:'#f59e0b', icon:'⏳' },
    { label:'Total Views',      value: stats.views,    color:'#ff6584', icon:'◉' },
  ];

  const statusMap = {
    draft:    { color:'#7a7a9a',  bg:'rgba(122,122,154,0.15)', label:'Draft'    },
    pending:  { color:'#f59e0b',  bg:'rgba(245,158,11,0.12)',  label:'Pending'  },
    approved: { color:'#22d3a5',  bg:'rgba(34,211,165,0.12)',  label:'Approved' },
    rejected: { color:'#ef4444',  bg:'rgba(239,68,68,0.12)',   label:'Rejected' },
  };

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header} className="fade-up">
        <div>
          <h1 style={s.title}>Dashboard</h1>
          <p style={s.sub}>Welcome back, {user?.name} 👋</p>
        </div>
        <button style={s.createBtn} onClick={() => navigate('/create-portfolio')}>
          + New Portfolio
        </button>
      </div>

      {/* Stat cards */}
      <div style={s.statsGrid} className="fade-up">
        {statCards.map(sc => (
          <div key={sc.label} style={s.statCard}>
            <div style={{ ...s.statIcon, color: sc.color }}>{sc.icon}</div>
            <div style={{ ...s.statNum, color: sc.color }}>{sc.value}</div>
            <div style={s.statLabel}>{sc.label}</div>
          </div>
        ))}
      </div>

      {/* Recent portfolios */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Recent Portfolios</h2>
          <button style={s.viewAll} onClick={() => navigate('/my-portfolios')}>
            View all →
          </button>
        </div>

        {portfolios.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyIcon}>📁</div>
            <p style={s.emptyText}>No portfolios yet</p>
            <p style={s.emptySub}>Create your first portfolio to get started</p>
            <button style={s.createBtn} onClick={() => navigate('/create-portfolio')}>
              + Create Portfolio
            </button>
          </div>
        ) : (
          <div style={s.cardGrid}>
            {portfolios.slice(0, 3).map(p => {
              const st = statusMap[p.status] || statusMap.draft;
              return (
                <div key={p._id} style={s.pCard} className="card-hover">
                  <div style={s.pCardBar} />
                  <div style={s.pCardTop}>
                    <div>
                      <div style={s.pName}>{p.fullName}</div>
                      <div style={s.pTag}>{p.tagline}</div>
                    </div>
                    <div style={{ ...s.badge, color: st.color, background: st.bg }}>
                      {st.label}
                    </div>
                  </div>
                  <div style={s.pMeta}>
                    <span style={s.metaItem}>👁 {p.views || 0} views</span>
                    <span style={s.metaItem}>🏷 {p.profession || 'General'}</span>
                  </div>
                  {p.status === 'rejected' && p.adminComment && (
                    <div style={s.feedback}>
                      💬 <strong>Admin:</strong> {p.adminComment}
                    </div>
                  )}
                  {p.status === 'approved' && p.username && (
                    <div style={s.shareLink}>
                      🔗 /portfolio/{p.username}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { padding:40, maxWidth:1100 },
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32 },
  title: { fontFamily:'Syne,sans-serif', fontSize:32, fontWeight:800, color:'#f0f0ff' },
  sub:   { color:'#7a7a9a', fontSize:15, marginTop:4 },
  createBtn: { padding:'11px 24px', background:'linear-gradient(135deg,#6c63ff,#8b5cf6)',
               color:'#fff', border:'none', borderRadius:10, fontSize:14,
               fontWeight:600, cursor:'pointer' },

  statsGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:36 },
  statCard:  { background:'#13131a', border:'1px solid #2a2a3d', borderRadius:16, padding:24 },
  statIcon:  { fontSize:20, marginBottom:10 },
  statNum:   { fontFamily:'Syne,sans-serif', fontSize:36, fontWeight:800, marginBottom:4 },
  statLabel: { color:'#7a7a9a', fontSize:12, textTransform:'uppercase', letterSpacing:'0.5px' },

  section: { marginTop:8 },
  sectionHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 },
  sectionTitle: { fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, color:'#f0f0ff' },
  viewAll: { background:'none', border:'none', color:'#6c63ff', fontSize:13, cursor:'pointer' },

  empty: { background:'#13131a', border:'1px solid #2a2a3d', borderRadius:20,
           padding:'60px 20px', textAlign:'center' },
  emptyIcon: { fontSize:48, marginBottom:12 },
  emptyText: { fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700, color:'#f0f0ff', marginBottom:6 },
  emptySub:  { color:'#7a7a9a', fontSize:14, marginBottom:24 },

  cardGrid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 },
  pCard: { background:'#13131a', border:'1px solid #2a2a3d', borderRadius:16,
           padding:24, position:'relative', overflow:'hidden' },
  pCardBar: { position:'absolute', top:0, left:0, right:0, height:3,
              background:'linear-gradient(90deg,#6c63ff,#ff6584)' },
  pCardTop: { display:'flex', justifyContent:'space-between', marginBottom:12 },
  pName: { fontFamily:'Syne,sans-serif', fontSize:16, fontWeight:700, color:'#f0f0ff', marginBottom:3 },
  pTag:  { color:'#6c63ff', fontSize:12 },
  badge: { padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:600,
           height:'fit-content', whiteSpace:'nowrap' },
  pMeta: { display:'flex', gap:12, marginBottom:10 },
  metaItem: { fontSize:12, color:'#7a7a9a' },
  feedback: { background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)',
              borderRadius:8, padding:'8px 12px', fontSize:12, color:'#ef4444', marginTop:8 },
  shareLink: { background:'rgba(108,99,255,0.08)', border:'1px solid rgba(108,99,255,0.2)',
               borderRadius:8, padding:'8px 12px', fontSize:12, color:'#6c63ff', marginTop:8 },
};