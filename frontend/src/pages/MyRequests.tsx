import { useEffect, useState } from 'react';
import { listRequests } from '../api';
import { LoanRequest } from '../types';
import {
  List,
  Tag,
  Card,
  Empty,
  Spin,
  Space,
  Typography,
  Row,
  Col,
  Button,
  message,
  Statistic,
} from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Status configuration
const STATUS_CONFIG = {
  PENDING: { color: 'warning', icon: <ClockCircleOutlined /> },
  APPROVED: { color: 'success', icon: <CheckCircleOutlined /> },
  REJECTED: { color: 'error', icon: <CloseCircleOutlined /> },
  RETURNED: { color: 'default', icon: <CheckCircleOutlined /> },
  returned: { color: 'processing', icon: <SyncOutlined spin /> },
} as const;

const styles = {
  container: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '24px',
  },
  statsCard: {
    marginBottom: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  listCard: {
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  listItem: {
    padding: '16px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  equipmentName: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#262626',
    marginBottom: '4px',
  },
  dateContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#8c8c8c',
    fontSize: '14px',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    alignItems: 'flex-end',
  },
  quantityBadge: {
    background: '#f0f0f0',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 500,
  },
};

export default function MyRequests() {
  const [items, setItems] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await listRequests();
      setItems(res);
    } catch (error) {
      message.error('Failed to load requests');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Calculate statistics
  const stats = {
    total: items.length,
    pending: items.filter((r) => r.status === 'PENDING').length,
    approved: items.filter((r) => r.status === 'APPROVED').length,
    returned: items.filter((r) => r.status === 'RETURNED').length,
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const end = new Date(endDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${start} → ${end}`;
  };

  const getStatusTag = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
      color: 'default',
      icon: null,
    };
    return (
      <Tag color={config.color} icon={config.icon}>
        {status}
      </Tag>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <Space
          style={{
            width: '100%',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            📋 My Requests
          </Title>
          <Button
            icon={<ReloadOutlined />}
            onClick={load}
            loading={loading}
            type="default"
          >
            Refresh
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      {items.length > 0 && (
        <Card style={styles.statsCard} bordered={false}>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Statistic
                title="Total Requests"
                value={stats.total}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Pending"
                value={stats.pending}
                valueStyle={{ color: '#faad14' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Approved"
                value={stats.approved}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="Returned"
                value={stats.returned}
                valueStyle={{ color: '#722ed1' }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* Requests List */}
      <Card style={styles.listCard} bordered={false}>
        <Spin spinning={loading}>
          {items.length === 0 && !loading ? (
            <Empty
              description={
                <Space direction="vertical" size="small">
                  <Text type="secondary">No loan requests found</Text>
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    Start by requesting equipment from the Equipment page
                  </Text>
                </Space>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={items}
              renderItem={(r) => (
                <List.Item
                  style={styles.listItem}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fafafa';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                        }}
                      >
                        📦
                      </div>
                    }
                    title={
                      <div style={styles.equipmentName}>
                        {r.equipment?.name || `Equipment #${r.equipmentId}`}
                      </div>
                    }
                    description={
                      <Space direction="vertical" size={4}>
                        <div style={styles.dateContainer}>
                          <CalendarOutlined />
                          <Text type="secondary">
                            {formatDateRange(r.startDate, r.endDate)}
                          </Text>
                        </div>
                      </Space>
                    }
                  />
                  <div style={styles.detailsContainer}>
                    <div style={styles.quantityBadge}>
                      Qty: <strong>{r.quantity}</strong>
                    </div>
                    {getStatusTag(r.status)}
                  </div>
                </List.Item>
              )}
            />
          )}
        </Spin>
      </Card>
    </div>
  );
}