// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Card, Table, Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Index() {
    const [records, setRecords] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [hospitalOptions, setHospitalOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [currentHospital, setCurrentHospital] = useState({ id: null, hospitalName: '', doctorName: '', hospitalId: '', category: '' });
    const [hospitalToDelete, setHospitalToDelete] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [role, setRole] = useState('');
    const [tokens, setTokens] = useState('');

    // Function to clean the token by removing first and last double quotes
    const cleanToken = (token) => token?.replace(/^"|"$/g, '');

    console.log(records, 'records');

    useEffect(() => {
        const token = localStorage.getItem('access-tokens');
        if (token) {
            setTokens(cleanToken(token));
        }
    }, []);

    const handleHospitalChange = (selectedOption) => {
        console.log(selectedOption.value, 'selectedOption.value');
        setCurrentHospital({ ...currentHospital, hospitalName: selectedOption.label, hospitalId: selectedOption.value });
    };

    const handleCategoryChange = (selectedOption) => {
        setCurrentHospital({ ...currentHospital, category: selectedOption.label });
    };

    useEffect(() => {
        if (tokens) {
            fetch('http://localhost:3000/v1/users?role=doctor', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokens}`
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setRecords(data?.results);
                    console.log(data?.results, 'data?.results');

                    // Fetch hospital data for options
                    fetch('http://localhost:3000/v1/hospitals', {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${tokens}`
                        },
                    })
                        .then((response) => response.json())
                        .then((hospitalData) => {
                            const formattedHospitals = hospitalData?.results.map(hospital => ({
                                value: hospital?.id,
                                label: hospital?.name
                            }));
                            setHospitalOptions(formattedHospitals);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [tokens]);

    useEffect(() => {
        setRole(localStorage.getItem('user-details'));
    }, []);

    useEffect(() => {
        setCategoryOptions([
            { value: 'Home Health Service Providers', label: 'Home Health Service Providers' },
            { value: 'Rentals', label: 'Rentals' },
            { value: 'Nursing Home', label: 'Nursing Home' },
            { value: 'Hospital', label: 'Hospital' },
            { value: 'Doctor', label: 'Doctor' },
            { value: 'Medical', label: 'Medical' },
            { value: 'Radiology', label: 'Radiology' },
            { value: 'Homeopathy', label: 'Homeopathy' },
            { value: 'Ayurvedic(NaturoPathy)', label: 'Ayurvedic(NaturoPathy)' },
        ]);
    }, []);

    const handleEditClick = (hospital) => {
        setCurrentHospital({
            id: hospital.id,
            hospitalName: hospital.hospitalId?.name,
            doctorName: hospital.name,
            hospitalId: hospital.hospitalId?.id,
            category: hospital.category
        });
        setShowEditModal(true);
    };

    const handleDeleteClick = (hospital) => {
        setHospitalToDelete(hospital);
        setShowDeleteModal(true);
    };

    const handleCloseEdit = () => {
        setShowEditModal(false);
        setCurrentHospital({ id: null, hospitalName: '', doctorName: '', hospitalId: '', category: '' }); // Reset current hospital state
    };

    const handleCloseDelete = () => {
        setShowDeleteModal(false);
        setHospitalToDelete(null); // Reset hospital to delete state
    };

    const handleSaveChanges = () => {
        console.log(currentHospital.id, currentHospital);
        fetch(`http://localhost:3000/v1/users/${currentHospital.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokens}`
            },
            body: JSON.stringify({
                name: currentHospital.doctorName,
                hospitalId: currentHospital.hospitalId,
                category: currentHospital.category,
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update hospital');
                }
                return response.json();
            })
            .then(updatedHospital => {
                setRecords(records.map(record =>
                    record.id === updatedHospital.id ? updatedHospital : record
                ));
                toast.success('Doctor updated successfully!');
                setShowEditModal(false);
            })
            .catch(error => {
                console.error('Error updating hospital:', error);
                toast.error('Failed to update doctor.');
            });
    };

    const handleConfirmDelete = () => {
        fetch(`http://localhost:3000/v1/users/${hospitalToDelete.id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${tokens}`
            }
        })
            .then(() => {
                setRecords(records.filter(record => record.id !== hospitalToDelete.id));
                toast.success('Doctor deleted successfully!');
                setShowDeleteModal(false);
            })
            .catch(error => {
                console.error('Error deleting hospital:', error);
                toast.error('Failed to delete doctor.');
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

    return (
        <Card className='mt-4'>
            <Card.Header>
                <h4 className="header-title">All Doctors</h4>
            </Card.Header>
            <Card.Body>
                <div className="table-responsive-sm">
                    <Table className="table-striped table-centered mb-0">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('id')}>
                                    S.No. {getSortIcon('id')}
                                </th>
                                <th onClick={() => handleSort('hospitalName')}>
                                    Hospital Name {getSortIcon('hospitalName')}
                                </th>
                                <th onClick={() => handleSort('doctorName')}>
                                    Doctor Name {getSortIcon('doctorName')}
                                </th>
                                <th onClick={() => handleSort('category')}>
                                    Category {getSortIcon('category')}
                                </th>
                                {role && JSON.parse(role).role !== 'user' ? <th>Actions</th> : null}
                            </tr>
                        </thead>
                        <tbody>
                            {records?.map((hospital, index) => (
                                hospital?.role === 'doctor' ? <tr key={hospital.id}>
                                    <td>{index + 1}</td>
                                    <td className="table-user">{hospital?.hospitalId?.name}</td>
                                    <td className="table-user">{hospital?.name}</td>
                                    <td className="table-user">{hospital?.category}</td>
                                    {role && JSON.parse(role).role !== 'user' ? <td>
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
                                    </td> : null}
                                </tr> : null
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>

            {/* Modal for Editing Hospital */}
            <Modal show={showEditModal} onHide={handleCloseEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Doctor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Hospital Name</Form.Label>
                            <Select
                                className="select2 z-3"
                                options={hospitalOptions}
                                value={hospitalOptions.find(option => option.value === currentHospital.hospitalId)}
                                onChange={handleHospitalChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className='mt-3' controlId="doctorName">
                            <Form.Label>Doctor Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter doctor name"
                                value={currentHospital.doctorName}
                                onChange={(e) =>
                                    setCurrentHospital({ ...currentHospital, doctorName: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Category</Form.Label>
                            <Select
                                className="select2 z-3"
                                options={categoryOptions}
                                value={categoryOptions.find(option => option.label === currentHospital.category)}
                                onChange={handleCategoryChange}
                                required
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
                    Are you sure you want to delete {hospitalToDelete?.hospitalName}?
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
            <ToastContainer />
        </Card>
    );
}
