"use client";

import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { useRouter } from 'next/navigation';
import Modal from 'react-modal';

const TestEdit = ({ params }) => {
    // ... (código anterior sin cambios)
    const [test, setTest] = useState({
        "name": "",
        "time": 0,
        "date": "",
        "gradeId": 0,
        "contestId": 0
    });
    const [students, setStudents] = useState([]);
    const [contests, setContests] = useState([]);
    const [grades, setGrades] = useState([]);
    const [hasChanged, setHasChanged] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [studentSearch, setStudentSearch] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' }); // Inicializar sortConfig
    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage] = useState(30);
    const [testResults, setTestResults] = useState([]);
    const [newResult, setNewResult] = useState({ studentId: 0, testId: parseInt(params.id), score: 0, time: 0 });

    const router = useRouter();

    const [sortBy, setSortBy] = useState('lastName');

    // ... (otros estados y efectos sin cambios)

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setSortBy(key);
    };

    const sortedTestResults = React.useMemo(() => {
        let sortableItems = [...testResults];
        if (sortBy === 'lastName') {
            sortableItems.sort((a, b) => {
                const lastNameA = a.student.lastName.toLowerCase();
                const lastNameB = b.student.lastName.toLowerCase();
                if (lastNameA < lastNameB) return -1;
                if (lastNameA > lastNameB) return 1;
                return a.student.name.toLowerCase().localeCompare(b.student.name.toLowerCase());
            });
        } else if (sortBy === 'score') {
            sortableItems.sort((a, b) => {
                if (b.score !== a.score) {
                    return b.score - a.score;
                }
                return a.time - b.time;
            });
        } else if (sortConfig.key !== null) {
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
    }, [testResults, sortConfig, sortBy]);

    useEffect(() => {
        const fetchContestsAndGrades = async () => {
            const contestsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}contest`, { credentials: 'include' });
            const contestsData = await contestsResponse.json();
            setContests(contestsData);

            const gradesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}grade`, { credentials: 'include' });
            const gradesData = await gradesResponse.json();
            setGrades(gradesData);
        };

        const fetchTestData = async () => {
            if (params.id) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}test/${params.id}`, { credentials: 'include' });
                const data = await response.json();
                setTest(data);
            } else {
                console.log('No hay testId');
            }
        };

        const fetchStudents = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}student`, { credentials: 'include' });
            const data = await response.json();
            setStudents(data);
        };

        const fetchTestResults = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}qualification/test/${params.id}`, { credentials: 'include' });
            const data = await response.json();
            setTestResults(data);
        };

        fetchContestsAndGrades();
        fetchTestData();
        fetchStudents();
        fetchTestResults();
    }, [params.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedValue = name === 'gradeId' || name === 'contestId' ? +value : value;
        setTest(prevState => {
            if (prevState[name] !== updatedValue) {
                setHasChanged(true);
            }
            return {
                ...prevState,
                [name]: updatedValue
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = params.id ? 'PUT' : 'POST';
        const url = params.id ? `${process.env.NEXT_PUBLIC_API_PATH}test/${params.id}` : `${process.env.NEXT_PUBLIC_API_PATH}test`;

        const response = await fetch(url, {
            credentials: 'include',
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(test),
        });

        if (!response.ok) {
            throw new Error(`error: ${response.statusText}`);
        }

        router.push('/test');
    };

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const handleStudentSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setStudentSearch(searchTerm);
        setFilteredStudents(students.filter(student => 
            student.name.toLowerCase().includes(searchTerm) ||
            student.lastName.toLowerCase().includes(searchTerm) ||
            student.dni.toLowerCase().includes(searchTerm)
        ));
    };

    const handleNewResultChange = (e) => {
        const { name, value } = e.target;
        setNewResult(prevState => ({
            ...prevState,
            [name]: name === 'studentId' || name === 'testId' ? +value : value
        }));
        console.log(newResult);
    };

    const addResult = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}qualification`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newResult),
        });

        if (response.ok) {
            const result = await response.json();
            setTestResults([...testResults, result]);
            useRouter.push(`/test/${params.id}`);
        } else {
            console.error('Error al agregar el resultado del test');
        }
    };

    const handleResultChange = (e, index) => {
        const { name, value } = e.target;
        const updatedResults = [...testResults];
        updatedResults[index][name] = value;
        setTestResults(updatedResults);
    };

    const saveResult = async (index) => {
        const result = { ...testResults[index] };
        console.log(result);
    
        // Convertir los campos 'time' y 'score' a números
        if (result.time) {
            result.time = parseFloat(result.time);
        }
        if (result.score) {
            result.score = parseFloat(result.score);
        }
    
        // Crear un nuevo objeto con solo los campos necesarios
        const payload = {
            studentId: result.studentId,
            testId: result.testId,
            score: result.score,
            time: result.time
        };
    
        console.log(payload);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}qualification/${result.id}`, {
            credentials: 'include',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });
    
        if (!response.ok) {
            console.error('Error al guardar el resultado');
        }
    };

    



    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = sortedTestResults.slice(indexOfFirstResult, indexOfLastResult);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const generatePageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(sortedTestResults.length / resultsPerPage); i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    // ... (otras funciones sin cambios)

    const deleteResult = async (id) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}qualification/${id}`, {
            credentials: 'include',
            method: 'DELETE',
        });

        if (response.ok) {
            setTestResults(testResults.filter(result => result.id !== id));
        } else {
            console.error('Error al eliminar el resultado');
        }
    };

    return (
        <div className="grid">
            <Header />
            <div className='flex flex-1'>
                <Sidebar />
                <div className="flex-1 p-4 ml-64">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <input name="name" value={test.name} placeholder="Ingrese el nombre" onChange={handleChange} className="border p-2 w-full" />
                        <input name="time" type="number" value={test.time} placeholder="Ingrese el tiempo (minutos)" onChange={handleChange} className="border p-2 w-full" />
                        <input name="date" type="date" value={test.date} placeholder="Ingrese la fecha" onChange={handleChange} className="border p-2 w-full" />
                        <select name="gradeId" onChange={handleChange} value={test.gradeId} className="border p-2 w-full">
                            <option>Seleccione un grado</option>
                            {grades.map(grade => (
                                <option key={grade.id} value={grade.id}>{grade.level}</option>
                            ))}
                        </select>
                        <select name="contestId" onChange={handleChange} value={test.contestId} className="border p-2 w-full">
                            <option>Seleccione un concurso</option>
                            {contests.map(contest => (
                                <option key={contest.id} value={contest.id}>{contest.name}</option>
                            ))}
                        </select>
                        {hasChanged && <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">Guardar Cambios</button>}
                    </form>

                    <button onClick={openModal} className="bg-blue-500 text-white p-2 rounded mt-4">Inscribir alumno</button>

                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        contentLabel="Agregar Resultado"
                    >
                        <h2 className="text-xl font-bold mb-4">Agregar Resultado</h2>
                        <input
                            type="text"
                            placeholder="Buscar estudiante"
                            value={studentSearch}
                            onChange={handleStudentSearch}
                            className="border p-2 w-full mb-4"
                        />
                        <select
                            name="studentId"
                            onChange={handleNewResultChange}
                            value={newResult.studentId}
                            className="border p-2 w-full mb-4"
                        >
                            <option value="">Seleccione un estudiante</option>
                            {filteredStudents.map(student => (
                                <option key={student.id} value={student.id}>
                                    {student.lastName} {student.name} {student.dni}
                                </option>
                            ))}
                        </select>
                        <button onClick={addResult} className="bg-blue-500 text-white p-2 rounded mt-4">Aceptar</button>
                        <button onClick={closeModal} className="bg-red-500 text-white p-2 rounded mt-4">Cancelar</button>
                    </Modal>

                    <table className="min-w-full bg-white mt-8">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200 cursor-pointer" onClick={() => requestSort('lastName')}>Apellido</th>
                                <th className="py-2 px-4 border-b border-gray-200">Nombre</th>
                                <th className="py-2 px-4 border-b border-gray-200">Nombre del Test</th>
                                <th className="py-2 px-4 border-b border-gray-200 cursor-pointer" onClick={() => requestSort('score')}>Puntaje</th>
                                <th className="py-2 px-4 border-b border-gray-200">Tiempo</th>
                                <th className="py-2 px-4 border-b border-gray-200">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentResults.map((result, index) => (
                                <tr key={result.id}>
                                    <td className="py-2 px-4 border-b border-gray-200">{result.student.lastName}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{result.student.name}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{result.test.name}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">
                                        <input
                                            type="number"
                                            name="score"
                                            value={result.score}
                                            onChange={(e) => handleResultChange(e, index)}
                                            className="border p-2 w-full"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-200">
                                        <input
                                            type="number"
                                            name="time"
                                            value={result.time}
                                            onChange={(e) => handleResultChange(e, index)}
                                            className="border p-2 w-full"
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-200">
                                        <button onClick={() => saveResult(index)} className="bg-green-500 text-white p-2 rounded">Guardar</button>
                                        <button onClick={() => deleteResult(result.id)} className="bg-red-500 text-white p-2 rounded ml-2">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-center mt-4">
                        {generatePageNumbers().map(number => (
                            <button key={number} onClick={() => paginate(number)} className="mx-1 px-2 py-1 border rounded">
                                {number}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestEdit;