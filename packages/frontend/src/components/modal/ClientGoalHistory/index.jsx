import { Modal } from "antd";
import DataNotfound from "../../common/DataNotFound";
import { getNumericDate } from "../../../helpers";
import { useEffect, useState } from "react";
import { toggleBodyClass } from "../../../helpers/noScroll";

const ClientGoalHistory = ({ isOpen, onClose, historyLists }) => {
  const [fullFromgoal, setFullFomGoal] = useState({});
  const [fullTogoal, setToFomGoal] = useState({});

  const handleCancel = () => {
    onClose();
  };

  const handleToggle = (toggle, index) => {
    if (toggle === "from") {
      setFullFomGoal({ ...fullFromgoal, [index]: !fullFromgoal[index] });
    } else if (toggle === "to") {
      setToFomGoal({ ...fullTogoal, [index]: !fullTogoal[index] });
    }
  };

  useEffect(() => {
    const cleanup = toggleBodyClass(isOpen);
    return cleanup;
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      title={"Client Goal History"}
      footer={null}
      className="question_model"
      width={734}
    >
      <div>
        {historyLists?.length > 0 ? (
          historyLists?.map((historyItems, i) => {
            return (
              <div key={i} className="update-sec">
                <div className="update-date">
                  Updated On ({getNumericDate(historyItems?._id)})
                </div>
                <div className="security-head">
                  <div className="security-left">From</div>
                  <div className="security-right">To</div>
                  <div className="modified">Modified By</div>
                </div>
                {historyItems?.history?.map((item, index) => {
                  return (
                    <div key={index} className="user-detail-info goal-des">
                      <div className="heading black60 f-16 bold400 goal-des-left">
                        <div className="des">
                          <div data-tilte="From : ">
                            {item?.from_client_goal
                              ? fullFromgoal[
                                  `${index} - ${item?.from_client_goal}`
                                ]
                                ? item?.from_client_goal
                                : item?.from_client_goal.length > 20
                                ? `${item?.from_client_goal.slice(0, 20)}...`
                                : item?.from_client_goal
                              : "N/A"}
                            {item?.from_client_goal?.length > 20 && (
                              <span
                                onClick={() =>
                                  handleToggle(
                                    "from",
                                    `${index} - ${item?.from_client_goal}`
                                  )
                                }
                                className="read-more"
                              >
                                {fullFromgoal[
                                  `${index} - ${item?.from_client_goal}`
                                ]
                                  ? "Read less"
                                  : "Read more"}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ fontSize: "20px", lineHeight: "normal" }}>
                          &rarr;
                        </div>
                      </div>
                      <div className="goal-des-right">
                        <div className="to-left">
                          <div data-tilte="To : ">
                            {fullTogoal[`${index} - ${item?.to_client_goal}`]
                              ? item?.to_client_goal
                              : item?.to_client_goal?.length > 20
                              ? `${item?.to_client_goal?.slice(0, 20)}...`
                              : item?.to_client_goal}
                            {item?.to_client_goal?.length > 20 && (
                              <span
                                onClick={() =>
                                  handleToggle(
                                    "to",
                                    `${index} - ${item?.to_client_goal}`
                                  )
                                }
                                className="read-more"
                              >
                                {fullTogoal[
                                  `${index} - ${item?.to_client_goal}`
                                ]
                                  ? "Read less"
                                  : "Read more"}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="modifyby" data-tilte="Modified By : ">
                          {" "}
                          <span>
                            {item?.modifiedBy?.length
                              ? `${item?.modifiedBy[0]?.firstName} ${item?.modifiedBy[0]?.lastName}`
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div></div>
              </div>
            );
          })
        ) : (
          <DataNotfound />
        )}
      </div>
    </Modal>
  );
};
export default ClientGoalHistory;
