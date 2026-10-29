import { Button, Modal } from 'antd'
import React from 'react'

const ConfirmTask = ({ isOpen, icon, title, description, setIsOpen, modaAction, handleDispatchAction }) => {

    const onCancel = () => {
        setIsOpen(false)
    }

    return (
        <Modal open={isOpen} onCancel={onCancel} okText={"Yes"} width={416} footer={null} centered={true}>
            <div className='inner_content'>
                <div>{icon}</div>
                <div>
                    <p className='title'>{title}</p>
                    <span>{description}</span>
                </div>
            </div>
            <div className='cancel-yes  delete-modal'>
                <Button type='default' onClick={onCancel}>Cancel</Button>
                <Button type='primary' onClick={() => handleDispatchAction(modaAction)} className='delete'>Yes</Button>
            </div>
        </Modal>
    )
}
export default ConfirmTask;
