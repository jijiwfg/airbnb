// Button.jsx
import React from 'react';
const Button = ({ onClick, label }) => {
  return (
    <button onClick = {onClick} data-testid = 'custom-button'>
      {label}
    </button>
  );
};

export default Button;
