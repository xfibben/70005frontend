"use client";
import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { useRouter } from 'next/navigation';
import { Grid, TextField, Button, Alert } from '@mui/material';

const UserEdit = ({ params }) => {
    const [user, setUser] = useState({
        "username": "",
        "email": "",
        "name": "",
        "password": ""
    });
    const [hasChanged, setHasChanged] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            if (params.username) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}users/${params.username}`, { credentials: 'include' });
                    if (!response.ok) {
                        throw new Error('No se pudo obtener los datos del usuario');
                    }
                    const data = await response.json();
                    setUser(data);
                } catch (error) {
                    setError(error.message);
                }
            } else {
                console.log('No se proporcionó username');
            }
        };

        fetchUserData();
    }, [params.username]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => {
            if (prevState[name] !== value) {
                setHasChanged(true);
            }
            return {
                ...prevState,
                [name]: value
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}user/${user.username}`, {
                credentials: 'include',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
            }

            router.push('/user');
        } catch (error) {
            setError(error.message || 'Error desconocido');
        }
    };

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
                                    name="username"
                                    label="Nombre de Usuario"
                                    placeholder="Ingrese el nombre de usuario"
                                    value={user.username}
                                    onChange={handleChange}
                                    variant="outlined"
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="email"
                                    label="Email"
                                    placeholder="Ingrese el correo electrónico"
                                    value={user.email}
                                    onChange={handleChange}
                                    variant="outlined"
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="name"
                                    label="Nombre Completo"
                                    placeholder="Ingrese el nombre completo"
                                    value={user.name}
                                    onChange={handleChange}
                                    variant="outlined"
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="password"
                                    label="Contraseña"
                                    type="password"
                                    placeholder="Ingrese la nueva contraseña"
                                    onChange={handleChange}
                                    variant="outlined"
                                />
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

export default UserEdit;
