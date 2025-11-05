// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Card, Table, Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Index() {
    const [data, setData] = useState([]);
    const [role, setRole] = useState();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentMedicine, setCurrentMedicine] = useState({ medicineName: '', times: {}, type: '', time: '' });
    const [medicineToDelete, setMedicineToDelete] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [tokens, setTokens] = useState('');

    console.log(currentMedicine, 'currentMedicine');



    const cleanToken = (token) => token?.replace(/^"|"$/g, '');

    useEffect(() => {
        const token = localStorage.getItem('access-tokens');
        if (token) {
            setTokens(cleanToken(token));
        }
    }, []);

    useEffect(() => {
        setRole(localStorage.getItem('user-details'));
    }, []);


    const getMedicineData = ()=>{
        if (tokens) {
            fetch('http://localhost:3000/v1/medicine-prescriptions', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokens}`
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setData(data?.results);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    useEffect(() => {
        getMedicineData()
    }, [tokens]);

    // useEffect(() => {
    //         getMedicineData();
    // }, [data])

    const handleEditClick = (medicine) => {
        console.log(medicine, '.medicine');
        //delete medicine.id
        setCurrentMedicine(medicine);
        setShowEditModal(true);
    };

    const handleDeleteClick = (medicine) => {
        setMedicineToDelete(medicine);
        setShowDeleteModal(true);
    };

    const handleCloseEdit = () => {
        setShowEditModal(false);
        setCurrentMedicine({ medicineName: '', times: {}, type: '', time: '' });
    };

    const handleCloseDelete = () => {
        setShowDeleteModal(false);
        setMedicineToDelete(null);
    };


    const handleSaveChanges = () => {
        setShowEditModal(false);
        // Create a copy of currentMedicine to avoid mutating the original object
        const medicineToUpdate = { ...currentMedicine };
        
        // Delete the id property from the copied object
        delete medicineToUpdate.id;
    
        fetch(`http://localhost:3000/v1/medicine-prescriptions/${currentMedicine.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokens}`
            },
            body: JSON.stringify(medicineToUpdate)
        })
            .then(response => {
                getMedicineData();
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch(error => {
                console.log('There was a problem with the fetch operation:', error);
            });
    };
    

    const handleConfirmDelete = () => {
        fetch(`http://localhost:3000/v1/medicine-prescriptions/${medicineToDelete.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokens}`
            }
        })
            .then(() => {
                const updatedData = data.filter(record => record.id !== medicineToDelete.id);
                setData(updatedData);
                setShowDeleteModal(false);
            })
            .catch((error) => {
                console.log(error);
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
        const sortedData = [...data].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        setData(sortedData);
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

    const handleCheckboxChange = (time) => {
        const newTimes = { ...currentMedicine.times };
        newTimes[time] = !newTimes[time];
        setCurrentMedicine({ ...currentMedicine, times: newTimes });
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const getNextDate = (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay;
    };

    const currentDate = new Date();
    const nextDate = getNextDate(currentDate);

    return (
        <Card className='mt-4'>
            <Card.Header>
                <h4 className="header-title">All Medicines</h4>
            </Card.Header>
            <Card.Body>
                <div className="table-responsive-sm">
                    <Table className="table-striped table-centered mb-0">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('id')}>
                                    S.No. {getSortIcon('id')}
                                </th>
                                <th onClick={() => handleSort('medicineName')}>
                                    Medicine Name {getSortIcon('medicineName')}
                                </th>
                                <th onClick={() => handleSort('times')}>
                                    Times {getSortIcon('times')}
                                </th>
                                <th onClick={() => handleSort('type')}>
                                    Type {getSortIcon('type')}
                                </th>
                                <th onClick={() => handleSort('time')}>
                                    Time {getSortIcon('time')}
                                </th>
                                {role && JSON.parse(role).role !== 'user' ? <th>Actions</th> : null}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((medicine, index) => (
                                <React.Fragment key={medicine.id}>
                                    <tr>
                                        <td colSpan={6}>Date: {formatDate(currentDate)}</td>
                                    </tr>
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{medicine.medicineName}</td>
                                        <td className="d-flex flex-wrap">
                                            {Object.keys(medicine.times).map(time => (
                                                <div key={time} className="d-flex align-items-center" style={{ marginRight: '10px', marginBottom: '3px' }}>
                                                    <Form.Check
                                                        inline
                                                        checked={medicine.times[time]}
                                                        onChange={() => handleCheckboxChange(time)}
                                                    />
                                                    <span>{time}</span>
                                                </div>
                                            ))}
                                        </td>
                                        <td>{medicine.type}</td>
                                        <td>{medicine.time}</td>
                                        {role && JSON.parse(role).role !== 'user' ? (
                                            <td>
                                                <Link
                                                    to="#"
                                                    className="text-reset fs-16 px-1"
                                                    onClick={() => handleEditClick(medicine)}
                                                >
                                                    <i className="ri-edit-box-line text-primary" />
                                                </Link>
                                                <Link
                                                    to="#"
                                                    className="text-reset fs-16 px-1"
                                                    onClick={() => handleDeleteClick(medicine)}
                                                >
                                                    <i className="ri-delete-bin-2-line text-danger" />
                                                </Link>
                                            </td>
                                        ) : null}
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>

            <Modal show={showEditModal} onHide={handleCloseEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Medicine</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="medicineName">
                            <Form.Label>Medicine Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter medicine name"
                                value={currentMedicine.medicineName}
                                onChange={(e) =>
                                    setCurrentMedicine({ ...currentMedicine, medicineName: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className='mt-3' controlId="times">
                            <Form.Label>Times</Form.Label>
                            {Object.keys(currentMedicine.times).map((time, idx) => (
                                <Form.Check
                                    key={idx}
                                    inline
                                    label={time}
                                    checked={currentMedicine.times[time]}
                                    onChange={() => handleCheckboxChange(time)}
                                />
                            ))}
                        </Form.Group>
                        <Form.Group className='mt-3' controlId="type">
                            <Form.Label>Type</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter type"
                                value={currentMedicine.type}
                                onChange={(e) =>
                                    setCurrentMedicine({ ...currentMedicine, type: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className='mt-3' controlId="time">
                            <Form.Label>Time for Taking Medicine</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter time for taking medicine"
                                value={currentMedicine.time}
                                onChange={(e) =>
                                    setCurrentMedicine({ ...currentMedicine, time: e.target.value })
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
                    Are you sure you want to delete {medicineToDelete?.medicineName}?
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
