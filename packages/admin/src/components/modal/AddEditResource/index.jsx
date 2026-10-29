import { Button, Form, Image, Input, Modal, Select, Spin, Upload } from "antd";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import pdf from "../../../assets/images/pdf.svg";
import {
  emailValidation,
  phoneValidation,
  resourceEmailValidation,
  webSiteUrlValidation,
} from "../../../helpers/formValidation";
import { deleteIcon, downloadIcon } from "../../../assets/icons";
import { toggleBodyClass } from "../../../helpers/noScroll";

const AddEditResource = ({
  isOpen,
  handleDispatchAction,
  modalClose,
  loading,
  initialValues,
  modalAction,
  confirmLoading,
}) => {
  const { resourceCategoryOptions } = useSelector((state) => state?.resource);
  const initalPreviewContent = { url: "", type: "", subType: "" };
  const [previewContent, setPreviewContent] = useState(initalPreviewContent);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [uploadFilesList, setUploadFilesList] = useState([]);
  const [form] = Form.useForm();
  const inputRef = useRef(null);

  const handleCancel = () => {
    modalClose();
    form.resetFields();
    setImagePreview([]);
    setUploadFilesList([]);
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initialValues, form]);

  useEffect(() => {
    if (initialValues) {
      let files = [];
      if (initialValues?.attachment_files?.props?.url?.length > 0) {
        files = [...initialValues?.attachment_files?.props?.url];
        setImagePreview(initialValues.attachment_files.props.url);
      }
      form.setFieldsValue({
        ...initialValues,
        category: initialValues?.category?.[0]?.value
          ? initialValues?.category
          : null,
        files,
      });
    }
  }, [initialValues, form]);

  const handleChange = ({ fileList }) => {
    const files = fileList.length ? [...fileList, ...imagePreview] : [];
    form.setFieldsValue({ files });
    setUploadFilesList(fileList);
  };

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
    const [fileType, fileSubType] = file.type.split("/");

    setPreviewContent({
      uid: file.uid,
      url: file.url || file.preview,
      type: fileType,
      subType: fileSubType,
    });

    if (fileType === "application" && fileSubType === "pdf") {
      const pdfBlob = await fetch(file.preview).then((res) => res.blob());
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const pdfWindow = window.open();
      pdfWindow.location.href = pdfUrl;
    } else {
      setPreviewOpen(true);
    }
  };

  const handleImgDelete = (index) => {
    const updatedImagePreview = [...imagePreview];
    updatedImagePreview.splice(index, 1);
    setImagePreview(updatedImagePreview);
    form.setFieldsValue({
      files: [...updatedImagePreview, ...uploadFilesList],
    });
  };

  useEffect(() => {
    if (imagePreview.length === 0) {
      setPreviewOpen(false);
      setPreviewContent({ url: "", type: "", subType: "" });
    }
  }, [imagePreview]);

  useEffect(() => {
    if (Object.keys(previewContent).length && previewContent.url !== "") {
      const a = uploadFilesList.find((a) => a?.uid === previewContent?.uid);
      if (!a) {
        setPreviewContent(initalPreviewContent);
      }
    }
  }, [uploadFilesList]);

  const renderAttachmentPreview = (file, index) => {
    const fileType = file.split(".").pop();
    const isImage = ["png", "jpg", "jpeg"].includes(fileType);
    const isVideo = ["mp4", "mov"].includes(fileType);
    const isPdf = fileType === "pdf";

    const previewStyles = {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    };

    return (
      <div key={index} className="attachment-modal-img">
        {isImage && (
          <>
            <div className="download-delete">
              <a href={file} target="_blank">
                <span>{downloadIcon}</span>
              </a>
              <span onClick={() => handleImgDelete(index)}>{deleteIcon}</span>
            </div>
            <Image src={file} alt={`${index + 1}`} />
          </>
        )}
        {isVideo && (
          <>
            <div className="download-delete">
              <a href={file} target="_blank">
                <span>{downloadIcon}</span>
              </a>
              <span onClick={() => handleImgDelete(index)}>{deleteIcon}</span>
            </div>
            <video controls style={previewStyles}>
              <source src={file} type="video/mp4" />
            </video>
          </>
        )}
        {isPdf && (
          <>
            <div className="download-delete">
              <a href={file} target="_blank">
                <span>{downloadIcon}</span>
              </a>
              <span onClick={() => handleImgDelete(index)}>{deleteIcon}</span>
            </div>
            <a
              href={file}
              rel="noopener noreferrer"
              style={{ display: "block", width: "100%", height: "100%" }}
            >
              <div
                style={{
                  ...previewStyles,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "4px",
                }}
              >
                <img src={pdf} alt="PDF Icon" />
              </div>
            </a>
          </>
        )}
        {!isImage && !isVideo && !isPdf && <span>Unsupported format</span>}
      </div>
    );
  };

  const handleSubmit = () => {
    if (modalAction === "editResource" && imagePreview.length === 0) {
      message.error("No files uploaded or files in attachments preview.");
      return;
    }
  };

  const noLeadingTrailingSpaces = (_, value) => {
    if (value && value.trim() !== value) {
      return Promise.reject(new Error("No leading or trailing spaces allowed"));
    }
    return Promise.resolve();
  };

  useEffect(() => {
    const cleanup = toggleBodyClass(isOpen);
    return cleanup;
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      title={modalAction === "addResource" ? "Add Resource" : "Edit Resource"}
      confirmLoading={confirmLoading}
      footer={null}
      className="add-attachment"
      width={736}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={() => {
          handleDispatchAction(modalAction, form);
          setTimeout(() => {
            form.resetFields();
          }, 1000);
        }}
      >
        <Form.Item
          label="Organization Name"
          name="organization"
          rules={[
            { required: true, message: "Organization name is required" },
            { validator: noLeadingTrailingSpaces },
          ]}
        >
          <Input placeholder="Enter organization name" ref={inputRef} />
        </Form.Item>
        <Form.Item
          label="Resource Name"
          name="resource_name"
          rules={[
            { required: true, message: "Resource name is required" },
            { validator: noLeadingTrailingSpaces },
          ]}
        >
          <Input placeholder="Enter resource name" />
        </Form.Item>
        <Form.Item
          label="Resource Details"
          name="resource_details"
          rules={[{ validator: noLeadingTrailingSpaces }]}
        >
          <Input.TextArea placeholder="Enter resource details" />
        </Form.Item>
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Category is required" }]}
        >
          <Select
            placeholder="Select category"
            options={resourceCategoryOptions}
          />
        </Form.Item>
        <Form.Item
          label="Website"
          name="website"
          rules={[{ required: true, validator: webSiteUrlValidation }]}
        >
          <Input placeholder="Enter website" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, validator: emailValidation }]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>
        <Form.Item
          label="Phone No."
          name="phone"
          rules={[{ required: true, validator: phoneValidation }]}
        >
          <Input placeholder="Enter Phone No." />
        </Form.Item>
        <Form.Item
          label="Eligibility"
          name="eligibility"
          rules={[
            { required: true, message: "Eligibility is required" },
            { validator: noLeadingTrailingSpaces },
          ]}
        >
          <Input placeholder="Enter eligibility" />
        </Form.Item>
        <Form.Item
          label="Attachment Name"
          name="attachment_name"
          rules={[
            { required: true, message: "Attachment name is required" },
            { validator: noLeadingTrailingSpaces },
          ]}
        >
          <Input placeholder="Enter file name" />
        </Form.Item>
        <Form.Item
          label="Upload"
          name="files"
          rules={[
            {
              required:
                modalAction === "addResource" || imagePreview.length === 0,
              message: "Attachment files are required",
            },
          ]}
        >
          <Upload
            multiple
            accept="video/mp4,video/mov,image/jpeg,image/jpg,image/png,image/avif,image/avi,application/pdf,audio/mpeg,audio/mp3"
            onChange={handleChange}
            onPreview={handlePreview}
            beforeUpload={() => false}
          >
            <Button>Upload</Button>
          </Upload>
        </Form.Item>
        {modalAction === "editResource" && imagePreview.length > 0 && (
          <Form.Item label="Attachments">
            <div className="modal-img">
              {imagePreview.map(renderAttachmentPreview)}
            </div>
          </Form.Item>
        )}
        {previewContent.url && previewContent.type === "image" && (
          <Image
            preview={{
              visible: previewOpen,
              onVisibleChange: setPreviewOpen,
              afterOpenChange: (visible) =>
                !visible &&
                setPreviewContent({ url: "", type: "", subType: "" }),
            }}
            src={previewContent.url}
          />
        )}
        {previewContent.url && previewContent.type === "video" && (
          <video
            controls
            style={{
              width: "100%",
              height: "500px",
              display: previewOpen ? "block" : "none",
            }}
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
            />
          )}
        <div className="cancel-yes">
          <Spin spinning={loading}>
            <Form.Item>
              <Button
                type="primary"
                className="yellow-btn"
                htmlType="submit"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Form.Item>
          </Spin>
          <Form.Item>
            <Button onClick={handleCancel}>Cancel</Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AddEditResource;
