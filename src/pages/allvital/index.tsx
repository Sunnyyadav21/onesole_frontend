//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Modal, Table } from 'react-bootstrap';
import Select from 'react-select';
import { Link } from 'react-router-dom';

const Index = () => {
    const [statuses, setStatuses] = useState({});
    const [record, setRecord] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editData, setEditData] = useState({ id: '', name: '', value: '', status: '' });
    const [vitalToDelete, setVitalToDelete] = useState(null);
    const [tokens, setTokens] = useState('');

    // Function to clean the token by removing first and last double quotes
    const cleanToken = (token) => token?.replace(/^"|"$/g, '');

    useEffect(() => {
        const token = localStorage.getItem('access-tokens');
        if (token) {
            setTokens(cleanToken(token));
        }
    }, []);

    const hospitalOptions = [
        { value: 'Active', label: 'Active' },
        { value: 'Deactive', label: 'Deactive' },
    ];

    const handleSelectChange = (selectedOption, key) => {
        setStatuses((prevStatuses) => ({
            ...prevStatuses,
            [key]: selectedOption.value,
        }));
    };

    useEffect(() => {
        fetch('http://localhost:3000/v1/vital-entries', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokens}`
                
            },
        })
            .then((res) => res.json())
            .then((data) => setRecord(data.results || []))
            .catch((error) => {
                console.error(error);
            });
    }, [tokens]);

    const handleEditClick = (vital) => {
        setEditData(vital);
        setShowEditModal(true);
    };

    const handleSaveChanges = () => {
        const { id, ...dataToUpdate } = editData;
        fetch(`http://localhost:3000/v1/vital-entries/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokens}`

            },
            body: JSON.stringify(dataToUpdate),
        })
            .then((response) => response.json())
            .then((updatedVital) => {
                setRecord((prevRecord) =>
                    prevRecord.map((vital) => (vital.id === updatedVital.id ? updatedVital : vital))
                );
                setShowEditModal(false);
            })
            .catch((error) => {
                console.error('Error updating data:', error);
            });
    };

    const handleDeleteClick = (vitalID) => {
        setVitalToDelete(vitalID);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        fetch(`http://localhost:3000/v1/vital-entries/${vitalToDelete}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                  Authorization: `Bearer ${tokens}`
            },
        })
            .then(() => {
                setRecord((prevRecord) => prevRecord.filter((vital) => vital.id !== vitalToDelete));
                setShowDeleteModal(false);
                setVitalToDelete(null);
            })
            .catch((error) => {
                console.error('Error deleting data:', error);
            });
    };

    const handleCloseEdit = () => {
        setShowEditModal(false);
    };

    const handleCloseDelete = () => {
        setShowDeleteModal(false);
    };

    return (
        <Card className="mt-4">
            <Card.Header>
                <h4 className="header-title">All Vital</h4>
            </Card.Header>
            <Card.Body>
                <div className="table-responsive-sm">
                    <Table className="table-striped table-centered mb-0">
                        <tbody>
                            {record.map((vital, index) => (
                                <tr key={index}>
                                    <td>
                                        <i className="ri-shield-check-fill text-success me-2"></i> {vital.name}: {vital.value}
                                    </td>
                                    <td>
                                        <Form.Group>
                                            {/* <Select
                                                options={hospitalOptions}
                                                placeholder="Select Status"
                                                value={hospitalOptions.find(
                                                    (option) => option.value === statuses[vital.id]
                                                )}
                                                onChange={(selectedOption) =>
                                                    handleSelectChange(selectedOption, vital.id)
                                                }
                                            /> */}
                                            {
                                                vital.status
                                            }
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
                                    </td>
                                    <td>
                                        <Link
                                            to="#"
                                            className="text-reset fs-16 px-1"
                                            onClick={() => handleEditClick(vital)}
                                        >
                                            <i className="ri-edit-box-line text-primary"></i>
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-reset fs-16 px-1"
                                            onClick={() => handleDeleteClick(vital.id)}
                                        >
                                            <i className="ri-delete-bin-2-line text-danger"></i>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
            <Modal show={showEditModal} onHide={handleCloseEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Vital</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="vitalName">
                            <Form.Label>Vital Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter vital name"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            />
                        </Form.Group>
                        {/* <Form.Group className="mt-3" controlId="vitalValue">
                            <Form.Label>Value</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter value"
                                value={editData.value}
                                onChange={(e) => setEditData({ ...editData, value: e.target.value })}
                            />
                        </Form.Group> */}
                        <Form.Group className="mt-3" controlId="vitalStatus">
                            <Form.Label>Status</Form.Label>
                            <Select
                                options={hospitalOptions}
                                placeholder="Select Status"
                                value={hospitalOptions.find((option) => option.value === editData.status)}
                                onChange={(selectedOption) =>
                                    setEditData({ ...editData, status: selectedOption.value })
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
            <Modal show={showDeleteModal} onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this vital?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
};

export default Index;
