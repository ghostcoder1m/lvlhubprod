import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DashboardCard = ({ title, value, change, icon }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        {change !== undefined && (
          <p className={`text-sm mt-2 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs last month
          </p>
        )}
      </div>
      <span className="material-icons text-4xl text-indigo-500">{icon}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [greeting, setGreeting] = useState('');
  const [metrics, setMetrics] = useState([]);
  const [socialMetrics, setSocialMetrics] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [recentCampaigns, setRecentCampaigns] = useState([]);

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Load data from localStorage
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Load campaigns
    const campaigns = JSON.parse(localStorage.getItem('workflows') || '[]');
    const activeCampaigns = campaigns.filter(c => c.is_active).length;
    
    // Load products
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Load leads/subscribers
    const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
    
    // Calculate metrics
    const campaignMetrics = calculateCampaignMetrics(campaigns);
    
    // Set main metrics
    setMetrics([
      { 
        title: 'Active Campaigns', 
        value: activeCampaigns.toString(), 
        icon: 'campaign'
      },
      { 
        title: 'Total Products', 
        value: products.length.toString(), 
        icon: 'inventory_2'
      },
      { 
        title: 'Total Subscribers', 
        value: subscribers.length.toString(), 
        icon: 'people'
      },
      { 
        title: 'Email Open Rate', 
        value: `${campaignMetrics.openRate}%`, 
        icon: 'mail'
      },
    ]);

    // Set social metrics
    setSocialMetrics([
      { 
        title: 'Connected Platforms', 
        value: calculateConnectedPlatforms(), 
        icon: 'share'
      },
      { 
        title: 'Scheduled Posts', 
        value: calculateScheduledPosts(campaigns), 
        icon: 'schedule'
      },
      { 
        title: 'Active Social Campaigns', 
        value: calculateSocialCampaigns(campaigns), 
        icon: 'trending_up'
      },
      { 
        title: 'Social Engagement', 
        value: `${campaignMetrics.socialEngagement}%`, 
        icon: 'thumb_up'
      },
    ]);

    // Set workflows
    setWorkflows(campaigns.map(campaign => ({
      name: campaign.name,
      status: campaign.is_active ? 'active' : 'draft',
      triggers: campaign.triggers?.length || 0,
      actions: campaign.nodes?.length || 0,
      lastRun: campaign.lastRun || 'Never'
    })));

    // Set recent campaigns
    setRecentCampaigns(
      campaigns
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 3)
        .map(campaign => ({
          name: campaign.name,
          status: campaign.is_active ? 'active' : campaign.scheduledDate ? 'scheduled' : 'draft',
          leads: campaign.leads?.length || 0,
          conversion: calculateConversion(campaign)
        }))
    );
  };

  const calculateCampaignMetrics = (campaigns) => {
    let totalEmails = 0;
    let openedEmails = 0;
    let socialInteractions = 0;
    let totalSocialPosts = 0;

    campaigns.forEach(campaign => {
      if (campaign.stats) {
        totalEmails += campaign.stats.emailsSent || 0;
        openedEmails += campaign.stats.emailsOpened || 0;
        socialInteractions += campaign.stats.socialInteractions || 0;
        totalSocialPosts += campaign.stats.socialPosts || 0;
      }
    });

    return {
      openRate: totalEmails ? Math.round((openedEmails / totalEmails) * 100) : 0,
      socialEngagement: totalSocialPosts ? Math.round((socialInteractions / totalSocialPosts) * 100) : 0
    };
  };

  const calculateConnectedPlatforms = () => {
    const platforms = JSON.parse(localStorage.getItem('connectedPlatforms') || '[]');
    return platforms.length.toString();
  };

  const calculateScheduledPosts = (campaigns) => {
    let scheduledPosts = 0;
    campaigns.forEach(campaign => {
      scheduledPosts += campaign.scheduledPosts?.length || 0;
    });
    return scheduledPosts.toString();
  };

  const calculateSocialCampaigns = (campaigns) => {
    return campaigns.filter(campaign => 
      campaign.is_active && campaign.nodes?.some(node => node.type === 'social')
    ).length.toString();
  };

  const calculateConversion = (campaign) => {
    if (!campaign.stats) return '0%';
    const conversions = campaign.stats.conversions || 0;
    const totalLeads = campaign.leads?.length || 0;
    return totalLeads ? `${Math.round((conversions / totalLeads) * 100)}%` : '0%';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              {greeting}! 👋
            </h1>
            <p className="text-gray-600">
              Welcome to your marketing automation dashboard. Here's an overview of your campaigns and activities.
            </p>
          </div>
          <div className="bg-indigo-50 p-3 rounded-lg">
            <span className="material-icons text-indigo-400">dashboard</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <DashboardCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Social Media Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Social Media Performance</h2>
          <Link to="/social-media" className="text-indigo-600 hover:text-indigo-700">
            View Details
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {socialMetrics.map((metric) => (
            <DashboardCard key={metric.title} {...metric} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/campaigns/new"
            className="flex items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100"
          >
            <span className="material-icons mr-2">add</span>
            Create Campaign
          </Link>
          <Link
            to="/leads/import"
            className="flex items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100"
          >
            <span className="material-icons mr-2">upload</span>
            Import Leads
          </Link>
          <Link
            to="/workflows"
            className="flex items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100"
          >
            <span className="material-icons mr-2">auto_awesome</span>
            Create Workflow
          </Link>
          <Link
            to="/social-media"
            className="flex items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100"
          >
            <span className="material-icons mr-2">share</span>
            Social Media
          </Link>
        </div>
      </div>

      {/* Workflows */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Workflows</h2>
            <Link to="/workflows" className="text-indigo-600 hover:text-indigo-700">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Triggers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Run
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workflows.map((workflow) => (
                  <tr key={workflow.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{workflow.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        workflow.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {workflow.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {workflow.triggers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {workflow.actions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {workflow.lastRun}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Campaigns</h2>
            <Link to="/campaigns" className="text-indigo-600 hover:text-indigo-700">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversion
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentCampaigns.map((campaign) => (
                  <tr key={campaign.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.leads}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {campaign.conversion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 