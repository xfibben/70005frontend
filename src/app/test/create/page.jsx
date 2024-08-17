"use client";
import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { useRouter } from 'next/navigation';
import { handleSubmitMethod } from '@/app/methods/methods';
import { Box, TextField, Button, Select, MenuItem, InputLabel, FormControl, Grid, Alert } from '@mui/material';

const TestCreate = () => {
    const [test, setTest] = useState({
        "name": "",
        "time": "",
        "date": "",
        "gradeId": 0,
        "contestId": 0
    });
    const [contests, setContests] = useState([]);
    const [grades, setGrades] = useState([]);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}contest`, {
                    credentials: 'include'
                });
                const data = await response.json();
                setContests(data);
            } catch (error) {
                setError("Error al cargar los concursos");
            }
        };

        const fetchGrades = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}grade`, {
                    credentials: 'include'
                });
                const data = await response.json();
                setGrades(data);
            } catch (error) {
                setError("Error al cargar los grados");
            }
        };

        fetchContests();
        fetchGrades();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedValue = name === 'contestId' || name === 'gradeId' ? +value : value;

        if (name === 'contestId') {
            const selectedContest = contests.find(contest => contest.id === +value);
            setTest(prevState => ({
                ...prevState,
                [name]: updatedValue,
                date: selectedContest ? selectedContest.date : ""
            }));
        } else {
            setTest(prevState => ({
                ...prevState,
                [name]: updatedValue
            }));
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setError(''); // Resetea el error al intentar enviar el formulario

        if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(test.time)) {
            setError("El formato de la hora debe ser HH:MM");
            return;
        }

        try {
            await handleSubmitMethod('test', test, 'test', router);
        } catch (error) {
            setError("Error al enviar el formulario: " + error.message);
        }
    }

    return (
        <div className="grid">
            <Header />
            <div className='flex'>
                <Sidebar />
                <div className="ml-64 flex-grow p-6">
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
                                    label="Nombre de la prueba"
                                    name="name"
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={test.name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Fecha"
                                    name="date"
                                    type="date"
                                    onChange={handleChange}
                                    value={test.date}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Hora de Inicio (HH:MM)"
                                    name="time"
                                    placeholder="HH:MM"
                                    onChange={handleChange}
                                    value={test.time}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Seleccione una Concurso</InputLabel>
                                    <Select
                                        name="contestId"
                                        onChange={handleChange}
                                        value={test.contestId}
                                        label="Seleccione una Concurso"
                                    >
                                        <MenuItem value=""><em>Seleccione una Concurso</em></MenuItem>
                                        {contests.map(contest => (
                                            <MenuItem key={contest.id} value={contest.id}>{contest.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Seleccione un grado</InputLabel>
                                    <Select
                                        name="gradeId"
                                        onChange={handleChange}
                                        value={test.gradeId}
                                        label="Seleccione un grado"
                                    >
                                        <MenuItem value=""><em>Seleccione un grado</em></MenuItem>
                                        {grades.map(grade => (
                                            <MenuItem key={grade.id} value={grade.id}>{grade.level}-{grade.grade}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" type="submit">
                                    Crear
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TestCreate;
