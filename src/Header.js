import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import React from 'react';
function NavPillsExample() {
  return (
    <Card > 
      <Card.Header>
        <Nav variant="pills" defaultActiveKey="#first">
          <Nav.Item>
            <Nav.Link href="./Ping">Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#link">Link</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#disabled" disabled>
              Disabled
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Card.Header>
      <Card.Body>
        <Card.Title>Ping test</Card.Title>
        <Card.Text>
        Feel free to use our ping test.
        </Card.Text>
        <Button variant="primary">Go ping test</Button>
      </Card.Body>
    </Card>
  );
}

export default NavPillsExample;