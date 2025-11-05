// @ts-nocheck
import { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Doctor = () => {
    const [validated, setValidated] = useState(false);
    const [hospitalOptions, setHospitalOptions] = useState([]);
    const [doctorName, setDoctorName] = useState("");
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [tokens, setTokens] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('access-tokens');
        if (token) {
            setTokens(token.replace(/^"|"$/g, ''));
        }
    }, []);

    useEffect(() => {
        fetch('http://localhost:3000/v1/hospitals', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokens}`
            },
        })
            .then(resp => resp.json())
            .then(data => {
                const formattedHospitals = data?.results.map(hospital => ({
                    value: hospital.id,
                    label: hospital.name
                }));
                setHospitalOptions(formattedHospitals);
            })
            .catch(error => {
                console.error('Error fetching hospitals:', error);
                //toast.error('Error fetching hospitals');
            });
    }, [tokens]);

    const hospitalServicess = [
        { value: 'Home Health Service Providers', label: 'Home Health Service Providers' },
        { value: 'Rentals', label: 'Rentals' },
        { value: 'Nursing Home', label: 'Nursing Home' },
        { value: 'Hospital', label: 'Hospital' },
        { value: 'Doctor', label: 'Doctor' },
        { value: 'Medical', label: 'Medical' },
        { value: 'Radiology', label: 'Radiology' },
        { value: 'Homeopathy', label: 'Homeopathy' },
        { value: 'Ayurvedic(NaturoPathy)', label: 'Ayurvedic(NaturoPathy)' },
    ];

    const handleDoctorNameChange = (e) => {
        setDoctorName(e.target.value);
    };

    const handleHospitalChange = (selectedOption) => {
        setSelectedHospital(selectedOption);
    };

    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const data = {
                name: doctorName,
                hospitalId: selectedHospital?.value,
                category: selectedCategory?.value,
                password: 'Password123',
                role: "doctor",
                email:'test@gmail.com',
                //  hospitalId: "665ae2d78f0436512cf8c735",
                mobile: Math.floor(Date.now() / 1000).toString(),

            };

            try {
                const response = await fetch('http://localhost:3000/v1/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${tokens}`
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error data:', errorData);
                    throw new Error('Failed to add doctor');
                }

                const responseData = await response.json();
                toast.success('Doctor added successfully!');
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to add doctor.');
            }
        }
        setValidated(true);
    };

    return (
        <div className='col-md-12 pt-4'>
            <Card>
                <Card.Header>
                    <h4 className="header-title">Add Doctor</h4>
                </Card.Header>
                <Card.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Hospital name</Form.Label>
                                    <Select
                                        className="select2 z-3"
                                        options={hospitalOptions}
                                        onChange={handleHospitalChange}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please select a hospital.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Doctor name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="validationCustomFirstName"
                                        placeholder="Doctor name"
                                        required
                                        value={doctorName}
                                        onChange={handleDoctorNameChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a doctor name.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Select
                                        options={hospitalServicess}
                                        placeholder="Select Category"
                                        onChange={handleCategoryChange}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please select a category.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button variant="primary" type="submit">
                            Add Doctor
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <ToastContainer />
        </div>
    );
};

export default Doctor;
