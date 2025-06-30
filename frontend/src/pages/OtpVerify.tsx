import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verificarOtp } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function OtpVerify() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const user_id = (location.state as any)?.user_id;
  console.log('🧪 user_id recibido:', user_id);
  console.log('🧪 Enviando OTP:', otp, 'con user_id:', user_id);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await verificarOtp(user_id, otp);
    if (res.data.user) {
      const userData = res.data.user;

      setUser(userData); // ✅ Ahora contiene rol + módulos
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/');
      console.log("✅ Usuario completo:", userData);
    }
  } catch (err: any) {
    setError(err.response?.data?.error || 'Error al verificar OTP');
  }
};

  return (
    <div className="container mt-5">
      <h3>Verifica tu identidad</h3>
      <p>Se ha enviado un código a tu correo.</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Código OTP</label>
          <input
            type="text"
            className="form-control"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button className="btn btn-primary" type="submit">
          Verificar
        </button>
      </form>
    </div>
  );
}
