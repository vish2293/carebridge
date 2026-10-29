import React from 'react'
import { RightArrow, WatchIcon, locationIcon } from '../../../assets/icons'

const UpcommingEvents = ({ img, title, description, month, date, location, time }) => {
  return (
    <div className='event_item'>
      <div className='event_item_inner'>
        <div className='image'>
          <span className='event_date'><span className='date'>{date}</span> {month}</span>
          <img src={img} alt="" />
        </div>
        <div className='event_content'>
          <div className='title'>
            <h6>{title}</h6>
            <div className='address_wrap'><span>{locationIcon}</span><p>{location}</p></div>
            <div className='time_wrap'><span>{WatchIcon}</span><p>{time}</p></div>
          </div>
          <div className='description'>
            <p>{description}</p>
          </div>
          <div className='btn_sec'>
            <button className='btn'><span>Register Now</span><span>{RightArrow}</span></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpcommingEvents
