// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';

export default function Index() {
    const [dietName, setDietName] = useState('');
    const [dynamicInputs, setDynamicInputs] = useState([]);

    const [tokens, setTokens] = useState('');

    // Function to clean the token by removing first and last double quotes
    const cleanToken = (token) => token?.replace(/^"|"$/g, '');

    useEffect(() => {
        const token = localStorage.getItem('access-tokens');
        if (token) {
            setTokens(cleanToken(token));
        }
    }, []);
    
    const handleInputChange = (e) => {
        setDietName(e.target.value);
    };

    const data = {
        name: dietName,
        status: "deactive"
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`http://localhost:3000/v1/diets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                 Authorization: `Bearer ${tokens}`
            },
            body: JSON.stringify(data),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log('Data submitted successfully:', data);
            })
            .catch((error) => {
                console.error('Error submitting data:', error);
            });

        // if (dietName.trim() !== '') {
        //     setDynamicInputs([...dynamicInputs, dietName]);
        //     setDietName('');
        // }
    };

    return (
        <Card className='mt-4'>
            <Card.Header>
                <h4 className="header-title">Create Diet</h4>
            </Card.Header>
            <Card.Body>
                <Form noValidate onSubmit={handleSubmit}>
                    <Row>
                        <Col lg={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Enter Diet name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Diet name"
                                    value={dietName}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="success" className="" type="submit">
                        Add Diet
                    </Button>
                </Form>

                {/* <Col lg={6}>
                    {dynamicInputs.map((input, index) => (
                        <div key={index}>
                            <Form.Label className='mt-3'>{input}</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Diet name"
                                value=""
                                required
                            />
                        </div>
                    ))}
                </Col> */}
            </Card.Body>
        </Card>
    );
}
