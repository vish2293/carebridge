import { Form, Input, Modal } from "antd"
import { useEffect, useRef } from "react";
const UpdateStatus = ({ isOpen, setIsOpen, initialValues, changedStatus, handleReasonChange, setVisitInitialValues, requestIndex, modalAction }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current.focus();
            }, 100);
        }
    }, [isOpen]);

    const handleCancel = () => {
        setIsOpen(false)
        form.resetFields(["reason_status"])
    }

    const [form] = Form.useForm()

    return (
        <Modal open={isOpen} onCancel={handleCancel} onOk={() => {
            form.validateFields().then(values => {

                if (modalAction !== "editRequest") {
                    setVisitInitialValues((prev) => ({
                        ...prev,
                        request: prev.request.map((item, index) =>
                            index === requestIndex ? { ...item, reason: values.reason_status } : item
                        )
                    }))
                }
                setIsOpen(false)
                form.resetFields(["reason_status"])
            })
        }}>

            <div className="user-detail-info status-reason">
                <div className="contact-info w-100">
                    <div className="heading secondary60 bold600 ">Current Status : </div>
                    <div className="heading secondary60 bold500 ">{initialValues?.request_status}</div>
                </div>
                <div className="contact-info w-100">
                    <div className="heading black bold600 ">Changed Status : </div>
                    <div className="heading secondary60 bold500 "> {changedStatus}</div>
                </div>
            </div>


            <Form form={form} layout="vertical">
                <Form.Item label="Reason For Status Change" name={"reason_status"} rules={[{ required: true, message: "Please enter reason to change status" }]}>
                    <Input.TextArea onChange={(e) => handleReasonChange(e.target.value)} ref={inputRef} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default UpdateStatus