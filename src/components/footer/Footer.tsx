import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-white text-gray-800 border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Sección 1: Acerca de */}
        <div>
          <div className="flex items-center mb-2">
            <Image
              src="/klipperapp.png"
              alt="KlipperApp Logo"
              width={32}
              height={32}
            />
            <h3 className="ml-2 text-lg font-semibold text-electric-blue">
              KlipperApp
            </h3>
          </div>
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
              <Link href="/about" className="hover:text-electric-blue">
                Sobre nosotros
              </Link>
            </li>
            <li>
              <Link href="/features" className="hover:text-electric-blue">
                Características
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-electric-blue">
                Soporte
              </Link>
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
          <div className="mt-4 text-xs">
            © {new Date().getFullYear()} KlipperApp. Todos los derechos
            reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

