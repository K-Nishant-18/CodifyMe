import api from './api';

const companyService = {
    async getAllCompanies() {
        const response = await api.get('/companies');
        return response.data;
    },

    async searchCompanies(name) {
        const response = await api.get(`/companies/search?name=${encodeURIComponent(name)}`);
        return response.data;
    },

    async getCompanyDetails(companyId) {
        const response = await api.get(`/companies/${companyId}`);
        return response.data;
    },
};

export default companyService;
