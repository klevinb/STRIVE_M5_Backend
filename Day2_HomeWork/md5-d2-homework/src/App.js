import React, { Component } from 'react';
import {
  Container,
  Accordion,
  Card,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Alert
} from 'react-bootstrap'
import Table from './components/Table'
import './App.css';

class App extends Component {

  state = {
    addStudent: false,
    editStudent: false,
    postButton: true,
    students: [],
    newStudent: {
      name: "",
      surname: "",
      email: "",
      date: ""
    }
  }

  fetchData = async () => {
    const response = await fetch("http://127.0.0.1:3003/students")

    if (response.ok) {
      const students = await response.json()
      this.setState({
        students
      });
    } else {
      alert("Something went wrong!")
    }
  }

  componentDidMount = async () => {
    this.fetchData()
  }

  fetchStudentData = async (id) => {
    const res = await fetch("http://127.0.0.1:3003/students/" + id)
    if (res.ok) {
      const student = await res.json()

      this.setState({
        editStudent: true,
        newStudent: student[0],
      });
    } else {
      alert("Something went wrong!")
    }
  }

  checkEmail = async () => {
    const resp = await fetch("http://127.0.0.1:3003/students/checkEmail", {
      method: "POST",
      body: JSON.stringify(this.state.newStudent),
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (resp.ok) {
      this.setState({
        postButton: true
      });
    } else {
      this.setState({
        postButton: false
      });
    }
  }

  addNewStudent = async (e) => {
    e.preventDefault()
    const resp = await fetch("http://127.0.0.1:3003/students", {
      method: "POST",
      body: JSON.stringify(this.state.newStudent),
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (resp.ok) {
      this.setState({
        addStudent: false,
        editStudent: false,
        postButton: true,
        newStudent: {
          name: "",
          surname: "",
          email: "",
          date: ""
        }
      });
    }
    this.fetchData()

  }

  editStudent = async (e) => {
    e.preventDefault()
    const resp = await fetch("http://127.0.0.1:3003/students/" + this.state.newStudent.id, {
      method: "PUT",
      body: JSON.stringify(this.state.newStudent),
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (resp.ok) {
      this.fetchData()
      this.setState({
        editStudent: false
      });
    }

  }

  deleteStudent = async (id) => {
    const resp = await fetch("http://127.0.0.1:3003/students/" + id, {
      method: "DELETE"
    })
    if (resp.ok) {
      this.fetchData()
    }
  }


  handleChange = (e) => {
    const newStudent = this.state.newStudent
    newStudent[e.currentTarget.id] = e.currentTarget.value
    this.setState({
      newStudent
    });
    this.checkEmail()
  }


  render() {

    return (
      <div className="App">
        <Container className="d-flex justify-content-center">
          <Accordion className="mt-5">
            <Card>
              <Card.Header className="d-flex justify-content-center">
                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                  Show Students
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <>
                  <Card.Body>
                    <Table
                      students={this.state.students}
                      fetchStudentData={this.fetchStudentData}
                      deleteStudent={this.deleteStudent}
                    />
                  </Card.Body>
                  <Card.Footer className="d-flex justify-content-center">
                    <Button variant="success" onClick={() => this.setState({ addStudent: !this.state.addStudent })}>Add Student</Button>
                  </Card.Footer>
                  <Modal show={this.state.addStudent} onHide={() => this.setState({
                    addStudent: false,
                    editStudent: false,
                    postButton: true,
                    newStudent: {
                      name: "",
                      surname: "",
                      email: "",
                      date: ""
                    }
                  }

                  )}>
                    <Modal.Header closeButton>
                      <Modal.Title className="text-center">Add a new Student</Modal.Title>
                    </Modal.Header>

                    <Modal.Footer className="d-flex justify-content-center">
                      <Form onSubmit={this.addNewStudent}>
                        <Row>
                          <Col>
                            <Form.Group controlId="name">
                              <Form.Label>Name</Form.Label>
                              <Form.Control
                                value={this.state.newStudent.name}
                                onChange={this.handleChange}
                                type="text"
                                placeholder="Write your name" />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group controlId="surname">
                              <Form.Label>Surname</Form.Label>
                              <Form.Control
                                type="text"
                                value={this.state.newStudent.surname}
                                onChange={this.handleChange}
                                placeholder="Write your surname" />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col>
                            <Form.Group controlId="email">
                              <Form.Label>Email address</Form.Label>
                              <Form.Control
                                type="email"
                                value={this.state.newStudent.email}
                                onChange={this.handleChange}
                                placeholder="Enter email" />
                              <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                          </Form.Text>
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group controlId="date">
                              <Form.Label>Birthday</Form.Label>
                              <Form.Control
                                value={this.state.newStudent.date}
                                onChange={this.handleChange}
                                type="date" />
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="d-flex justify-content-center">
                          {this.state.postButton ?
                            <Button variant="primary" type="submit">
                              POST
                            </Button>
                            :
                            <Alert variant="danger">
                              Try another email because another users is using this one!
                            </Alert>

                          }
                        </div>

                      </Form>
                    </Modal.Footer>
                  </Modal>
                  <Modal show={this.state.editStudent} onHide={() => this.setState({
                    addStudent: false,
                    editStudent: false,
                    postButton: true,
                    newStudent: {
                      name: "",
                      surname: "",
                      email: "",
                      date: ""
                    }
                  })}>
                    <Modal.Header closeButton>
                      <Modal.Title className="text-center">Edit the Student info</Modal.Title>
                    </Modal.Header>

                    <Modal.Footer className="d-flex justify-content-center">
                      <Form onSubmit={this.editStudent}>
                        <Row>
                          <Col>
                            <Form.Group controlId="name">
                              <Form.Label>Name</Form.Label>
                              <Form.Control
                                value={this.state.newStudent.name}
                                onChange={this.handleChange}
                                type="text"
                                placeholder="Write your name" />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group controlId="surname">
                              <Form.Label>Surname</Form.Label>
                              <Form.Control
                                type="text"
                                value={this.state.newStudent.surname}
                                onChange={this.handleChange}
                                placeholder="Write your surname" />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col>
                            <Form.Group controlId="email">
                              <Form.Label>Email address</Form.Label>
                              <Form.Control
                                type="email"
                                value={this.state.newStudent.email}
                                onChange={this.handleChange}
                                placeholder="Enter email" />
                              <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                          </Form.Text>
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group controlId="date">
                              <Form.Label>Birthday</Form.Label>
                              <Form.Control
                                value={this.state.newStudent.date}
                                onChange={this.handleChange}
                                type="date" />
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="d-flex justify-content-center">
                          {this.state.postButton ?
                            <Button variant="primary" type="submit">
                              EDIT
                            </Button>
                            :
                            <Alert variant="danger">
                              Try another email because another users is using this one!
                            </Alert>

                          }
                        </div>

                      </Form>
                    </Modal.Footer>
                  </Modal>
                </>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Container>
      </div >
    );
  }
}

export default App;
