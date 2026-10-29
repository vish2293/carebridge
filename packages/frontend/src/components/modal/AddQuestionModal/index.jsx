/* eslint-disable no-unused-vars */
import { Button, Checkbox, Form, Input, Modal, Radio, Select } from "antd";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { linkIcon, newCloseIcon, pluseIcon } from "../../../assets/icons";
import { objectiveOptions, questionTypeOptions } from "../../../constant/array";
import { toggleBodyClass } from "../../../helpers/noScroll";
// import './style.scss'

const AddAndEditQuestionModal = ({
  isOpen,
  onClose,
  iscategory,
  btnLoading,
  initialValues,
  handleAnswerType,
  handleCategoryChange,
  answerType,
  isMapObjective,
  handleMapObjective,
  modalAction,
  handleDispatchAction,
}) => {
  const { profileQuestionCategory } = useSelector((state) => state.question);
  const [form] = Form.useForm();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue({
      ...initialValues,
      category: initialValues.category === "" ? null : initialValues.category,
    });
  }, [initialValues]);

  useEffect(() => {
    if (answerType === "radio" && modalAction === "addQuestion") {
      form.setFieldsValue({
        answersML: [
          { engOptions: "", spanishOptions: "" },
          { engOptions: "", spanishOptions: "" },
        ],
      });
    }
    form.setFieldsValue({ isMapped: isMapObjective });
    form.setFieldsValue({ answer_type: answerType });
  }, [answerType]);

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const noLeadingTrailingSpaces = (_, value) => {
    if (value && value.trim() !== value) {
      return Promise.reject(new Error("No leading or trailing spaces allowed"));
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
      onCancel={handleCancel}
      centered={true}
      footer={null}
      title={modalAction === "addQuestion" ? "Add Question" : "Update Question"}
      width={700}
      className="questin-modal"
    >
      <Form
        form={form}
        initialValues={initialValues}
        layout="vertical"
        requiredMark={false}
        onFinish={() => handleDispatchAction(modalAction, form)}
      >
        <Form.Item label="Question Category" name={"category"}>
          <Select
            ref={inputRef}
            options={profileQuestionCategory}
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
            onChange={(value) => handleCategoryChange(value)}
            placeholder="Please select category"
          />
        </Form.Item>
        <Form.Item
          label="Question In English"
          name={"questionEnglish"}
          rules={[
            { required: true, message: "Question is required" },
            { validator: noLeadingTrailingSpaces },
          ]}
        >
          <Input.TextArea placeholder="Enter question" />
        </Form.Item>
        <Form.Item
          label="Question In Spanish"
          name={"questionSpanish"}
          rules={[{ validator: noLeadingTrailingSpaces }]}
        >
          <Input.TextArea placeholder="Enter question" />
        </Form.Item>
        <Form.Item
          label="Short Description In English"
          name={"shortEng"}
          rules={[
            {
              required: true,
              message: "Short description in english is required",
            },
            { validator: noLeadingTrailingSpaces },
          ]}
        >
          <Input.TextArea placeholder="Enter question" />
        </Form.Item>
        <Form.Item
          label="Short Description In Spanish"
          name={"shortSpan"}
          rules={[{ validator: noLeadingTrailingSpaces }]}
        >
          <Input.TextArea placeholder="Enter question" />
        </Form.Item>
        {answerType === "radio" && (
          <Form.Item
            label="Select Question Type"
            name={"isMapped"}
            valuePropName="checked"
            className="ant-form-inline"
          >
            <Checkbox
              checked={isMapObjective}
              onChange={(e) => handleMapObjective(e.target?.checked)}
            >
              Map This Question
            </Checkbox>
          </Form.Item>
        )}
        <Form.Item
          label="Select Answer Field"
          name={"answer_type"}
          rules={[{ required: true, message: "Answer type is required" }]}
        >
          <Radio.Group
            options={
              iscategory
                ? questionTypeOptions.filter(
                    (option) => option.value === "radio"
                  )
                : questionTypeOptions
            }
            onChange={handleAnswerType}
          />
        </Form.Item>
        {answerType === "radio" && (
          <Form.List
            name="answersML"
            rules={[{ required: true, message: "Option is required" }]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name }, index) => (
                  <div key={key} className="add-question">
                    <Form.Item
                      key={`${key}-eng`}
                      name={[name, "engOptions"]}
                      className="option-input"
                      rules={[
                        { required: true, message: "Option is required" },
                      ]}
                    >
                      <Input
                        placeholder={`Option ${String.fromCharCode(
                          65 + index
                        )} in english`}
                      />
                    </Form.Item>
                    <Form.Item
                      key={`${key}-es`}
                      name={[name, "spanishOptions"]}
                      className="option-input"
                    >
                      <Input
                        placeholder={`Option ${String.fromCharCode(
                          65 + index
                        )} in spanish`}
                      />
                    </Form.Item>
                    {isMapObjective && (
                      <>
                        <span>{linkIcon}</span>
                        <Form.Item
                          key={`${key}-objective`}
                          name={[name, "objective"]}
                          className="option-input"
                        >
                          <Select
                            placeholder={`Select value`}
                            options={objectiveOptions}
                          />
                        </Form.Item>
                      </>
                    )}

                    {fields?.length > 1 && (
                      <Form.Item className="close-item">
                        <span
                          onClick={() => remove(name)}
                          className="closeicon"
                        >
                          {newCloseIcon}
                        </span>
                      </Form.Item>
                    )}
                  </div>
                ))}
                <Form.Item>
                  <Button
                    onClick={() => add()}
                    type="primary"
                    className="yellow-btn"
                  >
                    <span>{pluseIcon}</span>
                    <span>ADD</span>
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
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
            <Button onClick={handleCancel}>Cancel</Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AddAndEditQuestionModal;
