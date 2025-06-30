import React, { useEffect, useState } from 'react';
import { getUsuarios, deleteUsuario } from '../../services/usuariosService';

interface Props {
  onEdit: (user: any) => void;
  refresh: number;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const UserList: React.FC<Props> = ({ onEdit, refresh, showToast }) => {
  const [usuarios, setUsuarios] = useState([]);

  const cargarUsuarios = async () => {
    try {
      const res = await getUsuarios();
      setUsuarios(res.data);
    } catch {
      showToast('Error al cargar usuarios', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Deseas eliminar este usuario?')) {
      try {
        await deleteUsuario(id);
        showToast('Usuario eliminado correctamente', 'success');
        cargarUsuarios();
      } catch {
        showToast('Error al eliminar usuario', 'error');
      }
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [refresh]);

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-secondary text-white">👥 Listado de Usuarios</div>
      <div className="card-body table-responsive">
        <table className="table table-hover text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Estado</th>
              <th>Roles</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((u: any) => (
                <tr key={u.id}>
                  <td>
                    {u.foto && u.foto.trim() !== '' ? (
                      <img
                        src={
                          u.foto.startsWith('data:image')
                            ? u.foto
                            : `data:image/jpeg;base64,${u.foto}`
                        }
                        alt="Foto"
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge bg-${u.estado === 'activo' ? 'success' : 'danger'}`}>
                      {u.estado}
                    </span>
                  </td>
                  <td>{u.roles || '-'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary me-2"
                      onClick={() => onEdit(u)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(u.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>No hay usuarios registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
