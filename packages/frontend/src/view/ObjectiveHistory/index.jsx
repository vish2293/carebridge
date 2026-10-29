import { Modal } from "antd";
import DataNotfound from "../../components/common/DataNotFound";
import Loader from "../../components/common/Loader";
import { getNumericDate } from "../../helpers";

const ObjectiveHistory = ({ isOpen, modalClose, data, loading }) => {

    const handleCancel = () => {
        modalClose();
    };

    return (
        <Modal title="History Of Non Medical Drivers Of Health" width={734} open={isOpen} onCancel={handleCancel} footer={null} className="question_model">
            {loading ? (
                <Loader className={'page-loader'} />
            ) : (
                <>
                    {data?.length > 0 ? (
                        data?.map((items, i) => (
                            <div key={i} className="update-sec">
                                <div className="update-date"> Updated on ({getNumericDate(items?.date)})</div>
                                <div className="security-head">
                                    <div className="security-left">Security Type</div>
                                    <div className="security-right">
                                        Status History
                                    </div>
                                    <div className="modified">
                                        Modified By
                                    </div>
                                </div>
                                {items?.data?.map((item, j) => (
                                    <div key={j} className="user-detail-info">
                                        <div className="heading black60 f-16 bold400  history-left" data-title="Security Type :">{item.labelData?.label}</div>
                                        <div className=" history-right">
                                            <div className="stutus-update" data-title="Status History :">
                                                <div className={`${item?.labelData?.fromValue === "N/A" ? "NA" : item?.labelData?.fromValue}`} >{item?.labelData?.fromValue}</div>
                                                <span style={{ fontSize: "18px", lineHeight: "normal", maxWidth: "33%" }}>&rarr;</span>
                                                <span className={`${item?.labelData?.value === "N/A" ? "NA" : item?.labelData?.value}`}>{item?.labelData?.value}</span>
                                            </div>
                                            <div className="modifyby" data-title="Modified By :">{item?.modifiedBy ? item?.modifiedBy : "System"}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <DataNotfound />
                    )}
                </>
            )}
        </Modal>
    );
};

export default ObjectiveHistory;
