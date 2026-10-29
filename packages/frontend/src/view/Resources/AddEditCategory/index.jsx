import { Button, Form, Input, Modal } from 'antd';
import React, { useEffect, useRef } from 'react';

const AddEditCategory = ({ isOpen, handleDispatchAction, loading, modalClose, initialValues, modalAction, confirmLoading }) => {
    const inputRef = useRef(null);
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus();
            }, 100);
        }
    }, [isOpen]);

    const handleCancel = () => {
        modalClose();
        form.resetFields();
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            handleDispatchAction(modalAction, values);
        })
    }

    useEffect(() => {
        form.setFieldsValue(initialValues)
    }, [initialValues])

    const [form] = Form.useForm();

    const noLeadingTrailingSpaces = (_, value) => {
        if (value && value.trim() !== value) {
            return Promise.reject(new Error('No leading or trailing spaces allowed'));
        }
        return Promise.resolve();
    };

    return (
        <Modal
            title={modalAction === "addCategory" ? "Add Category" : "Edit Category"}
            open={isOpen}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                layout='vertical'
                form={form}
                initialValues={initialValues}
                onFinish={handleOk}
            >
                <Form.Item label="Category name" name={"category"} rules={[
                    { required: true, message: 'Category name is required' },
                    { validator: noLeadingTrailingSpaces },
                ]}>
                    <Input placeholder='Enter category name' ref={inputRef} />
                </Form.Item>
                <div className="cancel-yes">
                    <Form.Item>
                        <Button type="primary" loading={loading} className="yellow-btn" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={handleCancel} loading={confirmLoading}>
                            Cancel
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    )
}

export default AddEditCategory
