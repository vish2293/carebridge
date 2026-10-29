import { Button, Drawer, Image, Modal, Radio, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import pdf from "../../../assets/images/pdf.svg";
import { downloadIcon } from "../../../assets/icons";
import dayjs from "dayjs";
import { toggleBodyClass } from "../../../helpers/noScroll";

const ViewPathway = ({
  isOpen,
  handleDispatchAction,
  modalClose,
  viewData,
  initialValues,
  modalAction,
  confirmLoading,
}) => {
  const handleCancel = () => {
    modalClose();
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleViewIconClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const cleanup = toggleBodyClass(isOpen);
    return cleanup;
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      title={modalAction === "viewPathway" ? "View Pathway" : ""}
      footer={null}
      style={{ top: 150 }}
      className="add-attachment"
      width={736}
    >
      {initialValues && (
        <>
          <div className="user-detail-info todo-title">
            <div className="contact-info w-50">
              <div className="heading f-14 black bold600">Name </div>
              <div className="heading f-14 secondary60 bold400">
                {viewData?.name ? viewData?.name : "-"}{" "}
              </div>
            </div>
            <div className="contact-info w-50">
              <div className="heading f-14 black bold600">Need</div>
              <div className="heading f-14 secondary60 bold400">
                {viewData?.need ? viewData?.need.name : "-"}
              </div>
            </div>
          </div>

          <div className="user-detail-info todo-title">
            <div className="contact-info w-100">
              <div className="heading f-14 black bold600">Outcomes</div>
              <div className="heading f-14 secondary60 bold400">
                {viewData?.description
                  ? Array.isArray(viewData.description)
                    ? viewData.description.join(", ")
                    : viewData.description
                  : "-"}
              </div>
            </div>
          </div>

          <div className="user-detail-info todo-title">
            <div className="contact-info w-50">
              <div className="heading f-14 black bold600">Created Date </div>
              <div className="heading f-14 secondary60 bold400">
                {initialValues?.createdAt
                  ? dayjs(initialValues?.createdAt).format("MM/DD/YYYY")
                  : 0}{" "}
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ViewPathway;
