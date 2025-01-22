import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CampaignDetails = ({ campaign, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCampaign, setEditedCampaign] = useState({
    ...campaign,
    mailgunConfig: campaign.mailgunConfig || {
      apiKey: '',
      domain: '',
      senderEmail: ''
    }
  });

  const handleSave = () => {
    onUpdate(editedCampaign);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedCampaign(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMessageChange = (index, value) => {
    const newMessages = [...editedCampaign.keyMessages];
    newMessages[index] = value;
    setEditedCampaign(prev => ({
      ...prev,
      keyMessages: newMessages
    }));
  };

  const handleMetricChange = (index, value) => {
    const newMetrics = [...editedCampaign.metrics];
    newMetrics[index] = value;
    setEditedCampaign(prev => ({
      ...prev,
      metrics: newMetrics
    }));
  };

  const handleWorkflowStepChange = (index, field, value) => {
    const newWorkflow = [...editedCampaign.workflow];
    newWorkflow[index] = {
      ...newWorkflow[index],
      [field]: value
    };
    setEditedCampaign(prev => ({
      ...prev,
      workflow: newWorkflow
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {isEditing ? 'Edit Campaign' : 'Campaign Details'}
            </h2>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              campaign.status === 'active' ? 'bg-green-100 text-green-800' :
              campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {campaign.status}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-indigo-400 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <span className="material-icons text-sm mr-1">edit</span>
                Edit
              </button>
            )}
            {isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-400 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                >
                  Save Changes
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="material-icons text-gray-600">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-73px)]">
          <div className="space-y-6">
            {/* Campaign Name */}
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedCampaign.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="text-2xl font-semibold text-gray-800 w-full p-2 border border-gray-200 rounded-lg focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                />
              ) : (
                <h1 className="text-2xl font-semibold text-gray-800">{campaign.name}</h1>
              )}
            </div>

            {/* Target Audience */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Target Audience</h3>
              {isEditing ? (
                <textarea
                  value={editedCampaign.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                  rows={3}
                />
              ) : (
                <p className="text-gray-600">{campaign.targetAudience}</p>
              )}
            </div>

            {/* Key Messages */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Key Messages</h3>
              <div className="space-y-2">
                {(isEditing ? editedCampaign : campaign).keyMessages.map((message, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="material-icons text-indigo-400 text-sm mt-1">arrow_right</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => handleMessageChange(index, e.target.value)}
                        className="flex-1 p-2 border border-gray-200 rounded-lg focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                      />
                    ) : (
                      <p className="text-gray-600">{message}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mailgun Configuration */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-4">Mailgun Configuration</h3>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Key
                    </label>
                    <input
                      type="text"
                      value={editedCampaign.mailgunConfig.apiKey}
                      onChange={(e) => setEditedCampaign(prev => ({
                        ...prev,
                        mailgunConfig: {
                          ...prev.mailgunConfig,
                          apiKey: e.target.value
                        }
                      }))}
                      placeholder="key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full p-2 border border-gray-200 rounded-lg focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Domain
                    </label>
                    <input
                      type="text"
                      value={editedCampaign.mailgunConfig.domain}
                      onChange={(e) => setEditedCampaign(prev => ({
                        ...prev,
                        mailgunConfig: {
                          ...prev.mailgunConfig,
                          domain: e.target.value
                        }
                      }))}
                      placeholder="mail.yourdomain.com"
                      className="w-full p-2 border border-gray-200 rounded-lg focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sender Email
                    </label>
                    <input
                      type="email"
                      value={editedCampaign.mailgunConfig.senderEmail}
                      onChange={(e) => setEditedCampaign(prev => ({
                        ...prev,
                        mailgunConfig: {
                          ...prev.mailgunConfig,
                          senderEmail: e.target.value
                        }
                      }))}
                      placeholder="noreply@yourdomain.com"
                      className="w-full p-2 border border-gray-200 rounded-lg focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                    />
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <span className="material-icons text-sm align-middle mr-1">info</span>
                      You'll need to configure your Mailgun account and verify your domain before sending emails.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Domain:</span> {editedCampaign.mailgunConfig.domain || 'Not configured'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Sender:</span> {editedCampaign.mailgunConfig.senderEmail || 'Not configured'}
                  </p>
                </div>
              )}
            </div>

            {/* Workflow */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Workflow Steps</h3>
              <div className="space-y-4">
                {(isEditing ? editedCampaign : campaign).workflow.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4 bg-white p-4 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <span className="material-icons text-indigo-400 text-sm">
                        {step.type === 'email' ? 'email' : step.type === 'social' ? 'share' : 'notifications'}
                      </span>
                    </div>
                    <div className="flex-1 space-y-2">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={step.name}
                            onChange={(e) => handleWorkflowStepChange(index, 'name', e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                          />
                          <div className="flex space-x-2">
                            <select
                              value={step.type}
                              onChange={(e) => handleWorkflowStepChange(index, 'type', e.target.value)}
                              className="p-2 border border-gray-200 rounded-lg focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                            >
                              <option value="email">Email</option>
                              <option value="social">Social</option>
                              <option value="notification">Notification</option>
                            </select>
                            <input
                              type="text"
                              value={step.delay}
                              onChange={(e) => handleWorkflowStepChange(index, 'delay', e.target.value)}
                              placeholder="Delay (e.g., 2d)"
                              className="w-24 p-2 border border-gray-200 rounded-lg focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-800">{step.name}</p>
                            <span className="text-sm text-gray-500">Delay: {step.delay}</span>
                          </div>
                          {step.content && (
                            <div className="text-sm text-gray-600">
                              {step.type === 'email' && (
                                <>
                                  <p className="font-medium">Subject: {step.content.subject}</p>
                                  <p className="mt-1">CTA: {step.content.cta}</p>
                                </>
                              )}
                              {step.type === 'social' && (
                                <>
                                  <p>{step.content.text}</p>
                                  <p className="mt-1 text-indigo-400">{step.content.hashtags.join(' ')}</p>
                                </>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Metrics */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Success Metrics</h3>
              <div className="space-y-2">
                {(isEditing ? editedCampaign : campaign).metrics.map((metric, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="material-icons text-indigo-400 text-sm">analytics</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={metric}
                        onChange={(e) => handleMetricChange(index, e.target.value)}
                        className="flex-1 p-2 border border-gray-200 rounded-lg focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                      />
                    ) : (
                      <p className="text-gray-600">{metric}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails; 