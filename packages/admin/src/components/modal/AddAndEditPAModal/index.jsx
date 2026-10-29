/* eslint-disable react/prop-types */
import { Button, Form, Input, Modal, Select } from "antd";
import { useEffect, useRef } from "react";
import { programOptions } from "../../../constant/array";
import {
  emailValidation,
  lastNameValidation,
  phoneValidation,
} from "../../../helpers/formValidation";
import { toggleBodyClass } from "../../../helpers/noScroll";

const AddAndEditPAModal = ({
  isOpen,
  modalClose,
  btnLoading,
  initialValues,
  handleSubmit,
  modalAction,
}) => {
  const [form] = Form.useForm();
  const inputRef = useRef(null);

  const closeModal = () => {
    form.resetFields();
    modalClose();
  };

  const getTitle = (modalAction) => {
    switch (modalAction) {
      case "addPA":
        return "Add Program Administrator";
      case "editPA":
        return "Edit Program Administrator";
      // case "addChw":
      //   return "Add CHW";
      // case "editChw":
      //   return "Edit CHW";
      default:
        return;
    }
  };

  const noLeadingTrailingSpaces = (_, value) => {
    if (value && value.trim() !== value) {
      return Promise.reject(new Error("No leading or trailing spaces allowed"));
    }
    return Promise.resolve();
  };

  const validatePhoneOrEmail = (_, value) => {
    const phone = form.getFieldValue("Phone");
    const email = form.getFieldValue("email");

    if (!phone && !email) {
      return Promise.reject(
        new Error("Either phone number or email is required")
      );
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      return Promise.reject(new Error("Invalid phone number format"));
    }

    if (
      email &&
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
    ) {
      return Promise.reject(new Error("Invalid email address format"));
    }

    return Promise.resolve();
  };

  useEffect(() => {
    const cleanup = toggleBodyClass(isOpen);
    return cleanup;
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onCancel={closeModal}
      okText={"Submit"}
      centered={true}
      footer={null}
      title={getTitle(modalAction)}
      className="client-modal"
    >
      <Form
        form={form}
        initialValues={initialValues}
        layout="vertical"
        onFinish={() => {
          handleSubmit(modalAction, form);
        }}
      >
        <Form.Item
          label="First Name"
          name={"firstName"}
          rules={[
            { required: true, message: "First name is required" },
            { validator: noLeadingTrailingSpaces },
          ]}
        >
          <Input placeholder="Enter first name" ref={inputRef} />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name={"lastName"}
          rules={[
            { required: true, validator: lastNameValidation },
            { validator: noLeadingTrailingSpaces },
          ]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, validator: emailValidation }]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="Phone"
          rules={[{ required: true, validator: phoneValidation }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>
        <Form.Item
          label="Program"
          name="pa_program"
          rules={[{ required: true, message: "Program is required" }]}
        >
          <Select
            mode="multiple"
            value={null}
            options={programOptions}
            filterOption={false}
            placeholder="Select Program Name"
          />
        </Form.Item>
        <Form.Item
          label="Address"
          name={"address"}
          rules={[
            { required: true, message: "Address is required" },
            { validator: noLeadingTrailingSpaces },
          ]}
        >
          <Input.TextArea placeholder="Enter address" />
        </Form.Item>
        <Form.Item
          label="Zipcode"
          name={"zipCode"}
          rules={[
            { required: true, message: "ZipCode is required" },
            { validator: noLeadingTrailingSpaces },
          ]}
        >
          <Input placeholder="Enter zip code" />
        </Form.Item>
        <div className="cancel-yes">
          <Form.Item>
            <Button
              type="primary"
              className="yellow-btn"
              htmlType="submit"
              loading={btnLoading}
              disabled={btnLoading}
            >
              Submit
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={closeModal}>Cancel</Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AddAndEditPAModal;
