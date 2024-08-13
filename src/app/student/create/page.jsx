"use client";
import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { useRouter } from 'next/navigation';
import { Grid, TextField, Button, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';

const StudentCreate = () => {
    const [student, setStudent] = useState({
        "lastName": "",
        "secondName": "",
        "name": "",
        "email": "",
        "dni": "",
        "schoolId": 0,
        "gradeId": 0,
        "mode": "INDEPENDIENTE", // Valor predeterminado
    });
    const [schools, setSchools] = useState([]);
    const [grades, setGrades] = useState([]);
    const [tests, setTests] = useState([]);
    const [selectedTestId, setSelectedTestId] = useState(null); // Estado para manejar el test seleccionado
    const [schoolSearch, setSchoolSearch] = useState('');
    const [gradeSearch, setGradeSearch] = useState('');
    const [error, setError] = useState(''); // Estado para manejar errores
    const router = useRouter();

    useEffect(() => {
        const fetchSchools = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}school`, {
                credentials: 'include'
            });
            const data = await response.json();
            setSchools(data);
        };

        const fetchGrades = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}grade`, {
                credentials: 'include'}
            );
            const data = await response.json();
            setGrades(data);
        };

        const fetchTests = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}test`, {
                credentials: 'include'
            });
            const data = await response.json();
            setTests(data);
        };

        fetchSchools();
        fetchGrades();
        fetchTests(); // Carga los tests
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedValue = name === 'schoolId' || name === 'gradeId' ? +value : value.toUpperCase();

        setStudent(prevState => {
            let newState = {
                ...prevState,
                [name]: updatedValue
            };

            // Verifica si la escuela seleccionada es "70005 CORAZON DE JESUS"
            if (name === 'schoolId') {
                const selectedSchool = schools.find(school => school.id === +value);
                if (selectedSchool && selectedSchool.name === "70005 CORAZON DE JESUS") {
                    newState = { ...newState, mode: "INTERNO" };
                }
            }

            return newState;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Resetea el error al intentar enviar el formulario
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}student`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(student),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
            }

            const createdStudent = await response.json(); // Obtén el estudiante creado

            // Si se seleccionó un Test, crea una Qualification
            if (selectedTestId) {
                const qualification = {
                    studentId: createdStudent.id,
                    testId: selectedTestId,
                    startingTime: tests.find(test => test.id === selectedTestId)?.time || '',
                    endingTime: "", // Este puede ser llenado posteriormente
                };

                const qualificationResponse = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}qualification`, {
                    credentials: 'include',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(qualification),
                });

                if (!qualificationResponse.ok) {
                    const errorData = await qualificationResponse.json();
                    throw new Error(errorData.message || `Error al crear la Qualification: ${qualificationResponse.status} ${qualificationResponse.statusText}`);
                }
            }

            router.push('/student');
        } catch (error) {
            setError(error.message); // Almacena el mensaje de error
        }
    };

    const handleSchoolSearchChange = (e) => {
        setSchoolSearch(e.target.value.toUpperCase());
    };

    const handleGradeSearchChange = (e) => {
        setGradeSearch(e.target.value.toUpperCase());
    };

    return (
        <div className="grid">
            <Header />
            <div className='flex'>
                <Sidebar />
                <div className="ml-64 flex">
                    <form className="form-container" onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {error && (
                                    <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
                                )}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="lastName"
                                    label="Apellido Paterno"
                                    placeholder="Ingrese Apellido Paterno"
                                    onChange={handleChange}
                                    variant="outlined"
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="secondName"
                                    label="Apellido Materno"
                                    placeholder="Ingrese su apellido"
                                    onChange={handleChange}
                                    variant="outlined"
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="name"
                                    label="Nombre"
                                    placeholder="Ingrese su nombre"
                                    onChange={handleChange}
                                    variant="outlined"
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="email"
                                    label="Email"
                                    placeholder="Ingrese su email"
                                    onChange={handleChange}
                                    variant="outlined"
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="dni"
                                    label="DNI"
                                    placeholder="Ingrese su DNI"
                                    onChange={handleChange}
                                    variant="outlined"
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Escuela</InputLabel>
                                    <Select
                                        name="schoolId"
                                        onChange={handleChange}
                                        label="Escuela"
                                        value={student.schoolId}
                                        onInput={handleSchoolSearchChange}
                                    >
                                        <MenuItem value="">
                                            <em>Seleccione una escuela</em>
                                        </MenuItem>
                                        {schools.filter(school => school.name.includes(schoolSearch)).map(school => (
                                            <MenuItem key={school.id} value={school.id}>
                                                {school.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Grado</InputLabel>
                                    <Select
                                        name="gradeId"
                                        onChange={handleChange}
                                        label="Grado"
                                        value={student.gradeId}
                                        onInput={handleGradeSearchChange}
                                    >
                                        <MenuItem value="">
                                            <em>Seleccione un grado</em>
                                        </MenuItem>
                                        {grades.filter(grade => `${grade.grade}-${grade.level}`.includes(gradeSearch)).map(grade => (
                                            <MenuItem key={grade.id} value={grade.id}>
                                                {grade.grade}-{grade.level}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Modalidad</InputLabel>
                                    <Select
                                        name="mode"
                                        onChange={handleChange}
                                        label="Modalidad"
                                        value={student.mode}
                                    >
                                        <MenuItem value="INDEPENDIENTE">INDEPENDIENTE</MenuItem>
                                        <MenuItem value="DELEGACION">DELEGACION</MenuItem>
                                        <MenuItem value="INTERNO">INTERNO</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Seleccione un Test</InputLabel>
                                    <Select
                                        name="testId"
                                        onChange={(e) => setSelectedTestId(e.target.value)}
                                        label="Seleccione un Test"
                                        value={selectedTestId}
                                    >
                                        <MenuItem value="">
                                            <em>Seleccione un Test</em>
                                        </MenuItem>
                                        {tests.map(test => (
                                            <MenuItem key={test.id} value={test.id}>
                                                {test.name} - {test.date}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" type="submit">
                                    Enviar
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentCreate;
