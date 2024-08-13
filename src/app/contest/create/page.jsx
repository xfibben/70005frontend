'use client';
import Sidebar from "@/app/components/sidebar";
import Header from "@/app/components/header";
import { Button, TextField, Grid, Alert } from "@mui/material";
import { useState } from "react";
import { handleSubmitMethod } from "@/app/methods/methods";
import { useRouter } from "next/navigation";

export default function CreateContest() {
    const router = useRouter();
    const [contest, setContest] = useState({
        name: "",
        date: "",
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        setContest(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    async function handleSubmit(e) {
        e.preventDefault(); // Prevent the default form submission behavior
        setError(''); // Reset error state

        try {
            await handleSubmitMethod('contest', contest, 'contest', router);
        } catch (error) {
            setError("Error al enviar el formulario: " + error.message);
        }
    }

    return (
        <div className="grid">
            <Header />
            <div className="flex">
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
                                    label="Nombre del concurso"
                                    name="name"
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={contest.name}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Fecha"
                                    name="date"
                                    type="date"
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={contest.date}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" type="submit">
                                    Crear
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </div>
        </div>
    );
}
