import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AuthTest = () => {
  const { user, login, loginWithGoogle, logout } = useAuth();
  const [testResult, setTestResult] = useState(null);

  const runAuthTest = async () => {
    try {
      // Test 1: Login with email/password
      setTestResult('Testing email/password login...');
      await login('test@example.com', 'password123');
      setTestResult('Email/password login successful');

      // Wait 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Test 2: Get user profile
      setTestResult('Fetching user profile...');
      if (user) {
        setTestResult(`User profile loaded: ${user.email}`);
      }

      // Wait 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Test 3: Logout
      setTestResult('Testing logout...');
      await logout();
      setTestResult('Logout successful');

      // Wait 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Test 4: Google login
      setTestResult('Testing Google login...');
      await loginWithGoogle();
      setTestResult('Google login successful');

    } catch (error) {
      setTestResult(`Test failed: ${error.message}`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Auth System Test</h2>
      <div className="mb-4">
        <button
          onClick={runAuthTest}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Run Auth Test
        </button>
      </div>
      <div className="mt-4">
        <h3 className="font-bold">Test Results:</h3>
        <pre className="bg-gray-100 p-4 rounded mt-2">
          {testResult || 'No tests run yet'}
        </pre>
      </div>
      <div className="mt-4">
        <h3 className="font-bold">Current User:</h3>
        <pre className="bg-gray-100 p-4 rounded mt-2">
          {user ? JSON.stringify(user, null, 2) : 'No user logged in'}
        </pre>
      </div>
    </div>
  );
};

export default AuthTest; 