/* eslint-disable react/prop-types */
import { Form, Input, Modal, Select } from "antd";
import { userRequests } from "../../../constant/array";
import { toggleBodyClass } from "../../../helpers/noScroll";
import { useEffect } from "react";

const AddRequestModal = ({
  isOpen,
  setIsOpen,
  modalAction,
  handleDispatchAction,
}) => {
  const [form] = Form.useForm();

  //For close
  const handleOnCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    const cleanup = toggleBodyClass(isOpen);
    return cleanup;
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onCancel={handleOnCancel}
      centered={true}
      title={"New Action Step"}
      okText={"Submit"}
      onOk={() => handleDispatchAction(modalAction, form)}
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          label="Action Step Type"
          name={"request_type"}
          rules={[{ required: true, message: "Action Step type is required" }]}
        >
          <Select
            options={userRequests}
            placeholder="Please select action step type"
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
          />
        </Form.Item>
        <Form.Item
          label="Action Step Detail"
          name={"request_details"}
          rules={[{ required: true, message: "Action Step Detail required" }]}
        >
          <Input.TextArea
            onKeyDown={(e) =>
              e.key === "Enter" && handleDispatchAction(modalAction, form)
            }
            placeholder="Describe your action step"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRequestModal;
