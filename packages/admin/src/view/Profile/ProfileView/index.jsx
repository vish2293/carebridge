/* eslint-disable react/prop-types */

import { Button, Form, Upload, message } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getProfileImage } from "../../../helpers";
import { changePassword, updateUser } from "../../../redux/actions/user";
import ProfileDetaile from "../ProfileDetaile";
import ProfileForm from "../ProfileForm";
import UpdatePasswordForm from "../UpdatePasswordForm";

const ProfileView = ({ loggedInUser }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [editMoad, setEditMoad] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [loading, setLoading] = useState(false)

  const handleSubmitPassword = (form) => {
    setLoading(true)
    form.validateFields().then((values) => {
      let payload = {
        oldPassword: values?.oldPassword,
        newPassword: values?.password
      }
      dispatch(changePassword({ id: loggedInUser?._id, payload: payload })).then((res) => {
        if (res?.payload?.status === true) {
          setEditPassword(false);
          message.success("Password updated successfully!");
          setLoading(false)
        } else if (res?.payload?.status === false) {
          message.error(res?.payload?.message)
          setLoading(false)
        }
      });
    })
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      // Assuming your server returns the image URL    
      setImageUrl(info.file.response.url);
    } else if (info.file.status === "error") {
      message.error("Image upload failed.");
    }
  };

  const handleSaveChanges = () => {
    setLoading(true)
    form.validateFields().then((values) => {
      dispatch(updateUser({ id: loggedInUser?._id, payload: values })).then((res) => {
        if (res?.payload?.status === true) {
          setEditMoad(false);
          message.success("Profile updated successfully!");
          setLoading(false)
        } else {
          message.error("Something went wrong");
          setLoading(false)
        }
      });
    });
  };

  const handleProfileChanges = (e) => {
    if (e?.file.type.startsWith("image/")) {
      let payload = new FormData();
      payload.append("profileImage", e.file);
      setLoading(true)
      dispatch(updateUser({ id: loggedInUser?._id, payload })).then((res) => {
        if (res?.payload?.status === true) {
          setEditMoad(false);
          message.success("Profile updated successfully!");
          setLoading(false)
        } else {
          setLoading(false)
          message.error("Something went wrong");
        }
      });
    } else {
      message.error("Invalid file type. Please check your file and try again!")
    }
  };

  //For cancel edit mode
  const handleCancelEdit = () => {
    setEditMoad(false);
    form.resetFields()
  };

  //For handle edit mode
  const handleEdit = () => {
    setEditMoad(true);
  };

  return (
    <>
      <div className='prilfe_iamge' >
        <div className='profile-left'>
          <div className='profile'>
            <div className='avtar60'>
              <Upload
                name="avatar"
                accept="image/jpeg,image/jpg,image/png,image/avif,image/avi"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                onChange={handleChange}
                customRequest={(e) => { handleProfileChanges(e); }}
              >
                {imageUrl ?
                  <img src={imageUrl} alt="Profile" style={{ width: "100%" }} />
                  :
                  <img src={getProfileImage(loggedInUser)} alt="" />
                }
              </Upload>
            </div>
          </div>
          <div className='profile-name'>
            <p className='heading secondary90'>{loggedInUser?.firstName} {loggedInUser?.lastName}</p>
          </div>
        </div>
        <div className='profile-right' style={{ marginTop: '15px' }}>
          {
            (!editMoad && !editPassword) &&
            <Button className='yellow-btn' onClick={handleEdit} type="primary">Edit Profile</Button>
          }
          {
            editMoad &&
            <div className='accept-reject'>
              <Button className='btn save-btn' onClick={() => handleSaveChanges()} loading={loading}>Save Changes</Button>
              <Button onClick={handleCancelEdit} className="reject-btn">Cancel</Button>
            </div>
          }
          {/* {
            editPassword !== true &&
            <Button onClick={() => setEditPassword(true)}>Reset Password</Button>
          } */}

        </div>
      </div >
      <div className='prrofile_form'>
        {
          editMoad ?
            <ProfileForm
              loggedInUser={loggedInUser}
              form={form}
              handleCancelEdit={handleCancelEdit}
              editMoad={editMoad}
              handleSaveChanges={handleSaveChanges}
            />
            :
            <>
              <ProfileDetaile
                loggedInUser={loggedInUser}
              />
              {
                !editPassword &&
                <div className="update-password">
                  <div className="update">
                    <div className="heading black f-14 bold600">Password</div>
                    <div onClick={() => setEditPassword(true)} className="change-pass">
                      Change password
                    </div>

                  </div>
                  <div className="heading secondary60 f-14 bold400">Update password for improved security.</div>
                </div>
              }

            </>
        }
      </div>
      <div className='profile_reset_pass' >
        <div className='pass-left'>
          {
            editPassword &&
            <UpdatePasswordForm
              isOpen={editPassword}
              setIsOpen={setEditPassword}
              handleSubmitPassword={handleSubmitPassword}
              loading={loading}
            />
          }
        </div>
      </div>
    </>
  );
};

export default ProfileView;
