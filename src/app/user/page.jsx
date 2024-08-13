"use client";
import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, Alert } from '@mui/material';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}users`, { credentials: 'include' });
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userName) => {
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
        if (!confirmed) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}users/${userName}`, {
                credentials: 'include',
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el usuario');
            }

            setUsers(users.filter(user => user.username !== userName));
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="grid">
            <Header />
            <div className='flex'>
                <Sidebar />
                <div className="ml-64 flex-grow p-6">
                    <div className="flex justify-between mb-4">
                        <h2>Usuarios</h2>
                        <Button variant="contained" color="primary">
                            <Link href="/user/create">Crear nuevo Usuario</Link>
                        </Button>
                    </div>
                    {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre de Usuario</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Nombre Completo</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>
                                            <Link href={`/user/${user.username}`} className="text-blue-600 hover:underline">Editar</Link>
                                            <Button onClick={() => handleDelete(user.username)} className="text-red-600 hover:underline">
                                                Eliminar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
}
