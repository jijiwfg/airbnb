import axios from 'axios'

const utils = axios.create({
  baseURL: 'http://localhost:5005',
  timeout: 15000
})

export default utils
