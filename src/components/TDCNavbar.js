import {
  Link
} from "react-router-dom";
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';

function TDCNavbar() {
  return (
        <Navbar bg="dark" variant="dark" expand="xl" fixed="top">
          <Navbar.Brand as={Link} to="/"><img className="logo" src='./logo.png'></img></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className='m-auto'>
              <Nav.Link as={Link} to="/">HOME</Nav.Link>
              <Nav.Link as={Link} to="/about">ABOUT</Nav.Link>
              <Nav.Link as={Link} to="/services">SERVICES</Nav.Link>
              <Nav.Link as={Link} to="/contact">CONTACT</Nav.Link>
              <Nav.Link as={Link} to="/portfolio">PORTFOLIO</Nav.Link>
              <Nav.Link as={Link} to="/canvas">CANVAS</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
  )
}

export default TDCNavbar;

