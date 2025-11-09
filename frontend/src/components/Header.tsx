import { Link } from 'react-router-dom';
import { Layout, Button } from 'antd';
import { User } from '../types';

const { Header } = Layout;

export default function HeaderBar({ user, onLogout }: { user: User | null; onLogout: () => void }) {
  return (
    <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* Left side — logo/title */}
      <div style={{ color: 'white', fontWeight: 700 }}>
        <Link to="/" style={{ color: 'white' }}>Equipment Lending</Link>
      </div>

      {/* Right side — navigation links */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {/* Always visible */}
        <Link to="/">Equipment</Link>
        <Link to="/my-requests">My Requests</Link>

        {/* Admin-only links */}
        {user?.role === 'ADMIN' && (
          <>
            <Link to="/admin">Requests</Link>
            <Link to="/admin/equipment">Manage Equipment</Link>
          </>
        )}

        {/* Staff-only link */}
        {user?.role === 'STAFF' && <Link to="/admin">Admin</Link>}

        {/* Auth controls */}
        {user ? (
          <>
            <span style={{ color: 'white' }}>
              {user.name} ({user.role})
            </span>
            <Button onClick={onLogout}>Logout</Button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </Header>
  );
}
