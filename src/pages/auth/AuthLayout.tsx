//@ts-nocheck
import React, { ReactNode, useEffect, useState } from 'react'

//images
import authImg from '@/assets/images/auth-img.jpg'
import logo from '@/assets/images/logo.png'
import logoDark from '@/assets/images/logo-dark.png'
import { useAuthContext } from '@/common';

import { Card, Col, Container, Image, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';

// import { Link } from 'react-router-dom'
import axios from 'axios';

import {
	LoginSocialGoogle,
	LoginSocialFacebook,
	LoginSocialMicrosoft,
} from 'reactjs-social-login'

interface AccountLayoutProps {
	pageImage?: string
	authTitle?: string
	helpText?: string
	bottomLinks?: ReactNode
	isCombineForm?: boolean
	children?: ReactNode
	hasForm?: boolean
	hasThirdPartyLogin?: boolean
	userImage?: string
	starterClass?: boolean
}

const AuthLayout = ({
	authTitle,
	helpText,
	bottomLinks,
	children,
	hasThirdPartyLogin,
	userImage,
	starterClass,
}: AccountLayoutProps) => {
	useEffect(() => {
		if (document.body) {
			document.body.classList.add('authentication-bg', 'position-relative')
		}

		return () => {
			if (document.body) {
				document.body.classList.remove('authentication-bg', 'position-relative')
			}
		}
	}, [])

	const [tokens, setTokens] = useState(null);
	const navigate = useNavigate();
	const { isAuthenticated, saveSession } = useAuthContext();

	useEffect(() => {
		if (tokens) {
		  console.log(tokens.access.token, 'Ravi');
	
		  localStorage.setItem('access-tokens', tokens.access.token);
		  localStorage.setItem('refresh-tokens', tokens.refresh.token);
	
		  saveSession(tokens.refresh.token);
	
		  window.location.href = "/medicalapp";
		  //  navigate('/medicalapp');
		}
	  }, [tokens, navigate, saveSession]);
	return (
		<div className="authentication-bg position-relative">
			<div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5 position-relative">
				<Container>
					<Row className="justify-content-center">
						<Col xxl={6} lg={6}>
							<Card className="overflow-hidden">
								<Row className="g-0">
									{/* <Col lg={6} className="d-none d-lg-block p-2">
										<Image
											src={authImg}
											alt=""
											className="img-fluid rounded h-100"
										/>
									</Col> */}
									<Col lg={12}>
										<div className="d-flex flex-column h-100">
											<div className="auth-brand p-4">
												<a href="index.html" className="logo-light">
													<Image src={logo} alt="logo" height="60" />
												</a>
												<a href="index.html" className="logo-dark">
													<Image src={logoDark} alt="dark logo" height="60" />
												</a>
											</div>
											<div
												className={`p-4 my-auto ${starterClass ? 'text-center' : ''
													}`}>
												{userImage ? (
													<div className="text-center w-75 m-auto">
														<Image
															src={userImage}
															height={64}
															alt="user-image"
															className="rounded-circle img-fluid img-thumbnail avatar-xl"
														/>
														<h4 className="text-center mt-3 fw-bold fs-20">
															{authTitle}{' '}
														</h4>
														<p className="text-muted mb-4">{helpText}</p>
													</div>
												) : (
													<React.Fragment>
														<h4 className="fs-20">{authTitle}</h4>
														<p className="text-muted mb-3">{helpText}</p>
													</React.Fragment>
												)}

												{children}

												{hasThirdPartyLogin && (
													<div className="text-center mt-4">
														<p className="text-muted fs-16">Sign in with</p>

														<div className="d-flex gap-2 justify-content-center mt-3">
															{/* <LoginSocialFacebook
																appId={process.env.REACT_APP_FB_APP_ID || 'sldkfjslkdj'}
																fieldsProfile={
																	'id,first_name,last_name,middle_name,name,name_format,picture,short_name,email,gender'
																}
																onLoginStart={() => { }}
																redirect_uri={
																	'http://localhost:5173/medicalapp/auth/login'
																}
																onResolve={({ provider, data }) => {
																	console.log('dflsdk', provider, data)
																}}
																onReject={(err) => {
																	console.log(err)
																}}>
																<Link to="#" className="btn btn-soft-primary">
																	<i className="ri-facebook-circle-fill"></i>
																</Link>
															</LoginSocialFacebook> */}

<LoginSocialFacebook
																appId={process.env.REACT_APP_FB_APP_ID || '398882973235132'}
																fieldsProfile={
																	'id,first_name,last_name,middle_name,name,name_format,picture,short_name,email,gender'
																}
																onLoginStart={() => {}}
																redirect_uri={
																	'http://localhost:5173/medicalapp/auth/login'
																}
																onResolve={({ provider, data }) => {
																	console.log('dflsdk', provider, data)
																}}
																onReject={(err) => {
																	console.log(err)
																}}>
															<Link to="#" className="btn btn-soft-primary">
																<i className="ri-facebook-circle-fill"></i>
															</Link>
															</LoginSocialFacebook>



															{/* 															
															<LoginSocialGoogle
																client_id={
																	process.env.REACT_APP_GG_APP_ID ||
																	'419857346782-ondtjflen3b2j97kd6mkb9ubi3725pu1.apps.googleusercontent.com'
																}
																onLoginStart={() => {}}
																redirect_uri={
																	'http://localhost:5173/medicalapp/auth/login'
																}
																scope="openid profile email"
																discoveryDocs="claims_supported"
																access_type="offline"
																onResolve={({ provider, data }) => {
																	 
																	console.log('dflsdk', provider, data)

																	try {
																		const response = await axios.post('http://localhost:3000/v1/auth/login', {
																		  type:"google",
  																		 code:data.code
																		});
																  
																  
																	  } catch (error) {
																		console.log(error);
																	  }
																}}
																onReject={(err) => {
																	console.log(err)
																}}>
																<Link to="#" className="btn btn-soft-danger">
																	<i className="ri-google-fill"></i>
																</Link>
															</LoginSocialGoogle> */}

															<LoginSocialGoogle
																client_id={
																	process.env.REACT_APP_GG_APP_ID ||
																	'419857346782-ondtjflen3b2j97kd6mkb9ubi3725pu1.apps.googleusercontent.com'
																}
																onLoginStart={() => { }}
																redirect_uri={'http://localhost:5173/medicalapp/auth/login'}
																scope="openid profile email"
																discoveryDocs="claims_supported"
																access_type="offline"
																onResolve={async ({ provider, data }) => { // Marking the function as async
																	console.log('dflsdk', provider, data)

																	try {
																		const response = await axios.post('http://localhost:3000/v1/auth/login', {
																			type: "google",
																			code: data.code
																		});
																		// Handle the response if needed
																		localStorage.setItem('user-details', JSON.stringify(response?.data?.user));

																		setTokens(response.data.tokens);
																		console.log(response);
																	} catch (error) {
																		console.log(error);
																	}
																}}
																
																onReject={(err) => {
																	console.log(err)
																}}>
																<Link to="#" className="btn btn-soft-danger">
																	<i className="ri-google-fill"></i>
																</Link>
															</LoginSocialGoogle>

															
															
															<Link to="#" className="btn btn-soft-info">
																<i className="ri-microsoft-fill"></i>
															</Link>
														</div>
													</div>
												)}
											</div>
										</div>
									</Col>
								</Row>
							</Card>
						</Col>
					</Row>
					{bottomLinks}
				</Container>
			</div>
			<footer className="footer footer-alt fw-medium">
				<span className="text-dark">
					{/* {new Date().getFullYear()} © Velonic - Theme by Techzaa */}
				</span>
			</footer>
		</div>
	)
}

export default AuthLayout