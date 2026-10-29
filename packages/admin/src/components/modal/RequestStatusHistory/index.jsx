import { Modal } from "antd";
import { getNumericDate } from "../../../helpers";
import DataNotfound from "../../common/DataNotFound";
import { useEffect, useState } from "react";
import { toggleBodyClass } from "../../../helpers/noScroll";

const RequestStatusHistory = ({ isOpen, modalClose, data, title }) => {
  const [fullReason, setFullReason] = useState({});

  const handleCancel = () => {
    modalClose();
  };

  const handleToggle = (index) => {
    setFullReason({ ...fullReason, [index]: !fullReason[index] });
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
      title={title}
      className="question_model"
      width={734}
    >
      {data?.length > 0 ? (
        data?.map((requestItems, i) => (
          <div key={i} className="update-sec">
            <div className="update-date">
              Changed On ({getNumericDate(requestItems?._id)})
            </div>
            <div className="change-head">
              <div className="old-status">Old Status</div>
              <div className="new-status">New Status</div>
              <div className="reason">Reason</div>
              <div className="modified">Modified By</div>
            </div>
            {requestItems?.history?.map((item, j) => (
              <div key={j} className="user-detail-info change-request">
                <div className="change-request-left" data-title="Old Status :">
                  {item?.oldStatus || item?.currentStatus}
                </div>
                <div
                  style={{ fontSize: "18px", lineHeight: "normal" }}
                  className="arrrow"
                >
                  &rarr;
                </div>
                <div className="change-request-right">
                  <span data-title="New Status :" className="new-status">
                    {item?.newstatus || item?.newStatus}
                  </span>
                  <div className="reason" data-title="Reason :">
                    {item?.statusReason || item?.reason ? (
                      <>
                        {item?.statusReason ? (
                          <>
                            {fullReason[`${i}-${j}`]
                              ? item.statusReason
                              : item.statusReason.length > 15
                              ? `${item.statusReason.slice(0, 15)}...`
                              : item.statusReason}
                            {item.statusReason.length > 15 && (
                              <div
                                className="read-more"
                                onClick={() => handleToggle(`${i}-${j}`)}
                              >
                                {fullReason[`${i}-${j}`]
                                  ? "Read less"
                                  : "Read more"}
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {fullReason[`${i}-${j}`]
                              ? item.reason
                              : item.reason.length > 15
                              ? `${item.reason.slice(0, 15)}...`
                              : item.reason}
                            {item.reason.length > 15 && (
                              <div
                                className="read-more"
                                onClick={() => handleToggle(`${i}-${j}`)}
                              >
                                {fullReason[`${i}-${j}`]
                                  ? "Read less"
                                  : "Read more"}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      "-"
                    )}
                  </div>

                  <div className="modifyby" data-title="Modified By :">
                    {item?.modifier?.length
                      ? `${item?.modifier[0]?.firstName} ${item?.modifier[0]?.lastName}`
                      : item?.modifiedBy?.length
                      ? `${item?.modifiedBy[0]?.firstName} ${item?.modifiedBy[0]?.lastName}`
                      : "System"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <DataNotfound />
      )}
    </Modal>
  );
};

export default RequestStatusHistory;
