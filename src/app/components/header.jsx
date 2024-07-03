import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Verificar si el token JWT existe en las cookies
        const token = Cookies.get('jwt');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = async () => {
        try {
            // Llamar a la API /auth/logout
            await fetch('http://localhost:5000/auth/logout', {
                method: 'POST', // o GET, dependiendo de cómo esté configurada tu API
                credentials: 'include', // Asegura que las cookies se envíen con la solicitud
            });

            // Eliminar el token JWT de las cookies
            Cookies.remove('jwt'); // Usar 'Cookies.remove' para eliminar la cookie con el nombre correcto
            router.push('/login');
            
            setIsLoggedIn(false);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <div className="flex justify-between items-center p-4 bg-gray-100">
            {/* Imagen a la izquierda */}
            <img src="/path-to-your-image.png" alt="Logo" className="h-10" />

            {/* Botón de iniciar/cerrar sesión a la derecha */}
            {isLoggedIn ? (
                <button 
                    onClick={handleLogout} 
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Cerrar sesión
                </button>
            ) : (
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    <Link href="/login">Iniciar sesión</Link>
                </button>
            )}
        </div>
    );
};

export default Header;
