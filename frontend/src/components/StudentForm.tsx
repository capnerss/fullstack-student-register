import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type {StudentFormProps} from "../interfaces/StudentFormProps.tsx";
import type {Student} from "../interfaces/student.ts";


const StudentForm: React.FC<StudentFormProps> = ({ studentToEdit, onSaveSuccess, onCancel }) => {
    const [student, setStudent] = useState<Student>({
        firstName: '',
        lastName: '',
        email: '',
        course: '',
        enrollmentDate: ''
    });

    const [error, setError] = useState<string>('');
    const API_URL = 'http://localhost:8080/api/students';

    useEffect(() => {
        if (studentToEdit) {
            setStudent(studentToEdit);
        } else {
            setStudent({ firstName: '', lastName: '', email: '', course: '', enrollmentDate: '' });
        }
        setError('');
    }, [studentToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setStudent({ ...student, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!student.firstName || !student.lastName || !student.email || !student.course || !student.enrollmentDate) {
            setError('All fields are mandatory!');
            return;
        }

        try {
            if (student.id) {
                // UPDATE:
                await axios.put(`${API_URL}/${student.id}`, student);
            } else {
                // CREATE:
                await axios.post(API_URL, student);
            }
            onSaveSuccess();
        } catch (err: any) {
            console.error('API Error:', err);
            setError(err.response?.data?.message || 'An error occurred while saving the student.');
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', marginTop: '20px', maxWidth: '400px' }}>
            <h3>{student.id ? 'Edit Student' : 'Add New Student'}</h3>

            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>First Name: </label>
                    <input type="text" name="firstName" value={student.firstName} onChange={handleChange} style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Last Name: </label>
                    <input type="text" name="lastName" value={student.lastName} onChange={handleChange} style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email: </label>
                    <input type="email" name="email" value={student.email} onChange={handleChange} style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Course: </label>
                    <input type="text" name="course" value={student.course} onChange={handleChange} style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Enrollment Date: </label>
                    <input type="date" name="enrollmentDate" value={student.enrollmentDate} onChange={handleChange} style={{ width: '100%' }} />
                </div>

                <button type="submit" style={{ marginRight: '10px', backgroundColor: '#4CAF50', color: 'white', padding: '5px 10px' }}>
                    {student.id ? 'Save Changes' : 'Add Student'}
                </button>
                <button type="button" onClick={onCancel} style={{ padding: '5px 10px' }}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default StudentForm;