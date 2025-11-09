import  { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message } from 'antd';
import { listEquipment, createEquipment, updateEquipment, deleteEquipment } from '../api';
import { Equipment } from '../types';

export default function AdminEquipmentManagement() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Equipment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  async function load() {
    setLoading(true);
    try {
      const res = await listEquipment();
      setItems(res);
    } catch (err: any) {
      message.error(err.error || 'Failed to load equipment');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  }

  function openEdit(record: Equipment) {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      category: record.category,
      condition: record.condition,
      totalQty: record.totalQty
    });
    setModalVisible(true);
  }

  async function handleDelete(id: number) {
    try {
      await deleteEquipment(id);
      message.success('Deleted');
      load();
    } catch (err: any) {
      message.error(err.error || 'Delete failed');
    }
  }

  async function handleOk() {
    try {
      const vals = await form.validateFields();
      if (editing) {
        await updateEquipment(editing.id, vals);
        message.success('Updated');
      } else {
        await createEquipment(vals);
        message.success('Created');
      }
      setModalVisible(false);
      load();
    } catch (err: any) {
      message.error(err.error || 'Save failed');
    }
  }

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Condition', dataIndex: 'condition', key: 'condition' },
    { title: 'Qty', dataIndex: 'totalQty', key: 'totalQty' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Equipment) => (
        <Space>
          <Button onClick={() => openEdit(record)}>Edit</Button>
          <Popconfirm title="Delete item?" onConfirm={() => handleDelete(record.id)}>
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={openCreate}>Add equipment</Button>
        <Button onClick={load}>Refresh</Button>
      </Space>

      <Table dataSource={items} columns={columns} rowKey="id" loading={loading} />

      <Modal
        title={editing ? 'Edit equipment' : 'Add equipment'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Input />
          </Form.Item>
          <Form.Item name="condition" label="Condition">
            <Input />
          </Form.Item>
          <Form.Item name="totalQty" label="Total quantity" rules={[{ required: true, type: 'number', min: 0 }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
