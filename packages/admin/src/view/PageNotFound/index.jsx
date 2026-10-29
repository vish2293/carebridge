import { Button } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PATH_LIST } from '../../constant/path-list'
import { leftArrow } from '../../assets/icons'
import "./style.scss"
const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className='page-not-found'>
      <div className='inside-page-not-found'>
        <h4>404</h4>
        <h1>Page not found</h1>
        <p>Sorry, we couldn’t find the page you’re looking for.</p>
        <Button onClick={() => navigate(PATH_LIST.user.dashboard)}>{leftArrow}Go back home</Button>
      </div>

    </div>
  )
}

export default PageNotFound
