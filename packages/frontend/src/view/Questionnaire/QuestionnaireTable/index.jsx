import { Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { getNumericDate } from "../../../helpers";
import { deleteIcon, editIcon, newEditIcon } from "../../../assets/icons";

const QuestionnaireTable = ({
  loading,
  questionLists,
  handleModalClickAction,
}) => {
  //For store table data
  const [data, setData] = useState([]);

  //For questionnaire table column
  const questionnaireColumn = [
    { title: "No", width: 80 },
    { title: "Questions", dataIndex: "question", width: 520, ellipsis: true },
    {
      title: "Question Categories",
      dataIndex: "category",
      width: 200,
      render: (_, record) => (
        <span>{record?.category ? record?.category : "-"}</span>
      ),
    },
    {
      title: "Modified Date",
      dataIndex: "modifiedDate",
      width: 150,
      render: (_, record) => <div>{getNumericDate(record?.modifiedDate)}</div>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 80,
      render: (_, record) => (
        <div
          className="accept-reject"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Tooltip title="Edit">
            <span
              className="view"
              onClick={() =>
                handleModalClickAction("editQuestion", true, record)
              }
            >
              {newEditIcon}
            </span>
          </Tooltip>
          <Tooltip title="Delete">
            <span
              className="reject"
              onClick={() =>
                handleModalClickAction("deleteQuestion", true, record)
              }
            >
              {deleteIcon}
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  //For set data
  useEffect(() => {
    let tempDat = [];
    if (questionLists?.length > 0) {
      questionLists?.forEach((item, i) => {
        let subObj = {
          no: i + 1,
          key: item?._id,
          question: item?.questionML
            ?.map((questionMlItems) => questionMlItems?.value)
            ?.join("/"),
          category: item?.category ? item?.category : "",
          createdDate: item?.createdAt,
          modifiedDate: item?.updatedAt,
          isMapped: item?.isMapped,
          short_desc: item?.short_desc,
          answer_type: item?.answers?.answer_type,
          ansOptions: item?.answers?.answersML
            ? item?.answers?.answersML?.map((answerItems) => ({
                engOptions: answerItems?.values?.en,
                spanishOptions: answerItems?.values?.es,
                objective: answerItems?.key,
              }))
            : [],
        };
        tempDat.push({ ...subObj });
      });
    }
    setData([...tempDat]);
  }, [questionLists]);

  return (
    <Table
      columns={questionnaireColumn}
      dataSource={data}
      sticky={true}
      loading={loading}
      pagination={data?.length > 10 ? true : false}
      scroll={{ x: 1000 }}
    />
  );
};

export default QuestionnaireTable;
