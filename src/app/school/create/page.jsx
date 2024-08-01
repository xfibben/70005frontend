"use client";
import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { useRouter } from 'next/navigation';

const SchoolCreate = () => {
    const [school, setSchool] = useState({
        "name": "",
        "address": "",
        "email": "",
        "phone": "",
        "type": "Privada",
    });

    const router = useRouter();


    const handleChange = (e) => {
        const {name, value} = e.target;

        setSchool(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log(school)

    };

    const handleSubmit = async (school) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}school`, {
        credentials: 'include',
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(school),
    });

    if (!response.ok) {
        throw new Error(`error: ${response.message})`);
    }
    
    // Ensure the content type of the response is application/json before parsing
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        router.push('/school');
        return data;
    } else {
        throw new Error("Received non-JSON response from server");
    }
}


    return (
        <div className="grid">
            <Header />
            <div className='flex'>
                <Sidebar />
                <div className="flex ml-64">
                    <form className="flex gap-4 m-10">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input id="name" name="name" placeholder="Ingrese nombre" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
                                <input id="address" name="address" placeholder="Ingrese dirección" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo</label>
                                <input id="email" name="email" placeholder="Ingrese correo" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                                <input id="phone" name="phone" placeholder="Ingrese teléfono" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo de Institución</label>
                                <select id="type" name="type" onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                    <option value="Privada">Privada</option>
                                    <option value="Publica">Pública</option>
                                </select>
                            </div>
                            <div>
                                <button type="button" onClick={() => handleSubmit(school)} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Enviar
                                </button>
                            </div>
                        </form>
                </div>
            </div>
        </div>
    );
};

export default SchoolCreate;