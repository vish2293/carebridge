import { Checkbox, Collapse, Form, Input, Modal, Select, Tag } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import DataNotfound from "../../../components/common/DataNotFound";
import {
  fetchOutcomes,
  updateOutcomesResult,
} from "../../../redux/actions/pathway";
import { singleUserRequest } from "../../../redux/actions/request";
import "../style.scss";
import RequestCard from "./RequestCard";
import { EditOutlined } from "@ant-design/icons";
const { Option } = Select;
const { Panel } = Collapse;

const ActiveRequests = ({ requestLists, modalAction, handleClickModal }) => {
  const [selectedTypes, setSelectedTypes] = useState(["All"]);
  const [activeKey, setActiveKey] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [status, setStatus] = useState("");
  const [outcomesData, setOutcomesData] = useState([]);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleTypeChange = (values) => {
    if (values.includes("All")) {
      if (selectedTypes.includes("All")) {
        setSelectedTypes(values.filter((value) => value !== "All"));
        setActiveKey([]);
      } else {
        setSelectedTypes(["All"]);
        setActiveKey([]);
      }
    } else {
      setSelectedTypes(values.filter((value) => value !== "All"));
      setActiveKey([values[0]]);
    }
  };

  const openEditModal = async (request) => {
    setSelectedRequest(request);
    setStatus(request.status);
    setIsModalVisible(true);

    const response = await dispatch(
      fetchOutcomes({ pathwayId: request?.pathwayId._id })
    );
    const outcomes = response.payload.description;

    setOutcomesData(outcomes);

    form.setFieldsValue({
      name: request.pathwayId.name,
      status: request.status,
      outcomes:
        request.status === "Completed"
          ? Array.isArray(request.outcomes)
            ? request.outcomes.length > 0
              ? request.outcomes
              : outcomes.length === 1
              ? [outcomes[0]]
              : []
            : []
          : [],
    });
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          _id: selectedRequest._id,
          status: values.status,
          outcomes: values.outcomes,
        };

        dispatch(updateOutcomesResult(payload))
          .then(() => {
            const id = selectedRequest.userId;
            dispatch(singleUserRequest({ id }));

            setSelectedRequest(null);
            setActiveKey([]);
            setIsModalVisible(false);
            setStatus("");
            form.resetFields();

            setIsModalVisible(false);
          })
          .catch((error) => {
            console.error("Update failed:", error);
          });
      })
      .catch((info) => {
        console.error("Validate Failed:", info);
      });
  };

  const handleModalCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const filteredRequests = selectedTypes.includes("All")
    ? requestLists
    : requestLists?.filter((list) =>
        selectedTypes.includes(list.pathwayId.name)
      );

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    if (newStatus === "Completed") {
      try {
        const response = await dispatch(
          fetchOutcomes({ pathwayId: selectedRequest?.pathwayId._id })
        );
        setOutcomesData(response.payload.description);
      } catch (error) {
        console.error("API Error: ", error);
      }
    }
  };

  return (
    <div>
      <Select
        mode="multiple"
        style={{ width: "100%", marginBottom: "16px" }}
        placeholder="Select request types"
        onChange={handleTypeChange}
        allowClear
        value={selectedTypes}
      >
        <Option key="All" value="All">
          All
        </Option>
        {/* {requestLists.map((list) => {
          return (
            <Option key={list?.pathwayId?.name} value={list?.pathwayId?.name}>
              {list?.pathwayId?.name}
            </Option>
          );
        })} */}
        {requestLists
          ?.filter(
            (list) =>
              list?.pathwayId && // Ensure `pathwayId` exists
              list?.pathwayId?.name // Ensure `name` exists in `pathwayId`
          )
          .map((list) => {
            return (
              <Option key={list?.pathwayId?.name} value={list?.pathwayId?.name}>
                {list?.pathwayId?.name}
              </Option>
            );
          })}
      </Select>
      <div id="request-content">
        {filteredRequests.length > 0 &&
        filteredRequests[0] &&
        Object.keys(filteredRequests[0]).length > 0 ? (
          <Collapse
            accordion
            activeKey={activeKey}
            onChange={(key) => setActiveKey(key)}
            expandIconPosition="end"
          >
            {filteredRequests.map((list) => {
              return (
                <Panel
                  header={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <span>{list?.pathwayId?.name} </span>{" "}
                      <span>
                        <Tag
                          color={
                            list.status === "Open"
                              ? "red"
                              : list.status === "In-progress"
                              ? "purple"
                              : "green"
                          }
                        >
                          {list?.status}
                        </Tag>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(list);
                          }}
                          style={{ marginLeft: "10px" }}
                        >
                          <EditOutlined />
                        </span>{" "}
                      </span>
                    </div>
                  }
                  key={list?.pathwayId?.name}
                >
                  {list?.requestId?.length > 0 ? (
                    list?.requestId.map((item, i) => (
                      <RequestCard
                        key={i}
                        item={item}
                        index={i}
                        modalAction={modalAction}
                        handleClickModal={handleClickModal}
                      />
                    ))
                  ) : (
                    <DataNotfound />
                  )}
                </Panel>
              );
            })}
          </Collapse>
        ) : (
          <DataNotfound />
        )}
      </div>

      <Modal
        title="Edit Request"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Save"
        cancelText="Cancel"
        className="client-modal"
      >
        <Form
          form={form}
          name="editRequest"
          onFinish={handleModalOk}
          layout="vertical"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input the request name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select the status!" }]}
          >
            <Select placeholder="Select status" onChange={handleStatusChange}>
              <Option value="Open">Open</Option>
              <Option value="In-progress">In-progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>

          {status === "Completed" && (
            <Form.Item
              label="Outcomes"
              name="outcomes"
              rules={[
                {
                  required: true,
                  message: "Please select at least one outcome!",
                },
              ]}
              valuePropName="value"
            >
              <Checkbox.Group>
                {outcomesData.map((outcome, index) => (
                  <Checkbox key={index} value={outcome}>
                    {outcome}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default ActiveRequests;
