import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { getToken, removeUserSession } from '../utils/Auth';
import { Link } from 'react-router-dom';

function Header (props) {
  const handleLogout = () => {
    removeUserSession()
    window.location.href = '/';
  }
  const handleLogin = () => {
    window.location.href = '/login';
  }
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={ { flexGrow: 1 } }>
        AirBrB
        </Typography>
        <Link to="/" style={ { color: 'white', textDecoration: 'none', marginRight: '20px' } }>
          Home
        </Link>
        { getToken() &&
          <Link id="link-hostedListing" to="/hostedListing" style={ { color: 'white', textDecoration: 'none', marginRight: '20px' } }>
            My Listing
          </Link> }
        { getToken() &&
          <Link id="link-createListing" to="/createListing" style={ { color: 'white', textDecoration: 'none', marginRight: '20px' } }>
            Add Listing
          </Link> }
        { getToken() &&
          <Button id="logout-button" variant="outlined" color="inherit" onClick={ handleLogout }>
            Logout
          </Button> }
        { !getToken() &&
          <Button variant="outlined" color="inherit" onClick={ handleLogin }>
            Login
          </Button>
        }
      </Toolbar>
    </AppBar>
  );
}

export default Header;
