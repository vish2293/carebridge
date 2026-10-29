/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createReminder, getSingleReminder, updateReminder } from "../../redux/actions/reminders";
import { changeDateTime } from "../../helpers";
import { setActiveHeader } from "../../redux/slices/headerSlice";

const Reminder = () => {
    const { loggedInUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [reqId, setReqId] = useState("");

    const [form] = Form.useForm();


    //For store initail values
    useEffect(() => {
        dispatch(setActiveHeader({ name: "reminder", heading: "Reminder" }))
        dispatch(getSingleReminder()).then((res) => {
            setReqId(res?.payload?.data?._id);
            form.setFieldsValue({
                reminders: res?.payload?.data?.reminders
            });
        });
    }, []);


    const timeSelection = [
        { label: "Minutes", value: "minutes" },
        { label: "Hours", value: "hours" },
        { label: "Days", value: "days" },
        { label: "Weeks", value: "weeks" },
    ];

    const durationSelection = [
        { label: "Before due date", value: "before" },
        { label: "After due date", value: "after" },
    ];

    const saveReminder = () => {
        form.validateFields().then((values) => {
            let arrReminder = form.getFieldsValue();
            arrReminder.createdBy = loggedInUser?._id;
            if (reqId !== "" && !reqId && reqId !== undefined) {
                dispatch(updateReminder({ id: reqId, reminders: arrReminder }))
                    .then((res) => {
                        if (res?.payload?.status === true) {
                            message.success("Reminder setup Successfully!");
                        } else {
                            message.error("Sometthing went wrong");
                        }
                    });
            } else {
                dispatch(createReminder({ reminders: arrReminder }))
                    .then((res) => {
                        if (res?.payload?.status === true) {
                            message.success("Reminder setup Successfully!");
                        } else {
                            message.error("Sometthing went wrong");
                        }
                    });
            }

        });
    };

    const filterOption = (input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

    return (

        <div className="profile_wrapper reminder-sec">
            <div className="dashboard-heading">Set Reminder Time</div>
            <Form
                form={form}
                layout="inline"
                initialValues={{}}
                style={{ width: "100%" }}
            >
                <Form.List name="reminders">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map((field, index) => (
                                <div key={field.key}>
                                    <Form.Item
                                        name={[field.name, "time"]}
                                        rules={[{ required: true, message: "Please enter time" }]}
                                    >
                                        <Input
                                            placeholder="Enter time"
                                            // style={{maxWidth: 170, width: "100%"}}
                                            type="number"
                                            min={0}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name={[field.name, "unit"]}
                                        rules={[{ required: true, message: "Please select hours" }]}
                                    >
                                        <Select
                                            style={{ minWidth: "95px", width: "100%" }}
                                            placeholder="Hours"
                                            options={timeSelection}
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={filterOption}

                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name={[field.name, "direction"]}
                                        rules={[{ required: true, message: "Please select duration" }]}
                                    >
                                        <Select
                                            // style={{  height: 39,maxWidth:206, width: "100%"}}
                                            placeholder="Before due date"
                                            options={durationSelection}
                                            disabled={form.getFieldValue(["reminders", index, "direction"]) !== undefined}
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={filterOption}
                                        />
                                    </Form.Item>
                                    <CloseOutlined onClick={() => remove(field.name)} />
                                </div>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => {
                                        add();
                                    }}
                                    style={{ width: "100%" }}
                                >
                                    ADD Reminder
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
            <div className="save-change">
                <Button
                    className="yellow-btn"
                    type="primary"
                    onClick={() => {
                        saveReminder();
                    }}
                >
                    Save changes
                </Button>
            </div>
        </div>
    );
};

export default Reminder;
