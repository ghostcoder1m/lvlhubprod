import React from 'react';
import { Link } from 'react-router-dom';

const Workflows = () => {
  // Get workflows from localStorage
  const workflows = JSON.parse(localStorage.getItem('workflows') || '[]');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Workflows</h1>
        <Link
          to="/workflow-builder"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Workflow
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-4"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{workflow.name}</h2>
                <p className="text-sm text-gray-500">
                  Last updated: {new Date(workflow.updated_at).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  workflow.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {workflow.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {workflow.description || 'No description'}
            </p>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {workflow.nodes?.length || 0} nodes • {workflow.edges?.length || 0} connections
              </div>
              <Link
                to={`/workflow-builder/${workflow.id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit Workflow
              </Link>
            </div>
          </div>
        ))}

        {workflows.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <span className="material-icons text-4xl">workflow</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows yet</h3>
            <p className="text-gray-500">Create your first workflow to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workflows; 