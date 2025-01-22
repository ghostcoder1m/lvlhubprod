import React, { useState } from 'react';
import { toast } from 'react-toastify';
import oauthService from '../../services/oauthService';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import SyncIcon from '@mui/icons-material/Sync';

const platforms = [
  {
    id: 'facebook',
    name: 'Facebook',
    Icon: FacebookIcon,
    color: 'bg-blue-600',
    description: 'Connect your Facebook pages and Instagram accounts'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    Icon: InstagramIcon,
    color: 'bg-pink-600',
    description: 'Share photos and videos with your followers'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    Icon: TwitterIcon,
    color: 'bg-blue-400',
    description: 'Post tweets and engage with your audience'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    Icon: LinkedInIcon,
    color: 'bg-blue-700',
    description: 'Share professional updates and content'
  }
];

const AccountsSection = ({ accounts, onConnect }) => {
  const [connecting, setConnecting] = useState(null);

  const handleConnect = async (platform) => {
    try {
      setConnecting(platform);
      
      // Initialize OAuth flow
      const authUrl = oauthService.initializeOAuth(platform);
      
      // Open OAuth popup
      const width = 600;
      const height = 800;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        authUrl,
        'OAuth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Handle popup messages
      const handleMessage = async (event) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'social_auth_success') {
          window.removeEventListener('message', handleMessage);
          await onConnect(platform, event.data.authCode);
          setConnecting(null);
        }

        if (event.data.type === 'social_auth_error') {
          window.removeEventListener('message', handleMessage);
          setConnecting(null);
          toast.error(`Error connecting ${platform}: ${event.data.error}`);
        }
      };

      window.addEventListener('message', handleMessage);

      // Check if popup was closed
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          setConnecting(null);
        }
      }, 1000);

    } catch (error) {
      console.error('OAuth error:', error);
      setConnecting(null);
      toast.error(`Error connecting ${platform}: ${error.message}`);
    }
  };

  const handleDisconnect = async (platform, accountId) => {
    try {
      await oauthService.revokeAccess(platform, accountId);
      toast.success(`Disconnected ${platform} account`);
      // Refresh accounts list
      const updatedAccounts = await oauthService.getConnectedAccounts();
      onConnect(updatedAccounts);
    } catch (error) {
      console.error('Disconnect error:', error);
      toast.error(`Error disconnecting ${platform}: ${error.message}`);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Connected Accounts</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {platforms.map(platform => {
          const connectedAccount = accounts.find(acc => acc.platform === platform.id);
          const Icon = platform.Icon;
          
          return (
            <div
              key={platform.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${platform.color} rounded-full flex items-center justify-center`}>
                  <Icon className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{platform.name}</h3>
                  {connectedAccount ? (
                    <div className="text-sm text-gray-500">
                      {connectedAccount.username}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">{platform.description}</div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                {connectedAccount ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Connected
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleConnect(platform.id)}
                          className="p-1 text-gray-600 hover:text-gray-900"
                          title="Switch Account"
                        >
                          <SyncIcon fontSize="small" />
                        </button>
                        <button
                          onClick={() => handleDisconnect(platform.id, connectedAccount.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                          title="Disconnect Account"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.id)}
                    disabled={connecting === platform.id}
                    className={`w-full px-4 py-2 text-sm font-medium text-white ${platform.color} rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${platform.color} relative`}
                  >
                    {connecting === platform.id ? (
                      <>
                        <CircularProgress
                          size={20}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
                        />
                        <span className="pl-8">Connecting...</span>
                      </>
                    ) : (
                      `Connect ${platform.name}`
                    )}
                  </button>
                )}
              </div>

              {connectedAccount && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-gray-500">Followers</div>
                      <div className="font-medium text-gray-900">
                        {connectedAccount.stats?.followers?.toLocaleString() || '0'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Engagement</div>
                      <div className="font-medium text-gray-900">
                        {(connectedAccount.stats?.engagement || 0).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Last synced: {new Date(connectedAccount.lastSynced).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccountsSection; 