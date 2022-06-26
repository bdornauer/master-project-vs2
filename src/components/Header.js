import {Container, Image, Navbar} from "react-bootstrap";
import speechIcon from "../assets/logos/speechIcon.svg"
import keyboardIcon from "../assets/logos/keyboardIcon.svg"
import gestureIcon from "../assets/logos/gestureIcon.svg"
import multimodalIcon from "../assets/logos/multimodalIcon.svg"
import Colors from "./Colors";

export function Header() {
    return (<Navbar style={{backgroundColor: Colors.blue}} expand="lg">
        <Container fluid>
            <Navbar.Brand href="/">
                <Image
                    alt=""
                    src={keyboardIcon}
                    width="60"
                    height="40"
                />
                <Image
                    alt=""
                    src={speechIcon}
                    width="40"
                    height="40"
                />
                <Image
                    alt=""
                    src={gestureIcon}
                    width="50"
                    height="40"
                />
                <Image
                    alt=""
                    src={multimodalIcon}
                    width="50"
                    height="40"
                />
            </Navbar.Brand>
            <Navbar.Brand style={{color: Colors.fontColor}} href="/">Dicom-Controller</Navbar.Brand>
        </Container>
    </Navbar>);
}