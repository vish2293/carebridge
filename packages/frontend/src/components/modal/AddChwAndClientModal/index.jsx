/* eslint-disable react/prop-types */
import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { filterClientStatus, programOptions } from "../../../constant/array";
import { disabledBirthDate } from "../../../helpers";
import {
  emailValidation,
  firstNameValidation,
  lastNameValidation,
  phoneValidation,
} from "../../../helpers/formValidation";
import { toggleBodyClass } from "../../../helpers/noScroll";

const AddChwAndClientModal = ({
  isOpen,
  setIsOpen,
  modalClose,
  btnLoading,
  initialValues,
  handleSubmit,
  modalAction,
  isDisabled,
}) => {
  const { loggedInUser, chwOptions } = useSelector((state) => state.user);
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const [activeStatus, setActiveStatus] = useState("default");
  const [currentStatus, setCurrentStatus] = useState(initialValues.status);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  const closeModal = () => {
    setActiveStatus("default");
    form.resetFields();
    modalClose();
  };

  const getTitle = (modalAction) => {
    switch (modalAction) {
      case "addClient":
        return "ADD Client";
      case "editClient":
        return "Edit Client";
      case "addChw":
        return "ADD Community Health Worker";
      case "editChw":
        return "Edit Community Health Worker";
      default:
        return;
    }
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const chwOpt = chwOptions.map((option) => {
    return {
      value: option.value,
      label: `${option.label} (${option.requestCount})`,
    };
  });

  const handleOnChange = (field, value) => {
    if (field === "statusReason") {
      setActiveStatus(field);
    }
    setCurrentStatus(value);
  };

  useEffect(() => {
    if (
      activeStatus === "statusReason" &&
      currentStatus !== initialValues.status &&
      bottomRef.current
    ) {
      setTimeout(() => {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [activeStatus, currentStatus, initialValues.status]);

  const noLeadingTrailingSpaces = (_, value) => {
    if (value && value.trim() !== value) {
      return Promise.reject(new Error("No leading or trailing spaces allowed"));
    }
    return Promise.resolve();
  };

  const validatePhoneOrEmail = (rule, value) => {
    const phone = form.getFieldValue("Phone");
    const email = form.getFieldValue("email");

    return new Promise((resolve, reject) => {
      if (!phone && !email) {
        reject("Either phone or email is required");
      } else if (rule?.field === "Phone" && phone) {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
          reject("Invalid phone number format");
        } else {
          form.validateFields(["email"]);
          resolve();
        }
      } else if (rule?.field === "email" && email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          reject("Invalid email address format");
        } else {
          form.validateFields(["Phone"]);
          resolve();
        }
      } else {
        resolve();
      }
    });
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
          setActiveStatus("default");
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
        {(modalAction === "addClient" || modalAction === "editClient") && (
          <Form.Item
            label="Birth Date"
            name={"birthDate"}
            rules={[
              {
                required: modalAction !== "editClient" ? true : false,
                message: "Birth date is required",
              },
            ]}
          >
            <DatePicker
              disabledDate={disabledBirthDate}
              format={"MM/DD/YYYY"}
            />
          </Form.Item>
        )}
        {modalAction === "addClient" && (
          <Form.Item
            label="Program"
            name="program"
            rules={[{ required: true, message: "Program name is required" }]}
          >
            <Select
              value={null}
              options={programOptions}
              filterOption={false}
              placeholder="Select Program Name"
            />
          </Form.Item>
        )}
        {modalAction === "editClient" && (
          <Form.Item
            label="Program"
            name="program"
            rules={[{ required: true, message: "Program name is required" }]}
          >
            <Select
              value={null}
              options={programOptions}
              disabled
              filterOption={false}
              placeholder="Select Program Name"
            />
          </Form.Item>
        )}

        {modalAction === "addClient" || modalAction === "editClient" ? (
          <>
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
          </>
        ) : (
          <>
            <Form.Item label="Address" name={"address"}>
              <Input.TextArea placeholder="Enter address" />
            </Form.Item>
            <Form.Item label="Zipcode" name={"zipCode"}>
              <Input placeholder="Enter zip code" />
            </Form.Item>
          </>
        )}
        {modalAction === "addClient" || modalAction === "editClient" ? (
          <>
            <Form.Item
              label={
                <span>
                  Phone Number{" "}
                  <span
                    style={{ color: "red", margin: "auto", marginLeft: "10px" }}
                  >
                    *
                  </span>
                </span>
              }
              name="Phone"
              rules={[
                {
                  validator: (_, value, callback) =>
                    validatePhoneOrEmail(value, "Phone", callback),
                },
              ]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Email{" "}
                  <span
                    style={{ color: "red", margin: "auto", marginLeft: "10px" }}
                  >
                    *
                  </span>
                </span>
              }
              name="email"
              rules={[
                {
                  validator: (_, value, callback) =>
                    validatePhoneOrEmail(value, "email", callback),
                },
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item
              label="Phone Number"
              name="Phone"
              rules={[{ required: true, validator: phoneValidation }]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, validator: emailValidation }]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
          </>
        )}
        {modalAction === "editClient" && (
          <>
            <Form.Item label="Status" name={"status"}>
              <Select
                options={filterClientStatus?.map((status) => ({
                  ...status,
                  disabled: status?.value === "Pending",
                }))}
                onChange={(value) => handleOnChange("statusReason", value)}
              />
            </Form.Item>
            {activeStatus === "statusReason" &&
              currentStatus !== initialValues.status && (
                <Form.Item
                  label="Reason for Status Change"
                  name={"reason"}
                  rules={[{ required: true, message: "Reason is required" }]}
                >
                  <Input.TextArea placeholder="Enter reason" />
                </Form.Item>
              )}
          </>
        )}
        {modalAction === "addClient" &&
          loggedInUser?.role === "Program_Administrator" && (
            <Form.Item label="Assign Community Health Worker" name={"assign_to"}>
              <Select
                placeholder="Select Community Health Worker"
                options={chwOpt}
                showSearch
                filterOption={filterOption}
              />
            </Form.Item>
          )}
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
      <div ref={bottomRef}></div>
    </Modal>
  );
};

export default AddChwAndClientModal;
