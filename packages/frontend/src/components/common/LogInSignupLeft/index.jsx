import React from 'react'
import Logo from './../Logo'
import { Link } from 'react-router-dom'

const LogInSignupLeft = ({ title1, title2, description, data, icon }) => {
  return (
    <div className='login-left'>
      <div className='bg-img'>
        <Link to='/' className='brand_mark'><Logo tone='light' size={36} /></Link>
        <div className='bg-content'>
          {icon && <div className='quote'>{icon}</div>}
          <h1>{title1}{title2}</h1>
          <p>{description}</p>
          {
            data?.length > 0 &&
            <ul>
              {data?.map((item, i) => (
                <li key={i} className='contact-li'>
                  <span className='li-icon'>{item.icon}</span>
                  {
                    item?.tag === 'link' ?
                      <Link className='li-text' to={`mailto:${item?.text}`}>{item?.text}</Link> : item.tag === 'tel' ?
                        <Link className='li-text' to={`tel:${item.text}`}>{item.text}</Link> :
                        <span className='li-text'>{item.text}</span>
                  }
                </li>
              ))}
            </ul>
          }
        </div>
      </div>
    </div>
  )
}

export default LogInSignupLeft
