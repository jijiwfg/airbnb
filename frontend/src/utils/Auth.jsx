// return the userInfo
export const getUserInfo = () => {
  if (sessionStorage.getItem('userInfo')) {
    return JSON.parse(sessionStorage.getItem('userInfo'));
  } else {
    return null;
  }
}

// return the token from the session storage
export const getToken = () => {
  if (sessionStorage.getItem('token')) {
    return sessionStorage.getItem('token')
  } else {
    return null;
  }
}

// remove the token and user from the session storage
export const removeUserSession = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('userInfo');
}

// set the token and user from the session storage
export const setUserSession = (token, userInfo) => {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
}
