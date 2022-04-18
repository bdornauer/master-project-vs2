import {Button, ButtonGroup, Col, Container, Row} from "react-bootstrap";
import DicomViewer from "./dicomViewer/DicomViewer";
import {useEffect, useRef, useState} from "react";
import KeyController from "./controllers/KeyController";
import CommandBar from "./commandBar/CommandBar";
import {Header} from "./Header";
import {BsCameraVideo, BsCameraVideoOff, BsMic, BsMicMute} from "react-icons/bs";


export function WebController() {

    const [micOn, setMicOn] = useState(false);
    const [webcamOn, setWebcamOn] = useState(false);

    //General
    const [selectedCommand, setSelectedCommand] = useState("")

    //Webcam
    const [currentPrediction, setCurrentPredictionString] = useState("")
    const [isCameraOn, setIsCameraOn] = useState(false)
    const [screenWidth, setScreenWidht] = useState(640)
    const [screenHeight, setScreenHeight] = useState(480)
    const [iconSize, setIconSize] = useState(70)
    const [showTime, setShowTime] = useState(70)

    const video = useRef(null);
    const canvas = useRef(null)
    const grid = useRef(null)
    const iconsLayer = useRef(null)
    const highlighting = useRef(null)
    let canvas2dContext, model, activeMenuNr, startTime = 0, timePassed = 0;

    //Micro


    const eyeTrackingSettings = {
        flipHorizontal: true,   // flip e.g for video
        imageScaleFactor: 1,  // reduce input image size .
        maxNumBoxes: 5,        // maximum number of boxes to detect
    }

    //Settings
    KeyController.supressKey()

    /**
     * pressedKeyAction depended on the pressed key, the selectedCommand is set to the specific value
     * @param e
     */
    function pressedKeyAction(pressedKey) {
        setTimeout(() => {
            setSelectedCommand("");
        }, 200);

        let commandToKey = KeyController.keySelectionCommand(pressedKey.key);
        setSelectedCommand(commandToKey);
    }

    /**
     * If key is keydown, the pressedKeyAction is called.
     */
    useEffect(() => {
        document.addEventListener("keydown", pressedKeyAction);
    })


    return (<Container style={{maxWidth: '100%', maxHeight: '100%'}}>
        <Row>
            <Header/>
        </Row>
        <Row>
            <CommandBar selectedCommand={selectedCommand}></CommandBar>
        </Row>
        <Row>
            <Col xs={6}>
                <div style={{paddingLeft: "20%", paddingRight: "20%"}}>
                    <ButtonGroup className="mb-3">
                        <Button variant="secondary"
                                style={micOn ? {"backgroundColor": "#2a9325"} : {"backgroundColor": "#e34c30"}}
                                onClick={() => setMicOn(!micOn)}>
                            {micOn ? <BsMic/> : <BsMicMute/>}
                            Mikro
                        </Button>
                        <Button variant="secondary"
                                style={webcamOn ? {"backgroundColor": "#2a9325"} : {"backgroundColor": "#e34c30"}}
                                onClick={() => setWebcamOn(!webcamOn)}>
                            {webcamOn ? <BsCameraVideo/> : <BsCameraVideoOff/>}
                            Webcam
                        </Button>
                    </ButtonGroup>
                    <div>
                        Webcam
                        <video ref={video} width={screenWidth} height={screenHeight} style={{visibility: "hidden"}}/>
                    </div>
                    <div>
                        Mikrofon
                    </div>
                    <div>
                        Information
                    </div>
                </div>
            </Col>
            <Col><DicomViewer selectedCommand={selectedCommand}/></Col>
        </Row>
    </Container>);
}