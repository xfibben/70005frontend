"use client";

import Header from "../components/header";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Sidebar from "../components/sidebar";
import Link from "next/link";

export default function Student() {
    const [schools, setSchools] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchSchools = async () => {
            const token = Cookies.get('jwt');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/school', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('No se pudieron obtener las escuelas');
                }

                const data = await response.json();
                setSchools(data);
            } catch (error) {
                console.error('Ocurrio un error:', error);
                router.push('/login');
            }
        };

        fetchSchools();
    }, [router]);

    return (
        <div className="grid">
            <Header />
            <div>
                <Sidebar />
                <div className="flex-grow p-6">

                    <div className="bg-white shadow-md rounded p-6 mt-4">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b border-gray-200">Name</th>
                                    <th className="py-2 px-4 border-b border-gray-200">Last Name</th>
                                    <th className="py-2 px-4 border-b border-gray-200">DNI</th>
                                    <th className="py-2 px-4 border-b border-gray-200">School</th>
                                    <th className="py-2 px-4 border-b border-gray-200">Grade</th>
                                    <th className="py-2 px-4 border-b border-gray-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schools.map((school) => (
                                    <tr key={school.id}>
                                        <td className="py-2 px-4 border-b border-gray-200">{school.name}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{school.addres}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{school.email}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{school.phone}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{school.type}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <Link href = {`/school/${school.id}`}>Edit</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
