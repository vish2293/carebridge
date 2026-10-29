import { Modal } from "antd";
import React, { useEffect } from "react";
import { toggleBodyClass } from "../../../helpers/noScroll";

const RequestDetailModal = ({ isOpen, setIsOpen, data }) => {
  const handleOnCancel = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const cleanup = toggleBodyClass(isOpen);
    return cleanup;
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={handleOnCancel}
      title={"Action Step Detaile"}
      centered={true}
    >
      <div className="inner-request-detaile">
        <div>Client Name</div>
        <div>{data?.clientName}</div>
        <div>Action Step Name</div>
        <div>{data?.requestDetail}</div>
        <div>Action Step Status</div>
        <div>{data?.status}</div>
        <div>Visity Type</div>
        <div>{data?.visit_type}</div>
      </div>
    </Modal>
  );
};

export default RequestDetailModal;
