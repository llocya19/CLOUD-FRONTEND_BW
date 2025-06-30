import React, { useState } from 'react';
import { AddRole } from '../components/roles/AddRole';
import { RoleList } from '../components/roles/RoleList';

const RolesPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);  // Forzar la recarga de la lista de roles
  const [selectedRole, setSelectedRole] = useState<any | null>(null); // Role seleccionando para editar
  const [toast, setToast] = useState({ msg: '', type: '' });  // Mensajes de éxito o error

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000); // Mostrar el toast por 3 segundos
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🔐 Gestión de Roles</h2>

      {/* Mostrar mensaje de Toast si existe */}
      {toast.msg && (
        <div className={`alert alert-${toast.type} alert-dismissible fade show`} role="alert">
          {toast.msg}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}

      {/* Formulario para agregar/editar un rol */}
      <AddRole
        selectedRole={selectedRole}
        onSuccess={() => {
          setRefreshKey(prev => prev + 1);  // Refrescar la lista de roles después de crear o editar un rol
          setSelectedRole(null);  // Limpiar el rol seleccionado para no seguir editando
        }}
        showToast={showToast}
      />

      {/* Lista de roles con las opciones de editar y eliminar */}
      <RoleList
        refresh={refreshKey}  // Cuando se refresca, vuelve a cargar la lista de roles
        onEdit={(role) => setSelectedRole(role)}  // Editar un rol
        showToast={showToast}
      />
    </div>
  );
};

export default RolesPage;
