import React from 'react';
import ReactLoading from 'react-loading';

import {useState} from "react";
import speechIcon from "../assets/logos/speechIcon.svg"
import keyboardIcon from "../assets/logos/keyboardIcon.svg"
import gestureIcon from "../assets/logos/gestureIcon.svg"
import {Card, Col, Row} from "react-bootstrap";
import Colors from "./Colors";
import "../css/Welcome.css"

export function Welcome() {
    const [hover1, setHover1] = useState(true);
    const [hover2, setHover2] = useState(true);
    const [hover3, setHover3] = useState(true);
    const [hover4, setHover4] = useState(true);

    let cardsHover = [hover1, hover2, hover3, hover4]
    let setCardsHover = [setHover1, setHover2, setHover3, setHover4]

    let cardStyle = (hover) => ({
        backgroundColor: hover ? Colors.blue : Colors.darkblue,
    })

    let controllers = [
        {
            img: keyboardIcon,
            header: "Keyboard-Controller",
            body: "Mit Hilfe von einzelnen Tasten auf der Tastatur kann der DICOM-Viewer gesteuert werden.",
        }, {
            img: speechIcon,
            header: "Speech-Controller",
            body: "Mit Hilfe von ausgsprochenen Befehlen können Einstellung beim  DICOM-Viewer druchgeführt werden. ",
        }, {
            img: gestureIcon,
            header: "Gesten-Erkennung",
            body: "Über die Handposition, sowie die Gesterkennung können die Befehle für den DICOM-Viewer umgesetzt werden.",
        }
    ]

    let cards = controllers.map((e, index) => (
        <Col>
            <Card
                className="Card"
                style={cardStyle(cardsHover[index])}
                onMouseEnter={() => {
                    setCardsHover[index](false)
                }} onMouseLeave={() => {
                setCardsHover[index](true)
            }}>
                <Card.Img variant="top" src={e.img}/>
                <Card.Body>
                    <Card.Title>{e.header}</Card.Title>
                    <Card.Text style={{textAlign: "left"}}>
                        {e.body}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    ));


    return (
        <div className="Welcome">
            <h1>Willkommen beim multimodalen, berührunglosen und Web-Dicom-Viewer!</h1>
            {/*<!--<ReactLoading type={"cubes"} height={'5%'} color="#000000"/>-->*/}
        <div>
            <div className="CardsContainer">
                <Row>
                    {cards}
                </Row>
            </div>
        </div>
        </div>
    );
}

