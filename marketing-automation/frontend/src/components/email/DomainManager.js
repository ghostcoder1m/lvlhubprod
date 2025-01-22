import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const DomainManager = () => {
  const [domains, setDomains] = useState([]);
  const [newDomain, setNewDomain] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load domains from localStorage
    const storedDomains = JSON.parse(localStorage.getItem('mailgun_domains') || '[]');
    setDomains(storedDomains);
  }, []);

  const handleAddDomain = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/email/domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: newDomain }),
      });

      const data = await response.json();

      if (data.success) {
        setDomains(prev => [...prev, data.domain]);
        setNewDomain('');
        toast.success('Domain added successfully');
        setSelectedDomain(data.domain);
      } else {
        toast.error(data.error || 'Failed to add domain');
      }
    } catch (error) {
      toast.error('Error adding domain');
      console.error('Error adding domain:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyDomain = async (domainName) => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/email/domains/${domainName}/verify`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setDomains(prev => 
          prev.map(d => d.name === domainName ? { ...d, status: data.isVerified ? 'verified' : 'pending' } : d)
        );
        
        if (data.isVerified) {
          toast.success('Domain verified successfully');
        } else {
          toast.info('Domain verification pending. Please check DNS records.');
        }
      } else {
        toast.error(data.error || 'Failed to verify domain');
      }
    } catch (error) {
      toast.error('Error verifying domain');
      console.error('Error verifying domain:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Domain Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Add New Domain</h2>
        <form onSubmit={handleAddDomain} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domain Name
            </label>
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="e.g., marketing.yourcompany.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Adding...' : 'Add Domain'}
          </button>
        </form>
      </div>

      {/* Domains List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Your Domains</h2>
          <div className="space-y-4">
            {domains.map((domain) => (
              <div
                key={domain.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{domain.name}</h3>
                    <p className="text-sm text-gray-500">
                      Added on {new Date(domain.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      domain.status === 'verified'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {domain.status === 'verified' ? 'Verified' : 'Pending'}
                  </span>
                </div>

                {domain.status !== 'verified' && (
                  <div className="mt-4">
                    <button
                      onClick={() => setSelectedDomain(domain)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      View DNS Records
                    </button>
                    <button
                      onClick={() => handleVerifyDomain(domain.name)}
                      className="ml-4 text-green-600 hover:text-green-800"
                    >
                      Verify Domain
                    </button>
                  </div>
                )}
              </div>
            ))}

            {domains.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No domains added yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DNS Records Modal */}
      {selectedDomain && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">DNS Records for {selectedDomain.name}</h2>
              <button
                onClick={() => setSelectedDomain(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Add these DNS records to your domain's DNS settings to verify ownership:
              </p>

              {selectedDomain.dnsRecords.map((record, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Type</p>
                      <p className="text-sm">{record.record_type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Name</p>
                      <p className="text-sm">{record.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Value</p>
                      <p className="text-sm break-all">{record.value}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => handleVerifyDomain(selectedDomain.name)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Verify Domain
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainManager; 