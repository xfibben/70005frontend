"use client";
import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { useRouter } from 'next/navigation';

const StudentEdit = ({ params }) => { // Asume que recibes studentId como prop
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
                    <form className="" onSubmit={handleSubmit}>
                        <input name="name"  value={student.name} placeholder="Ingrese su nombre" onChange={handleChange}></input>
                        <input name="lastName" value={student.lastName}placeholder="Ingrese su apellido" onChange={handleChange}></input>
                        <input name="email" value={student.email} placeholder="Ingrese su email" onChange={handleChange}></input>
                        <input name="dni" value={student.dni} placeholder="Ingrese su DNI" onChange={handleChange}></input>
                        <select name="schoolId" onChange={handleChange} value={student.schoolId}>
                            <option>Seleccione una escuela</option>
                            {schools.map(school => (
                                <option key={school.id} value={school.id}>{school.name}</option>
                            ))}
                        </select>
                        <select name="gradeId" onChange={handleChange} value={student.gradeId}>
                            <option>Seleccione un grado</option>
                            {grades.map(grade => (
                                <option key={grade.id} value={grade.id}>{grade.grade}-{grade.level}</option>
                            ))}
                        </select>
                        {hasChanged && <button type="submit">Guardar Cambios</button>}

                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentEdit;