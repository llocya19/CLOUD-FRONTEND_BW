import React, { useState } from 'react';
import { AddMarca } from '../components/marcas/AddMarca';
import { MarcaList } from '../components/marcas/MarcaList';
import Toast from '../components/ui/Toast';

const MarcasPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ msg: '', type: '' });

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🏷️ Gestión de Marcas</h2>
      {toast.msg && <Toast message={toast.msg} type={toast.type as 'success' | 'error'} />}

      <AddMarca selected={selected} onSuccess={() => {
        setSelected(null);
        setRefreshKey(prev => prev + 1);
      }} showToast={showToast} />

      <MarcaList onEdit={setSelected} refresh={refreshKey} showToast={showToast} />
    </div>
  );
};

export default MarcasPage;
