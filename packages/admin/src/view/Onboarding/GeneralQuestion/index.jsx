import { Checkbox, DatePicker, Form, Input, Radio } from "antd"
import { disabledBirthDate } from "../../../helpers"
import { useSelector } from "react-redux"
import React from "react"
import { CustomScroll } from "react-custom-scroll"

const GenralQuestion = ({ form, onFinish, handleGenralChange }) => {
    const { onboardingQuestionLoading, profileQuestionList } = useSelector((state) => state.question)
    return (
        <>
            <div className="onboard-head">Fill Identity Questions</div>
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
            >

                {
                    profileQuestionList?.slice()?.filter((filterItems) => filterItems?.category === "")?.map((questionItems, i) => {
                        const values = questionItems?.questionML?.map((question) => question.value);
                        return (

                            <React.Fragment key={i}>

                                {
                                    questionItems?.answers?.answer_type === "text" &&
                                    <Form.Item label={`Q. ${i + 1} ${values.join(" / ")} `} name={`${questionItems?._id}`} rules={[{ required: true, message: "This field is required" }]}>
                                        <Input placeholder='Enter your answer' onChange={(e) => handleGenralChange(questionItems?._id, e?.target?.value)} />
                                    </Form.Item>
                                }
                                {
                                    questionItems?.answers?.answer_type === "textArea" &&
                                    <Form.Item label={`Q. ${i + 1} ${values.join(" / ")} `} name={`${questionItems?._id}`} rules={[{ required: true, message: "This field is required" }]}>
                                        <Input.TextArea placeholder='Enter your answer' onChange={(e) => handleGenralChange(questionItems?._id, e?.target?.value)} />
                                    </Form.Item>
                                }
                                {
                                    questionItems?.answers?.answer_type === "date" &&
                                    <Form.Item label={`Q. ${i + 1} ${values.join(" / ")}`} name={`${questionItems?._id}`} rules={[{ required: true, message: "This field is required" }]}>
                                        <DatePicker format="MM/DD/YYYY" placeholder={values.join(" / ")} disabledDate={disabledBirthDate} onChange={(value) => handleGenralChange(questionItems?._id, value)} />
                                    </Form.Item>
                                }
                                {
                                    questionItems?.answers?.answer_type === "radio" &&

                                    <Form.Item label={`Q. ${i + 1}  ${values.join(" / ")}`} name={`${questionItems?._id}`} rules={[{ required: true, message: "This field is required" }]}>
                                        <Radio.Group>
                                            {
                                                questionItems?.answers?.answersML.length > 0 &&
                                                questionItems?.answers?.answersML.map((a, ai) => {
                                                    return (
                                                        <Radio key={ai} value={`${a?.values?.en} ${a?.values?.es ? `/ ${a?.values?.es}` : ""}`}
                                                            className="heading secondary60 f-14 bold400" onChange={(e) => handleGenralChange(questionItems?._id, e?.target?.value)}>
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
            </Form>
        </>
    )
}
export default GenralQuestion