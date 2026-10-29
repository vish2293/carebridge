/* eslint-disable react/prop-types */
import { Button, Form, Input } from "antd";
import { newPassowrdValidation } from "../../../helpers/formValidation";

const UpdatePasswordForm = ({ isOpen, setIsOpen, handleSubmitPassword, loading }) => {
  const handleCancel = () => {
    setIsOpen(false)
  }
  const [form] = Form.useForm()
  return (
    <Form
      form={form}
      className="update-pass"
      layout='vertical'

    >
      <div className='two-fill-row'>
        <Form.Item name='oldPassword' rules={[{ required: true, message: "Current password is required" }]} label="Enter Current Password">
          <Input.Password placeholder='Enter current password' />
        </Form.Item>
        <Form.Item name='password' rules={[{ required: true, validator: newPassowrdValidation, }]} label="Enter New Password">
          <Input.Password placeholder='Enter new password' />
        </Form.Item>

        <Form.Item name='confirmPassword' label="Enter Confirm Password" rules={[{ required: true, message: "Confirm password is required" }, ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue("password") === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error("Password does not match!"));
          },
        }),]}>
          <Input.Password placeholder='Re-enter new password' />
        </Form.Item>
      </div>
      <div className="accept-reject">
      <Button className='btn save-btn' loading={loading} onClick={() => handleSubmitPassword(form)}>Update</Button>
        <Button className='btn reject-btn' onClick={() => setIsOpen(false)}>Cancel</Button>
       
      </div>
    </Form>
  );
};

export default UpdatePasswordForm;
