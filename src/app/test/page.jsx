"use client";

import Header from "../components/header";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Sidebar from "../components/sidebar";
import Link from "next/link";
import SearchBar from "../components/searcher";

export default function Student() {
    const [tests, setTests] = useState([]);
    const [contests, setContests] = useState([]);
    const [filteredTests, setFilteredTests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [testsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [contestFilter, setContestFilter] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const router = useRouter();

    useEffect(() => {
        const fetchTests = async () => {
            const token = Cookies.get('jwt');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}test`, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('No se pudieron obtener las pruebas');
                }

                const data = await response.json();
                setTests(data);
                setFilteredTests(data);
            } catch (error) {
                console.error('An error occurred:', error);
                router.push('/login');
            }
        };

        const fetchContests = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}contest`, {
                credentials: 'include'}
            );
            const data = await response.json();
            setContests(data);
        };

        fetchTests();
        fetchContests();
    }, [router]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        filterTests(term, contestFilter);
    };

    const handleContestFilter = (contest) => {
        setContestFilter(contest);
        filterTests(searchTerm, contest);
    };

    const filterTests = (term, contest) => {
        let filtered = tests;

        if (term) {
            const searchTermLower = term.toLowerCase();
            filtered = filtered.filter(test =>
                (test.name && test.name.toLowerCase().includes(searchTermLower)) ||
                (test.date && test.date.toLowerCase().includes(searchTermLower)) ||
                (test.contestId &&  te)
            );
        }

        if (contest) {
            filtered = filtered.filter(test => test.contestId === contest);
        }

        setFilteredTests(filtered);
        setCurrentPage(1);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedTests = React.useMemo(() => {
        let sortableItems = [...filteredTests];
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
    }, [filteredTests, sortConfig]);

    // Get current tests
    const indexOfLastTest = currentPage * testsPerPage;
    const indexOfFirstTest = indexOfLastTest - testsPerPage;
    const currentTests = sortedTests.slice(indexOfFirstTest, indexOfLastTest);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const generatePageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(sortedTests.length / testsPerPage); i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <div className="grid">
            <Header />
            <div className='flex'>
                <Sidebar />
                <div className="ml-64 flex-grow p-6">
                    <div className="flex justify-between">
                        <h2>Pruebas</h2>
                        <button Link className="bg-green-500 p-2 rounded" >
                            <Link href={`/test/create`}>Crear nueva Prueba</Link>
                        </button>
                    </div>
                    <SearchBar onSearch={handleSearch} />
                    <select onChange={(e) => handleContestFilter(e.target.value)} className="mb-4">
                        <option value="">Todos los concursos</option>
                        {contests.map(contest => (
                            <option key={contest.id} value={contest.id}>{contest.name}</option>
                        ))}
                    </select>
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
                                    <th className="py-2 px-4 border-b border-gray-200 cursor-pointer" onClick={() => requestSort('contestId')}>
                                        Concurso {sortConfig.key === 'contestId' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                    </th>
                                    <th className="py-2 px-4 border-b border-gray-200">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTests.map((test) => (
                                    <tr key={test.id}>
                                        <td className="py-2 px-4 border-b border-gray-200">{test.name}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{test.date}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{contests.find(contest => contest.id === test.contestId)?.name}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <Link href={`/test/${test.id}`}>Editar</Link>
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
                            disabled={indexOfLastTest >= sortedTests.length}
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
