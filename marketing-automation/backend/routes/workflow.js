const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// In-memory storage for workflows (replace with database in production)
let workflows = [];
let workflowIdCounter = 1;

// Create workflow
router.post('/workflows', (req, res) => {
  try {
    const workflow = {
      id: workflowIdCounter++,
      ...req.body,
      created_at: new Date(),
      updated_at: new Date()
    };
    workflows.push(workflow);
    res.status(201).json(workflow);
  } catch (error) {
    console.error('Error creating workflow:', error);
    res.status(500).json({ error: 'Error creating workflow' });
  }
});

// Get workflow by ID
router.get('/workflows/:id', (req, res) => {
  try {
    const workflow = workflows.find(w => w.id === parseInt(req.params.id));
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    res.json(workflow);
  } catch (error) {
    console.error('Error getting workflow:', error);
    res.status(500).json({ error: 'Error getting workflow' });
  }
});

// Update workflow
router.put('/workflows/:id', (req, res) => {
  try {
    const index = workflows.findIndex(w => w.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    workflows[index] = {
      ...workflows[index],
      ...req.body,
      updated_at: new Date()
    };
    res.json(workflows[index]);
  } catch (error) {
    console.error('Error updating workflow:', error);
    res.status(500).json({ error: 'Error updating workflow' });
  }
});

// Delete workflow
router.delete('/workflows/:id', (req, res) => {
  try {
    const index = workflows.findIndex(w => w.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    workflows.splice(index, 1);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting workflow:', error);
    res.status(500).json({ error: 'Error deleting workflow' });
  }
});

// List all workflows
router.get('/workflows', (req, res) => {
  try {
    res.json(workflows);
  } catch (error) {
    console.error('Error listing workflows:', error);
    res.status(500).json({ error: 'Error listing workflows' });
  }
});

// Analyze workflow with OpenAI
router.post('/analyze-workflow', async (req, res) => {
  try {
    const { workflow, products } = req.body;

    // Create a detailed prompt for OpenAI
    const prompt = `Analyze this marketing automation workflow and provide recommendations based on the available products:

Workflow Details:
Name: ${workflow.name}
Description: ${workflow.description}
Number of steps: ${workflow.nodes.length}

Workflow Structure:
${workflow.nodes.map(node => `- ${node.type}: ${node.data.label}`).join('\n')}

Available Products:
${products.map(product => `
Product: ${product.name}
Description: ${product.description}
Category: ${product.category}
Target Audience: ${product.targetAudience}
Keywords: ${product.keywords}
`).join('\n')}

Please provide:
1. A brief summary of the workflow
2. Specific recommendations for each product
3. Suggested improvements for the workflow
4. Analysis of how well the workflow aligns with the target audience of the products

Format the response as JSON with the following structure:
{
  "summary": "brief workflow summary",
  "productRecommendations": [
    { "product": "product name", "recommendation": "specific recommendation" }
  ],
  "suggestions": ["improvement 1", "improvement 2"],
  "audienceAlignment": "analysis of audience alignment"
}`;

    // Call OpenAI API
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a marketing automation expert that analyzes workflows and provides recommendations based on products and their target audiences."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    // Parse the response
    const analysis = JSON.parse(completion.data.choices[0].message.content);

    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing workflow:', error);
    res.status(500).json({ error: 'Error analyzing workflow' });
  }
});

module.exports = router; 