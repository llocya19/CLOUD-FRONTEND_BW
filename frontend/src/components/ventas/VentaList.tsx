import React, { useState } from 'react';
import ventasService from '../../services/ventasService';
import Toast from '../ui/Toast';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

interface Venta {
  id: number;
  fecha_venta: string;
  total: number;
  nombre: string;
  dni: string;
}

interface DetalleVenta {
  id: number;
  fecha_venta: string;
  cliente: {
    nombre: string;
    direccion: string;
  };
  productos: {
    nombre: string;
    precio_unitario: number;
    cantidad: number;
    subtotal: number;
  }[];
  total: number;
  monto_pagado: number;
  cambio: number;
}

const VentaList: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [detalle, setDetalle] = useState<DetalleVenta | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' }>({ msg: '', type: 'success' });
  const [showModal, setShowModal] = useState(false);
  const [filtro, setFiltro] = useState('');

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000);
  };

  const cargarUltimasVentas = async () => {
    try {
      const res = await ventasService.listarVentas();
      const ultimas10 = res.data
        .map((v: any) => ({
          ...v,
          total: Number(v.total)
        }))
        .sort((a: any, b: any) => new Date(b.fecha_venta).getTime() - new Date(a.fecha_venta).getTime())
        .slice(0, 10);
      setVentas(ultimas10);
    } catch {
      showToast('Error al cargar ventas', 'error');
    }
  };

  const verDetalle = async (id: number) => {
    try {
      const res = await ventasService.obtenerDetalle(id);
      setDetalle(res.data);
      setShowModal(true);
    } catch {
      showToast('Error al obtener detalle', 'error');
    }
  };

  // ✅ Mostrar fecha tal como se guarda en BD (sin restar 5 horas)
  const formatearFecha = (fecha: string) => {
    if (!fecha) return 'Fecha no disponible';
    const fechaLocal = dayjs(fecha); // no usar utc() ni tz()
    return fechaLocal.isValid()
      ? fechaLocal.format('DD/MM/YYYY hh:mm A')
      : 'Fecha inválida';
  };

  const filtrarVentas = () => {
    const filtroLower = filtro.toLowerCase();
    return ventas.filter(
      (v) =>
        v.nombre.toLowerCase().includes(filtroLower) ||
        v.dni?.toString().includes(filtroLower)
    );
  };

  return (
    <div className="card p-3 shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Ventas recientes</h2>
        <Button variant="primary" onClick={cargarUltimasVentas}>Listar Ventas</Button>
      </div>

      <input
        type="text"
        placeholder="Buscar por DNI o nombre"
        className="form-control mb-3"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      <table className="table table-bordered table-hover table-striped">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Fecha y hora</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtrarVentas().map((v, i) => (
            <tr key={v.id}>
              <td>{i + 1}</td>
              <td>{v.nombre}</td>
              <td>{formatearFecha(v.fecha_venta)}</td>
              <td>S/. {v.total.toFixed(2)}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => verDetalle(v.id)}>
                  Detalle
                </Button>
                <a
                  href={`/api/ventas/${v.id}/boleta`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success btn-sm ms-2"
                >
                  PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Detalle */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Venta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detalle && (
            <>
              <p><strong>Cliente:</strong> {detalle.cliente.nombre}</p>
              <p><strong>Dirección:</strong> {detalle.cliente.direccion}</p>
              <p><strong>Fecha:</strong> {formatearFecha(detalle.fecha_venta)}</p>
              <p><strong>Pagado:</strong> S/. {detalle.monto_pagado.toFixed(2)}</p>
              <p><strong>Cambio:</strong> S/. {detalle.cambio.toFixed(2)}</p>
              <p><strong>Total:</strong> S/. {detalle.total.toFixed(2)}</p>
              <hr />
              <div className="table-responsive">
                <table className="table table-sm table-bordered">
                  <thead className="table-secondary">
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalle.productos.map((p, idx) => (
                      <tr key={idx}>
                        <td>{p.nombre}</td>
                        <td>S/. {p.precio_unitario.toFixed(2)}</td>
                        <td>{p.cantidad}</td>
                        <td>S/. {p.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {toast.msg && <Toast message={toast.msg} type={toast.type} />}
    </div>
  );
};

export default VentaList;
