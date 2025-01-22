import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import oauthService from '../../services/oauthService';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';

const OAuthCallback = () => {
  const { platform } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        setStatus('processing');
        const params = Object.fromEntries(new URLSearchParams(location.search));
        
        // Handle the OAuth callback
        await oauthService.handleCallback(platform, params);
        
        setStatus('success');
        toast.success(`Successfully connected ${platform} account`);

        // Close the popup if we're in one
        if (window.opener) {
          window.opener.postMessage({
            type: 'social_auth_success',
            platform,
            authCode: params.code
          }, window.location.origin);
          window.close();
        } else {
          // If not in popup, redirect to social media dashboard
          navigate('/social-media');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        toast.error(`Error connecting ${platform} account: ${error.message}`);
        
        // Close popup with error
        if (window.opener) {
          window.opener.postMessage({
            type: 'social_auth_error',
            platform,
            error: error.message
          }, window.location.origin);
          window.close();
        }
      }
    };

    handleOAuthCallback();
  }, [platform, location.search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6">
        <div className="text-center">
          {status === 'processing' && (
            <>
              <CircularProgress
                size={48}
                className="mb-4 text-blue-500"
              />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Connecting {platform}
              </h2>
              <p className="text-gray-600">
                Please wait while we complete the connection...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircleIcon
                className="w-12 h-12 mx-auto mb-4 text-green-500"
              />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Successfully Connected!
              </h2>
              <p className="text-gray-600">
                You can now close this window and return to the dashboard.
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <ErrorIcon
                className="w-12 h-12 mx-auto mb-4 text-red-500"
              />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Connection Failed
              </h2>
              <p className="text-gray-600 mb-4">
                There was an error connecting your {platform} account.
                Please try again.
              </p>
              <button
                onClick={() => window.close()}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <CloseIcon className="w-4 h-4 mr-2" />
                Close Window
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback; 