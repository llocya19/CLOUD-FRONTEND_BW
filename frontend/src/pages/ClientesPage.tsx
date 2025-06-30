import React, { useState } from 'react';
import AddCliente from '../components/clientes/AddCliente';
import ClienteList from '../components/clientes/ClienteList';
import Toast from '../components/ui/Toast';

interface Cliente {
  id?: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  dni: string;
  ruc: string;
  tipo_cliente: 'persona' | 'empresa';
}

const ClientesPage: React.FC = () => {
  const [toast, setToast] = useState({ msg: '', type: '' });
  const [clienteEdit, setClienteEdit] = useState<Cliente | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">👥 Gestión de Clientes</h2>

      {toast.msg && <Toast message={toast.msg} type={toast.type as 'success' | 'error'} />}

      <AddCliente
        showToast={showToast}
        clienteEdit={clienteEdit}
        setClienteEdit={setClienteEdit}
        actualizarLista={() => setRefreshKey(prev => prev + 1)}
      />

      <ClienteList
        onEditar={setClienteEdit}
        refreshKey={refreshKey}
      />
    </div>
  );
};

export default ClientesPage;
