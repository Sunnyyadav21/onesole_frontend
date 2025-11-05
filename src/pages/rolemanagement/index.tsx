// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Accordion, Button, Card, Col, Form, Row, Modal } from 'react-bootstrap';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Hospital = () => {
    const [validated, setValidated] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [showAccordion, setShowAccordion] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [resource, setResource] = useState('');
    const [resourceName, setResourceName] = useState('');
    const [tokens, setTokens] = useState('');
    const [staffOptions, setStaffOptions] = useState([]);
    const [records, setRecords] = useState([]);
    const [userName, setUserName] = useState()
    const [resourceId, setResourceId] = useState()
    const [permissions, setPermissions] = useState()
    const [rolesId, setRolesId] = useState()
    
        console.log(rolesId, 'rolesId');
        

    // Function to clean the token by removing first and last double quotes
    const cleanToken = (token) => token?.replace(/^"|"$/g, '');

    useEffect(() => {
        const token = localStorage.getItem('access-tokens');
        if (token) {
            setTokens(cleanToken(token));
        }
    }, []);

    const getStaffOptions = () => {
        if (tokens) {
            fetch('http://localhost:3000/v1/users', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${tokens}`
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    const options = data?.results?.map((el) => ({ value: el.name, label: el.name })) || [];
                    setStaffOptions(options);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    useEffect(() => {
        getStaffOptions();
    }, [tokens]);


    const handelResourceId = (e)=>{
        setResourceId(e)
    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            // Handle successful form submission logic here
        }
        setValidated(true);

        fetch(`http://localhost:3000/v1/role`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${tokens}`
            },
            body: JSON.stringify(
                {
                    name: userName, // USer Name
                    status:"active",
                    permissions
                }
            ),
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
                toast.success('Role Given successfully!');
                setShowEditModal(false);
                getStaffOptions(); // Fetch the staff options again after saving
            })
            .catch(error => {
                toast.error('Failed to Given resource');
            });
    };


    useEffect(() => {
        fetch('http://localhost:3000/v1/role', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokens}`
            },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            setRolesId(data.results.map((each)=>{
                return each.id
            }));
           
          })
          .catch((error) => {
            
          });
      }, [tokens]);

    // Assign Role

    // useEffect(()=>{
    //     fetch(`http://localhost:3000/v1/role`, {
    //         method: "POST",
    //         headers: {
    //             "Content-type": "application/json",
    //             "Authorization": `Bearer ${tokens}`
    //         },
    //         body: JSON.stringify(
    //             {
    //                 name: userName, // USer Name
    //                 status:"active",
    //                 permissions
    //             }
    //         ),
    //     })
    // },[])

    const queryOptions = [
        { value: 'CREATE', label: 'CREATE' },
        { value: 'VIEW', label: 'VIEW' },
        { value: 'UPDATE', label: 'UPDATE' },
        { value: 'DELETE', label: 'DELETE' },
    ];

    const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>,resourceId) => {
        const value = event.target.value;

        const permissionsList = [...permissions];
        permissionsList.forEach(eachPermission=>{
            if(eachPermission.resource == resourceId) {
                if(!event.target.checked) {
                    eachPermission.actions = eachPermission.actions.filter(each=>each != event.target.value);
                }else {
                    eachPermission.actions.push(event.target.value);
                }
            }
        })

        setPermissions(permissionsList)

        console.log(permissionsList);
        
            if (event.target.checked) {
            setSelectedRoles([...selectedRoles, value]);
            
        } else {
            setSelectedRoles(selectedRoles.filter((role) => role !== value));
        }
     };

    const handleSelectChange = (selectedOption: any) => {
        setUserName(selectedOption.value);
        
        if (selectedOption && selectedOption.value) {
            setShowAccordion(true);
        } else {
            setShowAccordion(false);
        }
    };

    const handleEditClick = () => {
        setShowEditModal(true);
    };

    const handleCloseEdit = () => {
        setShowEditModal(false);
    };

    const handleResourceChange = (event) => {
        setResource(event.target.value);
    };

    const handleSaveChanges = () => {
        fetch(`http://localhost:3000/v1/resource`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${tokens}`
            },
            body: JSON.stringify({
                name: resource,
                status: "active"
            }),
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
                toast.success('Resource added successfully!');
                setShowEditModal(false);
                getStaffOptions(); // Fetch the staff options again after saving
            })
            .catch(error => {
                toast.error('Failed to add resource');
            });
    };

    useEffect(() => {
        fetch('http://localhost:3000/v1/resource', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokens}`
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setResourceName(data?.results?.map((name) => {
                     
                    return {
                        resource: name.name,
                        resourceId :name.id
                    }
                }));

                setPermissions(data.results.map(resource=>{
                    return {resource:resource.id,actions:[]};
                }))
            })
            .catch((error) => {
                console.log(error);
            });
    }, [tokens])


    return (
        <div className='col-md-12 pt-4'>
            <Card>
                <Card.Header>
                    <h4 className="header-title">Role Management</h4>
                </Card.Header>
                <Card.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row>
                            <Col lg={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Staff</Form.Label>
                                    <Select
                                        options={staffOptions}
                                        placeholder="Select Hospital Staff"
                                        onChange={handleSelectChange}
                                        required
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col lg={6}>
                                <Form.Label style={{ display: 'block' }}> Add Resource</Form.Label>
                                <Button onClick={handleEditClick}>resource</Button>
                            </Col>
                        </Row>
                        {showAccordion && (
                            <Row>
                                <Col lg={12}>
                                    <Accordion defaultActiveKey="0">
                                        {resourceName?.map((section, index) => (
                                            
                                            <Accordion.Item eventKey={index.toString()} key={section.key}>
                                                {console.log(section, 'section')}
                                                <Accordion.Header onClick={() => handelResourceId(section.resourceId)}>{section.resource}</Accordion.Header>
                                                <Accordion.Body>
                                                    <div>

                                                        <Row>
                                                            {queryOptions.map((query) => (
                                                                <Col lg={2} key={query.value}>
                                                                    <Form.Check
                                                                        type="checkbox"
                                                                        label={query.label}
                                                                        value={query.value}
                                                                        onChange={(event)=>{handleRoleChange(event,section.resourceId)}}
                                                                    />
                                                                </Col>
                                                            ))}
                                                        </Row>
                                                    </div>

                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))}
                                    </Accordion>
                                </Col>
                            </Row>
                        )}
                        <Button variant="primary" type="submit" className='mt-3'>
                            Submit
                        </Button>
                    </Form>
                </Card.Body>
                <Modal show={showEditModal} onHide={handleCloseEdit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Resource</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formUserName">
                                <Form.Label>Resource Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={resource}
                                    onChange={handleResourceChange}
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
                <ToastContainer />
            </Card>
        </div>
    );
};

export default Hospital;
