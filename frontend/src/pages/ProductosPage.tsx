import React, { useEffect, useState } from 'react';
import AddProducto from '../components/productos/AddProducto';
import ProductoList from '../components/productos/ProductoList';
import Toast from '../components/ui/Toast';
import { getCategorias } from '../services/categoriasService';
import { getMarcas } from '../services/marcasService';

interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio_unitario: number;
  cantidad_disponible: number;
  stock_inicial: number;
  imagen: string;
  categoria_id: number;
  marca_id: number;
  codigo_barra: string;
  fecha_ingreso: string;
}

const ProductosPage: React.FC = () => {
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'warning' }>({
    msg: '',
    type: 'success'
  });

  const [categorias, setCategorias] = useState<any[]>([]);
  const [marcas, setMarcas] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [productoEdit, setProductoEdit] = useState<Producto | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'warning') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000);
  };

  const cargarDatos = async () => {
    try {
      const [resCat, resMar] = await Promise.all([
        getCategorias(),
        getMarcas()
      ]);
      setCategorias(resCat.data);
      setMarcas(resMar.data);
    } catch {
      showToast('Error al cargar categorías o marcas.', 'error');
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📦 Gestión de Productos</h2>

      {toast.msg && (
        <Toast
          message={toast.msg}
          type={toast.type}
        />
      )}

      <AddProducto
        showToast={showToast}
        categorias={categorias}
        marcas={marcas}
        productoEdit={productoEdit}
        setProductoEdit={setProductoEdit}
        actualizarLista={() => setRefreshKey(prev => prev + 1)}
      />

      <ProductoList
        onEditar={setProductoEdit}
        refreshKey={refreshKey}
        showToast={showToast}
      />
    </div>
  );
};

export default ProductosPage;
