import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email || !contraseña) {
    setError('Completa todos los campos');
    return;
  }

  try {
    const res = await login(email, contraseña);
    console.log("🔐 Respuesta del login:", res);

    if (res && res.data?.user_id) {
      navigate('/otp-verify', {
        state: {
          user_id: res.data.user_id,
        },
      });
    } else {
      setError('Correo o contraseña inválidos');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    setError('Ocurrió un error al iniciar sesión');
  }
};


  return (
    <div className="login-bg">
      <div className="login-overlay">
        <div className="login-container">
          <form onSubmit={handleLogin} className="login-form">
            <img src="/images/bufalo.png" alt="Logo" className="logo" />
            <h2 className="title">BROS ON WHEELS</h2>
            <p className="subtitle">Accede al sistema de ventas</p>

            {error && <div className="alert-error">{error}</div>}

            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />

            <button type="submit">Iniciar sesión</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
