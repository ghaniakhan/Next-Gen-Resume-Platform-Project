// StudentNavbarBootstrap.js
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function StudentNavbarBootstrap() {
  return (
    <Navbar expand="lg" bg="dark" variant="dark" sticky="top" className="shadow-sm" height="100px">
      <Container fluid>
        <Navbar.Brand href="/home" className="fw-bold text-primary">
          🎓 Smart Resume Toolkit
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="student-navbar" />
        <Navbar.Collapse id="student-navbar">
          <Nav className="ms-auto me-4 my-2 my-lg-0" navbarScroll>
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/upload">Check ATS Score</Nav.Link>
            <Nav.Link href="/generate">Generate Resume</Nav.Link>
            <Nav.Link href="/history">History</Nav.Link>
            <Nav.Link href="/feedback">Feedback</Nav.Link>
            <NavDropdown title="Settings" id="settings-dropdown">
              {/* <NavDropdown.Item href="/settings">Profile Settings</NavDropdown.Item>
              <NavDropdown.Divider /> */}
              <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default StudentNavbarBootstrap;
