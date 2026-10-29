import { Button, Form, Input, Radio } from 'antd';
import React from 'react';
import DataNotfound from '../../../../components/common/DataNotFound';

const SubmitAnswerForm = ({ data, handleSubmit }) => {
  //For user form method
  const [form] = Form.useForm()

  //For render based on answer types
  const renderFormItem = (item) => {

    if (item.question.answer_type === 'text') {
      return <Input />;
    } else if (item.question.answer_type === 'dropdown') {
      return (
        <Radio.Group >
          {item.question.ansOptions.map((option) => (
            <Radio key={option} value={option}>
              {option}
            </Radio>
          ))}
        </Radio.Group>
      );
    }
    return null;
  };

  return (

    <div>
      {
        data?.length > 0 ?
          <Form
            form={form}
            layout='vertical'
          >
            {
              data?.map((item, i) => (
                <Form.Item key={item._id} name={item?._id} label={item?.question?.question} rules={[{ required: true, message: 'Required' }]}>
                  {renderFormItem(item)}
                </Form.Item>
              ))
            }
            <Form.Item>
              <Button type="primary" className='yellow-btn' onClick={() => handleSubmit(form)}>Submit</Button>
            </Form.Item>
          </Form> :
          <DataNotfound />
      }
    </div>

  )
}

export default SubmitAnswerForm
