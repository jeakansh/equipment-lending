import  { useEffect, useState } from 'react';
import { Input, Row, Col, Card, Button } from 'antd';
import { listEquipment } from '../api';
import { Equipment } from '../types';
import RequestModal from '../components/RequestModal';

export default function EquipmentList() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Equipment | null>(null);

  async function load() {
    const res = await listEquipment(query || undefined);
    setItems(res);
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Input.Search placeholder="Search equipment" enterButton onSearch={(v)=>{ setQuery(v); load(); }} />
      </div>

      <Row gutter={[16, 16]}>
        {items.map(it => (
          <Col xs={24} sm={12} lg={8} key={it.id}>
            <Card title={it.name} extra={<span>Qty: {it.totalQty}</span>}>
              <div>Category: {it.category}</div>
              <div>Condition: {it.condition}</div>
              <div style={{ marginTop: 12 }}>
                <Button type="primary" onClick={() => setSelected(it)}>Request</Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <RequestModal item={selected} onClose={() => setSelected(null)} onSuccess={() => { setSelected(null); load(); }} />
    </div>
  );
}
