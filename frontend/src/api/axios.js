import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // ⚠️ crucial for login/register
});
// This function will be called before every request
API.interceptors.request.use((req) => {
  if (localStorage.getItem('userInfo')) {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    req.headers.Authorization = `Bearer ${token}`;
    console.log('API Request - Token added:', !!token);
    console.log('API Request - URL:', req.url);
  } else {
    console.log('API Request - No userInfo in localStorage');
  }
  return req;
});

// Response interceptor to handle 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/teachers/profile')) {
      console.log('401 Unauthorized - clearing localStorage');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;