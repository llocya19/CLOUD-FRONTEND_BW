import React from 'react';

interface FormCardProps {
  title: string;
  children: React.ReactNode;
}

export const FormCard: React.FC<FormCardProps> = ({ title, children }) => (
  <div className="form-wrapper">
    <div className="form-card">
      <h2 className="form-title">{title}</h2>
      {children}
    </div>
  </div>
);
