import React from 'react';
import {
    Button,
    Table,
    FormControl,
    Alert
} from 'react-bootstrap'

function Table1(props) {
    return (
        <>
            <div className="d-flex justify-content-center mb-4">
                <FormControl type="text" style={{ width: "200px" }} onChange={props.searchQuery} placeholder="Search" className="mr-sm-2" />
            </div>
            {props.projects.length > 0 ?
                <Table className="text-center" striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Created At</th>
                            <th>RepoURL</th>
                            <th>LiveURL</th>
                            <th colSpan="2">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.projects.map((project, i) =>
                            <tr key={project.id}>
                                <td>{i + 1}</td>
                                <td>{project.name}</td>
                                <td>{project.description}</td>
                                <td>{project.createdAt.slice(0, 10)}</td>
                                <td><a href={"https://" + project.repoUrl} target="_blank">{project.repoUrl}</a></td>
                                <td>{project.liveUrl}</td>
                                <td><Button variant="warning" onClick={() => props.editProject(project.id)} >Edit</Button></td>
                                <td><Button variant="danger" onClick={() => props.deleteProject(project.id)} >Delete</Button></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                :

                <Alert variant="info">
                    No projects for this user
                </Alert>
            }
        </>
    );

}

export default Table1;