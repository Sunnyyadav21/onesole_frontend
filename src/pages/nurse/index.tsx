import { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';

import Select from 'react-select';
import { options } from '../ui/forms/data';
const Doctor = () => {
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    return (
        <div className='col-md-12 pt-4'>
            <Card>
                <Card.Header>
                    <h4 className="header-title">Add Nurse</h4>
                </Card.Header>
                <Card.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Hospital name</Form.Label>
                                    <Select className="select2 z-3" options={options} />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nurse name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="validationCustomFirstName"
                                        placeholder="Nurse name"
                                        required
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                        </Row>

                        <Button variant="primary" type="submit">
                            Add Nurse
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Doctor;
