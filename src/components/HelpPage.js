import React from 'react';
import {Row, Table} from "react-bootstrap";
import colors from "./Colors";
import zoomOut from "./icons/ZoomOut.svg"
import arrowUp from "./icons/arrowUp.svg";
import zoomIn from "./icons/ZoomIn.svg";
import arrowLeft from "./icons/arrowLeft.svg";
import menu1 from "./icons/menu1.svg";
import menu2 from "./icons/menu2.svg";
import arrowRight from "./icons/arrowRight.svg";
import contrastMinus from "./icons/brightnessMinus.svg";
import arrowDown from "./icons/arrowDown.svg";
import contrastPlus from "./icons/brightnessPlus.svg";
import saturationMinus from "./icons/saturationMinus.svg";
import saturationPlus from "./icons/saturationPlus.svg";
import invert from "./icons/invert.svg";
import cancel from "./icons/cancel.svg";
import turnLeft from "./icons/turnLeft.svg";
import turnRight from "./icons/turnRight.svg";
import  "./HelpPage.css";

export function HelpPage() {
    return (
        <div>
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
                        <th><span style={{color: colors.blue}}>...zoom in "</span></th>
                    </tr>
                    <tr>
                        <td>heraus zoomen</td>
                        <td><span role="img">️️🇴</span></td>
                        <td><img src={zoomOut} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...zoom out"</span></th>
                    </tr>
                    <tr>
                        <td>gehe nach oben</td>
                        <td><span role="img">↑️</span></td>
                        <td><img src={arrowUp} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...top [levels]"</span></th>
                    </tr>
                    <tr>
                        <td>gehe nach links</td>
                        <td><span role="img">←</span></td>
                        <td><img src={arrowLeft} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...left [levels]"</span></th>
                    </tr>
                    <tr>
                        <td>gehe nach rechts</td>
                        <td><span role="img">→</span></td>
                        <td><img src={arrowRight} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...right [levels]"</span></th>
                    </tr>
                    <tr>
                        <td>gehe nach unten</td>
                        <td><span role="img">↓️️</span></td>
                        <td><img src={arrowDown} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...down [levels]"</span></th>
                    </tr>
                    <tr>
                        <td>Helligkeit erhöhen</td>
                        <td><span role="img">🇼</span></td>
                        <td><img src={contrastPlus} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...brightness increase [levels]"</span></th>
                    </tr>
                    <tr>
                        <td>Helligkeit verringern</td>
                        <td><span role="img">🇸️</span></td>
                        <td><img src={contrastMinus} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...brightness decrease [levels]"</span></th>
                    </tr>
                    <tr>
                        <td>Sättigung verringern</td>
                        <td><span role="img">🇳️️</span></td>
                        <td><img src={saturationMinus} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...saturation decrease [levels]"</span></th>
                    </tr>
                    <tr>
                        <td>Sättigung erhöhen</td>
                        <td><span role="img">🇲</span></td>
                        <td><img src={saturationPlus} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...saturation increase [levels]"</span></th>
                    </tr>
                    <tr>
                        <td>Farben invertieren</td>
                        <td><span role="img">🇻</span></td>
                        <td><img src={invert} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...invert"</span></th>

                    </tr>
                    <tr>
                        <td>Alles rückgängig</td>
                        <td><span role="img">🇨</span></td>
                        <td><img src={cancel} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...cancel"</span></th>
                    </tr>
                    <tr>
                        <td>Links drehen</td>
                        <td><span role="img">🇦</span></td>
                        <td><img src={turnLeft} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>..turn counterclockwise [levels]</span>(1 level = 36 Grad)</th>
                    </tr>
                    <tr>
                        <td>Rechts drehen</td>
                        <td><span role="img">🇩️</span></td>
                        <td><img src={turnRight} width="40em" alt="React Logo"/></td>
                        <th><span style={{color: colors.blue}}>...turn clockwise [levels]"</span>(1 level = 36 Grad)</th>
                    </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

