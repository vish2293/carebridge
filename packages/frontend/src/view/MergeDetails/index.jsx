import React, { useEffect, useState } from "react";
import "./style.scss";
import { DisableSorting, getNumericDate, getProfileImage } from "../../helpers";
import { redExlcaimationIcon } from "../../assets/icons";
import { Table, Tooltip, Radio, Checkbox } from "antd";
import { getTalkedWithCHW } from "../../helpers/getTalkedWithCHW";
import { getHeardAboutUse } from "../../helpers/getHeardAboutUse";

const MergeDetails = ({ user, onChange }) => {
  const [otherUserData, setOtherUserData] = useState(user.duplicateUsers);
  const [data, setData] = useState();
  const [selectedEmail, setSelectedEmail] = useState(user.mainUser.email);
  const [selectedPhone, setSelectedPhone] = useState(user.mainUser.Phone);
  const [selectedStatus, setselectedStatus] = useState(user.mainUser.status);
  const [selectedAddress, setSelectedAddress] = useState(user.mainUser.address);
  const [selectedZipCode, setSelectedZipCode] = useState(user.mainUser.zipCode);
  const [selectedAssignTo, setSelectedAssignTo] = useState(
    user.mainUser.assign_to?._id
  );
  const [selectedtalkedWithCHW, setselectedtalkedWithCHW] = useState(
    getTalkedWithCHW(user?.mainUser?.profileQuestion)
  );
  const [selectedHeardAbout, setselectedHeardAbout] = useState(
    getHeardAboutUse(user?.mainUser?.profileQuestion)
  );

  useEffect(() => {
    if (onChange) {
      onChange({
        email: selectedEmail,
        Phone: selectedPhone,
        address: selectedAddress,
        zipCode: selectedZipCode,
        assignTo: selectedAssignTo,
        talkedWithCHW: selectedtalkedWithCHW,
        heardAboutUs: selectedHeardAbout,
        status: selectedStatus,
      });
    }
  }, [
    selectedEmail,
    selectedPhone,
    selectedAddress,
    selectedStatus,
    selectedZipCode,
    selectedAssignTo,
    selectedtalkedWithCHW,
    selectedHeardAbout,
  ]);

  const handleSelectChange = (field, value) => {
    switch (field) {
      case "email":
        setSelectedEmail(value);
        break;
      case "status":
        setselectedStatus(value);
        break;
      case "phone":
        setSelectedPhone(value);
        break;
      case "address":
        setSelectedAddress(value);
        break;
      case "zipCode":
        setSelectedZipCode(value);
        break;
      case "assignTo":
        setSelectedAssignTo(value);
        break;
      case "talkedWithCHW":
        setselectedtalkedWithCHW(value);
        break;
      case "heardAboutUs":
        setselectedHeardAbout(value);
        break;
      default:
        break;
    }
  };

  const renderConflictRadio = (
    value,
    conflictFlag,
    field,
    assign_to = true,
    name = "-"
  ) => {
    if (conflictFlag) {
      return (
        <Radio.Group
          value={
            field === "email"
              ? selectedEmail
              : field === "phone"
              ? selectedPhone
              : field === "address"
              ? selectedAddress
              : field === "zipCode"
              ? selectedZipCode
              : field === "assignTo"
              ? selectedAssignTo
              : field === "status"
              ? selectedStatus
              : field === "talkedWithCHW"
              ? selectedtalkedWithCHW
              : field === "heardAboutUs"
              ? selectedHeardAbout
              : ""
          }
          onChange={(e) => handleSelectChange(field, e.target.value)}
        >
          <Radio value={value}>{assign_to ? value : name}</Radio>
        </Radio.Group>
      );
    }
    return assign_to ? value : name;
  };

  const duplicateUserColumn = [
    { title: "No.", width: 55, fixed: "left" },
    { title: "First Name", width: 150, dataIndex: "firstName" },
    { title: "Last Name", width: 150, dataIndex: "lastName" },
    {
      title: "Email",
      width: 200,
      dataIndex: "email",
      ellipsis: true,
      render: (value, record) =>
        renderConflictRadio(value, record.isEmailConflict, "email"),
    },
    {
      title: "Phone",
      width: 150,
      dataIndex: "phone",
      render: (value, record) =>
        renderConflictRadio(value, record.isPhoneConflict, "phone"),
    },
    {
      title: "Birth Date",
      width: 150,
      dataIndex: "birthdate",
      render: (value) => (value ? getNumericDate(value) : "-"),
    },
    {
      title: "Address",
      width: 200,
      dataIndex: "address",
      render: (value, record) =>
        renderConflictRadio(value, record.isAddressConflict, "address"),
    },
    {
      title: "Zip Code",
      width: 150,
      dataIndex: "zipCode",
      render: (value, record) =>
        renderConflictRadio(value, record.isZipCodeConflict, "zipCode"),
    },
    {
      title: "Community Health Worker Name",
      width: 150,
      dataIndex: "chwName",
      render: (value, record) =>
        renderConflictRadio(value, record.isAssignToConflict, "assignTo"),
    },
    {
      title: "Status",
      width: 150,
      dataIndex: "status",
      render: (value, record) =>
        renderConflictRadio(value, record.isStatusConflict, "status"),
    },
    {
      title: "Talked with Community Health Worker?",
      width: 200,
      dataIndex: "talkedWithCHW",
      render: (value, record) =>
        renderConflictRadio(
          value,
          record.isTalkedWithCHWConflict,
          "talkedWithCHW"
        ),
    },
    {
      title: "How did you hear about us?",
      width: 250,
      dataIndex: "heardAboutUs",
      render: (value, record) =>
        renderConflictRadio(
          value,
          record.isHeardAboutUsConflict,
          "heardAboutUs"
        ),
    },
  ];

  useEffect(() => {
    let tempData = [];
    if (otherUserData?.length > 0) {
      otherUserData?.forEach((item, i) => {
        let obj = { ...item };
        let subObj = {
          no: i + 1,
          key: obj?._id,
          firstName: obj?.firstName,
          lastName: obj?.lastName,
          email: obj?.email ? obj?.email : "-",
          phone: obj?.Phone ? obj?.Phone : "-",
          birthdate: obj?.birthDate ? getNumericDate(obj?.birthDate) : "-",
          address: obj?.address ? obj?.address : "-",
          status: obj?.status ? obj?.status : "-",
          zipCode: obj?.zipCode ? obj?.zipCode : "-",
          chwName: obj?.assign_to?.firstName
            ? obj?.assign_to?.firstName + " " + obj?.assign_to?.lastName
            : "-",
          talkedWithCHW: obj?.profileQuestion
            ? getTalkedWithCHW(obj?.profileQuestion)
            : "-",
          heardAboutUs: obj?.profileQuestion
            ? getHeardAboutUse(obj?.profileQuestion)
            : "-",
          isEmailConflict: obj?.isEmailConflict,
          isPhoneConflict: obj?.isPhoneConflict,
          isAddressConflict: obj?.isAddressConflict,
          isZipCodeConflict: obj?.isZipCodeConflict,
          isAssignToConflict: obj?.isAssignToConflict,
          isStatusConflict: obj?.isStatusConflict,
          isTalkedWithCHWConflict: obj?.isTalkedWithCHWConflict,
          isHeardAboutUsConflict: obj?.isHeardAboutUsConflict,
        };
        tempData.push({ ...subObj });
      });
    }
    setData([...tempData]);
  }, [otherUserData]);

  return (
    <>
      <div className="merge-details-container">
        <div className="user-card chw_detail_info">
          <div className="chw_personal_detail">
            <div className="profile">
              <div className="avtar60">
                <img
                  src={
                    user?.mainUser.profileImage &&
                    user?.mainUser.profileImage !== ""
                      ? user?.mainUser.profileImage
                      : getProfileImage(user?.mainUser)
                  }
                  alt="Profile"
                  className="profile-image"
                />
              </div>
              <div className="profile-info">
                <div className="heading f-14 black bold600 textClass">
                  {user?.mainUser?.firstName} {user?.mainUser?.lastName}
                  {!user?.mainUser?.isDetailCompleted && (
                    <Tooltip title="Profile Question Details are empty">
                      {redExlcaimationIcon}
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
            <div className="contact-info">
              <div className="heading f-14 black bold600 textClass">
                Phone Number
              </div>
              <div className="heading f-14 secondary60 bold400 textClass">
                {renderConflictRadio(
                  user?.mainUser?.Phone ? user?.mainUser?.Phone : "-",
                  user?.mainUser?.isPhoneConflict,
                  "phone"
                )}
              </div>
            </div>
            <div className="contact-info">
              <div className="heading f-14 black bold600 textClass">Email</div>
              <div className="heading f-14 secondary60 bold400 textClass">
                {renderConflictRadio(
                  user?.mainUser?.email ? user?.mainUser?.email : "-",
                  user?.mainUser?.isEmailConflict,
                  "email"
                )}
              </div>
            </div>
            <div className="contact-info">
              <div className="heading f-14 black bold600 textClass">
                Birth Date
              </div>
              <div className="heading f-14 secondary60 bold400 textClass">
                {user?.mainUser?.birthDate
                  ? getNumericDate(user?.mainUser?.birthDate)
                  : "-"}{" "}
              </div>
            </div>
            <div className="contact-info">
              <div className="heading f-14 black bold600 textClass">
                Address
              </div>
              <div className="heading f-14 secondary60 bold400 textClass">
                {renderConflictRadio(
                  user?.mainUser?.address ? user?.mainUser?.address : "-",
                  user?.mainUser?.isAddressConflict,
                  "address"
                )}
              </div>
            </div>
            <div className="contact-info">
              <div className="heading f-14 black bold600 textClass">Status</div>
              <div className="heading f-14 secondary60 bold400 textClass">
                {renderConflictRadio(
                  user?.mainUser?.status ? user?.mainUser?.status : "-",
                  user?.mainUser?.isStatusConflict,
                  "status"
                )}
              </div>
            </div>
            <div className="contact-info">
              <div className="heading f-14 black bold600 textClass">
                Zip Code
              </div>
              <div className="heading f-14 secondary60 bold400 textClass">
                {renderConflictRadio(
                  user?.mainUser?.zipCode ? user?.mainUser?.zipCode : "-",
                  user?.mainUser?.isZipCodeConflict,
                  "zipCode"
                )}
              </div>
            </div>
            <div className="contact-info">
              <div className="heading f-14 black bold600 textClass">
                Community Health Worker Name
              </div>
              <div className="heading f-14 secondary60 bold400 textClass">
                {renderConflictRadio(
                  user?.mainUser?.assign_to?._id
                    ? user?.mainUser?.assign_to?._id
                    : false,
                  user?.mainUser?.isAssignToConflict,
                  "assignTo",
                  false,
                  user?.mainUser?.assign_to?.firstName
                    ? `${user?.mainUser?.assign_to?.firstName} ${user?.mainUser?.assign_to?.lastName}`
                    : "-"
                )}
              </div>
            </div>
            <div className="contact-info">
              <div className="heading f-14 black bold600 textClass">
                Talked with Community Health Worker?
              </div>
              <div className="heading f-14 secondary60 bold400 textClass">
                {renderConflictRadio(
                  user?.mainUser?.profileQuestion
                    ? getTalkedWithCHW(user?.mainUser?.profileQuestion)
                    : "-",
                  user?.mainUser?.isTalkedWithCHWConflict,
                  "talkedWithCHW"
                )}
              </div>
            </div>
            <div className="contact-info">
              <div className="heading f-14 black bold600 textClass">
                How did you hear about us?
              </div>
              <div className="heading f-14 secondary60 bold400 textClass">
                {renderConflictRadio(
                  user?.mainUser?.profileQuestion
                    ? getHeardAboutUse(user?.mainUser?.profileQuestion)
                    : "-",
                  user?.mainUser?.isHeardAboutUsConflict,
                  "heardAboutUs"
                )}
              </div>
            </div>
          </div>
          <div className="contact-info">
            <Checkbox checked={true}>
              <div className="heading f-14 black bold600 textClass">
                Set as Primary User
              </div>
            </Checkbox>
          </div>
        </div>
        <div className="dashboard_table_wrapper">
          <Table
            scroll={{ x: 500 }}
            columns={duplicateUserColumn}
            dataSource={data}
            rowClassName={(record) => {
              return user?.mainUser?._id === record.key ? "rowHighlight" : "";
            }}
            pagination={false}
            // sticky={true}
          />
        </div>
      </div>
    </>
  );
};

export default MergeDetails;
