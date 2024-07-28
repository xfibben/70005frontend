"use client";
import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { useRouter } from 'next/navigation';
import Student from '../page';

const SchoolEdit = ({ params }) => { // Asume que recibes studentId como prop
    const [school, setSchool] = useState({
        "name": "",
        "address": "",
        "email": "",
        "phone": "",
        "type": "",
    });
    const [hasChanged, setHasChanged] = useState(false); // Estado para rastrear cambios
    const router = useRouter();

    useEffect(() => {

        const fetchSchoolData = async () => {
            if (params.id) { // Si hay un studentId, carga los datos del estudiante
                const response = await fetch(`http://localhost:5000/school/${params.id}`, { credentials: 'include' });
                const data = await response.json();
                setSchool(data);
            }else{
                console.log('no existe este Colegio.')
            }
        };

        fetchSchoolData();
    }, [params]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSchool(prevState => {
            // Comprobar si el valor actual es diferente al nuevo valor antes de marcar como cambiado
            if (prevState[name] !== value) {
                setHasChanged(true); // Marcar que ha habido cambios
            }
            return {
                ...prevState,
                [name]: value
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        const method = params.id ? 'PUT' : 'POST'; // Si hay studentId, usa PUT, de lo contrario POST
        const url = params.id ? `http://localhost:5000/school/${params.id}` : 'http://localhost:5000/school';

        const response = await fetch(url, {
            credentials: 'include',
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(school),
        });

        if (!response.ok) {
            throw new Error(`error: ${response.statusText}`);
        }

        router.push('/school');
    }

    return (
        <div className="grid">
            <Header />
            <div className='flex'>
                <Sidebar />
                <div className="flex">
                    <form classNam="grid">
                        <input name="name" value={school.name}  placeholder="Ingrese nombre" onChange={handleChange}></input>
                        <input name="address" value={school.address} placeholder="Ingrese dirección" onChange={handleChange}></input>
                        <input name="email" value={school.email} placeholder="Ingrese correo" onChange={handleChange}></input>
                        <input name="phone"  value={school.phone} placeholder="Ingrese teléfono" onChange={handleChange}></input>
                        <select name="type" value={school.type} placeholder="Ingrese el tipo de institución" onChange={handleChange}>
                            <option name="Privada" value={'Privada'}>Privada</option>
                            <option name="Publica" value={'Publica'}>Pública</option>
                        </select>
                        {hasChanged && <button type="submit" onClick={handleSubmit}>Guardar cambios</button>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SchoolEdit;