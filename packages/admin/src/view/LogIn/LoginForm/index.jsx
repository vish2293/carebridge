import React from "react";
import {
  eyeIcon,
  forwardIcon,
  lockIcon,
  userProfileIcon,
} from "../../../assets/icons";
import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { PATH_LIST } from "../../../constant/path-list";

const LoginForm = ({
  handleLogin,
  handleSubmitFailed,
  disableLogin,
  setDisableLogin,
}) => {
  return (
    <Form
      layout="vertical"
      style={{ minWidth: 400 }}
      onFinish={handleLogin}
      onFinishFailed={handleSubmitFailed}
    >
      <Form.Item
        name="email"
        label="User Name or Email"
        rules={[{ required: true, message: "Please enter email" }]}
        className="login-email"
      >
        <Input
          prefix={userProfileIcon}
          placeholder="Enter user name or email"
          onChange={() => setDisableLogin(false)}
        />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Please enter password" }]}
      >
        <Input.Password
          prefix={lockIcon}
          placeholder="Enter Unique password"
          suffix={lockIcon}
          onChange={() => setDisableLogin(false)}
        />
      </Form.Item>
      <Form.Item>
        <Link to={PATH_LIST.resetPassword}>Forgot password?</Link>
        <div className="full-width-btn">
          <Button
            type="primary"
            htmlType="submit"
            className="btn"
            icon={forwardIcon}
            disabled={disableLogin}
            loading={disableLogin}
          >
            Log in
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
