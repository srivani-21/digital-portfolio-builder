// axios.js
// This is the "messenger" between React and our Express backend
// Every API call goes through this file
// It automatically attaches the JWT token to every request

import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Our backend base URL
});

// This runs BEFORE every request is sent
// It checks if a token exists in localStorage and adds it to the header
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;