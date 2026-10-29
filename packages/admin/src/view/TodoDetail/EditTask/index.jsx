/* eslint-disable react/prop-types */
import { Checkbox, DatePicker, Form, Input, Modal, Select } from "antd";
import { RequestStatus, TaskStatusOptions, userRequests } from "../../../constant/array";

const EditTaskModal = ({ isOpen, setIsOpen, userList, readOnly, data, handleUserChange, modalAction, handleDispatchAction }) => {

    //For handle on close 
    const handleOnCancel = () => {
        setIsOpen(false);
    };
    //For form
    const [form] = Form.useForm();

    const filterOption = (input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

    return (
        <Modal
            open={isOpen}
            centered={true}
            title={"Edit Task"}
            onCancel={handleOnCancel}
            okText={"Save"}
            onOk={() => handleDispatchAction(modalAction, form)}
        >
            <Form
                initialValues={data}
                form={form}
                layout='vertical'
            >
                <Form.Item name={"category"} label="Category" rules={[{ required: true, message: "Category is required" }]}>
                    <Select options={userRequests} placeholder="Select category" disabled={readOnly} />
                </Form.Item>
                <Form.Item name={"task_name"} label="Task name" rules={[{ required: true, message: "Task name is required" }]} >
                    <Input placeholder="Enter detail" disabled={readOnly} />
                </Form.Item>
                <Form.Item name={"task_description"} label="Task description" rules={[{ required: true, message: "Task description is required" }]} >
                    <Input placeholder="Enter task description" disabled={readOnly} />
                </Form.Item>
                <Form.Item name={"status"} label="Task Status" rules={[{ required: true, message: "Status is required" }]}>
                    <Select options={TaskStatusOptions} placeholder="Select status" />
                </Form.Item>
                <Form.Item name={"dueDate"} label="Due date" rules={[{ required: true, message: "Due date is required" }]} >
                    <DatePicker format="MM/DD/YYYY" showTime placeholder="Select due date" disabledDate={(value) => (value, "pastDate")} disabled={readOnly} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditTaskModal;
