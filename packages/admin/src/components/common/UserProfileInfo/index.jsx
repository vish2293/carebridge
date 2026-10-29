/* eslint-disable react/prop-types */
import { Button } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { viewHistoryIcon } from "../../../assets/icons";
import { getNumericDate } from "../../../helpers";
import EditProfileQuestion from "../EditProfileQuestion";

const UserProfileInfo = ({ setEditProfile, loggedInUser, editProfile, singleUser, handleClickModal }) => {

    return (
        <div className="question-tab">
            {editProfile === true || singleUser?.profileQuestion?.length === 0 ? (
                <EditProfileQuestion
                    editProfile={editProfile}
                    loggedInUser={loggedInUser}
                    singleUser={singleUser}
                    setEditProfile={setEditProfile}
                />
            ) : (
                <>
                    <div className="accept-reject profile-que">
                        {(loggedInUser?.role === "Super_Admin" ||
                            loggedInUser?.role === "Program_Administrator") && <Link onClick={() => handleClickModal("viewQuestionHistory", true)}>{viewHistoryIcon}</Link>}
                        <Button className='edit-btn yellow-btn' type="primary" onClick={() => { setEditProfile(true); }}>Edit Question</Button>
                    </div>

                    <div className="user_contact_info">
                        {singleUser?.profileQuestion?.map((item, i) => {
                            const values = item?.question?.questionML?.map((question) => question?.value);
                            const isDate = dayjs(item?.answer[0]?.answer).isValid();
                            const combinedTranslation = isDate ? getNumericDate(item?.answer[0]?.answer) : item?.answer?.map((ans) => ans?.answer)?.filter((answer) => answer)?.join("/")
                            return (
                                <div className='contact-info' key={i}>
                                    <div className='heading black f-14 bold600'>Q. {`${i + 1}`} {values?.join(" / ")}</div>
                                    <div className='heading secondary60 f-14 bold400'>Answer: {combinedTranslation}</div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default UserProfileInfo;
