// @ts-nocheck
import { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';

const VitalChart = () => {
    const [validated, setValidated] = useState(false);
    const [reports, setReports] = useState([{ id: Date.now(), date: '', type: '', file: null }]);

    const [tokens, setTokens] = useState('');

    // Function to clean the token by removing first and last double quotes
    const cleanToken = (token) => token?.replace(/^"|"$/g, '');

    

    useEffect(() => {
        const token = localStorage.getItem('access-tokens');
        if (token) {
            setTokens(cleanToken(token));
        }
    }, []);

    const handleFormSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();

            reports.forEach((report) => {
                console.log(report);
                
                const formData = new FormData();
                formData.append('userId', '665b50a38f0436512cf8c81d');
                formData.append('testName', report.type);
                formData.append('date', report.date);
                if (report.file) {
                    formData.append('file', report.file);
                }

                fetch('http://localhost:3000/v1/test-reports', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokens}`
                    },
                    body: formData,
                }).then(response => response.json())
                    .then(data => console.log(data))
                    .catch(error => console.error('Error:', error));
            });
        }
        setValidated(true);
    };

    const addReport = () => {
        setReports([...reports, { id: Date.now(), date: '', type: '', file: null }]);
    };

    const handleInputChange = (id, field, value) => {
        setReports(reports.map(report =>
            report.id === id ? { ...report, [field]: value } : report
        ));
    };

    const handleFileChange = (id, file) => {
        setReports(reports.map(report =>
            report.id === id ? { ...report, file } : report
        ));
    };

    return (
        <div className='col-md-12 pt-4'>
            <Card>
                <Card.Header>
                    <h4 className="header-title">Test Report</h4>
                </Card.Header>
                <Card.Body>
                    <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                        {reports.map((report) => (
                            <Row key={report.id}>
                                <Col lg={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Report Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={report.date}
                                            onChange={(e) => handleInputChange(report.id, 'date', e.target.value)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a date.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col lg={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Report Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Type"
                                            value={report.type}
                                            onChange={(e) => handleInputChange(report.id, 'type', e.target.value)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a type.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col lg={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Upload File (PDF, Doc, Image)</Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={(e) => handleFileChange(report.id, e.target.files[0])}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please upload a file.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                        ))}
                        <Button variant="primary" onClick={addReport}>
                            Add Test Report
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
