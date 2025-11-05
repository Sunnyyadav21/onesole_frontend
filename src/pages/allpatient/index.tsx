// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Card, Table, Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Index() {
    const [records, setRecords] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPatient, setCurrentPatient] = useState({ id: null, firstName: '', email: '', mobile: '', address: '' });

    const [tokens, setTokens] = useState('');

    // Function to clean the token by removing first and last double quotes
    const cleanToken = (token) => token?.replace(/^"|"$/g, '');

    useEffect(() => {
        const token = localStorage.getItem('access-tokens');
        if (token) {
            setTokens(cleanToken(token));
        }
    }, []);

    const handleEditClick = (patient) => {
        setCurrentPatient({
            id: patient.id,
            firstName: patient.name,
            email: patient.email,
            mobile: patient.mobile,
            address: patient.address
        });
        setShowEditModal(true);
    };

    const handleDeleteClick = (patient) => {
        setPatientToDelete(patient);
        setShowDeleteModal(true);
    };

    const handleCloseEdit = () => {
        setShowEditModal(false);
        setCurrentPatient({ id: null, firstName: '', email: '', mobile: '', address: '' });
    };

    const handleCloseDelete = () => {
        setShowDeleteModal(false);
        setPatientToDelete(null);
    };

    const handleSaveChanges = () => {
        fetch(`http://localhost:3000/v1/users/${currentPatient.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokens}`
            },
            body: JSON.stringify({
                name: currentPatient.firstName,
                email: currentPatient.email,
                mobile: currentPatient.mobile,
                address: currentPatient.address,
                hospitalId: "665ae2d78f0436512cf8c735"
            })
        })
            .then(response => response.json())
            .then(updatedPatient => {
                setRecords(records.map(record =>
                    record.id === currentPatient.id ? updatedPatient : record
                ));
                setShowEditModal(false);
            })
            .catch(error => console.error('Error updating patient:', error));
    };

    const handleConfirmDelete = () => {
        fetch(`http://localhost:3000/v1/users/${patientToDelete.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${tokens}`
            }
        })
            .then(() => {
                setRecords(records.filter(record => record.id !== patientToDelete.id));
                setShowDeleteModal(false);
            })
            .catch(error => console.error('Error deleting patient:', error));
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        sortRecords(key, direction);
    };

    const sortRecords = (key, direction) => {
        const sortedRecords = [...records].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        setRecords(sortedRecords);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            if (sortConfig.direction === 'asc') {
                return <i className="ri-arrow-up-s-line" />;
            }
            return <i className="ri-arrow-down-s-line" />;
        }
        return <i className="ri-arrow-up-down-line" />;
    };

    useEffect(() => {
        fetch('http://localhost:3000/v1/users?role=patient', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokens}`
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setRecords(data?.results);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [tokens]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentPatient(prevPatient => ({ ...prevPatient, [name]: value }));
    };

    return (
        <Card className='mt-4'>
            <Card.Header>
                <h4 className="header-title">All Patients</h4>
            </Card.Header>
            <Card.Body>
                <div className="table-responsive-sm">
                    <Table className="table-striped table-centered mb-0">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('id')}>
                                    S.No. {getSortIcon('id')}
                                </th>
                                <th onClick={() => handleSort('firstName')}>
                                    First Name {getSortIcon('firstName')}
                                </th>
                                <th onClick={() => handleSort('email')}>
                                    Email ID {getSortIcon('email')}
                                </th>
                                <th onClick={() => handleSort('mobile')}>
                                    Mobile Number {getSortIcon('mobile')}
                                </th>
                                <th onClick={() => handleSort('address')}>
                                    Address {getSortIcon('address')}
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records?.map((patient, index) => (
                                patient.role === 'patient' && (
                                    <tr key={patient.id}>
                                        <td>{index + 1}</td>
                                        <td className="table-user">{patient.name}</td>
                                        <td className="table-user">{patient.email}</td>
                                        <td className="table-user">{patient.mobile}</td>
                                        <td className="table-user">{patient.address}</td>
                                        <td>
                                            <Link
                                                to="#"
                                                className="text-reset fs-16 px-1"
                                                onClick={() => handleEditClick(patient)}
                                            >
                                                <i className="ri-edit-box-line text-primary" />
                                            </Link>
                                            <Link
                                                to="#"
                                                className="text-reset fs-16 px-1"
                                                onClick={() => handleDeleteClick(patient)}
                                            >
                                                <i className="ri-delete-bin-2-line text-danger" />
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>

            {/* Modal for Editing Patient */}
            <Modal show={showEditModal} onHide={handleCloseEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Patient</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="firstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                placeholder="Enter first name"
                                value={currentPatient.firstName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className='mt-3' controlId="email">
                            <Form.Label>Email ID</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                value={currentPatient.email}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className='mt-3' controlId="mobile">
                            <Form.Label>Mobile Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="mobile"
                                placeholder="Enter mobile number"
                                value={currentPatient.mobile}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className='mt-3' controlId="address">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                placeholder="Enter address"
                                value={currentPatient.address}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEdit}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Delete Confirmation */}
            <Modal show={showDeleteModal} onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete {patientToDelete?.firstName}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
}
