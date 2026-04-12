// AdminPanel.jsx
// Admin can view all pending portfolios and approve or reject them

import { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminPanel = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [comment, setComment] = useState({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    const { data } = await API.get('/admin/pending');
    setPortfolios(data.portfolios);
  };

  const handleApprove = async (id) => {
    try {
      await API.put(`/admin/approve/${id}`);
      setMsg('✅ Portfolio approved!');
      fetchPending();
    } catch (err) {
      setMsg('❌ ' + err.response?.data?.message);
    }
  };

  const handleReject = async (id) => {
    if (!comment[id]) return setMsg('❌ Please enter a rejection reason');
    try {
      await API.put(`/admin/reject/${id}`, { comment: comment[id] });
      setMsg('✅ Portfolio rejected with comment');
      fetchPending();
    } catch (err) {
      setMsg('❌ ' + err.response?.data?.message);
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Admin Panel — Pending Portfolios</h2>
      {msg && <p style={styles.msg}>{msg}</p>}

      {portfolios.length === 0 && (
        <p style={{ color:'#64748b' }}>No pending portfolios at the moment.</p>
      )}

      {portfolios.map((p) => (
        <div key={p._id} style={styles.card}>
          <div style={styles.header}>
            <div>
              <h3>{p.fullName}</h3>
              <p style={styles.sub}>{p.tagline}</p>
              <p style={styles.sub}>Submitted by: {p.user?.name} ({p.user?.email})</p>
            </div>
            <span style={styles.badge}>PENDING</span>
          </div>

          <p style={styles.about}>{p.about}</p>

          <div style={styles.skills}>
            {p.skills.map(s => <span key={s} style={styles.skill}>{s}</span>)}
          </div>

          {p.projects?.length > 0 && (
            <div>
              <strong style={{ fontSize:'13px' }}>Projects:</strong>
              {p.projects.map((proj, i) => (
                <p key={i} style={styles.project}>• {proj.title} — {proj.description}</p>
              ))}
            </div>
          )}

          {/* Rejection comment input */}
          <textarea style={styles.input} rows={2}
            placeholder="Rejection reason (required to reject)"
            value={comment[p._id] || ''}
            onChange={(e) => setComment({ ...comment, [p._id]: e.target.value })}
          />

          <div style={styles.btnRow}>
            <button style={styles.approveBtn} onClick={() => handleApprove(p._id)}>
              ✅ Approve
            </button>
            <button style={styles.rejectBtn} onClick={() => handleReject(p._id)}>
              ❌ Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  page: { maxWidth:'800px', margin:'40px auto', padding:'0 20px' },
  heading: { fontSize:'24px', color:'#1e293b', marginBottom:'20px' },
  card: { background:'#fff', borderRadius:'12px', padding:'24px',
          boxShadow:'0 2px 12px rgba(0,0,0,0.08)', marginBottom:'20px' },
  header: { display:'flex', justifyContent:'space-between', marginBottom:'12px' },
  badge: { background:'#f59e0b', color:'#fff', padding:'4px 12px',
           borderRadius:'20px', fontSize:'12px', height:'fit-content' },
  sub: { color:'#64748b', fontSize:'13px', margin:'2px 0' },
  about: { color:'#475569', fontSize:'14px', margin:'8px 0' },
  skills: { display:'flex', flexWrap:'wrap', gap:'6px', margin:'10px 0' },
  skill: { background:'#eff6ff', color:'#1d4ed8', padding:'3px 10px',
           borderRadius:'20px', fontSize:'12px' },
  project: { fontSize:'13px', color:'#334155', margin:'3px 0' },
  input: { width:'100%', padding:'10px', border:'1px solid #e2e8f0',
           borderRadius:'8px', fontSize:'13px', marginTop:'12px',
           boxSizing:'border-box', fontFamily:'inherit' },
  btnRow: { display:'flex', gap:'12px', marginTop:'12px' },
  approveBtn: { padding:'9px 20px', background:'#10b981', color:'#fff',
                border:'none', borderRadius:'8px', cursor:'pointer' },
  rejectBtn: { padding:'9px 20px', background:'#ef4444', color:'#fff',
               border:'none', borderRadius:'8px', cursor:'pointer' },
  msg: { padding:'10px', background:'#f0fdf4', borderRadius:'8px',
         color:'#166534', marginBottom:'16px', fontSize:'14px' },
};

export default AdminPanel;