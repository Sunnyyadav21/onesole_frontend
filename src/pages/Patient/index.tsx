// @ts-nocheck
import { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// component
// import { PageBreadcrumb } from '@/components'

const Medicine = () => {
  const [validated, setValidated] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userMobile, setUserMobile] = useState('')
  const [userAddres, setUserAddress] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [userRole, setUserRole] = useState('')
  const [selectedHospital, setSelectedHospital] = useState(null)
  // const [hospitalRecords, setHospitalRecords] = useState([])
  const [tokens, setTokens] = useState('')

  // useEffect(() => {
  //   fetch('http://localhost:3000/v1/hospitals')
  //     .then(res => res.json())
  //     .then(json => setHospitalRecords(json.results))
  //     .catch(err => console.error('Error fetching hospitals:', err));
  // }, []);

  const cleanToken = (token) => token?.replace(/^"|"$/g, '')

  useEffect(() => {
    const token = localStorage.getItem('access-tokens')
    if (token) {
      setTokens(cleanToken(token))
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.stopPropagation()
    }
    setValidated(true)

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
          role: "patient",
          mobile: userMobile,
          hospitalId: "665ae2d78f0436512cf8c735",
          password: 'Password123',
          category: 'selectedCategory?.value',
          address: userAddres
          // mobile: userMobile,
          // name: "amrita",
          // email: "amrita2@gmail.com",
          // password: "Password123",
          // role: "admin",
          // hospitalId: "665ae2d78f0436512cf8c735"
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error data:', errorData)
        throw new Error('Failed to authenticate')
      }

      const data = await response.json()
      toast.success('Patient added successfully!')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to add patient.')
    }
  }

  return (
    <div className='col-md-12 pt-4'>
      <Card>
        <Card.Header>
          <h4 className="header-title">Add Patient</h4>
        </Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    type="text"
                    id="validationCustom01"
                    placeholder="First name"
                    defaultValue=""
                    required
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email ID</Form.Label>
                  <Form.Control
                    type="email"
                    id="validationCustom02"
                    placeholder="Email ID"
                    defaultValue=""
                    required
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile number</Form.Label>
                  <Form.Control
                    type="number"
                    id="validationCustom03"
                    placeholder="Mobile number"
                    defaultValue=""
                    required
                    onChange={(e) => setUserMobile(e.target.value)}

                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    id="validationCustom04"
                    placeholder="Address"
                    defaultValue=""
                    required
                    onChange={(e) => setUserAddress(e.target.value)}
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit">
              Add Patient
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <ToastContainer />
    </div>
  )
}

export default Medicine
