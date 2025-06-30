import React, { useState } from 'react';
import { AddCategoria } from '../components/categorias/AddCategoria';
import { CategoriaList } from '../components/categorias/CategoriaList';
import Toast from '../components/ui/Toast';

const CategoriasPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ msg: '', type: '' });

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📂 Gestión de Categorías</h2>
      {toast.msg && <Toast message={toast.msg} type={toast.type as 'success' | 'error'} />}

      <AddCategoria selected={selected} onSuccess={() => {
        setSelected(null);
        setRefreshKey(prev => prev + 1);
      }} showToast={showToast} />

      <CategoriaList onEdit={setSelected} refresh={refreshKey} showToast={showToast} />
    </div>
  );
};

export default CategoriasPage;
