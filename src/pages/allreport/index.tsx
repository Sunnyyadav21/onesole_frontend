//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { Button, Card, Table, Modal, Form, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Index() {
    const [records, setRecords] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentRecord, setCurrentRecord] = useState({ id: null, reportDate: '', time: '', reportName: '', file: '' });
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [role, setRole] = useState();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [tokens, setTokens] = useState('');

    // Function to clean the token by removing first and last double quotes
    const cleanToken = (token) => token?.replace(/^"|"$/g, '');

    

    useEffect(() => {
        const token = localStorage.getItem('access-tokens');
        if (token) {
            setTokens(cleanToken(token));
        }
    }, []);

    useEffect(() => {
        setRole(localStorage.getItem('user-details'));
        fetchRecords();
    }, [tokens]);

    const fetchRecords = () => {
        fetch('http://localhost:3000/v1/test-reports' , {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokens}`
            },
        })
            .then(response => response.json())
            .then(data => setRecords(data.results))
            .catch(error => console.error('Error:', error));
    };

    const handleEditClick = (record) => {
        setCurrentRecord(record);
        setShowEditModal(true);
    };

    const handleDeleteClick = (record) => {
        setRecordToDelete(record);
        setShowDeleteModal(true);
    };

    const handleCloseEdit = () => {
        setShowEditModal(false);
        setCurrentRecord({ id: null, reportDate: '', time: '', reportName: '', file: '' });
    };

    const handleCloseDelete = () => {
        setShowDeleteModal(false);
        setRecordToDelete(null);
    };

    const handleSaveChanges = () => {
        const formData = new FormData();
        formData.append('reportDate', currentRecord.reportDate);
        formData.append('time', currentRecord.time);
        formData.append('reportName', currentRecord.reportName);
        if (currentRecord.file instanceof File) {
            formData.append('file', currentRecord.file);
        }

        fetch(`http://localhost:3000/v1/test-reports/${currentRecord.id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokens}`
            },
            body: formData,
        }).then(() => {
            setRecords(records.map(record =>
                record.id === currentRecord.id ? currentRecord : record
            ));
            setShowEditModal(false);
        }).catch(error => console.error('Error:', error));
    };

    const handleConfirmDelete = () => {
        fetch(`http://localhost:3000/v1/test-reports/${recordToDelete.id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokens}`
            },
        }).then(() => {
            setRecords(records.filter(record => record.id !== recordToDelete.id));
            setShowDeleteModal(false);
        }).catch(error => console.error('Error:', error));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentRecord(prevRecord => ({ ...prevRecord, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setCurrentRecord(prevRecord => ({ ...prevRecord, file }));
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

    const filterRecordsByDate = () => {
        if (startDate && endDate) {
            return records.filter(record => {
                const recordDate = new Date(record.reportDate);
                return recordDate >= startDate && recordDate <= endDate;
            });
        }

        return records;
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };


    return (
        <Card className='mt-4'>
            <Card.Header>
                <Row>
                    <Col lg={8}><h4 className="header-title">All Reports</h4></Col>
                    <Col lg={4}>
                        <Row>
                            <Form.Label>Filter By Date</Form.Label>
                            <Col>
                                <Form.Control
                                    value={startDate ? startDate.toISOString().substr(0, 10) : ''}
                                    onChange={(e) => setStartDate(new Date(e.target.value))}
                                    type="date"
                                    required
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    value={endDate ? endDate.toISOString().substr(0, 10) : ''}
                                    onChange={(e) => setEndDate(new Date(e.target.value))}
                                    type="date"
                                    required
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
                <div className="table-responsive-sm">
                    <Table className="table-striped table-centered mb-0">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('id')}>
                                    S.No. {getSortIcon('id')}
                                </th>
                                <th onClick={() => handleSort('reportDate')}>
                                    Report Date {getSortIcon('reportDate')}
                                </th>
                                {/* <th onClick={() => handleSort('time')}>
                                    Time {getSortIcon('time')}
                                </th> */}
                                <th onClick={() => handleSort('reportName')}>
                                    Report Name {getSortIcon('reportName')}
                                </th>
                                <th onClick={() => handleSort('file')}>
                                    Upload File (PDF, Doc, Image) {getSortIcon('file')}
                                </th>
                                {role && JSON.parse(role).role !== 'user' ? <th>Actions</th> : null}
                            </tr>
                        </thead>
                        <tbody>
                            {filterRecordsByDate()?.map((record, index) => (
                                <tr key={record.id}>
                                    <td>{index + 1}</td>
                                    <td>{formatDate(record.date)}</td>
                                    {/* <td>{record.time}</td> */}
                                    <td>{record.testName}</td>
                                    <td>{record.testName} <Link to={record.fileUrl} download>
                                        <i className='ri-file-download-fill'></i>
                                    </Link></td>
                                    {role && JSON.parse(role).role !== 'user' ? (
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
                                                onClick={() => handleDeleteClick(record)} >
                                                <i className="ri-delete-bin-2-line text-danger" />
                                            </Link>
                                        </td>
                                    ) : null}
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
                        <Form.Group className='mt-3' controlId="reportDate">
                            <Form.Label>Report Date</Form.Label>
                            <Form.Control type="date" name="reportDate" value={currentRecord.reportDate} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className='mt-3' controlId="time">
                            <Form.Label>Time</Form.Label>
                            <Form.Control type="time" name="time" value={currentRecord.time} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className='mt-3' controlId="reportName">
                            <Form.Label>Report Name</Form.Label>
                            <Form.Control type="text" name="reportName" value={currentRecord.reportName} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className='mt-3' controlId="file">
                            <Form.Label>Upload File (PDF, Doc, Image)</Form.Label>
                            <Form.Control type="file" name="file" onChange={handleFileChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEdit}>Cancel</Button>
                    <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Delete Confirmation */}
            <Modal show={showDeleteModal} onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete the record for {recordToDelete?.reportDate} at {recordToDelete?.time}?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDelete}>Cancel</Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
}
