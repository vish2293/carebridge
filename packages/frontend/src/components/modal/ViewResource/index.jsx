import { Button, Drawer, Image, Modal, Radio, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import pdf from "../../../assets/images/pdf.svg";
import { downloadIcon } from "../../../assets/icons";
import { toggleBodyClass } from "../../../helpers/noScroll";

const ViewResourceModal = ({
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
    if (modalAction === "viewResource") {
      handleDispatchAction("viewResource", { id: initialValues.key });
    }
  }, [initialValues.key, modalAction]);

  useEffect(() => {
    const cleanup = toggleBodyClass(isOpen);
    return cleanup;
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      title={modalAction === "viewResource" ? "View Resource" : ""}
      confirmLoading={confirmLoading}
      footer={null}
      className="add-attachment"
      width={736}
    >
      {initialValues ? (
        <>
          <div className="user-detail-info todo-title">
            <div className="contact-info w-50">
              <div className="heading f-14 black bold600">Organization </div>
              <div className="heading f-14 secondary60 bold400">
                {viewData?.organization ? viewData?.organization : "-"}{" "}
              </div>
            </div>
            <div className="contact-info w-50">
              <div className="heading f-14 black bold600">Resource</div>
              <div className="heading f-14 secondary60 bold400">
                {viewData?.resource_name ? viewData?.resource_name : "-"}
              </div>
            </div>
          </div>

          <div className="user-detail-info todo-title">
            <div className="contact-info w-50">
              <div className="heading f-14 black bold600">
                Resource Details{" "}
              </div>
              <div className="heading f-14 secondary60 bold400">
                {viewData?.resource_details ? viewData?.resource_details : "-"}{" "}
              </div>
            </div>
            <div className="contact-info w-50">
              <div className="heading f-14 black bold600">Category</div>
              <div className="heading f-14 secondary60 bold400">
                {initialValues?.category ? initialValues?.category : "-"}
              </div>
            </div>
          </div>

          <div className="user-detail-info todo-title">
            <div className="contact-info w-50">
              <div className="heading f-14 black bold600">Website</div>
              <div className="heading f-14 secondary60 bold400">
                {viewData?.website ? (
                  <a
                    href={viewData.website}
                    target="_blank"
                    style={{ color: "blue", textDecoration: "underline" }}
                  >
                    {viewData.website}
                  </a>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div className="contact-info w-50">
              <div className="heading f-14 black bold600">Email Address</div>
              <div className="heading f-14 secondary60 bold400">
                {viewData?.email ? (
                  <a
                    href={`mailto:${viewData.email}`}
                    style={{ color: "blue", textDecoration: "underline" }}
                  >
                    {viewData.email}
                  </a>
                ) : (
                  "-"
                )}
              </div>
            </div>
          </div>

          <div className="user-detail-info todo-title">
            <div className="contact-info w-50">
              <div className="heading f-14 black bold600">Eligibility </div>
              <div className="heading f-14 secondary60 bold400">
                {viewData?.eligibility ? viewData?.eligibility : "-"}{" "}
              </div>
            </div>
            <div className="contact-info w-50">
              <div className="heading f-14 black bold600">Phone No.</div>
              <div className="heading f-14 secondary60 bold400">
                {viewData?.phone ? viewData?.phone : "-"}
              </div>
            </div>
          </div>

          <div className="user-detail-info todo-title">
            <div className="contact-info w-50">
              <div className="heading f-14 black bold600">
                Used Resource Count{" "}
              </div>
              <div className="heading f-14 secondary60 bold400">
                {initialValues?.usageCount ? initialValues?.usageCount : 0}{" "}
              </div>
            </div>
            <div className="contact-info w-50">
              <div className="heading f-14 black bold600">
                Non Worked Time Count
              </div>
              <div className="heading f-14 secondary60 bold400">
                {initialValues?.nonWorkedCount
                  ? initialValues?.nonWorkedCount
                  : 0}
              </div>
            </div>
          </div>

          <div className="user-detail-info todo-title">
            <div className="contact-info w-100">
              <div className="heading f-14 black bold600">
                Attachments Name{" "}
              </div>
              <div className="heading f-14 secondary60 bold400">
                {viewData?.attachments?.name
                  ? viewData?.attachments?.name
                  : "-"}
              </div>
            </div>
          </div>

          <div
            className="heading f-14 black bold600"
            style={{ marginBottom: "10px" }}
          >
            Attachments
          </div>
          <div className="modal-img">
            {viewData?.attachments?.files?.map((file, index) => (
              <div key={index} className="attachment-modal-img">
                {file.endsWith(".png") ||
                file.endsWith(".jpg") ||
                file.endsWith(".jpeg") ? (
                  <>
                    <div className="download-delete">
                      <a href={file} target="_blank">
                        <span>{downloadIcon}</span>
                      </a>
                    </div>
                    <Image src={file} alt={`Attachment ${index + 1}`} />
                  </>
                ) : file.endsWith(".mp4") || file.endsWith(".mov") ? (
                  <>
                    <div className="download-delete">
                      <a href={file} target="_blank">
                        <span>{downloadIcon}</span>
                      </a>
                    </div>
                    <video controls>
                      <source src={file} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </>
                ) : file.endsWith(".pdf") ? (
                  <a href={file} rel="noopener noreferrer">
                    <div>
                      <div className="download-delete">
                        <a href={file} target="_blank">
                          <span>{downloadIcon}</span>
                        </a>
                      </div>
                      <img src={pdf} alt="PDF Icon" />
                    </div>
                  </a>
                ) : (
                  <span>Unsupported format</span>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <Spin />
      )}
    </Modal>
  );
};

export default ViewResourceModal;
