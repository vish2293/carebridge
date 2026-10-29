import { Button, Modal } from "antd";
import React, { useEffect } from "react";
import { questionIcon } from "../../../assets/icons";
import { toggleBodyClass } from "../../../helpers/noScroll";

const DeleteModal = ({
  isOpen,
  title,
  description,
  setIsOpen,
  modalAction,
  handleDispatchAction,
  confirmLoading,
}) => {
  const onCancel = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const cleanup = toggleBodyClass(isOpen);
    return cleanup;
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onCancel={onCancel}
      okText={"Yes"}
      width={500}
      footer={null}
      centered={true}
      confirmLoading={confirmLoading}
    >
      <div className="inner_content">
        <div>{questionIcon}</div>
        <div>
          <p className="title">{title}</p>
          <span>{description}</span>
        </div>
      </div>
      <div className="cancel-yes delete-modal">
        <Button type="default" onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={() => handleDispatchAction(modalAction)}
          className="delete"
        >
          Yes
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
