import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class WorkflowService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Workflow CRUD operations
  async createWorkflow(workflow) {
    const response = await this.api.post('/workflows', workflow);
    return response.data;
  }

  async getWorkflow(id) {
    const response = await this.api.get(`/workflows/${id}`);
    return response.data;
  }

  async updateWorkflow(id, workflow) {
    const response = await this.api.put(`/workflows/${id}`, workflow);
    return response.data;
  }

  async deleteWorkflow(id) {
    await this.api.delete(`/workflows/${id}`);
  }

  async listWorkflows() {
    const response = await this.api.get('/workflows');
    return response.data;
  }

  // Workflow execution
  async activateWorkflow(id) {
    const response = await this.api.post(`/workflows/${id}/activate`);
    return response.data;
  }

  async deactivateWorkflow(id) {
    const response = await this.api.post(`/workflows/${id}/deactivate`);
    return response.data;
  }

  async getWorkflowExecutions(id, params = {}) {
    const response = await this.api.get(`/workflows/${id}/executions`, { params });
    return response.data;
  }

  async getWorkflowStats(id) {
    const response = await this.api.get(`/workflows/${id}/stats`);
    return response.data;
  }

  // A/B Testing
  async createVariant(workflowId, variantData) {
    const response = await this.api.post(`/workflows/${workflowId}/variants`, variantData);
    return response.data;
  }

  async updateVariant(workflowId, variantId, variantData) {
    const response = await this.api.put(
      `/workflows/${workflowId}/variants/${variantId}`,
      variantData
    );
    return response.data;
  }

  // Template management
  async saveAsTemplate(workflowId) {
    const response = await this.api.post(`/workflows/${workflowId}/save-template`);
    return response.data;
  }

  async listTemplates() {
    const response = await this.api.get('/workflow-templates');
    return response.data;
  }

  // AI Integration
  async getAISuggestions(workflowId) {
    const response = await this.api.get(`/workflows/${workflowId}/ai-suggestions`);
    return response.data;
  }

  async applyAISuggestion(workflowId, suggestionId) {
    const response = await this.api.post(
      `/workflows/${workflowId}/ai-suggestions/${suggestionId}/apply`
    );
    return response.data;
  }
}

export default new WorkflowService(); 