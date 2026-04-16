import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const ADMIN_SECRET = 'PORTFOLIO_ADMIN_2025';

export default function Register() {
  const [form, setForm]       = useState({ name:'', email:'', password:'', role:'user' });
  const [adminKey, setAdminKey] = useState('');
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (form.role === 'admin' && adminKey !== ADMIN_SECRET)
      return setError('Invalid admin secret key');
    try {
      await API.post('/auth/register', { ...form, adminKey });
      setSuccess('Account created! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={s.page}>
      <div style={s.left}>
        <div style={s.leftContent}>
          <div style={s.logoText}>⬡ PortfolioHub</div>
          <h1 style={s.heroTitle}>Your career,<br/>beautifully told.</h1>
          <p style={s.heroSub}>Join thousands of professionals showcasing their work with verified digital portfolios.</p>
        </div>
      </div>

      <div style={s.right}>
        <div style={s.card} className="fade-up">
          <h2 style={s.title}>Create account</h2>
          <p style={s.sub}>Start building your portfolio today</p>

          {error   && <div style={s.error}>⚠ {error}</div>}
          {success && <div style={s.successMsg}>✓ {success}</div>}

          <form onSubmit={handleSubmit}>
            <label style={s.label}>Full name</label>
            <input style={s.input} placeholder="Enter your full name"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />

            <label style={s.label}>Email</label>
            <input style={s.input} type="email" placeholder="your@email.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />

            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="Create a password"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />

            <label style={s.label}>Account type</label>
            <div style={s.roleRow}>
              {['user','admin'].map(r => (
                <div key={r} style={{
                  ...s.roleOpt,
                  ...(form.role === r ? (r === 'admin' ? s.roleAdmin : s.roleUser) : {})
                }} onClick={() => setForm({...form, role: r})}>
                  {r === 'admin' ? '👑 Admin' : '👤 User'}
                </div>
              ))}
            </div>

            {form.role === 'admin' && (
              <div style={s.adminBox}>
                <p style={s.adminNote}>🔒 Admin accounts require a secret key</p>
                <label style={s.label}>Admin secret key</label>
                <input style={s.input} type="password" placeholder="Enter admin secret key"
                  value={adminKey} onChange={e => setAdminKey(e.target.value)} />
              </div>
            )}

            <button style={s.btn} type="submit">Create account →</button>
          </form>

          <p style={s.footer}>Already have an account?{' '}
            <Link to="/login" style={s.flink}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { display:'flex', minHeight:'100vh', background:'#0a0a0f' },
  left: { flex:1, background:'linear-gradient(135deg,#0d0d1a,#13131a)',
          borderRight:'1px solid #2a2a3d', display:'flex',
          alignItems:'center', justifyContent:'center', padding:60 },
  leftContent: { maxWidth:400 },
  logoText: { fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:22,
              background:'linear-gradient(135deg,#6c63ff,#ff6584)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:40 },
  heroTitle: { fontFamily:'Syne,sans-serif', fontSize:44, fontWeight:800,
               lineHeight:1.1, color:'#f0f0ff', marginBottom:16 },
  heroSub: { color:'#7a7a9a', fontSize:16, lineHeight:1.7 },
  right: { width:480, display:'flex', alignItems:'center', justifyContent:'center', padding:40 },
  card: { width:'100%', maxWidth:420, background:'#13131a',
          border:'1px solid #2a2a3d', borderRadius:24, padding:40 },
  title: { fontFamily:'Syne,sans-serif', fontSize:26, fontWeight:800, color:'#f0f0ff', marginBottom:6 },
  sub: { color:'#7a7a9a', fontSize:14, marginBottom:28 },
  label: { display:'block', fontSize:12, color:'#7a7a9a', marginBottom:6,
           fontWeight:500, letterSpacing:'0.5px', textTransform:'uppercase' },
  input: { width:'100%', padding:'12px 16px', background:'#1c1c27',
           border:'1px solid #2a2a3d', borderRadius:10, color:'#f0f0ff',
           fontSize:14, outline:'none', marginBottom:18,
           boxSizing:'border-box', fontFamily:'DM Sans,sans-serif' },
  roleRow: { display:'flex', gap:8, marginBottom:20 },
  roleOpt: { flex:1, padding:'11px 0', textAlign:'center', borderRadius:10,
             border:'1px solid #2a2a3d', background:'#1c1c27',
             color:'#7a7a9a', fontSize:14, cursor:'pointer', transition:'all .2s' },
  roleUser:  { borderColor:'#6c63ff', background:'rgba(108,99,255,0.12)', color:'#6c63ff' },
  roleAdmin: { borderColor:'#f5c842', background:'rgba(245,200,66,0.1)',  color:'#f5c842' },
  adminBox: { background:'rgba(245,200,66,0.05)', border:'1px solid rgba(245,200,66,0.15)',
              borderRadius:12, padding:16, marginBottom:18 },
  adminNote: { color:'#f5c842', fontSize:13, marginBottom:14 },
  btn: { width:'100%', padding:14, background:'linear-gradient(135deg,#6c63ff,#8b5cf6)',
         color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:600, cursor:'pointer' },
  error: { background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)',
           color:'#ef4444', padding:'10px 14px', borderRadius:10, fontSize:13, marginBottom:16 },
  successMsg: { background:'rgba(34,211,165,0.1)', border:'1px solid rgba(34,211,165,0.25)',
                color:'#22d3a5', padding:'10px 14px', borderRadius:10, fontSize:13, marginBottom:16 },
  footer: { marginTop:24, fontSize:13, textAlign:'center', color:'#7a7a9a' },
  flink: { color:'#6c63ff' },
};