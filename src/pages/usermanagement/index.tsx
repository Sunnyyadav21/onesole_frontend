// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Card, Table, Modal, Button, Form, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { json } from 'stream/consumers';

export default function Index() {

    const [records, setRecords] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    const initialRecords = [
        { id: 1, userName: 'John Doe', userEmail: 'john.doe@example.com', role: 'Admin' },
        { id: 2, userName: 'Jane Smith', userEmail: 'jane.smith@example.com', role: 'User' }
    ];

    // const [records, setRecords] = useState();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentUser, setCurrentUser] = useState({ id: null, name: '', email: '', role: '' });
    const [userToDelete, setUserToDelete] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [tokens, setTokens] = useState('');

    //console.log(tokens, 'tokens User List')
    console.log(userToDelete, 'tokens User List')


    // Function to clean the token by removing first and last double quotes
    const cleanToken = (token) => token?.replace(/^"|"$/g, '');

    useEffect(() => {
        const token = localStorage.getItem('access-tokens');
        console.log(token);

        if (token) {
            setTokens(cleanToken(token));
        }
    }, []);

    const handleEditClick = (user) => {
        setCurrentUser(user);
        setUserToDelete(user)
        setShowEditModal(true);

    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleCloseEdit = () => {
        setShowEditModal(false);
        setCurrentUser({ id: null, name: '', email: '', role: '' }); // Reset current user state
    };

    const handleCloseDelete = () => {
        setShowDeleteModal(false);
        setUserToDelete(null); // Reset user to delete state
    };

    const handleSaveChanges = () => {
        // Update the records with the edited user
        console.log(userToDelete.hospitalId)
        fetch(`http://localhost:3000/v1/users/${currentUser.id}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${tokens}`
            },
            body: JSON.stringify({
                "name": currentUser.name,
                "email": currentUser.email,
                "hospitalId": userToDelete.hospitalId,
            }),

        }).then(() => {
            setRecords(records.map((record, userToDelete) => {
                console.log(record.id, userToDelete.hospitalId);
                return record.id === currentUser.id ? currentUser : record
            }));
            setShowEditModal(false);
        })

    };

    const handleConfirmDelete = () => {
        // Remove the user from the records
        //    console.log(userToDelete.id)
        fetch(`http://localhost:3000/v1/users/${userToDelete.id}`, {
            method: "DELETE",
            headers: {
                'Content-type': 'appliction/json',
                "Authorization": `Bearer ${tokens}`
            }
        }).then(() => {
            setRecords(records.filter(record => record.id !== userToDelete.id));
            setShowDeleteModal(false);
        })

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


    // Fetch users from API

    const fetchUsers = (page) => {

        fetch(`http://localhost:3000/v1/users?page=${page}&limit=10`, {


            method: "GET",

            headers: {

                "Content-Type": "application/json",

                "Authorization": `Bearer ${tokens}`

            },

        })

            .then((response) => response.json())

            .then((data) => {

                setRecords(data.results);

                setCurrentPage(data.page);

                setTotalPages(data.totalPages);

            })

            .catch((error) => {

                console.error(error);

            });

    };



    useEffect(() => {

        if (tokens) {

            fetchUsers(currentPage);

        }

    }, [tokens, currentPage]);
    // Handle pagination click
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <Card className='mt-4'>
            <Card.Header>
                <h4 className="header-title">Users List</h4>
            </Card.Header>
            <Card.Body>
                <div className="table-responsive-sm">
                    <Table className="table-striped table-centered mb-0">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('id')}>
                                    S.No. {getSortIcon('id')}
                                </th>
                                <th onClick={() => handleSort('userName')}>
                                    User Name {getSortIcon('userName')}
                                </th>
                                <th onClick={() => handleSort('userEmail')}>
                                    User Email {getSortIcon('userEmail')}
                                </th>
                                <th onClick={() => handleSort('role')}>
                                    Role {getSortIcon('role')}
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records?.map((user, index) => (

                                <tr key={user?.id} >

                                    <td>{index + 1}</td>
                                    <td className="table-user">{user?.name}</td>
                                    <td className="table-user">{user?.email}</td>
                                    <td className="table-user">{user?.role}</td>
                                    <td>
                                        <Link
                                            to="#"
                                            className="text-reset fs-16 px-1"
                                            onClick={() => handleEditClick(user)}
                                        >
                                            <i className="ri-edit-box-line text-primary" />
                                        </Link>
                                        <Link
                                            to="#"
                                            className="text-reset fs-16 px-1"
                                            onClick={() => handleDeleteClick(user)}
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

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={handleCloseEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formUserName">
                            <Form.Label>User Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentUser.name}
                                onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className='mt-3' controlId="formUserEmail">
                            <Form.Label>User Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={currentUser.email}
                                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className='mt-3' controlId="formRole">
                            <Form.Label>Role</Form.Label>
                            <Form.Control
                                as="select"
                                value={currentUser.role}
                                onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                            >
                                <option value="Admin">Admin</option>
                                <option value="User">User</option>
                                <option value="Manager">Manager</option>
                                <option value="Guest">Guest</option>
                            </Form.Control>
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
            {/* Pagination Controls */}

            <Pagination>

                <Pagination.Prev disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} />

                {Array.from({ length: totalPages }, (_, i) => (

                    <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>

                        {i + 1}

                    </Pagination.Item>

                ))}

                <Pagination.Next disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} />

            </Pagination>
            {/* Delete Modal */}
            <Modal show={showDeleteModal} onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete User</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDelete}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card >


    );
}
