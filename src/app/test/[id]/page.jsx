"use client";

import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { useRouter } from 'next/navigation';
import Modal from 'react-modal';
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper } from '@mui/material';
import Link from 'next/link';

const TestEdit = ({ params }) => {
    const [test, setTest] = useState({
        "name": "",
        "time": "",
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
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [sortedResults, setSortedResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage] = useState(30);
    const [isSorted, setIsSorted] = useState(false); // Nuevo estado para controlar si se debe ordenar
    const [testResults, setTestResults] = useState([]);
    const [newResult, setNewResult] = useState({
        studentId: 0,
        testId: parseInt(params.id), // Asignar automáticamente el TestId
        score: 0,
        startingTime: test.time || "", // Asignar automáticamente el startingTime
        endingTime: "",
        time: "" // Este será el tiempo total que tomará la prueba
    });


    const router = useRouter();

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        const sortedItems = [...testResults].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

    setSortedResults(sortedItems);
    setSortConfig({ key, direction });
};

    const sortedTestResults = React.useMemo(() => {
        let sortableItems = [...testResults];
        if (isSorted && sortConfig.key !== null) {
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
    }, [testResults, sortConfig, isSorted]);

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

        if (sortConfig.key) {
            setTimeout(() => {
                setSortConfig({ key: null, direction: 'ascending' });
                setSortedResults([]); // Resetea el ordenamiento para evitar que continúe aplicándose
            }, 0); // Esto asegura que el ordenamiento solo se aplique una vez
        }

        fetchContestsAndGrades();
        fetchTestData();
        fetchStudents();
        fetchTestResults();
    }, [params.id,sortConfig]);

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
            [name]: value
        }));
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
            closeModal();
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
        const payload = {
            studentId: result.studentId,
            testId: result.testId,
            score: parseFloat(result.score),
            startingTime: result.startingTime,
            endingTime: result.endingTime,
            time: result.time
        };

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
        }else{
            alert("Dato guardado con exito");
            router.push(`/test/${params.id}`)
        }
    };

    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = sortedResults.length ? sortedResults.slice(indexOfFirstResult, indexOfLastResult) : testResults.slice(indexOfFirstResult, indexOfLastResult);


    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const generatePageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(sortedTestResults.length / resultsPerPage); i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    const deleteResult = async (id) => {
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este resultado?");
        if (!confirmed) {
            return; // Si el usuario cancela, no hacer nada
        }

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
                        <TextField
                            name="name"
                            label="Nombre del test"
                            value={test.name}
                            onChange={handleChange}
                            className="border p-2 w-full"
                            variant="outlined"
                        />
                        <TextField
                            name="time"
                            label="Duración (HH:MM)"
                            value={test.time}
                            onChange={handleChange}
                            className="border p-2 w-full"
                            variant="outlined"
                        />
                        <TextField
                            name="date"
                            label="Fecha"
                            type="date"
                            value={test.date}
                            onChange={handleChange}
                            className="border p-2 w-full"
                            variant="outlined"
                        />
                        <FormControl variant="outlined" className="w-full">
                            <InputLabel>Seleccione un grado</InputLabel>
                            <Select
                                name="gradeId"
                                value={test.gradeId}
                                onChange={handleChange}
                                label="Seleccione un grado"
                            >
                                <MenuItem value="">
                                    <em>Seleccione un grado</em>
                                </MenuItem>
                                {grades.map(grade => (
                                    <MenuItem key={grade.id} value={grade.id}>{grade.level}-{grade.grade}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" className="w-full">
                            <InputLabel>Seleccione un concurso</InputLabel>
                            <Select
                                name="contestId"
                                value={test.contestId}
                                onChange={handleChange}
                                label="Seleccione un concurso"
                            >
                                <MenuItem value="">
                                    <em>Seleccione un concurso</em>
                                </MenuItem>
                                {contests.map(contest => (
                                    <MenuItem key={contest.id} value={contest.id}>{contest.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {hasChanged && (
                            <Button variant="contained" color="primary" type="submit" className="mt-4">
                                Guardar Cambios
                            </Button>
                        )}
                    </form>

                    <Button onClick={openModal} variant="contained" color="primary" className="mt-4">
                        Inscribir alumno
                    </Button>

                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        contentLabel="Agregar Resultado"
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                            },
                            content: {
                                top: '50%',
                                left: '50%',
                                right: 'auto',
                                bottom: 'auto',
                                marginRight: '-50%',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                                padding: '20px',
                                maxWidth: '500px',
                                width: '100%',
                            }
                        }}
                    >
                        <h2 className="text-xl font-bold mb-4">Agregar Resultado</h2>
                        <TextField
                            type="text"
                            placeholder="Buscar estudiante"
                            value={studentSearch}
                            onChange={handleStudentSearch}
                            className="border p-2 w-full mb-4"
                        />
                        <FormControl variant="outlined" className="w-full">
                            <InputLabel>Seleccione un estudiante</InputLabel>
                            <Select
                                name="studentId"
                                value={newResult.studentId}
                                onChange={handleNewResultChange}
                                label="Seleccione un estudiante"
                            >
                                <MenuItem value="">
                                    <em>Seleccione un estudiante</em>
                                </MenuItem>
                                {filteredStudents.map(student => (
                                    <MenuItem key={student.id} value={student.id}>
                                        {student.lastName} {student.secondName} {student.name} {student.dni}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            name="endingTime"
                            label="Hora de finalización (HH:MM)"
                            value={newResult.endingTime}
                            onChange={handleNewResultChange}
                            className="border p-2 w-full"
                            variant="outlined"
                        />
                        <Button onClick={addResult} variant="contained" color="primary" className="mt-4">
                            Aceptar
                        </Button>
                        <Button onClick={closeModal} variant="contained" color="secondary" className="mt-4">
                            Cancelar
                        </Button>
                    </Modal>

                    <TableContainer component={Paper} className="mt-8">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell onClick={() => requestSort('lastName')} className="cursor-pointer">
                                        Apellido {sortConfig.key === 'lastName' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                    </TableCell>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Nombre del Test</TableCell>
                                    <TableCell onClick={() => requestSort('score')} className="cursor-pointer">
                                        Puntaje {sortConfig.key === 'score' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                    </TableCell>
                                    <TableCell>Hora de inicio</TableCell>
                                    <TableCell>Hora de finalización</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentResults.map((result, index) => (
                                    <TableRow key={result.id}>
                                        <TableCell>{result.student?.lastName || 'N/A'}</TableCell>
                                        <TableCell>{result.student?.name || 'N/A'}</TableCell>
                                        <TableCell>{result.test?.name || 'N/A'}</TableCell>
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                name="score"
                                                value={result.score}
                                                onChange={(e) => handleResultChange(e, index)}
                                                className="border p-2 w-full"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                name="startingTime"
                                                value={result.startingTime}
                                                onChange={(e) => handleResultChange(e, index)}
                                                className="border p-2 w-full"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                name="endingTime"
                                                value={result.endingTime}
                                                onChange={(e) => handleResultChange(e, index)}
                                                className="border p-2 w-full"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button onClick={() => saveResult(index)} variant="contained" color="primary">
                                                Guardar
                                            </Button>
                                            <Button onClick={() => deleteResult(result.id)} variant="contained" color="secondary" className="ml-2">
                                                Eliminar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                    </TableContainer>

                    <div className="flex justify-center mt-4">
                        {generatePageNumbers().map(number => (
                            <Button key={number} onClick={() => paginate(number)} variant={currentPage === number ? "contained" : "outlined"} color="primary" className="mx-1">
                                {number}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestEdit;
