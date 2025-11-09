import React, { useEffect, useState } from 'react';
import { listRequests, approveRequest, rejectRequest, markReturned } from '../api';
import { LoanRequest } from '../types';
import { List, Button, Tag, Popconfirm } from 'antd';

export default function AdminDashboard() {
  const [items, setItems] = useState<LoanRequest[]>([]);

  async function load() {
    const res = await listRequests();
    setItems(res);
  }
  useEffect(()=>{ load(); }, []);

  async function onApprove(id: number) {
    try {
      await approveRequest(id);
      load();
    } catch (err: any) { alert(err.error || 'error'); }
  }

  async function onReject(id: number) {
    try {
      await rejectRequest(id);
      load();
    } catch (err: any) { alert(err.error || 'error'); }
  }

  async function onMarkReturned(id: number) {
    try {
      await markReturned(id);
      load();
    } catch (err: any) { alert(err.error || 'error'); }
  }

  return (
    <div>
      <h2>All Requests</h2>
      <List
        dataSource={items}
        renderItem={r => (
          <List.Item actions={[
            r.status === 'PENDING' && <Button type="primary" onClick={() => onApprove(r.id)}>Approve</Button>,
            r.status === 'PENDING' && <Button danger onClick={() => onReject(r.id)}>Reject</Button>,
            r.status === 'APPROVED' && <Button onClick={() => onMarkReturned(r.id)}>Mark Returned</Button>
          ].filter(Boolean) as any}
        >
          <List.Item.Meta
            title={`${r.equipment?.name} — ${r.user?.name || 'User'}`}
            description={`${new Date(r.startDate).toLocaleDateString()} → ${new Date(r.endDate).toLocaleDateString()}`}
          />
          <div>
            <div>Qty: {r.quantity}</div>
            <Tag>{r.status}</Tag>
          </div>
        </List.Item>)}
      />
    </div>
  );
}
