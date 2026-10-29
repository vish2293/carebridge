import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterClientStatus, programOptions } from "../../../constant/array";
import { disabledBirthDate } from "../../../helpers";
import {
  emailValidation,
  lastNameValidation,
  phoneValidation,
} from "../../../helpers/formValidation";
import { toggleBodyClass } from "../../../helpers/noScroll";
import { listAndSerachPA } from "../../../redux/actions/programAdmin";

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
  // Redux state selectors
  const { loggedInUser, chwOptions } = useSelector((state) => state.user);
  const { listAndSearchPAData } = useSelector((state) => state.programAdmin);
  const selectRef = useRef(null);

  // Component state
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const [activeStatus, setActiveStatus] = useState("default");
  const [currentStatus, setCurrentStatus] = useState(initialValues.status);
  const bottomRef = useRef(null);
  const dispatch = useDispatch();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Reset state and close modal
  const closeModal = () => {
    setActiveStatus("default");
    form.resetFields();
    modalClose();
  };

  // Get modal title based on action
  const getTitle = (modalAction) => {
    switch (modalAction) {
      case "addClient":
        return "Add Client";
      case "editClient":
        return "Edit Client";
      case "addChw":
        return "Add Community Health Worker";
      case "editChw":
        return "Edit Community Health Worker";
      default:
        return "";
    }
  };

  // Filter option for Select component
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  // Map CHW options for Select
  const chwOpt = chwOptions.map((option) => ({
    value: option.value,
    label: `${option.label} (${option.requestCount})`,
  }));

  // Handle change for status and related fields
  const handleOnChange = (field, value) => {
    if (field === "statusReason") {
      setActiveStatus(field);
    }
    setCurrentStatus(value);
  };

  // Scroll into view when status changes
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

  // Validation functions
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

  // Fetch data when component mounts
  useEffect(() => {
    dispatch(listAndSerachPA());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      if (selectRef.current) {
        selectRef.current.blur();
      }
    };

    const modalContent = document.querySelector(".ant-modal-content");
    if (modalContent) {
      modalContent.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (modalContent) {
        modalContent.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isOpen]);

  // useEffect(() => {
  //   if (modalAction === "editChw" && initialValues.pa_id) {
  //     const selectedProgramAdmin = listAndSearchPAData.find(pa => pa?.value === initialValues?.pa_id?._id);
  //     if (selectedProgramAdmin) {
  //       form.setFieldsValue({ pa_id: selectedProgramAdmin.label });
  //     }
  //   }
  // }, [initialValues, listAndSearchPAData, form, modalAction]);

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
        initialValues={{ ...initialValues, pa_id: initialValues?.pa_id?._id }}
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
                required: modalAction !== "editClient",
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
        {(modalAction === "addClient" || modalAction === "editClient") && (
          <Form.Item
            label="Program"
            name="program"
            rules={[{ required: true, message: "Program is required" }]}
          >
            <Select
              value={null}
              options={programOptions}
              filterOption={false}
              placeholder="Select Program Name"
            />
          </Form.Item>
        )}
        {(modalAction === "addChw" || modalAction === "editChw") && (
          <Form.Item
            label="Assign Program Admin"
            name="pa_id"
            rules={[{ required: true, message: "Program Admin is required" }]}
          >
            <Select
              options={listAndSearchPAData}
              placeholder="Select Program Admin"
              onChange={(value) => form.setFieldsValue({ pa_id: value })}
              allowClear
              getPopupContainer={(trigger) => trigger.parentNode}
            />
          </Form.Item>
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
            <Form.Item
              label="Address"
              name={"address"}
              rules={[{ required: true, message: "Address is required" }]}
            >
              <Input.TextArea placeholder="Enter address" />
            </Form.Item>
            <Form.Item
              label="Zipcode"
              name={"zipCode"}
              rules={[{ required: true, message: "Zipcode is required" }]}
            >
              <Input placeholder="Enter zip code" />
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
          (loggedInUser?.role === "Super_Admin" ||
            loggedInUser?.role === "Program_Administrator") && (
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
    </Modal>
  );
};

export default AddChwAndClientModal;
