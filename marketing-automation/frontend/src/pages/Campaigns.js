import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import WorkflowVisualization from '../components/campaigns/WorkflowVisualization';
import StepByStepBreakdown from '../components/campaigns/StepByStepBreakdown';
import CampaignExecution from '../components/campaigns/CampaignExecution';
import AICampaignCreator from '../components/campaigns/AICampaignCreator';
import CampaignDetails from '../components/campaigns/CampaignDetails';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showVisualization, setShowVisualization] = useState(false);
  const [showExecution, setShowExecution] = useState(false);
  const [stats, setStats] = useState({});
  const [showAICreator, setShowAICreator] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Load workflows from localStorage
    const workflows = JSON.parse(localStorage.getItem('workflows') || '[]');
    setCampaigns(workflows.map(workflow => ({
      ...workflow,
      status: workflow.is_active ? 'Active' : 'Draft',
      performance: {
        sent: Math.floor(Math.random() * 1000),
        opened: Math.floor(Math.random() * 500),
        clicked: Math.floor(Math.random() * 200),
        converted: Math.floor(Math.random() * 50)
      }
    })));
  }, []);

  const handleStartCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowExecution(true);
  };

  const handleConfirmStart = () => {
    if (!selectedCampaign) return;

    // Update campaign status in localStorage
    const workflows = JSON.parse(localStorage.getItem('workflows') || '[]');
    const updatedWorkflows = workflows.map(w => 
      w.id === selectedCampaign.id ? { ...w, is_active: true } : w
    );
    localStorage.setItem('workflows', JSON.stringify(updatedWorkflows));
    
    // Update local state
    setCampaigns(prevCampaigns => 
      prevCampaigns.map(c => 
        c.id === selectedCampaign.id ? { ...c, status: 'Active' } : c
      )
    );
    
    setShowExecution(false);
    toast.success('Campaign started successfully');
  };

  const handlePauseCampaign = (campaign) => {
    // Update campaign status in localStorage
    const workflows = JSON.parse(localStorage.getItem('workflows') || '[]');
    const updatedWorkflows = workflows.map(w => 
      w.id === campaign.id ? { ...w, is_active: false } : w
    );
    localStorage.setItem('workflows', JSON.stringify(updatedWorkflows));
    
    // Update local state
    setCampaigns(prevCampaigns => 
      prevCampaigns.map(c => 
        c.id === campaign.id ? { ...c, status: 'Paused' } : c
      )
    );
    
    toast.info('Campaign paused');
  };

  const handleViewStats = (campaign) => {
    setSelectedCampaign(campaign);
    setShowVisualization(true);
    // Generate some mock stats
    setStats({
      dailyEngagement: Array.from({ length: 7 }, () => ({
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        sent: Math.floor(Math.random() * 100),
        opened: Math.floor(Math.random() * 50),
        clicked: Math.floor(Math.random() * 20)
      })),
      conversionRate: (Math.random() * 100).toFixed(2) + '%',
      averageResponseTime: Math.floor(Math.random() * 24) + ' hours',
      topPerformingNodes: [
        { name: 'Welcome Email', success: '95%' },
        { name: 'Follow-up', success: '82%' },
        { name: 'Special Offer', success: '78%' }
      ]
    });
  };

  const handleCampaignCreate = (campaign) => {
    setCampaigns([...campaigns, campaign]);
    setShowAICreator(false);
  };

  const handleCampaignClick = (campaign) => {
    setSelectedCampaign(campaign);
    setShowDetails(true);
  };

  const handleUpdateCampaign = (updatedCampaign) => {
    // Update campaigns in localStorage
    const campaigns = JSON.parse(localStorage.getItem('workflows') || '[]');
    const updatedCampaigns = campaigns.map(c => 
      c.id === updatedCampaign.id ? updatedCampaign : c
    );
    localStorage.setItem('workflows', JSON.stringify(updatedCampaigns));
    
    // Update local state
    setCampaigns(prevCampaigns => 
      prevCampaigns.map(c => 
        c.id === updatedCampaign.id ? updatedCampaign : c
      )
    );
    
    // Update selected campaign
    setSelectedCampaign(updatedCampaign);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Campaigns</h1>
          <p className="text-gray-600">Create and manage your marketing campaigns</p>
        </div>
        <button
          onClick={() => setShowAICreator(true)}
          className="flex items-center px-4 py-2 bg-indigo-400 text-white rounded-lg hover:bg-indigo-500 transition-colors"
        >
          <span className="material-icons text-sm mr-2">add</span>
          New Campaign
        </button>
      </div>

      {/* Empty State */}
      {campaigns.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
            <span className="material-icons text-indigo-400">campaign</span>
          </div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">No campaigns yet</h2>
          <p className="text-gray-600 text-center mb-6">
            Get started by creating your first campaign. Our AI can help you create a campaign based on your products and ideas.
          </p>
          <button
            onClick={() => setShowAICreator(true)}
            className="flex items-center px-6 py-3 bg-indigo-400 text-white rounded-lg hover:bg-indigo-500 transition-colors"
          >
            <span className="material-icons text-sm mr-2">auto_awesome</span>
            Create with AI
          </button>
        </div>
      )}

      {/* Campaign List */}
      {campaigns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign, index) => (
            <div
              key={index}
              onClick={() => handleCampaignClick(campaign)}
              className="p-6 bg-white border border-gray-200 rounded-xl hover:border-indigo-400 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium text-gray-800">{campaign.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {campaign.workflow.length} steps
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {campaign.status === 'active' ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePauseCampaign(campaign);
                      }}
                      className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                    >
                      <span className="material-icons text-sm">pause</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartCampaign(campaign);
                      }}
                      className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <span className="material-icons text-sm">play_arrow</span>
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewStats(campaign);
                    }}
                    className="p-2 bg-indigo-50 text-indigo-400 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <span className="material-icons text-sm">analytics</span>
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {campaign.workflow.slice(0, 3).map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-center text-sm text-gray-600">
                    <span className="material-icons text-[#6366F1] text-sm mr-2">
                      {step.type === 'email' ? 'email' : step.type === 'social' ? 'share' : 'notifications'}
                    </span>
                    {step.name}
                  </div>
                ))}
                {campaign.workflow.length > 3 && (
                  <p className="text-sm text-gray-500">
                    +{campaign.workflow.length - 3} more steps
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Campaign Visualization Modal */}
      {showVisualization && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Campaign Statistics: {selectedCampaign.name}
              </h2>
              <button
                onClick={() => setShowVisualization(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            {/* Workflow Visualization */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Workflow Structure</h3>
              <WorkflowVisualization 
                nodes={selectedCampaign.nodes || []} 
                edges={selectedCampaign.edges || []} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Daily Engagement Chart */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Daily Engagement</h3>
                <div className="space-y-2">
                  {stats.dailyEngagement?.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{day.date}</span>
                      <div className="flex space-x-4">
                        <span className="text-blue-600">{day.sent} sent</span>
                        <span className="text-green-600">{day.opened} opened</span>
                        <span className="text-purple-600">{day.clicked} clicked</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Response Time</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageResponseTime}</p>
                  </div>
                </div>
              </div>

              {/* Top Performing Nodes */}
              <div className="col-span-full bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Top Performing Nodes</h3>
                <div className="space-y-2">
                  {stats.topPerformingNodes?.map((node, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <span className="font-medium">{node.name}</span>
                      <span className="text-green-600">{node.success} success rate</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Execution View */}
      {showExecution && selectedCampaign && (
        <CampaignExecution
          campaign={selectedCampaign}
          onClose={() => setShowExecution(false)}
          onStart={handleConfirmStart}
        />
      )}

      {/* AI Campaign Creator Modal */}
      {showAICreator && (
        <AICampaignCreator
          onClose={() => setShowAICreator(false)}
          onCampaignCreate={handleCampaignCreate}
        />
      )}

      {/* Campaign Details Modal */}
      {showDetails && selectedCampaign && (
        <CampaignDetails
          campaign={selectedCampaign}
          onClose={() => setShowDetails(false)}
          onUpdate={handleUpdateCampaign}
        />
      )}
    </div>
  );
};

export default Campaigns; 