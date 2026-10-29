/* eslint-disable react/prop-types */
/* eslint-disable quotes */
import { Button, Form, Input } from "antd";
import { emailValidation, firstNameValidation, lastNameValidation, passowrdValidation, phoneValidation, userNameValidation } from "../../../helpers/formValidation";
import { emailIcon, forwardIcon, lockIcon, phoneIcon, userProfileIcon } from "../../../assets/icons";

const SignupForm = ({ handleSubmit, handleSubmitFailed }) => {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  return (

    <Form layout='vertical' form={form} style={{ minWidth: 400 }} onFinish={() => handleSubmit(form)} onFinishFailed={handleSubmitFailed} requiredMark={false} >
      <div className='two-fill-row'>
        <Form.Item name='firstName' label="First name" rules={[{ required: true, validator: firstNameValidation }]}>
          <Input prefix={userProfileIcon} placeholder='Enter first name' />
        </Form.Item>
        <Form.Item name='lastName' label="Last name" rules={[{ required: true, validator: lastNameValidation }]}>
          <Input prefix={userProfileIcon} placeholder='Enter last name' />
        </Form.Item>
      </div>
      <Form.Item label="User Name" name={"userName"} rules={[{ required: true, validator: userNameValidation }]}>
        <Input placeholder='Enter unique user name' prefix={userProfileIcon} />
      </Form.Item>
      <Form.Item name='email' label="Email Address" rules={[{ required: true, validator: emailValidation }]}>
        <Input placeholder='Enter Email Address' prefix={emailIcon} />
      </Form.Item>
      <Form.Item name='Phone' label="Phone number" rules={[{ required: true, validator:phoneValidation}]}>
        <Input prefix={phoneIcon} placeholder='Enter Phone number' />
      </Form.Item>
      <Form.Item label="Address" name='address' rules={[{required:true,message:"Address is required"}]}>
        <TextArea  placeholder='Enter address' />
      </Form.Item>
      <Form.Item label="Zip code" name='zipCode' rules={[{required:true,message:"Zip code is required"}]}>
        <Input  placeholder='Enter Zip code' prefix={phoneIcon}/>
      </Form.Item>
      <Form.Item name='password' label="Password" rules={[{ required: true, validator: passowrdValidation }]}>
        <Input.Password prefix={lockIcon} placeholder='Enter Unique password' />
      </Form.Item>

      <Form.Item name='confirmPassword' label="Confirm Password" rules={[{ required: true ,message:"Confirm password is required"}, ({ getFieldValue }) => ({
        validator(_, value) {
          ``;
          if (!value || getFieldValue("password") === value) {
            return Promise.resolve();
          }
          return Promise.reject(new Error("Password does not match!"));
        },
      }),]}>
        <Input.Password prefix={lockIcon} placeholder='Enter confirm password' />
      </Form.Item>
      <Form.Item>
        <div className='full-width-btn'>
          <Button type="primary" htmlType="submit" className="login-form-button" icon={forwardIcon}>
            Sign Up
          </Button>
        </div>
      </Form.Item>
    </Form>

  );
};

export default SignupForm;
