import React from 'react';
import { Plus } from 'lucide-react';
import './FloatingButton.css';

const FloatingButton = ({ onClick }) => {
  return (
    <button className="floating-btn" onClick={onClick} aria-label="새 나눔 등록">
      <Plus size={32} />
    </button>
  );
};

export default FloatingButton;
