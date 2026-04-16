import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Settings() {
  const { user } = useAuth();
  const [form, setForm]   = useState({ name: user?.name || '', email: user?.email || '' });
  const [pass, setPass]   = useState({ current:'', newPass:'', confirm:'' });
  const [msg, setMsg]     = useState({ text:'', type:'' });

  const showMsg = (text, type) => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text:'', type:'' }), 3000);
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    try {
      await API.put('/auth/update-profile', form);
      showMsg('✅ Profile updated!', 'success');
    } catch (err) {
      showMsg('❌ ' + (err.response?.data?.message || 'Error'), 'error');
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pass.newPass !== pass.confirm)
      return showMsg('❌ Passwords do not match', 'error');
    try {
      await API.put('/auth/change-password', { currentPassword: pass.current, newPassword: pass.newPass });
      showMsg('✅ Password changed!', 'success');
      setPass({ current:'', newPass:'', confirm:'' });
    } catch (err) {
      showMsg('❌ ' + (err.response?.data?.message || 'Error'), 'error');
    }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Settings</h1>
        <p style={s.sub}>Manage your account preferences</p>
      </div>

      {msg.text && (
        <div style={{ ...s.alert, ...(msg.type==='success' ? s.alertSuccess : s.alertError) }}>
          {msg.text}
        </div>
      )}

      {/* Profile info */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <div style={s.cardTitle}>Profile Information</div>
            <div style={s.cardSub}>Update your name and email</div>
          </div>
        </div>
        <form onSubmit={handleProfile}>
          <label style={s.label}>Full Name</label>
          <input style={s.input} value={form.name}
            onChange={e => setForm({...form, name: e.target.value})} />
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} />
          <button style={s.btn} type="submit">Save Changes</button>
        </form>
      </div>

      {/* Change password */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={{ ...s.avatar, background:'linear-gradient(135deg,#f59e0b,#ef4444)' }}>🔒</div>
          <div>
            <div style={s.cardTitle}>Change Password</div>
            <div style={s.cardSub}>Keep your account secure</div>
          </div>
        </div>
        <form onSubmit={handlePassword}>
          <label style={s.label}>Current Password</label>
          <input style={s.input} type="password" placeholder="••••••••"
            value={pass.current} onChange={e => setPass({...pass, current: e.target.value})} />
          <label style={s.label}>New Password</label>
          <input style={s.input} type="password" placeholder="••••••••"
            value={pass.newPass} onChange={e => setPass({...pass, newPass: e.target.value})} />
          <label style={s.label}>Confirm New Password</label>
          <input style={s.input} type="password" placeholder="••••••••"
            value={pass.confirm} onChange={e => setPass({...pass, confirm: e.target.value})} />
          <button style={s.btn} type="submit">Update Password</button>
        </form>
      </div>

      {/* Account info */}
      <div style={s.card}>
        <div style={s.cardTitle} style={{...s.cardTitle, marginBottom:16}}>Account Info</div>
        <div style={s.infoRow}><span style={s.infoLabel}>Role</span>
          <span style={{ ...s.infoBadge, color: user?.role==='admin' ? '#f5c842' : '#6c63ff',
                         background: user?.role==='admin' ? 'rgba(245,200,66,0.1)' : 'rgba(108,99,255,0.1)' }}>
            {user?.role === 'admin' ? '👑 Admin' : '👤 User'}
          </span>
        </div>
        <div style={s.infoRow}>
          <span style={s.infoLabel}>Account ID</span>
          <span style={s.infoVal}>{user?.id?.substring(0, 16)}...</span>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { padding:40, maxWidth:680 },
  header: { marginBottom:32 },
  title: { fontFamily:'Syne,sans-serif', fontSize:32, fontWeight:800, color:'#f0f0ff' },
  sub:   { color:'#7a7a9a', fontSize:15, marginTop:4 },
  alert: { padding:'12px 16px', borderRadius:10, fontSize:13, marginBottom:20 },
  alertSuccess: { background:'rgba(34,211,165,0.1)', border:'1px solid rgba(34,211,165,0.25)', color:'#22d3a5' },
  alertError:   { background:'rgba(239,68,68,0.1)',  border:'1px solid rgba(239,68,68,0.25)',  color:'#ef4444' },
  card: { background:'#13131a', border:'1px solid #2a2a3d', borderRadius:20, padding:28, marginBottom:20 },
  cardHeader: { display:'flex', alignItems:'center', gap:14, marginBottom:24 },
  avatar: { width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,#6c63ff,#ff6584)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:800, fontSize:20, color:'#fff', flexShrink:0 },
  cardTitle: { fontFamily:'Syne,sans-serif', fontSize:17, fontWeight:700, color:'#f0f0ff' },
  cardSub:   { color:'#7a7a9a', fontSize:13, marginTop:2 },
  label: { display:'block', fontSize:12, color:'#7a7a9a', marginBottom:6,
           fontWeight:500, letterSpacing:'0.3px', textTransform:'uppercase' },
  input: { width:'100%', padding:'12px 14px', background:'#1c1c27',
           border:'1px solid #2a2a3d', borderRadius:10, color:'#f0f0ff',
           fontSize:14, outline:'none', marginBottom:16,
           boxSizing:'border-box', fontFamily:'DM Sans,sans-serif' },
  btn: { padding:'11px 24px', background:'linear-gradient(135deg,#6c63ff,#8b5cf6)',
         color:'#fff', border:'none', borderRadius:10, fontSize:14, fontWeight:600, cursor:'pointer' },
  infoRow:   { display:'flex', justifyContent:'space-between', alignItems:'center',
               padding:'12px 0', borderBottom:'1px solid #2a2a3d' },
  infoLabel: { color:'#7a7a9a', fontSize:13 },
  infoVal:   { color:'#a0a0c0', fontSize:13, fontFamily:'monospace' },
  infoBadge: { padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:600 },
};