/* eslint-disable react/prop-types */
import { Button } from "antd";
import { getNumericDate } from "../../../../helpers";
import { viewHistoryIcon } from "../../../../assets/icons";
import { ActionStepHistory } from "../../ActionStepHistory";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { getActionStepHistory } from "../../../../redux/actions/request";

const RequestCard = ({ item, index, handleClickModal }) => {
  const { actionStepHistory } = useSelector((state) => state.request);
  const dispatch = useDispatch();
  const [modalAction, setModalAction] = useState("default");

  const handleClickModals = (action, isOpen, data) => {
    switch (action) {
      case "viewActionStepHistory":
        setModalAction(action);
        dispatch(getActionStepHistory({ requestId: data?._id }));
        break;
      default:
        break;
    }
  };

  const modalClose = () => {
    setModalAction("default");
  };

  return (
    <>
      <div className="tab-content border">
        <div className="tab-top">
          <div className="request-head">
            # Action Step {index + 1}
            <span
              style={{
                margin: "auto",
                marginLeft: "12px",
                marginTop: "5px",
                cursor: "pointer",
              }}
              onClick={() =>
                handleClickModals("viewActionStepHistory", true, item)
              }
            >
              {viewHistoryIcon}
            </span>
          </div>
          <div>
            <span className={`task-${item?.request_status}`}>
              {item?.request_status}
            </span>
          </div>
        </div>
        <div
          className="user_contact_info"
          style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr" }}
        >
          <div className="contact-info ">
            <div className="heading f-14 secondary60 bold400">Pathway </div>
            <div className="heading f-14  black bold600">
              {item?.pathway?.name ? item?.pathway?.name : "-"}{" "}
            </div>
          </div>
          <div className="contact-info ">
            <div className="heading f-14 secondary60 bold400">
              Action Step Type{" "}
            </div>
            <div className="heading f-14  black bold600">
              {item?.request_type?.name ? item?.request_type?.name : "="}{" "}
            </div>
          </div>
          <div className="contact-info">
            <div className="heading f-14 secondary60 bold400">
              Action Step Details
            </div>
            <div className="heading f-14  black bold600">
              {item?.request_details ? item?.request_details : "-"}
            </div>
          </div>
          <div className="contact-info">
            <div className="heading f-14 secondary60 bold400">
              Action Step date
            </div>
            <div className="heading f-14  black bold600">
              {getNumericDate(item?.createdAt)}
            </div>
          </div>
        </div>
        {item?.request_status !== "Completed" && (
          <div className="cancel-save">
            <Button
              className="btn"
              onClick={() => handleClickModal("viewRequest", true, item)}
            >
              View
            </Button>
          </div>
        )}
      </div>
      <ActionStepHistory
        isOpen={modalAction === "viewActionStepHistory"}
        title="Action Step History"
        modalClose={modalClose}
        data={actionStepHistory}
      />
    </>
  );
};

export default RequestCard;
