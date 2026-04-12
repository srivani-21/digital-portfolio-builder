import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={s.nav}>
      <Link to="/portfolios" style={s.brand}>⬡ PortfolioHub</Link>
      <div style={s.links}>
        <Link to="/portfolios" style={s.link}>Portfolios</Link>
        {!user && <><Link to="/login" style={s.link}>Login</Link><Link to="/register" style={s.linkBtn}>Get Started</Link></>}
        {user?.role === 'user' && <Link to="/dashboard" style={s.link}>Dashboard</Link>}
        {user?.role === 'admin' && <Link to="/admin" style={s.adminLink}>👑 Admin</Link>}
        {user && (
          <div style={s.userRow}>
            <div style={s.pill}>
              <div style={{...s.dot, background: user.role === 'admin' ? '#f5c842' : '#22d3a5'}}/>
              {user.name}
            </div>
            <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

const s = {
  nav: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 40px', background:'rgba(10,10,15,0.9)', backdropFilter:'blur(20px)', borderBottom:'1px solid #2a2a3d', position:'sticky', top:0, zIndex:100 },
  brand: { fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'20px', background:'linear-gradient(135deg,#6c63ff,#ff6584)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'-0.5px' },
  links: { display:'flex', alignItems:'center', gap:'8px' },
  link: { padding:'8px 16px', borderRadius:'8px', fontSize:'13px', color:'#7a7a9a', transition:'all .2s' },
  linkBtn: { padding:'8px 20px', borderRadius:'8px', fontSize:'13px', background:'linear-gradient(135deg,#6c63ff,#8b5cf6)', color:'#fff', fontWeight:500 },
  adminLink: { padding:'8px 16px', borderRadius:'8px', fontSize:'13px', color:'#f5c842', background:'rgba(245,200,66,0.1)', border:'1px solid rgba(245,200,66,0.25)' },
  userRow: { display:'flex', alignItems:'center', gap:'8px' },
  pill: { display:'flex', alignItems:'center', gap:'6px', padding:'6px 14px', background:'#1c1c27', border:'1px solid #2a2a3d', borderRadius:'20px', fontSize:'13px', color:'#7a7a9a' },
  dot: { width:7, height:7, borderRadius:'50%' },
  logoutBtn: { padding:'7px 16px', borderRadius:'8px', background:'transparent', border:'1px solid #2a2a3d', color:'#7a7a9a', fontSize:'13px', cursor:'pointer', fontFamily:'DM Sans,sans-serif' },
};

export default Navbar;