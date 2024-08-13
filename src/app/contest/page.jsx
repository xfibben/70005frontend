"use client";

import Header from "../components/header";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Sidebar from "../components/sidebar";
import Link from "next/link";
import SearchBar from "../components/searcher";
import { Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, Alert } from '@mui/material';

export default function Contest() {
    const [contests, setContests] = useState([]);
    const [filteredContests, setFilteredContests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [contestsPerPage] = useState(30);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [error, setError] = useState('');

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
                setError(error.message);
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

    const handleDelete = async (id) => {
        setError('');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}contest/${id}`, {
                credentials: 'include',
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el concurso');
            }

            setContests(prev => prev.filter(contest => contest.id !== id));
            setFilteredContests(prev => prev.filter(contest => contest.id !== id));
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
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
            <Header />
            <div className='flex'>
                <Sidebar />
                <div className="ml-64 flex-grow p-6">
                    <div className="flex justify-between mb-4">
                        <h2>Concursos</h2>
                        <Button variant="contained" color="primary">
                            <Link href={`/contest/create`} className="text-white">Crear nuevo Concurso</Link>
                        </Button>
                    </div>
                    {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
                    <SearchBar onSearch={handleSearch} />
                    <TableContainer component={Paper} className="mt-4">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell onClick={() => requestSort('name')} className="cursor-pointer">
                                        Nombre {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                    </TableCell>
                                    <TableCell onClick={() => requestSort('date')} className="cursor-pointer">
                                        Fecha {sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                    </TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentContests.map((contest) => (
                                    <TableRow key={contest.id}>
                                        <TableCell>{contest.name || 'N/A'}</TableCell>
                                        <TableCell>{contest.date || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Link href={`/contest/${contest.id}`} className="text-blue-600 hover:underline">Editar</Link>
                                            <Button
                                                color="secondary"
                                                onClick={() => handleDelete(contest.id)}
                                                className="ml-4"
                                            >
                                                Eliminar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className="mt-4 flex items-center justify-center">
                        <Button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="mr-2"
                            variant="contained"
                            color="primary"
                        >
                            Anterior
                        </Button>
                        {generatePageNumbers().map(number => (
                            <Button
                                key={number}
                                onClick={() => paginate(number)}
                                variant={currentPage === number ? "contained" : "outlined"}
                                color="primary"
                                className="mx-1"
                            >
                                {number}
                            </Button>
                        ))}
                        <Button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={indexOfLastContest >= sortedContests.length}
                            className="ml-2"
                            variant="contained"
                            color="primary"
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
