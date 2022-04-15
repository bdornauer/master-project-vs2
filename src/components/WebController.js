import {Col, Container, Row} from "react-bootstrap";
import DicomViewer from "./dicomViewer/DicomViewer";

export function WebController() {
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
                <Col><DicomViewer selectedCommand="-1"/></Col>
            </Row>
        </Container>
    );
}