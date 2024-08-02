"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Button, TextField } from '@mui/material';


const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.access_token;

                if (token) {
                    // Almacenar el token en las cookies
                    Cookies.set('jwt', token, { expires: 1 }); // La cookie expirará en 1 día
                    console.log("Token:", token);
                    console.log("Login successful");
                    router.push('/dashboard');
                } else {
                    console.error("Token is undefined");
                }
            } else {
                console.log("Login failed");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex justify-center items-center h-screen">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4 grid">
 
                    <TextField label={'Ingrese su usuario'} value={credentials.username}
                        onChange={handleChange} name='username'></TextField>
                    <TextField label={'Ingrese su contraseña'} value={credentials.password}
                        onChange={handleChange} type='password' name='password'></TextField>
                </div>
                <div className="flex items-center justify-between">
                    <Button variant="contained" type='submit'>Ingresar</Button>
                </div>
                <Link href="/register">Crear cuenta</Link>
            </div>
        </form>
    );
};

export default Login;
