// @ts-nocheck
import { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';
import { role } from '../ui/forms/data';

const Doctor = () => {
    const [validated, setValidated] = useState(false);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userRole, setUserRole] = useState('');
    const [tokens, setTokens] = useState('');
    const [hospitalRecords, setHospitalRecords] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [userPhone, setUserPhone] = useState('');
    const [selectedService, setSelectedService] = useState(null);

    console.log(selectedService)
    // Function to clean the token by removing first and last double quotes
    const cleanToken = (token) => token?.replace(/^"|"$/g, '');

    useEffect(() => {
        const token = localStorage.getItem('access-tokens');
        if (token) {
            setTokens(cleanToken(token));
        }
    }, []);

    const handleUserName = (e) => {
        setUserName(e.target.value);
    };

    const handleUserEmail = (e) => {
        setUserEmail(e.target.value);
    };

    const handleUserPassword = (e) => {
        setUserPassword(e.target.value);
    };

    const handleUserPhone = (e) => {
        setUserPhone(e.target.value)
    }

    const handleUserRole = (selectedOption) => {
        setUserRole(selectedOption.value);
    };

    const handleHospitalChange = (selectedOption) => {
        setSelectedHospital(selectedOption);
    };


    const hospitalServicess = [
        { value: 'Home Health Service Providers', label: 'Home Health Service Providers' },
        { value: 'Rentals', label: 'Rentals' },
        { value: 'Nursing Home', label: 'Nursing Home' },
        { value: 'Hospital', label: 'Hospital' },
        { value: 'Doctor', label: 'Doctor' },
        { value: 'Medical', label: 'Doctor' },
        { value: 'Radiology', label: 'Radiology' },
        { value: 'Homeopathy', label: 'Homeopathy' },
        { value: 'Ayurvedic(NaturoPathy)', label: 'Ayurvedic(NaturoPathy)' },

    ];

    const handelSelectedService = (selectedOption)=>{
        setSelectedService(selectedOption)
    }

    useEffect(() => {
        fetch('http://localhost:3000/v1/hospitals', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokens}`
            },
        })
            .then(res => res.json())
            .then(json => setHospitalRecords(json.results))
            .catch(err => console.error('Error fetching hospitals:', err));
    }, [tokens]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        }
        setValidated(true);

        try {
            const response = await fetch(`http://localhost:3000/v1/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokens}`
                },
                body: JSON.stringify({
                    name: userName,
                    email: userEmail,
                    mobile:userPhone,
                    password: userPassword,
                    role: userRole,
                    hospitalId: selectedHospital?.value,
                    category:selectedService.value
                })
            });

            if (!response.ok) {
                throw new Error('Failed to authenticate');
            }

            const data = await response.json();
            console.log('User added:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const hospitalOptions = hospitalRecords?.map(hospital => ({
        value: hospital.id,
        label: hospital.name
    }));

    return (
        <div className='col-md-12 pt-4'>
            <Card>
                <Card.Header>
                    <h4 className="header-title">Add User</h4>
                </Card.Header>
                <Card.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>User Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="validationCustomFirstName"
                                        placeholder="User Name"
                                        required
                                        value={userName}
                                        onChange={handleUserName}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>User Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        id="validationCustomEmail"
                                        placeholder="User Email"
                                        required
                                        value={userEmail}
                                        onChange={handleUserEmail}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>User Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="validationCustomFirstName"
                                        placeholder="User Phone Number"
                                        required
                                        value={userPhone}
                                        onChange={handleUserPhone}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>User Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        id="validationCustomPassword"
                                        placeholder="User Password"
                                        required
                                        value={userPassword}
                                        onChange={handleUserPassword}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Hospital name</Form.Label>
                                    <Select
                                        className="select2 z-3"
                                        options={hospitalOptions}
                                        value={selectedHospital}
                                        onChange={handleHospitalChange}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Role</Form.Label>
                                    <Select
                                        className="select2 z-3"
                                        options={role}
                                        value={role.find(option => option.value === userRole)}
                                        onChange={handleUserRole}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category </Form.Label>

                                    <Select
                                        options={hospitalServicess}
                                        placeholder="Select Category"
                                        required
                                        onChange={handelSelectedService}
                                        value={selectedService}
                                    />

                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit">
                            Add User
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Doctor;
