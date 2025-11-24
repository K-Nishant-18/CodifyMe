import api from './api';

const userService = {
    async getProfile() {
        const response = await api.get('/user/profile');
        return response.data;
    },

    async updateProfile(profileData) {
        const response = await api.put('/user/profile', profileData);
        return response.data;
    },

    async getCrackScore() {
        const response = await api.get('/user/crackscore');
        return response.data;
    },
};

export default userService;
