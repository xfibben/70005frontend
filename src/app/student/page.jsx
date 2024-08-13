"use client";

import Header from "../components/header";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Sidebar from "../components/sidebar";
import Link from "next/link";
import SearchBar from "../components/searcher";

export default function Student() {
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage] = useState(30);
    const [searchTerm, setSearchTerm] = useState('');
    const [gradeFilter, setGradeFilter] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const router = useRouter();

    useEffect(() => {
        const fetchStudents = async () => {
            const token = Cookies.get('jwt');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}student`, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch students');
                }

                const data = await response.json();
                setStudents(data);
                setFilteredStudents(data);
            } catch (error) {
                console.error('An error occurred:', error);
                router.push('/login');
            }
        };

        const fetchGrades = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}grade`, {
                credentials: 'include'}
            );
            const data = await response.json();
            setGrades(data);
        };

        fetchStudents();
        fetchGrades();
    }, [router]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        filterStudents(term, gradeFilter);
    };

    const handleGradeFilter = (grade) => {
        setGradeFilter(grade);
        filterStudents(searchTerm, grade);
    };

    const filterStudents = (term, grade) => {
        let filtered = students;

        if (term) {
            const searchTermLower = term.toLowerCase();
            filtered = filtered.filter(student =>
                (student.name && student.name.toLowerCase().includes(searchTermLower)) ||
                (student.lastName && student.lastName.toLowerCase().includes(searchTermLower)) ||
                (student.secondName && student.secondName.toLowerCase().includes(searchTermLower)) ||
                (student.dni && student.dni.toString().toLowerCase().includes(searchTermLower)) ||
                (student.school.name && student.school.name.toLowerCase().includes(searchTermLower)) ||
                (student.grade.level && student.grade.level.toLowerCase().includes(searchTermLower)) ||
                (student.grade.grade && student.grade.grade.toString().toLowerCase().includes(searchTermLower))
            );
        }

        if (grade) {
            filtered = filtered.filter(student => `${student.grade.level}-${student.grade.grade}` === grade);
        }

        setFilteredStudents(filtered);
        setCurrentPage(1);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedStudents = React.useMemo(() => {
        let sortableItems = [...filteredStudents];
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
    }, [filteredStudents, sortConfig]);

    const handleDelete = async (studentId) => {
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este estudiante?");
        if (!confirmed) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}student/${studentId}`, {
                credentials: 'include',
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el estudiante');
            }

            // Elimina el estudiante de la lista en el frontend
            setStudents(students.filter(student => student.id !== studentId));
            setFilteredStudents(filteredStudents.filter(student => student.id !== studentId));
        } catch (error) {
            console.error('Ocurrió un error al eliminar el estudiante:', error);
        }
    };

    // Get current students
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = sortedStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const generatePageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(sortedStudents.length / studentsPerPage); i++) {
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
                        <h2>Alumnos</h2>
                        <button Link className="bg-green-500 p-2 rounded">
                            <Link href={`/student/create`}>Crear nuevo Estudiante</Link>
                        </button>
                    </div>
                    <SearchBar onSearch={handleSearch} />
                    <select onChange={(e) => handleGradeFilter(e.target.value)} className="mb-4">
                        <option value="">Todos los grados</option>
                        {grades.map(grade => (
                            <option key={grade.id} value={`${grade.level}-${grade.grade}`}>
                                {grade.level}-{grade.grade}
                            </option>
                        ))}
                    </select>

                    <div className="bg-white shadow-md rounded p-6 mt-4">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b border-gray-200 cursor-pointer" onClick={() => requestSort('name')}>
                                        Apellido Paterno{sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                    </th>
                                    <th className="py-2 px-4 border-b border-gray-200 cursor-pointer" onClick={() => requestSort('lastName')}>
                                        Apellido Materno {sortConfig.key === 'lastName' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                    </th>
                                    <th className="py-2 px-4 border-b border-gray-200 cursor-pointer" onClick={() => requestSort('dni')}>
                                        Nombre {sortConfig.key === 'dni' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                    </th>
                                    <th className="py-2 px-4 border-b border-gray-200 cursor-pointer" onClick={() => requestSort('school.name')}>
                                        DNI {sortConfig.key === 'school.name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                    </th>
                                    <th className="py-2 px-4 border-b border-gray-200 cursor-pointer" onClick={() => requestSort('grade.level')}>
                                        Procedencia {sortConfig.key === 'grade.level' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                    </th>
                                    <th className="py-2 px-4 border-b border-gray-200 cursor-pointer" onClick={() => requestSort('grade.level')}>
                                        Grado {sortConfig.key === 'grade.level' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                    </th>
                                    <th className="py-2 px-4 border-b border-gray-200">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentStudents.map((student) => (
                                    <tr key={student.id}>
                                        <td className="py-2 px-4 border-b border-gray-200">{student.lastName}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{student.secondName}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{student.name}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{student.dni}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{student.school.name}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{student.grade.level}-{student.grade.grade}</td>
                                        <td className="py-2 px-4 border-b border-gray-200 flex space-x-2">
                                            <Link href={`/student/${student.id}`} className="text-blue-600 hover:underline">Editar</Link>
                                            <button
                                                onClick={() => handleDelete(student.id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Eliminar
                                            </button>
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
                            disabled={indexOfLastStudent >= sortedStudents.length}
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
