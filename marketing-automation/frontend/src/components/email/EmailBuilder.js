import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';

const BLOCK_TYPES = {
  HEADER: 'header',
  TEXT: 'text',
  BUTTON: 'button',
  IMAGE: 'image',
  SPACER: 'spacer',
};

const EMPTY_BLOCKS = [
  { id: 'header-1', type: BLOCK_TYPES.HEADER, content: 'Click to edit header', aiPrompt: 'Write a compelling email header' },
  { id: 'text-1', type: BLOCK_TYPES.TEXT, content: 'Click to edit text', aiPrompt: 'Write engaging email body text' },
  { id: 'button-1', type: BLOCK_TYPES.BUTTON, content: 'Click Here', aiPrompt: 'Write a compelling call-to-action button text' },
];

const EmailBuilder = () => {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    
    if (!destination) return;

    // If dropping in the same place
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // If dragging from blocks panel to editor
    if (source.droppableId === 'blocks-panel' && destination.droppableId === 'email-editor') {
      const blockType = EMPTY_BLOCKS[source.index];
      const newBlock = {
        ...blockType,
        id: `${blockType.type}-${Date.now()}`,
      };
      const newBlocks = Array.from(blocks);
      newBlocks.splice(destination.index, 0, newBlock);
      setBlocks(newBlocks);
      return;
    }

    // If reordering within the editor
    if (source.droppableId === 'email-editor' && destination.droppableId === 'email-editor') {
      const newBlocks = Array.from(blocks);
      const [removed] = newBlocks.splice(source.index, 1);
      newBlocks.splice(destination.index, 0, removed);
      setBlocks(newBlocks);
    }
  };

  const handleGenerateAIContent = async (block) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/email/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: block.aiPrompt,
          type: block.type,
        }),
      });

      const data = await response.json();
      if (data.success) {
        const updatedBlocks = blocks.map((b) =>
          b.id === block.id ? { ...b, content: data.content } : b
        );
        setBlocks(updatedBlocks);
        toast.success('Content generated successfully');
      } else {
        toast.error(data.error || 'Failed to generate content');
      }
    } catch (error) {
      toast.error('Error generating content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateContent = (blockId, newContent) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === blockId ? { ...block, content: newContent } : block
    );
    setBlocks(updatedBlocks);
  };

  const handleDeleteBlock = (blockId) => {
    setBlocks(blocks.filter((block) => block.id !== blockId));
    setSelectedBlock(null);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-full">
        {/* Blocks Panel */}
        <div className="w-64 bg-gray-100 p-4 border-r">
          <h3 className="text-lg font-semibold mb-4">Blocks</h3>
          <Droppable droppableId="blocks-panel" isDropDisabled={true}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {EMPTY_BLOCKS.map((block, index) => (
                  <Draggable 
                    key={block.id} 
                    draggableId={block.id} 
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-white p-3 rounded shadow-sm cursor-move hover:shadow transition-shadow duration-200 ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="material-icons mr-2">drag_indicator</span>
                          <span className="capitalize">{block.type}</span>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Email Editor */}
        <div className="flex-1 p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <Droppable droppableId="email-editor">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`min-h-[500px] ${
                    snapshot.isDraggingOver ? 'bg-blue-50' : ''
                  } transition-colors duration-200 rounded-lg`}
                >
                  {blocks.map((block, index) => (
                    <Draggable key={block.id} draggableId={block.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`relative p-4 my-2 rounded border ${
                            selectedBlock?.id === block.id
                              ? 'border-blue-500'
                              : 'border-gray-200'
                          } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                          onClick={() => setSelectedBlock(block)}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="absolute top-2 right-2 flex space-x-2"
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGenerateAIContent(block);
                              }}
                              className="p-1 text-gray-500 hover:text-blue-500"
                              disabled={isGenerating}
                            >
                              <span className="material-icons">
                                {isGenerating ? 'sync' : 'auto_fix_high'}
                              </span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteBlock(block.id);
                              }}
                              className="p-1 text-gray-500 hover:text-red-500"
                            >
                              <span className="material-icons">delete</span>
                            </button>
                          </div>
                          {block.type === BLOCK_TYPES.HEADER && (
                            <h2
                              className="text-2xl font-bold"
                              contentEditable
                              onBlur={(e) =>
                                handleUpdateContent(block.id, e.target.textContent)
                              }
                              suppressContentEditableWarning
                            >
                              {block.content}
                            </h2>
                          )}
                          {block.type === BLOCK_TYPES.TEXT && (
                            <p
                              className="text-gray-700"
                              contentEditable
                              onBlur={(e) =>
                                handleUpdateContent(block.id, e.target.textContent)
                              }
                              suppressContentEditableWarning
                            >
                              {block.content}
                            </p>
                          )}
                          {block.type === BLOCK_TYPES.BUTTON && (
                            <button
                              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                              contentEditable
                              onBlur={(e) =>
                                handleUpdateContent(block.id, e.target.textContent)
                              }
                              suppressContentEditableWarning
                            >
                              {block.content}
                            </button>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {blocks.length === 0 && !snapshot.isDraggingOver && (
                    <div className="text-center py-12 text-gray-400">
                      Drag blocks here to build your email
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default EmailBuilder; 