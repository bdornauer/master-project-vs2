// https://javascriptimageviewer.wordpress.com/2019/03/25/displaying-dicom-images/
//and dicom & react
/*
import cornerstone from 'cornerstone-core';
import cornerstoneMath from 'cornerstone-math';
import cornerstoneTools from 'cornerstone-tools';
import cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader"
import cornerstoneFileImageLoader from "cornerstone-file-image-loader"

import Hammer from "hammerjs";
import dicomParser from "dicom-parser"
 */
import {Fragment, useEffect, useState} from "react";
import configurations from "./DicomViewerDefaultConfiguration"
import Colors from "../Colors"
import {Form, ListGroup, ListGroupItem} from "react-bootstrap";


/**
 * Loading the tools for the dicom-Viewer containing: cornerstoneTools, cornerstoneWebImageLoader (for Uri)), cornerstoneWADOImageLoader & dicomParser (for DICOM-Format),
 * cornerstoneFileImageLoader (for file upload), Hammerstone (for touch & mouse-control)
 */
/**
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneWADOImageLoader.webWorkerManager.initialize(configurations.config);
cornerstoneFileImageLoader.external.cornerstone = cornerstone;
cornerstoneTools.init();
*/

function DicomViewer(props) {
    const [isCornerstoneLoaded, setIsCornerstoneLoaded] = useState(false)
    const [brigthnessLevel, setBrigthnessLevel] = useState(1)
    const [saturationLevel, setSaturationLevel] = useState(1)
    const [isInverted, setIsInverted] = useState(true)

    return (
        <Fragment>
            <h3>Dicom Viewer</h3>
            <div style={{marginRight: "50px"}}>
                <Form style={{textAlign: "left"}}>
                    <Form.Label>Lade eine JPG, PNG oder ein DICOM-File hoch</Form.Label>
                    <Form.Group controlId="formFileSm">
                        <Form.Control  type="file" size="sm"/> {/*onChange={setNewImage}*/}
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
                        <ListGroupItem>Invert on: {isInverted == false ? "off" : "on"}</ListGroupItem>
                    </ListGroup>
                </div>
            </div>
        </Fragment>
    );
}

export default DicomViewer;