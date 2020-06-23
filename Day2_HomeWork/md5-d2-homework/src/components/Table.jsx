import React from 'react';
import { Table, Button } from 'react-bootstrap'

function Table1(props) {
    return (
        <Table className="text-center" striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Email</th>
                    <th>Birthday</th>
                    <th colSpan="2">Options</th>
                </tr>
            </thead>
            <tbody>
                {props.students.map((student, i) =>
                    <tr key={student.id}>
                        <td>{i + 1}</td>
                        <td>{student.name}</td>
                        <td>{student.surname}</td>
                        <td>{student.email}</td>
                        <td>{student.date}</td>
                        <td><Button variant="warning" onClick={() =>
                            props.fetchStudentData(student.id)
                        } >Edit</Button></td>
                        <td><Button variant="danger" onClick={() =>
                            props.deleteStudent(student.id)
                        } >Delete</Button></td>
                    </tr>
                )}

            </tbody>
        </Table>
    );
}

export default Table1;