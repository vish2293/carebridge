import { Button } from 'antd'
import React from 'react'
import { getFullDateTime, } from '../../../../helpers'

const NoteCard = ({ item, index, handleClickModal, setEditNoteId }) => {

    const handleEditModal = () => {
        handleClickModal("editNote");
        setEditNoteId(item?._id);
    }

    return (
        <>
            {

                <div className="visit-cards">
                    <div className="visit-card-left">
                        <div className="heading f-14 bold600 black">{getFullDateTime(item?.dateOfAttempts)}</div>
                        <div className="heading f-14 secondary60 bold400">{item?.description}</div>
                    </div>  
                    <div className="visit-card-right">
                        <div className="heading f-14 bold600 black">{item?.status}</div>
                        <div className='accept-reject'>

                            <Button type="primary" className="view-btn yellow-btn" onClick={handleEditModal}>Edit</Button>
                        </div>
                    </div>
                    <div className="visit-card-bottom">
                        <div>
                            <span>Created By : </span>
                            <span>{item?.createdBy ? `${item?.createdBy?.firstName} ${item?.createdBy?.lastName}` : "---"}</span>
                        </div>
                        <div>
                            <span>Modified By : </span>
                            <span>{item?.modifiedBy ? `${item?.modifiedBy?.firstName} ${item?.modifiedBy?.lastName}` : "---"}</span>
                        </div>
                    </div>
                </div>
            }

        </>
    )
}

export default NoteCard
