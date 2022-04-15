import {Container, Image, Nav, Navbar} from "react-bootstrap";
import speechIcon from "../assets/logos/speechIcon.svg"
import keyboardIcon from "../assets/logos/keyboardIcon.svg"
import gestureIcon from "../assets/logos/gestureIcon.svg"
import Colors from "./Colors";

export function Header() {
    return (
        <Navbar style={{backgroundColor: Colors.blue}} expand="lg">
            <Container fluid>
                <Navbar.Brand href="/">
                    <Image
                        alt=""
                        src={keyboardIcon}
                        width="50"
                        height="30"
                    />
                    <Image
                        alt=""
                        src={speechIcon}
                        width="30"
                        height="30"
                    />
                    <Image
                        alt=""
                        src={gestureIcon}
                        width="40"
                        height="30"
                    />
                </Navbar.Brand>
                <Navbar.Brand style={{color: Colors.fontColor}} href="/">Dicom-Controller</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll"/>
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{maxHeight: '100px'}}
                        navbarScroll
                    >
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>);
}