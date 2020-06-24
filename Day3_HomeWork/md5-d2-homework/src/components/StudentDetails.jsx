import React, { Component } from 'react';
import {
    Container,
    Image,
    Card,
    Accordion,
    Button,
    Modal,
    Row,
    Col,
    Form,
    Spinner
} from "react-bootstrap"
import "./StudentDetails.css"
import TableForProjects from "./TableForProjects"

class StudentDetails extends Component {

    state = {
        addProject: false,
        user: "",
        projects: [],
        searchValue: '',
        newProject: {
            name: '',
            description: '',
            repoUrl: '',
            liveUrl: '',
            studentId: this.props.match.params.id
        }
    }

    searchProjects = async () => {
        let resp = await fetch("http://127.0.0.1:3003/projects?name=" + this.state.searchValue)
        let data = await resp.json()

        let projects = data.filter(project => project.studentId === this.props.match.params.id)
        this.setState({
            projects
        });
    }


    fetchData = async () => {
        let resp = await fetch("http://127.0.0.1:3003/students/" + this.props.match.params.id + "/projects")

        if (resp.ok) {
            let projects = await resp.json()
            this.setState({
                projects
            });
        } else {
            alert("Something went wrong!")
        }
    }

    fetchUser = async () => {
        let resp = await fetch("http://127.0.0.1:3003/students/" + this.props.match.params.id)
        let data = await resp.json()
        this.setState({
            user: data[0]
        });
    }


    componentDidMount = () => {
        this.fetchData()
        this.fetchUser()
    }

    searchQuery = (e) => {
        this.setState({
            searchValue: e.currentTarget.value
        });
        setTimeout(() => {
            this.searchProjects()
        }, 100)
    }

    handleChange = (e) => {
        const newProject = this.state.newProject
        newProject[e.currentTarget.id] = e.currentTarget.value
        this.setState({
            newProject
        });
    }

    editProject = async (id) => {
        let resp = await fetch("http://127.0.0.1:3003/projects/" + id)
        let data = await resp.json()
        this.setState({
            editProjectInfo: true,
            newProject: data[0],
            projectID: id
        });
    }
    editProjectInfo = async (e) => {
        e.preventDefault()
        let resp = await fetch("http://127.0.0.1:3003/projects/" + this.state.projectID, {
            method: "PUT",
            body: JSON.stringify(this.state.newProject),
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (resp.ok) {
            this.setState({
                addProject: false,
                editProjectInfo: false,
                newProject: {
                    name: '',
                    description: '',
                    repoUrl: '',
                    liveUrl: '',
                    studentId: this.props.match.params.id
                }
            });
            setTimeout(() => {
                this.fetchData()
            }, 300)

        }
    }

    deleteProject = (id) => {
        fetch("http://127.0.0.1:3003/projects/" + id, {
            method: "DELETE",
        })
        setTimeout(() => {
            this.fetchData()
        }, 300)
    }

    addProjectFunction = async (e) => {
        e.preventDefault()
        let resp = await fetch("http://127.0.0.1:3003/projects", {
            method: "POST",
            body: JSON.stringify(this.state.newProject),
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (resp.ok) {
            this.setState({
                addProject: false,
                newProject: {
                    name: '',
                    description: '',
                    repoUrl: '',
                    liveUrl: '',
                    studentId: this.props.match.params.id
                }
            });
            setTimeout(() => {
                this.fetchData()
            }, 300)
        }
    }

    render() {
        return (
            <Container className="d-flex justify-content-center flex-column mt-5">
                <div className="d-flex justify-content-center  mb-5">
                    <div style={{ borderRadius: "30%", overflow: "hidden" }}>
                        {this.state.user && this.state.user.img ?
                            <Image
                                fluid
                                src={this.state.user.img}
                                width="300px"
                                height="300px"
                            />
                            :
                            <div
                                style={{ width: "300px", height: "300px" }}
                                className="d-flex justify-content-center align-items-center"
                            >
                                <Spinner animation="grow" variant="warning" />
                            </div>
                        }
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <Accordion>
                        <Card>
                            <Card.Header className="d-flex justify-content-center">
                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                    Show Projects
                            </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="1">
                                <>
                                    <Card.Body>
                                        <TableForProjects
                                            projects={this.state.projects}
                                            deleteProject={this.deleteProject}
                                            editProject={this.editProject}
                                            searchQuery={this.searchQuery}
                                        />
                                    </Card.Body>
                                    <Card.Footer className="d-flex justify-content-center">
                                        <Button variant="success" onClick={() => this.setState({ addProject: !this.state.addProject })}>Add Project</Button>
                                    </Card.Footer>
                                </>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </div>
                <Modal show={this.state.addProject} onHide={() => this.setState({
                    addProject: false,
                    newProject: {
                        name: '',
                        description: '',
                        createdAt: '',
                        repoUrl: '',
                        liveUrl: '',
                        studentId: this.props.match.params.id
                    }
                }

                )}>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-center">Add a new Student</Modal.Title>
                    </Modal.Header>

                    <Modal.Footer className="d-flex justify-content-center">
                        <Form onSubmit={this.addProjectFunction}>
                            <Row>
                                <Col>
                                    <Form.Group controlId="name">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            value={this.state.newProject.name}
                                            onChange={this.handleChange}
                                            type="text"
                                            placeholder="Name of the project" />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="description">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={this.state.newProject.description}
                                            onChange={this.handleChange}
                                            placeholder="Description" />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group controlId="repoUrl">
                                        <Form.Label>Repo Link</Form.Label>
                                        <Form.Control
                                            value={this.state.newProject.repoUrl}
                                            onChange={this.handleChange}
                                            type="text"
                                            placeholder="Link of the repo" />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="liveUrl">
                                        <Form.Label>Live Link</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={this.state.newProject.liveUrl}
                                            onChange={this.handleChange}
                                            placeholder="Link of live repo" />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className="d-flex justify-content-center">
                                <Button variant="primary" type="submit">
                                    Add Project
                                </Button>

                            </div>

                        </Form>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.editProjectInfo} onHide={() => this.setState({
                    addProject: false,
                    editProjectInfo: false,
                    newProject: {
                        name: '',
                        description: '',
                        createdAt: '',
                        repoUrl: '',
                        liveUrl: '',
                        studentId: this.props.match.params.id
                    }
                }

                )}>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-center">Edit Project Info</Modal.Title>
                    </Modal.Header>

                    <Modal.Footer className="d-flex justify-content-center">
                        <Form onSubmit={this.editProjectInfo}>
                            <Row>
                                <Col>
                                    <Form.Group controlId="name">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            value={this.state.newProject.name}
                                            onChange={this.handleChange}
                                            type="text"
                                            placeholder="Name of the project" />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="description">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={this.state.newProject.description}
                                            onChange={this.handleChange}
                                            placeholder="Description" />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group controlId="repoUrl">
                                        <Form.Label>Repo Link</Form.Label>
                                        <Form.Control
                                            value={this.state.newProject.repoUrl}
                                            onChange={this.handleChange}
                                            type="text"
                                            placeholder="Link of the repo" />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="liveUrl">
                                        <Form.Label>Live Link</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={this.state.newProject.liveUrl}
                                            onChange={this.handleChange}
                                            placeholder="Link of live repo" />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className="d-flex justify-content-center">
                                <Button variant="primary" type="submit">
                                    Edit Project
                                </Button>

                            </div>

                        </Form>
                    </Modal.Footer>
                </Modal>
            </Container>

        );
    }
}

export default StudentDetails;