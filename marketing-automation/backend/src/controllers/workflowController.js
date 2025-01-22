const WorkflowModel = require('../models/workflow');
const WorkflowExecutionModel = require('../models/workflowExecution');
const { executeWorkflow } = require('../services/workflowEngine');
const { validateWorkflow } = require('../utils/workflowValidator');

class WorkflowController {
  // Create a new workflow
  async createWorkflow(req, res) {
    try {
      const { name, description, nodes, edges, is_active } = req.body;
      
      // Validate workflow structure
      const validationResult = validateWorkflow({ nodes, edges });
      if (!validationResult.isValid) {
        return res.status(400).json({ error: validationResult.error });
      }

      const workflow = await WorkflowModel.create({
        name,
        description,
        nodes,
        edges,
        is_active: is_active || false,
        created_by: req.user.id
      });

      res.status(201).json(workflow);
    } catch (error) {
      console.error('Error creating workflow:', error);
      res.status(500).json({ error: 'Failed to create workflow' });
    }
  }

  // Get workflow by ID
  async getWorkflow(req, res) {
    try {
      const workflow = await WorkflowModel.findById(req.params.id)
        .populate('created_by', 'name email')
        .populate('ab_testing.variants');

      if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      res.json(workflow);
    } catch (error) {
      console.error('Error fetching workflow:', error);
      res.status(500).json({ error: 'Failed to fetch workflow' });
    }
  }

  // Update workflow
  async updateWorkflow(req, res) {
    try {
      const { name, description, nodes, edges, is_active } = req.body;

      // Validate workflow structure if nodes/edges are being updated
      if (nodes && edges) {
        const validationResult = validateWorkflow({ nodes, edges });
        if (!validationResult.isValid) {
          return res.status(400).json({ error: validationResult.error });
        }
      }

      const workflow = await WorkflowModel.findByIdAndUpdate(
        req.params.id,
        {
          name,
          description,
          nodes,
          edges,
          is_active,
          updated_at: Date.now()
        },
        { new: true }
      );

      if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      res.json(workflow);
    } catch (error) {
      console.error('Error updating workflow:', error);
      res.status(500).json({ error: 'Failed to update workflow' });
    }
  }

  // Delete workflow
  async deleteWorkflow(req, res) {
    try {
      const workflow = await WorkflowModel.findByIdAndDelete(req.params.id);

      if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      // Delete associated executions
      await WorkflowExecutionModel.deleteMany({ workflow_id: req.params.id });

      res.json({ message: 'Workflow deleted successfully' });
    } catch (error) {
      console.error('Error deleting workflow:', error);
      res.status(500).json({ error: 'Failed to delete workflow' });
    }
  }

  // List workflows
  async listWorkflows(req, res) {
    try {
      const workflows = await WorkflowModel.find({ created_by: req.user.id })
        .select('name description is_active created_at updated_at')
        .sort('-created_at');

      res.json(workflows);
    } catch (error) {
      console.error('Error listing workflows:', error);
      res.status(500).json({ error: 'Failed to list workflows' });
    }
  }

  // Activate workflow
  async activateWorkflow(req, res) {
    try {
      const workflow = await WorkflowModel.findById(req.params.id);

      if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      // Validate workflow before activation
      const validationResult = validateWorkflow({
        nodes: workflow.nodes,
        edges: workflow.edges
      });

      if (!validationResult.isValid) {
        return res.status(400).json({ error: validationResult.error });
      }

      workflow.is_active = true;
      workflow.activated_at = Date.now();
      await workflow.save();

      res.json({ message: 'Workflow activated successfully' });
    } catch (error) {
      console.error('Error activating workflow:', error);
      res.status(500).json({ error: 'Failed to activate workflow' });
    }
  }

  // Deactivate workflow
  async deactivateWorkflow(req, res) {
    try {
      const workflow = await WorkflowModel.findById(req.params.id);

      if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      workflow.is_active = false;
      await workflow.save();

      res.json({ message: 'Workflow deactivated successfully' });
    } catch (error) {
      console.error('Error deactivating workflow:', error);
      res.status(500).json({ error: 'Failed to deactivate workflow' });
    }
  }

  // Get workflow executions
  async getWorkflowExecutions(req, res) {
    try {
      const { limit = 10, offset = 0, status } = req.query;
      const query = { workflow_id: req.params.id };

      if (status) {
        query.status = status;
      }

      const executions = await WorkflowExecutionModel.find(query)
        .sort('-start_time')
        .skip(parseInt(offset))
        .limit(parseInt(limit));

      res.json(executions);
    } catch (error) {
      console.error('Error fetching workflow executions:', error);
      res.status(500).json({ error: 'Failed to fetch workflow executions' });
    }
  }

  // Get workflow statistics
  async getWorkflowStats(req, res) {
    try {
      const workflow = await WorkflowModel.findById(req.params.id);

      if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      const executions = await WorkflowExecutionModel.find({
        workflow_id: req.params.id,
        status: { $in: ['completed', 'failed'] }
      });

      const totalRuns = executions.length;
      const successfulRuns = executions.filter(e => e.status === 'completed').length;
      const successRate = totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0;

      const durations = executions
        .filter(e => e.end_time)
        .map(e => (new Date(e.end_time) - new Date(e.start_time)) / 1000);
      
      const avgDuration = durations.length > 0
        ? durations.reduce((a, b) => a + b, 0) / durations.length
        : 0;

      const lastRun = executions.length > 0
        ? executions[0].start_time
        : null;

      res.json({
        totalRuns,
        successRate,
        avgDuration,
        lastRun
      });
    } catch (error) {
      console.error('Error fetching workflow stats:', error);
      res.status(500).json({ error: 'Failed to fetch workflow statistics' });
    }
  }

  // Create A/B testing variant
  async createVariant(req, res) {
    try {
      const workflow = await WorkflowModel.findById(req.params.id);

      if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      const { nodes, edges, distribution } = req.body;

      // Validate variant workflow structure
      const validationResult = validateWorkflow({ nodes, edges });
      if (!validationResult.isValid) {
        return res.status(400).json({ error: validationResult.error });
      }

      // Create variant
      workflow.ab_testing = {
        enabled: true,
        variants: [{
          nodes,
          edges,
          distribution: distribution || 50
        }]
      };

      await workflow.save();

      res.json(workflow);
    } catch (error) {
      console.error('Error creating workflow variant:', error);
      res.status(500).json({ error: 'Failed to create workflow variant' });
    }
  }

  // Execute workflow manually
  async executeWorkflowManually(req, res) {
    try {
      const workflow = await WorkflowModel.findById(req.params.id);

      if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
      }

      const execution = await executeWorkflow(workflow, req.body.data || {});
      res.json(execution);
    } catch (error) {
      console.error('Error executing workflow:', error);
      res.status(500).json({ error: 'Failed to execute workflow' });
    }
  }
}

module.exports = new WorkflowController(); 