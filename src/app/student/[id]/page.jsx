"use client";
import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { useRouter } from 'next/navigation';
import { Grid, TextField, Button, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';

const StudentEdit = ({ params }) => {
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
    const [hasChanged, setHasChanged] = useState(false);
    const [error, setError] = useState(''); // Estado para almacenar el mensaje de error
    const router = useRouter();

    useEffect(() => {
        const fetchSchoolsAndGrades = async () => {
            const schoolsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}school`, { credentials: 'include' });
            const schoolsData = await schoolsResponse.json();
            setSchools(schoolsData);

            const gradesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}grade`, { credentials: 'include' });
            const gradesData = await gradesResponse.json();
            setGrades(gradesData);
        };

        const fetchStudentData = async () => {
            if (params.id) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}student/${params.id}`, { credentials: 'include' });
                const data = await response.json();
                setStudent(data);
            } else {
                console.log('No hay studentId');
            }
        };

        const fetchTests = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}test`, { credentials: 'include' });
            const data = await response.json();
            setTests(data);
        };

        fetchSchoolsAndGrades();
        fetchStudentData();
        fetchTests(); // Carga los tests
    }, [params]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedValue = name === 'schoolId' || name === 'gradeId' || name === 'testId' ? +value : value.toUpperCase();

        setStudent(prevState => {
            let newState = {
                ...prevState,
                [name]: updatedValue
            };

            if (name === 'schoolId') {
                const selectedSchool = schools.find(school => school.id === +value);
                if (selectedSchool && selectedSchool.name === "70005 CORAZON DE JESUS") {
                    newState = { ...newState, mode: "INTERNO" };
                }
            }

            if (prevState[name] !== updatedValue) {
                setHasChanged(true);  // Asegura que el botón aparezca al cambiar cualquier campo, incluyendo testId
            }

            return newState;
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Resetea el error al intentar enviar el formulario
        const method = 'PUT';
        const url = `${process.env.NEXT_PUBLIC_API_PATH}student/${params.id}`;

        try {
            const response = await fetch(url, {
                credentials: 'include',
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(student),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
            }

            // Si se seleccionó un Test, crea una Qualification
            if (selectedTestId) {
                const qualification = {
                    studentId: student.id,
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
            setError(error.message || 'Error desconocido');
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
                <div className="flex ml-64">
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
                                    name="name"
                                    label="Nombre"
                                    placeholder="Ingrese su nombre"
                                    value={student.name}
                                    onChange={handleChange}
                                    variant="outlined"
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="secondName"
                                    label="Segundo Nombre"
                                    placeholder="Ingrese su segundo nombre"
                                    value={student.secondName}
                                    onChange={handleChange}
                                    variant="outlined"
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="lastName"
                                    label="Apellido"
                                    placeholder="Ingrese su apellido"
                                    value={student.lastName}
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
                                    value={student.email}
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
                                    value={student.dni}
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
                                        value={student.schoolId}
                                        onChange={handleChange}
                                        label="Escuela"
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
                                        value={student.gradeId}
                                        onChange={handleChange}
                                        label="Grado"
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
                                        value={student.mode}
                                        onChange={handleChange}
                                        label="Modalidad"
                                    >
                                        <MenuItem value="INDEPENDIENTE">INDEPENDIENTE</MenuItem>
                                        <MenuItem value="DELEGACION">DELEGACION</MenuItem>
                                        <MenuItem value="INTERNO">INTERNO</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Seleccione una Prueba (Opcional)</InputLabel>
                                    <Select
                                        name="testId"
                                        value={selectedTestId || ""}
                                        onChange={(e) => setSelectedTestId(+e.target.value)}
                                        label="Seleccione una Prueba (Opcional)"
                                    >
                                        <MenuItem value="">
                                            <em>Seleccione una Prueba(Opcional)</em>
                                        </MenuItem>
                                        {tests.map(test => (
                                            <MenuItem key={test.id} value={test.id}>
                                                {test.name} - {test.date}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            {hasChanged && (
                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" type="submit">
                                        Guardar Cambios
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentEdit;
