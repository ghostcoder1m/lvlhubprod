import OpenAI from 'openai';

if (!process.env.REACT_APP_OPENAI_API_KEY) {
  console.error('OpenAI API key is not configured. Please add REACT_APP_OPENAI_API_KEY to your .env file.');
}

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const systemPrompt = `You are an expert marketing campaign strategist. Your task is to create comprehensive marketing campaigns that are engaging, effective, and data-driven. Consider the following aspects:
- Campaign structure and timing
- Target audience analysis
- Key messaging and value propositions
- Content strategy across channels
- Success metrics and KPIs`;

export const generateCampaign = async (campaignType, userIdeas, products) => {
  try {
    console.log('Generating campaign with:', { campaignType, userIdeas, products });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `Create a marketing campaign with the following details:
Campaign Type: ${campaignType}
User Ideas: ${userIdeas}
Available Products: ${JSON.stringify(products)}

Please provide a complete campaign structure including:
1. Campaign name
2. Target audience
3. Key messages (3-5 points)
4. Workflow steps (with timing)
5. Success metrics

The response should be a valid JSON object with the following structure:
{
  "name": "Campaign Name",
  "targetAudience": "Description of target audience",
  "keyMessages": ["Message 1", "Message 2", "Message 3"],
  "workflow": [
    {
      "name": "Step Name",
      "type": "email|social|notification",
      "delay": "Xd"
    }
  ],
  "metrics": ["Metric 1", "Metric 2"]
}`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    console.log('Generated campaign:', response);
    return response;
  } catch (error) {
    console.error('Error generating campaign:', error);
    if (error.response) {
      console.error('OpenAI API Error:', error.response.data);
    }
    throw new Error(error.message || 'Failed to generate campaign');
  }
};

export const generateEmailContent = async (campaign, step) => {
  try {
    console.log('Generating email content for:', { campaign: campaign.name, step: step.name });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `Create email content for the following campaign step:
Campaign: ${campaign.name}
Step: ${step.name}
Target Audience: ${campaign.targetAudience}
Key Messages: ${campaign.keyMessages.join(', ')}

The response should be a valid JSON object with the following structure:
{
  "subject": "Email subject line",
  "cta": "Call to action text",
  "keyPoints": ["Point 1", "Point 2", "Point 3"]
}`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    console.log('Generated email content:', response);
    return response;
  } catch (error) {
    console.error('Error generating email content:', error);
    if (error.response) {
      console.error('OpenAI API Error:', error.response.data);
    }
    throw new Error(error.message || 'Failed to generate email content');
  }
};

export const generateSocialContent = async (campaign, step) => {
  try {
    console.log('Generating social content for:', { campaign: campaign.name, step: step.name });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `Create social media content for the following campaign step:
Campaign: ${campaign.name}
Step: ${step.name}
Target Audience: ${campaign.targetAudience}
Key Messages: ${campaign.keyMessages.join(', ')}

The response should be a valid JSON object with the following structure:
{
  "text": "Social media post text",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "cta": "Call to action text"
}`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    console.log('Generated social content:', response);
    return response;
  } catch (error) {
    console.error('Error generating social content:', error);
    if (error.response) {
      console.error('OpenAI API Error:', error.response.data);
    }
    throw new Error(error.message || 'Failed to generate social content');
  }
}; 