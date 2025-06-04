// src/components/SectionEditor.js
import React from 'react';

const SectionEditor = ({ provided, id, content, handleSectionChange }) => {
  return (
    <div
      className="section-card"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <textarea
        value={content}
        onChange={(e) => handleSectionChange(id, e.target.value)}
        placeholder={`Enter ${id}...`}
      />
    </div>
  );
};

export default SectionEditor;
