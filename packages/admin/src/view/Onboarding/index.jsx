import { Button, Form, Steps } from "antd";
import { useEffect, useState } from "react";
import BasicDetails from "./BasicDetails";
import GenralQuestion from "./GeneralQuestion";
import SituationQuestion from "./SituationQuestion";
import { useDispatch } from "react-redux";
import { newSignupUser } from "../../redux/actions/user";
import SuccessMessage from "./SuccessMessage";
import LogInHeader from "../../components/common/LogInHeader";
import "./style.scss"
import dayjs from "dayjs";
import { allOnBoardingQuestion, } from "../../redux/actions/question";
import { CustomScroll } from "react-custom-scroll";

const Onboarding = () => {
    const dispatch = useDispatch()
    const [current, setCurrent] = useState(0)
    const [basicForm] = Form.useForm()
    const [generalForm] = Form.useForm()
    const [situationForm] = Form.useForm()
    const [basicDetail, setBasicDetail] = useState({})
    const [generDetail, setGeneralDetail] = useState({})
    const [situationDetail, setSituationDetail] = useState({})
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        dispatch(allOnBoardingQuestion())
    }, [])

    const next = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })

        basicForm.validateFields().then((values) => {
            Object.keys(values).length > 0 &&
                setCurrent(1);
        })

        generalForm.validateFields().then((values) => {
            Object.keys(values).length > 0 &&
                setCurrent(2)
        })

    };

    const prev = () => {
        setCurrent(current - 1);
    }

    const handleBasicChange = (name, value) => {
        setBasicDetail({ ...basicDetail, [name]: value })
    }

    const handleGenralChange = (name, value) => {
        setGeneralDetail({ ...generDetail, [name]: value })
    }

    const handleSituationChange = (name, value) => {
        setSituationDetail({ ...situationDetail, [name]: value })
    }
    const formatAnswer = (detail) => Object.entries(detail).map(([question, answer]) => {
        const [en, es] = dayjs(answer).isValid() ? [answer, ""] : answer.includes("/") ? answer.split(" / ") : [answer, ""];
        return {
            question,
            key: ["en", "es"],
            answers: [en, es]
        };
    });

    const onClickSubmit = () => {
        situationForm.validateFields().then((values) => {
            Object.keys(values).length > 0
            setCurrent(3)
            const generalOutput = formatAnswer(generDetail)
            const situationOutput = formatAnswer(situationDetail)
            const payload = {
                firstName: basicDetail?.firstName,
                lastName: basicDetail?.lastName,
                phone: basicDetail?.Phone,
                email: basicDetail?.email,
                zipCode: basicDetail?.zipCode,
                birthDate: basicDetail?.birthDate,
                profileQuestions: [...generalOutput, ...situationOutput]
            }
            dispatch(newSignupUser({ payload })).then((res) => {
                if (res?.payload?.status === true) {
                    setSuccess(true)
                }
            })
        })

    }

    const steps = [
        {
            title: 'Basic Details',
            content: <BasicDetails form={basicForm} onFinish={onClickSubmit} handleBasicChange={handleBasicChange} />

        },
        {
            title: 'General Questions',
            content: <GenralQuestion form={generalForm} onFinish={onClickSubmit} handleGenralChange={handleGenralChange} />
        },
        {
            title: 'Situation Questions',
            content: <SituationQuestion form={situationForm} onFinish={onClickSubmit} handleSituationChange={handleSituationChange} />,
        },
        {
            title: 'Finished',
            content: <SuccessMessage homeButton={true} icon={false}/>,
        },
    ];

    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    return (
        <div className="onboarding">
            <LogInHeader isContact={true} />
            <div className="onboarding-stps">
                <Steps current={current} items={items} />
                {/* { */}
                {/* success ? <SuccessMessage /> : */}

                <div className="onboarding-form">
                    {steps[current].content}
                    {current !== 3 && <div className="btn-sec">
                        {current > 0 && <Button onClick={() => prev()}>Go back</Button>}
                        {current === 2 && <Button onClick={() => onClickSubmit()} className="yellow-btn" type="primary">Submit</Button>}
                        {current < 2 && <Button onClick={() => next()} className="yellow-btn" type="primary">Next</Button>}
                    </div>}
                </div>

                {/* } */}
            </div>
        </div>
    )
}
export default Onboarding