import { useSelector } from "react-redux";
import { urgentFlag, viewHistoryIcon } from "../../../../assets/icons";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { getActionStepHistory } from "../../../../redux/actions/request";
import { ActionStepHistory } from "../../../UserDetaile/ActionStepHistory";

const VisitRequestCard = ({ item, index, handleClickModal }) => {
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
          {item?.urgent && (
            <div>
              <span className={`tag ${item?.urgent}`}>{urgentFlag} Urgent</span>
            </div>
          )}
        </div>
        <div
          className="user_contact_info"
          style={{ display: "grid", gridTemplateColumns: "1.5fr 1.4fr" }}
        >
          <div className="contact-info">
            <div className="heading f-14 black bold500">Pathway</div>
            <div className="heading f-14 secondary60 bold400">
              {item?.pathway?.name}
            </div>
          </div>
          <div className="contact-info ">
            <div className="heading f-14 black bold500 request-status">
              {" "}
              Status{" "}
              <span
                onClick={() =>
                  handleClickModal("viewRequestHistory", true, item)
                }
              >
                {viewHistoryIcon}
              </span>
            </div>
            <div className="heading f-14 secondary60 bold400">
              {item?.request_status}{" "}
            </div>
          </div>
          <div className="contact-info">
            <div className="heading f-14 black bold500">Category</div>
            <div className="heading f-14 secondary60 bold400">
              {item?.request_type?.name}
            </div>
          </div>
          <div className="contact-info">
            <div className="heading f-14 black bold500">Action Step Detail</div>
            <div className="heading f-14 secondary60 bold400">
              {item?.request_details}
            </div>
          </div>
          <div className="contact-info">
            <div className="heading f-14 black bold500">Resource Given</div>
            {item?.resources_given?.length ? (
              item?.resources_given?.map((resource, i) => (
                <div className="heading f-14 secondary60 bold400" key={i}>
                  {resource?.resource_name} ({resource?.organization})
                </div>
              ))
            ) : (
              <div className="heading f-14 secondary60 bold400">-</div>
            )}
          </div>
          <div className="contact-info">
            <div className="heading f-14 black bold500">
              Not Worked Resource Given
            </div>
            {item?.notWorkedResoruces?.length > 0 ? (
              item?.notWorkedResoruces?.map((resource, i) => (
                <div className="heading f-14 secondary60 bold400" key={i}>
                  {resource?.resource_name} ({resource?.organization})
                </div>
              ))
            ) : (
              <div className="heading f-14 secondary60 bold400">-</div>
            )}
          </div>
        </div>
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
export default VisitRequestCard;
