import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import socialMediaService from '../services/socialMediaService';

// Components
import AccountsSection from '../components/social/AccountsSection';
import PostComposer from '../components/social/PostComposer';
import ContentCalendar from '../components/social/ContentCalendar';
import Analytics from '../components/social/Analytics';
import MediaLibrary from '../components/social/MediaLibrary';
import Monitoring from '../components/social/Monitoring';
import Automations from '../components/social/Automations';

const SocialMedia = () => {
  // State management
  const [activeTab, setActiveTab] = useState('compose');
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [automations, setAutomations] = useState([]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const accounts = await socialMediaService.getConnectedAccounts();
        setConnectedAccounts(accounts);

        const posts = await socialMediaService.getScheduledPosts();
        setScheduledPosts(posts);

        const media = await socialMediaService.getMediaLibrary();
        setMediaLibrary(media);

        const notifs = await socialMediaService.getNotifications();
        setNotifications(notifs);

        const autos = await socialMediaService.getAutomations();
        setAutomations(autos);

        // Load analytics for each connected account
        const analyticsData = {};
        for (const account of accounts) {
          const accountAnalytics = await socialMediaService.getAccountAnalytics(account.id);
          analyticsData[account.id] = accountAnalytics;
        }
        setAnalytics(analyticsData);
      } catch (error) {
        toast.error('Error loading social media data');
        console.error('Error loading social media data:', error);
      }
    };

    loadData();
  }, []);

  // Handle account connection
  const handleConnectAccount = async (platform) => {
    try {
      // Implement OAuth flow
      const authWindow = window.open(
        `${process.env.REACT_APP_API_URL}/social/auth/${platform}`,
        'Auth',
        'width=600,height=800'
      );

      window.addEventListener('message', async (event) => {
        if (event.data.type === 'social_auth_success') {
          const { authCode } = event.data;
          const account = await socialMediaService.connectAccount(platform, authCode);
          setConnectedAccounts(prev => [...prev, account]);
          toast.success(`Connected ${platform} account successfully`);
          authWindow.close();
        }
      });
    } catch (error) {
      toast.error(`Error connecting ${platform} account`);
      console.error('Error connecting account:', error);
    }
  };

  // Handle post creation and scheduling
  const handleCreatePost = async (postData) => {
    try {
      const post = await socialMediaService.createPost(postData);
      if (postData.schedule) {
        await socialMediaService.schedulePost(post.id, postData.schedule);
        setScheduledPosts(prev => [...prev, { ...post, schedule: postData.schedule }]);
        toast.success('Post scheduled successfully');
      } else {
        toast.success('Post created successfully');
      }
    } catch (error) {
      toast.error('Error creating post');
      console.error('Error creating post:', error);
    }
  };

  // Handle media upload
  const handleMediaUpload = async (file, metadata) => {
    try {
      const media = await socialMediaService.uploadMedia(file, metadata);
      setMediaLibrary(prev => [...prev, media]);
      toast.success('Media uploaded successfully');
      return media;
    } catch (error) {
      toast.error('Error uploading media');
      console.error('Error uploading media:', error);
      throw error;
    }
  };

  // Handle automation creation
  const handleCreateAutomation = async (automationData) => {
    try {
      const automation = await socialMediaService.createAutomation(automationData);
      setAutomations(prev => [...prev, automation]);
      toast.success('Automation created successfully');
    } catch (error) {
      toast.error('Error creating automation');
      console.error('Error creating automation:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h1 className="text-2xl font-semibold text-gray-900">Social Media Management</h1>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4 px-4">
          {[
            { id: 'compose', label: 'Compose' },
            { id: 'calendar', label: 'Calendar' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'library', label: 'Media Library' },
            { id: 'monitoring', label: 'Monitoring' },
            { id: 'automations', label: 'Automations' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="w-full px-6 py-4">
          {/* Connected Accounts */}
          <AccountsSection
            accounts={connectedAccounts}
            onConnect={handleConnectAccount}
          />

          {/* Tab Content */}
          <div className="mt-6 w-full">
            {activeTab === 'compose' && (
              <PostComposer
                accounts={connectedAccounts}
                onCreatePost={handleCreatePost}
                onUploadMedia={handleMediaUpload}
              />
            )}

            {activeTab === 'calendar' && (
              <ContentCalendar
                posts={scheduledPosts}
                onUpdatePost={(postId, data) => {
                  // Handle post update
                }}
                onDeletePost={(postId) => {
                  // Handle post deletion
                }}
              />
            )}

            {activeTab === 'analytics' && (
              <Analytics
                accounts={connectedAccounts}
                analytics={analytics}
              />
            )}

            {activeTab === 'library' && (
              <MediaLibrary
                media={mediaLibrary}
                onUpload={handleMediaUpload}
                onDelete={(mediaId) => {
                  // Handle media deletion
                }}
              />
            )}

            {activeTab === 'monitoring' && (
              <Monitoring
                accounts={connectedAccounts}
                notifications={notifications}
              />
            )}

            {activeTab === 'automations' && (
              <Automations
                automations={automations}
                onCreate={handleCreateAutomation}
                onToggle={(automationId, enabled) => {
                  // Handle automation toggle
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia; 