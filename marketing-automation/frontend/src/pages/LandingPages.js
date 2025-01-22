import React, { useState, useEffect } from 'react';
import 'material-icons/iconfont/material-icons.css';

const LandingPages = () => {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'SaaS Website',
      category: 'business',
      thumbnail: 'https://via.placeholder.com/300x200',
      views: 1250,
      conversions: 125,
      conversionRate: '10%',
      pages: ['Home', 'Features', 'Pricing', 'Contact']
    },
    {
      id: 2,
      name: 'E-commerce Store',
      category: 'commerce',
      thumbnail: 'https://via.placeholder.com/300x200',
      views: 2500,
      conversions: 500,
      conversionRate: '20%',
      pages: ['Home', 'Products', 'Cart', 'Checkout']
    },
    {
      id: 3,
      name: 'Portfolio Site',
      category: 'personal',
      thumbnail: 'https://via.placeholder.com/300x200',
      views: 3000,
      conversions: 900,
      conversionRate: '30%',
      pages: ['Home', 'Projects', 'About', 'Contact']
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showBuilder, setShowBuilder] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [pages, setPages] = useState([{ id: 'home', name: 'Home', elements: [] }]);
  const [showStyleEditor, setShowStyleEditor] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [globalStyles] = useState({
    colors: {
      primary: '#4F46E5',
      secondary: '#10B981',
      accent: '#F59E0B',
      text: '#111827',
      background: '#FFFFFF'
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      baseSize: '16px'
    }
  });

  const elements = {
    layout: [
      {
        type: 'animated_background',
        label: 'Animated Background',
        icon: 'waves',
        defaultContent: {
          type: 'gradient_wave',
          speed: 'normal',
          colors: ['#4F46E5', '#9333EA']
        },
        defaultStyles: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1
        }
      },
      {
        type: 'container',
        label: 'Container',
        icon: 'crop_landscape',
        defaultStyles: {
          padding: '2rem',
          margin: '0 auto',
          maxWidth: '1200px',
          width: '100%'
        }
      },
      {
        type: 'section',
        label: 'Section',
        icon: 'dashboard',
        defaultStyles: {
          padding: '4rem 0',
          width: '100%',
          position: 'relative'
        }
      }
    ],
    content: [
      {
        type: 'heading',
        label: 'Heading',
        icon: 'title',
        defaultContent: 'Add Your Heading',
        defaultStyles: {
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#111827'
        }
      },
      {
        type: 'text',
        label: 'Text',
        icon: 'text_fields',
        defaultContent: 'Add your text content here',
        defaultStyles: {
          fontSize: '1rem',
          lineHeight: '1.5',
          color: '#4B5563'
        }
      },
      {
        type: 'button',
        label: 'Button',
        icon: 'smart_button',
        defaultContent: 'Click Me',
        defaultStyles: {
          padding: '0.75rem 1.5rem',
          backgroundColor: '#4F46E5',
          color: 'white',
          borderRadius: '0.375rem',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'inline-block'
        }
      }
    ],
    media: [
      {
        type: 'image',
        label: 'Image',
        icon: 'image',
        defaultContent: 'https://via.placeholder.com/400x300',
        defaultStyles: {
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '0.5rem'
        }
      },
      {
        type: 'video',
        label: 'Video',
        icon: 'videocam',
        defaultContent: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        defaultStyles: {
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: '0.5rem'
        }
      }
    ],
    interactive: [
      {
        type: 'form',
        label: 'Form',
        icon: 'dynamic_form',
        defaultContent: {
          fields: [
            { type: 'text', label: 'Name', placeholder: 'Enter your name' },
            { type: 'email', label: 'Email', placeholder: 'Enter your email' }
          ],
          submitText: 'Submit'
        },
        defaultStyles: {
          padding: '1.5rem',
          backgroundColor: '#F9FAFB',
          borderRadius: '0.5rem'
        }
      }
    ]
  };

  const handleDragStart = (e, element) => {
    e.dataTransfer.setData('element', JSON.stringify(element));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const element = JSON.parse(e.dataTransfer.getData('element'));
    
    // Find the element configuration from the appropriate category
    let elementConfig = null;
    Object.values(elements).forEach(category => {
      const found = category.find(e => e.type === element.type);
      if (found) elementConfig = found;
    });
    
    const newElement = {
      ...element,
      id: Date.now(),
      styles: elementConfig?.defaultStyles || {},
      content: elementConfig?.defaultContent || ''
    };

    const updatedPages = pages.map(page => {
      if (page.id === currentPage) {
        return {
          ...page,
          elements: [...page.elements, newElement]
        };
      }
      return page;
    });

    setPages(updatedPages);
    setSelectedElement(newElement);
    setShowStyleEditor(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const getDefaultContent = (type) => {
    const element = elements.find(e => e.type === type);
    return element?.defaultContent || '';
  };

  const handleExitBuilder = () => {
    const userConfirmed = window.confirm('Are you sure you want to exit? Any unsaved changes will be lost.');
    if (userConfirmed) {
      setShowBuilder(false);
      setSelectedElement(null);
      setShowStyleEditor(false);
    }
  };

  const renderElementContent = (element) => {
    switch (element.type) {
      case 'animated_background':
        return (
          <div 
            style={{
              ...element.styles,
              background: `linear-gradient(45deg, ${element.content.colors[0]}, ${element.content.colors[1]})`,
              backgroundSize: '400% 400%',
              animation: `gradient ${element.content.speed === 'slow' ? '15s' : element.content.speed === 'fast' ? '5s' : '10s'} ease infinite`
            }}
          />
        );
      case 'heading':
        return <h2 style={element.styles}>{element.content}</h2>;
      case 'text':
        return <p style={element.styles}>{element.content}</p>;
      case 'button':
        return <button style={element.styles}>{element.content}</button>;
      case 'image':
        return <img src={element.content} alt="Content" style={element.styles} />;
      case 'video':
        return (
          <iframe
            src={element.content}
            style={element.styles}
            allowFullScreen
            title="Video content"
          />
        );
      case 'form':
        return (
          <form style={element.styles} onSubmit={(e) => e.preventDefault()}>
            {element.content.fields.map((field, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            >
              {element.content.submitText}
            </button>
          </form>
        );
      case 'container':
      case 'section':
        return (
          <div style={element.styles}>
            {element.content && element.content.children?.map(child => 
              renderElementContent(child)
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderBuilder = () => (
    <div className="flex h-[calc(100vh-12rem)]">
      {/* Elements Panel */}
      {renderElementsPanel()}

      {/* Builder Canvas */}
      <div 
        className="flex-1 bg-gray-50 p-4 ml-4 rounded-lg overflow-y-auto"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {pages.find(p => p.id === currentPage)?.elements.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
            <div className="text-center">
              <span className="material-icons text-4xl mb-2">drag_indicator</span>
              <p>Drag and drop elements here</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {pages.find(p => p.id === currentPage)?.elements.map((element) => (
              <div 
                key={element.id}
                onClick={() => {
                  setSelectedElement(element);
                  setShowStyleEditor(true);
                }}
                className={`bg-white rounded shadow-sm border ${
                  selectedElement?.id === element.id ? 'border-blue-500' : 'border-gray-200'
                } hover:border-blue-500 cursor-pointer`}
              >
                {renderElementContent(element)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Style Editor Panel */}
      {showStyleEditor && (
        <div className="w-80 bg-white shadow-lg p-4 overflow-y-auto">
          <h3 className="font-medium mb-4">Style Editor</h3>
          {selectedElement && (
            <div className="space-y-4">
              {/* Layout */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Layout</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Width"
                    value={selectedElement.styles.width}
                    onChange={(e) => {
                      const updatedPages = pages.map(page => {
                        if (page.id === currentPage) {
                          return {
                            ...page,
                            elements: page.elements.map(el => 
                              el.id === selectedElement.id 
                                ? { ...el, styles: { ...el.styles, width: e.target.value } }
                                : el
                            )
                          };
                        }
                        return page;
                      });
                      setPages(updatedPages);
                    }}
                    className="border rounded p-1 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Height"
                    value={selectedElement.styles.height}
                    onChange={(e) => {
                      const updatedPages = pages.map(page => {
                        if (page.id === currentPage) {
                          return {
                            ...page,
                            elements: page.elements.map(el => 
                              el.id === selectedElement.id 
                                ? { ...el, styles: { ...el.styles, height: e.target.value } }
                                : el
                            )
                          };
                        }
                        return page;
                      });
                      setPages(updatedPages);
                    }}
                    className="border rounded p-1 text-sm"
                  />
                </div>
              </div>

              {/* Typography */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Typography</h4>
                <select
                  value={selectedElement.styles.fontFamily}
                  onChange={(e) => {
                    const updatedPages = pages.map(page => {
                      if (page.id === currentPage) {
                        return {
                          ...page,
                          elements: page.elements.map(el => 
                            el.id === selectedElement.id 
                              ? { ...el, styles: { ...el.styles, fontFamily: e.target.value } }
                              : el
                          )
                        };
                      }
                      return page;
                    });
                    setPages(updatedPages);
                  }}
                  className="w-full border rounded p-1 text-sm mb-2"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Poppins">Poppins</option>
                </select>
                <input
                  type="text"
                  placeholder="Font Size"
                  value={selectedElement.styles.fontSize}
                  onChange={(e) => {
                    const updatedPages = pages.map(page => {
                      if (page.id === currentPage) {
                        return {
                          ...page,
                          elements: page.elements.map(el => 
                            el.id === selectedElement.id 
                              ? { ...el, styles: { ...el.styles, fontSize: e.target.value } }
                              : el
                          )
                        };
                      }
                      return page;
                    });
                    setPages(updatedPages);
                  }}
                  className="w-full border rounded p-1 text-sm"
                />
              </div>

              {/* Colors */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Colors</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">Text Color</label>
                    <input
                      type="color"
                      value={selectedElement.styles.color}
                      onChange={(e) => {
                        const updatedPages = pages.map(page => {
                          if (page.id === currentPage) {
                            return {
                              ...page,
                              elements: page.elements.map(el => 
                                el.id === selectedElement.id 
                                  ? { ...el, styles: { ...el.styles, color: e.target.value } }
                                  : el
                              )
                            };
                          }
                          return page;
                        });
                        setPages(updatedPages);
                      }}
                      className="w-full h-8 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Background</label>
                    <input
                      type="color"
                      value={selectedElement.styles.backgroundColor}
                      onChange={(e) => {
                        const updatedPages = pages.map(page => {
                          if (page.id === currentPage) {
                            return {
                              ...page,
                              elements: page.elements.map(el => 
                                el.id === selectedElement.id 
                                  ? { ...el, styles: { ...el.styles, backgroundColor: e.target.value } }
                                  : el
                              )
                            };
                          }
                          return page;
                        });
                        setPages(updatedPages);
                      }}
                      className="w-full h-8 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              {typeof selectedElement.content === 'string' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Content</h4>
                  <textarea
                    value={selectedElement.content}
                    onChange={(e) => {
                      const updatedPages = pages.map(page => {
                        if (page.id === currentPage) {
                          return {
                            ...page,
                            elements: page.elements.map(el => 
                              el.id === selectedElement.id 
                                ? { ...el, content: e.target.value }
                                : el
                            )
                          };
                        }
                        return page;
                      });
                      setPages(updatedPages);
                    }}
                    className="w-full border rounded p-2 text-sm"
                    rows="4"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <span className="material-icons absolute left-3 top-2.5 text-gray-400">
              search
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value="business">Business</option>
            <option value="commerce">E-commerce</option>
            <option value="personal">Personal</option>
          </select>
          <button
            onClick={() => {
              setShowBuilder(true);
              setCurrentTemplate(null);
              setPages([{ id: 'home', name: 'Home', elements: [] }]);
              setCurrentPage('home');
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <span className="material-icons mr-2">add</span>
            Create New
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates
          .filter(template => {
            const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
            return matchesSearch && matchesCategory;
          })
          .map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow overflow-hidden">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{template.name}</h3>
                    <span className="text-sm text-gray-500 capitalize">
                      {template.category}
                    </span>
                  </div>
                  <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                    {template.pages.length} pages
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Included Pages:</h4>
                  <div className="flex flex-wrap gap-2">
                    {template.pages.map((page, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                      >
                        {page}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {template.views.toLocaleString()} views
                  </div>
                  <button
                    onClick={() => {
                      setShowBuilder(true);
                      setCurrentTemplate(template);
                      setPages(template.pages.map((pageName, index) => ({
                        id: `page-${index}`,
                        name: pageName,
                        elements: []
                      })));
                      setCurrentPage('page-0');
                    }}
                    className="bg-white border border-indigo-600 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-50"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderElementsPanel = () => (
    <div className="bg-white shadow-lg rounded-lg p-4 w-64 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Elements</h3>
      {Object.entries(elements).map(([category, categoryElements]) => (
        <div key={category} className="mb-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2 capitalize">{category}</h4>
          <div className="grid grid-cols-2 gap-2">
            {categoryElements.map((element) => (
              <div
                key={element.type}
                draggable
                onDragStart={(e) => handleDragStart(e, element)}
                className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded cursor-move hover:bg-gray-100 transition-colors"
              >
                <span className="material-icons text-gray-600 mb-1">{element.icon}</span>
                <span className="text-xs text-center">{element.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // Add animation styles
  useEffect(() => {
    if (!document.getElementById('animation-styles')) {
      const style = document.createElement('style');
      style.id = 'animation-styles';
      style.textContent = `
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div>
      {showBuilder ? (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={handleExitBuilder}
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <span className="material-icons">arrow_back</span>
              </button>
              <h2 className="text-xl font-semibold">
                {currentTemplate ? `Customize ${currentTemplate.name}` : 'Create New Website'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {
                  // Open preview in new tab
                  const previewWindow = window.open('', '_blank');
                  const currentPageContent = pages.find(p => p.id === currentPage);
                  previewWindow.document.write(`
                    <html>
                      <head>
                        <title>Preview - ${currentPageContent.name}</title>
                        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
                        <style>
                          body { margin: 0; font-family: 'Inter', sans-serif; }
                        </style>
                      </head>
                      <body>
                        ${currentPageContent.elements.map(element => `
                          <div style="${Object.entries(element.styles).map(([key, value]) => `${key}: ${value}`).join(';')}">
                            ${element.content}
                          </div>
                        `).join('')}
                      </body>
                    </html>
                  `);
                }}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center"
              >
                <span className="material-icons mr-2">preview</span>
                Preview
              </button>
              <button 
                onClick={() => {
                  // Save website logic here
                  alert('Website saved successfully!');
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
              >
                <span className="material-icons mr-2">publish</span>
                Publish
              </button>
            </div>
          </div>
          {renderBuilder()}
        </div>
      ) : (
        renderTemplates()
      )}
    </div>
  );
};

export default LandingPages; 