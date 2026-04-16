import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.left}>
        <div style={s.leftContent}>
          <div style={s.logoText}>⬡ PortfolioHub</div>
          <h1 style={s.heroTitle}>Build your<br/>digital identity.</h1>
          <p style={s.heroSub}>Create stunning portfolios, get verified by admins, and share your work with the world.</p>
          <div style={s.featureList}>
            {['Profession-based templates','Unique shareable links','Portfolio analytics','Admin verified badges'].map(f => (
              <div key={f} style={s.feature}>
                <span style={s.featureIcon}>✦</span> {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.right}>
        <div style={s.card} className="fade-up">
          <h2 style={s.title}>Welcome back</h2>
          <p style={s.sub}>Sign in to your account</p>

          {error && <div style={s.error}>⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />

            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />

            <button style={s.btn} type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <p style={s.footer}>No account?{' '}
            <Link to="/register" style={s.flink}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page:  { display:'flex', minHeight:'100vh', background:'#0a0a0f' },
  left:  { flex:1, background:'linear-gradient(135deg,#0d0d1a 0%,#13131a 100%)',
            borderRight:'1px solid #2a2a3d', display:'flex',
            alignItems:'center', justifyContent:'center', padding:60 },
  leftContent: { maxWidth:400 },
  logoText: { fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:22,
              background:'linear-gradient(135deg,#6c63ff,#ff6584)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              marginBottom:40 },
  heroTitle: { fontFamily:'Syne,sans-serif', fontSize:48, fontWeight:800,
               lineHeight:1.1, color:'#f0f0ff', marginBottom:16 },
  heroSub: { color:'#7a7a9a', fontSize:16, lineHeight:1.7, marginBottom:32 },
  featureList: { display:'flex', flexDirection:'column', gap:12 },
  feature: { display:'flex', alignItems:'center', gap:10, color:'#a0a0c0', fontSize:14 },
  featureIcon: { color:'#6c63ff', fontSize:12 },

  right: { width:480, display:'flex', alignItems:'center',
           justifyContent:'center', padding:40 },
  card: { width:'100%', maxWidth:400, background:'#13131a',
          border:'1px solid #2a2a3d', borderRadius:24, padding:40 },
  title: { fontFamily:'Syne,sans-serif', fontSize:26, fontWeight:800,
           color:'#f0f0ff', marginBottom:6 },
  sub: { color:'#7a7a9a', fontSize:14, marginBottom:28 },
  label: { display:'block', fontSize:12, color:'#7a7a9a', marginBottom:6,
           fontWeight:500, letterSpacing:'0.5px', textTransform:'uppercase' },
  input: { width:'100%', padding:'12px 16px', background:'#1c1c27',
           border:'1px solid #2a2a3d', borderRadius:10, color:'#f0f0ff',
           fontSize:14, outline:'none', marginBottom:18,
           boxSizing:'border-box', fontFamily:'DM Sans,sans-serif' },
  btn: { width:'100%', padding:14,
         background:'linear-gradient(135deg,#6c63ff,#8b5cf6)',
         color:'#fff', border:'none', borderRadius:10, fontSize:15,
         fontWeight:600, cursor:'pointer', marginTop:4 },
  error: { background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)',
           color:'#ef4444', padding:'10px 14px', borderRadius:10,
           fontSize:13, marginBottom:16 },
  footer: { marginTop:24, fontSize:13, textAlign:'center', color:'#7a7a9a' },
  flink: { color:'#6c63ff' },
};