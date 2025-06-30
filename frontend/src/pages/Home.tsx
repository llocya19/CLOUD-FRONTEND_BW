
export default function Home() {
  return (
    <div
      className="content-background flex flex-col items-center justify-start text-center mt-4 rounded-xl shadow-inner px-4 py-10"
      style={{
        backgroundImage: `url('/images/bufalo.png')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        minHeight: '500px',
        boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.4)',
        backgroundColor: '#f5f5f5',
        color: '#2e2d2a',
      }}
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow">
        Bienvenido al Sistema de Ventas
      </h1>
      <p className="text-lg text-gray-700 drop-shadow-sm">
        Seleccione un módulo para empezar a gestionar.
      </p>
    </div>
  );
}
