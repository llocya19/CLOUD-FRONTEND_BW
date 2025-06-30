import React, { useState, useEffect } from 'react';
import {
  createUsuario,
  updateUsuario,
  getTodosRoles,
  getRolesPorUsuario
} from '../../services/usuariosService';

interface Props {
  selectedUser: any;
  onSuccess: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const AddUser: React.FC<Props> = ({ selectedUser, onSuccess, showToast }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState('activo');
  const [contraseña, setContraseña] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [rolesDisponibles, setRolesDisponibles] = useState([]);
  const [rolesSeleccionados, setRolesSeleccionados] = useState<number[]>([]);

  useEffect(() => {
    getTodosRoles()
      .then(res => setRolesDisponibles(res.data))
      .catch(() => showToast('Error al cargar roles', 'error'));
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setNombre(selectedUser.nombre);
      setEmail(selectedUser.email);
      setEstado(selectedUser.estado);
      setContraseña('');
      setRolesSeleccionados([]);
      setFoto(null);

      getRolesPorUsuario(selectedUser.id)
        .then(res => setRolesSeleccionados(res.data))
        .catch(() => showToast('Error al cargar roles del usuario', 'error'));
    } else {
      limpiarFormulario();
    }
  }, [selectedUser]);

  const limpiarFormulario = () => {
    setNombre('');
    setEmail('');
    setEstado('activo');
    setContraseña('');
    setRolesSeleccionados([]);
    setFoto(null);
  };

  const convertirImagenABase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !email || (!selectedUser && !contraseña)) {
      showToast('Todos los campos obligatorios deben completarse.', 'error');
      return;
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(nombre.trim())) {
      showToast('El nombre solo debe contener letras y espacios.', 'error');
      return;
    }

    let base64Foto = selectedUser?.foto || '';
    if (foto) {
      try {
        base64Foto = await convertirImagenABase64(foto);
      } catch {
        showToast('Error al cargar la imagen.', 'error');
        return;
      }
    }

    const data: any = {
      nombre,
      email,
      estado,
      roles: rolesSeleccionados,
      foto: base64Foto
    };

    if (!selectedUser && contraseña) data.contraseña = contraseña;
    if (selectedUser && contraseña.trim() !== '') data.contraseña = contraseña;

    try {
      if (selectedUser) {
        await updateUsuario(selectedUser.id, data);
        showToast('Usuario actualizado correctamente.', 'success');
      } else {
        await createUsuario(data);
        showToast('Usuario registrado correctamente.', 'success');
      }

      onSuccess();
      limpiarFormulario();
    } catch (err: any) {
      if (err.response?.status === 409) {
        showToast('Ya existe un usuario con ese correo.', 'error');
      } else {
        showToast('Error al guardar el usuario.', 'error');
      }
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFoto(e.target.files[0]);
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const seleccionados = Array.from(e.target.selectedOptions).map(opt => parseInt(opt.value));
    setRolesSeleccionados(seleccionados);
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-dark text-white">
        {selectedUser ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="row g-3">

          <div className="col-md-4">
            <label className="form-label">Nombre</label>
            <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>

          <div className="col-md-4">
            <label className="form-label">Correo</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="col-md-4">
            <label className="form-label">Estado</label>
            <select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Contraseña {selectedUser && '(dejar vacío si no deseas cambiarla)'}</label>
            <input type="password" className="form-control" value={contraseña} onChange={(e) => setContraseña(e.target.value)} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Foto de perfil</label>
            <input type="file" className="form-control" accept="image/*" onChange={handleFotoChange} />
          </div>

          {selectedUser?.foto && (
            <div className="col-md-6">
              <label className="form-label">Foto actual:</label><br />
              <img src={selectedUser.foto} alt="Perfil" className="img-thumbnail" style={{ maxWidth: '100px' }} />
            </div>
          )}

          <div className="col-md-6">
            <label className="form-label">Roles</label>
            <select multiple className="form-select" value={rolesSeleccionados.map(String)} onChange={handleRoleChange}>
              {rolesDisponibles.map((r: any) => (
                <option key={r.id} value={r.id}>{r.nombre}</option>
              ))}
            </select>
          </div>

          <div className="col-12 text-end">
            <button type="submit" className="btn btn-primary">
              💾 {selectedUser ? 'Actualizar' : 'Guardar'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
