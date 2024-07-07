"use client";
import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";

const StudentCreate = () => {
    const [student, setStudent] = useState({
        "name": "",
        "lastName": "",
        "email": "",
        "dni": "",
        "schoolId": "",
        "gradeId": ""
    });
    const [schools, setSchools] = useState([]);
    const [grades, setGrades] = useState([]);

    useEffect(() => {
        // Simulación de carga de datos desde una API
        // Reemplazar con la llamada real a la API
        const fetchSchools = async () => {
            const response = await fetch('url_to_schools_api');
            const data = await response.json();
            setSchools(data);
        };

        const fetchGrades = async () => {
            const response = await fetch('url_to_grades_api');
            const data = await response.json();
            setGrades(data);
        };

        fetchSchools();
        fetchGrades();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="grid">
            <Header />
            <div>
                <Sidebar />
                <div className="flex">
                    <h1>Hola</h1>
                    <form classNam="grid">
                        <input name="name" placeholder="Ingrese su nombre" onChange={handleChange}></input>
                        <input name="lastName" placeholder="Ingrese su apellido" onChange={handleChange}></input>
                        <input name="email" placeholder="Ingrese su email" onChange={handleChange}></input>
                        <input name="dni" placeholder="Ingrese su DNI" onChange={handleChange}></input>
                        <select name="schoolId" onChange={handleChange}>
                            <option>Seleccione una escuela</option>
                            {schools.map(school => (
                                <option key={school.id} value={school.id}>{school.name}</option>
                            ))}
                        </select>
                        <select name="gradeId" onChange={handleChange}>
                            <option>Seleccione un grado</option>
                            {grades.map(grade => (
                                <option key={grade.id} value={grade.id}>{grade.name}</option>
                            ))}
                        </select>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentCreate;