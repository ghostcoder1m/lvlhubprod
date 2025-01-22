import React, { useState, useEffect } from 'react';

const EmailPreview = ({ 
  template, 
  isEditing, 
  onEdit, 
  onSave, 
  onSaveTemplate, 
  onTemplateChange 
}) => {
  const [activeView, setActiveView] = useState('inbox');

  // Ensure template has all required fields and handle updates
  const safeTemplate = {
    subject: template?.subject || 'No Subject',
    preview: template?.preview || 'No preview available',
    body: template?.body || 'No content',
    cta: template?.cta || 'Click here'
  };

  // Reset to inbox view when a new template is received
  useEffect(() => {
    setActiveView('inbox');
  }, [template]);

  const handleBodyChange = (e) => {
    if (isEditing) {
      onTemplateChange({
        ...safeTemplate,
        body: e.target.innerText
      });
    }
  };

  return (
    <div className="w-full">
      {/* View Controls */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setActiveView('inbox')}
          className={`px-4 py-2 rounded ${activeView === 'inbox' ? 'bg-[#1a73e8] text-white' : 'bg-gray-100'}`}
        >
          Inbox View
        </button>
        <button
          onClick={() => setActiveView('compose')}
          className={`px-4 py-2 rounded ${activeView === 'compose' ? 'bg-[#1a73e8] text-white' : 'bg-gray-100'}`}
        >
          Compose View
        </button>
        <button
          onClick={() => setActiveView('open')}
          className={`px-4 py-2 rounded ${activeView === 'open' ? 'bg-[#1a73e8] text-white' : 'bg-gray-100'}`}
        >
          Open View
        </button>
      </div>

      {/* Preview Area */}
      <div className="bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
        {/* Inbox View */}
        {activeView === 'inbox' && (
          <div className="border-b hover:shadow-md cursor-pointer transition-shadow duration-150 ease-in-out">
            <div className="flex items-center px-4 py-2">
              <div className="w-6 flex items-center justify-center mr-4">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-[#1a73e8]" />
              </div>
              <div className="w-6 flex items-center justify-center mr-4">
                <span className="material-icons text-gray-600">star_border</span>
              </div>
              <div className="flex-1 flex items-center min-w-0">
                <div className="w-48 font-medium truncate">Company Name</div>
                <div className="flex-1 truncate">
                  <span className="font-medium">{safeTemplate.subject}</span>
                  <span className="text-gray-600 mx-1">-</span>
                  <span className="text-gray-600">{safeTemplate.preview}</span>
                </div>
                <div className="ml-4 text-sm text-gray-600 whitespace-nowrap">3:45 PM</div>
              </div>
            </div>
          </div>
        )}

        {/* Compose View */}
        {activeView === 'compose' && (
          <div>
            <div className="bg-[#404040] text-white px-3 py-2 rounded-t-lg flex justify-between items-center">
              <h2 className="text-sm">New Message</h2>
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-[#505050] rounded">
                  <span className="material-icons text-sm">minimize</span>
                </button>
                <button className="p-1 hover:bg-[#505050] rounded">
                  <span className="material-icons text-sm">open_in_full</span>
                </button>
                <button className="p-1 hover:bg-[#505050] rounded">
                  <span className="material-icons text-sm">close</span>
                </button>
              </div>
            </div>
            <div>
              <div className="border-b">
                <div className="flex items-center px-4 py-2">
                  <span className="text-sm text-gray-600 w-12">To</span>
                  <input type="text" className="flex-1 outline-none text-sm" placeholder="Recipients" />
                </div>
              </div>
              <div className="border-b">
                <div className="flex items-center px-4 py-2">
                  <span className="text-sm text-gray-600 w-12">Subject</span>
                  <input 
                    type="text" 
                    className="flex-1 outline-none text-sm" 
                    value={safeTemplate.subject}
                    onChange={(e) => isEditing && onTemplateChange({...safeTemplate, subject: e.target.value})}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div className="p-4">
                <div 
                  className="min-h-[200px] text-sm whitespace-pre-wrap"
                  contentEditable={isEditing}
                  onBlur={(e) => handleBodyChange(e)}
                  suppressContentEditableWarning={true}
                >
                  {safeTemplate.body}
                </div>
              </div>
              <div className="border-t bg-gray-50 p-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="bg-[#1a73e8] text-white px-6 py-2 rounded text-sm">Send</button>
                  <button className="p-2 hover:bg-gray-200 rounded">
                    <span className="material-icons">format_bold</span>
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded">
                    <span className="material-icons">attach_file</span>
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded">
                    <span className="material-icons">insert_link</span>
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded">
                    <span className="material-icons">mood</span>
                  </button>
                </div>
                <button className="p-2 hover:bg-gray-200 rounded">
                  <span className="material-icons">delete</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Open View */}
        {activeView === 'open' && (
          <div>
            <div className="p-6">
              <h1 className="text-2xl font-normal mb-6">{safeTemplate.subject}</h1>
              <div className="flex items-start mb-6">
                <div className="w-10 h-10 rounded-full bg-[#1a73e8] flex items-center justify-center text-white text-lg font-medium mr-4">
                  C
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">Company Name</span>
                    <span className="text-gray-600 ml-2">&lt;company@example.com&gt;</span>
                  </div>
                  <div className="text-gray-600 text-sm">to me</div>
                </div>
              </div>
              <div className="prose max-w-none">
                <div className="text-gray-800 whitespace-pre-wrap">{safeTemplate.body}</div>
                {safeTemplate.cta && (
                  <div className="mt-6">
                    <button className="bg-[#1a73e8] text-white px-6 py-2 rounded hover:bg-[#1557b0] text-sm">
                      {safeTemplate.cta}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-800">
                <span className="material-icons">reply</span>
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                <span className="material-icons">forward</span>
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                <span className="material-icons">star_border</span>
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                <span className="material-icons">more_vert</span>
              </button>
            </div>
          </div>
        )}

        {/* Edit Controls */}
        <div className="flex justify-end space-x-2 p-4 border-t">
          {isEditing ? (
            <button
              onClick={onSave}
              className="bg-[#1a73e8] text-white px-4 py-2 rounded hover:bg-[#1557b0] flex items-center text-sm"
            >
              <span className="material-icons text-[18px] mr-1">save</span>
              Save Changes
            </button>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="bg-[#1a73e8] text-white px-4 py-2 rounded hover:bg-[#1557b0] flex items-center text-sm"
              >
                <span className="material-icons text-[18px] mr-1">edit</span>
                Edit
              </button>
              <button
                onClick={onSaveTemplate}
                className="bg-[#1a73e8] text-white px-4 py-2 rounded hover:bg-[#1557b0] flex items-center text-sm"
              >
                <span className="material-icons text-[18px] mr-1">save</span>
                Save Template
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailPreview; 