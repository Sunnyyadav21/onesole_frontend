// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';

export default function Index() {
    const [vitalName, setVitalName] = useState('');
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
        setVitalName(e.target.value);
    };


    const data = {
        name: vitalName,
        status: "deactive"
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`http://localhost:3000/v1/vital-entries`, {
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

        // if (vitalName.trim() !== '') {
        //     setDynamicInputs([...dynamicInputs, vitalName]);
        //     setVitalName('');
        // }
    };

    return (
        <Card className='mt-4'>
            <Card.Header>
                <h4 className="header-title">Add Vital Chart</h4>
            </Card.Header>
            <Card.Body>
                <Form noValidate onSubmit={handleSubmit}>
                    <Row>
                        <Col lg={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Enter Vital Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Vital Name"
                                    value={vitalName}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* <Button variant="primary" type="submit">
                        Add More Vital
                    </Button> */}
                    <Button variant="success" className="" onClick={handleSubmit}>
                        Add   Vital
                    </Button>
                </Form>

                {/* <Col lg={6} >
                    
                    {dynamicInputs.map((input, index) => (
                        <>
                         <Form.Label className='mt-3' key={index}>{input}</Form.Label>
                            
                        <Form.Control
                        type="text"
                        placeholder="Enter Vital name"
                        value=""
                       
                        required
                    />
                        </>
                    ))}
                </Col> */}
            </Card.Body>
        </Card>
    );
}
