import cornerstone from 'cornerstone-core';
import cornerstoneMath from 'cornerstone-math';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader"
import cornerstoneFileImageLoader from "cornerstone-file-image-loader"
import Hammer from "hammerjs";
import dicomParser from "dicom-parser"

import {Fragment, useEffect, useState} from "react";
import {Col, Form, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import configurations from "./DicomViewerDefaultConfiguration"
import Colors from "../Colors"

/**
 * Loading the tools for the dicom-Viewer containing:
 * - cornerstoneTools,
 * - cornerstoneWebImageLoader (for Uri)),
 * - cornerstoneWADOImageLoader & dicomParser (for DICOM-Format),
 * - cornerstoneFileImageLoader (for file upload),
 * - Hammerstone (for touch & mouse-control)
 */
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneWADOImageLoader.webWorkerManager.initialize(configurations.config);
cornerstoneFileImageLoader.external.cornerstone = cornerstone;
cornerstoneTools.init();


//load sample-image & update viewport

function DicomViewer(props) {
    let dicomElement, canvas;
    const [isCornerstoneLoaded, setIsCornerstoneLoaded] = useState(false)
    const [defaultLevelValues, setDefaultLevelValues] = useState({})

    //Setting values for image manipulation
    const [brigthnessFactor, setBrigthnessFactor] = useState(1)
    const [xPositionTranslation, setXPositionTranslation] = useState(1)
    const [yPositionTranslation, setYPositionTranslation] = useState(1)
    const [saturationLevel, setSaturationLevel] = useState(1)
    const [scaleFactor, setScaleFactor] = useState(1)
    const [degreeRotation, setDegreeRotation] = useState(0);
    const [isInverted, setIsInverted] = useState(true)

    //Image setting
    const [dicomWidth] = useState(window.innerWidth * 0.35)
    const [dicomHeight] = useState(dicomWidth * 0.75)
    const [defaultImage, setDefaultImage] = useState(configurations.DICOM_brain)


    /****************************************************************************************************
     * Initialize & handle selected commands
     *************************************************************************************************** */
    useEffect(() => {
        dicomElement = document.getElementById('dicomImage'); //the view of the the file
        canvas = document.getElementsByClassName("cornerstone-canvas")[0] //the canvas element - to apply effects

        //if isCornerstoneLoaded not loaded, start default setting
        if (!isCornerstoneLoaded) {
            startDicomViewer(dicomElement);
        } else {
            processCommand(dicomElement, props.selectedCommand, props.steps)
        }
    }, [props.selectedCommand])


    async function startDicomViewer(dicomElement) {
        await cornerstone.enable(dicomElement);
        loadDicomMouseTools(); //initialize tools for simple mouse navigation
        await loadingDefaultMedicalImage(dicomElement) //load the default Image
        setIsCornerstoneLoaded(true); //finish loading process
    }

    async function loadingDefaultMedicalImage(dicomElement) {
        let image = await cornerstone.loadImage(configurations.DICOM_brain);
        await cornerstone.displayImage(dicomElement, image);
        initializeViewport(cornerstone.getDefaultViewportForImage(dicomElement, image))
    }

    async function processCommand(dicomElement, command, steps) {
        switch (command) {
            case "zoomIn":
                zoomIn(steps);
                break;
            case "zoomOut":
                zoomOut(steps);
                break;
            case "goUp":
                goUp(steps);
                break;
            case "goDown":
                goDown(steps);
                break;
            case "goLeft":
                goLeft(steps);
                break;
            case "goRight":
                goRight(steps);
                break;
            case "brightnessDown":
                brigthnessDown(steps);
                break;
            case "brightnessUp":
                brightnessUp(steps);
                break
            case "saturationUp":
                saturationUp(steps)
                break;
            case "saturationDown":
                saturationDown(steps)
                break;
            case  "turnLeft":
                turnLeft()
                break;
            case "turnRight":
                turnRight();
                break;
            case "invert":
                setIsInverted(!isInverted)
                invertColors()
                break;
            case "default":
                loadDefaultValus();
                break;
            default:
                cornerstone.updateImage(dicomElement); // for canvas
                break;
        }
    }


    /****************************************************************************************************
     * Loading mouse control
     *************************************************************************************************** */

    function loadDicomMouseTools() {
        //panTool
        const PanTool = cornerstoneTools.PanTool;
        cornerstoneTools.addTool(PanTool)
        cornerstoneTools.setToolActive('Pan', {mouseButtonMask: 1})

        //active wheel zooming in and out
        const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;
        cornerstoneTools.addTool(ZoomMouseWheelTool)
        cornerstoneTools.setToolActive('ZoomMouseWheel', {mouseButtonMask: 2})

        //contrast Tool
        const WwwcTool = cornerstoneTools.WwwcTool;
        cornerstoneTools.addTool(WwwcTool)
        cornerstoneTools.setToolActive('Wwwc', {mouseButtonMask: 4})

        //rotation Tool
        const RotateTool = cornerstoneTools.RotateTool;
        cornerstoneTools.addTool(RotateTool)
        cornerstoneTools.setToolActive('Rotate', {mouseButtonMask: 8})
    }

    function updateValuesOnMouseControl() {
        dicomElement = document.getElementById('dicomImage'); //the view of the the file
        let viewport = cornerstone.getViewport(dicomElement);

        setXPositionTranslation(viewport.translation.x)
        setYPositionTranslation(viewport.translation.y)
        setScaleFactor(viewport.scale)
        setBrigthnessFactor(viewport.voi.windowCenter)
        setDegreeRotation(viewport.rotation)
        setIsInverted(viewport.invert)

    }

    /****************************************************************************************************
     * Functions to manipulate images
     *************************************************************************************************** */

    // change the depth or intensity of colour
    function changeSaturation() {
        let context = canvas.getContext('2d')
        context.filter = "saturate(" + saturationLevel + ")";
    }

    function saturationUp(steps) {
        setSaturationLevel(saturationLevel + 0.1 * steps)
        changeSaturation();
    }

    function saturationDown(steps) {
        setSaturationLevel(saturationLevel - 0.1 * steps)
        changeSaturation();
    }

    // change brightness of an image
    function changeBrigthness(brightnessSteps) {
        let currentViewport = cornerstone.getViewport(dicomElement);
        setBrightness(currentViewport.voi.windowCenter + brightnessSteps)
    }

    function setBrightness(brightness) {
        let currentViewport = cornerstone.getViewport(dicomElement);
        currentViewport.voi.windowCenter = brightness;
        setBrigthnessFactor(currentViewport.voi.windowCenter);
        cornerstone.setViewport(dicomElement, currentViewport);
    }

    function brightnessUp(steps) {
        changeBrigthness(-10 * steps)
    }

    function brigthnessDown(steps) {
        changeBrigthness(10 * steps)
    }


    //scale in or out in an image
    function zoomPerLevel(scaleSteps) {
        let currentViewport = cornerstone.getViewport(dicomElement);
        zoom(currentViewport.scale + scaleSteps)
    }

    function zoom(scaleFactor) {
        let currentViewport = cornerstone.getViewport(dicomElement);
        currentViewport.scale = scaleFactor;
        cornerstone.setViewport(dicomElement, currentViewport);
        cornerstone.updateImage(dicomElement);
        setScaleFactor(scaleFactor)
    }

    function zoomIn(steps) {
        zoomPerLevel(0.1 * steps)
    }

    function zoomOut(steps) {
        zoomPerLevel(-0.1 * steps)
    }

    //translate image in x and y direction
    function navigation(direction, steps) {
        let currentViewport = cornerstone.getViewport(dicomElement);
        let delta = 10 * steps;

        switch (direction) {
            case "goLeft":
                currentViewport.translation.x -= delta;
                break;
            case "goRight":
                currentViewport.translation.x += delta;
                break;
            case "goUp":
                currentViewport.translation.y -= delta;
                break;
            case "goDown":
                currentViewport.translation.y += delta;
                break;
            default:
                break;
        }

        setXPositionTranslation(currentViewport.translation.x)
        setYPositionTranslation(currentViewport.translation.y)
        cornerstone.setViewport(dicomElement, currentViewport);
        cornerstone.updateImage(dicomElement);
    }

    function goLeft(steps) {
        navigation("goLeft", steps)
    }

    function goRight(steps) {
        navigation("goRight", steps)
    }

    function goUp(steps) {
        navigation("goUp", steps)
    }

    function goDown(steps) {
        navigation("goDown", steps)
    }

    //turn direction left (negative value in degrees), right (positiv value in degress)
    function turn(degree) {
        setDegreeRotation(degree)
        let currentViewport = cornerstone.getViewport(dicomElement);
        currentViewport.rotation = degree;
        cornerstone.setViewport(dicomElement, currentViewport);
        cornerstone.updateImage(dicomElement);
    }

    function turnLeft() {
        turn(degreeRotation - 30 * props.steps)
    }

    function turnRight() {
        turn(degreeRotation + 30 * props.steps)
    }

    //invert the colors of an image
    function invertColors() {
        let currentViewport = cornerstone.getViewport(dicomElement);
        currentViewport.invert = isInverted;
        cornerstone.setViewport(dicomElement, currentViewport);
        cornerstone.updateImage(dicomElement);
    }

    /****************************************************************************************************
     * Default functions to control viewport
     *************************************************************************************************** */
    /**
     * Setting everything in the image to default values (first load)
     */
    function loadDefaultValus() {
        setIsInverted(defaultLevelValues.isInverted);

        setDegreeRotation(defaultLevelValues.degreeTurn)
        turn(defaultLevelValues.degreeTurn)

        setBrightness(defaultLevelValues.brightnessLevel);
        setBrigthnessFactor(defaultLevelValues.brightnessLevel)


        setSaturationLevel(defaultLevelValues.saturationLevel);
        changeSaturation();

        setScaleFactor(defaultLevelValues.zoomLevel);
        zoom(defaultLevelValues.zoomLevel);

        if (!isInverted) {
            invertColors()
        }

        let currentViewport = cornerstone.getViewport(dicomElement);

        setXPositionTranslation(defaultLevelValues.xPosition)
        setYPositionTranslation(defaultLevelValues.yPosition)

        currentViewport.translation.x = 0
        currentViewport.translation.y = 0
        currentViewport.scale = 1.0

        cornerstone.setViewport(dicomElement, currentViewport);
        cornerstone.updateImage(dicomElement);
    }

    /**
     * Setting a viewport
     * @param viewport
     */
    function initializeViewport(viewport) {
        dicomElement = document.getElementById('dicomImage'); //the view of the the file
        cornerstone.setViewport(dicomElement, viewport);
        cornerstone.updateImage(dicomElement);

        setDefaultLevelValues({
            xPosition: viewport.translation.x,
            yPosition: viewport.translation.y,
            zoomLevel: viewport.scale,
            brightnessLevel: viewport.voi.windowCenter,
            saturationLevel: 1,
            degreeTurn: viewport.rotation,
            isInverted: viewport.invert
        })
        setXPositionTranslation(viewport.translation.x)
        setYPositionTranslation(viewport.translation.y)
        setScaleFactor(viewport.scale)
        setBrigthnessFactor(viewport.voi.windowCenter)
        setSaturationLevel(1)
        setDegreeRotation(viewport.rotation)
        setIsInverted(viewport.invert)

        setBrigthnessFactor(viewport.voi.windowCenter)
    }

    /****************************************************************************************************
     * Setting a new image
     *************************************************************************************************** */

    /**
     * Loading one of the defaut images
     */
    async function loadNewImage(dicomElement, defaultImageId) {
        let image = await cornerstone.loadImage(defaultImageId);
        let viewport = cornerstone.getDefaultViewportForImage(dicomElement, image)
        await cornerstone.displayImage(dicomElement, image);
        initializeViewport(viewport)
    }

    function setNewImage(e) {
        let dicomElement = document.getElementById('dicomImage');
        const file = e.target.files[0];
        const fileType = file.type;

        let imageId;

        if (fileType === "image/jpeg" || fileType === "image/png") {
            imageId = cornerstoneFileImageLoader.fileManager.add(file);
        } else if (fileType === "application/dicom") {
            imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
        }

        loadNewImage(dicomElement, imageId)
    }

    useEffect(() => {
        dicomElement = document.getElementById('dicomImage'); //the view of the the file
        loadNewImage(dicomElement, defaultImage);
    }, [defaultImage])

    return (<Fragment>
        <div>
            <Form style={{textAlign: "left"}}>
                <Form.Label>Lade eine JPG, PNG oder ein DICOM-File hoch</Form.Label>
                <Row>
                    <Col sm={8}>
                        <Form.Control type="file" onChange={setNewImage}/>
                    </Col>
                    <Col sm={4}>
                        <Form.Select
                            onChange={(e) => {
                                setDefaultImage(e.target.value)
                            }}
                        >
                            <option value={configurations.DICOM_brain}>Gehirn</option>
                            <option value={configurations.DICOM_spine}>Wirbelsäule</option>
                            <option value={configurations.DICOM_fraction}>Bruch</option>
                            <option value={configurations.DICOM_spine_section}>Wirbelsäule Querschnitt</option>
                            <option value={configurations.JPG_Renal_Cell_Carcinoma}>Zell-Karzinom</option>
                            <option value={configurations.PNG_brain}>Gehirn 2</option>
                        </Form.Select>
                    </Col>
                </Row>
            </Form>
            <div id="dicomImage"
                 onClick={updateValuesOnMouseControl}
                 onWheelCapture={updateValuesOnMouseControl}
                 style={{
                     width: dicomWidth, height: dicomHeight, margin: "10px auto", background: Colors.brightBlue
                 }}/>
            <div style={{textAlign: "left"}}>
                <ListGroup>
                    <ListGroupItem>Brightness: {Math.round(brigthnessFactor) / 100} [default: {Math.round(defaultLevelValues.brightnessLevel) / 100}]</ListGroupItem>
                    <ListGroupItem>Translation: (x: {Math.round(xPositionTranslation)}px,
                        y: {(-1) * Math.round(yPositionTranslation)}px) [default:
                        ({defaultLevelValues.xPosition},{defaultLevelValues.yPosition})]</ListGroupItem>
                    <ListGroupItem>Zoom: {Math.round(scaleFactor * 100) / 100} [default: {Math.round(defaultLevelValues.zoomLevel * 100) / 100} ]</ListGroupItem>
                    <ListGroupItem>Degree: {Math.round(degreeRotation) % 360}&deg; [default: {Math.round(defaultLevelValues.degreeTurn) / 100}&deg;]</ListGroupItem>
                    <ListGroupItem>Inverted: {isInverted === false ? "off" : "on"}</ListGroupItem>
                    <ListGroupItem>Saturation: {Math.round(saturationLevel * 100) / 100} (default: {defaultLevelValues.saturationLevel})</ListGroupItem>
                </ListGroup>
            </div>
        </div>
    </Fragment>);
}

export default DicomViewer;