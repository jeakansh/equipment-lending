import { Link } from 'react-router-dom';
import { Layout, Button, Dropdown, Avatar, Space, Badge, MenuProps } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, BellOutlined, DownOutlined } from '@ant-design/icons';
import { User } from '../types';

const { Header } = Layout;

interface HeaderBarProps {
  user: User | null;
  onLogout: () => void;
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '0 24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  logo: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    borderRadius: '8px',
    padding: '6px 16px',
    fontWeight: 700,
    fontSize: '18px',
    transition: 'all 0.3s ease',
  },
  logoLink: {
    color: 'white',
    textDecoration: 'none',
  },
  navLink: {
    color: 'rgba(255, 255, 255, 0.85)',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    fontWeight: 500,
  },
  userContainer: {
    cursor: 'pointer',
    padding: '4px 12px',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
  },
  userName: {
    color: 'white',
    fontWeight: 600,
    fontSize: '14px',
  },
  userRole: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '11px',
    textTransform: 'uppercase' as const,
  },
  loginButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    fontWeight: 600,
    borderRadius: '6px',
  },
};

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    style={styles.navLink}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = '#fff';
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
      e.currentTarget.style.background = 'transparent';
    }}
  >
    {children}
  </Link>
);

export default function HeaderBar({ user, onLogout }: HeaderBarProps) {
  // User dropdown menu items
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile Settings',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Preferences',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: onLogout,
    },
  ];

  // Admin dropdown menu items
  const getAdminMenuItems = (): MenuProps['items'] => {
    if (user?.role === 'ADMIN') {
      return [
        {
          key: 'requests',
          label: <Link to="/admin">Requests</Link>,
        },
        {
          key: 'equipment',
          label: <Link to="/admin/equipment">Manage Equipment</Link>,
        },
      ];
    }
    if (user?.role === 'STAFF') {
      return [
        {
          key: 'admin',
          label: <Link to="/admin">Admin Panel</Link>,
        },
      ];
    }
    return [];
  };

  const adminMenuItems =  getAdminMenuItems();
  const showAdminDropdown = user && (user.role === 'ADMIN' || user.role === 'STAFF');

  return (
    <Header style={styles.header}>
      {/* Logo */}
      <div
        style={styles.logo}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        <Link to="/" style={styles.logoLink}>
          📦 Equipment Lending
        </Link>
      </div>

      {/* Navigation */}
      <Space size={4}>
        <NavLink to="/">Equipment</NavLink>
        <NavLink to="/my-requests">My Requests</NavLink>

        {/* Admin Dropdown */}
        
          <Dropdown menu={{ items: adminMenuItems }} placement="bottomRight">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={styles.navLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Admin <DownOutlined style={{ fontSize: '12px', marginLeft: '4px' }} />
            </a>
          </Dropdown>
        

        {/* Auth Section */}
        {user ? (
          <>
            {/* Notifications */}
            <Badge count={0} size="small" offset={[-4, 4]}>
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  border: 'none',
                }}
              />
            </Badge>

            {/* User Profile Dropdown */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <Space
                style={styles.userContainer}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                <Avatar
                  size={32}
                  style={{
                    background: '#f56a00',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                  }}
                  icon={<UserOutlined />}
                />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <span style={styles.userName}>{user.name}</span>
                  <span style={styles.userRole}>{user.role}</span>
                </div>
              </Space>
            </Dropdown>
          </>
        ) : (
          <Button type="primary" style={styles.loginButton}>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Login
            </Link>
          </Button>
        )}
      </Space>
    </Header>
  );
}