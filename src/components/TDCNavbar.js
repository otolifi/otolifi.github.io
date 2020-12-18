import {
  Link
} from "react-router-dom";
import { Nav, Navbar } from 'react-bootstrap';

function TDCNavbar() {
  return (
        <Navbar collapseOnSelect bg="dark" variant="dark" expand="xl" fixed="top">
          <Navbar.Brand as={Link} to="/"><img className="logo" src='./logo.png'></img></Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className='m-auto'>
              <Nav.Link eventKey={1} as={Link} to="/">HOME</Nav.Link>
              <Nav.Link eventKey={2} as={Link} to="/about">ABOUT</Nav.Link>
              <Nav.Link eventKey={3} as={Link} to="/services">SERVICES</Nav.Link>
              <Nav.Link eventKey={4} as={Link} to="/contact">CONTACT</Nav.Link>
              <Nav.Link eventKey={5} as={Link} to="/portfolio">PORTFOLIO</Nav.Link>
              <Nav.Link eventKey={6} as={Link} to="/canvas">CANVAS</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
  )
}

export default TDCNavbar;

