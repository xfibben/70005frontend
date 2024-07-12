"use client";
import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { useRouter } from 'next/navigation';

const StudentCreate = () => {
    const [student, setStudent] = useState({
        "name": "",
        "lastName": "",
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
            const response = await fetch('http://localhost:5000/school', {
                credentials: 'include'
            });
            const data = await response.json();
            setSchools(data);
        };

        const fetchGrades = async () => {
            const response = await fetch('http://localhost:5000/grade', {
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
    const response = await fetch('http://localhost:5000/student', {
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
        router.push('/students');
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
                <div className="flex">
                    <form classNam="grid">
                        <input name="name"  placeholder="Ingrese su nombre" onChange={handleChange}></input>
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
                                <option key={grade.id} value={grade.id}>{grade.grade}-{grade.level}</option>
                            ))}
                        </select>
                        <submit onClick={()=>{handleSubmit(student)}}>Enviar</submit>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentCreate;