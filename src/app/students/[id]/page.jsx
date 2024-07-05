"use client";
import React, { useState, useEffect } from 'react';
import {useRouter} from 'next/navigation';

export default function StudentId({ params }){

    const [student, setStudent] = useState({});
    const router = useRouter();
    
    useEffect(()=>{
        const fetchStudent = async () => {

            try {
                const response = await fetch(`http://localhost:5000/student/${params.id}`, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch students');
                }

                const data = await response.json();
                setStudent(data);
                console.log(data);
            } catch (error) {
                console.error('An error occurred:', error);
            }
        };

        fetchStudent();
    },[])

    return(
        <div>
            {student.name}
        </div>
    )
};