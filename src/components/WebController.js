import {Button, Col, Container, Row} from "react-bootstrap";
import DicomViewer from "./dicomViewer/DicomViewer";
import {useEffect, useState} from "react";

export function WebController() {
    const [selectedCommand, setSelectedCommand] = useState(-1);

    /**
     * This function suppresses the standard navigation inside the website (scroll down, go left ...)
     */
    window.addEventListener("keydown", function (e) {
        if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);

    /**
     * pressedKeyAction depended on the pressed key, the selectedCommand is set to the specific value
     * @param e
     */
    function pressedKeyAction(pressedKey) {
        setTimeout(() => {
            setSelectedCommand("");
        }, 200);
        switch (pressedKey.key) {
            case 'i':
                setSelectedCommand("zoomIn");
                break;
            case 'o':
                setSelectedCommand("zoomOut");
                break;
            case 'ArrowLeft':
                setSelectedCommand("goLeft");
                break;
            case 'ArrowUp':
                setSelectedCommand("goUp");
                break;
            case 'ArrowDown':
                setSelectedCommand("goDown");
                break;
            case 'ArrowRight':
                setSelectedCommand("goRight");
                break;
            case 'w':
                setSelectedCommand("layerUp");
                break;
            case 's':
                setSelectedCommand("layerDown");
                break;
            case 'a':
                setSelectedCommand("brightnessDown");
                break;
            case 'd':
                setSelectedCommand("brightnessUp");
                break;
            case 'n':
                setSelectedCommand("saturationDown");
                break;
            case 'm':
                setSelectedCommand("saturationUp");
                break;
            case 'v':
                setSelectedCommand("invert");
                break;
            case 'c':
                setSelectedCommand("default");
                break;
            default:
                setSelectedCommand("");
                break;
        }
    }

    /**
     * If key is keydown, the pressedKeyAction is called.
     */
    useEffect(() => {
        document.addEventListener("keydown", pressedKeyAction);
    })



    return (
        <Container style={{maxWidth: '100%', maxHeight: '100%'}}>
            <Row>
                #menubar
            </Row>
            <Row>
                <Col xs={6}>
                    <div style={{paddingLeft: "20%", paddingRight: "20%"}}>
                       # Information
                    </div>
                </Col>
                <Col><DicomViewer selectedCommand={selectedCommand}/></Col>
            </Row>
        </Container>
    );
}