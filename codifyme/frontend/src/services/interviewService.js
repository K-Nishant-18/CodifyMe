import api from './api';

const interviewService = {
    async submitInterview(interviewData) {
        const response = await api.post('/interviews/submit', interviewData);
        return response.data;
    },

    async getInterviewHistory() {
        const response = await api.get('/interviews/history');
        return response.data;
    },

    async getInterviewDetails(interviewId) {
        const response = await api.get(`/interviews/${interviewId}`);
        return response.data;
    },
};

export default interviewService;
