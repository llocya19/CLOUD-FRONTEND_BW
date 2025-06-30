// ✅ Archivo: src/pages/NoAutorizado.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const NoAutorizado: React.FC = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="text-danger">🚫 Acceso Denegado</h1>
      <p>No tienes permisos para acceder a esta página.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Volver al inicio
      </Link>
    </div>
  );
};

export default NoAutorizado;
