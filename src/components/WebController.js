import {Button, Col, Container, Row} from "react-bootstrap";
import DicomViewer from "./dicomViewer/DicomViewer";
import {useState} from "react";

export function WebController() {
    const [selectedCommand, setSelectedCommand] = useState("-1");

    return (
        <Container style={{maxWidth: '100%', maxHeight: '100%'}}>
            <Row>
                #menubar
            </Row>
            <Button onClick={() => setSelectedCommand("das")}></Button>
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