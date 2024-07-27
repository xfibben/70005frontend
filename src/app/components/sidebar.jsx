import  Link  from 'next/link';

export default function Sidebar() {
    return (
        <div className="h-full w-1/8 bg-gray-800 text-white fixed">
            <div className="flex flex-col">
                {/* Menú Alumnos */}
                <Link href="/student" className="flex items-center p-4 hover:bg-gray-700">
                    <span className="mr-3">👩‍🎓</span> Alumnos
                </Link>
                {/* Menú Concursos */}
                <Link href="/concursos" className="flex items-center p-4 hover:bg-gray-700">
                    <span className="mr-3">🏆</span> Concursos
                </Link>
                {/* Menú Colegios */}
                <Link href="/school" className="flex items-center p-4 hover:bg-gray-700">
                    <span className="mr-3">🏫</span> Colegios
                </Link>
                {/* Menú Usuarios */}
                <Link href="/usuarios" className="flex items-center p-4 hover:bg-gray-700">
                    <span className="mr-3">👥</span> Usuarios
                </Link>
                {/* Menú Pruebas */}
                <Link href="/pruebas" className="flex items-center p-4 hover:bg-gray-700">
                    <span className="mr-3">📝</span> Pruebas
                </Link>
            </div>
        </div>
    );
}
