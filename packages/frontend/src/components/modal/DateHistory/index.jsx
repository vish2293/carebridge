import { Button, Form, Input, Modal } from "antd";
import React, { useEffect } from "react";
import { toggleBodyClass } from "../../../helpers/noScroll";

const DateHistory = ({
  isOpen,
  setIsOpen,
  title,
  visitInitialValues,
  setVisitInitialValues,
  visitForm,
  modalAction,
  handleDispatchAction,
}) => {
  const handleCancel = () => {
    setIsOpen(false);
    visitForm.setFieldsValue({
      followupDate: visitInitialValues?.followupDate,
    });
    setVisitInitialValues({ ...visitInitialValues, dueDateReason: "" });
    from.resetFields();
  };

  const handleSubmit = (values) => {
    setIsOpen(false);
    setVisitInitialValues({
      ...visitInitialValues,
      oldDueDate: visitInitialValues?.followupDate,
      dueDateReason: values?.reason,
    });
    from.resetFields();
  };

  useEffect(() => {
    const cleanup = toggleBodyClass(isOpen);
    return cleanup;
  }, [isOpen]);

  const [from] = Form.useForm();
  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      width={516}
      footer={null}
      title={title}
      centered={true}
    >
      <Form onFinish={handleSubmit} layout="vertical" form={from}>
        <Form.Item
          name="reason"
          label="Reason for Date Change"
          rules={[{ required: true, message: "Reason is required" }]}
        >
          <Input placeholder="Enter reson for date change" />
        </Form.Item>
        <div className="cancel-yes">
          <Form.Item>
            <Button type="primary" className="yellow-btn" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={handleCancel}>Cancel</Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default DateHistory;
