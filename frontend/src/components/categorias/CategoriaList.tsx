import React, { useEffect, useState } from 'react';
import { getCategorias, deleteCategoria } from '../../services/categoriasService';

interface Props {
  onEdit: (cat: any) => void;
  refresh: number;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const CategoriaList: React.FC<Props> = ({ onEdit, refresh, showToast }) => {
  const [categorias, setCategorias] = useState([]);

  const cargarCategorias = async () => {
    try {
      const res = await getCategorias();
      setCategorias(res.data);
    } catch {
      showToast('Error al cargar categorías', 'error');
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, [refresh]);

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar esta categoría?')) {
      try {
        await deleteCategoria(id);
        showToast('Categoría eliminada.', 'success');
        cargarCategorias();
      } catch {
        showToast('Error al eliminar categoría.', 'error');
      }
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-secondary text-white">📂 Listado de Categorías</div>
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
            {categorias.map((c: any) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.descripcion || '—'}</td>
                <td>
                  <button className="btn btn-sm btn-secondary me-2" onClick={() => onEdit(c)}>✏️</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
