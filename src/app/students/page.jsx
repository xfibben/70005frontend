"use client";

import Header from "../components/header";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Sidebar from "../components/sidebar";
import Link from "next/link";

export default function Student() {
    const [students, setStudents] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchStudents = async () => {
            const token = Cookies.get('jwt');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/student', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch students');
                }

                const data = await response.json();
                setStudents(data);
            } catch (error) {
                console.error('An error occurred:', error);
                router.push('/login');
            }
        };

        fetchStudents();
    }, [router]);

    return (
        <div className="grid">
            <Header />
            <div>
                <Sidebar />
                <div className="flex-grow p-6">

                    <div className="bg-white shadow-md rounded p-6 mt-4">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b border-gray-200">Name</th>
                                    <th className="py-2 px-4 border-b border-gray-200">Last Name</th>
                                    <th className="py-2 px-4 border-b border-gray-200">DNI</th>
                                    <th className="py-2 px-4 border-b border-gray-200">School</th>
                                    <th className="py-2 px-4 border-b border-gray-200">Grade</th>
                                    <th className="py-2 px-4 border-b border-gray-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student.id}>
                                        <td className="py-2 px-4 border-b border-gray-200">{student.name}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{student.lastName}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{student.dni}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{student.school.name}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{student.grade.level} - {student.grade.grade}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <Link href = {`/students/${student.id}`}>Edit</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
