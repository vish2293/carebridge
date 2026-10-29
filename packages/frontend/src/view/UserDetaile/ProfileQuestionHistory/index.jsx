import { Modal, Spin } from "antd"
import dayjs from "dayjs"
import { getVisitDate } from "../../../helpers"
import DataNotfound from "../../../components/common/DataNotFound"

const ProfileQuestionHistory = ({ isOpen, modalClose, data, porfileHistoryLoading, profileQuestionBy }) => {

    const handleCancel = () => {
        modalClose();
    }

    const Title = ({ title, createDate }) => {
        return (
            <div className="modal-header">
                <span>{title}</span>
                {createDate && <span >{getVisitDate(createDate)}</span>}
            </div>
        )
    }
    return (
        <Modal
            open={isOpen}
            onCancel={handleCancel}
            title={<Title title={"Profile Question History - "} createDate={data?.createdAt} />}
            footer={null}
            className="question_model"
        >
            {
                porfileHistoryLoading ? <Spin /> :
                    data ?
                        <>
                            <div className="user-detail-info todo-title">
                                <div className='contact-info w-50'>
                                    <div className='heading black f-14 bold600'>Answer Given By</div>
                                    <div className='heading secondary60 f-14 bold400'>{data.submittedBy.firstName ? `${data.submittedBy.firstName} ${data.submittedBy.lastName}` : "-"}</div>
                                </div>
                                <div className='contact-info w-50'>
                                    <div className='heading black f-14 bold600'>Last Modified By</div>
                                    <div className='heading secondary60 f-14 bold400'>{data?.modifiedBy?.firstName ? `${data?.modifiedBy?.firstName} ${data?.modifiedBy?.lastName}` : "-"}</div>
                                </div>
                            </div>

                            {data?.profileQuestion?.map((item, i) => {
                                const values = item?.question?.questionML?.map((question) => question?.value);
                                const isDate = dayjs(item?.answer[0]?.answer).isValid();
                                const combinedTranslation = isDate ? getVisitDate(item?.answer[0]?.answer) : item?.answer?.map((ans) => ans?.answer)?.filter((answer => answer))?.join("/")
                                return (
                                    <div className='contact-info' key={i}>
                                        <div className='heading black f-14 bold600'>Q. {`${i + 1}`} {values?.join(" / ")}</div>
                                        <div className='heading secondary60 f-14 bold400'>Answer: {`${combinedTranslation}`}</div>
                                    </div>
                                );
                            })}
                        </> :
                        <DataNotfound />
            }
        </Modal>
    )
}

export default ProfileQuestionHistory