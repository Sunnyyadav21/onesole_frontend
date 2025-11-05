//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { Card, Table, Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Index() {
    const [records, setRecords] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentRecord, setCurrentRecord] = useState({ id: null, date: '', time: '', vitals: [] });
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

            fetch('http://localhost:3000/v1/vital-charts', {
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
                console.error('Error fetching vital charts:', error.message);
            });
        };

        fetchVitalCharts();
        setRole(localStorage.getItem('user-details'));
    }, [tokens, editStatus]);

    // useEffect(()=>{
    //     fetchVitalCharts();
    // },[])

    const handleEditClick = (record) => {
      alert();
        console.log(record, 'edit');
        
        setCurrentRecord({
            ...record,
            vitals: record.vitals || []
        });
        setShowEditModal(true);
    };

    const handleDeleteClick = (record) => {
        setRecordToDelete(record);
        setShowDeleteModal(true);
    };

    const handleCloseEdit = () => {
        setShowEditModal(false);
        setCurrentRecord({ id: null, date: '', time: '', vitals: [] });
    };

    const handleCloseDelete = () => {
        setShowDeleteModal(false);
        setRecordToDelete(null);
    };

    const handleSaveChanges = async () => {
        setEditStatus(false);
        console.log(currentRecord, 'currentRecordcurrentRecordcurrentRecord')
        try {
            // Prepare the data to be sent in the request
            const updatedRecord = {
                ...currentRecord,
                vitals: currentRecord.vitals.map(vital => ({                  
                    vitalEntryId: vital.vitalEntryId?.id, // Ensure vitalEntryId is included and correctly formatted
                    value: vital.value
                })),
                 id:currentRecord.id
            };
    
            // Remove fields that are not allowed
            const { id, ...dataToUpdate } = updatedRecord;
    
            // Send the update request
            const response = await fetch(`http://localhost:3000/v1/vital-charts/${currentRecord.id}`, {
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
            // Update the local state with the updated record
            const result = await response.json();
            setRecords(records.map(record =>
                record.id === result.id ? result : record
            ));
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating record:', error);
        }
    }
    
    

    const handleConfirmDelete = () => {
        fetch(`http://localhost:3000/v1/vital-charts/${recordToDelete.id}`, {
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
            console.error('Error deleting record:', error);
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentRecord(prevRecord => ({ ...prevRecord, [name]: value }));
    };

    const handleVitalChange = (index, e) => {
        const { name, value } = e.target;
        const updatedVitals = [...currentRecord.vitals];
        updatedVitals[index] = { ...updatedVitals[index], [name]: value };
        setCurrentRecord(prevRecord => ({ ...prevRecord, vitals: updatedVitals }));
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
                <h4 className="header-title">All Vital Charts</h4>
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
                                {
                                    records.flatMap(record => record.vitals).map((vital) => {
                                        if (!displayedNames.has(vital.vitalEntryId?.name)) {
                                            displayedNames.add(vital.vitalEntryId?.name);
                                            return (
                                                <th key={vital.vitalEntryId?.name}>
                                                    {vital.vitalEntryId?.name}
                                                </th>
                                            );
                                        }
                                        return null;
                                    })
                                }
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
                                    {Array.from(displayedNames).map((vital) => {
                                        const found = record.vitals.find(each => each.vitalEntryId?.name === vital);
                                        if (!found) {
                                            return <td key={vital}>--</td>;
                                        }
                                        return <td key={vital}>{found.value}</td>;
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
                        {currentRecord.vitals.map((vital, index) => (
                            <div key={vital.vitalEntryId?.name}>
                                <Form.Group className='mt-3'>
                                    <Form.Label>{vital.vitalEntryId?.name}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="value"
                                        placeholder={`Enter ${vital.vitalEntryId?.name}`}
                                        value={vital.value || ''}
                                        onChange={(e) => handleVitalChange(index, e)}
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
