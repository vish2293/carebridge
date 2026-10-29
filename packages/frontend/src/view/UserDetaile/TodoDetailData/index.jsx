import { Button, DatePicker, Form, Input, Modal, Select } from "antd"
import { useEffect, useState } from "react"
import { TaskStatusOptions } from "../../../constant/array"
import { disabledDate } from "../../../helpers"
import dayjs from "dayjs"

const TodoDetailData = ({ isOpen, modalClose, singleTodo, modalAction, setTodoInitialValues, handleDispatchAction }) => {
    const [activeDueReason, setActiveDueReason] = useState("default");
    const [activeStatusReason, setActiveStatusReason] = useState("default");
    const [currentStatus, setCurrentStatus] = useState(singleTodo.status)
    const [currentDueDate, setCurrentDueDate] = useState(singleTodo.dueDate)
    const [btnLoading, setBtnLoading] = useState(false);
    const [data, setData] = useState({})
    const [form] = Form.useForm();

    const handleCancel = () => {
        modalClose();
        let updatedUrl = window.location.href.split("?")[0]
        window.history.replaceState({}, document.title, updatedUrl);
        form.resetFields();
        setActiveDueReason("default");
        setActiveStatusReason("default");
    }

    const disableTime = (value) => {
        const futureDate = new Date(value)
        const current = new Date()
        if (current < futureDate) {
            return null
        } else {
            const currentHour = current.getHours();
            const currentMinute = current.getMinutes();
            const currentSecond = current.getSeconds();
            return {
                disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter(hour => hour < currentHour),
                disabledMinutes: (hour) => hour === currentHour ? Array.from({ length: 60 }, (_, i) => i).filter(minute => minute < currentMinute) : [],
                disabledSeconds: (hour, minute) => (hour === currentHour && minute === currentMinute) ? Array.from({ length: 60 }, (_, i) => i).filter(second => second < currentSecond) : [],
            };
        }
    }

    const handleOnChange = (filed, value) => {
        if (filed === "dueDate") {
            setActiveDueReason("dueDateReason");
        } else if (filed === "status") {
            setActiveStatusReason("statusReason");
        }
        setCurrentStatus(value)
        setCurrentDueDate(value)
    }

    const onFinish = (values) => {
        setBtnLoading(true);
        setTodoInitialValues({ ...singleTodo, dueDate: values?.dueDate, dueDateReason: values?.dueDateReason });
        let payload = {
            ...singleTodo,
            dueDate: values?.dueDate,
            oldDueDate: singleTodo?.dueDate,
            dueDateReason: values?.dueDateReason,
            status: values?.status,
            oldStatus: singleTodo?.status,
            reason: values?.statusReason
        }
        handleDispatchAction(modalAction, payload);
        setActiveDueReason("default");
        setActiveStatusReason("default");
        setTimeout(() => {
            setBtnLoading(false);
            form.resetFields();
        }, 200);
    }

    const isDateDifferent = new Date(currentDueDate).getTime() !== new Date(singleTodo.dueDate).getTime();

    useEffect(() => {
        setData(singleTodo)
    }, [])

    useEffect(() => {
        form.setFieldsValue({
            dueDate: singleTodo?.dueDate ? dayjs(singleTodo.dueDate) : null,
            status: singleTodo?.status,
        });
        setCurrentStatus(singleTodo?.status);
    }, [singleTodo, form]);

    return (
        <Modal
            open={isOpen}
            onCancel={handleCancel}
            title={"Edit Important Dates Detail"}
            footer={null}
            className="edit-date"
        >
            <div className="user-detail-info todo-title">
                <div className="contact-info w-50">
                    <div className="heading f-14 black bold600">Client Name</div>
                    <div className="heading f-14 secondary60 bold400">{`${singleTodo?.clientId?.firstName} ${singleTodo?.clientId?.lastName}`}</div>
                </div>
                <div className="contact-info w-50">
                    <div className="heading f-14 black bold600">Category </div>
                    <div className="heading f-14 secondary60 bold400">
                        {
                            singleTodo?.category?.length
                                ? singleTodo?.category?.map((need, index) => (
                                    <span key={need?._id}>
                                        {need?.name}
                                        {index < singleTodo?.category?.length - 1 && ', '}
                                    </span>
                                ))
                                : "-"
                        }
                    </div>
                </div>
            </div>
            <div className="user-detail-info todo-title">
                <div className="contact-info w-50">
                    <div className="heading f-14 black bold600">Name </div>
                    <div className="heading f-14 secondary60 bold400">{singleTodo?.task_name}</div>
                </div>
                {/* <div className="contact-info w-50">
                    <div className="heading f-14 black bold600">Description </div>
                    <div className="heading f-14 secondary60 bold400">{singleTodo?.task_description}</div>
                </div> */}
            </div>
            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                initialValues={singleTodo}
            >
                <div className="user-detail-info todo-title">
                    <div className="contact-info w-50">
                        <Form.Item label="Due Date" name="dueDate">
                            <DatePicker
                                showTime
                                disabledTime={disableTime}
                                format="MM/DD/YYYY hh:mm A"
                                disabledDate={(value) => disabledDate(value, "pastDate")}
                                onChange={(value) => handleOnChange("dueDate", value)}
                            />
                        </Form.Item>
                    </div>
                    {
                        activeDueReason === "dueDateReason" && isDateDifferent &&
                        <div className="contact-info w-50">
                            <Form.Item label="Reason for Date Change" name="dueDateReason" rules={[
                                { required: true, message: "Reason is required" }
                            ]}>
                                <Input.TextArea placeholder="Enter reason" onChange={(e) => handleOnChange("dueDateReason", e.target.value)} />
                            </Form.Item>
                        </div>
                    }
                </div>
                <div className="user-detail-info todo-title">
                    <div className="contact-info w-50">
                        <Form.Item label="Status" name="status">
                            <Select
                                options={TaskStatusOptions}
                                onChange={(value) => handleOnChange("status", value)}
                            />
                        </Form.Item>
                    </div>
                    {
                        activeStatusReason === "statusReason" && currentStatus !== singleTodo.status &&
                        <div className="contact-info w-50">
                            <Form.Item label="Reason for Status Change" name="statusReason" rules={[
                                { required: true, message: "Reason is required" }
                            ]}>
                                <Input.TextArea placeholder="Enter reason" onChange={(e) => handleOnChange("statusReason", e.target.value)} />
                            </Form.Item>
                        </div>
                    }
                </div>
                <div className="cancel-yes">
                    <Form.Item>
                        <Button type="primary" className="yellow-btn" htmlType="submit" loading={btnLoading} disabled={btnLoading}>
                            Submit
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Form.Item>
                </div>
            </Form>

        </Modal>
    )
}
export default TodoDetailData