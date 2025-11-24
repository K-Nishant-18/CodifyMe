import api from './api';

const roadmapService = {
    async getUserRoadmaps() {
        const response = await api.get('/roadmap/my-roadmaps');
        return response.data;
    },

    async createRoadmap(roadmapData) {
        const response = await api.post('/roadmap/create', roadmapData);
        return response.data;
    },

    async generateRoadmap(jobDescription, targetDays = 30, skills = []) {
        const response = await api.post('/roadmap/generate', {
            jobDescription,
            targetDays,
            skills,
        });
        return response.data;
    },

    async getRoadmapTasks(roadmapId) {
        const response = await api.get(`/tasks/roadmap/${roadmapId}`);
        return response.data;
    },

    async updateTaskCompletion(taskId, isCompleted) {
        const response = await api.put(`/tasks/${taskId}/complete`, { isCompleted });
        return response.data;
    },
};

export default roadmapService;
