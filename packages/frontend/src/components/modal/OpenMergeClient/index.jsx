import { Button, Modal, Radio, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { API_URL } from "../../../api";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import "./style.scss";
import MergeDetails from "../../../view/MergeDetails";
import { allClients } from "../../../redux/actions/user";
import { toggleBodyClass } from "../../../helpers/noScroll";
import apiClient from "../../../helpers/interseptor";

const OpenMergeClientModal = ({ isOpen, setIsOpen, selectedMergeUserIds }) => {
  const [mergeUserData, setMergeUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const dispatch = useDispatch();

  const onCancel = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setDataLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await apiClient.get(
          `${API_URL.user.listDuplicateClient}/${selectedMergeUserIds}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDataLoading(false);
        setMergeUserData(data);
      } catch (error) {
        setDataLoading(false);
        return isRejectedWithValue(error);
      }
    };
    getData();
  }, []);

  const handleMerge = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const payload = {
        id: mergeUserData.data[0].mainUser._id,
        mergeData: selectedData,
        otherId: mergeUserData.data[0].duplicateUsers.map((data) => data._id),
      };
      await apiClient.put(`${API_URL.user.mergeData}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("User merged successfully!");
      let listPayload = {
        filter: { role: "Client" },
      };
      dispatch(allClients({ filter: listPayload }));
      setIsOpen(false);
    } catch (error) {
      console.error("Error merging clients:", error);
    }
  };

  useEffect(() => {
    const cleanup = toggleBodyClass(isOpen);
    return cleanup;
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onCancel={onCancel}
      width={850}
      title={"Merge Field"}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="merge"
          type="primary"
          onClick={handleMerge}
          loading={loading}
        >
          Merge
        </Button>,
      ]}
      centered={true}
    >
      <div className="merge-modal-content ">
        <div className="merge-table">
          <Spin spinning={dataLoading}>
            <div className="merge-table-body">
              {mergeUserData?.data?.map((user, index) => (
                <MergeDetails
                  key={index}
                  user={user}
                  onChange={(updatedData) =>
                    setSelectedData((prevData) => ({
                      ...prevData,
                      ...updatedData,
                    }))
                  }
                />
              ))}
            </div>
          </Spin>
        </div>
      </div>
    </Modal>
  );
};

export default OpenMergeClientModal;
