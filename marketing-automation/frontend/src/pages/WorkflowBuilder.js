import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import workflowService from '../services/workflowService';
import CustomNode from '../components/workflow/CustomNode';
import NodeConfigPanel from '../components/workflow/NodeConfigPanel';
import WorkflowTemplates from '../components/workflow/WorkflowTemplates';
import workflowTemplateService from '../services/workflowTemplateService';
import TriggerNode from '../components/workflow/TriggerNode';

// Node types configuration with custom node component
const nodeTypes = {
  trigger: TriggerNode,
  action: CustomNode,
  condition: CustomNode,
  delay: CustomNode,
  aiAction: CustomNode,
  integration: CustomNode
};

// Node type configurations for the palette
const nodeTypesConfig = {
  trigger: {
    data: {
      label: 'Trigger',
      triggers: [
        'Form Submission',
        'Email Open',
        'Link Click',
        'Schedule',
        'Lead Score Change',
        'Social Media Mention',
        'Hashtag Usage',
        'Social Profile Update'
      ]
    }
  },
  socialTrigger: {
    data: {
      label: 'Social Trigger',
      triggers: [
        'New Social Mention',
        'Hashtag Tracked',
        'Engagement Threshold',
        'Sentiment Change',
        'Competitor Mention',
        'Brand Mention',
        'Social Traffic Spike',
        'Comment on Post'
      ],
      platforms: ['Facebook', 'Twitter', 'LinkedIn', 'Instagram']
    }
  },
  action: {
    data: {
      label: 'Action',
      actions: [
        'Send Email',
        'Send SMS',
        'Update Lead',
        'Assign Task',
        'Add Tag',
        'Remove Tag',
        'Create Social Post',
        'Schedule Social Content'
      ]
    }
  },
  socialAction: {
    data: {
      label: 'Social Action',
      actions: [
        'Schedule Post',
        'Create Ad Campaign',
        'Boost Post',
        'Engage with Mention',
        'Update Social Profile',
        'Cross-Platform Share',
        'Archive Post',
        'Generate Social Report'
      ],
      platforms: ['Facebook', 'Twitter', 'LinkedIn', 'Instagram']
    }
  },
  condition: {
    data: {
      label: 'Condition',
      conditions: [
        'Lead Score',
        'Email Engagement',
        'Custom Field',
        'Tag Exists',
        'Engagement Rate',
        'Sentiment Score',
        'Social Reach',
        'Ad Performance'
      ]
    }
  },
  aiAction: {
    data: {
      label: 'AI Action',
      actions: [
        'Generate Email Content',
        'Predict Next Best Action',
        'Score Lead',
        'Personalize Content',
        'Analyze Sentiment',
        'Generate Social Copy',
        'Optimize Hashtags',
        'Content Recommendations'
      ]
    }
  },
  contentNode: {
    data: {
      label: 'Content Library',
      types: [
        'Social Media Posts',
        'Ad Creatives',
        'Campaign Assets',
        'Hashtag Sets',
        'Response Templates',
        'Brand Assets',
        'Evergreen Content',
        'Content Calendar'
      ]
    }
  }
};

const nodeTypeConfigs = {
  trigger: {
    type: 'trigger',
    label: 'Trigger',
    icon: 'play_circle',
    data: {
      label: 'New Trigger',
      description: '',
      triggerType: '',
      triggers: [
        'Form Submission',
        'Calendar Booking',
        'Appointment Status Change',
        'Contact Created',
        'Contact Updated',
        'Tag Added',
        'Tag Removed',
        'Pipeline Stage Changed',
        'Opportunity Created',
        'Task Completed',
        'Website Visit',
        'Custom Webhook',
        'Scheduled',
        'Social Media Mention',
        'Email Open',
        'Link Click',
        'Lead Score Change'
      ],
      scheduleTypes: ['once', 'recurring', 'specific_days'],
      frequencies: ['hourly', 'daily', 'weekly', 'monthly']
    },
    sourceHandle: {
      type: 'source',
      position: 'right',
      style: { background: '#3b82f6' }
    }
  },
  action: {
    type: 'action',
    label: 'Action',
    icon: 'bolt',
    data: {
      label: 'New Action',
      description: '',
      actions: [
        'Send Email',
        'Send SMS',
        'Send Voice Message',
        'Create Task',
        'Create Appointment',
        'Add to Pipeline',
        'Move Pipeline Stage',
        'Add Tag',
        'Remove Tag',
        'Update Contact',
        'Create Opportunity',
        'Send Internal Notification',
        'HTTP Request',
        'Create Calendar Event',
        'Create Social Post',
        'Schedule Social Content',
        'Generate Social Report'
      ],
      emailTemplates: [
        'Welcome Email',
        'Follow-up Email',
        'Newsletter',
        'Appointment Confirmation',
        'Reminder Email',
        'Custom Template'
      ],
      smsTemplates: [
        'Appointment Reminder',
        'Booking Confirmation',
        'Follow-up Message',
        'Promotional Message',
        'Custom Template'
      ]
    }
  },
  condition: {
    type: 'condition',
    label: 'Condition',
    icon: 'call_split',
    data: {
      label: 'New Condition',
      description: '',
      conditions: [
        'Contact Field',
        'Tag Exists',
        'Pipeline Stage',
        'Appointment Status',
        'Email Activity',
        'SMS Status',
        'Form Submission Data',
        'Custom Field Value',
        'Contact Segment',
        'Time of Day',
        'Day of Week',
        'Geographic Location',
        'Device Type',
        'Lead Score',
        'Social Media Engagement',
        'Sentiment Score'
      ],
      operators: [
        'equals',
        'not_equals',
        'contains',
        'not_contains',
        'starts_with',
        'ends_with',
        'greater_than',
        'less_than',
        'is_empty',
        'is_not_empty'
      ],
      fields: [
        'email',
        'phone',
        'name',
        'company',
        'address',
        'city',
        'state',
        'country',
        'lead_score',
        'last_activity',
        'custom_field'
      ]
    }
  },
  delay: {
    type: 'delay',
    label: 'Delay',
    icon: 'schedule',
    data: {
      label: 'New Delay',
      description: '',
      delayTypes: [
        'Fixed Time',
        'Until Specific Date',
        'Until Time of Day',
        'Until Day of Week',
        'Business Hours Only'
      ],
      durationTypes: [
        'minutes',
        'hours',
        'days',
        'weeks'
      ]
    }
  },
  aiAction: {
    type: 'aiAction',
    label: 'AI Action',
    icon: 'psychology',
    data: {
      label: 'New AI Action',
      description: '',
      actions: [
        'Generate Email Content',
        'Personalize Message',
        'Analyze Sentiment',
        'Predict Next Best Action',
        'Score Lead',
        'Generate Social Post',
        'Optimize Subject Line',
        'Content Recommendations',
        'Optimize Hashtags',
        'Engagement Analysis'
      ]
    }
  },
  integration: {
    type: 'integration',
    label: 'Integration',
    icon: 'extension',
    data: {
      label: 'New Integration',
      description: '',
      integrations: [
        'Zapier',
        'Google Calendar',
        'Google Sheets',
        'Facebook Lead Ads',
        'Stripe',
        'QuickBooks',
        'Zoom',
        'Custom Webhook',
        'Facebook',
        'Twitter',
        'LinkedIn',
        'Instagram'
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    }
  }
};

const validateWorkflow = (nodes, edges) => {
  const errors = [];
  
  // Check for at least one trigger node
  const triggerNodes = nodes.filter(node => node.type === 'trigger');
  if (triggerNodes.length === 0) {
    errors.push('Workflow must have at least one trigger node');
  }
  
  // Check for at least one action node
  const actionNodes = nodes.filter(node => node.type === 'action');
  if (actionNodes.length === 0) {
    errors.push('Workflow must have at least one action node');
  }
  
  // Check for disconnected nodes (excluding triggers and final actions)
  nodes.forEach(node => {
    const hasIncoming = edges.some(edge => edge.target === node.id);
    const hasOutgoing = edges.some(edge => edge.source === node.id);
    
    // Skip connection check for trigger nodes (they don't need incoming connections)
    if (node.type !== 'trigger' && !hasIncoming) {
      // Skip validation for nodes that are being dragged or not yet placed
      if (node.position && (node.position.x !== 0 || node.position.y !== 0)) {
        errors.push(`Node "${node.data.label}" is not connected to any incoming nodes`);
      }
    }
    
    // Only check outgoing connections for nodes that require them
    if (!['action', 'delay'].includes(node.type) && !hasOutgoing) {
      // Skip validation for nodes that are being dragged or not yet placed
      if (node.position && (node.position.x !== 0 || node.position.y !== 0)) {
        errors.push(`Node "${node.data.label}" is not connected to any outgoing nodes`);
      }
    }
  });
  
  return errors;
};

const validateNodeConfiguration = (node) => {
  if (!node || !node.data) {
    return ['Invalid node configuration'];
  }

  const errors = [];
  
  if (!node.data.label) {
    errors.push('Node name is required');
  }
  
  switch (node.type) {
    case 'trigger':
      if (!node.data.triggerType) {
        errors.push('Trigger type must be selected');
      }
      if (node.data.triggerType === 'Scheduled' && !node.data.scheduleType) {
        errors.push('Schedule type must be selected for scheduled triggers');
      }
      break;
      
    case 'action':
      if (!node.data.actionType) {
        errors.push('Action type must be selected');
      }
      if (node.data.actionType === 'Send Email' && !node.data.emailTemplate) {
        errors.push('Email template must be selected for email actions');
      }
      break;
      
    case 'condition':
      if (!node.data.conditionType) {
        errors.push('Condition type must be selected');
      }
      if (node.data.conditionType === 'Contact Field' && !node.data.field) {
        errors.push('Field must be selected for contact field conditions');
      }
      break;

    default:
      // No additional validation needed for other node types
      break;
  }
  
  return errors;
};

const WorkflowBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // React Flow states
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  // Basic workflow metadata
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [isActive, setIsActive] = useState(false);

  // A/B Testing state
  const [hasVariants, setHasVariants] = useState(false);

  // AI Suggestions state
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState([]);

  // Execution logs & stats
  const [executionLogs, setExecutionLogs] = useState([]);
  const [workflowStats, setWorkflowStats] = useState({
    totalRuns: 0,
    successRate: 0,
    avgDuration: 0,
    lastRun: null
  });

  // Social media state
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [contentLibrary, setContentLibrary] = useState([]);
  const [socialAnalytics, setSocialAnalytics] = useState({
    engagement: 0,
    reach: 0,
    clicks: 0,
    sentiment: 0
  });

  // Testing mode state
  const [isTestMode, setIsTestMode] = useState(false);
  const [testResults, setTestResults] = useState(null);

  // Template state
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSaveAsTemplate, setShowSaveAsTemplate] = useState(false);
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    category: '',
    estimatedTime: ''
  });

  // Workflow Analysis state
  const [workflowAnalysis, setWorkflowAnalysis] = useState(null);

  // Load workflow data
  useEffect(() => {
    const loadWorkflow = () => {
      if (!id) return;

      try {
        const existingWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
        const workflow = existingWorkflows.find(w => w.id === id);
        
        if (workflow) {
          setWorkflowName(workflow.name);
          setWorkflowDescription(workflow.description);
          setIsActive(workflow.is_active);
          setNodes(workflow.nodes || []);
          setEdges(workflow.edges || []);
          setHasVariants(!!workflow.ab_testing);
        } else {
          toast.error('Workflow not found');
        }
      } catch (error) {
        toast.error('Error loading workflow');
        console.error('Error loading workflow:', error);
      }
    };

    loadWorkflow();
  }, [id, setNodes, setEdges]);

  // Load social media data
  useEffect(() => {
    const loadSocialData = async () => {
      if (!id) return;

      try {
        // Load content library
        const library = await workflowService.getContentLibrary(id);
        setContentLibrary(library);

        // Load social analytics
        const analytics = await workflowService.getSocialAnalytics(id);
        setSocialAnalytics(analytics);

        // Load selected platforms
        const workflow = await workflowService.getWorkflow(id);
        setSelectedPlatforms(workflow.platforms || []);
      } catch (error) {
        toast.error('Error loading social media data');
        console.error('Error loading social media data:', error);
      }
    };

    loadSocialData();
  }, [id]);

  // Add platform change handler
  const handlePlatformChange = (platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  // Connection validation with user feedback
  const isValidConnection = (connection) => {
    if (!connection) return false;

    const sourceNode = nodes.find(node => node.id === connection.source);
    const targetNode = nodes.find(node => node.id === connection.target);

    if (!sourceNode || !targetNode || !sourceNode.data || !targetNode.data) {
      toast.error("Invalid connection: Node not found or invalid node data");
      return false;
    }

    // Don't allow connecting to triggers
    if (targetNode.type === 'trigger') {
      toast.error("Cannot connect to a trigger node - triggers must be at the start of the workflow");
      return false;
    }

    // Allow connecting from triggers to other nodes
    if (sourceNode.type === 'trigger' && targetNode.type !== 'trigger') {
      return true;
    }

    // Don't allow connecting from actions
    if (sourceNode.type === 'action') {
      toast.error("Action nodes must be at the end of a branch - they cannot have outgoing connections");
      return false;
    }

    // Don't allow self-connections
    if (connection.source === connection.target) {
      toast.error("Cannot connect a node to itself");
      return false;
    }

    // Check for existing connections to avoid duplicates
    const hasExistingConnection = edges.some(
      edge => edge.source === connection.source && 
             edge.target === connection.target &&
             edge.sourceHandle === connection.sourceHandle
    );

    if (hasExistingConnection) {
      toast.error("This connection already exists");
      return false;
    }

    // Validate condition node connections
    if (sourceNode.type === 'condition') {
      const existingTrueConnection = edges.some(
        edge => edge.source === connection.source && edge.sourceHandle === 'true'
      );
      const existingFalseConnection = edges.some(
        edge => edge.source === connection.source && edge.sourceHandle === 'false'
      );

      if (connection.sourceHandle === 'true' && existingTrueConnection) {
        toast.error("This condition node already has a 'True' connection");
        return false;
      }
      if (connection.sourceHandle === 'false' && existingFalseConnection) {
        toast.error("This condition node already has a 'False' connection");
        return false;
      }
    }

    return true;
  };

  // Connection handling with validation and feedback
  const onConnect = useCallback((params) => {
    if (isValidConnection(params)) {
      const edge = {
        ...params,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 }
      };
      
      setEdges((eds) => addEdge(edge, eds));
      toast.success("Connection created successfully");
    }
  }, [setEdges, nodes, edges, isValidConnection]);

  // Add this function to check products
  const checkProducts = () => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    if (products.length === 0) {
      toast.error('Please add products first to get AI recommendations');
      navigate('/products');
      return false;
    }
    return true;
  };

  // Add function to analyze workflow with OpenAI
  const analyzeWorkflow = async (workflowData) => {
    try {
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      
      // Generate a simple analysis without OpenAI
      const analysis = {
        summary: `Workflow "${workflowData.name}" contains ${workflowData.nodes.length} nodes and ${workflowData.edges.length} connections.`,
        productRecommendations: products.map(product => ({
          product: product.name,
          recommendation: `Consider targeting ${product.targetAudience} with personalized messaging based on their interests.`
        })),
        suggestions: [
          'Consider adding more personalization steps',
          'Add conditional paths based on user engagement',
          'Include A/B testing for better optimization',
          'Add delay nodes between communications'
        ],
        audienceAlignment: 'The workflow structure aligns with standard marketing automation practices. Consider adding more targeted content based on user segments.'
      };

      setWorkflowAnalysis(analysis);
      
      // Show analysis in a toast
      toast.info(
        <div>
          <h3 className="font-bold mb-2">Workflow Analysis</h3>
          <p>{analysis.summary}</p>
          <button 
            onClick={() => setShowAnalysis(true)}
            className="mt-2 text-blue-500 hover:text-blue-700"
          >
            View Full Analysis
          </button>
        </div>,
        { autoClose: false }
      );

    } catch (error) {
      console.error('Error analyzing workflow:', error);
      toast.error('Error analyzing workflow');
    }
  };

  // Modify the handleSave function
  const handleSave = async () => {
    try {
      // First check if there are products
      if (!checkProducts()) {
        return;
      }

      // Validate workflow name
      if (!workflowName.trim()) {
        toast.error('Please provide a workflow name');
        return;
      }

      // Validate workflow structure
      const workflowErrors = validateWorkflow(nodes, edges);
      if (workflowErrors.length > 0) {
        toast.error('Workflow Structure Errors:');
        workflowErrors.forEach(error => toast.error(error));
        return;
      }
      
      // Validate node configurations
      let hasConfigErrors = false;
      let configErrors = [];
      nodes.forEach(node => {
        const nodeErrors = validateNodeConfiguration(node);
        if (nodeErrors.length > 0) {
          configErrors.push(`${node.data.label || 'Unnamed node'}: ${nodeErrors.join(', ')}`);
          hasConfigErrors = true;
        }
      });
      
      if (hasConfigErrors) {
        toast.error('Node Configuration Errors:');
        configErrors.forEach(error => toast.error(error));
        return;
      }

      const workflowData = {
        id: id || `workflow_${Date.now()}`,
        name: workflowName,
        description: workflowDescription,
        nodes,
        edges,
        is_active: isActive,
        ab_testing: hasVariants ? { enabled: true } : null,
        updated_at: new Date().toISOString()
      };

      // Get existing workflows from localStorage
      const existingWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
      
      if (id) {
        // Update existing workflow
        const index = existingWorkflows.findIndex(w => w.id === id);
        if (index !== -1) {
          existingWorkflows[index] = workflowData;
        } else {
          existingWorkflows.push(workflowData);
        }
        toast.success('Workflow updated successfully');
      } else {
        // Create new workflow
        existingWorkflows.push(workflowData);
        toast.success('Workflow created successfully');
      }

      // Save back to localStorage
      localStorage.setItem('workflows', JSON.stringify(existingWorkflows));

      // After successful save, navigate to workflows list
      navigate('/workflows');

      // After successful save, analyze the workflow
      await analyzeWorkflow(workflowData);
      
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast.error('Error saving workflow: ' + (error.message || 'Unknown error'));
    }
  };

  // Workflow activation
  const handleActivationToggle = async () => {
    try {
      if (!id) {
        toast.error('Please save the workflow first');
        return;
      }

      if (isActive) {
        await workflowService.deactivateWorkflow(id);
        setIsActive(false);
        toast.success('Workflow deactivated');
      } else {
        await workflowService.activateWorkflow(id);
        setIsActive(true);
        toast.success('Workflow activated');
      }
    } catch (error) {
      toast.error(`Error ${isActive ? 'deactivating' : 'activating'} workflow`);
      console.error('Error toggling workflow activation:', error);
    }
  };

  // A/B Testing
  const handleCreateVariant = async () => {
    try {
      if (!id) {
        toast.error('Please save the workflow first');
        return;
      }

      const variantData = {
        nodes: [...nodes],
        edges: [...edges],
        distribution: 50
      };

      await workflowService.createVariant(id, variantData);
      toast.success('Variant created successfully');
      setHasVariants(true);
    } catch (error) {
      toast.error('Error creating variant');
      console.error('Error creating variant:', error);
    }
  };

  // AI Suggestions
  const handleGetAISuggestions = () => {
    try {
      // Generate suggestions based on current workflow structure
      const suggestions = [
        {
          id: 'suggestion_1',
          description: 'Add a delay node after email actions to space out communications',
          type: 'delay',
          priority: 'high'
        },
        {
          id: 'suggestion_2',
          description: 'Include a condition node to check email engagement before sending follow-ups',
          type: 'condition',
          priority: 'medium'
        },
        {
          id: 'suggestion_3',
          description: 'Add an AI action to personalize content based on user behavior',
          type: 'aiAction',
          priority: 'medium'
        },
        {
          id: 'suggestion_4',
          description: 'Consider adding a social media action to cross-promote content',
          type: 'action',
          priority: 'low'
        }
      ];

      setAISuggestions(suggestions);
      setShowAISuggestions(true);
      toast.success('AI suggestions generated successfully');
    } catch (error) {
      toast.error('Error generating AI suggestions');
      console.error('Error generating AI suggestions:', error);
    }
  };

  const handleApplyAISuggestion = (suggestionId) => {
    try {
      const suggestion = aiSuggestions.find(s => s.id === suggestionId);
      if (!suggestion) return;

      // Create a new node based on the suggestion
      const newNode = {
        id: `${suggestion.type}_${Date.now()}`,
        type: suggestion.type,
        position: { x: 100, y: 100 }, // Default position
        data: {
          label: `New ${suggestion.type}`,
          description: suggestion.description,
          // Add type-specific data
          ...(suggestion.type === 'delay' && {
            delayType: 'Fixed Time',
            duration: '1',
            durationType: 'hours'
          }),
          ...(suggestion.type === 'condition' && {
            conditionType: 'Email Activity',
            field: 'email_opened',
            operator: 'equals',
            value: 'true'
          }),
          ...(suggestion.type === 'aiAction' && {
            actionType: 'Personalize Message',
            content: ''
          }),
          ...(suggestion.type === 'action' && {
            actionType: 'Create Social Post',
            platform: 'all'
          })
        }
      };

      setNodes((nds) => [...nds, newNode]);
      
      // Remove the applied suggestion
      setAISuggestions(prev => prev.filter(s => s.id !== suggestionId));
      
      toast.success('AI suggestion applied successfully');
    } catch (error) {
      toast.error('Error applying AI suggestion');
      console.error('Error applying AI suggestion:', error);
    }
  };

  // Enhanced drag & drop handling
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = event.target.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      try {
        const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = nodeData.type;

        // Get the node type configuration
        const nodeConfig = nodeTypeConfigs[type];
        if (!nodeConfig) {
          toast.error('Invalid node type');
          return;
        }

        // Create the new node with proper configuration
        const newNode = {
          id: `${type}_${Date.now()}`,
          type,
          position,
          data: {
            ...nodeConfig.data,
            label: `New ${nodeConfig.label}`,
            description: '',
            // Add default values based on node type
            ...(type === 'trigger' && { 
              triggerType: '',
              scheduleType: '',
              selectedDays: [],
              triggers: [
                'Form Submission',
                'Calendar Booking',
                'Appointment Status Change',
                'Contact Created',
                'Contact Updated',
                'Tag Added',
                'Tag Removed',
                'Pipeline Stage Changed',
                'Opportunity Created',
                'Task Completed',
                'Website Visit',
                'Custom Webhook',
                'Scheduled',
                'Social Media Mention',
                'Email Open',
                'Link Click',
                'Lead Score Change'
              ],
              scheduleTypes: ['once', 'recurring', 'specific_days'],
              frequencies: ['hourly', 'daily', 'weekly', 'monthly']
            }),
            ...(type === 'action' && { actionType: '', emailTemplate: '', smsTemplate: '' }),
            ...(type === 'condition' && { conditionType: '', field: '', operator: '', value: '' }),
            ...(type === 'delay' && { delayType: '', duration: '', durationType: '' }),
            ...(type === 'integration' && { integrationType: '', webhookUrl: '', method: 'POST' })
          },
          sourceHandle: type === 'trigger' ? {
            type: 'source',
            position: 'right',
            style: { background: '#3b82f6' }
          } : undefined
        };

        setNodes((nds) => nds.concat(newNode));
        toast.success(`Added new ${nodeConfig.label} node`);
      } catch (error) {
        console.error('Error creating node:', error);
        toast.error('Failed to create node');
      }
    },
    [setNodes]
  );

  // Handle node deletion
  const onNodesDelete = useCallback((nodesToDelete) => {
    // Remove all edges connected to the deleted nodes
    setEdges((eds) => eds.filter((edge) => {
      return !nodesToDelete.some(
        (node) => node.id === edge.source || node.id === edge.target
      );
    }));
    
    // Clear selected node if it's being deleted
    if (nodesToDelete.some(node => node.id === selectedNode?.id)) {
      setSelectedNode(null);
    }

    toast.success('Node deleted');
  }, [selectedNode]);

  // Handle keyboard delete
  const onKeyDown = useCallback((event) => {
    if (selectedNode && (event.key === 'Delete' || event.key === 'Backspace')) {
      setNodes((nodes) => nodes.filter((node) => node.id !== selectedNode.id));
      setSelectedNode(null);
      toast.success('Node deleted');
    }
  }, [selectedNode, setNodes]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  const handleNodeUpdate = (nodeId, newData) => {
    if (!nodeId || !newData) {
      toast.error('Invalid node update data');
      return;
    }

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { 
            ...node, 
            data: { 
              ...(node.data || {}), 
              ...newData 
            } 
          };
        }
        return node;
      })
    );
  };

  const handleNodeDelete = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => eds.filter((edge) => 
        edge.source !== selectedNode.id && edge.target !== selectedNode.id
      ));
      setSelectedNode(null);
      toast.success('Node deleted successfully');
    }
  };

  const onDragStart = (event, nodeType) => {
    // Pass only the type property to avoid circular references
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType.type }));
    event.dataTransfer.effectAllowed = 'move';
  };

  // Add a testing mode function
  const handleTestWorkflow = async () => {
    try {
      if (!id) {
        toast.error('Please save the workflow first');
        return;
      }
      
      setIsTestMode(true);
      const results = await workflowService.testWorkflow(id);
      setTestResults(results);
      toast.success('Test completed successfully');
    } catch (error) {
      toast.error('Error testing workflow');
      console.error('Error testing workflow:', error);
    }
  };

  // Add these functions in the WorkflowBuilder component
  const handleSaveAsTemplate = async () => {
    try {
      if (!id) {
        toast.error('Please save the workflow first');
        return;
      }

      await workflowTemplateService.saveAsTemplate(id, {
        ...templateData,
        nodes,
        edges
      });
      
      toast.success('Workflow saved as template');
      setShowSaveAsTemplate(false);
    } catch (error) {
      toast.error('Error saving workflow as template');
      console.error('Error saving workflow as template:', error);
    }
  };

  // Add state for showing full analysis
  const [showAnalysis, setShowAnalysis] = useState(false);

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Workflow Name"
                className="border border-gray-300 rounded px-3 py-2"
              />
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Workflow
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleActivationToggle}
                className={`px-4 py-2 rounded ${
                  isActive
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                } text-white`}
              >
                {isActive ? 'Active' : 'Inactive'}
              </button>
              <button
                onClick={handleCreateVariant}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Create A/B Variant
              </button>
              <button
                onClick={handleGetAISuggestions}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Get AI Suggestions
              </button>
              <button
                onClick={handleTestWorkflow}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                Test Workflow
              </button>
              <button
                onClick={() => setShowTemplates(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Use Template
              </button>
              <button
                onClick={() => setShowSaveAsTemplate(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Save as Template
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={handleNodeClick}
            onNodesDelete={onNodesDelete}
            onDragOver={onDragOver}
            onDrop={onDrop}
            fitView
          >
            <Controls />
            <Background variant="dots" gap={12} size={1} />
            <Panel position="top-left">
              <div className="bg-white p-3 rounded shadow-lg">
                <h3 className="font-medium mb-2">Node Types</h3>
                <div className="space-y-2">
                  {Object.entries(nodeTypeConfigs).map(([type, config]) => (
                    <div
                      key={type}
                      className="flex items-center p-2 bg-gray-50 rounded cursor-move"
                      onDragStart={(event) =>
                        onDragStart(event, { type, ...config })
                      }
                      draggable
                    >
                      <span className="material-icons mr-2">{config.icon}</span>
                      {config.label}
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {selectedNode && (
        <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto">
          <NodeConfigPanel
            node={selectedNode}
            onUpdate={handleNodeUpdate}
            onDelete={handleNodeDelete}
          />
        </div>
      )}

      {isTestMode && testResults && (
        <div className="fixed bottom-0 right-0 w-96 bg-white border-l border-t border-gray-200 shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Test Results</h3>
            <button
              onClick={() => setIsTestMode(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="material-icons">close</span>
            </button>
          </div>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-2 rounded ${
                  result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}
              >
                <div className="font-medium">{result.node}</div>
                <div className="text-sm">{result.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Template selection modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <WorkflowTemplates
            onClose={() => setShowTemplates(false)}
          />
        </div>
      )}

      {/* Save as template modal */}
      {showSaveAsTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Save as Template</h2>
              <button
                onClick={() => setShowSaveAsTemplate(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Template Name</label>
                <input
                  type="text"
                  value={templateData.name}
                  onChange={(e) => setTemplateData({ ...templateData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter template name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={templateData.description}
                  onChange={(e) => setTemplateData({ ...templateData, description: e.target.value })}
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="Enter template description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={templateData.category}
                  onChange={(e) => setTemplateData({ ...templateData, category: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Select Category</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="customer_service">Customer Service</option>
                  <option value="onboarding">Onboarding</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Estimated Time</label>
                <input
                  type="text"
                  value={templateData.estimatedTime}
                  onChange={(e) => setTemplateData({ ...templateData, estimatedTime: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="e.g. 5 minutes"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSaveAsTemplate}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}

      {showAISuggestions && aiSuggestions.length > 0 && (
        <div className="fixed bottom-0 right-0 w-96 bg-white border-l border-t border-gray-200 shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">AI Suggestions</h3>
            <button
              onClick={() => setShowAISuggestions(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="material-icons">close</span>
            </button>
          </div>
          <div className="space-y-2">
            {aiSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">{suggestion.description}</p>
                <button
                  onClick={() => handleApplyAISuggestion(suggestion.id)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Apply Suggestion
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workflow Analysis Modal */}
      {showAnalysis && workflowAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Workflow Analysis</h2>
              <button
                onClick={() => setShowAnalysis(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                <p className="text-gray-700">{workflowAnalysis.summary}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Product Recommendations</h3>
                <div className="space-y-2">
                  {workflowAnalysis.productRecommendations?.map((rec, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium">{rec.product}</h4>
                      <p className="text-gray-600">{rec.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Suggested Improvements</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {workflowAnalysis.suggestions?.map((suggestion, index) => (
                    <li key={index} className="text-gray-700">{suggestion}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Target Audience Alignment</h3>
                <p className="text-gray-700">{workflowAnalysis.audienceAlignment}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder;
