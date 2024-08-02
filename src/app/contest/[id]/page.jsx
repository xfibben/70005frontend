"use client";
import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { useRouter } from 'next/navigation';

const ContestEdit = ({ params }) => { // Asume que recibes contestId como prop
    const [contest, setContest] = useState({
        "name": "",
        "date": "",
    });
    const [hasChanged, setHasChanged] = useState(false); // Estado para rastrear cambios
    const router = useRouter();

    useEffect(() => {

        const fetchContestData = async () => {
            if (params.id) { // Si hay un contestId, carga los datos del concurso
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}contest/${params.id}`, { credentials: 'include' });
                const data = await response.json();
                setContest(data);
            } else {
                console.log('no existe este Concurso.')
            }
        };

        fetchContestData();
    }, [params]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContest(prevState => {
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
        const method = params.id ? 'PUT' : 'POST'; // Si hay contestId, usa PUT, de lo contrario POST
        const url = params.id ? `${process.env.NEXT_PUBLIC_API_PATH}contest/${params.id}` : `${process.env.NEXT_PUBLIC_API_PATH}contest`;

        const response = await fetch(url, {
            credentials: 'include',
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contest),
        });

        if (!response.ok) {
            throw new Error(`error: ${response.statusText}`);
        }

        router.push('/contest');
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
                                value={contest.name} 
                                placeholder="Ingrese nombre" 
                                onChange={handleChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Fecha</label>
                            <input 
                                name="date" 
                                type="date" 
                                value={contest.date} 
                                placeholder="Ingrese fecha" 
                                onChange={handleChange} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
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

export default ContestEdit;
