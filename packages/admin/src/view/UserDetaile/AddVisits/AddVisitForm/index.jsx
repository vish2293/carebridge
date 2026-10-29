import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Spin,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DateHistory from "../../../../components/modal/DateHistory";
import {
  ClientVisitType,
  RequestStatus,
  TimeOptions,
} from "../../../../constant/array";
import { disabledDate } from "../../../../helpers";
import {
  futureVisitTimeValidation,
  lengthOfVisitValidation,
  timeValidation,
} from "../../../../helpers/formValidation";
import {
  getNeedName,
  listAllPathway,
  listPathwayBaseOfNeed,
} from "../../../../redux/actions/pathway";
import { getResourceOptions } from "../../../../redux/actions/user";
import { getAllNeedOrCategory } from "../../../../redux/actions/visit";
import { previousRequestData } from "../../../../redux/actions/request";
import { useParams } from "react-router-dom";

const AddVisitForm = ({
  modalClose,
  timeOptionValue,
  handleRequestStatusChange,
  setVisitInitialValues,
  setAddEditvisitLoading,
  handleClickModal,
  setTimeOptionValue,
  handleDispatchAction,
  modalAction,
  createVisitLoading,
  visitInitialValues,
}) => {
  const { loggedInUser, singleUser, resourceOptions } = useSelector(
    (state) => state.user
  );
  const { pathwayList } = useSelector((state) => state.pathway);
  const { needOrCategoryOptions } = useSelector((state) => state.visit);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [debounceTime, setDebounceTime] = useState(null);
  const inputRef = useRef(null);
  const [openDateHistory, setOpenDateHistory] = useState(false);
  const [activeDueReason, setActiveDueReason] = useState("default");
  const [activeStatusReason, setActiveStatusReason] = useState("default");
  const [activeStatusIndex, setActiveStatusIndex] = useState({});
  const [currentDueDate, setCurrentDueDate] = useState(
    visitInitialValues.followupDate
  );
  const [chnageDate, setChangeDate] = useState(
    new Date(currentDueDate).getTime() !==
      new Date(visitInitialValues.followupDate).getTime()
  );
  const [currentStatus, setCurrentStatus] = useState({});
  const [pathwayOptions, setPathwayOptions] = useState([]);
  const [requestPathwayOptions, setRequestPathwayOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pathwaySelection, setPathwaySelection] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    setTimeOptionValue(
      visitInitialValues?.lengthOfvisitUnit
        ? visitInitialValues?.lengthOfvisitUnit
        : "Minutes"
    );
  }, [visitInitialValues]);

  useEffect(() => {
    dispatch(getAllNeedOrCategory());
    setTimeout(() => {
      inputRef.current.focus();
    }, 100);
  }, []);

  const disableTime = (value) => {
    const futureDate = new Date(value);
    const current = new Date();
    if (current < futureDate) {
      return null;
    } else {
      const currentHour = current.getHours();
      const currentMinute = current.getMinutes();
      const currentSecond = current.getSeconds();
      return {
        disabledHours: () =>
          Array.from({ length: 24 }, (_, i) => i).filter(
            (hour) => hour < currentHour
          ),
        disabledMinutes: (hour) =>
          hour === currentHour
            ? Array.from({ length: 60 }, (_, i) => i).filter(
                (minute) => minute < currentMinute
              )
            : [],
        disabledSeconds: (hour, minute) =>
          hour === currentHour && minute === currentMinute
            ? Array.from({ length: 60 }, (_, i) => i).filter(
                (second) => second < currentSecond
              )
            : [],
      };
    }
  };

  const disableVisitTime = (value) => {
    const selectedDate = new Date(value);
    const currentDate = new Date();

    if (selectedDate.toDateString() !== currentDate.toDateString()) {
      // If selected date is not today, no time restrictions
      return null;
    } else {
      // If selected date is today, disable hours and minutes based on current time
      const currentHour = currentDate.getHours();
      const currentMinute = currentDate.getMinutes();

      return {
        disabledHours: () =>
          Array.from({ length: 24 }, (_, i) => i).filter(
            (hour) => hour > currentHour
          ),
        disabledMinutes: (hour) => {
          if (hour === currentHour) {
            return Array.from({ length: 60 }, (_, i) => i).filter(
              (minute) => minute > currentMinute
            );
          }
          return [];
        },
      };
    }
  };

  let initialValues = {
    ...visitInitialValues,
    primaryNeed: visitInitialValues?.primaryNeed?.map((need) => need._id) || [],
    pathway: visitInitialValues?.pathway?.map((pathway) => pathway._id) || [],
    request: visitInitialValues?.request?.map((request) => ({
      ...request,
      request_type: request?.request_type?._id,
      pathway: request?.pathway?._id,
      resources_given: request?.resources_given?.map((resource) => ({
        label: `${resource?.resource_name} (${resource?.organization})`,
        value: resource?._id,
      })),
    })),
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
    modalClose();
    if (setAddEditvisitLoading) {
      setAddEditvisitLoading(false);
    }
    form.resetFields();
    initialValues = {};
  };

  const handleDateChange = (value) => {
    if (modalAction === "editVisit") {
      setOpenDateHistory(true);
    }
  };

  const handleChange = (field, value) => {
    if (field === "dueDateReason") {
      setActiveDueReason(field);
      setCurrentDueDate(value);
    }
  };

  const handleStatusChange = (field, name, value) => {
    setActiveStatusReason(field);
    setActiveStatusIndex((prevIndex) => ({ ...prevIndex, [name]: value }));
  };

  useEffect(() => {
    setChangeDate(
      new Date(currentDueDate).getTime() !==
        new Date(visitInitialValues.followupDate).getTime()
    );
  }, [currentDueDate]);

  useEffect(() => {
    if (modalAction === "addVisit") {
      dispatch(listAllPathway()).then((response) => {
        const groupedOptions = {};
        response?.payload?.data?.forEach((needGroup) => {
          const needName = needGroup.need.name;
          const pathway = {
            label: needGroup.name,
            value: needGroup._id,
          };

          if (!groupedOptions[needName]) {
            groupedOptions[needName] = {
              label: needName,
              options: [],
            };
          }
          groupedOptions[needName].options.push(pathway);
        });

        const options = Object.values(groupedOptions);
        setRequestPathwayOptions(options);
      });
      dispatch(previousRequestData({ requestId: id })).then((res) => {
        const requestdata = res.payload.data;
        form.setFieldsValue({
          request: requestdata.map((res) => ({
            request_id: res._id,
            request_type: res?.request_type?._id || "",
            pathway: res?.pathway?._id || "",
            resources_given: Array.isArray(res.resources_given)
              ? res.resources_given.map((data) => data._id)
              : [],
            request_details: res?.request_details || "",
            request_status: res?.request_status || "",
            assign_to: res?.assign_to?._id,
            urgent: res.urgent,
          })),
        });
      });
    }
  }, [modalAction === "addVisit"]);

  useEffect(() => {
    if (modalAction === "editVisit") {
      dispatch(listAllPathway()).then((response) => {
        const groupedOptions = {};
        response?.payload?.data?.forEach((needGroup) => {
          const needName = needGroup.need.name;
          const pathway = {
            label: needGroup.name,
            value: needGroup._id,
          };

          if (!groupedOptions[needName]) {
            groupedOptions[needName] = {
              label: needName,
              options: [],
            };
          }
          groupedOptions[needName].options.push(pathway);
        });

        const options = Object.values(groupedOptions);
        setRequestPathwayOptions(options);
      });
    }
  }, [modalAction === "editVisit"]);

  const handleSelectNeed = (value) => {
    setLoading(true);
    dispatch(listPathwayBaseOfNeed(value))
      .then((response) => {
        const groupedOptions = {};
        response?.payload?.data?.forEach((needGroup) => {
          const needName = needGroup.need.name;
          const pathway = {
            label: needGroup.name,
            value: needGroup._id,
          };

          if (!groupedOptions[needName]) {
            groupedOptions[needName] = {
              label: needName,
              options: [],
            };
          }
          groupedOptions[needName].options.push(pathway);
        });

        const options = Object.values(groupedOptions);
        setPathwayOptions(options);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const handleSelectPathway = async (value, option) => {
    // eslint-disable-next-line no-unused-vars
    let categoryName;
    await dispatch(getNeedName(option.value)).then((response) => {
      const categoryOptions = {
        label: response?.payload?.data?.name,
        value: response?.payload?.data?._id,
      };
      categoryName = categoryOptions;
    });
    const getOption = { label: option.label, value: option.value };
    setPathwaySelection(value);
    const request = form.getFieldValue("request");
    const arr = request ? [...request] : [];
    arr.push({
      pathway: getOption,
      isNotCustom: true,
      request_type: categoryName,
      isSelcted: true,
    });
    form.setFieldValue("request", arr);
  };

  const handleDeSelectPathway = (value) => {
    const request = form.getFieldValue("request");
    let arr = request ? [...request] : [];
    arr = arr.filter((a) => a.pathway.value !== value);
    form.setFieldValue("request", arr);
  };

  useEffect(() => {
    setLoading(true);
    const selectedNeed = initialValues.primaryNeed;
    if (modalAction === "editVisit" && selectedNeed) {
      handleSelectNeed(selectedNeed);
    }
    setLoading(false);
  }, [modalAction]);

  return (
    <>
      <Spin spinning={loading}>
        <Form
          form={form}
          initialValues={initialValues}
          labelCol={{ span: 8 }}
          labelAlign="left"
          onFinish={() => handleDispatchAction(modalAction, form)}
        >
          <Form.Item
            label="Visit Type"
            name="visitType"
            rules={[{ required: true, message: "Visit type is required" }]}
          >
            <Select
              options={ClientVisitType}
              ref={inputRef}
              placeholder="Select visit type"
            />
          </Form.Item>
          <Form.Item
            label="Length of Visit"
            name="lengthOfvisit"
            rules={[
              {
                required: true,
                message: "Length of visit is required",
                validator: lengthOfVisitValidation,
              },
            ]}
          >
            <InputNumber
              placeholder="Enter length of visit"
              addonAfter={
                <Select
                  options={TimeOptions}
                  value={timeOptionValue}
                  style={{ width: 100 }}
                  onChange={(value) => setTimeOptionValue(value)}
                />
              }
            />
          </Form.Item>
          <Form.Item
            label="Visit Date"
            name="visitDate"
            rules={[{ required: true, validator: futureVisitTimeValidation }]}
          >
            <DatePicker
              showTime
              format="MM/DD/YYYY hh:mm A"
              disabledDate={(value) => disabledDate(value, "futureDate")}
              disabledTime={(value) => disableVisitTime(value)}
            />
          </Form.Item>
          <Form.Item
            label="Client Story"
            name="clientStory"
            rules={[{ required: true, message: "Client story is required" }]}
          >
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              placeholder="Enter client story"
            />
          </Form.Item>
          <Form.Item
            label="Client Goal"
            name="client_goal"
            rules={[{ required: true, message: "Client goal is required" }]}
          >
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              placeholder="Enter client goal"
            />
          </Form.Item>
          <Form.Item
            label="Need"
            name="primaryNeed"
            rules={[{ required: true, message: "Primary need is required" }]}
          >
            <Select
              mode="multiple"
              options={needOrCategoryOptions || []}
              placeholder="Select primary need"
              onChange={handleSelectNeed}
            />
          </Form.Item>
          {(pathwayOptions.length > 0 || modalAction === "editVisit") && (
            <>
              <Form.Item
                label="Pathway"
                name="pathway"
                rules={[{ required: true, message: "Pathway is required" }]}
              >
                <Select
                  mode="tags"
                  placeholder="Select Pathway"
                  options={pathwayOptions}
                  onSelect={handleSelectPathway}
                  onDeselect={handleDeSelectPathway}
                />
              </Form.Item>
            </>
          )}
          <div className="form-head">Plan</div>
          <Form.Item
            label="Next Important Date"
            name="followupDate"
            rules={[{ required: true, validator: timeValidation }]}
          >
            <DatePicker
              showTime
              disabledTime={(value) => disableTime(value)}
              format="MM/DD/YYYY hh:mm A"
              disabledDate={(value) => disabledDate(value, "pastDate")}
              onChange={(value) =>
                modalAction === "editVisit" &&
                handleChange("dueDateReason", value)
              }
            />
          </Form.Item>
          {activeDueReason === "dueDateReason" && chnageDate && (
            <Form.Item
              label="Reason for Date Change"
              name={"dueDateReason"}
              rules={[{ required: true, message: "Reason is required" }]}
            >
              <Input.TextArea placeholder="Enter reason" />
            </Form.Item>
          )}
          <Form.Item
            label="Reason for Next Important Date"
            name={"followupReason"}
            rules={[
              {
                required: true,
                message: "Reason for next important date is required",
              },
            ]}
          >
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              placeholder="Enter reason for next important date"
            />
          </Form.Item>

          <Form.List name="request">
            {(fields, { add, remove }) => (
              <>
                <div className="form-head">
                  <div>Action Steps</div>
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: "100%", padding: 5 }}
                      icon={<PlusOutlined />}
                      className="add-pathway-button"
                    ></Button>
                  </Form.Item>
                </div>
                {fields.map(({ key, name, ...restField }, index) => {
                  const currentFieldStatus =
                    visitInitialValues?.request?.[name]?.request_status || "";
                  return (
                    <div key={key} className="actio-steps">
                      <Space>
                        <Form.Item
                          {...restField}
                          label="Category"
                          name={[name, "request_type"]}
                          key={`${key}-request_type`}
                          rules={[
                            { required: true, message: "Category is required" },
                          ]}
                        >
                          {form.getFieldValue("request")[index]?.isSelcted ? (
                            <Select
                              options={needOrCategoryOptions}
                              placeholder="Select Category"
                            />
                          ) : (
                            <Select
                              options={needOrCategoryOptions}
                              placeholder="Select Category"
                              onChange={handleSelectNeed}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="Pathway"
                          name={[name, "pathway"]}
                          key={`${key}-pathway`}
                          rules={[
                            { required: true, message: "Pathway is required" },
                          ]}
                        >
                          {form.getFieldValue("request")[index]?.isNotCustom ? (
                            <Select
                              placeholder="Select Pathway"
                              options={pathwayOptions}
                            />
                          ) : (
                            <Select
                              placeholder="Select Pathway"
                              options={requestPathwayOptions}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="Resource Given"
                          name={[name, "resources_given"]}
                          key={`${key}-resources_given`}
                          rules={[
                            {
                              required: true,
                              message: "Resource given is required",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Resource given"
                            mode="multiple"
                            options={resourceOptions}
                            onChange={handleResourceClear}
                            onSearch={handleResourceSearch}
                            showSearch
                            filterOption={false}
                          />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label="Action step detail"
                          name={[name, "request_details"]}
                          key={`${key}-request_details`}
                          rules={[
                            {
                              required: true,
                              message: "Action Step detail is required",
                            },
                          ]}
                        >
                          <Input placeholder="Action step detail" />
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          label="Status"
                          name={[name, "request_status"]}
                          key={`${key}-status`}
                          rules={[
                            { required: true, message: "Status is required" },
                          ]}
                        >
                          <Select
                            options={RequestStatus?.filter(
                              (requestData) => requestData?.label !== "All"
                            )}
                            placeholder="Status"
                            value={currentFieldStatus}
                            onChange={(value) => {
                              handleStatusChange("statusReason", name, value);
                              setCurrentStatus((prevStatus) => ({
                                ...prevStatus,
                                [name]: value,
                              }));
                            }}
                          />
                        </Form.Item>
                        {modalAction === "editVisit" &&
                          activeStatusReason === "statusReason" &&
                          activeStatusIndex[name] &&
                          currentFieldStatus !==
                            (activeStatusIndex[name] || "") && (
                            <Form.Item
                              label="Reason for Status Change"
                              name={[name, "reason"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Reason is required",
                                },
                              ]}
                            >
                              <Input.TextArea placeholder="Enter reason" />
                            </Form.Item>
                          )}
                        <Form.Item
                          {...restField}
                          label="Assign to"
                          name={[name, "assign_to"]}
                          key={`${key}-assign_to`}
                        >
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
                          {...restField}
                          label="Mark As Urgent"
                          name={[name, "urgent"]}
                          key={`${key}-urgent`}
                          valuePropName="checked"
                        >
                          <Checkbox>Urgent</Checkbox>
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "request_id"]}
                          key={`${key}-request_id`}
                          hidden
                        ></Form.Item>
                        {fields.length !== 0 && (
                          <Button
                            onClick={() => remove(name)}
                            className="reject-btn"
                          >
                            Delete
                          </Button>
                        )}
                      </Space>
                    </div>
                  );
                })}
                {fields.length !== 0 && (
                  <Form.Item className="add-more">
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: "100%", padding: 5 }}
                      icon={<PlusOutlined />}
                    >
                      Add more
                    </Button>
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>
          <div className="accept-reject">
            <Form.Item>
              <Button
                loading={createVisitLoading}
                disabled={createVisitLoading}
                className="save-btn"
                htmlType="submit"
              >
                Save Visit
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={handleCancel} className="reject-btn">
                Cancel
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Spin>
      {
        <DateHistory
          isOpen={openDateHistory}
          setIsOpen={setOpenDateHistory}
          visitForm={form}
          title="Reason for Date Change"
          visitInitialValues={visitInitialValues}
          setVisitInitialValues={setVisitInitialValues}
          modalAction={modalAction}
          handleDispatchAction={handleDispatchAction}
        />
      }
    </>
  );
};
export default AddVisitForm;
