"use client";
import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { useRouter } from 'next/navigation';
import Student from '../page';

const SchoolEdit = ({ params }) => { // Asume que recibes studentId como prop
    const [school, setSchool] = useState({
        "name": "",
        "address": "",
        "email": "",
        "phone": "",
        "type": "",
    });
    const [hasChanged, setHasChanged] = useState(false); // Estado para rastrear cambios
    const router = useRouter();

    useEffect(() => {

        const fetchSchoolData = async () => {
            if (params.id) { // Si hay un studentId, carga los datos del estudiante
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}school/${params.id}`, { credentials: 'include' });
                const data = await response.json();
                setSchool(data);
            }else{
                console.log('no existe este Colegio.')
            }
        };

        fetchSchoolData();
    }, [params]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSchool(prevState => {
            // Comprobar si el valor actual es diferente al nuevo valor antes de marcar como cambiado
            if (prevState[name] !== value) {
                setHasChanged(true); // Marcar que ha habido cambios
            }
            return {
                ...prevState,
                [name]: value
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        const method = params.id ? 'PUT' : 'POST'; // Si hay studentId, usa PUT, de lo contrario POST
        const url = params.id ? `${process.env.NEXT_PUBLIC_API_PATH}school/${params.id}` : `${process.env.NEXT_PUBLIC_API_PATH}school`;

        const response = await fetch(url, {
            credentials: 'include',
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(school),
        });

        if (!response.ok) {
            throw new Error(`error: ${response.statusText}`);
        }

        router.push('/school');
    }

    return (
        <div className="grid">
            <Header />
            <div className='flex'>
                <Sidebar />
                <div className="flex ml-64">
                    <form className="flex gap-4 p-6 bg-white shadow-md rounded-lg">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input 
                                name="name" 
                                value={school.name} 
                                placeholder="Ingrese nombre" 
                                onChange={handleChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
                            <input 
                                name="address" 
                                value={school.address} 
                                placeholder="Ingrese dirección" 
                                onChange={handleChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo</label>
                            <input 
                                name="email" 
                                value={school.email} 
                                placeholder="Ingrese correo" 
                                onChange={handleChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                            <input 
                                name="phone" 
                                value={school.phone} 
                                placeholder="Ingrese teléfono" 
                                onChange={handleChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo de Institución</label>
                            <select 
                                name="type" 
                                value={school.type} 
                                onChange={handleChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="Privada">Privada</option>
                                <option value="Publica">Pública</option>
                            </select>
                        </div>
                        {hasChanged && (
                            <div>
                                <button 
                                    type="submit" 
                                    onClick={handleSubmit} 
                                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Guardar cambios
                                </button>
                            </div>
                        )}
                    </form>

                </div>
            </div>
        </div>
    );
};

export default SchoolEdit;