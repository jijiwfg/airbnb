import React, { useState } from 'react';
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { LoginRequest } from '../utils/api/user';
import { setUserSession } from '../utils/Auth';
import { Link } from 'react-router-dom';
function Login (props) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = () => {
    const userInfo = formData.email
    LoginRequest(formData.email, formData.password).then(response => {
      setUserSession(response.data.token, userInfo);
      setSuccessMessage('Login success!')
      // props.history.push('/');
      // window.location.reload()
      window.location.href = '/';
    }).catch(error => {
      if (error.response.status === 401) setErrorMessage(error.response.data.error);
      else setErrorMessage('Something went wrong. Please try again later.');
    });
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={ { height: '70vh' } }>
      <Grid item xs={ 12 } sm={ 8 } md={ 6 } lg={ 4 }>
        <Paper elevation={ 3 } style={ { padding: '20px', textAlign: 'center' } }>
          <Typography variant="h4">Login</Typography>
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
          <Button name="login-submit" variant="contained" color="primary" onClick={ handleLogin }>
            Login
          </Button>
          { successMessage && <Typography variant="success" style={ { marginTop: '10px' } }>{ successMessage }</Typography> }
          { errorMessage && <Typography variant="error" style={ { marginTop: '10px' } }>{ errorMessage }</Typography> }

          <Typography variant='body2' style={ { marginTop: '10px' } }>
            Dnont have an account? <Link id="link-to-register" to='/register'>Register</Link>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Login;
