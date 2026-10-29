import { Button, Form, Input, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { forwardIcon } from "../../../assets/icons";

const MFALoginForm = ({
  handleMFA,
  handleSubmitFailed,
  disableMFA,
  resendOtp,
}) => {
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(() => new Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef([]);
  const isPasting = useRef(false);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Normalizes Arabic-Indic / Eastern Arabic-Indic digits to ASCII 0-9
  const normalizeDigits = (raw) => {
    return String(raw ?? "")
      .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
      .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
  };

  const getLastDigit = (raw) => {
    const digitsOnly = normalizeDigits(raw).replace(/\D/g, "");
    return digitsOnly.slice(-1);
  };

  const handleChange = (index, e) => {
    if (isPasting.current) {
      isPasting.current = false;
      return;
    }
    const raw = e.target.value;
    // Allow clearing the current box
    if (!raw) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const value = getLastDigit(raw);
    if (!value) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    const combinedOtp = newOtp.join("");

    if (combinedOtp.length === OTP_LENGTH) {
      setLoading(true); // Start loading when calling API
      handleMFA(combinedOtp).finally(() => setLoading(false)); // Stop loading after API response
    }

    if (value && index < OTP_LENGTH - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const digitsOnly = String(pasteData ?? "").replace(/\D/g, "");
    if (digitsOnly.length === OTP_LENGTH) {
      const newOtp = digitsOnly.split("");
      setOtp(newOtp);
      setLoading(true); // Start loading when calling API
      handleMFA(newOtp.join(""))?.finally(() => setLoading(false)); // Stop loading after API response
    }
    isPasting.current = true;
  };

  const handleClick = (index) => {
    inputRefs.current[index]?.setSelectionRange(1, 1);
    if (index > 0 && !otp[index - 1]) {
      inputRefs.current[otp.indexOf("")]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && inputRefs.current[index - 1]) {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
        setTimeout(() => inputRefs.current[index]?.focus(), 0);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        setTimeout(() => inputRefs.current[index - 1]?.focus(), 0);
      }
    }
  };

  return (
    <Form
      layout="vertical"
      style={{ width: "100%", margin: "0 auto" }}
      onFinishFailed={handleSubmitFailed}
    >
      <Form.Item
        name="otp"
        label="One-Time Password"
        rules={[{ required: true, message: "Please enter the OTP" }]}
      >
        <div style={{ display: "flex" }}>
          {otp.map((value, index) => (
            <Input
              key={`otp-${index}`}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              pattern="[0-9]*"
              style={{
                width: "40px",
                height: "40px",
                margin: "0 5px",
                textAlign: "center",
                fontSize: "20px",
                marginBottom: "5px",
                direction: "ltr",
                unicodeBidi: "plaintext",
                fontVariantNumeric: "tabular-nums",
              }}
              ref={(input) => (inputRefs.current[index] = input)}
              value={String(value ?? "")}
              onChange={(e) => handleChange(index, e)}
              onClick={() => handleClick(index)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              placeholder=""
            />
          ))}
        </div>
      </Form.Item>
      <div className="otp-container">
        <div className="otp-text">
          <span>Didn’t receive?</span>
        </div>
        <button
          className="otp-resend-button"
          onClick={(e) => {
            e.preventDefault();
            resendOtp();
          }}
        >
          Resend OTP
        </button>
      </div>
      <div className="full-width-btn">
        <Button
          type="primary"
          htmlType="submit"
          className="btn"
          icon={forwardIcon}
          onClick={() => {
            setLoading(true);
            handleMFA(otp.join("")).finally(() => setLoading(false));
          }}
          disabled={disableMFA || loading}
        >
          {loading ? <Spin size="small" /> : "Verify OTP"}
        </Button>
      </div>
    </Form>
  );
};

export default MFALoginForm;
