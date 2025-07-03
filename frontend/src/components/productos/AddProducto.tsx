import React, { useEffect, useState } from 'react';
import {
  guardarProductoConImagen,
  actualizarProducto,
  verificarDuplicado
} from '../../services/productosService';
const backendUrl = import.meta.env.VITE_API_URL;
interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio_unitario: number;
  cantidad_disponible: number;
  stock_inicial: number;
  imagen: any;
  categoria_id: number;
  marca_id: number;
  codigo_barra: string;
  fecha_ingreso: string;
}

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
  categorias: any[];
  marcas: any[];
  productoEdit: Producto | null;
  setProductoEdit: (p: Producto | null) => void;
  actualizarLista: () => void;
}

const AddProducto: React.FC<Props> = ({
  showToast,
  categorias,
  marcas,
  productoEdit,
  setProductoEdit,
  actualizarLista,
}) => {
  const fechaActual = new Date().toISOString().split('T')[0];

  const [producto, setProducto] = useState<Producto>({
    nombre: '',
    descripcion: '',
    precio_unitario: 1,
    cantidad_disponible: 1,
    stock_inicial: 1,
    imagen: '',
    categoria_id: 0,
    marca_id: 0,
    codigo_barra: '',
    fecha_ingreso: fechaActual,
  });

  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [productosTemp, setProductosTemp] = useState<Producto[]>([]);

  useEffect(() => {
  if (productoEdit) {
    console.log('Editando producto:', productoEdit);

    const formatearFecha = (fecha: string): string => {
      try {
        return new Date(fecha).toISOString().split('T')[0];
      } catch {
        return fechaActual;
      }
    };

    // Encontrar IDs reales desde nombres si vienen así
    const categoriaEncontrada = categorias.find(c => c.nombre === (productoEdit as any).categoria);
    const marcaEncontrada = marcas.find(m => m.nombre === (productoEdit as any).marca);

    setProducto({
      ...productoEdit,
      imagen: productoEdit.imagen || '',
      fecha_ingreso: formatearFecha(productoEdit.fecha_ingreso),
      categoria_id: productoEdit.categoria_id && productoEdit.categoria_id !== 0
        ? productoEdit.categoria_id
        : categoriaEncontrada?.id || 0,
      marca_id: productoEdit.marca_id && productoEdit.marca_id !== 0
        ? productoEdit.marca_id
        : marcaEncontrada?.id || 0,
    });
  }
}, [productoEdit, categorias, marcas]);



  const validar = async (): Promise<boolean> => {
    const err: { [key: string]: string } = {};
    let primerError = '';

    const nombreLimpio = producto.nombre.trim().toLowerCase();
    const codigoLimpio = producto.codigo_barra.trim().toLowerCase();

    // Validar nombre
    if (!producto.nombre || /^\d+$/.test(producto.nombre)) {
      err.nombre = 'El nombre no puede estar vacío ni ser solo números.';
    } else if (!productoEdit && productosTemp.some(p => p.nombre.trim().toLowerCase() === nombreLimpio)) {
      err.nombre = `El nombre "${producto.nombre}" ya está en la lista temporal.`;
    } else {
      try {
        const res = await verificarDuplicado('nombre', producto.nombre);
        if (res.data.existe && !productoEdit) {
          err.nombre = `El nombre "${producto.nombre}" ya existe en la base de datos.`;
        }
      } catch {
        showToast('Error al verificar duplicado de nombre.', 'error');
      }
    }

    // Código de barra
    if (!producto.codigo_barra || !/^[a-zA-Z0-9]+$/.test(producto.codigo_barra)) {
      err.codigo_barra = 'El código debe contener solo letras y números.';
    } else if (!productoEdit && productosTemp.some(p => p.codigo_barra.trim().toLowerCase() === codigoLimpio)) {
      err.codigo_barra = `El código "${producto.codigo_barra}" ya está en la lista temporal.`;
    } else {
      try {
        const res = await verificarDuplicado('codigo_barra', producto.codigo_barra);
        if (res.data.existe && !productoEdit) {
          err.codigo_barra = `El código "${producto.codigo_barra}" ya existe en la base de datos.`;
        }
      } catch {
        showToast('Error al verificar duplicado de código.', 'error');
      }
    }

    if (!producto.descripcion.trim()) err.descripcion = 'La descripción es obligatoria.';
    if (producto.precio_unitario <= 0) err.precio_unitario = 'El precio debe ser mayor a 0.';
    if (producto.stock_inicial <= 0 && producto.cantidad_disponible <= 0)
      err.stock_inicial = 'Stock inicial o cantidad disponible deben ser mayores a 0.';
    if (producto.categoria_id === 0) err.categoria_id = 'Selecciona una categoría.';
    if (producto.marca_id === 0) err.marca_id = 'Selecciona una marca.';
    if (!producto.fecha_ingreso) err.fecha_ingreso = 'Debes ingresar una fecha válida.';

    setErrores(err);

    if (Object.keys(err).length > 0) {
      primerError = Object.values(err)[0];
      showToast(primerError, 'error');
      return false;
    }

    return true;
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setProducto(prev => {
      const nuevo = { ...prev };
      if (['precio_unitario', 'stock_inicial', 'cantidad_disponible'].includes(name)) {
        const num = parseFloat(value);
        (nuevo as any)[name] = isNaN(num) ? 0 : num;
        if (name === 'stock_inicial') nuevo.cantidad_disponible = num;
        if (name === 'cantidad_disponible') nuevo.stock_inicial = num;
      } else if (['categoria_id', 'marca_id'].includes(name)) {
        (nuevo as any)[name] = parseInt(value) || 0;
      } else {
        (nuevo as any)[name] = value;
      }
      
      return nuevo;
    });

    setErrores(prev => ({ ...prev, [name]: '' }));
  };

  const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setProducto(prev => ({ ...prev, imagen: file || '' }));
  };

  const resetForm = () => {
    setProducto({
      nombre: '',
      descripcion: '',
      precio_unitario: 1,
      cantidad_disponible: 1,
      stock_inicial: 1,
      imagen: '',
      categoria_id: 0,
      marca_id: 0,
      codigo_barra: '',
      fecha_ingreso: fechaActual,
    });
    setErrores({});
    setProductoEdit(null);
  };

  const agregarTemporal = async (e: React.FormEvent) => {
    e.preventDefault();
    const valido = await validar();
    if (!valido) return;
    setProductosTemp([...productosTemp, producto]);
    showToast('Producto agregado temporalmente.', 'success');
    resetForm();
  };

  const actualizarExistente = async (e: React.FormEvent) => {
    e.preventDefault();
    const valido = await validar();
    if (!valido || !productoEdit) return;
    try {
      await actualizarProducto(productoEdit.id!, producto);
      showToast('Producto actualizado.', 'success');
      resetForm();
      actualizarLista();
    } catch {
      showToast('Error al actualizar producto.', 'error');
    }
  };

  const eliminarProductoTemp = (index: number) => {
    const copia = [...productosTemp];
    copia.splice(index, 1);
    setProductosTemp(copia);
  };

  const guardarEnBaseDeDatos = async () => {
    try {
      for (const p of productosTemp) {
        const formData = new FormData();
        for (const key in p) {
          if (key === 'imagen' && p.imagen instanceof File) {
            formData.append('imagen', p.imagen);
          } else {
            formData.append(key, (p as any)[key]);
          }
        }
        await guardarProductoConImagen(formData);
      }
      showToast('Productos guardados correctamente.', 'success');
      setProductosTemp([]);
      actualizarLista();
    } catch {
      showToast('Error al guardar productos.', 'error');
    }
  };
   console.log('Producto actual:', producto);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-dark text-white">
        {productoEdit ? '✏️ Editar Producto' : '🛒 Agregar Producto'}
      </div>
      <div className="card-body">
        <form onSubmit={productoEdit ? actualizarExistente : agregarTemporal} className="row g-3">
          {/* Nombre */}
          <div className="col-md-6">
            <label className="form-label">Nombre</label>
            <input name="nombre" value={producto.nombre} onChange={handleChange} className="form-control" />
            {errores.nombre && <div className="text-danger small">{errores.nombre}</div>}
          </div>

          {/* Código */}
          <div className="col-md-6">
            <label className="form-label">Código de Barra</label>
            <input name="codigo_barra" value={producto.codigo_barra} onChange={handleChange} className="form-control" />
            {errores.codigo_barra && <div className="text-danger small">{errores.codigo_barra}</div>}
          </div>

          {/* Precio, stock y cantidad */}
          <div className="col-md-4">
            <label className="form-label">Precio Unitario</label>
            <input type="number" name="precio_unitario" value={producto.precio_unitario} onChange={handleChange} className="form-control" />
            {errores.precio_unitario && <div className="text-danger small">{errores.precio_unitario}</div>}
          </div>
          <div className="col-md-4">
            <label className="form-label">Stock Inicial</label>
            <input type="number" name="stock_inicial" value={producto.stock_inicial} onChange={handleChange} className="form-control" />
            {errores.stock_inicial && <div className="text-danger small">{errores.stock_inicial}</div>}
          </div>
          <div className="col-md-4">
            <label className="form-label">Cantidad Disponible</label>
            <input type="number" name="cantidad_disponible" value={producto.cantidad_disponible} onChange={handleChange} className="form-control" />
          </div>

          {/* Categoría y marca */}
          <div className="col-md-6">
            <label className="form-label">Categoría</label>
            <select name="categoria_id" value={Number(producto.categoria_id)} onChange={handleChange} className="form-select">
            <option value={0}>-- Seleccione --</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={Number(cat.id)}>{cat.nombre}</option>
            ))}
          </select>

            {errores.categoria_id && <div className="text-danger small">{errores.categoria_id}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Marca</label>
            <select name="marca_id" value={Number(producto.marca_id)} onChange={handleChange} className="form-select">
            <option value={0}>-- Seleccione --</option>
            {marcas.map((mar) => (
              <option key={mar.id} value={Number(mar.id)}>{mar.nombre}</option>
            ))}
          </select>

            {errores.marca_id && <div className="text-danger small">{errores.marca_id}</div>}
          </div>

          {/* Descripción */}
          <div className="col-12">
            <label className="form-label">Descripción</label>
            <textarea name="descripcion" value={producto.descripcion} onChange={handleChange} className="form-control" />
            {errores.descripcion && <div className="text-danger small">{errores.descripcion}</div>}
          </div>

          {/* Imagen */}
          <div className="col-12">
            <label className="form-label">Imagen (opcional)</label>
            <input type="file" accept="image/*" onChange={handleImagen} className="form-control" />
            {/* Mostrar imagen previa si está en modo edición y no se ha cargado una nueva */}
            {typeof producto.imagen === 'string' && producto.imagen && (
              <img
                src={`${backendUrl}${producto.imagen}`}
                alt="preview"
                style={{ width: 60, height: 60, objectFit: 'cover', marginTop: '10px', borderRadius: '8px' }}
              />
            )}
          </div>

          {/* Fecha */}
          <div className="col-md-4">
            <label className="form-label">Fecha de Ingreso</label>
            <input type="date" name="fecha_ingreso" value={producto.fecha_ingreso} onChange={handleChange} className="form-control" />
            {errores.fecha_ingreso && <div className="text-danger small">{errores.fecha_ingreso}</div>}
          </div>

          <div className="col-12 text-end">
            <button type="submit" className="btn btn-primary">
              {productoEdit ? '💾 Actualizar' : '➕ Agregar a lista'}
            </button>
          </div>
        </form>

        {/* Tabla temporal */}
        {productosTemp.length > 0 && (
          <>
            <hr />
            <h5>📦 Productos agregados</h5>
            <div className="table-responsive">
              <table className="table table-bordered text-center align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Disponible</th>
                    <th>Código</th>
                    <th>Categoría</th>
                    <th>Marca</th>
                    <th>Fecha</th>
                    <th>Imagen</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {productosTemp.map((p, index) => (
                    <tr key={index}>
                      <td>{p.nombre}</td>
                      <td>{p.descripcion}</td>
                      <td>S/ {p.precio_unitario}</td>
                      <td>{p.stock_inicial}</td>
                      <td>{p.cantidad_disponible}</td>
                      <td>{p.codigo_barra}</td>
                      <td>{categorias.find(c => c.id === p.categoria_id)?.nombre || '-'}</td>
                      <td>{marcas.find(m => m.id === p.marca_id)?.nombre || '-'}</td>
                      <td>{p.fecha_ingreso}</td>
                      <td>
                        {p.imagen instanceof File
                          ? <img src={URL.createObjectURL(p.imagen)} alt="img" style={{ width: 40, height: 40 }} />
                          : '—'}
                      </td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => eliminarProductoTemp(index)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-end mt-2">
              <button className="btn btn-success" onClick={guardarEnBaseDeDatos}>
                💾 Guardar productos en BD
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddProducto;
