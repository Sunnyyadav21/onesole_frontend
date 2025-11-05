// @ts-nocheck
import { Button, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AuthLayout from '../AuthLayout';
import axios from 'axios';
import { useAuthContext } from '@/common';
import { VerticalForm, FormInput, PageBreadcrumb } from '@/components';
import { useEffect, useState } from 'react';

// Validation Schema
const schemaResolver = yupResolver(
  yup.object().shape({
    mobile: yup.string().required('Please enter Username'),
    password: yup.string().required('Please enter Password'),
  })
);

const BottomLinks = () => {
  const [role, setRole] = useState();

  useEffect(() => {
    setRole(localStorage.getItem('user-details'));
  }, []);

  return (
    <Row>
      {/* <Col xs={12} className="text-center">
        <p className="text-dark-emphasis">
          Don't have an account?{' '}
          <Link
            to="/medicalapp/auth/register"
            className="text-dark fw-bold ms-1 link-offset-3 text-decoration-underline"
          >
            <b>Sign up</b>
          </Link>
        </p>
      </Col> */}
    </Row>
  );
};

const Login = () => {

  const navigate = useNavigate();
  const { isAuthenticated, saveSession } = useAuthContext();
  const [tokens, setTokens] = useState(null);

  const handleSubmit = async (data) => {
    console.log(data);

    try {
      const response = await axios.post('http://localhost:3000/v1/auth/login', {
        mobile: data.mobile,
        password: data.password,
      });

      console.log(response);

      localStorage.setItem('user-details', JSON.stringify(response?.data?.user));

      setTokens(response.data.tokens);

      console.log(response.data.tokens.access.token, 'sunny');

    } catch (error) {
      console.log(error);
    }
  };

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
    <div className="formHalf">
      <PageBreadcrumb title="Log In" />
      <AuthLayout
        authTitle="Sign In As Admin"
        helpText="Enter your Mobile  and password to access account."
        bottomLinks={<BottomLinks />}
        hasThirdPartyLogin
      >
        <VerticalForm onSubmit={handleSubmit} resolver={schemaResolver}>
          <FormInput
            label="Mobile"
            type="text"
            name="mobile"
            placeholder="Enter your mobile"
            containerClass="mb-3"
            required
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            required
            id="password"
            placeholder="Enter your password"
            containerClass="mb-3"
          >
            {/* <Link to="/auth/forgot-password" className="text-muted float-end">
              <small>Forgot your password?</small>
            </Link> */}
          </FormInput>
          <FormInput
            label="Remember me"
            type="checkbox"
            name="checkbox"
            containerClass={'mb-3 w100'}
          />
          <div className="mb-0 w100 text-start">
            <Button variant="soft-primary" className="w-100" type="submit">
              <i className="ri-login-circle-fill me-1" />{' '}
              <span className="fw-bold">Log In</span>{' '}
            </Button>
          </div>
        </VerticalForm>
      </AuthLayout>
    </div>
  );
};

export default Login;
