import { Button } from "antd"
import { useNavigate } from "react-router-dom"
import { PATH_LIST } from "../../../constant/path-list"
import { submitIcon } from "../../../assets/icons"

const SuccessMessage = ({ homeButton, icon }) => {
    const navigate = useNavigate()
    return (
        <div className="sucess-msg">
            {
                icon &&
                <div>
                    {submitIcon}
                </div>
            }

            <div className="submitted-head">Your request has been submitted</div>
            <div className="submitted-des">Thank you for contacting us. Our team is actively reviewing your request and will follow up with you shortly.</div>
            {homeButton && <Button onClick={() => navigate(PATH_LIST.home)} type="primary" className="yellow-btn">Okay</Button>}
        </div>
    )
}
export default SuccessMessage