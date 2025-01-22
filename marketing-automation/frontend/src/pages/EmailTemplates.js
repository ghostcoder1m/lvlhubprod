import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import EmailBuilder from '../components/email/EmailBuilder';

const EmailTemplates = () => {
  const [templates, setTemplates] = useState(() => {
    const savedTemplates = localStorage.getItem('emailTemplates');
    return savedTemplates ? JSON.parse(savedTemplates) : [
      {
        id: 1,
        name: 'Welcome Email',
        subject: 'Welcome to Our Platform!',
        category: 'Onboarding',
        thumbnail: 'https://via.placeholder.com/300x200',
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5;">Welcome aboard!</h1>
            <p>We're excited to have you join us.</p>
            <button style="background-color: #4F46E5; color: white; padding: 10px 20px; border: none; border-radius: 5px;">Get Started</button>
          </div>
        `
      },
      {
        id: 2,
        name: 'Monthly Newsletter',
        subject: 'Your Monthly Update',
        category: 'Newsletter',
        thumbnail: 'https://via.placeholder.com/300x200',
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5;">Monthly Highlights</h1>
            <p>Here's what's new this month...</p>
            <button style="background-color: #4F46E5; color: white; padding: 10px 20px; border: none; border-radius: 5px;">Read More</button>
          </div>
        `
      }
    ];
  });

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Add new state for AI
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiContext, setAiContext] = useState({
    products: [],
    campaigns: [],
    workflows: []
  });

  const categories = ['all', 'Onboarding', 'Newsletter', 'Promotional', 'Transactional', 'Follow-up'];

  useEffect(() => {
    localStorage.setItem('emailTemplates', JSON.stringify(templates));
  }, [templates]);

  // Load context data on mount
  useEffect(() => {
    // Load products
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setAiContext(prev => ({
        ...prev,
        products: JSON.parse(savedProducts)
      }));
    }

    // Load campaigns
    const savedCampaigns = localStorage.getItem('campaigns');
    if (savedCampaigns) {
      setAiContext(prev => ({
        ...prev,
        campaigns: JSON.parse(savedCampaigns)
      }));
    }

    // Load workflows
    const savedWorkflows = localStorage.getItem('workflows');
    if (savedWorkflows) {
      setAiContext(prev => ({
        ...prev,
        workflows: JSON.parse(savedWorkflows)
      }));
    }
  }, []);

  const handleCreateTemplate = () => {
    const newTemplate = {
      id: Date.now(),
      name: 'New Template',
      subject: 'New Subject',
      category: 'Onboarding',
      thumbnail: 'https://via.placeholder.com/300x200',
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">New Template</h1>
          <p>Start editing your template...</p>
          <button style="background-color: #4F46E5; color: white; padding: 10px 20px; border: none; border-radius: 5px;">Click Me</button>
        </div>
      `
    };
    setTemplates([...templates, newTemplate]);
    setSelectedTemplate(newTemplate);
    setIsEditing(true);
    setEditingTemplate(newTemplate);
  };

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id ? editingTemplate : t
      ));
      setIsEditing(false);
      setEditingTemplate(null);
      toast.success('Template saved successfully!');
    }
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(t => t.id !== templateId));
      setSelectedTemplate(null);
      setIsEditing(false);
      toast.success('Template deleted successfully!');
    }
  };

  const generateAIContent = async () => {
    setIsGenerating(true);
    try {
      // Prepare context for AI
      const context = {
        template: editingTemplate,
        products: aiContext.products,
        campaigns: aiContext.campaigns,
        workflows: aiContext.workflows
      };

      // Generate content based on template category
      let systemPrompt = `You are an expert email marketing copywriter. Create HTML email content that is visually appealing, mobile-responsive, and follows email marketing best practices. Use inline CSS for compatibility.`;
      
      let userPrompt = '';
      switch (editingTemplate.category) {
        case 'Onboarding':
          userPrompt = `Create a welcoming email for new users that includes:
            - A warm, friendly welcome message
            - Introduction to key features and benefits
            - Clear getting started steps
            - Professional HTML design with inline styles
            
            Available products: ${context.products.map(p => `${p.name} (${p.description})`).join(', ')}
            
            Format the email with proper HTML structure, using a clean design with our brand color #4F46E5.
            Include a header image section, content sections with icons, and a prominent call-to-action button.`;
          break;
        case 'Newsletter':
          userPrompt = `Create a newsletter email that includes:
            - Latest product updates: ${context.products.map(p => p.name).join(', ')}
            - Current campaigns: ${context.campaigns.map(c => c.name).join(', ')}
            - Tips and best practices section
            - Professional HTML design with inline styles
            
            Format the email with proper HTML structure, using a clean design with our brand color #4F46E5.
            Include sections for each update, campaign highlights, and a tips section.`;
          break;
        case 'Promotional':
          userPrompt = `Create a promotional email that includes:
            - Featured products: ${context.products.map(p => `${p.name} (${p.description})`).join(', ')}
            - Special offers from campaigns: ${context.campaigns.map(c => c.name).join(', ')}
            - Compelling call-to-action
            - Professional HTML design with inline styles
            
            Format the email with proper HTML structure, using a clean design with our brand color #4F46E5.
            Include product cards, offer banners, and prominent call-to-action buttons.`;
          break;
        default:
          userPrompt = `Create an engaging email for ${editingTemplate.category} that includes:
            - Professional HTML design with inline styles
            - Content relevant to ${editingTemplate.category}
            - Clear call-to-action
            
            Products: ${context.products.map(p => p.name).join(', ')}
            Campaigns: ${context.campaigns.map(c => c.name).join(', ')}
            
            Format the email with proper HTML structure, using a clean design with our brand color #4F46E5.`;
      }

      // Make API call to OpenAI
      const response = await fetch('http://localhost:3005/api/email/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      const generatedContent = data.content;

      setEditingTemplate(prev => ({
        ...prev,
        content: generatedContent
      }));

      toast.success('AI content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate AI content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTestEmail = async () => {
    if (!editingTemplate) return;

    try {
      const testEmail = prompt('Enter email address for test:', '');
      if (!testEmail) return;

      const response = await fetch('http://localhost:5001/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: testEmail,
          subject: editingTemplate.subject,
          html: editingTemplate.content,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Test email sent successfully!');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email. Please try again.');
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderTemplateCard = (template) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        <img
          src={template.thumbnail}
          alt={template.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
            <p className="text-sm text-gray-500">{template.subject}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            {template.category}
          </span>
        </div>
        <div className="mt-4 flex flex-col space-y-2">
          <div className="flex justify-between">
            <button
              onClick={() => {
                setSelectedTemplate(template);
                setIsEditing(true);
                setEditingTemplate({...template});
              }}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              Edit Template
            </button>
            <button
              onClick={() => handleDeleteTemplate(template.id)}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Delete
            </button>
          </div>
          <button
            onClick={() => {
              setEditingTemplate(template);
              handleTestEmail();
            }}
            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <span className="material-icons mr-2">send</span>
            Send Test Email
          </button>
        </div>
      </div>
    </div>
  );

  const renderTemplateList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTemplates.map(template => renderTemplateCard(template))}
    </div>
  );

  const renderEditor = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Template Name</label>
            <input
              type="text"
              value={editingTemplate?.name || ''}
              onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={editingTemplate?.category || ''}
              onChange={(e) => setEditingTemplate({...editingTemplate, category: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {categories.filter(cat => cat !== 'all').map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Subject Line</label>
          <input
            type="text"
            value={editingTemplate?.subject || ''}
            onChange={(e) => setEditingTemplate({...editingTemplate, subject: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">Email Content</label>
          <div className="flex space-x-3">
            <button
              onClick={handleTestEmail}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <span className="material-icons mr-2">send</span>
              Send Test Email
            </button>
            <button
              onClick={generateAIContent}
              disabled={isGenerating}
              className={`flex items-center px-4 py-2 rounded-md ${
                isGenerating 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <span className="material-icons mr-2">
                {isGenerating ? 'hourglass_empty' : 'psychology'}
              </span>
              {isGenerating ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
        </div>
        <div className="border rounded-lg p-4 min-h-[400px] bg-gray-50">
          <textarea
            value={editingTemplate?.content || ''}
            onChange={(e) => setEditingTemplate({...editingTemplate, content: e.target.value})}
            className="w-full h-full min-h-[400px] p-4 border rounded-md"
            placeholder="Enter your email content here..."
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => {
            setIsEditing(false);
            setEditingTemplate(null);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveTemplate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Save Template
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full py-6 px-6">
      {!isEditing ? (
        <>
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <span className="material-icons absolute left-3 top-2.5 text-gray-400">
                    search
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleCreateTemplate}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
                >
                  <span className="material-icons mr-2">add</span>
                  Create Template
                </button>
              </div>
            </div>
          </div>
          {renderTemplateList()}
        </>
      ) : (
        <div>
          <div className="mb-6 flex items-center">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingTemplate(null);
              }}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <span className="material-icons">arrow_back</span>
            </button>
            <h2 className="text-xl font-semibold">
              {editingTemplate?.id ? 'Edit Template' : 'Create New Template'}
            </h2>
          </div>
          {renderEditor()}
        </div>
      )}
    </div>
  );
};

export default EmailTemplates; 