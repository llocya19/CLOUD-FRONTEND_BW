import React, { useEffect, useState } from 'react';
import { getMarcas, deleteMarca } from '../../services/marcasService';

interface Props {
  onEdit: (marca: any) => void;
  refresh: number;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const MarcaList: React.FC<Props> = ({ onEdit, refresh, showToast }) => {
  const [marcas, setMarcas] = useState([]);

  const cargarMarcas = async () => {
    try {
      const res = await getMarcas();
      setMarcas(res.data);
    } catch {
      showToast('Error al cargar marcas', 'error');
    }
  };

  useEffect(() => {
    cargarMarcas();
  }, [refresh]);

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar esta marca?')) {
      try {
        await deleteMarca(id);
        showToast('Marca eliminada.', 'success');
        cargarMarcas();
      } catch {
        showToast('Error al eliminar marca.', 'error');
      }
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-secondary text-white">🏷️ Listado de Marcas</div>
      <div className="card-body table-responsive">
        <table className="table table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {marcas.map((m: any) => (
              <tr key={m.id}>
                <td>{m.nombre}</td>
                <td>{m.descripcion || '—'}</td>
                <td>
                  <button className="btn btn-sm btn-secondary me-2" onClick={() => onEdit(m)}>✏️</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(m.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
