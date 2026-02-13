import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

// Register user
const register = async (userData) => {
    const response = await axios.post(API_URL + 'register', userData);

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

// Login user
const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData);

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

// Login admin
const loginAdmin = async (userData) => {
    const response = await axios.post(API_URL + 'admin/login', userData);

    if (response.data) {
        const adminUser = { ...response.data, isAdmin: true };
        localStorage.setItem('admin', JSON.stringify(adminUser));
        return adminUser;
    }
};

// Logout user
const logout = () => {
    localStorage.removeItem('user');
};

// Logout admin
const logoutAdmin = () => {
    localStorage.removeItem('admin');
};

const authService = {
    register,
    login,
    loginAdmin,
    logout,
    logoutAdmin,
};

export default authService;
