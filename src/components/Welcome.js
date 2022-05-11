import React from 'react';
import {useState} from "react";
import speechIcon from "../assets/logos/speechIcon.svg"
import keyboardIcon from "../assets/logos/keyboardIcon.svg"
import gestureIcon from "../assets/logos/gestureIcon.svg"
import multiModalIcon from "../assets/logos/multimodalIcon.svg"

import {Card, Col, Row} from "react-bootstrap";
import Colors from "./Colors";
import "../css/Welcome.css"
import {WebController} from "./WebController";

export function Welcome() {
    const [hover1, setHover1] = useState(true);
    const [hover2, setHover2] = useState(true);
    const [hover3, setHover3] = useState(true);
    const [hover4, setHover4] = useState(true);
    const [hover5, setHover5] = useState(true);
    const [selectModus, setSelectedModus] = useState("");
    const [modusActive, setIsModusActive] = useState(false);

    let cardsHover = [hover1, hover2, hover3, hover4, hover5]
    let setCardsHover = [setHover1, setHover2, setHover3, setHover4, setHover5]

    let cardStyle = (hover) => ({
        backgroundColor: hover ? Colors.blue : Colors.darkblue,
    })

    let controllers = [
        {
            id: "simple",
            img: keyboardIcon,
            header: "Keyboard-Controller",
            body: "Mit Hilfe von einzelnen Tasten auf der Tastatur kann der DICOM-Viewer gesteuert werden.",
        }, {
            id: "speech",
            img: speechIcon,
            header: "Speech-Controller",
            body: "Mit Hilfe von ausgsprochenen Befehlen können Einstellung beim  DICOM-Viewer druchgeführt werden. ",
        }, {
            id: "gesture",
            img: gestureIcon,
            header: "Gesten-Erkennung",
            body: "Über die Handposition, sowie die Gesterkennung können die Befehle für den DICOM-Viewer umgesetzt werden.",
        }, , {
            id: "multimodal",
            img: multiModalIcon,
            header: "Multimodal",
            body: "Sowohl Keyboard-, Gesten- und Sprachsteuerung können gemeinsam genutzt werden.",
        }
    ]

    let cards = controllers.map((e, index) => (
        <Col>
            <Card
                className="Card"
                style={cardStyle(cardsHover[index])}
                onMouseEnter={() => {
                    setCardsHover[index](false)
                }}
                onMouseLeave={() => {
                    setCardsHover[index](true)
                }}
                onClick={() => {
                setSelectedModus(e.id);
                setIsModusActive(true)
            }}
            >
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

    function SwtichModus() {
        if (modusActive) {
            return (<WebController modus={selectModus}/>)
        } else {
            return (
                <div className="Welcome">
                    <h1>Willkommen beim ersten multimodalen, berührunglosen Dicom-Web-Viewer!</h1>
                    {/*<ReactLoading type={"cubes"} height={'5%'} color="#000000"/>*/
                    }
                    <div>
                        <div className="CardsContainer">
                            <Row>
                                {cards}
                            </Row>
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <SwtichModus/>
    );
}

