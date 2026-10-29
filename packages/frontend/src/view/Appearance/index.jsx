import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setActiveHeader } from "../../redux/slices/headerSlice"
import { Button, ColorPicker } from "antd"
import { updateAppearance } from "../../redux/actions/appearance"
import { useSelector } from "react-redux"
import './style.scss'

const Appearance = () => {
    const { appearanceList, appearanceLoading, updateAppearanceLoading } = useSelector((state) => state.appearance);
    const dispatch = useDispatch()
    const [buttonColor, setButtonColor] = useState({ primary: "#0F766E", secondary: "#1E293B", tertiary: "#1677FF", })
    const [buttonTextColor, setButtonTextColor] = useState({ buttonTextColor: "#000000" })
    const [textColor, setTextColor] = useState({ primary: "#141414", secondary: "#404040" })

    useEffect(() => {
        dispatch(setActiveHeader({ name: "appearance", heading: "Appearance" }))
    }, [])

    useEffect(() => {
        setTextColor({
            primary: appearanceList?.textColor?.primary,
            secondary: appearanceList?.textColor?.secondary,
        })
    }, [appearanceList?.textColor])

    useEffect(() => {
        setButtonTextColor({
            buttonTextColor: appearanceList?.buttonTextColor
        })
    }, [appearanceList?.buttonTextColor])

    useEffect(() => {
        setButtonColor({
            primary: appearanceList?.buttonColor?.primary,
            secondary: appearanceList?.buttonColor?.secondary,
            tertiary: appearanceList?.buttonColor?.tertiary,
            buttonTextColor: appearanceList?.buttonTextColor
        })
    }, [appearanceList?.buttonColor])

    const onChangeButtonColor = (colorKey, colorValue) => {
        if (colorKey === "primary") {
            document.documentElement.style.setProperty('--yellow-btn', colorValue.toHexString());
        } else if (colorKey === "secondary") {
            document.documentElement.style.setProperty('--rich-black-btn', colorValue.toHexString());
        }
        setButtonColor(prev => ({
            ...prev,
            [colorKey]: colorValue.toHexString()
        }))
    }

    const onChangeButtonTextColor = (colorKey, colorValue) => {
        if (colorKey === "buttonTextColor") {
            document.documentElement.style.setProperty('--rich-black-btn-text', colorValue.toHexString());
        }
        setButtonTextColor(prev => ({
            ...prev,
            [colorKey]: colorValue.toHexString()
        }))
    }

    const onChangeTextColor = (colorKey, colorValue) => {
        setTextColor(prev => ({
            ...prev,
            [colorKey]: colorValue.toHexString()
        }))
    }

    const onClickToReset = () => {
        const payload = {
            textColor: { primary: "#141414", secondary: "#404040" },
            buttonColor: { primary: "#0F766E", secondary: "#1E293B", tertiary: "#1677FF" },
            buttonTextColor: "#ffffff"
        }
        dispatch(updateAppearance({ payload: payload }))
    }

    const onClickSaveChanges = () => {
        const payload = {
            textColor,
            buttonColor,
            buttonTextColor: buttonTextColor?.buttonTextColor
        }
        dispatch(updateAppearance({ payload: payload }))
    }
    return (

        <div className="profile_wrapper">
            <div className="apperence-sec">
                <div className="appearance-head">Theme</div>
                <div className="apperence-content">Customize your appearance</div>
            </div>
            <div className="appearance-container">
                <div className="apperence-btn-text">
                    <div className="contact-info">
                        <div className="heading f-14 black bold600">Button Color</div>
                        <div className="heading f-14 secondary60 bold400">Choose your button color</div>
                    </div>
                    <div className="color-picker">
                        <ColorPicker className="primary-active" format="hex" value={buttonColor.primary} onChange={(value) => onChangeButtonColor("primary", value)} />
                        <ColorPicker className="secondary-active" format="hex" value={buttonColor?.secondary} onChange={(value) => onChangeButtonColor("secondary", value)} />
                        <ColorPicker className="active" format="hex" value={buttonColor?.tertiary} onChange={(value) => onChangeButtonColor("tertiary", value)} />
                    </div>
                </div>
                <div className="apperence-btn-text">
                    <div className="contact-info">
                        <div className="heading f-14 black bold600">Button Text Color</div>
                        <div className="heading f-14 secondary60 bold400">Choose your button text color</div>
                    </div>
                    <div className="color-picker">
                        <ColorPicker className="btn-active" format="hex" value={buttonTextColor.buttonTextColor} onChange={(value) => onChangeButtonTextColor("buttonTextColor", value)} />
                    </div>
                </div>
                <div className="apperence-btn-text">
                    <div className="contact-info">
                        <div className="heading f-14 black bold600">Text Color</div>
                        <div className="heading f-14 secondary60 bold400">Choose your text color</div>
                    </div>
                    <div className="color-picker">
                        <ColorPicker className="text-primary" value={textColor?.primary} onChange={(value) => onChangeTextColor("primary", value)} />
                        <ColorPicker className="text-secondary" value={textColor?.secondary} onChange={(value) => onChangeTextColor("secondary", value)} />
                    </div>
                </div>

            </div>
            <div className="save-change">
                <Button onClick={onClickToReset} loading={updateAppearanceLoading} disabled={updateAppearanceLoading}>Reset to Default</Button>
                <Button type="primary" className="yellow-btn" onClick={onClickSaveChanges} loading={updateAppearanceLoading} disabled={updateAppearanceLoading}>Save Changes</Button>
            </div>
        </div>
    )
}
export default Appearance