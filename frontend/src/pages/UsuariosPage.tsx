// frontend/src/pages/UsuariosPage.tsx

import React, { useState } from 'react';
import { AddUser } from '../components/usuarios/AddUser';
import { UserList } from '../components/usuarios/UserList';
import Toast from '../components/ui/Toast';

const UsuariosPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0); // 🔁 recarga tabla
  const [selectedUser, setSelectedUser] = useState(null); // ✏️ usuario en edición
  const [toast, setToast] = useState({ msg: '', type: '' }); // 🔔 mensaje Toast

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">👥 Gestión de Usuarios</h2>

      {/* 🟨 Mostrar mensaje toast */}
      {toast.msg && <Toast message={toast.msg} type={toast.type as 'success' | 'error'} />}

      {/* 🧾 Formulario de usuario */}
      <AddUser
        selectedUser={selectedUser}
        onSuccess={() => {
          setRefreshKey(prev => prev + 1);
          setSelectedUser(null);
        }}
        showToast={showToast}
      />

      {/* 📋 Tabla de usuarios */}
      <UserList
        refresh={refreshKey}
        onEdit={(user) => setSelectedUser(user)}
        showToast={showToast}
      />
    </div>
  );
};

export default UsuariosPage;
