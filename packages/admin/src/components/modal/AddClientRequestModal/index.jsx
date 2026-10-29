/* eslint-disable react/prop-types */
import { Button, Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { getChwOptions, getClientOpetions } from "../../../helpers";
import { toggleBodyClass } from "../../../helpers/noScroll";

const AddClientRequestModal = ({
  isOpen,
  setIsOpen,
  setUserId,
  setVisitType,
  visitType,
  userList,
  chwList,
  modalAction,
  handleDispatchAction,
  handleModalClickAction,
}) => {
  const [isUser, setIsUser] = useState(false);

  const [form] = Form.useForm();

  const onClose = () => {
    setIsOpen(false);
  };

  //For  client search
  const handleSelect = (values) => {
    const user = userList?.find((v) => v?._id === values);
    setUserId(values);
    setVisitType(user?.visit_type);
  };
  const handleClientSearch = (values) => {
    const nameParts = values?.split(" ");
    const user = userList?.find((v) => v?.firstName === nameParts[0]);
    if (user === undefined || user === null) {
      setIsUser(true);
    } else {
      setIsUser(false);
    }
  };

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
      onCancel={onClose}
      okText={"Submit"}
      title={"Add Client’s Action Step"}
      onOk={() => handleDispatchAction(modalAction, form)}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Search Client Name"
          name={"firstName"}
          rules={[{ required: true, message: "Client name required" }]}
        >
          <Select
            dropdownRender={(menu) => (
              <div className="add-new-client">
                {isUser && (
                  <Button
                    onClick={() => handleModalClickAction("addClient", true)}
                    type="primary"
                  >
                    Add New Client
                  </Button>
                )}
                {menu}
              </div>
            )}
            showSearch
            onSearch={handleClientSearch}
            onSelect={handleSelect}
            options={getClientOpetions(userList)?.user}
          />
        </Form.Item>
        <Form.Item
          label="Next steps Name"
          name={"request_details"}
          rules={[{ required: true, message: "Next steps Name required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Visit Type"
          rules={[{ required: true, message: "Visit type required" }]}
        >
          {visitType}
        </Form.Item>

        <Form.Item
          label="Select Community Health Worker Assigned to client"
          name={"assign_to"}
          rules={[{ required: true, message: "Assign community health worker required" }]}
        >
          <Select
            options={getChwOptions(chwList)}
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddClientRequestModal;
