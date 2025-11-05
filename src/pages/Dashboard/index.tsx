// @ts-nocheck
import { Card, Col, Form, Row } from 'react-bootstrap'
import Select from 'react-select'
import Statistics from './Statistics'
import WeeklySelesChart from './WeeklySelesChart'
import YearlySelesChart from './YearlySelesChart'
// import ChatList from './ChatList'
// import Projects from './Projects'
import StripedRows from '../ui/tables/BasicTables'

// componets
import { PageBreadcrumb } from '@/components'

// data
import { chatMessages, statistics } from './data'
import { options } from '../ui/forms/data'
import ChatList from './ChatList'
import Projects from './Projects'
import { useEffect, useState } from 'react'


const Dashboard = () => {

	const [role, setRole] = useState()
	const [userOptions, setUserOptions] = useState([]);
	const [tokens, setTokens] = useState('');
	const [userId, setUserId] = useState(null);
	console.log(userOptions, 'userOptions');
	
	useEffect(() => {
		setRole(localStorage.getItem('user-details'))
	}, [])


	const cleanToken = (token) => token?.replace(/^"|"$/g, '');

    useEffect(() => {
        const token = localStorage.getItem('access-tokens');
        if (token) {
            setTokens(cleanToken(token));
        }
    }, []);


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
                    // const formattedDoctors = data?.results?.map((doctor) => ({
                    //     value: doctor.role === "doctor" ? doctor.id : null,
                    //     label: doctor.role === "doctor" ? doctor.name : null
                    // })).filter((doctor) => doctor.value !== null);
                    // setDoctorOptions(formattedDoctors);

                    const formattedPatients = data?.results?.map((user) => ({
                        value: user.role === "patient" ? user.id : null,
                        label: user.role === "patient" ? user.name : null
                    })).filter((user) => user.value !== null);
                    setUserOptions(formattedPatients);
                });
        }
    }, [tokens]);

	return (
		<>
			<PageBreadcrumb title={`Welcome ${role && JSON.parse(role).name}`} subName="Dashboards" />
			{role && JSON.parse(role).role != 'user' ? <Row>
				{(statistics || []).map((item, idx) => {
					return (
						<Col xxl={3} sm={6} key={idx}>
							<Statistics
								title={item.title}
								stats={item.stats}
								variant={item.variant}
								icon={item.icon}
							// change={item.change}
							/>
						</Col>
					)
				})}
			</Row> : null}

			{role && JSON.parse(role).role != 'user' ? <Card>
				<Card.Header>
					<h4 className="header-title">Serach Patient</h4>

				</Card.Header>
				<Card.Body>
					<Row>
						<Col lg={4}>
							<p className="mb-1 fw-bold text-muted">Date</p>
							<Form.Control
								type="date"
								value=""
								onChange=""
								required
							/>
						</Col>

						<Col lg={4}>
							<p className="mb-1 fw-bold text-muted">Patient Name</p>
							<Select className="select2 z-3" placeholder="Select Patient" options={userOptions} onChange={(selectedOption) => setUserId(selectedOption.value)} />

						</Col>

					</Row>
				</Card.Body>
			</Card> : null}
			<Row>
				<Col lg={6}>
					<WeeklySelesChart />
				</Col>
				<Col lg={6}>
					<YearlySelesChart />
				</Col>
			</Row>
			<Row>
				<Col lg={12}>
					<StripedRows />
				</Col>
			</Row>

			{/* <Row>
				<Col xl={4}>
					<ChatList messages={chatMessages} />
				</Col>

				<Col xl={8}>
					<Projects />
				</Col>
			</Row> */}
		</>
	)
}

export default Dashboard
