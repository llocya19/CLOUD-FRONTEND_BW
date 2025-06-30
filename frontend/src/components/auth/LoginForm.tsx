// frontend/src/auth/LoginForm.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';  // Aquí solo necesitamos usar useAuth

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();  // Utilizamos el login del AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Llamamos a la función login del AuthContext, que maneja la autenticación
      const success = await login(email, contraseña);
      if (success) {
        navigate('/');  // Redirige al Home o página principal
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card shadow-sm p-4 mx-auto" style={{ maxWidth: 400 }}>
      <h4 className="mb-4 text-center">🔐 Iniciar Sesión</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label className="form-label">Correo electrónico</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Contraseña</label>
        <input
          type="password"
          className="form-control"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-100">Ingresar</button>
    </form>
  );
};

export default LoginForm;
