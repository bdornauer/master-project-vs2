import {Button, ButtonGroup, Col, Container, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import DicomViewer from "./dicomViewer/DicomViewer";
import {useEffect, useRef, useState} from "react";
import CommandBar from "./commandBar/CommandBar";
import {Header} from "./Header";
import * as handTrack from 'handtrackjs';
import {BsCameraVideo, BsCameraVideoOff, BsFillMicFill, BsFillMicMuteFill, BsMic, BsMicMute} from "react-icons/bs";
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import confirmSound from "../assets/confirm.wav"

//Webcam
import {
    filterPinchAndClosedHandGesture,
    calculateCenterOfBBox,
    containsPredictions,
    positionInGrid,
    predictionPositionToString,
    drawIconsMenu1,
    drawIconsMenu2,
    drawGridOverlay,
    removeCanvasLayer,
    highlightSectionActive
} from "./controllers/WebcamController";

import {keySelectionCommand, supressKey} from "./controllers/KeyController";
import {
    containsSignalWord,
    filterCommands,
    transcriptToArray, transcriptToLowerCase
} from "./controllers/MicroController";
import useSound from "use-sound";

export function WebController() {
    const [play] = useSound(confirmSound );

    const [micOn, setMicOn] = useState(false);
    const [webcamOn, setWebcamOn] = useState(false);
    const [infoTest, setInfoTest] = useState("missing");

    //General
    const [selectedCommand, setSelectedCommand] = useState("")

    //Webcam
    const [currentPrediction, setCurrentPredictionString] = useState("")
    const [screenWidth] = useState(640)
    const [screenHeight] = useState(480)
    const [iconSize] = useState(70)
    const [showTime, setShowTime] = useState(70)


    const video = useRef(null);
    const canvas = useRef(null)
    const grid = useRef(null)
    const iconsLayer = useRef(null)
    const highlighting = useRef(null)
    let canvas2dContext, model, activeMenuNr = 1, startTime = 0, timePassed = 0;
    /****************************************************************************************************
     * MICRO Controller
     *************************************************************************************************** */

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    function startListening() {
        setMicOn(true);
        SpeechRecognition.startListening({continuous: true});
        //TODO: change possible settings: https://github.com/JamesBrill/react-speech-recognition/tree/8ecb6052949e47a3fae8c6978abb4253ee1d00f1
    }

    function stopListening() {
        setMicOn(false);
        SpeechRecognition.stopListening()
        //TODO: change possible settings: https://github.com/JamesBrill/react-speech-recognition/tree/8ecb6052949e47a3fae8c6978abb4253ee1d00f1
    }

    useEffect(() => {
        let stringTranscript = transcriptToLowerCase(transcript);
        let arrayTranscript = transcriptToArray(stringTranscript);
        let filteredArrayTranscript = filterCommands(arrayTranscript);

        console.log(filteredArrayTranscript)

        if(containsSignalWord(filteredArrayTranscript)){
            play()
        }

        setInfoTest(filteredArrayTranscript)
    }, [transcript]);

    /****************************************************************************************************
     * WEBCAM Controller
     *************************************************************************************************** */
    const eyeTrackingSettings = {
        flipHorizontal: true,   // flip e.g for video
        imageScaleFactor: 1,  // reduce input image size .
        maxNumBoxes: 5,        // maximum number of boxes to detect
    }

    useEffect(() => {
            const start = async () => {
                setWebcamOn(true)
                model = await handTrack.load(eyeTrackingSettings);
                canvas2dContext = canvas.current.getContext('2d');
                await handTrack.startVideo(video.current);
                drawGridOverlay(grid, screenWidth, screenHeight);
                drawIconsMenu1(iconsLayer, iconSize, screenWidth, screenHeight);

            }
            const stop = async () => {
                setWebcamOn(false)
                await handTrack.stopVideo();
            }

            if (webcamOn) {
                start().then(() => detectHandsInVideo())
            } else {
                stop()
            }
        }, [webcamOn]
    )

    function detectHandsInVideo() {
        model.detect(video.current).then(predictions => {
            const filteredPredictions = filterPinchAndClosedHandGesture(predictions);
            //calculating the values to decide where
            if (containsPredictions(filteredPredictions)) {
                const bBox = filteredPredictions[0].bbox; //only get the first detected value
                const centerOfBBox = calculateCenterOfBBox(bBox[0], bBox[1], bBox[2], bBox[3]) //position of pinch or closed Hand
                const gridPosition = positionInGrid(centerOfBBox[0], centerOfBBox[1], screenWidth, screenHeight) //decided in 3x3 grid were gesture ist detected
                timePassed = performance.now() - startTime;
                setShowTime(timePassed);
                controlCommandPalet(gridPosition);
                highlightSectionActive(gridPosition, highlighting, screenWidth, screenHeight)
                const positionString = predictionPositionToString(centerOfBBox[0], centerOfBBox[1])
                setCurrentPredictionString("Position: " + positionString + " in Grid " + gridPosition);
            } else {
                startTime = performance.now();
                timePassed = 0
                setShowTime(timePassed);
                removeCanvasLayer(highlighting, screenWidth, screenHeight);
                setCurrentPredictionString("Nothing detected");
            }

            model.renderPredictions(predictions, canvas.current, canvas2dContext, video.current);
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
                        console.log("topLeft");
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
                        removeCanvasLayer(iconsLayer, screenWidth, screenHeight)
                        drawIconsMenu2(iconsLayer, iconSize, screenWidth, screenHeight)
                        activeMenuNr = 2
                        break;
                    case "centerRight":
                        selection = "goRight"
                        selection = "cancel"
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
                        removeCanvasLayer(iconsLayer, screenWidth, screenHeight)
                        drawIconsMenu1(iconsLayer, iconSize, screenWidth, screenHeight)
                        activeMenuNr = 1
                        break;
                    case "centerRight":
                        selection = "cancel"
                        break;
                    case "bottomLeft":
                        break;
                    case "bottomCenter":
                        break;
                    case "bottomRight":
                        break;
                    default:
                        break;
                }
            }
        }

        setSelectedCommand(selection)

        setTimeout(() => {
            setSelectedCommand("");
        }, 200);

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
        }, 20);

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
            Selected command {selectedCommand}
            <div> MikroEingabe: {infoTest}</div>

        </Row>
        <Row>
            <button
                onClick={() => play()}
            />
            <Col xs={6}>
                <div style={{paddingLeft: "20%", paddingRight: "20%"}}>
                    <ButtonGroup className="mb-3">
                        <Button variant="secondary"
                                style={micOn ? {"backgroundColor": "#2a9325"} : {"backgroundColor": "#e34c30"}}
                                onClick={() => micOn ? stopListening() : startListening()}>
                            {micOn ? <BsMic/> : <BsMicMute/>}
                            Micro
                        </Button>
                        <Button variant="secondary"
                                style={webcamOn ? {"backgroundColor": "#2a9325"} : {"backgroundColor": "#e34c30"}}
                                onClick={() => webcamOn ? setWebcamOn(false) : setWebcamOn(true)}>
                            {webcamOn ? <BsCameraVideo/> : <BsCameraVideoOff/>}
                            Webcam
                        </Button>
                    </ButtonGroup>
                    <div>
                        Webcam
                    </div>
                    <div>
                        <div>
                            <h2>Speech-Controller {listening ? <BsFillMicFill/> : <BsFillMicMuteFill/>}</h2>
                            Transcript: {transcript}
                        </div>
                        <div>
                            <div style={{
                                position: "relative",
                                width: screenWidth,
                                height: screenHeight,
                                margin: "auto"
                            }}>
                                <canvas ref={canvas} width={screenWidth} height={screenHeight}
                                        style={{
                                            position: "absolute",
                                            top: "0",
                                            left: "0",
                                            zIndex: "0",
                                        }}/>
                                <canvas ref={grid} width={screenWidth} height={screenHeight}
                                        style={{
                                            position: "absolute",
                                            left: "0",
                                            top: "0",
                                            zIndex: "1",
                                        }}/>
                                <canvas ref={highlighting} width={screenWidth} height={screenHeight}
                                        style={{
                                            position: "absolute",
                                            left: "0",
                                            top: "0",
                                            zIndex: "2",
                                        }}/>
                                <canvas ref={iconsLayer} width={screenWidth} height={screenHeight}
                                        style={{
                                            position: "absolute",
                                            left: "0",
                                            top: "0",
                                            zIndex: "2",
                                        }}/>
                            </div>

                            <video ref={video} width={screenWidth} height={screenHeight}
                                   style={{visibility: "hidden"}}/>
                        </div>
                        <div>
                            <ListGroup componentClass="ul" style={{padding: "3%"}}>
                                <ListGroupItem>
                                    Detection: {currentPrediction}
                                </ListGroupItem>
                                <ListGroupItem>
                                    Time passed: {showTime} ms
                                </ListGroupItem>
                            </ListGroup>
                        </div>
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