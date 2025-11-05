// @ts-nocheck
import { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';

const VitalChart = () => {
    const [validated, setValidated] = useState(false);
    const [medicines, setMedicines] = useState([{ id: Date.now(), date: '', time: '', vitals: {} }]);
    const [tokens, setTokens] = useState('');
    const [userId, setUserId] = useState(null);
    const [userOptions, setUserOptions] = useState([]);
    const [doctorOptions, setDoctorOptions] = useState([]);
    const [vital, setVital] = useState([]);

    // Function to clean the token by removing first and last double quotes
    const cleanToken = (token) => token?.replace(/^"|"$/g, '');

    useEffect(() => {
        const token = localStorage.getItem('access-tokens');
        if (token) {
            setTokens(cleanToken(token));
        }
    }, []);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const payload = medicines.map((medicine) => ({
                userId,
                date: new Date(medicine.date).toISOString(),
                time: medicine.time,
                diets: Object.entries(medicine.vitals).map(([dietId, quantity]) => ({
                    dietId,
                    quantity
                }))
            }));

            fetch('http://localhost:3000/v1/diet-charts/bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokens}`
                },
                body: JSON.stringify(payload)
            })
                .then((resp) => resp.json())
                .then((data) => {
                    console.log('Data submitted successfully:', data);
                })
                .catch((error) => {
                    console.error('Error submitting data:', error);
                });
        }
        setValidated(true);
    };

    const addMedicine = () => {
        setMedicines([...medicines, { id: Date.now(), date: '', time: '', vitals: {} }]);
    };

    const handleInputChange = (id, field, value) => {
        setMedicines(medicines.map(medicine =>
            medicine.id === id ? { ...medicine, [field]: value } : medicine
        ));
    };

    const handleVitalChange = (id, vitalEntryId, value) => {
        setMedicines(medicines.map(medicine =>
            medicine.id === id ? {
                ...medicine,
                vitals: { ...medicine.vitals, [vitalEntryId]: value }
            } : medicine
        ));
    };

    useEffect(() => {
        if (tokens) {
            fetch('http://localhost:3000/v1/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokens}`
                }
            })
                .then((resp) => resp.json())
                .then((data) => {
                    const formattedDoctors = data?.results?.map((doctor) => ({
                        value: doctor.role === "doctor" ? doctor.id : null,
                        label: doctor.role === "doctor" ? doctor.name : null
                    })).filter((doctor) => doctor.value !== null);
                    setDoctorOptions(formattedDoctors);

                    const formattedPatients = data?.results?.map((user) => ({
                        value: user.role === "patient" ? user.id : null,
                        label: user.role === "patient" ? user.name : null
                    })).filter((user) => user.value !== null);
                    setUserOptions(formattedPatients);
                });
        }
    }, [tokens]);

    useEffect(() => {
        fetch('http://localhost:3000/v1/diets?status=active', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                  Authorization: `Bearer ${tokens}`
            },
        })
            .then((res) => res.json())
            .then((data) => setVital(data.results || []))
            .catch((error) => {
                console.error(error);
            });
    }, [tokens]);

    return (
        <div className='col-md-12 pt-4'>
            <Card>
                <Card.Header>
                    <h4 className="header-title">Add Chart</h4>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col lg={4}>
                            <p className="mb-1 fw-bold text-muted">Patient Name</p>
                            <Select className="select2 z-3" placeholder="Select Patient" options={userOptions} onChange={(selectedOption) => setUserId(selectedOption.value)} />
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Header>
                    <h4 className="header-title">Add Chart Chart</h4>
                </Card.Header>
                <Card.Body>
                    <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                        <Row>
                            <Col lg={2}><Form.Label>Date</Form.Label></Col>
                            <Col lg={2}><Form.Label>Time</Form.Label></Col>
                            {vital.map((el) => (
                                <Col lg={2} key={el.id}><Form.Label>{el.name}</Form.Label></Col>
                            ))}
                        </Row>
                        {medicines.map((medicine) => (
                            <Row key={medicine.id}>
                                <Col lg={2}>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="date"
                                            value={medicine.date}
                                            onChange={(e) => handleInputChange(medicine.id, 'date', e.target.value)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a date.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col lg={2}>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="time"
                                            value={medicine.time}
                                            onChange={(e) => handleInputChange(medicine.id, 'time', e.target.value)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a time.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                {vital.map((el) => (
                                    <Col lg={2} key={el.id}>
                                        <Form.Group className="mb-3">
                                            <Form.Control
                                                type="text"
                                                placeholder={el.name}
                                                value={medicine.vitals[el.id] || ''}
                                                onChange={(e) => handleVitalChange(medicine.id, el.id, e.target.value)}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide {el.name}.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                ))}
                                <hr />
                            </Row>
                        ))}
                        <Button variant="primary" onClick={addMedicine}>
                            Add Chart
                        </Button>
                        <Button variant="success" type="submit" className="ms-2">
                            Submit Form
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default VitalChart;
