// PublicPortfolios.jsx
// Shows all approved portfolios — no login needed

import { useEffect, useState } from 'react';
import API from '../api/axios';

const PublicPortfolios = () => {
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    API.get('/portfolio/public').then(({ data }) => setPortfolios(data.portfolios));
  }, []);

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>🌐 Verified Portfolios</h2>

      {portfolios.length === 0 && (
        <p style={{ color:'#a0a0c0' }}>No approved portfolios yet.</p>
      )}

      <div style={styles.grid}>
        {portfolios.map((p) => (
          <div key={p._id} style={styles.card}>
            <h3 style={styles.name}>{p.fullName}</h3>
            <p style={styles.tagline}>{p.tagline}</p>
            <p style={styles.about}>{p.about}</p>
            <div style={styles.skills}>
              {p.skills.map(s => (
                <span key={s} style={styles.skill}>{s}</span>
              ))}
            </div>
            <div style={styles.links}>
              {p.github && <a href={`https://${p.github}`} target="_blank" rel="noreferrer" style={styles.link}>GitHub</a>}
              {p.linkedin && <a href={`https://${p.linkedin}`} target="_blank" rel="noreferrer" style={styles.link}>LinkedIn</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: { maxWidth:'900px', margin:'40px auto', padding:'0 20px' },
  heading: { fontSize:'26px', color:'#f0f0ff', marginBottom:'24px' },         // ← was #1e293b
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'20px' },
  card: { background:'#13131a', borderRadius:'12px', padding:'20px',          // ← was #fff
          border:'1px solid #2a2a3d', boxShadow:'0 2px 12px rgba(0,0,0,0.3)' },
  name: { color:'#f0f0ff', marginBottom:'4px' },                              // ← was #1e293b
  tagline: { color:'#6c63ff', fontSize:'13px', marginBottom:'8px' },          // ← was #3b82f6
  about: { color:'#a0a0c0', fontSize:'13px', marginBottom:'12px' },           // ← was #64748b
  skills: { display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'12px' },
  skill: { background:'rgba(108,99,255,0.12)', color:'#6c63ff',               // ← was light blue
           padding:'3px 10px', borderRadius:'20px', fontSize:'12px',
           border:'1px solid rgba(108,99,255,0.25)' },
  links: { display:'flex', gap:'12px' },
  link: { color:'#a0a0c0', fontSize:'13px' },                                 // ← was #3b82f6
};

export default PublicPortfolios;