import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import './login.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      // Perform login logic here
      console.log('Login clicked');
      try {
        // Send POST request to login endpoint
        const response = await axios.post('http://localhost:5000/auth/login', { email, password });
  
        // Handle success
        console.log('Login successful:', JSON.stringify(response.data.user._id));
        // Redirect to dashboard or any other page after successful login
        localStorage.setItem('user',JSON.stringify(response.data.user));
      navigate('/');
      } catch (error) {
        // Handle error
        console.error('Login failed:', error.response.data.error);
        setError(error.response.data.error);
      }
    }
    setValidated(true);
  };

  return (
    <div className='login-page'>
    <Container>
      <h2>Login</h2>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">Please provide a valid email.</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <Form.Control.Feedback type="invalid">Password must be at least 6 characters.</Form.Control.Feedback>
        </Form.Group>

        {error && <Alert variant="danger">{error}</Alert>}

        <Button className='mt-3' variant="primary" type="submit">
          Login
        </Button>
       
      </Form>
      <Button className='mt-3' variant='text' style={{padding:0, color:'#0d6efd'}} onClick={(e)=>navigate('/signup')}>Don't have an account? Please Signup</Button>
    </Container>
    </div>
  );
};

export default Login;
