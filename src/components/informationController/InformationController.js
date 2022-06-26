import React from 'react';
import {Table} from "react-bootstrap";
import colors from "../Colors";
import zoomOut from "../../assets/icons/ZoomOut.svg"
import arrowUp from "../../assets/icons/arrowUp.svg";
import arrowLeft from "../../assets/icons/arrowLeft.svg";
import arrowRight from "../../assets/icons/arrowRight.svg";
import contrastMinus from "../../assets/icons/brightnessMinus.svg";
import arrowDown from "../../assets/icons/arrowDown.svg";
import contrastPlus from "../../assets/icons/brightnessPlus.svg";
import saturationMinus from "../../assets/icons/saturationMinus.svg";
import saturationPlus from "../../assets/icons/saturationPlus.svg";
import invert from "../../assets/icons/invert.svg";
import cancel from "../../assets/icons/cancel.svg";
import turnLeft from "../../assets/icons/turnLeft.svg";
import turnRight from "../../assets/icons/turnRight.svg";
import "./InformationController.css";

export function InformationController() {
    return (<div>
            <div>
                <Table striped hover size="sm" style={{fontSize: "22px"}} responsive={true}>
                    <thead style={{backgroundColor: colors.brightBlue}}>
                    <tr>
                        <th>Beschreibung</th>
                        <th>Tasten</th>
                        <th>Gridelement</th>
                        <th>Sprachbefehl <span style={{color: colors.blue}}>"Mike...</span></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>hinein zoomen</td>
                        <td><span role="img">🇮️️️</span></td>
                        <td><img src={zoomOut} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...[levels] in"</span></th>
                    </tr>
                    <tr>
                        <td>heraus zoomen</td>
                        <td><span role="img">️️🇴</span></td>
                        <td><img src={zoomOut} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...[levels] out"</span></th>
                    </tr>
                    <tr>
                        <td>gehe nach oben</td>
                        <td><span role="img">↑️</span></td>
                        <td><img src={arrowUp} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...[levels] top "</span></th>
                    </tr>
                    <tr>
                        <td>gehe nach links</td>
                        <td><span role="img">←</span></td>
                        <td><img src={arrowLeft} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...[levels] left "</span></th>
                    </tr>
                    <tr>
                        <td>gehe nach rechts</td>
                        <td><span role="img">→</span></td>
                        <td><img src={arrowRight} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...[levels] right "</span></th>
                    </tr>
                    <tr>
                        <td>gehe nach unten</td>
                        <td><span role="img">↓️️</span></td>
                        <td><img src={arrowDown} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...[levels] down"</span></th>
                    </tr>
                    <tr>
                        <td>Helligkeit erhöhen</td>
                        <td><span role="img">🇼</span></td>
                        <td><img src={contrastPlus} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...[levels] light increase "</span></th>
                    </tr>
                    <tr>
                        <td>Helligkeit verringern</td>
                        <td><span role="img">🇸️</span></td>
                        <td><img src={contrastMinus} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...[levels] light decrease"</span></th>
                    </tr>
                    <tr>
                        <td>Sättigung verringern</td>
                        <td><span role="img">🇳️️</span></td>
                        <td><img src={saturationMinus} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...[levels] density decrease "</span></th>
                    </tr>
                    <tr>
                        <td>Sättigung erhöhen</td>
                        <td><span role="img">🇲</span></td>
                        <td><img src={saturationPlus} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...[levels] density increase"</span></th>
                    </tr>
                    <tr>
                        <td>Farben invertieren</td>
                        <td><span role="img">🇻</span></td>
                        <td><img src={invert} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...change"</span></th>

                    </tr>
                    <tr>
                        <td>Alles rückgängig</td>
                        <td><span role="img">🇨</span></td>
                        <td><img src={cancel} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...default"</span></th>
                    </tr>
                    <tr>
                        <td>Links drehen</td>
                        <td><span role="img">🇦</span></td>
                        <td><img src={turnLeft} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>... [levels]turn counterclockwise</span>(1 level = 30
                            Grad)
                        </th>
                    </tr>
                    <tr>
                        <td>Rechts drehen</td>
                        <td><span role="img">🇩️</span></td>
                        <td><img src={turnRight} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>... [levels] turn clockwise"</span>(1 level = 30 Grad)
                        </th>
                    </tr>
                    </tbody>
                </Table>
            </div>
        </div>);
}

