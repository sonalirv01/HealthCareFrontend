import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response && response.status === 401) {
      // Handle unauthorized (token expired)
      sessionStorage.removeItem('token');
      window.dispatchEvent(new Event('logout'));
    }
    return Promise.reject(error);
  }
);

// Auth-related API calls
export const authAPI = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
};

// Doctors-related API calls
export const doctorsAPI = {
  getAllDoctors: () => api.get('/doctors'),
  getDoctorById: (id) => api.get(`/doctors/${id}`),
};

// Appointments-related API calls
export const appointmentsAPI = {
  getAppointments: () => api.get('/appointments'),
  bookAppointment: (appointmentData) => api.post('/appointments', appointmentData),
  rateAppointment: (ratingData) => api.post('/ratings', ratingData),
};

export default api;