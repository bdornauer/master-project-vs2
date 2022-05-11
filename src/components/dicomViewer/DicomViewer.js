import cornerstone from 'cornerstone-core';
import cornerstoneMath from 'cornerstone-math';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader"
import cornerstoneFileImageLoader from "cornerstone-file-image-loader"
import Hammer from "hammerjs";
import dicomParser from "dicom-parser"

import {Fragment, useEffect, useState} from "react";
import {Form, ListGroup, ListGroupItem} from "react-bootstrap";
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

function DicomViewer(props) {
    let dicomElement, canvas;
    const [isCornerstoneLoaded, setIsCornerstoneLoaded] = useState(false)
    const [brigthnessLevel, setBrigthnessLevel] = useState(1)
    const [saturationLevel, setSaturationLevel] = useState(1)
    const [degreeTurn, setDegreeTurn] = useState(0);
    const [isInverted, setIsInverted] = useState(true)
    const [dicomWidth, setDicomWidth] = useState(window.innerWidth * 0.42)
    const [dicomHeight, setDicomHeight] = useState(dicomWidth * 0.75)

    configurations.dicomSettings.width = dicomWidth
    configurations.dicomSettings.height = dicomHeight

    useEffect(() => {
        dicomElement = document.getElementById('dicomImage'); //the view of the the file
        canvas = document.getElementsByClassName("cornerstone-canvas")[0] //the canvas element - to apply effects

        if (!isCornerstoneLoaded) {
            //initialize cornerstone
            cornerstone.enable(dicomElement);
            loadDicomMouseTools(); //initialize tools for simple mouse navigation

            //load sample-image & update viewport
            async function startProcess() {
                let image = await cornerstone.loadImage(configurations.exampleDCM2);
                await cornerstone.displayImage(dicomElement, image);
                initializeViewport(cornerstone.getDefaultViewportForImage(dicomElement, image))
            }

            startProcess()
            //finish loading process
            setIsCornerstoneLoaded(true);
        } else {
            switch (props.selectedCommand) {
                case "zoomIn":
                    zoomIn(props.steps);
                    break;
                case "zoomOut":
                    zoomOut(props.steps);
                    break;
                case "goUp":
                    goUp(props.steps);
                    break;
                case "goDown":
                    goDown(props.steps);
                    break;
                case "goLeft":
                    goLeft(props.steps);
                    break;
                case "goRight":
                    goRight(props.steps);
                    break;
                case "brightnessDown":
                    brigthnessDown(props.steps);
                    break;
                case "brightnessUp":
                    brightnessUp(props.steps);
                    break
                case "saturationUp":
                    saturationUp(props.steps)
                    break;
                case "saturationDown":
                    saturationDown(props.steps)
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
                    setDefaultValues();
                    break;
                default:
                    cornerstone.updateImage(dicomElement); // for canvas
                    break;
            }
        }
    }, [props.selectedCommand])

    /****************************************************************************************************
     * Controlling the viewport with MOUSE
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

    /****************************************************************************************************
     * Controlling the viewport with KEYS
     *************************************************************************************************** */
    function saturationUp(steps) {
        setSaturationLevel(saturationLevel - 0.1 * steps)
        changeSaturation();
    }

    function saturationDown(steps) {
        setSaturationLevel(saturationLevel + 0.1 * steps)
        changeSaturation();
    }

    /**
     * Change saturation of canvas
     */
    function changeSaturation() {
        let context = canvas.getContext('2d')
        context.filter = "saturate(" + saturationLevel + ")";
        changeBrigthness();
    }

    /**
     * Change brightness of canvas
     */
    function brightnessUp(steps) {
        setBrigthnessLevel(brigthnessLevel + 0.1 * steps)
        changeBrigthness();
    }

    function brigthnessDown(steps) {
        setBrigthnessLevel(brigthnessLevel - 0.1 * steps)
        changeBrigthness();
    }

    function changeBrigthness() {
        let context = canvas.getContext('2d')
        context.filter = "brightness(" + brigthnessLevel + ")";
    }

    /**
     * Zooming
     * @param currentViewport set the zoomed viewport
     */

    function zoomIn(steps) {
        let currentViewport = cornerstone.getViewport(dicomElement);
        currentViewport.scale += 0.1 * steps
        zoom(currentViewport)
    }

    function zoomOut(steps) {
        let currentViewport = cornerstone.getViewport(dicomElement);
        currentViewport.scale -= 0.1 * steps
        zoom(currentViewport)
    }

    function zoom(currentViewport) {
        cornerstone.setViewport(dicomElement, currentViewport);
        cornerstone.updateImage(dicomElement);
    }

    /**
     * Function to move the viewport left, right, top and down
     * @param currentViewport set the zoomed viewport
     * @param direction ("goLeft","goRight", "goUp", "goDown")
     */

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
            case "goDown":
                currentViewport.translation.y -= delta;
                break;
            case "goUp":
                currentViewport.translation.y += delta;
                break;
            default:
                break;
        }
        cornerstone.setViewport(dicomElement, currentViewport);
        cornerstone.updateImage(dicomElement);
    }

    /****************************************************************************************************
     * Turn image
     *************************************************************************************************** */

    /**
     * Turn the direction left (negative value in degrees), right (positiv value in degress)
     * @param degree
     */
    function turn(degree) {
        setDegreeTurn(degree)
        let currentViewport = cornerstone.getViewport(dicomElement);
        currentViewport.rotation = degree;
        cornerstone.setViewport(dicomElement, currentViewport);
        cornerstone.updateImage(dicomElement);
    }

    function turnLeft() {
        turn(degreeTurn - 10)
    }

    function turnRight() {
        turn(degreeTurn + 10)
    }

    /****************************************************************************************************
     * Default functions to control viewport
     *************************************************************************************************** */
    /**
     * Setting everything to default.
     */
    function setDefaultValues() {
        setSaturationLevel(1);
        setIsInverted(false);
        setBrigthnessLevel(1);
        changeBrigthness(0);
        changeSaturation(0);
        if (!isInverted) {
            invertColors()
        }

        let currentViewport = cornerstone.getViewport(dicomElement);

        currentViewport.translation.x = 0
        currentViewport.translation.y = 0
        currentViewport.scale = 1.2

        cornerstone.setViewport(dicomElement, currentViewport);
        cornerstone.updateImage(dicomElement);
    }

    /**
     * Setting a viewport
     * @param viewport
     */
    function initializeViewport(viewport) {
        cornerstone.setViewport(dicomElement, viewport);
        cornerstone.updateImage(dicomElement);
    }

    function invertColors() {
        let currentViewport = cornerstone.getViewport(dicomElement);
        currentViewport.invert = isInverted;
        cornerstone.setViewport(dicomElement, currentViewport);
        cornerstone.updateImage(dicomElement);
    }

    /****************************************************************************************************
     * Upload an image
     *************************************************************************************************** */
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

        cornerstone.loadImage(imageId).then(function (image) {
            const viewport = cornerstone.getDefaultViewportForImage(dicomElement, image);
            cornerstone.displayImage(dicomElement, image, viewport);
        });

    }


    return (
        <Fragment>
            <h3>Dicom Viewer</h3>
            <div style={{marginRight: "50px"}}>
                <Form style={{textAlign: "left"}}>
                    <Form.Label>Lade eine JPG, PNG oder ein DICOM-File hoch</Form.Label>
                    <Form.Group controlId="formFileSm">
                        <Form.Control type="file" onChange={setNewImage} size="sm"/>
                    </Form.Group>
                </Form>
                <div id="dicomImage"
                     style={{
                         width: configurations.dicomSettings.width,
                         height: configurations.dicomSettings.height,
                         margin: "10px auto",
                         background: Colors.brightBlue
                     }}/>
                <div style={{textAlign: "left"}}>
                    <ListGroup>
                        <ListGroupItem>Saturation: {Math.round(saturationLevel * 100)}% </ListGroupItem>
                        <ListGroupItem>Brightness: {Math.round(brigthnessLevel * 100)}%</ListGroupItem>
                        <ListGroupItem>Invert on: {isInverted === false ? "off" : "on"}</ListGroupItem>
                    </ListGroup>
                </div>
            </div>
        </Fragment>
    );
}

export default DicomViewer;