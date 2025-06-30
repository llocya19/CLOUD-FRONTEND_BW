import React, { useState } from 'react';
import AddVenta from '../components/ventas/AddVenta';
import VentaList from '../components/ventas/VentaList';
import Toast from '../components/ui/Toast';

type ToastType = 'success' | 'error' | 'info' | 'warning';

const VentasPage: React.FC = () => {
  const [toast, setToast] = useState<{ msg: string; type: ToastType }>({
    msg: '',
    type: 'success'
  });

  const showToast = (msg: string, type: ToastType) => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Módulo de Ventas</h1>

      {/* Registro de nueva venta */}
      <AddVenta showToast={showToast} />

      {/* Listado de ventas realizadas */}
      <VentaList />

      {/* Toast */}
      {toast.msg && <Toast message={toast.msg} type={toast.type} />}
    </div>
  );
};

export default VentasPage;
