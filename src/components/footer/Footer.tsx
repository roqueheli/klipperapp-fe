// components/Footer.tsx
const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 mt-12 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Sección 1: Acerca de */}
        <div>
          <h3 className="text-lg font-semibold text-electric-blue mb-2">
            KlipperApp
          </h3>
          <p>
            Plataforma de gestión para barberías, salones de belleza y spas.
            Asigna turnos, ordena al personal y optimiza la atención al cliente
            con colas inteligentes.
          </p>
        </div>

        {/* Sección 2: Navegación */}
        <div>
          <h3 className="text-lg font-semibold text-electric-blue mb-2">
            Enlaces útiles
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="/about" className="hover:text-electric-blue">
                Sobre nosotros
              </a>
            </li>
            <li>
              <a href="/features" className="hover:text-electric-blue">
                Características
              </a>
            </li>
            <li>
              <a href="/support" className="hover:text-electric-blue">
                Soporte
              </a>
            </li>
          </ul>
        </div>

        {/* Sección 3: Contacto / Legal */}
        <div>
          <h3 className="text-lg font-semibold text-electric-blue mb-2">
            Contacto
          </h3>
          <p>¿Preguntas o sugerencias?</p>
          <p className="mt-1">✉️ soporte@klipperapp.com</p>
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} KlipperApp. Todos los derechos
            reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
