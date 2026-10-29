import { Button, DatePicker, Form, Input, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import LogInHeader from '../../components/common/LogInHeader';
import { disabledBirthDate } from '../../helpers';
import { emailValidation, firstNameValidation, lastNameValidation, phoneValidation } from '../../helpers/formValidation';
import { createClientRequest } from '../../redux/actions/user';
import SuccessMessage from '../Onboarding/SuccessMessage';
import dayjs from 'dayjs';

const ClientRequestForm = () => {

    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [formSubmitted, setFormSubmitted] = useState(false);

    const inputRef = useRef();

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleOnFinish = (values) => {
        if (values) {
            values.role = "Client";
            values.is_Verified = true;
            values.birthDate = dayjs(values.birthDate).format("MM/DD/YYYY")
            dispatch(createClientRequest(values)).then((res) => {
                if (res?.payload?.status === true) {
                    setFormSubmitted(true);
                }
            })
        }

    }
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            form.submit();
        }
    }

    return (
        // <div className='onboarding' style={{ marginTop: "15px" }}>
        <div className='onboarding'>
            <LogInHeader isContact={true} />
            {
                <>
                    {
                        formSubmitted ?
                            <div className='onboarding-stps'>
                                <div className='onboarding-form'>
                                    <SuccessMessage homeButton={true} icon={true} />
                                </div>
                            </div>
                            :

                            <div className='onboarding-stps'>
                                <div className='onboarding-form'>
                                    <div className='onboard-head'>Enter Your Details</div>
                                    <Form
                                        layout="vertical"
                                        form={form}
                                        onFinish={handleOnFinish}
                                        onKeyDown={(e) => handleKeyDown(e)}
                                    >

                                        <div className="two-fill-row ">
                                            <Form.Item label="First Name / Primer nombre" name={"firstName"} rules={[{ required: true, validator: firstNameValidation }]}>
                                                <Input placeholder="Enter your first name" ref={inputRef} />
                                            </Form.Item>
                                            <Form.Item label="Last Name / Apellido" name={"lastName"} rules={[{ required: true, validator: lastNameValidation }]}>
                                                <Input placeholder="Enter your last name" />
                                            </Form.Item>
                                        </div>
                                        <div className="two-fill-row ">
                                            <Form.Item label="Date of Birth / Fecha de nacimiento" rules={[{ required: true, message: "Birth date is required" }]} name={'birthDate'}>
                                                <DatePicker placeholder="Select your birth date" disabledDate={disabledBirthDate} />
                                            </Form.Item>


                                            <Form.Item label="Phone Number / Número de teléfono" name={"Phone"} rules={[{ required: true, validator: phoneValidation }]}>
                                                <Input placeholder="Enter your phone number" />
                                            </Form.Item>
                                        </div>


                                        <div className="two-fill-row ">
                                            <Form.Item label="Email Address / dirección de correo electrónico" name={"email"} rules={[{ required: true, validator: emailValidation }]}>
                                                <Input placeholder="Enter your email" />
                                            </Form.Item>
                                            <Form.Item label="Zip code / Código postal" name={"zipCode"} rules={[{ required: true, message: "Zip code is required" }]}>
                                                <Input placeholder="Enter your zip code" />
                                            </Form.Item>

                                        </div>
                                        <Form.Item label="Address / Direccio`n" name={"address"} rules={[{ required: true, message: "Address is required" }]}>
                                            <Input.TextArea placeholder="Enter your address" />
                                        </Form.Item>

                                    </Form>
                                    <div className="btn-sec">
                                        <Button type="primary" className="yellow-btn" htmlType="submit" onClick={() => form.submit()} >
                                            Submit
                                        </Button>
                                    </div>

                                </div>
                            </div>
                    }
                </>
            }

        </div>
    )
}

export default ClientRequestForm
