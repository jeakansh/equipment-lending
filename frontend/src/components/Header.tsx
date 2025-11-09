import { Link } from 'react-router-dom';
import { Layout,  Button } from 'antd';
import { User } from '../types';

const { Header } = Layout;

export default function HeaderBar({ user, onLogout }: { user: User | null; onLogout: () => void }) {
  return (
    <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ color: 'white', fontWeight: 700 }}>
        <Link to="/" style={{ color: 'white' }}>Equipment Lending</Link>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link to="/">Equipment</Link>
        <Link to="/my-requests">My Requests</Link>
        {user?.role === 'ADMIN' || user?.role === 'STAFF' ? <Link to="/admin">Admin</Link> : null}
        {user ? (
          <>
            <span style={{ color: 'white' }}>{user.name} ({user.role})</span>
            <Button onClick={onLogout}>Logout</Button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </Header>
  );
}
