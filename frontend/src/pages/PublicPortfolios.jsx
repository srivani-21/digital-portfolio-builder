import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function PublicPortfolios() {
  const [portfolios, setPortfolios] = useState([]);
  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState('all');
  const [loading, setLoading]       = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/portfolio/public')
      .then(({ data }) => setPortfolios(data.portfolios))
      .finally(() => setLoading(false));
  }, []);

  const professions = ['all', ...new Set(portfolios.map(p => p.profession).filter(Boolean))];

  const filtered = portfolios.filter(p => {
    const matchSearch = p.fullName?.toLowerCase().includes(search.toLowerCase()) ||
                        p.tagline?.toLowerCase().includes(search.toLowerCase()) ||
                        p.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === 'all' || p.profession === filter;
    return matchSearch && matchFilter;
  });

  if (loading) return (
    <div style={s.loadWrap}>
      <div style={{ color:'#7a7a9a', fontSize:16 }}>Loading portfolios...</div>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.hero} className="fade-up">
        <h1 style={s.heroTitle}>Verified Portfolios</h1>
        <p style={s.heroSub}>Browse approved professional portfolios from our community</p>
        <div style={s.heroStats}>
          <div style={s.heroStat}><span style={s.heroNum}>{portfolios.length}</span> Verified</div>
          <div style={s.heroStat}><span style={s.heroNum}>{professions.length - 1}</span> Professions</div>
        </div>
      </div>

      {/* Search + filter */}
      <div style={s.controls}>
        <input style={s.search} placeholder="🔍  Search by name, skill or tagline..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <div style={s.filters}>
          {professions.map(prof => (
            <button key={prof} style={{ ...s.filterBtn, ...(filter===prof ? s.filterActive : {}) }}
              onClick={() => setFilter(prof)}>
              {prof === 'all' ? 'All' : prof.charAt(0).toUpperCase() + prof.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={s.empty}>
          <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
          <p style={{ fontFamily:'Syne,sans-serif', fontSize:20, color:'#f0f0ff', marginBottom:6 }}>
            No portfolios found
          </p>
          <p style={{ color:'#7a7a9a', fontSize:14 }}>Try a different search or filter</p>
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map(p => (
            <div key={p._id} style={s.card} className="card-hover"
              onClick={() => p.username && navigate(`/portfolio/${p.username}`)}>
              <div style={s.cardBar} />
              <div style={s.verifiedBadge}>✓ Verified</div>
              <h3 style={s.name}>{p.fullName}</h3>
              <p style={s.tagline}>{p.tagline}</p>
              {p.about && <p style={s.about}>{p.about.substring(0, 100)}{p.about.length > 100 ? '...' : ''}</p>}
              {p.skills?.length > 0 && (
                <div style={s.skillsRow}>
                  {p.skills.slice(0, 4).map(sk => <span key={sk} style={s.skill}>{sk}</span>)}
                  {p.skills.length > 4 && <span style={s.skillMore}>+{p.skills.length - 4}</span>}
                </div>
              )}
              <div style={s.cardFooter}>
                <span style={s.profession}>{p.profession || 'General'}</span>
                <span style={s.views}>👁 {p.views || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding:40, maxWidth:1100 },
  loadWrap: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'60vh' },

  hero: { textAlign:'center', paddingBottom:40, marginBottom:32,
          borderBottom:'1px solid #2a2a3d' },
  heroTitle: { fontFamily:'Syne,sans-serif', fontSize:40, fontWeight:800,
               color:'#f0f0ff', marginBottom:10 },
  heroSub: { color:'#7a7a9a', fontSize:16, marginBottom:20 },
  heroStats: { display:'flex', justifyContent:'center', gap:32 },
  heroStat: { color:'#7a7a9a', fontSize:14 },
  heroNum:  { color:'#6c63ff', fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:22, marginRight:4 },

  controls: { marginBottom:28 },
  search: { width:'100%', padding:'13px 18px', background:'#13131a',
            border:'1px solid #2a2a3d', borderRadius:12, color:'#f0f0ff',
            fontSize:14, outline:'none', marginBottom:16,
            boxSizing:'border-box', fontFamily:'DM Sans,sans-serif' },
  filters: { display:'flex', gap:8, flexWrap:'wrap' },
  filterBtn: { padding:'7px 16px', borderRadius:20, border:'1px solid #2a2a3d',
               background:'#13131a', color:'#7a7a9a', fontSize:13, cursor:'pointer', transition:'all .2s' },
  filterActive: { borderColor:'#6c63ff', background:'rgba(108,99,255,0.12)', color:'#6c63ff' },

  empty: { textAlign:'center', padding:'80px 20px', background:'#13131a',
           border:'1px solid #2a2a3d', borderRadius:20 },

  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:20 },
  card: { background:'#13131a', border:'1px solid #2a2a3d', borderRadius:20,
          padding:24, position:'relative', overflow:'hidden', cursor:'pointer' },
  cardBar: { position:'absolute', top:0, left:0, right:0, height:3,
             background:'linear-gradient(90deg,#6c63ff,#ff6584)' },
  verifiedBadge: { display:'inline-block', padding:'3px 10px',
                   background:'rgba(34,211,165,0.12)', border:'1px solid rgba(34,211,165,0.3)',
                   borderRadius:20, fontSize:11, color:'#22d3a5', marginBottom:12, fontWeight:600 },
  name:    { fontFamily:'Syne,sans-serif', fontSize:18, fontWeight:700, color:'#f0f0ff', marginBottom:4 },
  tagline: { color:'#6c63ff', fontSize:13, marginBottom:10 },
  about:   { color:'#a0a0c0', fontSize:13, lineHeight:1.6, marginBottom:12 },
  skillsRow: { display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 },
  skill:    { padding:'3px 10px', borderRadius:20, background:'rgba(108,99,255,0.12)',
              border:'1px solid rgba(108,99,255,0.2)', color:'#6c63ff', fontSize:11 },
  skillMore: { padding:'3px 10px', borderRadius:20, background:'#1c1c27', color:'#7a7a9a', fontSize:11 },
  cardFooter: { display:'flex', justifyContent:'space-between', alignItems:'center',
                paddingTop:12, borderTop:'1px solid #2a2a3d' },
  profession: { fontSize:12, color:'#7a7a9a', textTransform:'capitalize' },
  views:      { fontSize:12, color:'#7a7a9a' },
};