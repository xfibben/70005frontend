"use client";
import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { useRouter } from 'next/navigation';
import { handleSubmitMethod } from '@/app/methods/methods';
import { Box, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';


const TestCreate = () => {
    const [test, setTest] = useState({
        "name": "",
        "time": 0,
        "date": "",
        "gradeId": 0,
        "contestId": 0
    });
    const [contests, setContests] = useState([]);
    const [grades, setGrades] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // Simulación de carga de datos desde una API
        // Reemplazar con la llamada real a la API
        const fetchContests = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}contest`, {
                credentials: 'include'
            });
            const data = await response.json();
            setContests(data);
        };

        const fetchGrades = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}grade`, {
                credentials: 'include'}
            );
            const data = await response.json();
            setGrades(data);
        };

        fetchContests();
        fetchGrades();
    }, []);

    const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === 'contestId' || name === 'gradeId' || name === 'time' ? +value : value;

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
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            await handleSubmitMethod('test', test, 'test', router);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }


    return (
        <div className="grid">
            <Header />
            <div className='flex'>
                <Sidebar />
                <div className="ml-64 flex p-4">
                    <form className="grid" onSubmit={handleSubmit}>
                        <TextField label="Nombre de la prueba" name="name" variant="outlined" onChange={handleChange} value={test.name}/>
                        <TextField label="Fecha" name="date" type="date" onChange={handleChange} value={test.date}/>
                        <TextField label="Duración" name="time" type="number" onChange={handleChange} value={test.time}/>
                        <FormControl variant="outlined">
                            <InputLabel>Seleccione una prueba</InputLabel>
                            <Select
                              name="contestId"
                              onChange={handleChange}
                              label="Seleccione una prueba"
                            >
                              <MenuItem value=""><em>Seleccione una prueba</em></MenuItem>
                              {contests.map(contest => (
                                <MenuItem key={contest.id} value={contest.id}>{contest.name}</MenuItem>
                              ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined">
                            <InputLabel>Seleccione un grado</InputLabel>
                            <Select
                              name="gradeId"
                              onChange={handleChange}
                              label="Seleccione una grado"
                            >
                              <MenuItem value=""><em>Seleccione un grado</em></MenuItem>
                              {grades.map(grade => (
                                <MenuItem key={grade.id} value={grade.id}>{grade.level}</MenuItem>
                              ))}
                            </Select>
                        </FormControl>
                        <Button variant="contained" type="submit">Crear</Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TestCreate;