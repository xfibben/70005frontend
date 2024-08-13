"use client";
import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { useRouter } from 'next/navigation';
import { Grid, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';


const StudentCreate = () => {
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
    const router = useRouter();

    useEffect(() => {
        // Simulación de carga de datos desde una API
        // Reemplazar con la llamada real a la API
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

        fetchSchools();
        fetchGrades();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedValue = name === 'schoolId' || name === 'gradeId' ? +value : value;
        setStudent(prevState => ({
            ...prevState,
            [name]: updatedValue
        }));
    };

    const handleSubmit = async (student) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}student`, {
        credentials: 'include',
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(student),
    });

  // Check if the response is OK (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`error: ${response.message})`);
    }
    
    // Ensure the content type of the response is application/json before parsing
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        router.push('/student');
        return data;
    } else {
      throw new Error("Received non-JSON response from server");
    }
}


    return (
        <div className="grid">
            <Header />
            <div className='flex'>
                <Sidebar />
                <div className="ml-64 flex">
                    <form className="form-container" onSubmit={(e) => { e.preventDefault(); handleSubmit(student); }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="lastName"
                                    label="Apellido Paterno"
                                    placeholder="Ingrese Apellido Paterno"
                                    onChange={handleChange}
                                    variant="outlined"
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
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Escuela</InputLabel>
                                    <Select
                                        name="schoolId"
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