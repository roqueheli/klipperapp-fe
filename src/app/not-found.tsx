export default function NotFound() {
    return (
        <div className="min-h-screen w-full bg-gray-light flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="font-heading text-8xl font-bold text-vibrant-purple mb-4">
                    404
                </h1>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="animate-ping absolute h-16 w-16 rounded-full bg-electric-blue opacity-20"></span>
                    </div>
                    <div className="relative">
                        <svg
                            className="w-16 h-16 mx-auto text-electric-blue"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    </div>
                </div>
                <h2 className="font-heading text-3xl font-semibold text-gray-dark mt-8 mb-4">
                    ¡Página no encontrada!
                </h2>
                <p className="text-gray-dark mb-8 max-w-md mx-auto">
                    Lo sentimos, la página que estás buscando no existe o ha sido movida a otra ubicación.
                </p>
            </div>
        </div>
    );
}
