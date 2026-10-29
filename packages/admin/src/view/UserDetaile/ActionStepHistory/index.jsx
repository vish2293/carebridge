import { Collapse, Modal, Tabs } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import DataNotfound from "../../../components/common/DataNotFound";

export const ActionStepHistory = ({ isOpen, modalClose, data, title }) => {
  const [mode, setMode] = useState("top");
  const [requestData, setRequestData] = useState([]);

  const GetvisitItemsLabel = ({ items }) => {
    return (
      <div className="visit-modal-header">
        <div className="visit-head">
          Action Step Time ({dayjs(items?.createdAt).format("hh:mm A")})
        </div>
        <div>
          <span>Created By : </span>
          <span>{items?.createdBy ? items?.createdBy?.firstName : "---"}</span>
        </div>
        <div>
          <span> Modified By : </span>
          <span>
            {items?.modifiedBy ? items?.modifiedBy?.firstName : "---"}
          </span>
        </div>
      </div>
    );
  };

  const getVisitItems = (data) => {
    return data?.map((items, i) => {
      return {
        key: i + 1,
        label: <GetvisitItemsLabel items={items} />,
        children: (
          <>
            <div className="user-detail-info todo-title">
              <div className="contact-info w-50">
                <div className="heading f-14 black bold600">Category </div>
                <div className="heading f-14 secondary60 bold400">
                  {items?.request_type ? items?.request_type.name : "-"}{" "}
                </div>
              </div>
              <div className="contact-info w-50">
                <div className="heading f-14 black bold600">Pathway </div>
                <div className="heading f-14 secondary60 bold400">
                  {items?.pathway ? items?.pathway.name : "-"}{" "}
                </div>
              </div>
            </div>

            <div className="user-detail-info todo-title">
              <div className="contact-info w-50">
                <div className="heading f-14 black bold600">Details</div>
                <div className="heading f-14 secondary60 bold400">
                  {items?.request_details ? items?.request_details : "-"}
                </div>
              </div>
              <div className="contact-info w-50">
                <div className="heading f-14 black bold600">Urgent </div>
                <div className="heading f-14 secondary60 bold400">
                  {items?.urgent ? "Yes" : "No"}{" "}
                </div>
              </div>
            </div>

            <div className="user-detail-info todo-title">
              <div className="contact-info w-50">
                <div className="heading f-14 black bold600">Assign To</div>
                <div className="heading f-14 secondary60 bold400">{`${items?.assign_to?.firstName} ${items?.assign_to?.lastName}`}</div>
              </div>
              <div className="contact-info w-50">
                <div className="heading f-14 black bold600">
                  Action Step Status{" "}
                </div>
                <div className="heading f-14 secondary60 bold400">
                  {items?.request_status}{" "}
                </div>
              </div>
            </div>
            <div className="user-detail-info todo-title">
              <div className="contact-info w-50">
                <div className="heading f-14 black bold600">Resource Given</div>
                {items?.resources_given?.length ? (
                  items?.resources_given?.map((resource, i) => (
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
                {items?.notWorkedResoruces?.length > 0 ? (
                  items?.notWorkedResoruces?.map((resource, i) => (
                    <div className="heading f-14 secondary60 bold400" key={i}>
                      {resource?.resource_name} ({resource?.organization})
                    </div>
                  ))
                ) : (
                  <div className="heading f-14 secondary60 bold400">-</div>
                )}
              </div>
            </div>
          </>
        ),
      };
    });
  };

  const handleCancel = () => {
    modalClose();
  };

  useEffect(() => {
    let tempArray = [];
    data?.forEach((dateItems, i) => {
      let obj = {
        key: i + 1,
        label: dateItems?.date,
        children: (
          <Collapse
            defaultActiveKey={["1"]}
            items={getVisitItems(dateItems?.data)}
          />
        ),
      };
      tempArray?.push({ ...obj });
    });
    setRequestData(tempArray);
  }, [data]);

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={handleCancel}
        footer={null}
        title={title}
        className="question_model"
        width={734}
      >
        {
          // visitHistoryLoader ? <Spin spinning /> :
          data?.length > 0 ? (
            <Tabs
              defaultActiveKey={["1"]}
              items={requestData}
              type="card"
              tabPosition={mode}
            />
          ) : (
            <DataNotfound />
          )
        }
      </Modal>
    </>
  );
};
