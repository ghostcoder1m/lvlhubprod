import React from 'react';

const platforms = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'facebook',
    color: 'bg-blue-600'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'instagram',
    color: 'bg-pink-600'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: 'twitter',
    color: 'bg-blue-400'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'linkedin',
    color: 'bg-blue-700'
  }
];

const AccountsSection = ({ accounts, onConnect }) => {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Connected Accounts</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {platforms.map(platform => {
          const connectedAccount = accounts.find(acc => acc.platform === platform.id);
          
          return (
            <div
              key={platform.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${platform.color} rounded-full flex items-center justify-center`}>
                  <span className="material-icons text-white">{platform.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{platform.name}</h3>
                  {connectedAccount ? (
                    <div className="text-sm text-gray-500">
                      {connectedAccount.username}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Not connected</div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                {connectedAccount ? (
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Connected
                    </span>
                    <button
                      onClick={() => onConnect(platform.id)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Switch Account
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onConnect(platform.id)}
                    className={`w-full px-4 py-2 text-sm font-medium text-white ${platform.color} rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${platform.color}`}
                  >
                    Connect {platform.name}
                  </button>
                )}
              </div>

              {connectedAccount && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-gray-500">Followers</div>
                      <div className="font-medium text-gray-900">
                        {connectedAccount.stats?.followers?.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Engagement</div>
                      <div className="font-medium text-gray-900">
                        {connectedAccount.stats?.engagement?.toFixed(1)}%
                      </div>
                    </div>
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