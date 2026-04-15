import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export const authService = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (fullname, email, password) => api.post('/auth/register', { fullname, email, password }),
};

export const trainService = {
    getAll: (source, destination) => api.get('/trains', { params: { source, destination } }),
    getById: (id) => api.get(`/trains/${id}`),
    create: (train) => api.post('/trains', train),
    update: (id, train) => api.put(`/trains/${id}`, train),
    delete: (id) => api.delete(`/trains/${id}`),
};

export const bookingService = {
    book: (trainId, seats) => api.post('/bookings', { trainId, seats }),
    getMyBookings: () => api.get('/bookings/my'),
    getAllBookings: () => api.get('/bookings/all'),
    cancel: (id) => api.post(`/bookings/${id}/cancel`),
};

export default api;
