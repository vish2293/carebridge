import React from 'react'

const SubmitedDetaile = ({ data }) => {
  return (
    <div>
      {
        data?.map((item, i) => (
          <div key={item._id} className='user-detail-info request-detail'>
            <div className='contact-info'>
              <div className='heading f-14 bold400 secondary60 '>{`Q.${i + 1} `}{item?.question?.question}</div>
              <div className='heading f-14 bold400 black'>{`Ans. `}{item?.answer}</div>
            </div>
          </div>
        ))

      }
    </div>
  )
}

export default SubmitedDetaile
