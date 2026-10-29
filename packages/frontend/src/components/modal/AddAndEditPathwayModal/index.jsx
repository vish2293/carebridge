/* eslint-disable react/prop-types */
import { Button, Form, Input, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNeedOrCategory } from "../../../redux/actions/visit";
import { toggleBodyClass } from "../../../helpers/noScroll";

const AddAndEditPathwayModal = ({
  isOpen,
  modalClose,
  btnLoading,
  pathwayInitialValues,
  form,
  handleSubmit,
  modalAction,
}) => {
  const { needOrCategoryOptions } = useSelector((state) => state.visit);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { TextArea } = Input;

  const closeModal = () => {
    form.resetFields();
    modalClose();
  };

  const getTitle = (modalAction) => {
    switch (modalAction) {
      case "addPA":
        return "Add Pathway";
      case "editPA":
        return "Edit Pathway";
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

  useEffect(() => {
    dispatch(getAllNeedOrCategory());
  }, [dispatch]);

  let initialValues = {
    ...pathwayInitialValues,
    need: pathwayInitialValues?.need?._id || [],
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
        layout="vertical"
        initialValues={initialValues}
        onFinish={() => {
          handleSubmit(modalAction, form);
          setTimeout(() => {
            form.resetFields();
          }, 800);
        }}
      >
        <Form.Item
          label="Name"
          name={"name"}
          rules={[
            { required: true, message: "Name is required" },
            { validator: noLeadingTrailingSpaces },
          ]}
        >
          <Input placeholder="Enter pathway name" ref={inputRef} />
        </Form.Item>
        <Form.Item label="id" name={"id"} hidden>
          <Input placeholder="Enter pathway name" ref={inputRef} />
        </Form.Item>
        <Form.Item
          label="Need"
          name={"need"}
          rules={[
            { required: true, message: "Need is required" },
            { validator: noLeadingTrailingSpaces },
          ]}
        >
          <Select options={needOrCategoryOptions} placeholder="Select Need" />
        </Form.Item>
        <Form.Item
          label="Outcomes"
          name={"description"}
          rules={[{ required: true, message: "Outcomes is required" }]}
        >
          <TextArea
            placeholder="Enter outcomes"
            autoSize={{ minRows: 3, maxRows: 50 }}
            // rows="15"
          />
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

export default AddAndEditPathwayModal;
