import React, { useEffect, useState } from 'react';
import empresaService from '../../services/empresaService';

const backendUrl = import.meta.env.VITE_API_URL;

interface Empresa {
  nombre_comercial: string;
  ruc: string;
  direccion: string;
  telefono: string;
  correo: string;
  web: string;
  logo: string;
}

interface Props {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

const EmpresaInfo: React.FC<Props> = ({ showToast }) => {
  const [form, setForm] = useState<Empresa>({
    nombre_comercial: '',
    ruc: '',
    direccion: '',
    telefono: '',
    correo: '',
    web: '',
    logo: ''
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const cargarEmpresa = async () => {
      try {
        const res = await empresaService.obtener();
        if (res.data) {
          setForm(res.data);
          if (res.data.logo) {
            setPreview(`${backendUrl}/uploads/${res.data.logo}`);
          }
        }
      } catch {
        showToast('Error al obtener datos de empresa', 'error');
      }
    };
    cargarEmpresa();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('nombre_comercial', form.nombre_comercial);
      data.append('ruc', form.ruc);
      data.append('direccion', form.direccion);
      data.append('telefono', form.telefono);
      data.append('correo', form.correo);
      data.append('web', form.web);

      if (logoFile) {
        data.append('logo', logoFile);
      }

      await empresaService.guardar(data);
      showToast('Datos de empresa actualizados correctamente', 'success');
    } catch {
      showToast('Error al actualizar empresa', 'error');
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h2 className="mb-4">Información de la Empresa</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre Comercial</label>
          <input type="text" className="form-control" name="nombre_comercial" value={form.nombre_comercial} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">RUC</label>
          <input type="text" className="form-control" name="ruc" value={form.ruc} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input type="text" className="form-control" name="direccion" value={form.direccion} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input type="text" className="form-control" name="telefono" value={form.telefono} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input type="email" className="form-control" name="correo" value={form.correo} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Sitio Web</label>
          <input type="text" className="form-control" name="web" value={form.web} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Logo</label>
          <input type="file" className="form-control" onChange={handleLogoChange} accept="image/*" />
        </div>
        {preview && (
          <div className="mb-3">
            <label className="form-label">Vista Previa del Logo:</label><br />
            <img src={preview} alt="Logo Preview" style={{ maxWidth: '200px', border: '1px solid #ccc' }} />
          </div>
        )}
        <button type="submit" className="btn btn-primary">Guardar</button>
      </form>
    </div>
  );
};

export default EmpresaInfo;
