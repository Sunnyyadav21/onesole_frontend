// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Card, Table, Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Index() {
    const [records, setRecords] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentRecord, setCurrentRecord] = useState({ id: null, date: '', time: '', diets: [] });
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [role, setRole] = useState();
    const [tokens, setTokens] = useState('');
    const [editStatus, setEditStatus] = useState(false);

    const cleanToken = (token) => token?.replace(/^"|"$/g, '');

    useEffect(() => {
        const token = localStorage.getItem('access-tokens');
        if (token) {
            setTokens(cleanToken(token));
        }
    }, []);

    useEffect(() => {
        const fetchVitalCharts = () => {
            const token = localStorage.getItem('access-tokens');
            const cleanedToken = token ? token.replace(/^"|"$/g, '') : '';

            fetch('http://localhost:3000/v1/diet-charts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cleanedToken}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setRecords(data.results);
                })
                .catch(error => {
                    console.error('Error fetching diet charts:', error.message);
                });
        };

        fetchVitalCharts();
        setRole(localStorage.getItem('user-details'));
    }, [tokens, editStatus]);

    const handleEditClick = (record) => {
        setCurrentRecord({
            ...record,
            diets: record.diets || []
        });
        setShowEditModal(true);
    };

    const handleDeleteClick = (record) => {
        setRecordToDelete(record);
        setShowDeleteModal(true);
    };

    const handleCloseEdit = () => {
        setShowEditModal(false);
        setCurrentRecord({ id: null, date: '', time: '', diets: [] });
    };

    const handleCloseDelete = () => {
        setShowDeleteModal(false);
        setRecordToDelete(null);
    };

    const handleSaveChanges = async () => {
        setEditStatus(false);
        try {

            console.log(currentRecord, 'currentRecordcurrentRecord')
            const updatedRecord = {
                ...currentRecord,
                diets: currentRecord.diets.map(diet => ({                  
                    dietId: diet.dietId?.id, // Ensure vitalEntryId is included and correctly formatted
                    quantity: diet.quantity
                })),
                 id:currentRecord.id
            };
    
            // Remove fields that are not allowed
            const { id, ...dataToUpdate } = updatedRecord;

            const response = await fetch(`http://localhost:3000/v1/diet-charts/${currentRecord.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokens}`
                },
                body: JSON.stringify(dataToUpdate)
            });

            if (!response.ok) {
                throw new Error('Failed to update record');
            }
            setEditStatus(true);
            const result = await response.json();
            setRecords(records.map(record =>
                record.id === result.id ? result : record
            ));
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating record:', error);
        }
    };

    const handleConfirmDelete = () => {
        fetch(`http://localhost:3000/v1/diet-charts/${recordToDelete.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokens}`
            }
        })
            .then(() => {
                setRecords(records.filter(record => record.id !== recordToDelete.id));
                setShowDeleteModal(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDietChange = (index, e) => {
        const { name, value } = e.target;
        const updatedDiets = [...currentRecord.diets];
        updatedDiets[index] = { ...updatedDiets[index], [name]: value };
        setCurrentRecord(prevRecord => ({ ...prevRecord, diets: updatedDiets }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentRecord(prevRecord => ({ ...prevRecord, [name]: value }));
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

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const displayedNames = new Set();
    return (
        <Card className='mt-4'>
            <Card.Header>
                <h4 className="header-title">All Diet Chart</h4>
            </Card.Header>
            <Card.Body>
                <div className="table-responsive-sm">
                    <Table className="table-striped table-centered mb-0">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('id')}>
                                    S.No. {getSortIcon('id')}
                                </th>
                                <th onClick={() => handleSort('date')}>
                                Date {getSortIcon('date')}
                                </th>
                                <th onClick={() => handleSort('time')}>
                                    Time {getSortIcon('time')}
                                </th>
                                {records.flatMap(record => record.diets).map((diet) => {
                                    if (!displayedNames.has(diet.dietId?.name)) {
                                        displayedNames.add(diet.dietId?.name);
                                        return (
                                            <th key={diet.dietId?.name}>
                                                {diet.dietId?.name}
                                            </th>
                                        );
                                    }
                                    return null;
                                })}
                                {role && JSON.parse(role).role !== 'user' && (
                                    <th>Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record, index) => (
                                <tr key={record.id}>
                                    <td>{index + 1}</td>
                                    <td>{formatDate(record.date)}</td>
                                    <td>{record.time}</td>
                                    {Array.from(displayedNames).map((diet) => {
                                        const found = record.diets.find(each => each.dietId?.name === diet);
                                        if (!found) {
                                            return <td key={diet}>--</td>;
                                        }
                                        return <td key={diet}>{found.quantity}</td>;
                                    })}
                                    {role && JSON.parse(role).role !== 'user' && (
                                        <td>
                                            <Link
                                                to="#"
                                                className="text-reset fs-16 px-1"
                                                onClick={() => handleEditClick(record)}
                                            >
                                                <i className="ri-edit-box-line text-primary" />
                                            </Link>
                                            <Link
                                                to="#"
                                                className="text-reset fs-16 px-1"
                                                onClick={() => handleDeleteClick(record)}
                                            >
                                                <i className="ri-delete-bin-2-line text-danger" />
                                            </Link>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>

            {/* Modal for Editing Record */}
            <Modal show={showEditModal} onHide={handleCloseEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="date">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={currentRecord.date}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className='mt-3' controlId="time">
                            <Form.Label>Time</Form.Label>
                            <Form.Control
                                type="time"
                                name="time"
                                value={currentRecord.time}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {currentRecord.diets.map((diet, index) => (
                            <div key={diet.dietId?.name}>
                                <Form.Group className='mt-3'>
                                    <Form.Label>{diet.dietId?.name}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="quantity"
                                        placeholder={`Enter ${diet.dietId?.name}`}
                                        value={diet.quantity || ''}
                                        onChange={(e) => handleDietChange(index, e)}
                                    />
                                </Form.Group>
                            </div>
                        ))}
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
                    Are you sure you want to delete the record for {recordToDelete?.date} at {recordToDelete?.time}?
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
