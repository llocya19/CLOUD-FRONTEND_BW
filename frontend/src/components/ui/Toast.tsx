import React from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  const alertMap = {
    success: 'alert-success',
    error: 'alert-danger',
    info: 'alert-info',
    warning: 'alert-warning',
  };

  return (
    <div
      className={`alert ${alertMap[type] || 'alert-secondary'} position-fixed bottom-0 end-0 m-4 shadow`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ zIndex: 9999, minWidth: '250px', fontSize: '14px' }}
    >
      <strong>{type === 'error' ? '❌ Error:' : type === 'success' ? '✅ Éxito:' : 'ℹ️ Info:'}</strong> {message}
    </div>
  );
};

export default Toast;
