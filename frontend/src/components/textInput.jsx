// TextInput.js
import React from 'react';

const TextInput = ({ value, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="inputText"
      value={value}
      onChange={handleChange}
    />
  );
};

export default TextInput;
