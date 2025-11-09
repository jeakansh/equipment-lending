import { Modal, Form, InputNumber, DatePicker, Button } from "antd";
import moment from "moment";
import { createRequest } from "../api";
import { Equipment } from "../types";

const { RangePicker } = DatePicker;

export default function RequestModal({
  item,
  onClose,
  onSuccess,
}: {
  item: Equipment | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form] = Form.useForm();

  if (!item) return null;

  async function submit() {
    try {
      const vals = await form.validateFields();
      const [start, end] = vals.range;
      if (item) {
        await createRequest({
          equipmentId: item.id,
          quantity: vals.quantity,
          startDate: (start as moment.Moment).format("YYYY-MM-DD"),
          endDate: (end as moment.Moment).format("YYYY-MM-DD"),
        });
        onSuccess();
      }
    } catch (err: any) {
      alert(err.error || "Could not submit");
    }
  }

  return (
    <Modal
      open={!!item}
      title={`Request: ${item?.name}`}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={submit}>
          Submit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={{ quantity: 1 }}>
        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[{ required: true, type: "number", min: 1 }]}
        >
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item name="range" label="Date range" rules={[{ required: true }]}>
          <RangePicker />
        </Form.Item>
      </Form>
    </Modal>
  );
}
