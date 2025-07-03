import React, { useEffect, useState } from 'react';
import { getProductos, eliminarProducto, listarStockBajo } from '../../services/productosService';
const backendUrl = import.meta.env.VITE_API_URL;
interface Props {
  onEditar: (producto: any) => void;
  refreshKey: number;
  showToast: (msg: string, type: 'success' | 'error' | 'warning') => void;
}

const ProductoList: React.FC<Props> = ({ onEditar, refreshKey, showToast }) => {
  const [productos, setProductos] = useState<any[]>([]);
  const [productosStockBajo, setProductosStockBajo] = useState<number[]>([]);
  const [filtro, setFiltro] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  const cargarProductos = async () => {
    try {
      const res = await getProductos();
      setProductos(res.data);

      const resBajoStock = await listarStockBajo();
      const ids = resBajoStock.data.map((p: any) => p.id);
      setProductosStockBajo(ids);

      if (resBajoStock.data.length > 0) {
        const nombres = resBajoStock.data.map((p: any) => p.nombre).join(', ');
        showToast(`⚠ Productos con bajo stock: ${nombres}`, 'warning');
      }
    } catch {
      showToast('Error al cargar productos.', 'error');
    }
  };

  useEffect(() => {
    cargarProductos();
  }, [refreshKey]);

  const confirmarEliminacion = async (id: number) => {
    if (confirm('¿Eliminar este producto?')) {
      try {
        await eliminarProducto(id);
        cargarProductos();
        showToast('Producto eliminado correctamente.', 'success');
      } catch {
        showToast('Error al eliminar el producto.', 'error');
      }
    }
  };

  const filtrados = productos.filter(p =>
    [p.nombre, p.categoria, p.marca, p.codigo_barra]
      .some(campo => campo?.toLowerCase().includes(filtro.toLowerCase()))
  );

  const totalPaginas = Math.ceil(filtrados.length / registrosPorPagina);
  const productosPagina = filtrados.slice(
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
        <span>📦 Productos Registrados</span>
        <input
          type="text"
          placeholder="🔍 Buscar por nombre, categoría, marca o código"
          className="form-control w-50"
          value={filtro}
          onChange={(e) => {
            setFiltro(e.target.value);
            setPaginaActual(1);
          }}
        />
      </div>

      <div className="card-body" style={{ overflowX: 'auto', maxHeight: '500px' }}>
        <table className="table table-bordered table-hover text-center align-middle" style={{ minWidth: '1200px' }}>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio Unitario</th>
              <th>Stock Inicial</th>
              <th>Cantidad Disponible</th>
              <th>Código de Barra</th>
              <th>Categoría</th>
              <th>Marca</th>
              <th>Fecha Ingreso</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosPagina.map(p => (
              <tr key={p.id} className={productosStockBajo.includes(p.id) ? 'table-danger' : ''}>
                <td>{p.id}</td>
                <td>
                  {p.nombre}
                  {productosStockBajo.includes(p.id) && <span className="text-danger ms-1">🚨</span>}
                </td>
                <td>{p.descripcion}</td>
                <td>S/ {p.precio_unitario}</td>
                <td>{p.stock_inicial}</td>
                <td>{p.cantidad_disponible}</td>
                <td>{p.codigo_barra}</td>
                <td>{p.categoria || '-'}</td>
                <td>{p.marca || '-'}</td>
                <td>{p.fecha_ingreso}</td>
                <td>
                  {p.imagen ? (
                    <img
                      src={`${backendUrl}${p.imagen}`}
                      alt="img"
                      className="rounded"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                  ) : '—'}
                </td>
                <td>
                  <button className="btn btn-sm btn-warning me-1" onClick={() => onEditar(p)}>✏️</button>
                  <button className="btn btn-sm btn-danger" onClick={() => confirmarEliminacion(p.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Controles de paginación */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="text-muted">
            Página {paginaActual} de {totalPaginas} ({filtrados.length} productos)
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

export default ProductoList;
