import React, {useState} from 'react';

import speechIcon from "../assets/logos/speechIcon.svg"
import keyboardIcon from "../assets/logos/keyboardIcon.svg"
import gestureIcon from "../assets/logos/gestureIcon.svg"
import multiModalIcon from "../assets/logos/multimodalIcon.svg"

import {Card, CardGroup} from "react-bootstrap";
import Colors from "./Colors";
import {WebController} from "./WebController";

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Datenschutz} from "./Datenschutz";

export function App() {
    const [hover1, setHover1] = useState(true);
    const [hover2, setHover2] = useState(true);
    const [hover3, setHover3] = useState(true);
    const [hover4, setHover4] = useState(true);

    const [selectModus, setSelectedModus] = useState("");
    const [modusActive, setIsModusActive] = useState(false);

    let cardsHover = [hover1, hover2, hover3, hover4]
    let setCardsHover = [setHover1, setHover2, setHover3, setHover4]

    let cardStyle = (hover) => ({
        backgroundColor: hover ? Colors.blue : Colors.darkblue,
        margin: "1%"
    })

    let controllers = [
        {
            id: "simple",
            img: keyboardIcon,
            header: "Tastatureingabe",
            body: "Mit Hilfe der einzelnen Tasten auf der Tastatur kann der DICOM-Viewer kontrolliert werden.",
        }, {
            id: "speech",
            img: speechIcon,
            header: "Sprachsteuerung",
            body: "Mit Hilfe von ausgsprochenen Befehlen können Einstellungen beim  DICOM-Viewer umgesetzt werden.",
        }, {
            id: "gesture",
            img: gestureIcon,
            header: "Handsteuerung",
            body: "Über die Handposition, sowie die Gestenerkennung ist die Steuerung des DICOM-Viewer möglich.",
        }, {
            id: "multimodal",
            img: multiModalIcon,
            header: "Multimodal",
            body: "Sowohl Keyboard-, Gesten- und Sprachsteuerung können multimodal (gemeinsam) verwendet werden.",
        }
    ]

    let cards = controllers.map((e, index) => (
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

    ));

    function SwtichModus() {
        if (modusActive) {
            return (<WebController modus={selectModus}/>)
        } else {
            return (
                <div className="Welcome">
                    <br/>
                    <h1>Willkommen beim ersten multimodalen, berührunglosen Dicom-Web-Viewer!</h1>
                    <div>
                        <div className="CardsContainer">
                            <CardGroup>
                                {cards}
                            </CardGroup>
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="App">
            <SwtichModus/>
            <Datenschutz/>
        </div>
    );
}

