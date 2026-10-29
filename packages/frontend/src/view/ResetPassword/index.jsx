import { Button, Form, Input, message } from 'antd'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PATH_LIST } from '../../constant/path-list'
import { useDispatch } from 'react-redux'
import { sendResetPassword } from '../../redux/actions/user'
import { leftArrow, quoteIcon } from '../../assets/icons'
import EmailSent from './EmailSent'
import LogInSignupLeft from '../../components/common/LogInSignupLeft'
import LogInHeader from '../../components/common/LogInHeader'
import { emailIcon, forwardIcon } from '../../assets/icons'
const ResetPassword = () => {
    const dispatch = useDispatch()
    //For store email
    const [email, setEmail] = useState("")
    //For store is email sent
    const [isEmailSent, setIsEmailSent] = useState(false)

    const handleSendResetEmail = (values) => {
        let payload = { email: values?.email ? values?.email : values }
        setEmail(values?.email ? values?.email : values)
        dispatch(sendResetPassword({ payload: payload })).then((res) => {
            if (res?.payload?.status === true) {
                message.success(res?.payload?.message)
                setIsEmailSent(true)
            } else {
                message.error("Something went wrong!")
            }
        })
    }
    return (
        <div className='main-sec'>
            <div className='main-sec-left'>
                <LogInSignupLeft
                    title1={"Empowering Lives, "}
                    title2={"Making a Difference"}
                    description={"\"For he who has health has hope; and he who has hope, has everything.” Arthur Owen"}
                    icon={quoteIcon} />
            </div>
            <div className='main-sec-right'>
                <LogInHeader />
                {/* {isEmailSent ?
                    <EmailSent
                        email={email}
                        handleSendResetEmail={handleSendResetEmail}
                        setIsEmailSent={setIsEmailSent}
                    /> : */}
                <div className='inner-right reset-pass'>
                    <div className='login-right'>
                        <div className='login-right-top'>
                            <h2 className='login-heading'>Forgot password?</h2>
                            <p>No worries, we’ll send you reset <br /> password link</p>
                            {/* <LoginForm handleLogin={handleLogin} handleSubmitFailed={handleSubmitFailed} /> */}
                            <Form onFinish={handleSendResetEmail} layout='vertical' style={{ minWidth: 400 }}>
                                <Form.Item label="Enter Email" name='email'>
                                    <Input placeholder='Email Address' prefix={emailIcon} value={email} />
                                </Form.Item>
                                <div className='full-width-btn'>
                                    <Button type="primary" htmlType='submit' className="btn" icon={forwardIcon}>Send reset link</Button>
                                </div>
                            </Form>
                        </div>
                        <div className='login-roght-bottom'>
                            <Link to={PATH_LIST.login} className='back-link'><span className='left-arrow'>{leftArrow}</span>Back to Login</Link>
                        </div>
                    </div>
                </div>
                {/* } */}
            </div>



        </div>

    )
}

export default ResetPassword
