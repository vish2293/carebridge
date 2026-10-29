import React from 'react'
import { leftArrow, mailIcon } from '../../../assets/icons'
import { Link } from 'react-router-dom'
import { PATH_LIST } from '../../../constant/path-list'
import { Button } from 'antd'

const EmailSent = ({ email, handleSendResetEmail, setIsEmailSent }) => {
  return (
    <div className='inner-right email-sec'>
      <div className='login-right'>
        <div className='login-right-top'>
          <div className='email_icon'>{mailIcon}</div>
          <h2 className='login-heading'>Email has been sent successfully!</h2>
          {/* <p>Please check your example@123gmail.com {email} <Link onClick={() => setIsEmailSent(false)}>Edit</Link></p> */}
          {/* <p>We’ve sent an password reset link, click on link and reset your password</p> */}
          <p>Reset password link has been sent successfully to your Email.</p>
          <div className='full-width-btn'>
            <Button onClick={() => handleSendResetEmail(email)} type="primary" htmlType='submit' className="btn">Didn’t received send again</Button>
          </div>
        </div>
        <div className='login-roght-bottom'>
          <Link to={PATH_LIST.login} className='back-link'>
            <span className='left-arrow'>{leftArrow}</span>
            <span>Back to login</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EmailSent
