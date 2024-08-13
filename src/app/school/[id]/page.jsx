"use client";
import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { useRouter } from 'next/navigation';
import { Grid, TextField, Button, Select, MenuItem, InputLabel, FormControl, Alert } from '@mui/material';

const SchoolEdit = ({ params }) => {
    const [school, setSchool] = useState({
        "name": "",
        "address": "",
        "email": "",
        "phone": "",
        "type": "",
    });
    const [hasChanged, setHasChanged] = useState(false); // Estado para rastrear cambios
    const [error, setError] = useState(''); // Estado para manejar errores
    const router = useRouter();

    useEffect(() => {
        const fetchSchoolData = async () => {
            if (params.id) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}school/${params.id}`, { credentials: 'include' });
                const data = await response.json();
                setSchool(data);
            } else {
                console.log('No existe este colegio.');
            }
        };

        fetchSchoolData();
    }, [params]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSchool(prevState => {
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
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        setError(''); // Resetea el error al intentar enviar el formulario

        try {
            const method = params.id ? 'PUT' : 'POST';
            const url = params.id ? `${process.env.NEXT_PUBLIC_API_PATH}school/${params.id}` : `${process.env.NEXT_PUBLIC_API_PATH}school`;

            const response = await fetch(url, {
                credentials: 'include',
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(school),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
            }

            router.push('/school');
        } catch (error) {
            setError(error.message); // Almacena el mensaje de error
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
                                    <Alert severity="error" onClose={() => setError('')}>
                                        {error}
                                    </Alert>
                                )}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="name"
                                    label="Nombre"
                                    value={school.name}
                                    placeholder="Ingrese nombre"
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="address"
                                    label="Dirección"
                                    value={school.address}
                                    placeholder="Ingrese dirección"
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="email"
                                    label="Correo"
                                    value={school.email}
                                    placeholder="Ingrese correo"
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="phone"
                                    label="Teléfono"
                                    value={school.phone}
                                    placeholder="Ingrese teléfono"
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Tipo de Institución</InputLabel>
                                    <Select
                                        name="type"
                                        value={school.type}
                                        onChange={handleChange}
                                        label="Tipo de Institución"
                                    >
                                        <MenuItem value="PRIVADA">Privada</MenuItem>
                                        <MenuItem value="PUBLICA">Pública</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {hasChanged && (
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                    >
                                        Guardar cambios
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

export default SchoolEdit;
