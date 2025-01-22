import React, { useState, useEffect } from 'react';
import { generateCampaign, generateEmailContent, generateSocialContent } from '../../services/aiService';
import { Link } from 'react-router-dom';

const AICampaignCreator = ({ onClose, onCampaignCreate }) => {
  const [step, setStep] = useState('initial');
  const [campaignType, setCampaignType] = useState(null);
  const [userIdeas, setUserIdeas] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCampaign, setGeneratedCampaign] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load products from localStorage
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(storedProducts);
  }, []);

  if (products.length === 0) {
    return (
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Create Campaign</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="material-icons text-gray-600">close</span>
            </button>
          </div>
          
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-icons text-indigo-400 text-2xl">inventory_2</span>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Products Available</h3>
            <p className="text-gray-600 mb-6">
              You need to add at least one product before creating a campaign. Products are essential for generating targeted marketing campaigns.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <Link
                to="/products"
                className="px-4 py-2 bg-indigo-400 text-white rounded-lg hover:bg-indigo-500 transition-colors"
              >
                Manage Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const campaignTypes = [
    {
      id: 'product_launch',
      title: 'Product Launch',
      icon: 'rocket_launch',
      description: 'Launch a new product or feature with targeted messaging and promotions'
    },
    {
      id: 'engagement',
      title: 'Customer Engagement',
      icon: 'people',
      description: 'Re-engage existing customers with personalized content and offers'
    },
    {
      id: 'promotional',
      title: 'Promotional Campaign',
      icon: 'local_offer',
      description: 'Create time-sensitive offers and promotions to drive sales'
    },
    {
      id: 'educational',
      title: 'Educational Content',
      icon: 'school',
      description: 'Share valuable insights and establish thought leadership'
    }
  ];

  const handleGenerateCampaign = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Generate the campaign structure
      const campaign = await generateCampaign(campaignType, userIdeas, products);

      // Generate content for each step
      const enrichedWorkflow = await Promise.all(
        campaign.workflow.map(async (step) => {
          let content;
          if (step.type === 'email') {
            content = await generateEmailContent(campaign, step);
          } else if (step.type === 'social') {
            content = await generateSocialContent(campaign, step);
          }
          return { ...step, content };
        })
      );

      setGeneratedCampaign({ ...campaign, workflow: enrichedWorkflow });
      setStep('review');
    } catch (err) {
      setError('Failed to generate campaign. Please try again.');
      console.error('Campaign generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">AI Campaign Creator</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="material-icons text-gray-600">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {step === 'initial' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-gray-600 mb-4">
                <span className="material-icons text-indigo-400">inventory_2</span>
                <span>{products.length} products available for campaign creation</span>
              </div>
              <p className="text-gray-600">
                Let AI help you create a campaign. Choose a campaign type to get started:
              </p>
              <div className="grid grid-cols-2 gap-4">
                {campaignTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setCampaignType(type.id);
                      setStep('ideation');
                    }}
                    className={`p-4 border rounded-xl text-left hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors ${
                      campaignType === type.id ? 'border-indigo-400 bg-indigo-50/50' : 'border-gray-200'
                    }`}
                  >
                    <span className="material-icons text-indigo-400 mb-2">{type.icon}</span>
                    <h3 className="font-medium text-gray-800 mb-1">{type.title}</h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'ideation' && (
            <div className="space-y-6">
              <div className="bg-indigo-50/50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Available Products</h3>
                <div className="space-y-2">
                  {products.map((product, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="material-icons text-indigo-400 text-sm">check_circle</span>
                      <span>{product.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-gray-600">
                Share any specific ideas or requirements for your campaign. AI will consider these while creating your campaign:
              </p>
              <textarea
                value={userIdeas}
                onChange={(e) => setUserIdeas(e.target.value)}
                placeholder="E.g., Target audience, key messages, specific products to promote, timing considerations..."
                className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
              />
              <button
                onClick={handleGenerateCampaign}
                disabled={isGenerating}
                className="w-full py-3 bg-indigo-400 text-white rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <span className="material-icons animate-spin mr-2">refresh</span>
                    Generating Campaign...
                  </span>
                ) : (
                  'Generate Campaign'
                )}
              </button>
            </div>
          )}

          {step === 'review' && generatedCampaign && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-800">Campaign Overview</h3>
                  <span className="text-sm text-gray-600">
                    {generatedCampaign.workflow.length} steps
                  </span>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg space-y-4">
                  <h4 className="font-medium text-indigo-400 mb-2">{generatedCampaign.name}</h4>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-medium text-gray-700 mb-2">Target Audience</h5>
                    <p className="text-sm text-gray-600">{generatedCampaign.targetAudience}</p>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Key Messages</h5>
                    <ul className="space-y-2">
                      {generatedCampaign.keyMessages.map((message, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                          <span className="material-icons text-indigo-400 text-sm">arrow_right</span>
                          <span>{message}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Workflow</h5>
                    <div className="space-y-4">
                      {generatedCampaign.workflow.map((step, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                            <span className="material-icons text-indigo-400 text-sm">
                              {step.type === 'email' ? 'email' : step.type === 'social' ? 'share' : 'notifications'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-800">{step.name}</p>
                              <span className="text-sm text-gray-500">Delay: {step.delay}</span>
                            </div>
                            {step.content && (
                              <div className="mt-2 text-sm text-gray-600">
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
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Success Metrics</h5>
                    <ul className="space-y-2">
                      {generatedCampaign.metrics.map((metric, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className="material-icons text-indigo-400 text-sm">analytics</span>
                          <span>{metric}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setStep('ideation')}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Regenerate
                </button>
                <button
                  onClick={() => onCampaignCreate(generatedCampaign)}
                  className="flex-1 py-3 bg-indigo-400 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AICampaignCreator; 