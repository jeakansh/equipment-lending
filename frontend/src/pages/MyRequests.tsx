import  { useEffect, useState } from 'react';
import { listRequests } from '../api';
import { LoanRequest } from '../types';
import { List, Tag } from 'antd';

export default function MyRequests() {
  const [items, setItems] = useState<LoanRequest[]>([]);

  async function load() {
    const res = await listRequests();
    setItems(res);
  }
  useEffect(()=>{ load(); }, []);

  return (
    <div>
      <h2>My Requests</h2>
      <List
        itemLayout="horizontal"
        dataSource={items}
        renderItem={r => (
          <List.Item>
            <List.Item.Meta
              title={r.equipment?.name || `Equipment #${r.equipmentId}`}
              description={`${new Date(r.startDate).toLocaleDateString()} → ${new Date(r.endDate).toLocaleDateString()}`}
            />
            <div>
              <div>Qty: {r.quantity}</div>
              <Tag>{r.status}</Tag>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}
