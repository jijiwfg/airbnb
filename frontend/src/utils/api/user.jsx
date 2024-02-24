import request from '../resquest'

// login request
export function LoginRequest (email, password) {
  return request({
    url: '/user/auth/login',
    method: 'post',
    headers: {
      // 'token': localStorage.getItem('token'),
      'Content-Type': 'application/JSON'
    },
    data: { email, password }
  })
}

// register request
export function RegitserRequest (username, password, email) {
  return request({
    url: '/user/auth/register',
    method: 'post',
    headers: {
      // 'token': localStorage.getItem('token'),
      'Content-Type': 'application/JSON'
    },
    data: { name: username, password, email }
  })
}
