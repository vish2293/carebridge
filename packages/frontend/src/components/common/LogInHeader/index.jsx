import React from 'react'
import { PATH_LIST } from '../../../constant/path-list'
import { Button } from 'antd'
import Logo from '../Logo'
import { Link } from 'react-router-dom'

const LogInHeader = ({ isContact }) => {
  //For open contact us page
  const openContactUs = () => {
    window.open(PATH_LIST.contactus)
  }

  return (
    <div className='login_header'>
      <div className='login_header_left'>
        <Link to={PATH_LIST.home} aria-label='CareBridge home'><Logo size={32} /></Link>
      </div>
      {isContact && (
        <div className='login_header_right'>
          <Button className='contact-btn' onClick={openContactUs}>Contact Us</Button>
        </div>
      )}
    </div>
  )
}

export default LogInHeader
