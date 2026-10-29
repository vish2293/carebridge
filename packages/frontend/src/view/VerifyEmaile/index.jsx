import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { verifyUserEmail } from '../../redux/actions/user'
import { message } from 'antd'

const VerifyEmaile = () => {
    const {id}=useParams()   
    const dispatch=useDispatch()
    const navigate=useNavigate()

    const verifyUser=(id)=>{
        const payload={id:id}        
        dispatch(verifyUserEmail(payload)).then((res)=>{
            const data=res?.payload;
            if(data?.message==="Email verified successfully"){
                message.success("Email verified successfully")
                navigate("/login")
            }else{
                message.error("Somthing went wrong please try again after some time !")
            }
        })
    }
    
    useEffect(()=>{
        verifyUser(id)
    },[id])

    
  return (
    <div>
       
    </div>
  )
}

export default VerifyEmaile
