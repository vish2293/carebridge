import React, { useState } from "react";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/actions/user";
import { PATH_LIST } from "../../constant/path-list";
import "./style.scss";
import LoginForm from "./LoginForm";
import LogInHeader from "../../components/common/LogInHeader";
import LogInSignupLeft from "../../components/common/LogInSignupLeft";

const LogIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [disableLogin, setDisableLogin] = useState(false);

  const handleLogin = (values) => {
    let payload = {
      email: values?.email,
      userName: values?.email,
      password: values?.password,
      role: "Super_Admin",
    };
    setDisableLogin(true);

    dispatch(loginUser(payload))
      .then((res) => {
        if (res.payload?.status === true) {
          localStorage.setItem("temp", res.payload.data.email);
          navigate("/otp");
        } else {
          message.error(res?.payload?.message);
        }
        setDisableLogin(false);
      })
      .catch(() => {
        setDisableLogin(false);
      });
  };

  const handleSubmitFailed = () => {
    message.error("Please fill in all required fields check your form.");
  };

  return (
    <div className="main-sec">
      <div className="main-sec-left">
        <LogInSignupLeft
          title1="Care that reaches "
          title2="every community."
          description="Sign in to the admin workspace to manage requests, workers and reports."
        />
      </div>
      <div className="main-sec-right">
        <LogInHeader isContact={true} />
        <div className="inner-right">
          <div className="login-right">
            <div className="login-right-top">
              <h2 className="login-heading">Log in</h2>
              <p>Welcome back. Enter your details to continue.</p>
              <LoginForm
                handleLogin={handleLogin}
                handleSubmitFailed={handleSubmitFailed}
                disableLogin={disableLogin}
                setDisableLogin={setDisableLogin}
              />
            </div>
            <div className="login-roght-bottom">
              <span>
                Don't have an account? <Link to={PATH_LIST.onBoarding}>Request support</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
