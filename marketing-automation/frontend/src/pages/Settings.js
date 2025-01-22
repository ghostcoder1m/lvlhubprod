import React, { useState } from 'react';
import DomainManager from '../components/email/DomainManager';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    slack: true,
    desktop: true,
    digest: 'daily'
  });
  const [apiKeys, setApiKeys] = useState({
    openai: process.env.REACT_APP_OPENAI_KEY || '',
    mailgun: process.env.REACT_APP_MAILGUN_KEY || '',
    slack: '',
    twitter: ''
  });
  const [automationSettings, setAutomationSettings] = useState({
    maxConcurrentWorkflows: 5,
    retryAttempts: 3,
    retryDelay: 5,
    timeoutMinutes: 30,
    errorNotificationThreshold: 3
  });
  const [aiSettings, setAiSettings] = useState({
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    topP: 0.9,
    frequencyPenalty: 0.5,
    presencePenalty: 0.5
  });
  const [theme, setTheme] = useState({
    mode: 'light',
    primaryColor: '#4F46E5',
    accentColor: '#10B981',
    radius: 'rounded',
    density: 'comfortable'
  });

  const tabs = [
    { id: 'general', label: 'General', icon: 'settings' },
    { id: 'email', label: 'Email Settings', icon: 'email' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'integrations', label: 'Integrations', icon: 'extension' },
    { id: 'automation', label: 'Automation', icon: 'auto_awesome' },
    { id: 'ai', label: 'AI Configuration', icon: 'psychology' },
    { id: 'appearance', label: 'Appearance', icon: 'palette' },
    { id: 'security', label: 'Security', icon: 'security' },
    { id: 'billing', label: 'Billing', icon: 'payments' }
  ];

  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleApiKeyChange = (key, value) => {
    setApiKeys(prev => ({ ...prev, [key]: value }));
  };

  const handleAutomationChange = (key, value) => {
    setAutomationSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleAiSettingChange = (key, value) => {
    setAiSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleThemeChange = (key, value) => {
    setTheme(prev => ({ ...prev, [key]: value }));
  };

  const renderGeneralSettings = () => (
    <div className="w-full space-y-6">
      <div className="w-full bg-white shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              defaultValue="Acme Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Industry</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option>Technology</option>
              <option>E-commerce</option>
              <option>Healthcare</option>
              <option>Finance</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full bg-white shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Time Zone Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Time Zone</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option>UTC (GMT+0)</option>
              <option>EST (GMT-5)</option>
              <option>PST (GMT-8)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date Format</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="w-full space-y-6">
      <div className="w-full bg-white shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-gray-500">Receive updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => handleNotificationChange('email', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Push Notifications</h4>
              <p className="text-sm text-gray-500">Get push notifications in your browser</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => handleNotificationChange('push', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Slack Integration</h4>
              <p className="text-sm text-gray-500">Send notifications to Slack</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.slack}
                onChange={(e) => handleNotificationChange('slack', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="w-full bg-white shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Schedule</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Digest Frequency</label>
            <select
              value={notifications.digest}
              onChange={(e) => handleNotificationChange('digest', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="realtime">Real-time</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAutomationSettings = () => (
    <div className="w-full space-y-6">
      <div className="w-full bg-white shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Workflow Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Concurrent Workflows
            </label>
            <input
              type="number"
              value={automationSettings.maxConcurrentWorkflows}
              onChange={(e) => handleAutomationChange('maxConcurrentWorkflows', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Retry Attempts
            </label>
            <input
              type="number"
              value={automationSettings.retryAttempts}
              onChange={(e) => handleAutomationChange('retryAttempts', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Retry Delay (minutes)
            </label>
            <input
              type="number"
              value={automationSettings.retryDelay}
              onChange={(e) => handleAutomationChange('retryDelay', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Workflow Timeout (minutes)
            </label>
            <input
              type="number"
              value={automationSettings.timeoutMinutes}
              onChange={(e) => handleAutomationChange('timeoutMinutes', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="w-full bg-white shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Error Handling</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Error Notification Threshold
            </label>
            <input
              type="number"
              value={automationSettings.errorNotificationThreshold}
              onChange={(e) => handleAutomationChange('errorNotificationThreshold', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Number of errors before sending notifications
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAISettings = () => (
    <div className="w-full space-y-6">
      <div className="w-full bg-white shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">AI Model Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Model</label>
            <select
              value={aiSettings.model}
              onChange={(e) => handleAiSettingChange('model', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="gpt-4">GPT-4 (Most Capable)</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Temperature</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={aiSettings.temperature}
              onChange={(e) => handleAiSettingChange('temperature', parseFloat(e.target.value))}
              className="mt-1 block w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Focused</span>
              <span>{aiSettings.temperature}</span>
              <span>Creative</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Tokens</label>
            <input
              type="number"
              value={aiSettings.maxTokens}
              onChange={(e) => handleAiSettingChange('maxTokens', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Top P</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={aiSettings.topP}
              onChange={(e) => handleAiSettingChange('topP', parseFloat(e.target.value))}
              className="mt-1 block w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Focused</span>
              <span>{aiSettings.topP}</span>
              <span>Diverse</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-white shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Content Generation Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Frequency Penalty</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={aiSettings.frequencyPenalty}
              onChange={(e) => handleAiSettingChange('frequencyPenalty', parseFloat(e.target.value))}
              className="mt-1 block w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Repetitive</span>
              <span>{aiSettings.frequencyPenalty}</span>
              <span>Varied</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Presence Penalty</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={aiSettings.presencePenalty}
              onChange={(e) => handleAiSettingChange('presencePenalty', parseFloat(e.target.value))}
              className="mt-1 block w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Focused</span>
              <span>{aiSettings.presencePenalty}</span>
              <span>Exploratory</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="w-full space-y-6">
      <div className="w-full bg-white shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Theme Customization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Theme Mode</label>
            <select
              value={theme.mode}
              onChange={(e) => handleThemeChange('mode', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Primary Color</label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                className="h-8 w-8 rounded-md border-gray-300"
              />
              <input
                type="text"
                value={theme.primaryColor}
                onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Border Radius</label>
            <select
              value={theme.radius}
              onChange={(e) => handleThemeChange('radius', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="none">Square</option>
              <option value="rounded">Rounded</option>
              <option value="rounded-lg">Large Rounded</option>
              <option value="rounded-full">Full Rounded</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Interface Density</label>
            <select
              value={theme.density}
              onChange={(e) => handleThemeChange('density', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
              <option value="spacious">Spacious</option>
            </select>
          </div>
        </div>
      </div>

      <div className="w-full bg-white shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
        <div className={`p-4 border rounded-${theme.radius} space-y-4`} style={{ backgroundColor: theme.primaryColor + '10' }}>
          <div className={`bg-white p-4 rounded-${theme.radius} shadow`}>
            <h4 className="font-medium" style={{ color: theme.primaryColor }}>Sample Card</h4>
            <p className="text-gray-600 mt-2">This is how your content will look with the current theme settings.</p>
          </div>
          <button
            className={`px-4 py-2 rounded-${theme.radius} text-white`}
            style={{ backgroundColor: theme.primaryColor }}
          >
            Sample Button
          </button>
        </div>
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="w-full space-y-6">
      <div className="w-full bg-white shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">API Keys</h3>
        <div className="space-y-4">
          {Object.entries(apiKeys).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {key} API Key
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="password"
                  value={value}
                  onChange={(e) => handleApiKeyChange(key, e.target.value)}
                  className="flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  className="ml-3 inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full bg-white shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Connected Services</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="material-icons text-blue-500">mail</span>
              <div>
                <h4 className="font-medium">Email Service (Mailgun)</h4>
                <p className="text-sm text-gray-500">Connected</p>
              </div>
            </div>
            <button className="text-red-600 hover:text-red-800">Disconnect</button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="material-icons text-purple-500">psychology</span>
              <div>
                <h4 className="font-medium">OpenAI</h4>
                <p className="text-sm text-gray-500">Connected</p>
              </div>
            </div>
            <button className="text-red-600 hover:text-red-800">Disconnect</button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="material-icons text-blue-400">chat</span>
              <div>
                <h4 className="font-medium">Slack</h4>
                <p className="text-sm text-gray-500">Not connected</p>
              </div>
            </div>
            <button className="text-indigo-600 hover:text-indigo-800">Connect</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Settings Navigation */}
      <div className="w-full border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex space-x-8 px-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-4 px-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="material-icons text-[20px] mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Settings Content */}
      <div className="w-full px-6 py-4">
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'notifications' && renderNotificationSettings()}
        {activeTab === 'automation' && renderAutomationSettings()}
        {activeTab === 'email' && <DomainManager />}
        {activeTab === 'ai' && renderAISettings()}
        {activeTab === 'appearance' && renderAppearanceSettings()}
        {activeTab === 'integrations' && renderIntegrationSettings()}
      </div>
    </div>
  );
};

export default Settings; 