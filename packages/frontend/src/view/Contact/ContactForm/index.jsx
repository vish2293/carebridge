import React, { useEffect, useState } from 'react'
import { Button, Form, Input } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { emailValidation } from '../../../helpers/formValidation'

const ContactForm = ({ form, formValues, handleOnFinish, handleFinishFailed }) => {

  const [submittable, setSubmittable] = useState(false);
  //Watch all values

  useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(
        () => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        },
      );
  }, [formValues]);

  return (
    <Form layout='vertical' form={form} style={{ minWidth: 600 }} onFinish={handleOnFinish} onFinishFailed={handleFinishFailed} requiredMark={false}>
      <Form.Item name='text' label="Enter full name" rules={[{ required: true, message: "Enter full name" }]} className='login-email'>
        <Input placeholder='Enter full name' />
      </Form.Item>
      <Form.Item name='email' label="Enter email address" rules={[{ required: true, validator: emailValidation }]} className='login-email'>
        <Input placeholder='Enter email address' />
      </Form.Item>
      <Form.Item name='subject' label="Enter subject" rules={[{ required: true, message: " Enter subject" }]} className='login-email'>
        <Input placeholder='Enter subject' />
      </Form.Item>
      <Form.Item name='message' label="Enter your message" rules={[{ required: true, message: "Please Enter your message" }]}>
        <TextArea placeholder='Enter your message' />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="btn" disabled={!submittable}>
          Submit
        </Button>
      </Form.Item>
    </Form>

  )
}

export default ContactForm;
