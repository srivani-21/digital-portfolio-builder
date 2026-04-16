import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';

export default function PortfolioView() {
  const { username }            = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    API.get(`/portfolio/view/${username}`)
      .then(({ data }) => setPortfolio(data.portfolio))
      .catch(() => setError('Portfolio not found'))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <div style={s.center}><div style={s.loadText}>Loading...</div></div>;
  if (error)   return <div style={s.center}><div style={s.errText}>Portfolio not found 😕</div></div>;
  if (!portfolio) return null;

  const t = portfolio.template || 'modern';

  return (
    <div style={t === 'creative' ? s.creativePage : t === 'minimal' ? s.minimalPage : s.modernPage}>

      {/* MODERN TEMPLATE */}
      {t === 'modern' && (
        <>
          <div style={s.modernHero}>
            <div style={s.modernHeroInner}>
              <div style={s.modernAvatar}>{portfolio.fullName?.charAt(0)}</div>
              <div>
                <h1 style={s.modernName}>{portfolio.fullName}</h1>
                <p style={s.modernTagline}>{portfolio.tagline}</p>
                <div style={s.modernBadges}>
                  <span style={s.verifiedBadge}>✓ Verified</span>
                  {portfolio.profession && <span style={s.profBadge}>{portfolio.profession}</span>}
                </div>
              </div>
            </div>
          </div>
          <div style={s.modernBody}>
            <PortfolioSections portfolio={portfolio} theme="modern" />
          </div>
        </>
      )}

      {/* MINIMAL TEMPLATE */}
      {t === 'minimal' && (
        <div style={s.minimalBody}>
          <div style={s.minimalHeader}>
            <h1 style={s.minimalName}>{portfolio.fullName}</h1>
            <p style={s.minimalTagline}>{portfolio.tagline}</p>
            <div style={s.minimalDivider} />
          </div>
          <PortfolioSections portfolio={portfolio} theme="minimal" />
        </div>
      )}

      {/* CREATIVE TEMPLATE */}
      {t === 'creative' && (
        <>
          <div style={s.creativeHero}>
            <div style={s.creativeName}>{portfolio.fullName}</div>
            <div style={s.creativeTagline}>{portfolio.tagline}</div>
          </div>
          <div style={s.creativeBody}>
            <PortfolioSections portfolio={portfolio} theme="creative" />
          </div>
        </>
      )}
    </div>
  );
}

// Shared sections across all templates
const PortfolioSections = ({ portfolio: p, theme }) => {
  const isModern   = theme === 'modern';
  const isMinimal  = theme === 'minimal';
  const isCreative = theme === 'creative';

  const sectionStyle = {
    modern:   { background:'#13131a', border:'1px solid #2a2a3d', borderRadius:16, padding:28, marginBottom:20 },
    minimal:  { borderBottom:'1px solid #2a2a3d', paddingBottom:28, marginBottom:28 },
    creative: { background:'rgba(255,255,255,0.03)', border:'1px solid rgba(108,99,255,0.2)', borderRadius:16, padding:28, marginBottom:20 },
  };
  const ss = sectionStyle[theme];

  const headStyle = {
    modern:   { fontFamily:'Syne,sans-serif', fontSize:16, fontWeight:700, color:'#6c63ff', marginBottom:16, textTransform:'uppercase', letterSpacing:'1px' },
    minimal:  { fontFamily:'Syne,sans-serif', fontSize:13, fontWeight:700, color:'#7a7a9a', marginBottom:14, textTransform:'uppercase', letterSpacing:'2px' },
    creative: { fontFamily:'Syne,sans-serif', fontSize:14, fontWeight:700, color:'#ff6584', marginBottom:16, textTransform:'uppercase', letterSpacing:'1.5px' },
  };
  const hs = headStyle[theme];

  return (
    <>
      {p.about && (
        <div style={ss}>
          <div style={hs}>About</div>
          <p style={{ color:'#a0a0c0', lineHeight:1.8, fontSize:15 }}>{p.about}</p>
        </div>
      )}

      {p.skills?.length > 0 && (
        <div style={ss}>
          <div style={hs}>Skills</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {p.skills.map(sk => (
              <span key={sk} style={{ padding:'6px 16px', borderRadius:20,
                background: isMinimal ? '#1c1c27' : isCreative ? 'rgba(255,101,132,0.12)' : 'rgba(108,99,255,0.12)',
                border: `1px solid ${isMinimal ? '#2a2a3d' : isCreative ? 'rgba(255,101,132,0.25)' : 'rgba(108,99,255,0.25)'}`,
                color: isMinimal ? '#a0a0c0' : isCreative ? '#ff6584' : '#6c63ff',
                fontSize:13, fontWeight:500 }}>
                {sk}
              </span>
            ))}
          </div>
        </div>
      )}

      {p.achievements?.length > 0 && (
        <div style={ss}>
          <div style={hs}>Achievements</div>
          {p.achievements.map((a, i) => (
            <div key={i} style={{ display:'flex', gap:10, marginBottom:8 }}>
              <span style={{ color:'#f5c842' }}>🏆</span>
              <span style={{ color:'#a0a0c0', fontSize:14 }}>{a}</span>
            </div>
          ))}
        </div>
      )}

      {(p.email || p.phone || p.linkedin || p.github) && (
        <div style={ss}>
          <div style={hs}>Contact</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
            {p.email    && <a href={`mailto:${p.email}`}    style={s.contactLink}>📧 {p.email}</a>}
            {p.phone    && <span style={s.contactLink}>📞 {p.phone}</span>}
            {p.github   && <a href={`https://${p.github}`}  target="_blank" rel="noreferrer" style={s.contactLink}>🐙 GitHub</a>}
            {p.linkedin && <a href={`https://${p.linkedin}`} target="_blank" rel="noreferrer" style={s.contactLink}>💼 LinkedIn</a>}
          </div>
        </div>
      )}
    </>
  );
};

const s = {
  center:    { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh' },
  loadText:  { color:'#7a7a9a', fontSize:16 },
  errText:   { color:'#ef4444', fontSize:18, fontFamily:'Syne,sans-serif' },
  contactLink: { padding:'8px 16px', background:'#1c1c27', border:'1px solid #2a2a3d',
                 borderRadius:8, color:'#a0a0c0', fontSize:13, display:'inline-block' },
  verifiedBadge: { padding:'4px 12px', background:'rgba(34,211,165,0.12)',
                   border:'1px solid rgba(34,211,165,0.3)', borderRadius:20,
                   fontSize:12, color:'#22d3a5', fontWeight:600 },
  profBadge: { padding:'4px 12px', background:'rgba(108,99,255,0.12)',
               border:'1px solid rgba(108,99,255,0.25)', borderRadius:20,
               fontSize:12, color:'#6c63ff' },

  // Modern
  modernPage: { background:'#0a0a0f', minHeight:'100vh' },
  modernHero: { background:'linear-gradient(135deg,#0d0d1a,#13131a)',
                borderBottom:'1px solid #2a2a3d', padding:'60px 40px' },
  modernHeroInner: { maxWidth:800, margin:'0 auto', display:'flex', alignItems:'center', gap:28 },
  modernAvatar: { width:80, height:80, borderRadius:20,
                  background:'linear-gradient(135deg,#6c63ff,#ff6584)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'Syne,sans-serif', fontSize:32, fontWeight:800, color:'#fff', flexShrink:0 },
  modernName:    { fontFamily:'Syne,sans-serif', fontSize:36, fontWeight:800, color:'#f0f0ff', marginBottom:6 },
  modernTagline: { color:'#6c63ff', fontSize:16, marginBottom:12 },
  modernBadges:  { display:'flex', gap:8 },
  modernBody:    { maxWidth:800, margin:'40px auto', padding:'0 40px 60px' },

  // Minimal
  minimalPage: { background:'#0a0a0f', minHeight:'100vh' },
  minimalBody: { maxWidth:680, margin:'0 auto', padding:'80px 40px' },
  minimalHeader: { marginBottom:48 },
  minimalName:   { fontFamily:'Syne,sans-serif', fontSize:44, fontWeight:800, color:'#f0f0ff', marginBottom:8 },
  minimalTagline: { color:'#7a7a9a', fontSize:18, marginBottom:24 },
  minimalDivider: { width:60, height:2, background:'#6c63ff', borderRadius:1 },

  // Creative
  creativePage: { background:'linear-gradient(135deg,#0a0a0f,#0d0820)', minHeight:'100vh' },
  creativeHero: { padding:'80px 60px 60px',
                  background:'linear-gradient(135deg,rgba(108,99,255,0.1),rgba(255,101,132,0.05))',
                  borderBottom:'1px solid rgba(108,99,255,0.2)' },
  creativeName:    { fontFamily:'Syne,sans-serif', fontSize:52, fontWeight:800,
                     background:'linear-gradient(135deg,#6c63ff,#ff6584)',
                     WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                     marginBottom:10, maxWidth:800 },
  creativeTagline: { color:'#a0a0c0', fontSize:18, maxWidth:600 },
  creativeBody:    { maxWidth:800, margin:'0 auto', padding:'40px 60px 80px' },
};