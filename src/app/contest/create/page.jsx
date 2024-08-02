'use client';
import Sidebar from "@/app/components/sidebar";
import Header from "@/app/components/header";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { handleSubmitMethod } from "@/app/methods/methods";
import { useRouter } from "next/navigation";

export default function CreateContest(){

    const router = useRouter();

    const [contest,setContest] = useState({});

    const handleChange = (e) => {
        const {name, value} = e.target;

        setContest(prevState => ({
            ...prevState,
            [name]: value
        }));

    };

    async function handleSubmit(e) {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            await handleSubmitMethod('contest', contest, 'contest',router);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }
    
    return(
        <div>
            <Header/>
            <div className="flex">
                <Sidebar/>
                <div className="ml-64 p-4">
                    <form className="grid" onSubmit={handleSubmit}>
                        <TextField label="Nombre del concurso" name="name" variant="outlined" onChange={handleChange} value={contest.name}/>
                        <TextField label={"Fecha"} name="date" type="date" onChange={handleChange} value={contest.date}/>
                        <Button variant="contained" type="submit">Crear</Button>
                    </form>
                </div>
            </div>
        </div>
    )
};