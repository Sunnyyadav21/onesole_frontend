//@ts-nocheck
import { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Hospital = () => {
    const [validated, setValidated] = useState(false);
    const [hospital, setHospital] = useState("");
    const [category, setCategory] = useState("");
    const [address, setAddress] = useState("");
    const [officePhoneNumber, setOfficePhoneNumber] = useState("");
    const [website, setWebsite] = useState("");
    const [contactPersonName, setContactPersonName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [isActive, setIsActive] = useState(null);
    const [tokens, setTokens] = useState('');

    // Function to clean the token by removing first and last double quotes
    const cleanToken = (token) => token?.replace(/^"|"$/g, '');

    useEffect(() => {
        const token = localStorage.getItem('access-tokens');
        if (token) {
            setTokens(cleanToken(token));
        }
    }, []);
    const data = {
        name: hospital,
        category: category,
        address: address,
        officePhoneNumber: officePhoneNumber,
        website: website,
        contactPersonName: contactPersonName,
        phoneNumber: phoneNumber,
        email: email,
        isActive: isActive === 'isActive'
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            console.log(data);
            try {
                const response = await fetch('http://localhost:3000/v1/hospitals', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                         Authorization: `Bearer ${tokens}`
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error data:', errorData);
                    throw new Error('Failed to add hospital');
                }

                const responseData = await response.json();
                toast.success('Hospital added successfully!');
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to add hospital.');
            }
        }
        setValidated(true);
    };

    const hospitalOptions = [
        { value: 'isActive', label: 'isActive' },
        { value: 'isDeactivate', label: 'isDeactivate' },
    ];

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

    const handleHospitalChange = (e) => {
        setHospital(e.target.value);
    };

    const handleCategoryChange = (selectedOption) => {
        setCategory(selectedOption.value);
    };

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    const handleOfficePhoneNumberChange = (e) => {
        setOfficePhoneNumber(e.target.value);
    };

    const handleWebsiteChange = (e) => {
        setWebsite(e.target.value);
    };

    const handleContactPersonNameChange = (e) => {
        setContactPersonName(e.target.value);
    };

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSelectChange = (selectedOption) => {
        setIsActive(selectedOption.value);
    };

    return (
        <div className='col-md-12 pt-4'>
            <Card>
                <Card.Header>
                    <h4 className="header-title">Add Hospital</h4>
                </Card.Header>
                <Card.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Hospital name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="validationCustomFirstName"
                                        placeholder="Hospital name"
                                        required
                                        onChange={handleHospitalChange}
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
                                        onChange={handleCategoryChange}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Select
                                        options={hospitalOptions}
                                        placeholder="Select Hospital"
                                        required
                                        value={hospitalOptions.find(option => option.value === isActive)}
                                        onChange={handleSelectChange}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Hospital Address </Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="validationCustomFirstName"
                                        placeholder="Hospital Address"
                                        required
                                        onChange={handleAddressChange}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Office Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="validationCustomFirstName"
                                        placeholder="Office Phone Number"
                                        required
                                        onChange={handleOfficePhoneNumberChange}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Website</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="validationCustomFirstName"
                                        placeholder="Website"
                                        required
                                        onChange={handleWebsiteChange}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Contact Person Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="validationCustomFirstName"
                                        placeholder="Contact Person Name"
                                        required
                                        onChange={handleContactPersonNameChange}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="validationCustomFirstName"
                                        placeholder="Phone Number"
                                        required
                                        onChange={handlePhoneNumberChange}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="Email"
                                        id="validationCustomFirstName"
                                        placeholder="Email"
                                        required
                                        onChange={handleEmailChange}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit">
                            Add Hospital
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <ToastContainer />
        </div>
    );
};

export default Hospital;
