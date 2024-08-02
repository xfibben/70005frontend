"use client";

import Header from "../components/header";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Sidebar from "../components/sidebar";
import Link from "next/link";
import SearchBar from "../components/searcher";

export default function Contest() {
    const [contests, setContests] = useState([]);
    const [filteredContests, setFilteredContests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [contestsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const router = useRouter();

    useEffect(() => {
        const fetchContests = async () => {
            const token = Cookies.get('jwt');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}contest`, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('No se pudieron obtener los concursos');
                }

                const data = await response.json();
                setContests(data);
                setFilteredContests(data);
            } catch (error) {
                console.error('Ocurrió un error:', error);
                router.push('/login');
            }
        };

        fetchContests();
    }, [router]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        filterContests(term);
    };

    const filterContests = (term) => {
        let filtered = contests;
        
        if (term) {
            const searchTermLower = term.toLowerCase();
            filtered = filtered.filter(contest => 
                (contest.name && contest.name.toLowerCase().includes(searchTermLower)) ||
                (contest.date && contest.date.toLowerCase().includes(searchTermLower))
            );
        }

        setFilteredContests(filtered);
        setCurrentPage(1);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedContests = React.useMemo(() => {
        let sortableItems = [...filteredContests];
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
    }, [filteredContests, sortConfig]);

    // Get current contests
    const indexOfLastContest = currentPage * contestsPerPage;
    const indexOfFirstContest = indexOfLastContest - contestsPerPage;
    const currentContests = sortedContests.slice(indexOfFirstContest, indexOfLastContest);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const generatePageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(sortedContests.length / contestsPerPage); i++) {
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
                        <h2>Concursos</h2>
                        <button className="bg-green-500 p-2 rounded">
                            <Link href={`/contest/create`}>Crear nuevo Concurso</Link>
                        </button>
                    </div>
                    <SearchBar onSearch={handleSearch} />
                    <div className="bg-white shadow-md rounded p-6 mt-4">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b border-gray-200 cursor-pointer" onClick={() => requestSort('name')}>
                                        Nombre {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                    </th>
                                    <th className="py-2 px-4 border-b border-gray-200 cursor-pointer" onClick={() => requestSort('date')}>
                                        Fecha {sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                    </th>
                                    <th className="py-2 px-4 border-b border-gray-200">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentContests.map((contest) => (
                                    <tr key={contest.id}>
                                        <td className="py-2 px-4 border-b border-gray-200">{contest.name || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{contest.date || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <Link href={`/contest/${contest.id}`}>Editar</Link>
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
                            Anterior
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
                            disabled={indexOfLastContest >= sortedContests.length} 
                            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
