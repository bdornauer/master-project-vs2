import {Button, ButtonGroup, Col, Container, ListGroup, ListGroupItem, Modal, Row} from "react-bootstrap";
import DicomViewer from "./dicomViewer/DicomViewer";
import {useEffect, useRef, useState} from "react";
import CommandBar from "./commandBar/CommandBar";
import {Header} from "./Header";
import * as handTrack from 'handtrackjs';
import {BsCameraVideo, BsCameraVideoOff, BsMic, BsMicMute} from "react-icons/bs";
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import confirmSound from "../assets/confirmSound.wav"

import {
    filterPinchAndClosedHandGesture,
    calculateCenterOfBBox,
    containsPredictions,
    positionInGrid,
    drawIconsMenu1,
    drawIconsMenu2,
    drawGridOverlay,
    removeCanvasLayer,
    highlightSectionActive
} from "./controllers/HandtrackController";

import {keySelectionCommand, supressKey} from "./controllers/KeyboardController";
import {
    containsSignalWord,
    extractFirstNumberInStringArray,
    filterCommands,
    setCommandFromVoiceCommand,
    transcriptToWordArray,
    stringTranscriptToLowerCase
} from "./controllers/SpeechController";

import {InformationController} from "./informationController/InformationController";

import useSound from "use-sound";

export function WebController(props) {

    //Select selection
    const [isMicOn, setIsMicOn] = useState(false);
    const [isWebcamOn, setIsWebcamOn] = useState(false);

    //General
    const [selectedCommand, setSelectedCommand] = useState("")

    //Webcam
    const [isWebcamInitNotDone, setIsWebcamInitNotDone] = useState(true);
    const [webcamWidth] = useState(window.innerWidth * 0.42) //640
    const [webcamHeight] = useState(webcamWidth * 0.75) //480
    const [iconSize] = useState(webcamWidth * 0.12)

    const video = useRef(null);
    const webcamLayer = useRef(null)
    const gridLayer = useRef(null)
    const iconsLayer = useRef(null)
    const highlightingLayer = useRef(null)

    //Micro
    const {transcript, resetTranscript} = useSpeechRecognition();
    const [playConfirmSound] = useSound(confirmSound);
    const [isSignalWordDetected, setIsSignalWordDetected] = useState(false)
    const [steps, setSteps] = useState(false)

    //information Modal
    const [showInformation, setShowInformation] = useState(false);

    const handleCloseInformation = () => setShowInformation(false);
    const handleShowInformation = () => setShowInformation(true);

    let canvas2dContext, model, activeMenuNr = 1, startTime = 0, timePassed = 0;


    /****************************************************************************************************
     * MICRO Controller
     *************************************************************************************************** */

    useEffect(() => {
        if (props.modus === "speech" || props.modus === "multimodal") {
            startVoiceControl();
        }
    }, [props.modus])


    function startVoiceControl() {
        setIsMicOn(true);
        SpeechRecognition.startListening({continuous: true});
    }

    function stopVoiceControl() {
        setIsMicOn(false);
        SpeechRecognition.stopListening()
    }

    //runs if new voice input is detected
    useEffect(() => {
        //extract information from transcript (1)
        let transcriptLowerCase = stringTranscriptToLowerCase(transcript);
        let arrayTranscript = transcriptToWordArray(transcriptLowerCase);
        let filteredArrayTranscript = filterCommands(arrayTranscript);

        if (containsSignalWord(filteredArrayTranscript)) {
            playConfirmSound();
            setIsSignalWordDetected(true)
            resetTranscript();
        } else {
            if(isSignalWordDetected){
                //extract command information from transcript (2)
                const stepsExtracted = extractFirstNumberInStringArray(arrayTranscript)
                const possibleCommand = filteredArrayTranscript.join(' ').toString();
                const specificCommaned = setCommandFromVoiceCommand(possibleCommand);

                //a valid command is detected
                if (specificCommaned !== "") {
                    setSteps(parseInt(stepsExtracted));
                    setSelectedCommand(specificCommaned);

                    setTimeout(() => {
                        setSelectedCommand("");
                    }, 200);

                    resetTranscript();
                }
            }

            // after 5 words after singal, singal word must be expressed again
            if (arrayTranscript.length > 5) {
                resetTranscript();
                setSteps(1);
            }
        }

    }, [transcript]);


    /****************************************************************************************************
     * WEBCAM Controller
     *************************************************************************************************** */
    const eyeTrackingSettings = {
        flipHorizontal: true,   // flip e.g for video
        imageScaleFactor: 1,  // reduce input image size .
        maxNumBoxes: 5,        // maximum number of boxes to detect
    }

    const start = async () => {
        setIsWebcamOn(true)
        model = await handTrack.load(eyeTrackingSettings);
        canvas2dContext = webcamLayer.current.getContext('2d');
        console.log(webcamWidth)
        removeCanvasLayer(iconsLayer, webcamWidth, webcamHeight)
        await handTrack.startVideo(video.current);
        drawGridOverlay(gridLayer, webcamWidth, webcamHeight);
        drawIconsMenu1(iconsLayer, iconSize, webcamWidth, webcamHeight);
    }

    const stop = async () => {
        setIsWebcamOn(false)
        await handTrack.stopVideo();
    }

    const begin = async () => {
        setIsWebcamOn(true)
    }

    useEffect(() => {
        begin();
        if (isWebcamOn || isWebcamInitNotDone && (props.modus === "gesture" || props.modus === "multimodal")) {
            setIsWebcamInitNotDone(false);
            start().then(() => detectHandsInVideo())
        } else {
            stop()
        }
    }, [isWebcamOn])

    function detectHandsInVideo() {
        model.detect(video.current).then(predictions => {
            const filteredPredictions = filterPinchAndClosedHandGesture(predictions);
            //calculating the values to decide where
            if (containsPredictions(filteredPredictions)) {
                const bBox = filteredPredictions[0].bbox; //only get the first detected value
                const centerOfBBox = calculateCenterOfBBox(bBox[0], bBox[1], bBox[2], bBox[3]) //position of pinch or closed Hand
                const gridPosition = positionInGrid(centerOfBBox[0], centerOfBBox[1], webcamWidth, webcamHeight) //decided in 3x3 gridLayer were gesture ist detected
                timePassed = performance.now() - startTime;

                controlCommandPalet(gridPosition);
                highlightSectionActive(gridPosition, highlightingLayer, webcamWidth, webcamHeight)
            } else {
                startTime = performance.now();
                timePassed = 0
                removeCanvasLayer(highlightingLayer, webcamWidth, webcamHeight);
            }

            model.renderPredictions(predictions, webcamLayer.current, canvas2dContext, video.current);
            window.requestAnimationFrame(detectHandsInVideo);
        });
    }


    function controlCommandPalet(gridSection) {
        let selection = "";
        if (timePassed > 500) {
            startTime = performance.now();
            timePassed = 0
            if (activeMenuNr === 1) {
                switch (gridSection) {
                    case "topLeft":
                        selection = "zoomOut"
                        break;
                    case "topCenter":
                        selection = "goUp"
                        break;
                    case "topRight":
                        selection = "zoomIn"
                        break;
                    case "centerLeft":
                        selection = "goLeft"
                        break;
                    case "centerCenter":
                        activeMenuNr = 2
                        removeCanvasLayer(iconsLayer, webcamWidth, webcamHeight);
                        drawIconsMenu2(iconsLayer, iconSize, webcamWidth, webcamHeight)
                        break;
                    case "centerRight":
                        selection = "goRight"
                        break;
                    case "bottomLeft":
                        selection = "brightnessDown"
                        break;
                    case "bottomCenter":
                        selection = "goDown"
                        break;
                    case "bottomRight":
                        selection = "brightnessUp"
                        break;
                    default:
                        break;
                }
            } else {
                switch (gridSection) {
                    case "topLeft":
                        selection = "saturationDown"
                        break;
                    case "topCenter":
                        break;
                    case "topRight":
                        selection = "saturationUp"
                        break;
                    case "centerLeft":
                        selection = "invert"
                        break;
                    case "centerCenter":
                        activeMenuNr = 1
                        removeCanvasLayer(iconsLayer, webcamWidth, webcamHeight)
                        drawIconsMenu1(iconsLayer, iconSize, webcamWidth, webcamHeight)
                        break;
                    case "centerRight":
                        selection = "default"
                        break;
                    case "bottomLeft":
                        selection = "turnLeft"
                        break;
                    case "bottomCenter":
                        break;
                    case "bottomRight":
                        selection = "turnRight"
                        break;
                    default:
                        break;
                }
            }
        }
        setSteps(1);

        setTimeout(() => {
            setSelectedCommand("");
        }, 200);

        setSelectedCommand(selection);

    }

    /****************************************************************************************************
     * MOUSE Controller
     *************************************************************************************************** */
    /**
     * pressedKeyAction depended on the pressed key, the selectedCommand is set to the specific value
     * @param e
     */
    //Settings
    supressKey()

    function pressedKeyAction(pressedKey) {

        setTimeout(() => {
            setSelectedCommand("");
        }, 200);

        let commandToKey = keySelectionCommand(pressedKey.key);
        setSelectedCommand(commandToKey);
    }

    /**
     * If key is keydown, the pressedKeyAction is called.
     */
    useEffect(() => {
        document.addEventListener("keydown", pressedKeyAction);
    })

    /****************************************************************************************************
     * VIEW
     *************************************************************************************************** */
    return (<Container style={{maxWidth: '100%', maxHeight: '100%'}}>
        <Row>
            <Header/>
        </Row>
        <Row>
            <CommandBar selectedCommand={selectedCommand}/>
        </Row>
        <Row>
            <Col xs={6}>
                <div style={{
                    padding: "3%", border: "5px solid #1C6EA4", borderRadius: "14px", alignContent: "center"
                }}>
                    <ButtonGroup className="mb-3">
                        <Button variant="secondary"
                                style={isMicOn ? {"backgroundColor": "#2a9325"} : {"backgroundColor": "#e34c30"}}
                                onClick={() => isMicOn ? stopVoiceControl() : startVoiceControl()}>
                            {isMicOn ? <BsMic/> : <BsMicMute/>}
                            Micro
                        </Button>
                        <Button variant="secondary"
                                style={isWebcamOn ? {"backgroundColor": "#2a9325"} : {"backgroundColor": "#e34c30"}}
                                onClick={() => isWebcamOn ? setIsWebcamOn(false) : setIsWebcamOn(true)}>
                            {isWebcamOn ? <BsCameraVideo/> : <BsCameraVideoOff/>}
                            Webcam
                        </Button>
                        <Button variant="secondary" onClick={handleShowInformation}>
                            Information
                        </Button>
                    </ButtonGroup>
                    <div>
                        <ListGroup componentClass="ul" style={{padding: "3%"}}>
                            <ListGroupItem>
                                Eingabe: {transcript}
                            </ListGroupItem>
                        </ListGroup>
                    </div>

                    <div>
                        <div style={{
                            position: "relative", width: webcamWidth, height: webcamHeight,
                        }}>
                            <video ref={video} width={webcamWidth} height={webcamHeight} style={{
                                position: "absolute", width: webcamWidth, height: webcamHeight, top: "0", left: "0"
                            }}/>
                            <canvas ref={webcamLayer} width={webcamWidth} height={webcamHeight}
                                    style={{
                                        position: "absolute", top: "0", left: "0", zIndex: "0",
                                    }}/>
                            <canvas ref={gridLayer} width={webcamWidth} height={webcamHeight}
                                    style={{
                                        position: "absolute", left: "0", top: "0", zIndex: "1",
                                    }}/>
                            <canvas ref={highlightingLayer} width={webcamWidth} height={webcamHeight}
                                    style={{
                                        position: "absolute", left: "0", top: "0", zIndex: "2",
                                    }}/>
                            <canvas ref={iconsLayer} width={webcamWidth} height={webcamHeight}
                                    style={{
                                        position: "absolute", left: "0", top: "0", zIndex: "2",
                                    }}/>
                        </div>

                    </div>
                </div>
            </Col>
            <Col xs={6} style={{padding: "3%", border: "5px solid #1C6EA4", borderRadius: "14px"}}>
                <DicomViewer selectedCommand={selectedCommand} steps={steps}/>
            </Col>
            <>
                <Modal show={showInformation} onHide={handleCloseInformation} size={"xl"}
                       aria-labelledby="contained-modal-title-vcenter"
                       media="print" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Beschreibung der Funktionalitäten</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <InformationController/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseInformation}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>

        </Row>


    </Container>);
}