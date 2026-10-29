import { Collapse, Modal, Spin, Tabs } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import DataNotfound from "../../../components/common/DataNotFound";
import NextDateData from "./NextDateData";
import { toggleBodyClass } from "../../../helpers/noScroll";

const NextDateHistory = ({
  isOpen,
  modalClose,
  data,
  modalAction,
  nextDateHistoryLoading,
}) => {
  const [nextData, setNextData] = useState([]);

  const handleCancel = () => {
    modalClose();
  };

  const GetvisitItemsLabel = ({ items }) => {
    return (
      <div className="visit-modal-header">
        <div className="visit-head">
          Updated on ({dayjs(items?.createdAt).format("hh:mm A")})
        </div>
        {/* <div>
                    <span>Created By : </span>
                    <span>{items?.createdBy ? items?.createdBy?.firstName : "---"}</span>
                </div> */}
        <div>
          <span> Modified By : </span>
          <span>
            {items?.modifiedBy?.length
              ? `${items?.modifiedBy[0]?.firstName} ${items?.modifiedBy[0]?.lastName}`
              : "---"}
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
        children: <NextDateData data={items} modalAction={modalAction} />,
      };
    });
  };

  useEffect(() => {
    let tempArray = [];
    data?.forEach((dateItems, i) => {
      let obj = {
        key: i + 1,
        label: dateItems?._id,
        children: (
          <Collapse
            defaultActiveKey={["1"]}
            items={getVisitItems(dateItems?.history)}
          />
        ),
      };
      tempArray?.push({ ...obj });
    });
    setNextData(tempArray);
  }, [data]);

  useEffect(() => {
    const cleanup = toggleBodyClass(isOpen);
    return cleanup;
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      centered={true}
      title={"Next Important Date History"}
      footer={null}
      className="question_model"
      width={680}
    >
      {nextDateHistoryLoading ? (
        <Spin spinning />
      ) : data?.length > 0 ? (
        <Tabs defaultActiveKey={["1"]} items={nextData} type="card" />
      ) : (
        <DataNotfound />
      )}
    </Modal>
  );
};
export default NextDateHistory;
