import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const userLinks = [
  { to: '/dashboard',        icon: '⊞', label: 'Dashboard'       },
  { to: '/create-portfolio', icon: '✦', label: 'Create Portfolio' },
  { to: '/my-portfolios',    icon: '◈', label: 'My Portfolios'    },
  { to: '/portfolios',       icon: '◉', label: 'Browse Public'    },
  { to: '/settings',         icon: '⚙', label: 'Settings'         },
];

const adminLinks = [
  { to: '/admin',     icon: '👑', label: 'Admin Panel'    },
  { to: '/portfolios', icon: '◉', label: 'Browse Public'  },
  { to: '/settings',  icon: '⚙', label: 'Settings'        },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === 'admin' ? adminLinks : userLinks;

  return (
    <aside style={s.sidebar}>
      {/* Brand */}
      <div style={s.brand} onClick={() => navigate('/dashboard')}>
        <div style={s.brandIcon}>⬡</div>
        <div>
          <div style={s.brandName}>PortfolioHub</div>
          <div style={s.brandSub}>Build · Share · Grow</div>
        </div>
      </div>

      {/* User pill */}
      <div style={s.userPill}>
        <div style={s.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
        <div style={s.userInfo}>
          <div style={s.userName}>{user?.name}</div>
          <div style={s.userRole}>{user?.role === 'admin' ? '👑 Admin' : '👤 User'}</div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={s.nav}>
        <div style={s.navLabel}>MENU</div>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              ...s.link,
              ...(isActive ? s.linkActive : {}),
            })}
          >
            <span style={s.icon}>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button style={s.logout} onClick={() => { logout(); navigate('/login'); }}>
        ⏻ &nbsp;Logout
      </button>
    </aside>
  );
};

const s = {
  sidebar: {
    width: '240px', minHeight: '100vh', background: '#13131a',
    borderRight: '1px solid #2a2a3d', display: 'flex',
    flexDirection: 'column', padding: '24px 16px', position: 'fixed',
    top: 0, left: 0, zIndex: 50,
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 10,
    marginBottom: 28, cursor: 'pointer', padding: '4px 8px',
  },
  brandIcon: {
    fontSize: 28,
    background: 'linear-gradient(135deg,#6c63ff,#ff6584)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  brandName: {
    fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, color: '#f0f0ff',
  },
  brandSub: { fontSize: 10, color: '#7a7a9a', letterSpacing: '0.5px' },

  userPill: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: '#1c1c27', border: '1px solid #2a2a3d',
    borderRadius: 12, padding: '10px 12px', marginBottom: 24,
  },
  avatar: {
    width: 36, height: 36, borderRadius: 10,
    background: 'linear-gradient(135deg,#6c63ff,#ff6584)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 15, color: '#fff', flexShrink: 0,
  },
  userInfo: { overflow: 'hidden' },
  userName: { fontSize: 14, fontWeight: 500, color: '#f0f0ff',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userRole: { fontSize: 11, color: '#7a7a9a', marginTop: 1 },

  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: 2 },
  navLabel: {
    fontSize: 10, color: '#4a4a6a', letterSpacing: '1.5px',
    fontWeight: 700, padding: '0 8px', marginBottom: 8,
  },
  link: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 12px', borderRadius: 10, fontSize: 14,
    color: '#7a7a9a', transition: 'all .2s', fontWeight: 400,
  },
  linkActive: {
    background: 'rgba(108,99,255,0.12)',
    color: '#6c63ff', fontWeight: 500,
    borderLeft: '3px solid #6c63ff',
  },
  icon: { fontSize: 16, width: 20, textAlign: 'center' },
  logout: {
    marginTop: 'auto', padding: '10px 12px', background: 'transparent',
    border: '1px solid #2a2a3d', borderRadius: 10, color: '#7a7a9a',
    fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
    transition: 'all .2s',
  },
};

export default Sidebar;