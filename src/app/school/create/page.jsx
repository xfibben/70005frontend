"use client";
import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { useRouter } from 'next/navigation';

const SchoolCreate = () => {
    const [school, setSchool] = useState({
        "name": "",
        "address": "",
        "email": "",
        "phone": "",
        "type": "",
    });

    const router = useRouter();


    const handleChange = (e) => {
        const {name, value} = e.target;

        setSchool(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log(school)

    };

    const handleSubmit = async (school) => {
    const response = await fetch('http://localhost:5000/school', {
        credentials: 'include',
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(school),
    });

    if (!response.ok) {
        throw new Error(`error: ${response.message})`);
    }
    
    // Ensure the content type of the response is application/json before parsing
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        router.push('/school');
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
                        <input name="name"  placeholder="Ingrese nombre" onChange={handleChange}></input>
                        <input name="address" placeholder="Ingrese dirección" onChange={handleChange}></input>
                        <input name="email" placeholder="Ingrese correo" onChange={handleChange}></input>
                        <input name="phone" placeholder="Ingrese teléfono" onChange={handleChange}></input>
                        <select name="type" placeholder="Ingrese el tipo de institución" onChange={handleChange}>
                            <option name="Privada">Privada</option>
                            <option name="Publica">Pública</option>
                        </select>
                        <submit onClick={()=>{handleSubmit(school)}}>Enviar</submit>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SchoolCreate;