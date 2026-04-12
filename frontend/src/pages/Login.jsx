import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
      <div style={s.card}>
        <div style={s.glow} />
        <div style={s.glow2} />
        <h2 style={s.title}>Welcome back</h2>
        <p style={s.sub}>Sign in to your portfolio account</p>

        {error && <div style={s.error}>⚠ {error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Email address</label>
          <input style={s.input} type="email" placeholder="you@example.com"
            value={form.email} onChange={e => setForm({...form, email:e.target.value})} required/>
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" placeholder="••••••••"
            value={form.password} onChange={e => setForm({...form, password:e.target.value})} required/>
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>
        <p style={s.footer}>No account? <Link to="/register" style={s.flink}>Create one</Link></p>
      </div>
    </div>
  );
};

const s = {
  page: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'90vh' },
  card: { width:420, background:'#13131a', border:'1px solid #2a2a3d', borderRadius:20, padding:40, position:'relative', overflow:'hidden' },
  glow: { position:'absolute', top:-60, right:-60, width:180, height:180, background:'radial-gradient(circle,rgba(108,99,255,0.15),transparent 70%)', borderRadius:'50%', pointerEvents:'none' },
  glow2: { position:'absolute', bottom:-40, left:-40, width:120, height:120, background:'radial-gradient(circle,rgba(255,101,132,0.1),transparent 70%)', borderRadius:'50%', pointerEvents:'none' },
  title: { fontFamily:'Syne,sans-serif', fontSize:26, fontWeight:800, marginBottom:6, position:'relative' },
  sub: { color:'#7a7a9a', fontSize:14, marginBottom:28, position:'relative' },
  label: { display:'block', fontSize:12, color:'#7a7a9a', marginBottom:6, fontWeight:500, letterSpacing:'0.5px', textTransform:'uppercase' },
  input: { width:'100%', padding:'12px 16px', background:'#1c1c27', border:'1px solid #2a2a3d', borderRadius:10, color:'#f0f0ff', fontSize:14, fontFamily:'DM Sans,sans-serif', outline:'none', marginBottom:18, display:'block' },
  btn: { width:'100%', padding:14, background:'linear-gradient(135deg,#6c63ff,#8b5cf6)', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'DM Sans,sans-serif', position:'relative' },
  error: { background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', color:'#ef4444', padding:'10px 14px', borderRadius:10, fontSize:13, marginBottom:16 },
  footer: { marginTop:20, fontSize:13, textAlign:'center', color:'#7a7a9a' },
  flink: { color:'#6c63ff' },
};

export default Login;