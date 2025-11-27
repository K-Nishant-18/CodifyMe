import api from './api';

const authService = {
    async login(email, password) {
        const response = await api.post('/auth/signin', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    async signup(email, password, fullName, profileData = {}) {
        const payload = {
            email,
            password,
            fullName,
            // Add profile fields if provided
            targetCompany: profileData.targetCompany || null,
            targetRole: profileData.targetRole || null,
            deadline: profileData.deadline || null,
            jobDescription: profileData.jobDescription || null,
            experienceLevel: profileData.experienceLevel?.toUpperCase() || null
        };

        const response = await api.post('/auth/signup', payload);
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getToken() {
        return localStorage.getItem('token');
    },

    isAuthenticated() {
        return !!this.getToken();
    },
};

export default authService;
