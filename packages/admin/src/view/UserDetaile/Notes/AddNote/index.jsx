import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select, Space } from "antd";
import React, { useEffect, useRef } from 'react';
import { NotesContactType, noteStatus } from '../../../../constant/array';
import { disabledDate } from '../../../../helpers';
import { futureTimeValidation } from '../../../../helpers/formValidation';

const AddNote = ({ handleDispatchAction, noteFormFields, setNoteFormFields, btnLoading}) => {
  const [form] = Form.useForm();
  const inputRef = useRef(null);

  useEffect(()=>{
    inputRef.current.focus()
  },[])
  const handleRemove = (name) => {
    setNoteFormFields((prevNotes) => prevNotes?.filter((note) => note?.name !== name));
  }

  const handleAddMore = () => {
    setNoteFormFields([...noteFormFields, { key: Date.now(), name: noteFormFields.length + 1 }])
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
      form={form}
      labelAlign="left"
      onFinish={() => handleDispatchAction("addNote", form)}
    >
      <div className='heading f-16 bold600 '>Add Note</div>
      {noteFormFields.map(({ key, name, ...restField }) => (
        <div key={key} className='add-notes'>
          <Space
            style={{
              display: 'flex',
              marginBottom: 8,
            }}
            align="baseline"
          >
            <Form.Item
              {...restField}
              name={[name, 'dateOfAttempts']}
              label="Attempt Date"
              rules={[
                {
                  required: true,
                  // message: 'Attempt date is required',
                  validator:futureTimeValidation
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
              {...restField}
              name={[name, 'contactType']}
              label="Contact Type"
              rules={[
                {
                  required: true,
                  message: 'Contact type is required',
                },
              ]}
            >
              <Select placeholder="Select Contact Type" options={NotesContactType} />
            </Form.Item>
            <Form.Item
              {...restField}
              name={[name, 'status']}
              label="Response"
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
              {...restField}
              name={[name, 'description']}
              label="Comments"
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

          <div>
            <Button onClick={() => handleRemove(name)} className='reject-btn'>Cancel</Button>
          </div>


        </div>

      ))}
      <Form.Item className='add-more'>
        <Button type="dashed" onClick={handleAddMore} block icon={<PlusOutlined />}>
          Add more
        </Button>
      </Form.Item>

      {/* <Button type='primary' className="yellow-btn" onClick={() => handleDispatchAction("addNote", form)}>Save note</Button> */}
      <div className="accept-reject">
        <Form.Item>
          <Button
            className="save-btn"
            htmlType='submit'
            loading={btnLoading}
            disabled={btnLoading}
          >
            Save note
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default AddNote;
