import { Modal } from "antd";
import React, { useEffect } from "react";
import { passwordResetIcon } from "../../../assets/icons";
import { toggleBodyClass } from "../../../helpers/noScroll";

const ResetPasswordModal = ({ isOpen, setIsOpen }) => {
  const onCancel = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const cleanup = toggleBodyClass(isOpen);
    return cleanup;
  }, [isOpen]);

  return (
    <Modal onCancel={onCancel} open={isOpen} footer={null} width={364}>
      <div className="forget-model">
        <div className="forget-icon">{passwordResetIcon}</div>
        <div className="password-heading">
          <p>Reset password?</p>
        </div>

        <div className="pass-des">
          <p>
            No worries, we’ll send you reset password link on you registered{" "}
            <span>example123@gmail.com email </span>
          </p>
        </div>
        <div className="send-btn-sec">
          <button className="btn send-btn">Send reset link</button>
          <button onClick={onCancel} className="btn edit-btn">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ResetPasswordModal;
