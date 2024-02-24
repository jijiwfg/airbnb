import React, { useState } from 'react';
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { RegitserRequest } from '../utils/api/user';
import { setUserSession } from '../utils/Auth';
function Register (props) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isEmailValid = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const isPasswordMatch = (password, confirmPassword) => {
    return password === confirmPassword;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = () => {
    if (!isEmailValid(formData.email)) {
      setErrorMessage('Invalid email format');
      return;
    }

    if (!isPasswordMatch(formData.password, formData.confirmPassword)) {
      setErrorMessage('Passwords do not match');
      return;
    }

    RegitserRequest(formData.username, formData.password, formData.email).then(response => {
      setUserSession(response.data.token, formData.email);
      setSuccessMessage('Login success!')
      window.location.href = '/';
    }).catch(error => {
      if (error.response.status === 401) setErrorMessage(error.response.data.error);
      else setErrorMessage('Something went wrong. Please try again later.');
    });
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={ { height: '100vh' } }>
      <Grid item xs={ 12 } sm={ 8 } md={ 6 } lg={ 4 }>
        <Paper elevation={ 3 } style={ { padding: '20px', textAlign: 'center' } }>
          <Typography variant="h4">Register</Typography>
          <TextField
            label="Username"
            name="username"
            value={ formData.username }
            onChange={ handleChange }
            fullWidth
            style={ { marginBottom: '10px' } }
          />
          <TextField
            label="Email"
            name="email"
            value={ formData.email }
            onChange={ handleChange }
            fullWidth
            style={ { marginBottom: '10px' } }
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={ formData.password }
            onChange={ handleChange }
            fullWidth
            style={ { marginBottom: '10px' } }
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={ formData.confirmPassword }
            onChange={ handleChange }
            fullWidth
            style={ { marginBottom: '20px' } }
          />
          <Button name="register-submit" variant="contained" color="primary" onClick={ handleRegister }>
            Register
          </Button>
          <div>
            { successMessage && <Typography variant="success" style={ { marginTop: '10px' } }>{ successMessage }</Typography> }
            { errorMessage && <Typography variant="error" style={ { marginTop: '10px' } }>{ errorMessage }</Typography> }
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Register;
