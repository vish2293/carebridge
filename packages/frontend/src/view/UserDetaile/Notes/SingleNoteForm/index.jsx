import { Button, DatePicker, Form, Input, Select, Space } from 'antd'
import React, { useEffect, useRef } from 'react'
import { disabledDate } from '../../../../helpers';
import { NotesContactType, noteStatus } from '../../../../constant/array';
import dayjs from 'dayjs';
import { futureTimeValidation } from '../../../../helpers/formValidation';

const SingleNoteForm = ({ setEditNoteId, item, handleDispatchAction, modalAction, handleClickModal ,btnLoading}) => {
    const [form] = Form.useForm();
    const inputRef = useRef(null);
    
    useEffect(()=>{
        inputRef.current.focus();
    },[]);

    const handleCancel = () => {
        setEditNoteId(null);
    }

    const handleDelte = () => {
        handleClickModal("deleteNote", true, item);
        setEditNoteId(item?._id);
    }

    const initalValues = {
        ...item,
        dateOfAttempts: dayjs(item?.dateOfAttempts)
    }

    const disableTime = (value) => {
        const selectedDate = new Date(value);
        const currentDate = new Date();

        if (selectedDate.toDateString() !== currentDate.toDateString()) {
            // If selected date is not today, no time restrictions
            return null;
        } else {
            // If selected date is today, disable hours and minutes based on current time
            const currentHour = currentDate.getHours();
            const currentMinute = currentDate.getMinutes();

            return {
                disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter(hour => hour > currentHour),
                disabledMinutes: (hour) => {
                    if (hour === currentHour) {
                        return Array.from({ length: 60 }, (_, i) => i).filter(minute => minute > currentMinute);
                    }
                    return [];
                },
            };
        }
    };
    return (
        <Form
            labelCol={{ span: 8 }}
            labelAlign="left"
            form={form}
            initialValues={initalValues}
        >
            <div className='heading f-16 bold600 '>Edit Note</div>

            <div >
                <Space
                    style={{
                        display: 'flex',
                        marginBottom: 8,
                    }}
                    align="baseline"
                >
                    <Form.Item
                        name='dateOfAttempts'
                        label="Attempt Date"
                        rules={[
                            {
                                required: true,
                                validator: futureTimeValidation
                            },
                        ]}
                    >
                        <DatePicker
                            ref={inputRef}
                            showTime
                            disabledTime={(value) => disableTime(value)}
                            format="MM/DD/YYYY hh:mm A"
                            disabledDate={(value) => disabledDate(value, "futureDate")}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Contact Type"
                        name={"contactType"}
                        rules={[
                            {
                                required: true,
                                message: 'Contact Type is required',
                            },
                        ]}
                    >
                        <Select placeholder="Select Contact Type" options={NotesContactType} />
                    </Form.Item>
                    <Form.Item
                        label="Response"
                        name={"status"}
                        rules={[
                            {
                                required: true,
                                message: 'Response is required',
                            },
                        ]}
                    >
                        <Select placeholder="Select response" options={noteStatus} />
                    </Form.Item>
                    <Form.Item
                        label="Comments"
                        name={'description'}
                        rules={[
                            {
                                required: true,
                                message: 'Comments is required',
                            },
                        ]}
                    >
                        <Input.TextArea placeholder="Enter comments" />
                    </Form.Item>
                </Space>

                <div className="accept-reject">
                    <div>
                        <Button type="primary" className="reject-btn" onClick={handleDelte}>Delete</Button></div>
                    <div className='save-notes'>
                        <Button type='primary' className="yellow-btn" onClick={() => handleDispatchAction(modalAction, form)} loading={btnLoading} disabled={btnLoading}>Save note</Button>
                        <Button onClick={handleCancel} className="reject-btn">Cancel</Button>
                    </div>
                </div>


            </div>





        </Form>
    )
}

export default SingleNoteForm
