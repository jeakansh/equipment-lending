import { Card, Form, Input, Button } from 'antd';
import { login } from '../api';
import { User } from '../types';

export default function Login({ onLogin }: { onLogin: (user: User, token: string) => void }) {
  const [form] = Form.useForm();

  async function onFinish(values: any) {
    try {
      const res = await login(values.email);
      onLogin(res.user, res.token);
    } catch (err: any) {
      alert(err.error || 'Login failed');
    }
  }

  return (
    <div style={{ display:'flex', justifyContent:'center', marginTop: 80 }}>
      <Card title="Login" style={{ width: 360 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" block htmlType="submit">Login</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
