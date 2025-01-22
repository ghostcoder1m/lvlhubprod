import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import workflowTemplateService from '../../services/workflowTemplateService';

const WorkflowTemplates = ({ onSelectTemplate, onClose }) => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
    loadCategories();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await workflowTemplateService.getTemplates();
      setTemplates(data);
      setLoading(false);
    } catch (error) {
      toast.error('Error loading templates');
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await workflowTemplateService.getTemplateCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Error loading categories');
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await workflowTemplateService.searchTemplates(searchQuery);
      setTemplates(data);
      setLoading(false);
    } catch (error) {
      toast.error('Error searching templates');
      setLoading(false);
    }
  };

  const handleCategoryChange = async (category) => {
    try {
      setLoading(true);
      setSelectedCategory(category);
      
      let data;
      if (category === 'all') {
        data = await workflowTemplateService.getTemplates();
      } else {
        data = await workflowTemplateService.getTemplatesByCategory(category);
      }
      
      setTemplates(data);
      setLoading(false);
    } catch (error) {
      toast.error('Error filtering templates');
      setLoading(false);
    }
  };

  const handleCreateFromTemplate = async (templateId) => {
    try {
      const workflow = await workflowTemplateService.createWorkflowFromTemplate(templateId, {
        name: 'New Workflow from Template'
      });
      toast.success('Workflow created from template');
      navigate(`/workflows/${workflow.id}`);
    } catch (error) {
      toast.error('Error creating workflow from template');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Workflow Templates</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="mb-6 flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search templates..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Templates
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {template.name}
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                    {template.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="material-icons text-sm mr-1">schedule</span>
                    <span>{template.estimatedTime}</span>
                  </div>
                  <button
                    onClick={() => handleCreateFromTemplate(template.id)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowTemplates; 