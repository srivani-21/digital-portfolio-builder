// pages/Settings.jsx

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Settings() {
  const { user, login, token } = useAuth();

  const [profile, setProfile] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
  });

  const [pass, setPass] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const [profileMsg, setProfileMsg] = useState({ text:'', type:'' });
  const [passMsg,    setPassMsg]    = useState({ text:'', type:'' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passLoading,    setPassLoading]    = useState(false);

  const showProfileMsg = (text, type) => {
    setProfileMsg({ text, type });
    setTimeout(() => setProfileMsg({ text:'', type:'' }), 4000);
  };

  const showPassMsg = (text, type) => {
    setPassMsg({ text, type });
    setTimeout(() => setPassMsg({ text:'', type:'' }), 4000);
  };

  // ── Save profile ────────────────────────────────────────────
  const handleProfile = async (e) => {
    e.preventDefault();

    if (!profile.name.trim() || !profile.email.trim()) {
      return showProfileMsg('⚠ Name and email cannot be empty', 'error');
    }

    setProfileLoading(true);
    try {
      const { data } = await API.put('/auth/update-profile', {
        name:  profile.name.trim(),
        email: profile.email.trim(),
      });

      // Update AuthContext + localStorage so navbar shows new name
      login(data.user, token);
      showProfileMsg('✅ Profile updated successfully!', 'success');

    } catch (err) {
      showProfileMsg('❌ ' + (err.response?.data?.message || 'Failed to update'), 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Change password ─────────────────────────────────────────
  const handlePassword = async (e) => {
    e.preventDefault();

    if (!pass.current || !pass.newPass || !pass.confirm) {
      return showPassMsg('⚠ Please fill all password fields', 'error');
    }
    if (pass.newPass.length < 6) {
      return showPassMsg('⚠ New password must be at least 6 characters', 'error');
    }
    if (pass.newPass !== pass.confirm) {
      return showPassMsg('⚠ New passwords do not match', 'error');
    }

    setPassLoading(true);
    try {
      await API.put('/auth/change-password', {
        currentPassword: pass.current,
        newPassword:     pass.newPass,
      });

      showPassMsg('✅ Password changed successfully!', 'success');
      setPass({ current:'', newPass:'', confirm:'' });

    } catch (err) {
      showPassMsg('❌ ' + (err.response?.data?.message || 'Failed to change password'), 'error');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div style={s.page}>

      {/* Page Header */}
      <div style={s.header}>
        <h1 style={s.title}>Settings</h1>
        <p style={s.sub}>Manage your account preferences</p>
      </div>

      {/* ── Profile Card ─────────────────────────────────── */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <div style={s.cardTitle}>Profile Information</div>
            <div style={s.cardSub}>Update your name and email address</div>
          </div>
        </div>

        {profileMsg.text && (
          <div style={{ ...s.alert, ...(profileMsg.type==='success' ? s.alertSuccess : s.alertError) }}>
            {profileMsg.text}
          </div>
        )}

        <form onSubmit={handleProfile}>
          <label style={s.label}>Full Name</label>
          <input
            style={s.input}
            placeholder="Your full name"
            value={profile.name}
            onChange={e => setProfile({ ...profile, name: e.target.value })}
            required
          />

          <label style={s.label}>Email Address</label>
          <input
            style={s.input}
            type="email"
            placeholder="your@email.com"
            value={profile.email}
            onChange={e => setProfile({ ...profile, email: e.target.value })}
            required
          />

          <button style={s.btn} type="submit" disabled={profileLoading}>
            {profileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* ── Password Card ─────────────────────────────────── */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={{ ...s.avatar, background:'linear-gradient(135deg,#f59e0b,#ef4444)' }}>
            🔒
          </div>
          <div>
            <div style={s.cardTitle}>Change Password</div>
            <div style={s.cardSub}>Keep your account secure with a strong password</div>
          </div>
        </div>

        {passMsg.text && (
          <div style={{ ...s.alert, ...(passMsg.type==='success' ? s.alertSuccess : s.alertError) }}>
            {passMsg.text}
          </div>
        )}

        <form onSubmit={handlePassword}>
          <label style={s.label}>Current Password</label>
          <input
            style={s.input}
            type="password"
            placeholder="Enter current password"
            value={pass.current}
            onChange={e => setPass({ ...pass, current: e.target.value })}
            required
          />

          <label style={s.label}>New Password</label>
          <input
            style={s.input}
            type="password"
            placeholder="Enter new password (min 6 characters)"
            value={pass.newPass}
            onChange={e => setPass({ ...pass, newPass: e.target.value })}
            required
          />

          {/* Password strength indicator */}
          {pass.newPass && (
            <div style={s.strengthWrap}>
              <div style={s.strengthBar}>
                <div style={{
                  ...s.strengthFill,
                  width: pass.newPass.length >= 10 ? '100%'
                       : pass.newPass.length >= 8  ? '66%'
                       : pass.newPass.length >= 6  ? '33%' : '10%',
                  background: pass.newPass.length >= 10 ? '#22d3a5'
                            : pass.newPass.length >= 8  ? '#f59e0b' : '#ef4444',
                }}/>
              </div>
              <span style={{ fontSize:11, color: pass.newPass.length >= 8 ? '#22d3a5' : '#7a7a9a' }}>
                {pass.newPass.length >= 10 ? 'Strong'
               : pass.newPass.length >= 8  ? 'Medium'
               : pass.newPass.length >= 6  ? 'Weak' : 'Too short'}
              </span>
            </div>
          )}

          <label style={s.label}>Confirm New Password</label>
          <input
            style={{
              ...s.input,
              borderColor: pass.confirm && pass.newPass !== pass.confirm
                ? 'rgba(239,68,68,0.5)' : '#2a2a3d',
            }}
            type="password"
            placeholder="Confirm new password"
            value={pass.confirm}
            onChange={e => setPass({ ...pass, confirm: e.target.value })}
            required
          />

          {/* Mismatch warning */}
          {pass.confirm && pass.newPass !== pass.confirm && (
            <p style={s.mismatch}>⚠ Passwords do not match</p>
          )}

          <button style={s.btn} type="submit" disabled={passLoading}>
            {passLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* ── Account Info Card ─────────────────────────────── */}
      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={{ ...s.avatar, background:'linear-gradient(135deg,#22d3a5,#059669)' }}>ℹ</div>
          <div>
            <div style={s.cardTitle}>Account Info</div>
            <div style={s.cardSub}>Your account details</div>
          </div>
        </div>

        <div style={s.infoTable}>
          <div style={s.infoRow}>
            <span style={s.infoLabel}>Name</span>
            <span style={s.infoVal}>{user?.name}</span>
          </div>
          <div style={s.infoRow}>
            <span style={s.infoLabel}>Email</span>
            <span style={s.infoVal}>{user?.email}</span>
          </div>
          <div style={s.infoRow}>
            <span style={s.infoLabel}>Role</span>
            <span style={{
              ...s.roleBadge,
              color:      user?.role === 'admin' ? '#f5c842' : '#6c63ff',
              background: user?.role === 'admin' ? 'rgba(245,200,66,0.1)' : 'rgba(108,99,255,0.1)',
              border:     `1px solid ${user?.role === 'admin' ? 'rgba(245,200,66,0.3)' : 'rgba(108,99,255,0.3)'}`,
            }}>
              {user?.role === 'admin' ? '👑 Admin' : '👤 User'}
            </span>
          </div>
          <div style={{ ...s.infoRow, borderBottom:'none' }}>
            <span style={s.infoLabel}>Account ID</span>
            <span style={{ ...s.infoVal, fontFamily:'monospace', fontSize:12 }}>
              {user?.id}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

const s = {
  page: { padding:40, maxWidth:680 },

  header: { marginBottom:32 },
  title:  { fontFamily:'Syne,sans-serif', fontSize:32, fontWeight:800, color:'#f0f0ff' },
  sub:    { color:'#7a7a9a', fontSize:15, marginTop:4 },

  card: {
    background:'#13131a', border:'1px solid #2a2a3d',
    borderRadius:20, padding:28, marginBottom:20,
  },
  cardHeader: {
    display:'flex', alignItems:'center', gap:14, marginBottom:24,
    paddingBottom:20, borderBottom:'1px solid #2a2a3d',
  },
  avatar: {
    width:48, height:48, borderRadius:14, flexShrink:0,
    background:'linear-gradient(135deg,#6c63ff,#ff6584)',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontWeight:800, fontSize:20, color:'#fff',
  },
  cardTitle: { fontFamily:'Syne,sans-serif', fontSize:17, fontWeight:700, color:'#f0f0ff' },
  cardSub:   { color:'#7a7a9a', fontSize:13, marginTop:3 },

  alert: { padding:'12px 14px', borderRadius:10, fontSize:13, marginBottom:18 },
  alertSuccess: {
    background:'rgba(34,211,165,0.1)', border:'1px solid rgba(34,211,165,0.25)', color:'#22d3a5',
  },
  alertError: {
    background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', color:'#ef4444',
  },

  label: {
    display:'block', fontSize:12, color:'#7a7a9a',
    marginBottom:6, fontWeight:500,
    letterSpacing:'0.3px', textTransform:'uppercase',
  },
  input: {
    width:'100%', padding:'12px 14px', background:'#1c1c27',
    border:'1px solid #2a2a3d', borderRadius:10, color:'#f0f0ff',
    fontSize:14, outline:'none', marginBottom:16,
    boxSizing:'border-box', fontFamily:'DM Sans,sans-serif',
    transition:'border-color .2s',
  },

  strengthWrap: { display:'flex', alignItems:'center', gap:10, marginBottom:16, marginTop:-10 },
  strengthBar:  { flex:1, height:4, background:'#2a2a3d', borderRadius:2, overflow:'hidden' },
  strengthFill: { height:'100%', borderRadius:2, transition:'all .3s' },

  mismatch: { color:'#ef4444', fontSize:12, marginTop:-10, marginBottom:14 },

  btn: {
    padding:'12px 28px',
    background:'linear-gradient(135deg,#6c63ff,#8b5cf6)',
    color:'#fff', border:'none', borderRadius:10,
    fontSize:14, fontWeight:600, cursor:'pointer',
    fontFamily:'DM Sans,sans-serif', marginTop:4,
    opacity:1, transition:'opacity .2s',
  },

  infoTable: { display:'flex', flexDirection:'column' },
  infoRow: {
    display:'flex', justifyContent:'space-between', alignItems:'center',
    padding:'13px 0', borderBottom:'1px solid #2a2a3d',
  },
  infoLabel: { color:'#7a7a9a', fontSize:13 },
  infoVal:   { color:'#a0a0c0', fontSize:13 },
  roleBadge: { padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:600 },
};