import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { allUsers } from '../../redux/actions/user'
import ClientLists from './ClientList'
import { pluseIcon } from '../../assets/icons'

const Clients = () => {
  //For reducer
  const { userList, userLoading } = useSelector(state => state.user)
  //For dispatch
  const dispatch = useDispatch()

  //For store user list  
  const [userLists, setUserLists] = useState([])

  //For get all user list
  const getAllUsers = () => {
    dispatch(allUsers())
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  useEffect(()=>{
if(userList?.length>0){
  setUserLists(userList)
}else{
  setUserLists([])
}
  },[userList])
  const clientsCount = userLists?.reduce((count, item) => {
    return item?.role === undefined ? count + 1 : count;
  }, 0);
  
  const chwCount = userLists?.reduce((count, item) => {
    return item?.role === "CHW" ? count + 1 : count;
  }, 0);
  
  return (
    <div className='clients_wrapper'>
      <div className='client_heading'>
        <div className='client_heading_left'>
          <div><span>Clients</span><span>{clientsCount}</span></div>          
        </div>
        <div className='client_heading_right'>
          <button>
            <span>{pluseIcon}</span>
            <span>{'Add Client'}</span>
          </button>
        </div>
      </div>
      <div>
        <ClientLists userLists={userLists} userLoading={userLoading}/>
      </div>
    </div>
  )
}

export default Clients
