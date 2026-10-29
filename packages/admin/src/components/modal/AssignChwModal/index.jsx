/* eslint-disable react/prop-types */
import { Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";
import { getChwOptions } from "../../../helpers";
import { toggleBodyClass } from "../../../helpers/noScroll";

const AssignChwModal = ({
  isOpen,
  setIsOpen,
  initialValues,
  chwLists,
  modalAction,
  handleDispatchAction,
}) => {
  const closeModal = () => {
    setIsOpen(false);
  };
  const [form] = Form.useForm();

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    const cleanup = toggleBodyClass(isOpen);
    return cleanup;
  }, [isOpen]);

  return (
    <Modal
      centered={true}
      open={isOpen}
      onCancel={closeModal}
      title={"Community Health Worker Assigned to Client"}
      width={600}
      okText={"Submit"}
      onOk={() => handleDispatchAction(modalAction, form)}
    >
      <Form form={form} initialValues={initialValues} layout="vertical">
        <Form.Item
          label="Client Name"
          name={"clientName"}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Next steps Name"
          name={"requestDetail"}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item label="Select Start Date" rules={[{required:true}]}>
        <DatePicker/>
        </Form.Item>
       <Form.Item label="Select End Date" rules={[{required:true}]}>
        <DatePicker/>
        </Form.Item>
        <Form.Item label="Select Next Follow Up date" rules={[{required:true}]}>
        <DatePicker/>
        </Form.Item> */}
        <Form.Item
          label="Select Community Health Worker Assigned To Client"
          name={"assign_to"}
          rules={[{ required: true, message: "Assign to community health worker required" }]}
        >
          <Select
            options={getChwOptions(chwLists)}
            placeholder="Please select community health worker to assign"
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignChwModal;
