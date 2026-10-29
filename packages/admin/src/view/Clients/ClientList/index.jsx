import { Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { clientColumn } from '../../../constant/tableColoumn'

const ClientLists = ({ userLists, loading }) => {
  //For customize data
  const [data, setData] = useState([])

  useEffect(() => {
    let tempArr = []

    if (userLists?.length > 0) {
      userLists.forEach((ele, i) => {
        let obj = { ...ele }
        let subObj = {
          no: i + 1,
          key: obj._id,
          firstName: obj.firstName,
          lastName: obj.lastName,
          email: obj.email,
          address: obj.address,
          Phone: obj.Phone
        }
        tempArr.push({ ...subObj })
      })
      setData(tempArr)
    } else {
      setData([])
    }
  }, [userLists])

  return (
    <div>
      <Table dataSource={data}
        columns={clientColumn}
        loading={loading}
        scroll={{ x: 1100 }}
        sticky={true} />
    </div>
  )
}

export default ClientLists
