import React, { Component } from 'react';
import './App.css';
import { Container, Image, Modal, Button, Form } from "react-bootstrap"

class App extends Component {

  state = {
    showModal: false,
    ticket: {
      firstname: "",
      secondname: "",
      email: "",
      time: ""
    }
  }

  handleChange = (e) => {
    const ticket = this.state.ticket
    ticket[e.currentTarget.id] = e.currentTarget.value

    this.setState({
      ticket
    });
  }

  addTicket = async (e) => {
    e.preventDefault()
    const apiUrl = process.env.REACT_APP_API_URL
    const resp = await fetch(apiUrl + "/attendees", {
      method: "POST",
      body: JSON.stringify(this.state.ticket),
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (resp.ok) {
      this.setState({
        showModal: false,
        ticket: {
          firstname: "",
          secondname: "",
          email: "",
          time: ""
        }
      });
    }
  }

  render() {
    return (
      <div className="App">
        <Container className="d-flex justify-content-center">
          <div className="d-flex flex-column">
            <Image
              src="https://shalompark.org/wp-content/uploads/2017/11/click-here-arrow-example.png"
              height="200px"
              width="400px" />
            <div className="justify-content-center" >
              <Image
                src="https://clipartart.com/images/party-clipart-icon-8.png"
                height="200px"
                width="200px"
                onClick={() => this.setState({ showModal: true })}
              />
            </div>
          </div>
          <Modal
            show={this.state.showModal}
            onHide={() => this.setState({
              showModal: false,
              ticket: {
                firstname: "",
                secondname: "",
                email: "",
                time: ""
              }
            })}>
            <Modal.Body>
              <Form onSubmit={this.addTicket}>
                <Form.Group controlId="firstname">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={this.state.ticket.firstname}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="secondname">
                  <Form.Label>Surname</Form.Label>
                  <Form.Control
                    type="text"
                    value={this.state.ticket.secondname}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    value={this.state.ticket.email}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="time">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="text"
                    value={this.state.ticket.time}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Button variant="info" type="submit">Get Ticket</Button>
              </Form>
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    );
  }
}

export default App;
