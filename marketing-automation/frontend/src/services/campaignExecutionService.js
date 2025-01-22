import mailgunService from './mailgunService';

class CampaignExecutionService {
  constructor() {
    this.runningCampaigns = new Map();
    this.loadPersistedState();
  }

  loadPersistedState() {
    try {
      const persistedState = localStorage.getItem('campaignExecutionState');
      if (persistedState) {
        const parsedState = JSON.parse(persistedState);
        Object.entries(parsedState).forEach(([campaignId, state]) => {
          this.runningCampaigns.set(campaignId, {
            ...state,
            nextExecutionTime: new Date(state.nextExecutionTime),
            completedSteps: state.completedSteps.map(step => ({
              ...step,
              completedAt: new Date(step.completedAt)
            }))
          });
        });
      }
    } catch (error) {
      console.error('Failed to load persisted campaign state:', error);
    }
  }

  persistState() {
    try {
      const state = {};
      this.runningCampaigns.forEach((value, key) => {
        state[key] = value;
      });
      localStorage.setItem('campaignExecutionState', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to persist campaign state:', error);
    }
  }

  async startCampaign(campaign) {
    if (this.runningCampaigns.has(campaign.id)) {
      const existingState = this.runningCampaigns.get(campaign.id);
      if (existingState.status === 'paused') {
        return this.resumeCampaign(campaign.id);
      }
      throw new Error('Campaign is already running');
    }

    // Validate domain before starting
    const isDomainValid = await mailgunService.validateDomain();
    if (!isDomainValid) {
      throw new Error('Mailgun domain is not properly configured or verified');
    }

    // Validate that campaign has recipients
    if (!campaign.recipients || campaign.recipients.length === 0) {
      throw new Error('Campaign must have at least one recipient');
    }

    // Validate that campaign has workflow steps
    if (!campaign.workflow || campaign.workflow.length === 0) {
      throw new Error('Campaign must have at least one workflow step');
    }

    const workflowState = {
      campaignId: campaign.id,
      currentStepIndex: 0,
      status: 'running',
      completedSteps: [],
      nextExecutionTime: new Date(),
      recipients: campaign.recipients,
      stats: {
        total: 0,
        sent: 0,
        failed: 0
      }
    };

    this.runningCampaigns.set(campaign.id, workflowState);
    this.persistState();
    
    // Start executing the workflow
    this.executeNextStep(campaign, workflowState);

    return workflowState;
  }

  async executeNextStep(campaign, state) {
    if (state.status !== 'running') return;

    if (state.currentStepIndex >= campaign.workflow.length) {
      state.status = 'completed';
      this.persistState();
      return;
    }

    const currentStep = campaign.workflow[state.currentStepIndex];
    
    try {
      switch (currentStep.type) {
        case 'email':
          await this.executeEmailStep(currentStep, state);
          break;
        case 'social':
          console.log('Social media step:', currentStep);
          break;
        case 'notification':
          console.log('Notification step:', currentStep);
          break;
      }

      state.completedSteps.push({
        stepIndex: state.currentStepIndex,
        completedAt: new Date(),
        success: true,
        type: currentStep.type
      });

      state.currentStepIndex++;
      this.persistState();
      
      if (currentStep.delay && state.status === 'running') {
        const delayMs = this.parseDelay(currentStep.delay);
        state.nextExecutionTime = new Date(Date.now() + delayMs);
        this.persistState();
        setTimeout(() => this.executeNextStep(campaign, state), delayMs);
      } else if (state.status === 'running') {
        this.executeNextStep(campaign, state);
      }
    } catch (error) {
      console.error(`Error executing step ${state.currentStepIndex}:`, error);
      state.status = 'error';
      state.error = error.message;
      this.persistState();
    }
  }

  async executeEmailStep(step, state) {
    const { content } = step;
    state.stats.total += state.recipients.length;
    
    for (const recipient of state.recipients) {
      try {
        await mailgunService.sendEmail({
          to: recipient.email,
          subject: content.subject,
          content: this.personalizeContent(content.html, recipient)
        });
        state.stats.sent++;
        this.persistState();
      } catch (error) {
        console.error(`Failed to send email to ${recipient.email}:`, error);
        state.stats.failed++;
        this.persistState();
      }
    }
  }

  personalizeContent(content, recipient) {
    return content
      .replace(/{{firstName}}/g, recipient.firstName || '')
      .replace(/{{lastName}}/g, recipient.lastName || '')
      .replace(/{{email}}/g, recipient.email || '')
      .replace(/{{unsubscribe}}/g, '%unsubscribe_url%');
  }

  parseDelay(delay) {
    const unit = delay.slice(-1);
    const value = parseInt(delay.slice(0, -1));
    
    switch (unit) {
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      case 'm':
        return value * 60 * 1000;
      default:
        return 0;
    }
  }

  pauseCampaign(campaignId) {
    const state = this.runningCampaigns.get(campaignId);
    if (state && state.status === 'running') {
      state.status = 'paused';
      this.persistState();
    }
  }

  resumeCampaign(campaignId) {
    const state = this.runningCampaigns.get(campaignId);
    if (state && state.status === 'paused') {
      state.status = 'running';
      this.persistState();
      
      const campaign = JSON.parse(localStorage.getItem('workflows')).find(w => w.id === campaignId);
      if (campaign) {
        this.executeNextStep(campaign, state);
      }
    }
    return state;
  }

  stopCampaign(campaignId) {
    const state = this.runningCampaigns.get(campaignId);
    if (state) {
      state.status = 'stopped';
      this.persistState();
    }
  }

  getCampaignState(campaignId) {
    return this.runningCampaigns.get(campaignId);
  }

  async getCampaignStats(campaignId) {
    const state = this.runningCampaigns.get(campaignId);
    if (!state) return null;

    try {
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 7);

      const mailgunStats = await mailgunService.getEmailStats(
        startDate.toISOString(),
        endDate.toISOString()
      );

      return {
        ...state.stats,
        ...mailgunStats
      };
    } catch (error) {
      console.error('Failed to get campaign stats:', error);
      return state.stats;
    }
  }
}

export default new CampaignExecutionService(); 