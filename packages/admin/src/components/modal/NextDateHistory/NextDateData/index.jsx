import React from "react";
import { getFullDateTime } from "../../../../helpers";

const NextDateData = ({ data }) => {
  return (
    <div className="user-detail-info todo-title">
      <div className="contact-info w-50">
        <div className="heading f-14 black bold600">Old Status</div>
        <div className="heading f-14 secondary60 bold400">
          {data?.currentStatus ? data?.currentStatus : "-"}
        </div>
      </div>
      <div className="contact-info w-50">
        <div className="heading f-14 black bold600">New Status </div>
        <div className="heading f-14 secondary60 bold400">
          {data?.newStatus ? data?.newStatus : "-"}
        </div>
      </div>
      <div className="contact-info w-50">
        <div className="heading f-14 black bold600">Status Reason</div>
        <div className="heading f-14 secondary60 bold400">
          {data?.statusReason ? data?.statusReason : "-"}
        </div>
      </div>
      <div className="contact-info w-50">
        <div className="heading f-14 black bold600">Old Due Date</div>
        <div className="heading f-14 secondary60 bold400">
          {data?.currentDueDate ? getFullDateTime(data?.currentDueDate) : "-"}
        </div>
      </div>
      <div className="contact-info w-50">
        <div className="heading f-14 black bold600">New Due Date </div>
        <div className="heading f-14 secondary60 bold400">
          {data?.newDueDate ? getFullDateTime(data?.newDueDate) : "-"}
        </div>
      </div>
      <div className="contact-info w-50">
        <div className="heading f-14 black bold600">Due Date Reason</div>
        <div className="heading f-14 secondary60 bold400">
          {data?.dueDateReason ? data?.dueDateReason : "-"}
        </div>
      </div>
    </div>
  );
};

export default NextDateData;
