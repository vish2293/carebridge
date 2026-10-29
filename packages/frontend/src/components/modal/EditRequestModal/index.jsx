/* eslint-disable react/prop-types */
import { Button, Checkbox, Form, Input, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RequestStatus } from "../../../constant/array";
import { getResourceOptions } from "../../../redux/actions/user";
import { getAllNeedOrCategory } from "../../../redux/actions/visit";
import { getPathwayNameOption } from "../../../redux/actions/pathway";

const EditRequestModal = ({
  setIsOpen,
  data,
  updateRequestLoading,
  requestLoading,
  modalAction,
  handleDispatchAction,
  handleRequestChange,
  setUpdateRequestLoading,
}) => {
  const { resourceOptions, singleUser, loggedInUser } = useSelector(
    (state) => state.user
  );
  const [debounceTime, setDebounceTime] = useState(null);
  const { needOrCategoryOptions } = useSelector((state) => state.visit);
  const { listPathwayOptions } = useSelector((state) => state.pathway);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const inputRef = useRef();
  const [activeStatusReason, setActiveStatusReason] = useState("default");
  const [currentStatus, setCurrentStatus] = useState(data.request_status);

  useEffect(() => {
    dispatch(getAllNeedOrCategory());
    dispatch(getPathwayNameOption({ search: "" }));
  }, []);

  useEffect(() => {
    inputRef.current.focus();
  }, [data]);

  const initialValues = {
    ...data,
    request_type: data?.request_type?._id,
    pathway: data?.pathway?._id,
    resources_given: data?.resources_given?.map((resource) => ({
      label: `${resource.resource_name} (${resource.organization})`,
      value: resource._id,
    })),
    assign_to: data?.assign_to?._id ? data?.assign_to?._id : data?.assign_to,
  };

  const handleResourceSearch = (value) => {
    clearTimeout(debounceTime);
    const newTime = setTimeout(() => {
      dispatch(getResourceOptions({ payload: { search: value } }));
    }, 500);
    setDebounceTime(newTime);
  };

  const handleResourceClear = () => {
    dispatch(getResourceOptions({ payload: { search: "" } }));
  };

  const handleCancel = () => {
    setIsOpen(false);
    setUpdateRequestLoading(false);
  };

  const handleChange = (filed, value) => {
    if (filed === "statusReason") {
      setActiveStatusReason(filed);
      setCurrentStatus(value);
    }
  };

  return (
    <Form
      initialValues={initialValues}
      form={form}
      layout="vertical"
      onFinish={() => handleDispatchAction(modalAction, form)}
    >
      <Form.Item
        name={"request_type"}
        label="Category"
        rules={[{ required: true, message: "Category is required" }]}
      >
        <Select
          options={needOrCategoryOptions}
          placeholder="Select category"
          ref={inputRef}
        />
      </Form.Item>
      <Form.Item
        name={"pathway"}
        label="Pathway"
        rules={[{ required: true, message: "Pathway is required" }]}
      >
        <Select
          options={listPathwayOptions}
          placeholder="Select pathway"
          ref={inputRef}
        />
      </Form.Item>
      <Form.Item
        name={"request_details"}
        label="Action Step Details"
        rules={[{ required: true, message: "Detail is required" }]}
      >
        <Input placeholder="Enter detail" />
      </Form.Item>
      <Form.Item
        name={"resources_given"}
        label="Resource Given"
        rules={[{ required: true, message: "Resource given is required" }]}
      >
        <Select
          placeholder="Enter Resource"
          mode="multiple"
          options={resourceOptions}
          onChange={handleResourceClear}
          onSearch={handleResourceSearch}
          showSearch
          filterOption={false}
        />
      </Form.Item>
      <Form.Item label="Assign to" name={"assign_to"}>
        <Select
          options={[
            {
              label: `${singleUser?.firstName} ${singleUser?.lastName}`,
              value: singleUser?._id,
            },
            {
              label:
                loggedInUser?.role === "CHW"
                  ? "You"
                  : `${singleUser?.assign_to?.firstName} ${singleUser?.assign_to?.lastName}`,
              value: singleUser?.assign_to?._id,
            },
          ]}
          placeholder="Assign to"
        />
      </Form.Item>
      <Form.Item
        name={"urgent"}
        label="Urgent"
        rules={[{ required: true, message: "Status is required" }]}
        valuePropName="checked"
      >
        <Checkbox>Urgent</Checkbox>
      </Form.Item>
      <Form.Item
        name={"request_status"}
        label="Action Step Status"
        rules={[{ required: true, message: "Status is required" }]}
      >
        <Select
          options={RequestStatus?.filter(
            (requestData) => requestData?.label !== "All"
          )}
          placeholder="Select status"
          onChange={(value) => handleChange("statusReason", value)}
        />
      </Form.Item>
      {activeStatusReason === "statusReason" &&
        currentStatus !== data.request_status && (
          <Form.Item
            name={"reason"}
            label="Reason for Status Change"
            rules={[{ required: true, message: "Reason is required" }]}
          >
            <Input.TextArea placeholder="Enter reason" />
          </Form.Item>
        )}
      <div className="accept-reject">
        <Form.Item>
          <Button
            htmlType="submit"
            loading={requestLoading}
            className="yellow-btn"
            type="primary"
          >
            Update
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={handleCancel} className="reject-btn">
            Cancel
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default EditRequestModal;
