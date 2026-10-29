import { Button, Form, Image, Input, Modal, Spin, Upload } from "antd";
import { useEffect, useState } from "react";
import "./style.scss";
import { toggleBodyClass } from "../../../helpers/noScroll";

const AddAndEditAttachmentModal = ({
  isOpen,
  onClose,
  handleDispatchAction,
  modalAction,
  uploadFileLoading,
}) => {
  const [previewContent, setPreviewContent] = useState({ url: "", type: "" });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const handleCancel = () => {
    onClose();
    form.resetFields();
    setPreviewContent({ url: "", type: "" });
  };

  const [form] = Form.useForm();
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    const fileType = file.type.split("/")[0]; // 'image', 'video', or 'application' for PDFs
    const fileSubType = file.type.split("/")[1]; // Used to identify 'pdf'
    setPreviewContent({
      url: file.url || file.preview,
      type: fileType,
      subType: fileSubType,
    });

    if (fileType === "application" && fileSubType === "pdf") {
      const pdfWindow = window.open("");
      pdfWindow.document.write(
        `<iframe width='100%' height='100%' src='${
          file.url || file.preview
        }'></iframe>`
      );
    } else {
      setPreviewOpen(true);
    }
  };

  const handleChange = (info) => {
    if (!info?.fileList.length) {
      form.setFieldValue("files", "");
    }
  };

  useEffect(() => {
    const cleanup = toggleBodyClass(isOpen);
    return cleanup;
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      className="add-attachment"
      confirmLoading={uploadFileLoading}
      title="Add Attachment"
      loading={true}
    >
      <Spin spinning={uploadFileLoading}>
        <Form
          layout="vertical"
          className="asddddd"
          form={form}
          onFinish={() => handleDispatchAction(modalAction, form)}
        >
          <Form.Item
            label="Name"
            name={"name"}
            rules={[{ required: true, message: "File name is required" }]}
          >
            <Input placeholder="Enter file name" />
          </Form.Item>
          <Form.Item
            label="Upload"
            name={"files"}
            rules={[{ required: true, message: "Upload file is required" }]}
          >
            <Upload
              name="files"
              multiple={true}
              accept="video/mp4,video/mov,image/jpeg,image/jpg,image/png,image/avif,image/avi,application/pdf,audio/mpeg,audio/mp3"
              onChange={handleChange}
              onPreview={handlePreview}
              beforeUpload={() => false}
            >
              <Button>Upload</Button>
            </Upload>
          </Form.Item>

          {previewContent.url && previewContent.type === "image" && (
            <Image
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) =>
                  !visible && setPreviewContent({ url: "", type: "" }),
              }}
              src={previewContent.url}
            />
          )}
          {previewContent.url && previewContent.type === "video" && (
            <video
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) =>
                  !visible && setPreviewContent({ url: "", type: "" }),
              }}
              controls
              src={previewContent.url}
            />
          )}
          {previewContent.url &&
            previewContent.type === "application" &&
            previewContent.subType === "pdf" && (
              <iframe
                src={previewContent.url}
                style={{
                  width: "100%",
                  height: "500px",
                  display: previewOpen ? "block" : "none",
                }}
              ></iframe>
            )}
          <div className="cancel-yes">
            <Form.Item>
              <Button
                type="primary"
                className="yellow-btn"
                htmlType="submit"
                disabled={uploadFileLoading}
              >
                Submit
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={handleCancel}>Cancel</Button>
            </Form.Item>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddAndEditAttachmentModal;
