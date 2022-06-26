import React, {useEffect, useState} from 'react';
//Icons
import arrowLeft from '../../assets/icons/arrowLeft.svg'
import arrowRight from '../../assets/icons/arrowRight.svg'
import arrowUp from '../../assets/icons/arrowUp.svg'
import arrowDown from '../../assets/icons/arrowDown.svg'
import contrastMinus from '../../assets/icons/brightnessMinus.svg'
import contrastPlus from '../../assets/icons/brightnessPlus.svg'
import saturationMinus from '../../assets/icons/saturationMinus.svg'
import saturationPlus from '../../assets/icons/saturationPlus.svg'
import zoomIn from '../../assets/icons/ZoomIn.svg'
import zoomOut from '../../assets/icons/ZoomOut.svg'
import invert from '../../assets/icons/invert.svg'
import cancel from '../../assets/icons/cancel.svg'
import turnLeft from '../../assets/icons/turnLeft.svg'
import turnRight from "../../assets/icons/turnRight.svg"
import Icon from "./Icon";
import css from './CommandBar.css';

function CommandBar(props) {
    const iconSetting = {width: 60, height: 60};

    const standardActivation = {
        zoomInActive: false,
        zoomOutActive: false,
        goLeftActive: false,
        goUpActive: false,
        goDownActive: false,
        goRightActive: false,
        layerUpActive: false,
        layerDownActive: false,
        brigthnessDownActive: false,
        brigthnessUpActive: false,
        saturationDownActive: false,
        saturationUpActive: false,
        invertActive: false,
        cancelActive: false,
        menu1Active: false,
        menu2Active: false,
        turnLeftActive: false,
        turnRightActive: false,
    }

    const [activeStatus, setActiveStatus] = useState(
        standardActivation
    );

    useEffect(() => {
        switch (props.selectedCommand) {
            case "":
                break;
            case "zoomIn":
                activateButton("zoomInActive");
                break;
            case "zoomOut":
                activateButton("zoomOutActive");
                break;
            case "goLeft":
                activateButton("goLeftActive");
                break;
            case "goUp":
                activateButton("goUpActive");
                break;
            case "goDown":
                activateButton("goDownActive");
                break;
            case "goRight":
                activateButton("goRightActive");
                break;
            case "layerUp":
                activateButton("layerUpActive");
                break;
            case "layerDown":
                activateButton("layerDownActive");
                break;
            case "brightnessDown":
                activateButton("brigthnessDownActive");
                break;
            case "brightnessUp":
                activateButton("brigthnessUpActive");
                break;
            case "saturationDown":
                activateButton("saturationDownActive");
                break;
            case "saturationUp":
                activateButton("saturationUpActive");
                break;
            case "invert":
                activateButton("invertActive");
                break;
            case "default":
                activateButton("defaultActive");
                break;
            case "turnLeft":
                activateButton("turnLeftActive");
                break;
            case "turnRight":
                activateButton("turnRightActive");
                break;
            default:
                break;
        }
    }, [props.selectedCommand])

    function activateButton(name) {
        setActiveStatus(prevState => ({...prevState, [name]: true}));

        setTimeout(function () {
            setActiveStatus(prevState => ({...prevState, [name]: false}));
        }, 500);
    }


    function menuBarTotal() {
        return (<>
                <Icon icon={zoomOut} isActive={activeStatus.zoomOutActive} width={iconSetting.width}
                      height={iconSetting.height}/>
                <Icon icon={zoomIn} isActive={activeStatus.zoomInActive} width={iconSetting.width}
                      height={iconSetting.height}/>
                <Icon icon={arrowLeft} isActive={activeStatus.goLeftActive} width={iconSetting.width}
                      height={iconSetting.height}/>
                <Icon icon={arrowUp} isActive={activeStatus.goUpActive} width={iconSetting.width}
                      height={iconSetting.height}/>
                <Icon icon={arrowDown} isActive={activeStatus.goDownActive} width={iconSetting.width}
                      height={iconSetting.height}/>
                <Icon icon={arrowRight} isActive={activeStatus.goRightActive} width={iconSetting.width}
                      height={iconSetting.height}/>
                <Icon icon={saturationMinus} isActive={activeStatus.brigthnessDownActive} width={iconSetting.width}
                      height={iconSetting.height}/>
                <Icon icon={saturationPlus} isActive={activeStatus.brigthnessUpActive} width={iconSetting.width}
                      height={iconSetting.height}/>
                <Icon icon={contrastMinus} isActive={activeStatus.saturationDownActive} width={iconSetting.width}
                      height={iconSetting.height}/>
                <Icon icon={contrastPlus} isActive={activeStatus.saturationUpActive} width={iconSetting.width}
                      height={iconSetting.height}/>
                <Icon icon={invert} isActive={activeStatus.invertActive} width={iconSetting.width}
                      height={iconSetting.height}/>
                <Icon icon={cancel} isActive={activeStatus.cancelActive} width={iconSetting.width}
                      height={iconSetting.height}/>
                <Icon icon={turnLeft} isActive={activeStatus.turnLeftActive} width={iconSetting.width}
                      height={iconSetting.height}/>
                <Icon icon={turnRight} isActive={activeStatus.turnRightActive} width={iconSetting.width}
                      height={iconSetting.height}/>

            </>
        )
    }

    return (
        <div style={{margin: "20px"}}>
            <div className={css.containerIcons}>
                {menuBarTotal()}
            </div>
        </div>
    )
        ;
}


export default CommandBar;