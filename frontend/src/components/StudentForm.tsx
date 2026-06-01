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
        <div className="form-container">
            <h3>{student.id ? 'Edit Student' : 'Add New Student'}</h3>

            {error && <p className="message" style={{ borderLeftColor: '#ef4444', color: '#f87171' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label>First Name: </label>
                    <input type="text" name="firstName" value={student.firstName} onChange={handleChange} style={{ width: '100%' }} />
                </div>
                <div className="form-field">
                    <label>Last Name: </label>
                    <input type="text" name="lastName" value={student.lastName} onChange={handleChange} style={{ width: '100%' }} />
                </div>
                <div className="form-field">
                    <label>Email: </label>
                    <input type="email" name="email" value={student.email} onChange={handleChange} style={{ width: '100%' }} />
                </div>
                <div className="form-field">
                    <label>Course: </label>
                    <input type="text" name="course" value={student.course} onChange={handleChange} style={{ width: '100%' }} />
                </div>
                <div className="form-field">
                    <label>Enrollment Date: </label>
                    <input type="date" name="enrollmentDate" value={student.enrollmentDate} onChange={handleChange} style={{ width: '100%' }} />
                </div>
                <div className="form-actions">
                <button className="btn-secondary" type="submit">
                    {student.id ? 'Save Changes' : 'Add Student'}
                </button>
                <button className="btn-primary" type="button" onClick={onCancel}>
                    Cancel
                </button>
                </div>
            </form>
        </div>
    );
};

export default StudentForm;