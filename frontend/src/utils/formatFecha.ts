// frontend/src/utils/formatFecha.ts

export function formatearFechaLocal(fechaBD: string): string {
  if (!fechaBD) return '';

  // Convierte la fecha con formato MySQL a ISO con zona horaria de Perú (-05:00)
  const isoConZona = fechaBD.replace(' ', 'T') + '-05:00';

  const fecha = new Date(isoConZona);

  // Formatea a una cadena amigable y correcta para Perú
  return fecha.toLocaleString('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: true,
  });
}
