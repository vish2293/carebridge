import { message } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { PATH_LIST } from "../../constant/path-list";
import { MFALoginUser, resendOTP } from "../../redux/actions/user";
import MFALoginForm from "./MultiFactorForm";
import "./style.scss";
import { envelopeIcon } from "../../assets/icons";
import LogInLeft from "../../assets/images/leftsidelogin.jpeg";

const MFALogIn = () => {
  //For reducer
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [disableLogin, setDisableLogin] = useState(false);
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to={PATH_LIST.user.dashboard} />;
  }

  //handle submit
  const handleMFA = (values) => {
    let payload = {
      email: localStorage.getItem("temp"),
      otp: values,
    };

    setDisableLogin(true);
    dispatch(MFALoginUser(payload)).then((res) => {
      if (res.payload?.status === true) {
        setDisableLogin(false);
        localStorage.setItem("token", res?.payload?.token);
        navigate(PATH_LIST.user.dashboard);
      } else {
        message.error(res?.payload?.response?.data?.message);
      }
    });
  };

  const resendOtp = async () => {
    let payload = {
      email: localStorage.getItem("temp"),
    };

    setDisableLogin(true);
    dispatch(resendOTP(payload)).then((res) => {
      if (res.payload?.status === true) {
        setDisableLogin(false);
        message.success("OTP has been resent successfully!");
      } else {
        message.error(res?.payload?.response?.data?.message);
      }
    });
  };

  //handle submit failed
  const handleSubmitFailed = () => {
    message.error("Please fill in all required fields  check your form.");
  };

  return (
    <div className="login-fullscreen otp-fullscreen">
      <div className="login-bg">
        <img src={LogInLeft} alt="Background" />
        <div className="login-overlay"></div>
      </div>

      <div className="login-card-container">
        <div className="login-card otp-card">
          <div className="login-logo">
            <Link to="/" className="logo-text">
              care<span>bridge</span>
            </Link>
          </div>

          <div className="otp-icon">
            <div className="otp-icon-inner">
              {envelopeIcon}
              <div className="otp-badge">1</div>
            </div>
          </div>

          <div className="login-welcome">
            <h1>OTP Verification</h1>
            <p>We’ve sent a 6‑digit code to your email address</p>
          </div>

          <MFALoginForm
            handleMFA={handleMFA}
            handleSubmitFailed={handleSubmitFailed}
            disableMFA={disableLogin}
            resendOtp={resendOtp}
          />
        </div>
      </div>
    </div>
  );
};

export default MFALogIn;
