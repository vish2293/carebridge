import { Button } from "antd";
import { useSelector } from "react-redux";
import { viewHistoryIcon } from "../../../../assets/icons";
import { getNumericDate, getVisitRequestList } from "../../../../helpers";

const VisitCards = ({ items, requestLists, handleClickModal }) => {
  const { loggedInUser } = useSelector((state) => state.user);

  return (
    <div className="visit-cards">
      <div className="visit-card-left">
        <div className="heading f-14 bold600 black">
          {getNumericDate(items?.createdAt)}
        </div>
        <div className="heading f-14 secondary60 bold400">
          {items?.clientStory}
        </div>
        {loggedInUser?.role !== "CHW" && (
          <div
            onClick={() => handleClickModal("visitHistory", true, items)}
            className="view"
          >
            {viewHistoryIcon} View History
          </div>
        )}
      </div>
      <div className="visit-card-right">
        <div className="heading f-14 bold600 black">{items?.visitType}</div>
        <div className="heading f-14 secondary60 bold400">
          {/* {getVisitRequestList(requestLists, items?._id).length} Action Steps */}
          {requestLists} Action Steps
        </div>
        <div className="accept-reject">
          <Button
            type="primary"
            onClick={() => handleClickModal("viewVisit", true, items)}
            className="view-btn yellow-btn"
          >
            View
          </Button>
        </div>
      </div>
      <div className="visit-card-bottom">
        <div>
          <span>Created By : </span>
          <span>
            {items?.createdBy
              ? `${items?.createdBy?.firstName} ${items?.createdBy?.lastName}`
              : "---"}
          </span>
        </div>
        <div>
          <span>Modified By : </span>
          <span>
            {items?.modifiedBy
              ? `${items?.modifiedBy?.firstName} ${items?.modifiedBy?.lastName}`
              : "---"}
          </span>
        </div>
      </div>
    </div>
  );
};
export default VisitCards;
