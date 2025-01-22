"use client";

import React, { useState } from 'react';

const LeadManagement = () => {
  // Lead data state
  const [leads] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Tech Corp',
      score: 85,
      status: 'qualified',
      lastActivity: '2024-01-14T10:30:00',
      activities: [
        { type: 'email_open', timestamp: '2024-01-14T10:30:00', details: 'Opened Welcome Email' },
        { type: 'page_visit', timestamp: '2024-01-14T10:35:00', details: 'Visited Pricing Page' },
        { type: 'form_submission', timestamp: '2024-01-14T11:00:00', details: 'Submitted Contact Form' }
      ],
      tags: ['enterprise', 'high-value'],
      demographics: {
        location: 'New York, USA',
        industry: 'Technology',
        companySize: '100-500'
      }
    }
  ]);

  // Scoring rules state
  const [scoringRules] = useState([
    { action: 'email_open', points: 5 },
    { action: 'page_visit', points: 3 },
    { action: 'form_submission', points: 10 },
    { action: 'download', points: 8 }
  ]);

  // Filter and sort state
  const [filters, setFilters] = useState({
    status: 'all',
    minScore: 0,
    tag: 'all'
  });

  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');

  // Lead qualification thresholds
  const qualificationThresholds = {
    cold: 0,
    warm: 30,
    qualified: 60,
    hot: 80
  };

  const getLeadStatus = (score) => {
    if (score >= qualificationThresholds.hot) return 'hot';
    if (score >= qualificationThresholds.qualified) return 'qualified';
    if (score >= qualificationThresholds.warm) return 'warm';
    return 'cold';
  };

  const getStatusColor = (status) => {
    const colors = {
      hot: 'bg-red-100 text-red-800',
      qualified: 'bg-green-100 text-green-800',
      warm: 'bg-yellow-100 text-yellow-800',
      cold: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredLeads = leads
    .filter(lead => {
      if (filters.status !== 'all' && getLeadStatus(lead.score) !== filters.status) return false;
      if (lead.score < filters.minScore) return false;
      if (filters.tag !== 'all' && !lead.tags.includes(filters.tag)) return false;
      return true;
    })
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'score') return (a.score - b.score) * order;
      if (sortBy === 'lastActivity') {
        return (new Date(a.lastActivity) - new Date(b.lastActivity)) * order;
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Lead Management</h1>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Import Leads
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lead Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="all">All Statuses</option>
              <option value="hot">Hot</option>
              <option value="qualified">Qualified</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Score
            </label>
            <input
              type="number"
              value={filters.minScore}
              onChange={(e) => setFilters({ ...filters, minScore: parseInt(e.target.value) })}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="score">Lead Score</option>
              <option value="lastActivity">Last Activity</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="desc">Highest First</option>
              <option value="asc">Lowest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                        <div className="text-sm text-gray-500">{lead.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(getLeadStatus(lead.score))}`}>
                      {getLeadStatus(lead.score)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.score}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(lead.lastActivity)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {lead.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                    <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scoring Rules */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Lead Scoring Rules</h2>
        <div className="grid grid-cols-2 gap-4">
          {scoringRules.map((rule, index) => (
            <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <span className="font-medium">{rule.action.replace('_', ' ').toUpperCase()}</span>
                <span className="ml-2 text-gray-500">+{rule.points} points</span>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <span className="material-icons">edit</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadManagement; 