"use client";

import Header from "../components/header";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Sidebar from "../components/sidebar";
import Link from "next/link";
import SearchBar from "../components/searcher";

export default function Student() {
    const [schools, setSchools] = useState([]);
    const [filteredSchools, setFilteredSchools] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [schoolsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const router = useRouter();

    useEffect(() => {
        const fetchSchools = async () => {
            const token = Cookies.get('jwt');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}school`, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('No se pudieron obtener las escuelas');
                }

                const data = await response.json();
                setSchools(data);
                setFilteredSchools(data);
            } catch (error) {
                console.error('Ocurrio un error:', error);
                router.push('/login');
            }
        };

        fetchSchools();
    }, [router]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        filterSchools(term, typeFilter);
    };

    const handleTypeFilter = (type) => {
        setTypeFilter(type);
        filterSchools(searchTerm, type);
    };

    const filterSchools = (term, type) => {
        let filtered = schools;
        
        if (term) {
            const searchTermLower = term.toLowerCase();
            filtered = filtered.filter(school => 
                (school.name && school.name.toLowerCase().includes(searchTermLower)) ||
                (school.addres && school.addres.toLowerCase().includes(searchTermLower)) ||
                (school.email && school.email.toLowerCase().includes(searchTermLower)) ||
                (school.phone && school.phone.toString().toLowerCase().includes(searchTermLower)) ||
                (school.type && school.type.toLowerCase().includes(searchTermLower))
            );
        }

        if (type) {
            filtered = filtered.filter(school => school.type === type);
        }

        setFilteredSchools(filtered);
        setCurrentPage(1);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedSchools = React.useMemo(() => {
        let sortableItems = [...filteredSchools];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredSchools, sortConfig]);

    // Get current schools
    const indexOfLastSchool = currentPage * schoolsPerPage;
    const indexOfFirstSchool = indexOfLastSchool - schoolsPerPage;
    const currentSchools = sortedSchools.slice(indexOfFirstSchool, indexOfLastSchool);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const generatePageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(sortedSchools.length / schoolsPerPage); i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <div className="grid">
            <Header/>
            <div>
                <Sidebar />
                <div className="flex-grow p-6 ml-64">
                    <div className="flex justify-between">
                        <h2>Escuelas</h2>
                        <button Link className="bg-green-500 p-2 rounded" >
                            <Link href={`/school/create`}>Crear nueva Escuela</Link>
                        </button>
                    </div>
                    <SearchBar onSearch={handleSearch} />
                    <select onChange={(e) => handleTypeFilter(e.target.value)} className="mb-4">
                        <option value="">Todos los tipos</option>
                        <option value="Publica">Público</option>
                        <option value="Privada">Privado</option>
                    </select>
                    <div className="bg-white shadow-md rounded p-6 mt-4">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b border-gray-200 cursor-pointer" onClick={() => requestSort('name')}>
                                        Nombre {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                    </th>
                                    <th className="py-2 px-4 border-b border-gray-200 cursor-pointer" onClick={() => requestSort('addres')}>
                                        Dirección {sortConfig.key === 'addres' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                    </th>
                                    <th className="py-2 px-4 border-b border-gray-200 cursor-pointer" onClick={() => requestSort('email')}>
                                        Correo {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                    </th>
                                    <th className="py-2 px-4 border-b border-gray-200 cursor-pointer" onClick={() => requestSort('phone')}>
                                        Celular {sortConfig.key === 'phone' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                    </th>
                                    <th className="py-2 px-4 border-b border-gray-200 cursor-pointer" onClick={() => requestSort('type')}>
                                        Tipo {sortConfig.key === 'type' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                    </th>
                                    <th className="py-2 px-4 border-b border-gray-200">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentSchools.map((school) => (
                                    <tr key={school.id}>
                                        <td className="py-2 px-4 border-b border-gray-200">{school.name || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{school.addres || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{school.email || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{school.phone || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{school.type || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <Link href={`/school/${school.id}`}>Editar</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex items-center justify-center">
                        <button 
                            onClick={() => paginate(currentPage - 1)} 
                            disabled={currentPage === 1} 
                            className="mr-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                        >
                            Previous
                        </button>
                        {generatePageNumbers().map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`mx-1 px-3 py-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                {number}
                            </button>
                        ))}
                        <button 
                            onClick={() => paginate(currentPage + 1)} 
                            disabled={indexOfLastSchool >= sortedSchools.length} 
                            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );};
