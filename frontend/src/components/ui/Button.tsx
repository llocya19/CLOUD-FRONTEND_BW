import React from 'react';

interface Props {
  label: string;
  onClick: () => void;
  className?: string;
}

const Button: React.FC<Props> = ({ label, onClick, className = 'btn btn-primary' }) => (
  <button className={className} onClick={onClick}>
    {label}
  </button>
);

export default Button;
