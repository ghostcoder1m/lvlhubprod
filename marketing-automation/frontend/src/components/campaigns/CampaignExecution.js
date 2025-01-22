import React, { useState, useEffect } from 'react';
import campaignExecutionService from '../../services/campaignExecutionService';

const CampaignExecution = ({ campaign, onClose, onStart }) => {
  const [executionState, setExecutionState] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if campaign is already running
    const state = campaignExecutionService.getCampaignState(campaign.id);
    if (state) {
      setExecutionState(state);
    }
  }, [campaign.id]);

  const handleStart = async () => {
    try {
      setError(null);
      const state = await campaignExecutionService.startCampaign(campaign);
      setExecutionState(state);
      onStart();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePause = () => {
    campaignExecutionService.pauseCampaign(campaign.id);
    setExecutionState(prev => ({ ...prev, status: 'paused' }));
  };

  const handleResume = () => {
    campaignExecutionService.resumeCampaign(campaign.id);
    setExecutionState(prev => ({ ...prev, status: 'running' }));
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Campaign Execution: {campaign.name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="material-icons text-gray-600">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {executionState ? (
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium text-gray-800 capitalize">{executionState.status}</p>
                </div>
                <div>
                  {executionState.status === 'running' ? (
                    <button
                      onClick={handlePause}
                      className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                    >
                      Pause Campaign
                    </button>
                  ) : executionState.status === 'paused' ? (
                    <button
                      onClick={handleResume}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      Resume Campaign
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Progress */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Progress</p>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 transition-all duration-500"
                    style={{
                      width: `${(executionState.currentStepIndex / campaign.workflow.length) * 100}%`
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Step {executionState.currentStepIndex + 1} of {campaign.workflow.length}
                </p>
              </div>

              {/* Completed Steps */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Completed Steps</p>
                <div className="space-y-2">
                  {executionState.completedSteps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="material-icons text-green-500 text-sm">check_circle</span>
                        <span className="text-gray-800">
                          {campaign.workflow[step.stepIndex].name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(step.completedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Execution */}
              {executionState.nextExecutionTime && executionState.status !== 'completed' && (
                <div>
                  <p className="text-sm text-gray-600">Next Step</p>
                  <p className="font-medium text-gray-800">
                    {new Date(executionState.nextExecutionTime).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you ready to start this campaign? This will begin sending emails and executing
                other workflow steps according to the campaign schedule.
              </p>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleStart}
                  className="px-4 py-2 bg-indigo-400 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                >
                  Start Campaign
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignExecution; 