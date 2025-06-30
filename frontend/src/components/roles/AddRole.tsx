import React, { useState, useEffect } from 'react';
import { createRole, updateRole } from '../../services/rolesService';
import { getModulos } from '../../services/modulosService';

interface Props {
  selectedRole: any;
  onSuccess: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const AddRole: React.FC<Props> = ({ selectedRole, onSuccess, showToast }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [modulosDisponibles, setModulosDisponibles] = useState<any[]>([]);
  const [modulosSeleccionados, setModulosSeleccionados] = useState<number[]>([]);

  useEffect(() => {
    const cargarModulos = async () => {
      try {
        const res = await getModulos();
        setModulosDisponibles(res.data);
      } catch {
        showToast('Error al cargar módulos', 'error');
      }
    };
    cargarModulos();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      setNombre(selectedRole.nombre);
      setDescripcion(selectedRole.descripcion);
      setModulosSeleccionados(selectedRole.modulos?.map((m: any) => m.id) || []);
    } else {
      setNombre('');
      setDescripcion('');
      setModulosSeleccionados([]);
    }
  }, [selectedRole]);

  const toggleModulo = (id: number) => {
    setModulosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((mod) => mod !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/.test(nombre.trim())) {
      showToast('El nombre solo debe contener letras.', 'error');
      return;
    }

    try {
      const payload = { nombre, descripcion, modulos: modulosSeleccionados };

      if (selectedRole) {
        await updateRole(selectedRole.id, payload);
        showToast('Rol actualizado correctamente.', 'success');
      } else {
        await createRole(payload);
        showToast('Rol creado correctamente.', 'success');
      }

      setNombre('');
      setDescripcion('');
      setModulosSeleccionados([]);
      onSuccess();
    } catch (err: any) {
      if (err.response?.status === 409) {
        showToast('El nombre del rol ya existe.', 'error');
      } else {
        showToast('Error al guardar el rol.', 'error');
      }
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-dark text-white">
        {selectedRole ? 'Editar Rol' : 'Nuevo Rol'}
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Descripción</label>
            <input
              type="text"
              className="form-control"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          {/* Área para seleccionar los módulos */}
          {modulosDisponibles.length > 0 && (
            <div className="col-12">
              <label className="form-label">Módulos asignados</label>
              <div className="d-flex flex-wrap gap-2">
                {modulosDisponibles.map((modulo) => (
                  <div className="form-check me-3" key={modulo.id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={modulosSeleccionados.includes(modulo.id)}
                      onChange={() => toggleModulo(modulo.id)}
                      id={`modulo-${modulo.id}`}
                    />
                    <label className="form-check-label" htmlFor={`modulo-${modulo.id}`}>
                      {modulo.nombre}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="col-12 text-end">
            <button type="submit" className="btn btn-primary">
              💾 {selectedRole ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
