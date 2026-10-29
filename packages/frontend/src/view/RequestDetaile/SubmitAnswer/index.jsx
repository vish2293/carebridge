import React from 'react'
import SubmitAnswerForm from './SubmitAnswerForm'
import { useDispatch } from 'react-redux'
import { answerQuestion } from '../../../redux/actions/request'
import SubmitedDetaile from './SubmitedDetaile'


const SubmitAnswer = ({ requestQuestions, requestDetaile }) => {
    //For dispatch
    const dispatch = useDispatch()

    //For submit answer
    const handleSubmit = (values) => {
        values.validateFields().then((values) => {
            const answer = Object.keys(values).map((key) => ({
                _id: key,
                answer: values[key],
            }));
            dispatch(answerQuestion({ answer: answer, reqId: requestDetaile?._id }))
        })


    }
    
    return (
        <div className='questioner'>
            {/* <div className='dashboard-heading'>Questionnaire</div> */}
            
            {
                
                requestDetaile?.is_answer_given !== undefined && requestDetaile?.is_answer_given === true ?                
                <SubmitedDetaile data={requestQuestions}/>
                    :
                <SubmitAnswerForm data={requestQuestions} handleSubmit={handleSubmit} />
                    
                    
            }
        </div>
    )
}

export default SubmitAnswer
