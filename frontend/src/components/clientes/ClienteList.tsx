import React, { useEffect, useState } from 'react';
import { getClientes, eliminarCliente } from '../../services/clientesService';

interface Props {
  onEditar: (cliente: any) => void;
  refreshKey: number;
}

const ClienteList: React.FC<Props> = ({ onEditar, refreshKey }) => {
  const [clientes, setClientes] = useState<any[]>([]);
  const [filtro, setFiltro] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  const cargarClientes = async () => {
    try {
      const res = await getClientes();
      setClientes(res.data);
    } catch {
      alert('Error al cargar clientes');
    }
  };

  useEffect(() => {
    cargarClientes();
  }, [refreshKey]);

  const confirmarEliminacion = async (id: number) => {
    if (confirm('¿Eliminar este cliente?')) {
      try {
        await eliminarCliente(id);
        cargarClientes();
      } catch {
        alert('Error al eliminar cliente');
      }
    }
  };

  const filtrados = clientes.filter(c =>
    [c.nombre, c.email, c.dni, c.tipo_cliente]
      .some(valor => valor?.toLowerCase().includes(filtro.toLowerCase()))
  );

  // Paginación
  const totalPaginas = Math.ceil(filtrados.length / registrosPorPagina);
  const clientesPagina = filtrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const cambiarPagina = (nueva: number) => {
    if (nueva >= 1 && nueva <= totalPaginas) {
      setPaginaActual(nueva);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
        <span>📋 Clientes Registrados</span>
        <input
          type="text"
          placeholder="🔍 Buscar por nombre, email, dni o tipo"
          className="form-control w-50"
          value={filtro}
          onChange={(e) => {
            setFiltro(e.target.value);
            setPaginaActual(1); // Reiniciar página al filtrar
          }}
        />
      </div>

      <div className="card-body" style={{ overflowX: 'auto' }}>
        <table className="table table-bordered table-hover text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>DNI</th>
              <th>RUC</th>
              <th>Dirección</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesPagina.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nombre}</td>
                <td>{c.email}</td>
                <td>{c.telefono}</td>
                <td>{c.dni}</td>
                <td>{c.ruc}</td>
                <td>{c.direccion}</td>
                <td>{c.tipo_cliente}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-1" onClick={() => onEditar(c)}>✏️</button>
                  <button className="btn btn-sm btn-danger" onClick={() => confirmarEliminacion(c.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Controles de paginación */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="text-muted">
            Página {paginaActual} de {totalPaginas} ({filtrados.length} clientes)
          </span>

          <div>
            <button className="btn btn-outline-dark me-2" disabled={paginaActual === 1} onClick={() => cambiarPagina(paginaActual - 1)}>
              ⬅ Anterior
            </button>
            <button className="btn btn-outline-dark" disabled={paginaActual === totalPaginas} onClick={() => cambiarPagina(paginaActual + 1)}>
              Siguiente ➡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteList;
