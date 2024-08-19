"use client";
import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { useRouter } from 'next/navigation';
import { Grid, TextField, Button, Alert } from '@mui/material';

const ContestEdit = ({ params }) => {
    const [contest, setContest] = useState({
        "name": "",
        "date": "",
    });
    const [hasChanged, setHasChanged] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchContestData = async () => {
            if (params.id) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}contest/${params.id}`, { credentials: 'include' });
                    if (!response.ok) {
                        throw new Error('No se pudo obtener los datos del concurso');
                    }
                    const data = await response.json();
                    setContest(data);
                } catch (error) {
                    setError(error.message);
                }
            } else {
                console.log('No se proporcionó un contestId');
            }
        };

        fetchContestData();
    }, [params.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContest(prevState => {
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

        const method = params.id ? 'PUT' : 'POST';
        const url = params.id ? `${process.env.NEXT_PUBLIC_API_PATH}contest/${params.id}` : `${process.env.NEXT_PUBLIC_API_PATH}contest`;

        try {
            const response = await fetch(url, {
                credentials: 'include',
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contest),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
            }

            router.push('/contest');
        } catch (error) {
            setError(error.message || 'Error desconocido');
        }
    };

    const handleExportExcel = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}contest/excel/${params.id}`, {
                credentials: 'include',
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ranking_${params.id}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            setError(error.message || 'Error al exportar el Excel');
        }
    };

    const handleExportExcelName = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}contest/excel/name/${params.id}`, {
                credentials: 'include',
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ranking_${params.id}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            setError(error.message || 'Error al exportar el Excel');
        }
    };

    const handleExportPDF = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}contest/pdf/${params.id}`, {
                credentials: 'include',
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ranking_${params.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            setError(error.message || 'Error al exportar el PDF');
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
                                    name="name"
                                    label="Nombre"
                                    placeholder="Ingrese nombre"
                                    value={contest.name}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="date"
                                    label="Fecha"
                                    type="date"
                                    value={contest.date}
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
                            <Grid item xs={12}>
                                <Button 
                                    variant="contained" 
                                    color="success" 
                                    onClick={handleExportExcel}
                                >
                                    Exportar Excel por Ranking
                                </Button>
                                <Button 
                                    variant="contained" 
                                    color="success" 
                                    onClick={handleExportExcelName}
                                >
                                    Exportar Excel por Orden Alfabético
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button 
                                    variant="contained" 
                                    color="secondary" 
                                    onClick={handleExportPDF}
                                >
                                    Exportar PDF por Ranking
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContestEdit;
