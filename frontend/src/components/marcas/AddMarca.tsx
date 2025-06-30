import React, { useState, useEffect } from 'react';
import { createMarca, updateMarca } from '../../services/marcasService';

interface Props {
  selected: any;
  onSuccess: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const AddMarca: React.FC<Props> = ({ selected, onSuccess, showToast }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (selected) {
      setNombre(selected.nombre);
      setDescripcion(selected.descripcion);
    } else {
      limpiarFormulario();
    }
  }, [selected]);

  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      showToast('El nombre es obligatorio.', 'error');
      return;
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(nombre.trim())) {
      showToast('El nombre solo debe contener letras y espacios.', 'error');
      return;
    }

    try {
      if (selected) {
        await updateMarca(selected.id, { nombre, descripcion });
        showToast('Marca actualizada.', 'success');
      } else {
        await createMarca({ nombre, descripcion });
        showToast('Marca registrada.', 'success');
      }
      limpiarFormulario();
      onSuccess();
    } catch (err: any) {
      if (err.response?.status === 409) {
        showToast('Ya existe una marca con ese nombre.', 'error');
      } else {
        showToast('Error al guardar marca.', 'error');
      }
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-dark text-white">
        {selected ? 'Editar Marca' : 'Nueva Marca'}
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nombre</label>
            <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Descripción</label>
            <input type="text" className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>
          <div className="col-12 text-end">
            <button type="submit" className="btn btn-primary">💾 Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
