"use client";
import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { useRouter } from 'next/navigation';

const StudentEdit = ({ params }) => { // Asume que recibes studentId como prop
    const [student, setStudent] = useState({
        "lastName": "",
        "secondName": "",
        "name": "",
        "email": "",
        "dni": "",
        "schoolId": 0,
        "gradeId": 0
    });
    const [schools, setSchools] = useState([]);
    const [grades, setGrades] = useState([]);
    const [hasChanged, setHasChanged] = useState(false); // Estado para rastrear cambios
    const router = useRouter();

    useEffect(() => {
        const fetchSchoolsAndGrades = async () => {
            // Carga de escuelas
            const schoolsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}school`, { credentials: 'include' });
            const schoolsData = await schoolsResponse.json();
            setSchools(schoolsData);

            // Carga de grados
            const gradesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}grade`, { credentials: 'include' });
            const gradesData = await gradesResponse.json();
            setGrades(gradesData);
        };

        const fetchStudentData = async () => {
            if (params.id) { // Si hay un studentId, carga los datos del estudiante
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}student/${params.id}`, { credentials: 'include' });
                const data = await response.json();
                setStudent(data);
            }else{
                console.log('no hay studentId')
            }
        };

        fetchSchoolsAndGrades();
        fetchStudentData();
    }, [params]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedValue = name === 'schoolId' || name === 'gradeId' ? +value : value;
        setStudent(prevState => {
            // Comprobar si el valor actual es diferente al nuevo valor antes de marcar como cambiado
            if (prevState[name] !== updatedValue) {
                setHasChanged(true); // Marcar que ha habido cambios
            }
            return {
                ...prevState,
                [name]: updatedValue
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        const method = params.id ? 'PUT' : 'POST'; // Si hay studentId, usa PUT, de lo contrario POST
        const url = params.id ? `${process.env.NEXT_PUBLIC_API_PATH}student/${params.id}` : `${process.env.NEXT_PUBLIC_API_PATH}student`;

        const response = await fetch(url, {
            credentials: 'include',
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student),
        });

        if (!response.ok) {
            throw new Error(`error: ${response.statusText}`);
        }

        router.push('/student');
    }

    return (
        <div className="grid">
            <Header />
            <div className='flex'>
                <Sidebar />
                <div className="flex ml-64">
                    <form className="form-container" onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="name"
                                    label="Nombre"
                                    placeholder="Ingrese su nombre"
                                    value={student.name}
                                    onChange={handleChange}
                                    variant="outlined"
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
                                    >
                                        <MenuItem value="">
                                            <em>Seleccione una escuela</em>
                                        </MenuItem>
                                        {schools.map(school => (
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
                                    >
                                        <MenuItem value="">
                                            <em>Seleccione un grado</em>
                                        </MenuItem>
                                        {grades.map(grade => (
                                            <MenuItem key={grade.id} value={grade.id}>
                                                {grade.grade}-{grade.level}
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