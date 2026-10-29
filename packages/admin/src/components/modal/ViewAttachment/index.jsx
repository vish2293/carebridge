import { Modal } from "antd";
import { getFileType } from "../../common/FileViewerComponent";
import { useEffect } from "react";
import { toggleBodyClass } from "../../../helpers/noScroll";

const ViewAttachment = ({
  isOpen,
  setIsOpen,
  modaAction,
  handleClickModal,
  data,
}) => {
  const handleCancel = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const cleanup = toggleBodyClass(isOpen);
    return cleanup;
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      centered={true}
      footer={null}
      className="attachment-modal"
      title="View Attachments"
      width="734px"
    >
      <div className="modal-img">
        {getFileType(data?.url, "true", true, modaAction, handleClickModal)}
      </div>
    </Modal>
  );
};

export default ViewAttachment;
