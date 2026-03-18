import { Binary, Search, Layers, Settings, HelpCircle, History, Filter } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Sidebar */}
      <aside className="sidebar" style={{
        width: 'var(--sidebar-width)',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10
      }}>
        <div className="sidebar-header" style={{
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{
            background: 'var(--accent)',
            padding: '8px',
            borderRadius: '8px',
            boxShadow: '0 0 20px var(--accent-glow)'
          }}>
            <Binary size={20} color="#0a0a0c" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.03em' }}>
            Research<span style={{ color: 'var(--accent)' }}>Node</span>
          </span>
        </div>

        <nav className="sidebar-nav" style={{ padding: '16px', flex: 1 }}>
          <div className="nav-section">
            <p style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', paddingLeft: '8px', fontWeight: 600 }}>Workspace</p>
            <NavItem to="/analyze" icon={<Search size={18} />} label="Analyze" />
            <NavItem to="/correlations" icon={<Layers size={18} />} label="Correlations" />
            <NavItem to="/library" icon={<History size={18} />} label="Library" />
          </div>
        </nav>

        <div className="sidebar-footer" style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
          <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
          <NavItem to="#" icon={<HelpCircle size={18} />} label="Need Help?" />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', overflow: 'hidden' }}>
        <header style={{
          height: 'var(--header-height)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: 'rgba(10, 10, 12, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 5
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-secondary)' }}>Research Assistant</h2>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }}></span>
              Model: GPT-4o Optimized
            </div>
          </div>
        </header>

        <div className="content-area" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => (
  <NavLink to={to} style={{ textDecoration: 'none' }}>
    {({ isActive }) => (
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 12px',
        borderRadius: '8px',
        background: isActive ? 'var(--glass)' : 'transparent',
        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
        marginBottom: '4px',
        fontSize: '14px',
        fontWeight: isActive ? 500 : 400
      }}>
        <span style={{ color: isActive ? 'var(--accent)' : 'inherit' }}>{icon}</span>
        {label}
      </div>
    )}
  </NavLink>
);

export default Layout;
