import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveHeader } from "../../redux/slices/headerSlice";
import ProfileView from "./ProfileView";
import UserProfileInfo from "../../components/common/UserProfileInfo";

const Profile = () => {
  //for reducer
  const { loggedInUser } = useSelector((state) => state.user);
  //for dispatch
  const dispatch = useDispatch();
  const [editProfile, setEditProfile] = useState(loggedInUser?.profileQuestion?.length === 0 ? true : false);
  
  useEffect(() => {
    dispatch(setActiveHeader({ name: "profile", heading: "My Profile" }));
  }, []);
  
  return (
    <div className={`profile_wrapper ${loggedInUser?.role === "Client" ? "user-profile" : ""}`}>
      {
        loggedInUser?.role === "Client" ?
        <div className="user-left">
          <ProfileView 
            loggedInUser={loggedInUser}
          />
        </div>
        :
        <ProfileView 
          loggedInUser={loggedInUser}
        />
      }
      {
        loggedInUser?.role === "Client" && 
        <div className="user-right">
            <UserProfileInfo 
              singleUser={loggedInUser}
              loggedInUser={loggedInUser}
              setEditProfile={setEditProfile}
              editProfile={editProfile}
            /> 
        </div>
      }
    </div>
  );
};

export default Profile;
