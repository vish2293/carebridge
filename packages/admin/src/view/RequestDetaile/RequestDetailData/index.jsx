import { useSelector } from "react-redux";
import { viewHistoryIcon } from "../../../assets/icons";

const RequestDetailData = ({ requestDetaile, handleClickModal }) => {
  const { singleRequestLoading } = useSelector((state) => state.request);
  return (
    <div className="user-detail-info">
      <div className="contact-info w-50">
        <div className="heading f-14 black bold600">Category</div>
        <div className="heading f-14 secondary60 bold400">
          {requestDetaile?.request_type?.name}
        </div>
      </div>
      <div className="contact-info w-50">
        <div className="heading f-14 black bold600">Pathway</div>
        <div className="heading f-14 secondary60 bold400">
          {requestDetaile?.pathway?.name}
        </div>
      </div>
      <div className="contact-info w-50">
        <div className="heading f-14 black bold600">Detail</div>
        <div className="heading f-14 secondary60 bold400">
          {requestDetaile?.request_details}
        </div>
      </div>
      <div className="contact-info w-50">
        <div className="heading f-14 black bold600">Urgent</div>
        <div className="heading f-14 secondary60 bold400">
          {requestDetaile?.urgent ? "Yes" : "No"}
        </div>
      </div>
      <div className="contact-info w-50">
        <div className="heading f-14 black bold600">Assing To</div>
        <div className="heading f-14 secondary60 bold400">{`${requestDetaile?.assign_to?.firstName} ${requestDetaile?.assign_to?.lastName}`}</div>
      </div>
      <div className="contact-info w-50">
        <div className="heading f-14 black bold600 request-status">
          Action Step Status{" "}
          <span
            onClick={() =>
              handleClickModal("viewRequestHistory", true, requestDetaile)
            }
          >
            {viewHistoryIcon}
          </span>
        </div>
        <div className="heading f-14 secondary60 bold400">
          {requestDetaile?.request_status}
        </div>
      </div>
      <div className="contact-info w-50">
        <div className="heading f-14 black bold600">Resource Given</div>
        {requestDetaile?.resources_given?.length ? (
          requestDetaile?.resources_given?.map((resource, i) => (
            <div className="heading f-14 secondary60 bold400" key={i}>
              {resource?.resource_name} ({resource?.organization})
            </div>
          ))
        ) : (
          <div className="heading f-14 secondary60 bold400">-</div>
        )}
      </div>
      <div className="contact-info w-50">
        <div className="heading f-14 black bold600">
          Not Worked Resource Given
        </div>
        {requestDetaile?.notWorkedResoruces?.length > 0 ? (
          requestDetaile?.notWorkedResoruces?.map((resource, i) => (
            <div className="heading f-14 secondary60 bold400" key={i}>
              {resource?.resource_name} ({resource?.organization})
            </div>
          ))
        ) : (
          <div className="heading f-14 secondary60 bold400">-</div>
        )}
      </div>
    </div>
  );
};
export default RequestDetailData;
