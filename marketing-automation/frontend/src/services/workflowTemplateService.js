import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class WorkflowTemplateService {
  async getTemplates() {
    try {
      const response = await axios.get(`${API_URL}/workflow-templates`);
      return response.data;
    } catch (error) {
      console.error('Error fetching workflow templates:', error);
      throw error;
    }
  }

  async getTemplate(templateId) {
    try {
      const response = await axios.get(`${API_URL}/workflow-templates/${templateId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching workflow template:', error);
      throw error;
    }
  }

  async saveAsTemplate(workflowId, templateData) {
    try {
      const response = await axios.post(`${API_URL}/workflow-templates`, {
        workflowId,
        ...templateData
      });
      return response.data;
    } catch (error) {
      console.error('Error saving workflow as template:', error);
      throw error;
    }
  }

  async updateTemplate(templateId, templateData) {
    try {
      const response = await axios.put(`${API_URL}/workflow-templates/${templateId}`, templateData);
      return response.data;
    } catch (error) {
      console.error('Error updating workflow template:', error);
      throw error;
    }
  }

  async deleteTemplate(templateId) {
    try {
      await axios.delete(`${API_URL}/workflow-templates/${templateId}`);
    } catch (error) {
      console.error('Error deleting workflow template:', error);
      throw error;
    }
  }

  async createWorkflowFromTemplate(templateId, workflowData) {
    try {
      const response = await axios.post(`${API_URL}/workflows/from-template/${templateId}`, workflowData);
      return response.data;
    } catch (error) {
      console.error('Error creating workflow from template:', error);
      throw error;
    }
  }

  // Template categories
  async getTemplateCategories() {
    try {
      const response = await axios.get(`${API_URL}/workflow-templates/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching template categories:', error);
      throw error;
    }
  }

  // Template search and filtering
  async searchTemplates(query) {
    try {
      const response = await axios.get(`${API_URL}/workflow-templates/search`, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching workflow templates:', error);
      throw error;
    }
  }

  async getTemplatesByCategory(category) {
    try {
      const response = await axios.get(`${API_URL}/workflow-templates/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching templates by category:', error);
      throw error;
    }
  }
}

const workflowTemplateService = new WorkflowTemplateService();
export default workflowTemplateService; 