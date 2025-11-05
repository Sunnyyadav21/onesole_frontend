//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { Card, Table, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './customStyles.css'; // Import the custom CSS file

export default function Index() {
    const [records, setRecords] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentHospital, setCurrentHospital] = useState({
        id: null, name: '', isActive: false, category: '', address: '', officePhoneNumber: '',
        website: '', contactPersonName: '', phoneNumber: '', email: ''
    });
    const [hospitalToDelete, setHospitalToDelete] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [tokens, setTokens] = useState('');

    // Function to clean the token by removing first and last double quotes
    const cleanToken = (token) => token?.replace(/^"|"$/g, '');

    

    useEffect(() => {
        const token = localStorage.getItem('access-tokens');
        if (token) {
            setTokens(cleanToken(token));
        }
    }, []);

    const handleEditClick = (hospital) => {
        setCurrentHospital(hospital);
        setShowEditModal(true);
    };

    const handleDeleteClick = (hospital) => {
        setHospitalToDelete(hospital);
        setShowDeleteModal(true);
    };

    const handleCloseEdit = () => {
        setShowEditModal(false);
        setCurrentHospital({
            id: null, name: '', isActive: false, category: '', address: '', officePhoneNumber: '',
            website: '', contactPersonName: '', phoneNumber: '', email: ''
        });
    };

    const handleCloseDelete = () => {
        setShowDeleteModal(false);
        setHospitalToDelete(null);
    };

    const handleSaveChanges = () => {
        fetch(`http://localhost:3000/v1/hospitals/${currentHospital.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokens}`
            },
            body: JSON.stringify({
                name: currentHospital.name,
                isActive: currentHospital.isActive,
                category: currentHospital.category,
                address: currentHospital.address,
                officePhoneNumber: currentHospital.officePhoneNumber,
                website: currentHospital.website,
                contactPersonName: currentHospital.contactPersonName,
                phoneNumber: currentHospital.phoneNumber,
                email: currentHospital.email
            })
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to update hospital');
            }
            return response.json();
        }).then(updatedHospital => {
            setRecords(records.map(record =>
                record.id === updatedHospital.id ? updatedHospital : record
            ));
            setShowEditModal(false);
        }).catch(error => {
            console.error('Error updating hospital:', error);
            // Handle error state or display error message
        });
    };

    const handleConfirmDelete = () => {
        fetch(`http://localhost:3000/v1/hospitals/${hospitalToDelete.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${tokens}`
            }
        }).then(() => {
            setRecords(records.filter(record => record.id !== hospitalToDelete.id));
            setShowDeleteModal(false);
        }).catch(error => {
            console.error('Error deleting hospital:', error);
            // Handle error state or display error message
        });
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
        const fetchHospitals = async () => {
            try {
                const response = await fetch('http://localhost:3000/v1/hospitals', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokens}`
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setRecords(data.results);
            } catch (error) {
                console.error('Error fetching hospitals:', error);
                // Handle error state or display error message here
            }
        };

        fetchHospitals();
    }, [tokens]);

    return (
        <Card className='mt-4'>
            <Card.Header>
                <h4 className="header-title">All Hospitals</h4>
            </Card.Header>
            <Card.Body>
                <div className="table-responsive-sm">
                    <Table className="table-striped table-centered mb-0">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('id')}>
                                    S.No. {getSortIcon('id')}
                                </th>
                                <th onClick={() => handleSort('name')}>
                                    Hospital Name {getSortIcon('name')}
                                </th>
                                <th onClick={() => handleSort('category')}>
                                    Category {getSortIcon('category')}
                                </th>
                                <th onClick={() => handleSort('address')}>
                                    Address {getSortIcon('address')}
                                </th>
                                <th onClick={() => handleSort('officePhoneNumber')}>
                                    Office Phone Number {getSortIcon('officePhoneNumber')}
                                </th>
                                <th onClick={() => handleSort('website')}>
                                    Website {getSortIcon('website')}
                                </th>
                                <th onClick={() => handleSort('contactPersonName')}>
                                    Contact Person Name {getSortIcon('contactPersonName')}
                                </th>
                                <th onClick={() => handleSort('phoneNumber')}>
                                    Phone Number {getSortIcon('phoneNumber')}
                                </th>
                                <th onClick={() => handleSort('email')}>
                                    Email {getSortIcon('email')}
                                </th>
                                <th>
                                    Status
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records?.map((hospital, index) => (
                                <tr key={hospital.id}>
                                    <td>{index + 1}</td>
                                    <td className="table-user">{hospital.name}</td>
                                    <td className="table-user">{hospital.category}</td>
                                    <td className="table-user">{hospital.address}</td>
                                    <td className="table-user">{hospital.officePhoneNumber}</td>
                                    <td className="table-user">{hospital.website}</td>
                                    <td className="table-user">{hospital.contactPersonName}</td>
                                    <td className="table-user">{hospital.phoneNumber}</td>
                                    <td className="table-user">{hospital.email}</td>
                                    <td className="table-user">{hospital.isActive ? "Is Active" : "Deactivated"}</td>
                                    <td>
                                        <Link
                                            to="#"
                                            className="text-reset fs-16 px-1"
                                            onClick={() => handleEditClick(hospital)}
                                        >
                                            <i className="ri-edit-box-line text-primary" />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-reset fs-16 px-1"
                                            onClick={() => handleDeleteClick(hospital)}
                                        >
                                            <i className="ri-delete-bin-2-line text-danger" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>

            {/* Modal for Editing Hospital */}
            <Row>
                <div className="Container">
                    <Modal className="wide-modal" show={showEditModal} onHide={handleCloseEdit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Hospital</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Group controlId="hospitalName">
                                            <Form.Label>Hospital Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter hospital name"
                                                value={currentHospital.name}
                                                onChange={(e) =>
                                                    setCurrentHospital({ ...currentHospital, name: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Group controlId="hospitalCategory">
                                            <Form.Label>Category</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter category"
                                                value={currentHospital.category}
                                                onChange={(e) =>
                                                    setCurrentHospital({ ...currentHospital, category: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Group controlId="hospitalAddress">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter address"
                                                value={currentHospital.address}
                                                onChange={(e) =>
                                                    setCurrentHospital({ ...currentHospital, address: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Group controlId="hospitalOfficePhone">
                                            <Form.Label>Office Phone Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter office phone number"
                                                value={currentHospital.officePhoneNumber}
                                                onChange={(e) =>
                                                    setCurrentHospital({
                                                        ...currentHospital,
                                                        officePhoneNumber: e.target.value,
                                                    })
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Group controlId="hospitalWebsite">
                                            <Form.Label>Website</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter website"
                                                value={currentHospital.website}
                                                onChange={(e) =>
                                                    setCurrentHospital({ ...currentHospital, website: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Group controlId="hospitalContactPerson">
                                            <Form.Label>Contact Person Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter contact person name"
                                                value={currentHospital.contactPersonName}
                                                onChange={(e) =>
                                                    setCurrentHospital({
                                                        ...currentHospital,
                                                        contactPersonName: e.target.value,
                                                    })
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Group controlId="hospitalPhoneNumber">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter phone number"
                                                value={currentHospital.phoneNumber}
                                                onChange={(e) =>
                                                    setCurrentHospital({ ...currentHospital, phoneNumber: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Group controlId="hospitalEmail">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter email"
                                                value={currentHospital.email}
                                                onChange={(e) =>
                                                    setCurrentHospital({ ...currentHospital, email: e.target.value })
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                    <Form.Group controlId="hospitalIsActive">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={currentHospital.isActive ? 'Is Active' : 'Deactivated'}
                                        onChange={(e) =>
                                            setCurrentHospital({
                                                ...currentHospital,
                                                isActive: e.target.value === 'Is Active'
                                            })
                                        }
                                    >
                                        <option value="Is Active">Is Active</option>
                                        <option value="Deactivated">Deactivated</option>
                                    </Form.Control>
                                </Form.Group>
                                    </Col>
                                </Row>
                               
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseEdit}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSaveChanges}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </Row>

            {/* Modal for Deleting Hospital */}
            <Modal show={showDeleteModal} onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Hospital</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this hospital?
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
