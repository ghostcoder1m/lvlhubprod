import React, { useState } from 'react';
import { toast } from 'react-toastify';

const NodeConfigPanel = ({ node, onUpdate, onDelete }) => {
  if (!node || !node.data) {
    return (
      <div className="p-4">
        <div className="text-red-600">Invalid node configuration</div>
      </div>
    );
  }

  const [configData, setConfigData] = useState(node.data || {});

  const handleConfigChange = (field, value) => {
    if (!field) return;
    
    const newData = { ...configData, [field]: value };
    setConfigData(newData);
    onUpdate(node.id, newData);
  };

  const renderTriggerConfig = () => {
    const triggers = configData.triggers || [];
    const scheduleType = configData.scheduleType || '';
    const selectedDays = configData.selectedDays || [];

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Trigger Type</label>
          <select
            value={configData.triggerType || ''}
            onChange={(e) => handleConfigChange('triggerType', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Select Trigger Type</option>
            {triggers.map((trigger) => (
              <option key={trigger} value={trigger}>{trigger}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Action Type</label>
          <select
            value={configData.actionType || ''}
            onChange={(e) => handleConfigChange('actionType', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Select Action Type</option>
            {configData.actions?.map((action) => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>
        
        {configData.triggerType === 'Scheduled' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Schedule Type</label>
            <select
              value={scheduleType}
              onChange={(e) => handleConfigChange('scheduleType', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="once">One Time</option>
              <option value="recurring">Recurring</option>
              <option value="specific_days">Specific Days</option>
            </select>
            
            {scheduleType === 'once' && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                <input
                  type="datetime-local"
                  value={configData.scheduleDateTime || ''}
                  onChange={(e) => handleConfigChange('scheduleDateTime', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            )}

            {scheduleType === 'recurring' && (
              <div className="mt-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Frequency</label>
                <select
                  value={configData.frequency || 'daily'}
                  onChange={(e) => handleConfigChange('frequency', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>

                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    value={configData.scheduleTime || ''}
                    onChange={(e) => handleConfigChange('scheduleTime', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
            )}

            {scheduleType === 'specific_days' && (
              <div className="mt-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Days of Week</label>
                <div className="flex flex-wrap gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <label key={day} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedDays.includes(day) || false}
                        onChange={(e) => {
                          const days = selectedDays || [];
                          const newDays = e.target.checked
                            ? [...days, day]
                            : days.filter(d => d !== day);
                          handleConfigChange('selectedDays', newDays);
                        }}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {configData.triggerType === 'Form Submission' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Form</label>
            <select
              value={configData.formId || ''}
              onChange={(e) => handleConfigChange('formId', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">Select Form</option>
              <option value="contact">Contact Form</option>
              <option value="lead">Lead Capture Form</option>
              <option value="appointment">Appointment Form</option>
            </select>
          </div>
        )}

        {configData.triggerType === 'Pipeline Stage Changed' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Pipeline</label>
            <select
              value={configData.pipelineId || ''}
              onChange={(e) => handleConfigChange('pipelineId', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">Select Pipeline</option>
              <option value="sales">Sales Pipeline</option>
              <option value="support">Support Pipeline</option>
            </select>

            <label className="block text-sm font-medium text-gray-700 mt-2">Stage</label>
            <select
              value={configData.stageId || ''}
              onChange={(e) => handleConfigChange('stageId', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">Select Stage</option>
              <option value="new">New</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        )}
      </div>
    );
  };

  const renderActionConfig = () => {
    const actions = configData.actions || [];
    const actionType = configData.actionType || '';

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Action Type</label>
          <select
            value={actionType}
            onChange={(e) => handleConfigChange('actionType', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Select Action Type</option>
            {actions.map((action) => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>

        {actionType === 'Send Email' && (
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Template</label>
              <select
                value={configData.emailTemplate || ''}
                onChange={(e) => handleConfigChange('emailTemplate', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select Template</option>
                <option value="welcome">Welcome Email</option>
                <option value="followup">Follow-up Email</option>
                <option value="newsletter">Newsletter</option>
                <option value="appointment">Appointment Confirmation</option>
                <option value="reminder">Reminder Email</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                value={configData.emailSubject || ''}
                onChange={(e) => handleConfigChange('emailSubject', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Email Subject"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sender Name</label>
              <input
                type="text"
                value={configData.senderName || ''}
                onChange={(e) => handleConfigChange('senderName', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Sender Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Reply-To Email</label>
              <input
                type="email"
                value={configData.replyToEmail || ''}
                onChange={(e) => handleConfigChange('replyToEmail', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="reply@example.com"
              />
            </div>
          </div>
        )}

        {actionType === 'Send SMS' && (
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Template</label>
              <select
                value={configData.smsTemplate || ''}
                onChange={(e) => handleConfigChange('smsTemplate', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select Template</option>
                <option value="reminder">Appointment Reminder</option>
                <option value="confirmation">Booking Confirmation</option>
                <option value="followup">Follow-up Message</option>
                <option value="promotion">Promotional Message</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                value={configData.smsMessage || ''}
                onChange={(e) => handleConfigChange('smsMessage', e.target.value)}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter SMS message..."
              />
            </div>
          </div>
        )}

        {actionType === 'Create Task' && (
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Task Title</label>
              <input
                type="text"
                value={configData.taskTitle || ''}
                onChange={(e) => handleConfigChange('taskTitle', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Task Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                type="datetime-local"
                value={configData.taskDueDate || ''}
                onChange={(e) => handleConfigChange('taskDueDate', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Assign To</label>
              <select
                value={configData.taskAssignee || ''}
                onChange={(e) => handleConfigChange('taskAssignee', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select Assignee</option>
                <option value="current_user">Current User</option>
                <option value="team_lead">Team Lead</option>
                <option value="sales_rep">Sales Representative</option>
              </select>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderConditionConfig = () => {
    const conditions = configData.conditions || [];
    const conditionType = configData.conditionType || '';

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Condition Type</label>
          <select
            value={conditionType}
            onChange={(e) => handleConfigChange('conditionType', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Select Condition Type</option>
            {conditions.map((condition) => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
        </div>

        {conditionType === 'Contact Field' && (
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Field</label>
              <select
                value={configData.field || ''}
                onChange={(e) => handleConfigChange('field', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Select Field</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="name">Name</option>
                <option value="company">Company</option>
                <option value="custom">Custom Field</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Operator</label>
              <select
                value={configData.operator || ''}
                onChange={(e) => handleConfigChange('operator', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="equals">Equals</option>
                <option value="not_equals">Does Not Equal</option>
                <option value="contains">Contains</option>
                <option value="not_contains">Does Not Contain</option>
                <option value="starts_with">Starts With</option>
                <option value="ends_with">Ends With</option>
                <option value="is_empty">Is Empty</option>
                <option value="is_not_empty">Is Not Empty</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Value</label>
              <input
                type="text"
                value={configData.value || ''}
                onChange={(e) => handleConfigChange('value', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter value to compare"
              />
            </div>
          </div>
        )}

        {conditionType === 'Tag Exists' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Tag</label>
            <select
              value={configData.tag || ''}
              onChange={(e) => handleConfigChange('tag', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">Select Tag</option>
              <option value="customer">Customer</option>
              <option value="prospect">Prospect</option>
              <option value="lead">Lead</option>
              <option value="vip">VIP</option>
            </select>
          </div>
        )}
      </div>
    );
  };

  const renderDelayConfig = () => {
    const delayTypes = configData.delayTypes || [];
    const delayType = configData.delayType || '';

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Delay Type</label>
          <select
            value={delayType}
            onChange={(e) => handleConfigChange('delayType', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Select Delay Type</option>
            {delayTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {delayType === 'Fixed Time' && (
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={configData.duration || ''}
                  onChange={(e) => handleConfigChange('duration', e.target.value)}
                  className="mt-1 block w-24 border border-gray-300 rounded-md shadow-sm p-2"
                  min="1"
                />
                <select
                  value={configData.durationType || ''}
                  onChange={(e) => handleConfigChange('durationType', e.target.value)}
                  className="mt-1 block w-32 border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {delayType === 'Until Time of Day' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              value={configData.timeOfDay || ''}
              onChange={(e) => handleConfigChange('timeOfDay', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        )}
      </div>
    );
  };

  const renderIntegrationConfig = () => {
    const integrations = configData.integrations || [];
    const integrationType = configData.integrationType || '';

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Integration Type</label>
          <select
            value={integrationType}
            onChange={(e) => handleConfigChange('integrationType', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Select Integration</option>
            {integrations.map((integration) => (
              <option key={integration} value={integration}>{integration}</option>
            ))}
          </select>
        </div>

        {integrationType === 'Zapier' && (
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Webhook URL</label>
              <input
                type="url"
                value={configData.webhookUrl || ''}
                onChange={(e) => handleConfigChange('webhookUrl', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="https://hooks.zapier.com/..."
              />
            </div>
          </div>
        )}

        {integrationType === 'Custom Webhook' && (
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Webhook URL</label>
              <input
                type="url"
                value={configData.webhookUrl || ''}
                onChange={(e) => handleConfigChange('webhookUrl', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="https://api.example.com/webhook"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Method</label>
              <select
                value={configData.method || ''}
                onChange={(e) => handleConfigChange('method', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="POST">POST</option>
                <option value="GET">GET</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Headers</label>
              <textarea
                value={configData.headers || ''}
                onChange={(e) => handleConfigChange('headers', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Content-Type: application/json"
                rows="3"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Node Configuration</h3>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
          title="Delete node"
        >
          <span className="material-icons text-xl">delete</span>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={configData.label || ''}
          onChange={(e) => handleConfigChange('label', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      {node.type === 'trigger' && renderTriggerConfig()}
      {node.type === 'action' && renderActionConfig()}
      {node.type === 'condition' && renderConditionConfig()}
      {node.type === 'delay' && renderDelayConfig()}
      {node.type === 'integration' && renderIntegrationConfig()}

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={configData.description || ''}
          onChange={(e) => handleConfigChange('description', e.target.value)}
          rows="2"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="Add a description..."
        />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            onUpdate(node.id, configData);
            toast.success('Node configuration updated');
          }}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default NodeConfigPanel; 