import { Button, Modal } from "antd";
import React, { useEffect } from "react";
import { questionIcon } from "../../../assets/icons";
import { toggleBodyClass } from "../../../helpers/noScroll";

const ConfirmChwModal = ({
  handleOnOk,
  chwName,
  isOpen,
  modalClose,
  createCHWLoading,
}) => {
  const handleCancel = () => {
    modalClose();
  };

  const onClickOK = () => {
    handleOnOk();
  };

  useEffect(() => {
    const cleanup = toggleBodyClass(isOpen);
    return cleanup;
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      okText={"Yes"}
      width={450}
      footer={null}
      centered={true}
    >
      <div className="inner_content">
        <div>{questionIcon}</div>
        <div>
          <p className="title">Assign Community Health Worker</p>
          <span>Are you sure you want to assign Community Health Worker - {chwName}</span>
        </div>
      </div>
      <div className="cancel-yes delete-modal">
        <Button type="default" onClick={() => handleCancel()}>
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={() => onClickOK()}
          loading={createCHWLoading}
          className="delete"
        >
          Yes
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmChwModal;
