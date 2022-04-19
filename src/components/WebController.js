import {Button, ButtonGroup, Col, Container, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import DicomViewer from "./dicomViewer/DicomViewer";
import {useEffect, useRef, useState} from "react";
import KeyController from "./controllers/KeyController";
import CommandBar from "./commandBar/CommandBar";
import {Header} from "./Header";
import * as handTrack from 'handtrackjs';
import {BsCameraVideo, BsCameraVideoOff, BsMic, BsMicMute} from "react-icons/bs";
import colors from "./Colors";
import Colors from "./Colors";
//Icons
//menu1
//menu2
import menu2 from './icons/menu1.svg'
import zoomIn from './icons/ZoomIn.svg'
import zoomOut from './icons/ZoomOut.svg'
import arrowLeft from './icons/arrowLeft.svg'
import arrowRight from './icons/arrowRight.svg'
import arrowUp from './icons/arrowUp.svg'
import arrowDown from './icons/arrowDown.svg'
import contrastMinus from './icons/brightnessMinus.svg'
import contrastPlus from './icons/brightnessPlus.svg'
import saturationMinus from './icons/saturationMinus.svg'
import saturationPlus from './icons/saturationPlus.svg'
import invert from './icons/invert.svg'
import cancel from './icons/cancel.svg'
import {drawIcon, filterPinchAndClosedHandGesture, calculateCenterOfBBox, containsPredictions, positionInGrid, predictionPositionToString, drawIconsMenu1, drawIconsMenu2} from "./controllers/WebcamController";

export function WebController() {

    const [micOn, setMicOn] = useState(false);
    const [webcamOn, setWebcamOn] = useState(false);

    //General
    const [selectedCommand, setSelectedCommand] = useState("")

    //Webcam
    const [currentPrediction, setCurrentPredictionString] = useState("")
    const [screenWidth, setScreenWidht] = useState(640)
    const [screenHeight, setScreenHeight] = useState(480)
    const [iconSize, setIconSize] = useState(70)
    const [showTime, setShowTime] = useState(70)

    const video = useRef(null);
    const canvas = useRef(null)
    const grid = useRef(null)
    const iconsLayer = useRef(null)
    const highlighting = useRef(null)
    let canvas2dContext, model, activeMenuNr = 1, startTime = 0, timePassed = 0;

    //Settings
    KeyController.supressKey()

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
                drawGridOverlay();
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

    /*
    async function startWebcamForDetection() {
        await setWebcamOn(true)
        console.log(webcamOn)
        model = await handTrack.load(eyeTrackingSettings);
        canvas2dContext = canvas.current.getContext('2d');
        await handTrack.startVideo(video.current);
        drawGridOverlay();
        drawIconsMenu1();
        detectHandsInVideo();
    }

    async function stopWebcamForDetection() {
        await setWebcamOn(false)
        await handTrack.stopVideo();
    }*/

    function detectHandsInVideo() {
        model.detect(video.current).then(predictions => {
            const filtertedPredictions = filterPinchAndClosedHandGesture(predictions);
            //calculating the values to decide where
            if (containsPredictions(filtertedPredictions)) {
                const bBox = filtertedPredictions[0].bbox; //only get the first detected value
                const centerOfBBox = calculateCenterOfBBox(bBox[0], bBox[1], bBox[2], bBox[3]) //position of pinch or closed Hand
                const gridPosition = positionInGrid(centerOfBBox[0], centerOfBBox[1], screenWidth, screenHeight) //decided in 3x3 grid wehre gesture ist detected
                timePassed = performance.now() - startTime;
                setShowTime(timePassed);
                controlCommandPalett(gridPosition);
                highlightSectionActive(gridPosition)
                const positionString = predictionPositionToString(centerOfBBox[0], centerOfBBox[1])
                setCurrentPredictionString("Position: " + positionString + " in Grid " + gridPosition);
            } else {
                startTime = performance.now();
                timePassed = 0
                setShowTime(timePassed);
                removeCanvasLayer(highlighting);
                setCurrentPredictionString("Nothing detected");
            }

            model.renderPredictions(predictions, canvas.current, canvas2dContext, video.current);
            window.requestAnimationFrame(detectHandsInVideo);
        });
    }


    function controlCommandPalett(gridSection) {
        let selection = "Nothing";

        if (timePassed > 500) {
            startTime = performance.now();
            timePassed = 0
            if (activeMenuNr === 1) {
                switch (gridSection) {
                    case "topLeft":
                        console.log("topLeft");
                        break;
                    case "topCenter":
                        setSelectedCommand("goUp")
                        break;
                    case "topRight":
                        setSelectedCommand("zoomIn")
                        break;
                    case "centerLeft":
                        setSelectedCommand("goLeft")
                        break;
                    case "centerCenter":
                        removeCanvasLayer(iconsLayer)
                        drawIconsMenu2(iconsLayer, iconSize, screenWidth, screenHeight)
                        activeMenuNr = 2
                        break;
                    case "centerRight":
                        setSelectedCommand("goRight")
                        setSelectedCommand("cancel")
                        break;
                    case "bottomLeft":
                        setSelectedCommand("brightnessDown")
                        break;
                    case "bottomCenter":
                        setSelectedCommand("goDown")
                        break;
                    case "bottomRight":
                        setSelectedCommand("brightnessUp")
                        break;
                    default:
                        break;
                }
            } else {
                switch (gridSection) {
                    case "topLeft":
                        setSelectedCommand("saturationDown")
                        break;
                    case "topCenter":

                        break;
                    case "topRight":
                        setSelectedCommand("saturationUp")
                        break;
                    case "centerLeft":
                        setSelectedCommand("invert")
                        break;
                    case "centerCenter":
                        console.log("change menu 2")
                        removeCanvasLayer(iconsLayer)
                        drawIconsMenu1(iconsLayer, iconSize, screenWidth, screenHeight)
                        activeMenuNr = 1
                        break;
                    case "centerRight":
                        setSelectedCommand("cancel")
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

        setTimeout(() => {
            setSelectedCommand("");
        }, 200);

    }


    function highlightSectionActive(gridSection) {
        const sectionWidth = screenWidth / 3;
        const sectionHeight = screenHeight / 3;

        switch (gridSection) {
            case "topLeft":
                console.log(sectionWidth);
                higlichtSection(0, 0, sectionWidth, sectionHeight)
                break;
            case "topCenter":
                higlichtSection(sectionWidth, 0, sectionWidth, sectionHeight)
                break;
            case "topRight":
                higlichtSection(2 * sectionWidth, 0, sectionWidth, sectionHeight)
                break;
            case "centerLeft":
                higlichtSection(0, sectionHeight, sectionWidth, sectionHeight)
                break;
            case "centerCenter":
                higlichtSection(sectionWidth, sectionHeight, sectionWidth, sectionHeight)
                break;
            case "centerRight":
                higlichtSection(2 * sectionWidth, sectionHeight, sectionWidth, sectionHeight)
                break;
            case "bottomLeft":
                higlichtSection(0, 2 * sectionHeight, sectionWidth, sectionHeight)
                break;
            case "bottomCenter":
                higlichtSection(sectionWidth, 2 * sectionHeight, sectionWidth, sectionHeight)
                break;
            case "bottomRight":
                higlichtSection(2 * sectionWidth, 2 * sectionHeight, sectionWidth, sectionHeight)
                break;
            default:
                removeCanvasLayer(highlighting);
        }
    }

    function higlichtSection(x, y, width, height) {
        removeCanvasLayer(highlighting)
        let ctx = highlighting.current.getContext('2d');
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.lineWidth = 0
        ctx.fillStyle = colors.brightBlueSemiTransprerent;
        ctx.fill();
        ctx.stroke();
    }

    function removeCanvasLayer(canvas) {
        let ctx = canvas.current.getContext('2d');
        ctx.clearRect(0, 0, screenWidth, screenHeight);
    }

    function drawGridOverlay() {
        let ctx = grid.current.getContext('2d');
        let stepsWidth = screenWidth / 3;
        let stepsHeight = screenHeight / 3;
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = Colors.brightBlue;
        //horiziontal lines
        for (let i = 0; i < 4; i++) {
            ctx.moveTo(stepsWidth * i, 0);
            ctx.lineTo(stepsWidth * i, screenHeight);
        }

        //vertical lines
        for (let i = 0; i < 4; i++) {
            ctx.moveTo(0, stepsHeight * i);
            ctx.lineTo(screenWidth, stepsHeight * i);
        }
        ctx.stroke();
    };

/*
    function drawIconsMenu1() {
        let sectionVertical = screenHeight / 6;
        let sectionHorizontal = screenWidth / 6;
        let halfSizeIcon = iconSize / 2;
        let ctx = iconsLayer.current.getContext('2d')
        drawIcon(ctx, zoomOut, sectionHorizontal - halfSizeIcon, sectionVertical, iconSize, iconSize);
        drawIcon(ctx, arrowUp, 3 * sectionHorizontal - halfSizeIcon, sectionVertical, iconSize, iconSize);
        drawIcon(ctx, zoomIn, 5 * sectionHorizontal - halfSizeIcon, sectionVertical, iconSize, iconSize);
        drawIcon(ctx, arrowLeft, sectionHorizontal - halfSizeIcon, 3 * sectionVertical, iconSize, iconSize);
        drawIcon(ctx, menu2, 3 * sectionHorizontal - halfSizeIcon, 3 * sectionVertical, iconSize, iconSize);
        drawIcon(ctx, arrowRight, 5 * sectionHorizontal - halfSizeIcon, 3 * sectionVertical, iconSize, iconSize);
        drawIcon(ctx, contrastMinus, sectionHorizontal - halfSizeIcon, 5 * sectionVertical, iconSize, iconSize);
        drawIcon(ctx, arrowDown, 3 * sectionHorizontal - halfSizeIcon, 5 * sectionVertical, iconSize, iconSize);
        drawIcon(ctx, contrastPlus, 5 * sectionHorizontal - halfSizeIcon, 5 * sectionVertical, iconSize, iconSize);
    }

    function drawIconsMenu2() {
        let sectionVertical = screenHeight / 6;
        let sectionHorizontal = screenWidth / 6;
        let halfSizeIcon = iconSize / 2;
        let ctx = iconsLayer.current.getContext('2d')
        drawIcon(ctx, saturationMinus, sectionHorizontal - halfSizeIcon, sectionVertical, iconSize, iconSize);
        //drawIcon(ctx, cancel, 3 * sectionHorizontal - halfSizeIcon, sectionVertical, iconSize, iconSize);
        drawIcon(ctx, saturationPlus, 5 * sectionHorizontal - halfSizeIcon, sectionVertical, iconSize, iconSize);
        drawIcon(ctx, invert, sectionHorizontal - halfSizeIcon, 3 * sectionVertical, iconSize, iconSize);
        drawIcon(ctx, menu2, 3 * sectionHorizontal - halfSizeIcon, 3 * sectionVertical, iconSize, iconSize);
        drawIcon(ctx, cancel, 5 * sectionHorizontal - halfSizeIcon, 3 * sectionVertical, iconSize, iconSize);
        //drawIcon(ctx, contrastMinus, sectionHorizontal - halfSizeIcon, 5 * sectionVertical, iconSize, iconSize);
        //drawIcon(ctx, arrowDown, 3 * sectionHorizontal - halfSizeIcon, 5 * sectionVertical, iconSize, iconSize);
        //drawIcon(ctx, contrastPlus, 5 * sectionHorizontal - halfSizeIcon, 5 * sectionVertical, iconSize, iconSize);
    }
*/

    /****************************************************************************************************
     * MOUSE Controller
     *************************************************************************************************** */
    /**
     * pressedKeyAction depended on the pressed key, the selectedCommand is set to the specific value
     * @param e
     */
    function pressedKeyAction(pressedKey) {

        setTimeout(() => {
            setSelectedCommand("");
        }, 20);

        let commandToKey = KeyController.keySelectionCommand(pressedKey.key);
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
            <CommandBar selectedCommand={selectedCommand}></CommandBar>
            Selected command {selectedCommand}
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
                                onClick={() => webcamOn ? setWebcamOn(false) : setWebcamOn(true)}>
                            {webcamOn ? <BsCameraVideo/> : <BsCameraVideoOff/>}
                            Webcam
                        </Button>
                    </ButtonGroup>
                    <div>
                        Webcam
                    </div>
                    <div>
                        Mikrofon
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