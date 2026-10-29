import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DisableSorting } from "../../../helpers";

const ChwClientLists = ({ chwClientLists }) => {
    const { chwClientLoading } = useSelector((state) => state.user);
    const [data, setData] = useState();

    const chwListsColumn = [
        {
            title: "No",
            width: 80,
            render: (_, __, index) => {
                return <span>{DisableSorting(index, 1, 10)}</span>;
            },
        },
        {
            title: "Client Name",
            dataIndex: "clientName",
            sorter: (a, b) => a?.clientName?.localeCompare(b?.clientName),
        },
        {
            title: "No. of Action Steps",
            dataIndex: "requestCount",
            sorter: (a, b) => b?.requestCount - a?.requestCount,
        },
        {
            title: "No. of Next steps",
            dataIndex: "taskCount",
            sorter: (a, b) => b?.taskCount - a?.taskCount,
        },
    ];

    useEffect(() => {
        let tempData = [];
        if (chwClientLists?.length > 0) {
            chwClientLists?.forEach((item, i) => {
                let obj = { ...item };
                let subObj = {
                    no: i + 1,
                    key: obj?.user?._id,
                    clientName: obj?.user?.firstName + " " + obj?.user?.lastName,
                    requestCount: obj?.requestCount,
                    taskCount: obj?.taskCount,
                };
                tempData.push({ ...subObj });
            });
        }
        setData([...tempData]);
    }, [chwClientLists]);

    return (
        <Table
            columns={chwListsColumn}
            dataSource={data}
            sticky={true}
            pagination={data?.length > 10 ? true : false}
            scroll={{ x: 1000 }}
            loading={chwClientLoading}
        />
    );
};
export default ChwClientLists;
