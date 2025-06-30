// Componente RoleList.tsx
import React, { useEffect, useState } from 'react';
import { getRoles, deleteRole } from '../../services/rolesService';

interface Props {
  onEdit: (role: any) => void;
  refresh: number;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const RoleList: React.FC<Props> = ({ onEdit, refresh, showToast }) => {
  const [roles, setRoles] = useState<any[]>([]);

  const cargarRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res.data);
    } catch {
      showToast('Error al cargar roles', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar este rol?')) {
      try {
        await deleteRole(id);
        showToast('Rol eliminado correctamente', 'success');
        cargarRoles();
      } catch {
        showToast('Error al eliminar', 'error');
      }
    }
  };

  useEffect(() => {
    cargarRoles();
  }, [refresh]);

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-secondary text-white">📋 Listado de Roles</div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((rol) => (
              <tr key={rol.id}>
                <td>{rol.nombre}</td>
                <td>{rol.descripcion}</td>
                <td>
                  <button onClick={() => onEdit(rol)} className="btn btn-sm btn-secondary">✏️</button>
                  <button onClick={() => handleDelete(rol.id)} className="btn btn-sm btn-danger">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
