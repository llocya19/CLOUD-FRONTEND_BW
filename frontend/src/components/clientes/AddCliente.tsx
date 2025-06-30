import React, { useState, useEffect } from 'react';
import { verificarDuplicado, guardarClienteLote, actualizarCliente } from '../../services/clientesService';

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

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
  clienteEdit: Cliente | null;
  setClienteEdit: (c: Cliente | null) => void;
  actualizarLista: () => void;
}

const AddCliente: React.FC<Props> = ({
  showToast,
  clienteEdit,
  setClienteEdit,
  actualizarLista,
}) => {
  const clienteBase: Cliente = {
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    dni: '',
    ruc: '',
    tipo_cliente: 'persona',
  };

  const [cliente, setCliente] = useState<Cliente>(clienteBase);
  const [clientesTemp, setClientesTemp] = useState<Cliente[]>([]);
  const [errores, setErrores] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (clienteEdit) {
      setCliente(clienteEdit);
    }
  }, [clienteEdit]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setCliente(prev => ({ ...prev, [name]: value }));
    setErrores(prev => ({ ...prev, [name]: '' }));
  };

 const validar = async (): Promise<boolean> => {
  const err: { [key: string]: string } = {};

  // Validar nombre
  if (!cliente.nombre.trim() || !/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(cliente.nombre)) {
    err.nombre = 'El nombre es obligatorio y solo debe tener letras.';
  }

  // Validar email
  if (!cliente.email || !/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(cliente.email)) {
    err.email = 'Email inválido.';
  } else if (!clienteEdit) {
    const emailRes = await verificarDuplicado('email', cliente.email);
    if (emailRes.data.existe) {
      err.email = 'El email ya está registrado.';
    }
  }

  // Validar teléfono
  if (!cliente.telefono || !/^[0-9]{7,15}$/.test(cliente.telefono)) {
    err.telefono = 'Teléfono inválido.';
  }

  // Validar dirección
  if (!cliente.direccion.trim()) {
    err.direccion = 'Dirección obligatoria.';
  }

  // Validar tipo de cliente
  if (cliente.tipo_cliente === 'persona') {
    if (!cliente.dni || !/^[0-9]{8}$/.test(cliente.dni)) {
      err.dni = 'El DNI debe tener 8 dígitos.';
    } else if (!clienteEdit) {
      const dniRes = await verificarDuplicado('dni', cliente.dni);
      if (dniRes.data.existe) {
        err.dni = 'El DNI ya está registrado.';
      }
    }
  } else if (cliente.tipo_cliente === 'empresa') {
    if (!cliente.ruc || cliente.ruc.trim().length < 8) {
      err.ruc = 'El RUC es obligatorio y debe tener al menos 8 caracteres.';
    } else if (!clienteEdit) {
      const rucRes = await verificarDuplicado('ruc', cliente.ruc);
      if (rucRes.data.existe) {
        err.ruc = 'El RUC ya está registrado.';
      }
    }
  } else {
    err.tipo_cliente = 'Selecciona un tipo de cliente.';
  }

  setErrores(err);

  if (Object.keys(err).length > 0) {
    showToast(Object.values(err)[0], 'error');
    return false;
  }

  return true;
};


  const resetForm = () => {
    setCliente(clienteBase);
    setErrores({});
    setClienteEdit(null);
  };

  const agregarTemporal = async (e: React.FormEvent) => {
    e.preventDefault();
    const valido = await validar();
    if (!valido) return;
    setClientesTemp([...clientesTemp, cliente]);
    showToast('Cliente agregado temporalmente.', 'success');
    resetForm();
  };

  const guardarTodos = async () => {
    try {
      await guardarClienteLote(clientesTemp);
      showToast('Clientes registrados correctamente.', 'success');
      setClientesTemp([]);
      actualizarLista();
    } catch {
      showToast('Error al guardar los clientes.', 'error');
    }
  };

  const actualizarExistente = async (e: React.FormEvent) => {
    e.preventDefault();
    const valido = await validar();
    if (!valido || !clienteEdit) return;
    try {
      await actualizarCliente(clienteEdit.id!, cliente);
      showToast('Cliente actualizado.', 'success');
      resetForm();
      actualizarLista();
    } catch {
      showToast('Error al actualizar cliente.', 'error');
    }
  };

  const eliminarTemp = (index: number) => {
    const copia = [...clientesTemp];
    copia.splice(index, 1);
    setClientesTemp(copia);
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-dark text-white">
        {clienteEdit ? '✏️ Editar Cliente' : '👤 Agregar Cliente'}
      </div>
      <div className="card-body">
        <form onSubmit={clienteEdit ? actualizarExistente : agregarTemporal} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nombre</label>
            <input name="nombre" value={cliente.nombre} onChange={handleChange} className="form-control" />
            {errores.nombre && <div className="text-danger small">{errores.nombre}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input name="email" value={cliente.email} onChange={handleChange} className="form-control" />
            {errores.email && <div className="text-danger small">{errores.email}</div>}
          </div>

          <div className="col-md-4">
            <label className="form-label">Teléfono</label>
            <input name="telefono" value={cliente.telefono} onChange={handleChange} className="form-control" />
            {errores.telefono && <div className="text-danger small">{errores.telefono}</div>}
          </div>

          

          <div className="col-md-6">
            <label className="form-label">Dirección</label>
            <input name="direccion" value={cliente.direccion} onChange={handleChange} className="form-control" />
            {errores.direccion && <div className="text-danger small">{errores.direccion}</div>}
          </div>

          {/* Tipo de Cliente */}
            <div className="col-md-6">
            <label className="form-label">Tipo de Cliente</label>
            <select
                name="tipo_cliente"
                value={cliente.tipo_cliente}
                onChange={(e) => {
                const tipo = e.target.value as 'persona' | 'empresa';
                setCliente(prev => ({
                    ...prev,
                    tipo_cliente: tipo,
                    dni: tipo === 'persona' ? prev.dni : '',
                    ruc: tipo === 'empresa' ? prev.ruc : ''
                }));
                setErrores(prev => ({ ...prev, tipo_cliente: '' }));
                }}
                className="form-select"
            >
                <option value="persona">Persona</option>
                <option value="empresa">Empresa</option>
            </select>
            {errores.tipo_cliente && <div className="text-danger small">{errores.tipo_cliente}</div>}
            </div>

            {/* DNI solo si es persona */}
            {cliente.tipo_cliente === 'persona' && (
            <div className="col-md-6">
                <label className="form-label">DNI</label>
                <input
                name="dni"
                value={cliente.dni}
                onChange={handleChange}
                className="form-control"
                />
                {errores.dni && <div className="text-danger small">{errores.dni}</div>}
            </div>
            )}

            {/* RUC solo si es empresa */}
            {cliente.tipo_cliente === 'empresa' && (
            <div className="col-md-6">
                <label className="form-label">RUC</label>
                <input
                name="ruc"
                value={cliente.ruc}
                onChange={handleChange}
                className="form-control"
                />
                {errores.ruc && <div className="text-danger small">{errores.ruc}</div>}
            </div>
            )}


          <div className="col-12 text-end">
            <button type="submit" className="btn btn-primary">
              {clienteEdit ? '💾 Actualizar' : '➕ Agregar a lista'}
            </button>
          </div>
        </form>

        {clientesTemp.length > 0 && (
          <>
            <hr />
            <h5>🧾 Clientes agregados</h5>
            <table className="table table-bordered text-center align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>DNI</th>
                  <th>RUC</th>
                  <th>Tipo</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {clientesTemp.map((c, index) => (
                  <tr key={index}>
                    <td>{c.nombre}</td>
                    <td>{c.email}</td>
                    <td>{c.telefono}</td>
                    <td>{c.dni}</td>
                    <td>{c.ruc}</td>
                    <td>{c.tipo_cliente}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => eliminarTemp(index)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-end mt-2">
              <button className="btn btn-success" onClick={guardarTodos}>
                💾 Guardar clientes en BD
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddCliente;
