/* eslint-disable react/prop-types */
import { Button, DatePicker, Form, Input, Radio, message, Spin } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allOnBoardingQuestion, allProfileQuestion } from "../../../redux/actions/question";
import { updateClient, updateUser } from "../../../redux/actions/user";
import { disabledBirthDate, disabledDate } from "../../../helpers";

const EditProfileQuestion = ({ setEditProfile, editProfile, singleUser, loggedInUser }) => {

  const dispatch = useDispatch();
  const { profileQuestionList } = useSelector((state) => state.question);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(allOnBoardingQuestion());
  }, []);

  const handleUpdateProfileInfo = (values) => {
    const profileQuestion = Object.entries(values).map(([question, answer]) => {
      let answers = [];
      const isDate = dayjs(answer).isValid();
      if (isDate) {
        answers.push(answer);
      } else if (answer?.split("/")?.length >= 3) {
        let enAnswer = [];
        let esAnswer = [];
        answer?.split("/")?.forEach((item) => {
          if (item?.trim() === "Ella" || item?.trim() === "Él" || item?.trim() === "Ellos") {
            esAnswer?.push(item?.trim());
          } else {
            enAnswer?.push(item?.trim());
          }
        })
        answers.push(enAnswer?.join("/"));
        answers.push(esAnswer?.join("/"));
      } else if (typeof answer === "string" && answer.includes("/")) {
        const [enAnswer, esAnswer] = answer.split("/");
        answers.push(enAnswer.trim());
        answers.push(esAnswer.trim());
      } else {
        answers.push(answer);
      }
      return {
        question,
        keys: ["en", "es"],
        answers: answers,
      };
    });


    let payload = {
      profileQuestion
    };

    if (payload) {
      setLoading(true);
      loggedInUser?.role === "Client" ?
        dispatch(updateUser({ id: singleUser?._id, payload })).then(() => {
          setEditProfile(false);
          message.success("Your profile detail saved successfully!")
          setLoading(false)
        })
        :
        dispatch(updateClient({ id: singleUser?._id, payload })).then(() => {
          setEditProfile(false);
          message.success("Client Profile detail updated successfully!")
          setLoading(false)
        });
    }
  };

  const handleUpdateProfileInfoFailed = () => {
    message.error("Please fill all required fields check your detail");
  };

  const getAnswers = (value) => {
    if (value.length === 2 && value[0].answer && value[1].answer) {
      return value[0].answer + " / " + value[1].answer;
    } else {
      // Return only the "en" object
      return value.find(obj => obj.key === "en")?.answer;
    }
  }
  const initialValuesProfileInfo = singleUser?.profileQuestion?.reduce((acc, item) => {
    const isDate = dayjs(item?.answer[0]?.answer).isValid();
    const formattedAnswer = isDate ? dayjs(item?.answer[0]?.answer) : getAnswers(item?.answer)
    acc[item?.question?._id] = formattedAnswer;
    return acc;
  }, {});

  return (
    <>
      <Form
        layout='vertical'
        initialValues={initialValuesProfileInfo}
        onFinish={handleUpdateProfileInfo}
        onFinishFailed={handleUpdateProfileInfoFailed}
      >
        <div className="user_contact_info bottom-form">
          {singleUser?.profileQuestion?.length > 0 ?
            singleUser?.profileQuestion?.map((pq, i) => {
              const values = pq?.question?.questionML.map((question) => question.value);
              return (
                <React.Fragment key={i}>
                  {
                    pq?.question?.answers?.answer_type === "text" &&
                    <Form.Item label={`Q. ${i + 1} ${values.join(" / ")} `} name={`${pq?.question?._id}`} rules={[{ required: true, message: "This field is required" }]}>
                      <Input placeholder='Enter your answer' />
                    </Form.Item>
                  }
                  {
                    pq?.question?.answers?.answer_type === "textArea" &&
                    <Form.Item label={`Q. ${i + 1} ${values.join(" / ")} `} name={`${pq?.question?._id}`} rules={[{ required: true, message: "This field is required" }]}>
                      <Input placeholder='Enter your answer' />
                    </Form.Item>
                  }
                  {
                    pq?.question?.answers?.answer_type === "date" &&
                    <Form.Item label={`Q. ${i + 1} ${values.join(" / ")}`} name={`${pq?.question?._id}`} rules={[{ required: true, message: "This field is required" }]}>
                      <DatePicker format="MM/DD/YYYY" placeholder={values.join(" / ")} disabledDate={disabledBirthDate} />
                    </Form.Item>
                  }
                  {
                    pq?.question?.answers?.answer_type === "radio" &&

                    <Form.Item label={`Q. ${i + 1}  ${values.join(" / ")}`} name={`${pq?.question?._id}`} rules={[{ required: true, message: "This field is required" }]}>
                      <Radio.Group>
                        {
                          pq?.question?.answers?.answersML.length > 0 &&
                          pq?.question?.answers?.answersML.map((a, ai) => {
                            return (
                              <Radio key={ai} value={`${a?.values?.en} ${a?.values?.es ? `/ ${a?.values?.es}` : ""}`}
                                className="heading secondary60 f-14 bold400">
                                {a?.values?.en} {a?.values?.es ? `/ ${a?.values?.es}` : ""}
                              </Radio>

                            );
                          })
                        }
                      </Radio.Group>
                    </Form.Item>
                  }
                </React.Fragment>
              );
            }) :
            profileQuestionList.map((pq, i) => {
              const values = pq.questionML.map((question) => question.value);
              return (
                <React.Fragment key={i}>
                  {
                    pq?.answers?.answer_type === "text" &&
                    <Form.Item label={`Q. ${i + 1} ${values.join(" / ")} `} name={`${pq._id}`} rules={[{ required: true, message: "This field is required" }]}>
                      <Input placeholder='Enter your answer' />
                    </Form.Item>
                  }
                  {
                    pq?.answers?.answer_type === "textArea" &&
                    <Form.Item label={`Q. ${i + 1} ${values.join(" / ")} `} name={`${pq?._id}`} rules={[{ required: true, message: "This field is required" }]}>
                      <Input placeholder='Enter your answer' />
                    </Form.Item>
                  }
                  {
                    pq?.answers?.answer_type === "date" &&
                    <Form.Item label={`Q. ${i + 1} ${values.join(" / ")}`} name={`${pq._id}`} rules={[{ required: true, message: "This field is required" }]}>
                      <DatePicker format="MM/DD/YYYY" placeholder={values.join(" / ")} disabledDate={disabledBirthDate} />
                    </Form.Item>
                  }
                  {
                    pq?.answers?.answer_type === "radio" &&

                    <Form.Item label={`Q. ${i + 1}  ${values.join(" / ")}`} name={`${pq._id}`} rules={[{ required: true, message: "This field is required" }]}>
                      <Radio.Group>
                        {
                          pq?.answers?.answersML?.length > 0 &&
                          pq?.answers?.answersML?.map((a, ai) => {

                            return (
                              <Radio key={ai} value={`${a?.values?.en} ${a?.values?.es ? `/ ${a?.values?.es}` : ""}`}
                                className="heading secondary60 f-14 bold400">
                                {a?.values?.en} {a?.values?.es ? `/ ${a?.values?.es}` : ""}
                              </Radio>

                            );
                          })
                        }
                      </Radio.Group>
                    </Form.Item>
                  }
                </React.Fragment>
              );
            })
          }
        </div>
        <div className="accept-reject" style={{ paddingRight: '10px' }}>
          <Button htmlType="submit" loading={loading} className="reset-pass">Submit</Button>
          {editProfile && <Button onClick={() => setEditProfile(false)} className="reject-btn">Cancel</Button>}
        </div>
      </Form >
    </>
  )
};

export default EditProfileQuestion;
