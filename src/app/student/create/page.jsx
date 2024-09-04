"use client";
import React, { useEffect, useState } from 'react';
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { useRouter } from 'next/navigation';
import { Grid, TextField, Button, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';
import InscriptionModal from '@/app/components/inscription'; // Asegúrate de que la ruta sea correcta
import CustomSelect from '@/app/components/customschools';

const StudentCreate = () => {
    const [student, setStudent] = useState({
        "lastName": "",
        "secondName": "",
        "name": "",
        "email": "",
        "dni": "",
        "schoolId": 0,
        "gradeId": 0,
        "mode": "INDEPENDIENTE", // Valor predeterminado
    });
    const [schools, setSchools] = useState([]);
    const [grades, setGrades] = useState([]);
    const [tests, setTests] = useState([]);
    const [selectedTestId, setSelectedTestId] = useState(null); // Estado para manejar el test seleccionado
    const [schoolSearch, setSchoolSearch] = useState('');
    const [gradeSearch, setGradeSearch] = useState('');
    const [error, setError] = useState(''); // Estado para manejar errores
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createdStudent, setCreatedStudent] = useState(null); // Nuevo estado para almacenar el estudiante creado
    const router = useRouter();

    //excel
    const [excelSchoolId, setExcelSchoolId] = useState('');
    const [excelGradeId, setExcelGradeId] = useState('');
    const [excelTestId, setExcelTestId] = useState('');
    const [selectedExcelFile, setSelectedExcelFile] = useState(null); // State for the selected Excel file
    const [isExcelUploadVisible, setIsExcelUploadVisible] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    useEffect(() => {
        const fetchSchools = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}school`, {
                credentials: 'include'
            });
            const data = await response.json();
            setSchools(data);
        };

        const fetchGrades = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}grade`, {
                credentials: 'include'}
            );
            const data = await response.json();
            setGrades(data);
        };

        const fetchTests = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}test`, {
                credentials: 'include'
            });
            const data = await response.json();
            setTests(data);
        };

        fetchSchools();
        fetchGrades();
        fetchTests(); // Carga los tests
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedValue = name === 'schoolId' || name === 'gradeId' ? +value : value.toUpperCase();

        setStudent(prevState => {
            let newState = {
                ...prevState,
                [name]: updatedValue
            };

            // Verifica si la escuela seleccionada es "70005 CORAZON DE JESUS"
            if (name === 'schoolId') {
                const selectedSchool = schools.find(school => school.id === +value);
                if (selectedSchool && selectedSchool.name === "70005 CORAZON DE JESUS") {
                    newState = { ...newState, mode: "INTERNO" };
                }
            }
            console.log(newState);

            return newState;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Resetea el error al intentar enviar el formulario
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}student`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(student),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
            }

            const createdStudentData = await response.json(); // Obtén el estudiante creado
            setCreatedStudent(createdStudentData); // Guarda el estudiante creado en el estado

            if (selectedTestId) {
                handleOpenModal(); // Abre el modal si se seleccionó un concurso
            } else {
                router.push('/student');
            }

        } catch (error) {
            setError(error.message); // Almacena el mensaje de error
        }
    };

    
    const handleSaveInscription = async (ticket) => {
    try {
        const qualification = {
            studentId: createdStudent.id,
            testId: selectedTestId,
            startingTime: tests.find(test => test.id === selectedTestId)?.time || '',
            endingTime: "", // Este puede ser llenado posteriormente
            ticket: ticket, // Agrega el ticket ingresado en el modal
        };

        const qualificationResponse = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}qualification`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(qualification),
        });

        if (!qualificationResponse.ok) {
            const errorData = await qualificationResponse.json();
            throw new Error(errorData.message || `Error al crear la Qualification: ${qualificationResponse.status} ${qualificationResponse.statusText}`);
        }

        handleCloseModal();
        router.push('/student'); // Redirige después de guardar la inscripción

    } catch (error) {
        setError(error.message); // Almacena el mensaje de error
    }
};
    


    const handleGradeSearchChange = (e) => {
        setGradeSearch(e.target.value.toUpperCase());
    };


    //excel
    // Function to handle file selection
const handleExcelFileChange = (e) => {
    setSelectedExcelFile(e.target.files[0]); // Save the selected Excel file
};

// Function to handle Excel upload visibility
const handleExcelUploadVisibility = () => {
    setIsExcelUploadVisible(!isExcelUploadVisible); // Toggle visibility
};

// Function to handle the Excel file upload
const handleExcelUpload = async () => {
    if (!selectedExcelFile || !excelSchoolId || !excelGradeId || !excelTestId) {
        setError('Seleccione el archivo, escuela, grado, y prueba antes de subir.');
        return;
    }

    const formData = new FormData();
    formData.append('file', selectedExcelFile);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}student/upload?schoolId=${excelSchoolId}&gradeId=${excelGradeId}&testId=${excelTestId}`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
        }

        alert('Estudiantes subidos exitosamente desde Excel.');
        setIsExcelUploadVisible(false); // Hide the section after upload

    } catch (error) {
        setError(error.message);
    }
};


    return (
        <div className="grid">
            <Header />
            <div className='flex'>
                <Sidebar />
                <div className="ml-64 flex">
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
                                    name="lastName"
                                    label="Apellido Paterno"
                                    placeholder="Ingrese Apellido Paterno"
                                    onChange={handleChange}
                                    variant="outlined"
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="secondName"
                                    label="Apellido Materno"
                                    placeholder="Ingrese su apellido"
                                    onChange={handleChange}
                                    variant="outlined"
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="name"
                                    label="Nombre"
                                    placeholder="Ingrese su nombre"
                                    onChange={handleChange}
                                    variant="outlined"
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="email"
                                    label="Email"
                                    placeholder="Ingrese su email"
                                    onChange={handleChange}
                                    variant="outlined"
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="dni"
                                    label="DNI"
                                    placeholder="Ingrese su DNI"
                                    onChange={handleChange}
                                    variant="outlined"
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                            <CustomSelect
                                options={schools}
                                label="Escuela"
                                name="schoolId"
                                value={student.schoolId}
                                onChange={handleChange}
                                placeholder="Seleccione una escuela"
                            />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Grado</InputLabel>
                                    <Select
                                        name="gradeId"
                                        onChange={handleChange}
                                        label="Grado"
                                        value={student.gradeId}
                                        onInput={handleGradeSearchChange}
                                    >
                                        <MenuItem value="">
                                            <em>Seleccione un grado</em>
                                        </MenuItem>
                                        {grades.filter(grade => `${grade.grade}-${grade.level}`.includes(gradeSearch)).map(grade => (
                                            <MenuItem key={grade.id} value={grade.id}>
                                                {grade.grade}-{grade.level}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Modalidad</InputLabel>
                                    <Select
                                        name="mode"
                                        onChange={handleChange}
                                        label="Modalidad"
                                        value={student.mode}
                                    >
                                        <MenuItem value="INDEPENDIENTE">INDEPENDIENTE</MenuItem>
                                        <MenuItem value="DELEGACION">DELEGACION</MenuItem>
                                        <MenuItem value="INTERNO">INTERNO</MenuItem>
                                        <MenuItem value="EXTERNO">EXTERNO</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Seleccione una Prueba</InputLabel>
                                    <Select
                                        name="testId"
                                        onChange={(e) => setSelectedTestId(e.target.value)}
                                        label="Seleccione una Prueba"
                                        value={selectedTestId}
                                    >
                                        <MenuItem value="">
                                            <em>Seleccione una Prueba</em>
                                        </MenuItem>
                                        {tests.map(test => (
                                            <MenuItem key={test.id} value={test.id}>
                                                {test.name} - {test.date}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" type="submit">
                                    Enviar
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" onClick={handleExcelUploadVisibility}>
                                    Importar desde Excel
                                </Button>
                            </Grid>

                            {isExcelUploadVisible && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel>Escuela</InputLabel>
                                            <Select
                                                value={excelSchoolId}
                                                onChange={(e) => setExcelSchoolId(e.target.value)}
                                                label="Escuela"
                                            >
                                                <MenuItem value="">
                                                    <em>Seleccione una escuela</em>
                                                </MenuItem>
                                                {schools.map(school => (
                                                    <MenuItem key={school.id} value={school.id}>
                                                        {school.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel>Grado</InputLabel>
                                            <Select
                                                value={excelGradeId}
                                                onChange={(e) => setExcelGradeId(e.target.value)}
                                                label="Grado"
                                            >
                                                <MenuItem value="">
                                                    <em>Seleccione un grado</em>
                                                </MenuItem>
                                                {grades.map(grade => (
                                                    <MenuItem key={grade.id} value={grade.id}>
                                                        {grade.grade}-{grade.level}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel>Prueba</InputLabel>
                                            <Select
                                                value={excelTestId}
                                                onChange={(e) => setExcelTestId(e.target.value)}
                                                label="Prueba"
                                            >
                                                <MenuItem value="">
                                                    <em>Seleccione una prueba</em>
                                                </MenuItem>
                                                {tests.map(test => (
                                                    <MenuItem key={test.id} value={test.id}>
                                                        {test.name} - {test.date}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <input type="file" accept=".xlsx, .xls" onChange={handleExcelFileChange} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant="contained" color="secondary" onClick={handleExcelUpload}>
                                            Subir Archivo Excel
                                        </Button>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </form>
                    <InscriptionModal
                        open={isModalOpen}
                        handleClose={handleCloseModal}
                        studentId={createdStudent?.id} // Asegúrate de que createdStudent esté definido
                        testId={selectedTestId} // Pasa el ID del concurso seleccionado
                        onSave={handleSaveInscription}
                    />
                </div>
            </div>
        </div>
    );
};

export default StudentCreate;
