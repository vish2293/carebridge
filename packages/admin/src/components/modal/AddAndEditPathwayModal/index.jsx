/* eslint-disable react/prop-types */
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select } from "antd";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleBodyClass } from "../../../helpers/noScroll";
import { getAllNeedOrCategory } from "../../../redux/actions/visit";

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
    if (value && value?.trim() !== value) {
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
        <Form.Item
          label="Need"
          name={"need"}
          rules={[{ required: true, message: "Need is required" }]}
        >
          <Select options={needOrCategoryOptions} placeholder="Select Need" />
        </Form.Item>

        <Form.Item label="Outcomes" name={"description"} required>
          <Form.List
            name="description"
            rules={[
              {
                validator: async (_, description) => {
                  if (!description || description.length < 1) {
                    return Promise.reject(
                      new Error("At least one outcome is required.")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }) => {
              const handleAdd = (fields) => {
                const lastField = fields[fields.length - 1];
                if (lastField) {
                  const lastFieldName = lastField.name;
                  const value = form.getFieldValue([
                    "description",
                    lastFieldName,
                  ]);
                  if (!value) {
                    form.setFields([
                      {
                        name: ["description", lastFieldName],
                        errors: [
                          "Please fill this field before adding another.",
                        ],
                      },
                    ]);
                    return;
                  }
                }
                add();
              };

              return (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Form.Item
                      key={key}
                      required
                      style={{ marginBottom: 8, width: "100%" }} // Add spacing between items
                    >
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          gap: "15px",
                          alignItems: "center",
                        }}
                      >
                        <Form.Item
                          {...restField}
                          name={name}
                          fieldKey={fieldKey}
                          rules={[
                            { required: true, message: "Outcome is required" },
                          ]}
                          style={{ flex: 1, width: "100%" }} // Ensure the input takes up full width
                        >
                          <Input placeholder="Enter outcome" />
                        </Form.Item>
                        {fields.length > 1 && (
                          <MinusCircleOutlined
                            onClick={() => remove(name)}
                            style={{
                              color: "red",
                              marginTop: "-25px",
                            }}
                          />
                        )}
                      </div>
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => handleAdd(fields)}
                      icon={<PlusOutlined />}
                    >
                      Add Outcome
                    </Button>
                  </Form.Item>
                </>
              );
            }}
          </Form.List>
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
