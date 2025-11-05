// @ts-nocheck
import { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Patient = () => {
  const [validated, setValidated] = useState(false);
  const [medicines, setMedicines] = useState([{ id: Date.now(), name: '', times: [], type: '', date: '', time: '' }]);
  const [hospitalOptions, setHospitalOptions] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [tokens, setTokens] = useState('');

  const [hospitalId, setHospitalId] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [userId, setUserId] = useState(null);

  console.log(userOptions);

  // Function to clean the token by removing first and last double quotes
  const cleanToken = (token) => token?.replace(/^"|"$/g, '');

  useEffect(() => {
    const token = localStorage.getItem('access-tokens');
    if (token) {
      setTokens(cleanToken(token));
    }
  }, []);

  useEffect(() => {
    fetch('http://localhost:3000/v1/hospitals', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokens}`
      }
    })
      .then((resp) => resp.json())
      .then((data) => {
        const formattedHospitals = data?.results?.map((hospital) => ({
          value: hospital.id,
          label: hospital.name
        }));
        setHospitalOptions(formattedHospitals);
      });
  }, [tokens]);

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
          console.log(formattedPatients);

          setUserOptions(formattedPatients);
        });
    }
  }, [tokens]);

  const handleFormSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();

      const data = medicines.map(medicine => ({
        userId: userId?.value ?? "6649e88cce3d2e08520a9cd1",
        hospitalId: hospitalId?.value,
        doctorId: doctorId?.value,
        medicineName: medicine.name,
        times: {
          morning: medicine.times.includes('Morning'),
          afternoon: medicine.times.includes('Afternoon'),
          evening: medicine.times.includes('Evening'),
          night: medicine.times.includes('Night'),
          earlyMorning: medicine.times.includes('Early Morning')
        },
        type: medicine.type,
        date: medicine.date,
        time: medicine.time,
        medicineGiven: false,
        prescribedBy: "Dr. John Doe"
      }));

      fetch('http://localhost:3000/v1/medicine-prescriptions/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokens}`
        },
        body: JSON.stringify(data)
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          toast.success('Prescriptions added successfully!');
        })
        .catch((error) => {
          console.error('There was a problem with the fetch operation:', error);
          toast.error('Failed to add prescriptions.');
        });
    }
    setValidated(true);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { id: Date.now(), name: '', times: [], type: '', date: '', time: '' }]);
  };

  const handleInputChange = (id, field, value) => {
    setMedicines(medicines.map((medicine) => (medicine.id === id ? { ...medicine, [field]: value } : medicine)));
  };

  const handleCheckboxChange = (id, field, value) => {
    setMedicines(
      medicines.map((medicine) => {
        if (medicine.id === id) {
          const updatedField = medicine[field].includes(value)
            ? medicine[field].filter((item) => item !== value)
            : [...medicine[field], value];
          return { ...medicine, [field]: updatedField };
        }
        return medicine;
      })
    );
  };

  const hospitalServices = [
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

  const medicineTypes = ['Empty Stomach', 'Before Meal', 'After Meal', 'Before Going To Bed At Night', 'Every Hour'];

  return (
    <div className="col-md-12 pt-4">
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Card>
          <Card.Header>
            <h4 className="header-title">Add Medicine</h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col lg={3}>
                <p className="mb-1 fw-bold text-muted">Hospital Name</p>
                <Select className="select2 z-3" options={hospitalOptions} onChange={setHospitalId} />
              </Col>
              <Col lg={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Select
                    options={hospitalServices}
                    placeholder="Select Category"
                    required
                  />
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={3}>
                <p className="mb-1 fw-bold text-muted">Doctor Name</p>
                <Select className="select2 z-3" options={doctorOptions} onChange={setDoctorId} />
              </Col>
              <Col lg={3}>
                <p className="mb-1 fw-bold text-muted">Patient Name</p>
                <Select className="select2 z-3" placeholder="Select Patient" options={userOptions} onChange={setUserId} />
              </Col>
            </Row>
          </Card.Body>
          <Card.Header>
            <h4 className="header-title">Add Medicine Prescription</h4>
          </Card.Header>
          <Card.Body>
            {medicines.map((medicine) => (
              <div key={medicine.id}>
                <Row>
                  <Col lg={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Medicine Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Medicine Name"
                        value={medicine.name}
                        onChange={(e) => handleInputChange(medicine.id, 'name', e.target.value)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a medicine name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col lg={8}>
                    <h6 className="fs-15 mt-3">Number of times</h6>
                    {['Morning', 'Afternoon', 'Evening', 'Night', 'Early Morning'].map((time, idx) => (
                      <Form.Check
                        key={idx}
                        className="form-check-inline"
                        label={time}
                        checked={medicine.times.includes(time)}
                        onChange={(e) => {
                          const times = e.target.checked
                            ? [...medicine.times, time]
                            : medicine.times.filter((t) => t !== time);
                          handleInputChange(medicine.id, 'times', times);
                        }}
                      />
                    ))}
                  </Col>
                  <Col lg={4}>
                    <h6 className="fs-15 mt-3">Type</h6>
                    <Select
                      options={medicineTypes.map(type => ({ value: type, label: type }))}
                      value={{ value: medicine.type, label: medicine.type }}
                      onChange={(option) => handleInputChange(medicine.id, 'type', option.value)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please select a valid type.
                    </Form.Control.Feedback>
                  </Col>
                  <Col lg={4}>
                    <Form.Group className="mb-3 pt-3">
                      <Form.Label>Date for taking Medicine</Form.Label>
                      <Form.Control
                        type="date"
                        value={medicine.date}
                        onChange={(e) => handleInputChange(medicine.id, 'date', e.target.value)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid date.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col lg={4}>
                    <Form.Group className="mb-3 pt-3">
                      <Form.Label>Time for taking Medicine</Form.Label>
                      <Form.Control
                        type="time"
                        value={medicine.time}
                        onChange={(e) => handleInputChange(medicine.id, 'time', e.target.value)}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid time.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <hr />
              </div>
            ))}
            <Button variant="primary" onClick={addMedicine}>
              Add Medicine
            </Button>
            <Button variant="success" type="submit" className="ms-2">
              Submit Form
            </Button>
          </Card.Body>
        </Card>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default Patient;
