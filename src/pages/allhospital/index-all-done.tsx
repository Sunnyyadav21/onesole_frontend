// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Card, Table, Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Index() {
    const [hospitalName, setHospitalName] = useState([]);
    const [records, setRecords] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentHospital, setCurrentHospital] = useState({ id: null, name: '' });
    const [hospitalToDelete, setHospitalToDelete] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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
        setCurrentHospital({ id: null, name: '' }); // Reset current hospital state
    };

    const handleCloseDelete = () => {
        setShowDeleteModal(false);
        setHospitalToDelete(null); // Reset hospital to delete state
    };

    const handleSaveChanges = () => {
        // Logic to save changes (e.g., update records array or make an API call)
        setRecords(records.map(record =>
            record.id === currentHospital.id ? currentHospital : record
        ));
        setShowEditModal(false);
    };

    const handleConfirmDelete = () => {
        // Logic to delete hospital (e.g., update records array or make an API call)
        setRecords(records.filter(record => record.id !== hospitalToDelete.id));
        setShowDeleteModal(false);
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
        fetch('http://localhost:3000/v1/hospitals')
            .then(res => res.json())
            .then(json => {
                setHospitalName(json.results); // Assuming the fetched data is in 'results' key
                setRecords(json.results); // Set records with fetched data
            })
            .catch(error => console.error('Error fetching hospital data:', error));
    }, []);

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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((hospital, index) => (
                                <tr key={hospital.id}>
                                    <td>{index + 1}</td>
                                    <td className="table-user">{hospital.name}</td>
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
            <Modal show={showEditModal} onHide={handleCloseEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Hospital</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
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
                    Are you sure you want to delete {hospitalToDelete?.name}?
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
