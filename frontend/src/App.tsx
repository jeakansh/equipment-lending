import  { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from 'antd';
import Login from './pages/Login';
import EquipmentList from './pages/EquipmentList';
import MyRequests from './pages/MyRequests';
import AdminDashboard from './pages/AdminDashboard';
import AdminEquipmentManagement from './pages/AdminEquipmentManagement';
import HeaderBar from './components/Header';
import {  setToken } from './api';
import { User } from './types';

const { Content } = Layout;

function App() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // load user from token if present (we store user only on login response in localStorage optionally)
  useEffect(() => {
    const raw = localStorage.getItem('currentUser');
    if (raw) setUser(JSON.parse(raw));
  }, []);

  function handleLogin(userObj: User, token: string) {
    setToken(token);
    setUser(userObj);
    localStorage.setItem('currentUser', JSON.stringify(userObj));
    navigate('/');
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setUser(null);
    navigate('/login');
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderBar user={user} onLogout={handleLogout} />
      <Content style={{ padding: 20 }}>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/" element={<EquipmentList />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/equipment" element={<AdminEquipmentManagement />} />
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;
