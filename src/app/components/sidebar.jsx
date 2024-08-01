import Link from 'next/link';

export default function Sidebar() {
    return (
        <div className="h-full w-64 bg-gray-800 text-white fixed top-16"> {/* Ajuste para dejar espacio para el header */}
            <div className="flex flex-col">
                <Link href="/student" className="flex items-center p-4 hover:bg-gray-700">
                    <span className="mr-3">👩‍🎓</span> Alumnos
                </Link>
                <Link href="/concursos" className="flex items-center p-4 hover:bg-gray-700">
                    <span className="mr-3">🏆</span> Concursos
                </Link>
                <Link href="/school" className="flex items-center p-4 hover:bg-gray-700">
                    <span className="mr-3">🏫</span> Colegios
                </Link>
                <Link href="/usuarios" className="flex items-center p-4 hover:bg-gray-700">
                    <span className="mr-3">👥</span> Usuarios
                </Link>
                <Link href="/pruebas" className="flex items-center p-4 hover:bg-gray-700">
                    <span className="mr-3">📝</span> Pruebas
                </Link>
            </div>
        </div>
    );
}
