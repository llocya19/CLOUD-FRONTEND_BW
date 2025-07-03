import React, { useState } from 'react';
import ventasService from '../../services/ventasService';
import Button from '../ui/Button';

interface Cliente {
  dni?: string;
  ruc?: string;
  nombre: string;
  direccion?: string;
}

interface ProductoVenta {
  id: number;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  stock: number;
}

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

const AddVenta: React.FC<Props> = ({ showToast }) => {
  const [cliente, setCliente] = useState<Cliente>({ nombre: '' });
  const [direccionBloqueada, setDireccionBloqueada] = useState(false);
  const [codigoBarra, setCodigoBarra] = useState('');
  const [productos, setProductos] = useState<ProductoVenta[]>([]);
  const [montoPagado, setMontoPagado] = useState('');

  const buscarCliente = async () => {
    const numero = cliente.dni || cliente.ruc;
    try {
      const res = await ventasService.buscarCliente(numero!);
      if (res.data) {
        const direccionApi = res.data.direccion?.trim();
        setCliente({
          ...cliente,
          nombre: res.data.nombre,
          direccion: direccionApi || ''
        });
        setDireccionBloqueada(!!direccionApi);
      } else {
        showToast('Cliente no encontrado en BD o API', 'error');
        setDireccionBloqueada(false);
      }
    } catch {
      showToast('Error al buscar cliente', 'error');
      setDireccionBloqueada(false);
    }
  };

  const buscarProducto = async () => {
    if (!codigoBarra) return;
    try {
      const res = await ventasService.buscarProducto(codigoBarra);
      const p = res.data;
      if (productos.find(prod => prod.id === p.id)) {
        showToast('Producto ya agregado', 'error');
        return;
      }
      setProductos([...productos, {
        id: p.id,
        nombre: p.nombre,
        precio_unitario: p.precio_unitario,
        cantidad: 1,
        stock: p.cantidad_disponible
      }]);
      setCodigoBarra('');
    } catch {
      showToast('Producto no encontrado', 'error');
    }
  };

  const actualizarCantidad = (index: number, valor: number) => {
    const copia = [...productos];
    if (valor <= 0) {
      showToast('Cantidad debe ser mayor a 0', 'error');
      return;
    }
    if (valor > copia[index].stock) {
      showToast('Stock insuficiente', 'error');
      return;
    }
    copia[index].cantidad = valor;
    setProductos(copia);
  };

  const eliminarProducto = (index: number) => {
    const copia = [...productos];
    copia.splice(index, 1);
    setProductos(copia);
  };

  const calcularSubtotal = () => {
    return productos.reduce((acc, p) => acc + p.precio_unitario * p.cantidad, 0);
  };

  const registrarVenta = async () => {
    const subtotal = calcularSubtotal();
    const igv = +(subtotal * 0.18).toFixed(2);
    const total = +(subtotal + igv).toFixed(2);
    const pagado = parseFloat(montoPagado);

    if (!cliente.nombre || productos.length === 0 || isNaN(pagado) || !cliente.direccion?.trim()) {
      showToast('Completa todos los campos obligatorios', 'error');
      return;
    }

    if (pagado < total) {
      showToast('El monto pagado no cubre el total de la venta', 'error');
      return;
    }

    try {
      await ventasService.crearVenta({
        cliente,
        productos,
        monto_pagado: pagado
      });
      showToast('Venta registrada correctamente', 'success');
      setCliente({ nombre: '' });
      setDireccionBloqueada(false);
      setProductos([]);
      setMontoPagado('');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Error al registrar venta', 'error');
    }
  };

  const subtotal = calcularSubtotal();
  const igv = +(subtotal * 0.18).toFixed(2);
  const total = +(subtotal + igv).toFixed(2);
  const cambio = parseFloat(montoPagado || '0') - total;

  return (
    <div className="form-card">
      <h2 className="form-title">Registrar Venta</h2>

      {/* Cliente */}
      <div className="mb-3">
        <label>DNI o RUC</label>
        <input
          className="form-control"
          value={cliente.dni || cliente.ruc || ''}
          onChange={e => {
            const val = e.target.value.replace(/\D/g, '');
            if (val.length <= 11) {
              if (val.length === 8) setCliente({ ...cliente, dni: val, ruc: '' });
              else setCliente({ ...cliente, ruc: val, dni: '' });
            }
          }}
          inputMode="numeric"
        />
        <Button onClick={buscarCliente} label="Buscar Cliente" className="btn-primary mt-2" />
      </div>

      <div className="mb-3">
        <label>Nombre:</label>
        <input className="form-control" value={cliente.nombre} readOnly />
      </div>

      <div className="mb-3">
        <label>Dirección:</label>
        <input
          className="form-control"
          value={cliente.direccion || ''}
          onChange={e => setCliente({ ...cliente, direccion: e.target.value })}
          readOnly={direccionBloqueada}
        />
      </div>

      {/* Productos */}
      <div className="mb-3">
        <label>Código de Barra</label>
        <input
          className="form-control"
          value={codigoBarra}
          onChange={e => setCodigoBarra(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && buscarProducto()}
        />
        <Button onClick={buscarProducto} label="Agregar Producto" className="btn-secondary mt-2" />
      </div>

      {/* ✅ Tabla responsive */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, i) => (
              <tr key={i}>
                <td>{p.nombre}</td>
                <td>S/. {p.precio_unitario}</td>
                <td>{p.stock}</td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={p.cantidad}
                    min={1}
                    max={p.stock}
                    onChange={e => actualizarCantidad(i, parseInt(e.target.value))}
                  />
                </td>
                <td>S/. {(p.precio_unitario * p.cantidad).toFixed(2)}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => eliminarProducto(i)}>X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="mb-3">
        <label>Subtotal: S/. {subtotal.toFixed(2)}</label><br />
        <label>IGV (18%): S/. {igv.toFixed(2)}</label><br />
        <label>Total: S/. {total.toFixed(2)}</label>
      </div>

      <div className="mb-3">
        <label>Monto Pagado</label>
        <input
          className="form-control"
          type="number"
          value={montoPagado}
          onChange={e => setMontoPagado(e.target.value)}
        />
        <p className="mt-2">Cambio: S/. {cambio.toFixed(2)}</p>
      </div>

      <Button onClick={registrarVenta} label="Registrar Venta" className="btn-success" />
    </div>
  );
};

export default AddVenta;
