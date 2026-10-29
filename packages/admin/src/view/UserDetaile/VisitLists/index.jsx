import React from "react";
import DataNotfound from "../../../components/common/DataNotFound";
import VisitCards from "./VisitCards";
import "./style.scss";

const VisitLists = ({ visitLists, requestLists, handleClickModal }) => {
  return (
    <div className="visit-card-container">
      {visitLists?.length > 0 ? (
        visitLists.map((visits) => {
          return (
            <React.Fragment key={visits?._id}>
              <VisitCards
                items={visits}
                requestLists={requestLists}
                handleClickModal={handleClickModal}
              />
            </React.Fragment>
          );
        })
      ) : (
        <DataNotfound />
      )}
    </div>
  );
};

export default VisitLists;
