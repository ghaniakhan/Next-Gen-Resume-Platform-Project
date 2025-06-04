// src/components/TemplateSwitcher.js
import React from 'react';

const TemplateSwitcher = ({ template, setTemplate, themeColor, setThemeColor, fontFamily, setFontFamily, darkMode, setDarkMode }) => {
  return (
    <div className="controls">
      <label>Template:</label>
      <select value={template} onChange={(e) => setTemplate(e.target.value)}>
        <option value="modern">Modern</option>
        <option value="classic">Classic</option>
        <option value="minimalist">Minimalist</option>
        <option value="elegant">Elegant</option>
      </select>

      <label>Theme Color:</label>
      <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} />

      <label>Font:</label>
      <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Roboto">Roboto</option>
        <option value="Courier New">Courier New</option>
        <option value="Georgia">Georgia</option>
      </select>

      <button onClick={() => setDarkMode(!darkMode)}>{darkMode ? "Light Mode" : "Dark Mode"}</button>
    </div>
  );
};

export default TemplateSwitcher;
