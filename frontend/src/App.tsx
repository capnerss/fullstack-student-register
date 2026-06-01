import { useEffect, useState } from 'react';
import axios from 'axios';

// Interface of a Student
interface Student {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  course: string;
  enrollmentDate: string;
}

function App() {

  const [students, setStudents] = useState<Student[]>([]);
  const [message, setMessage] = useState<string>('');
  const API_URL = 'http://localhost:8080/api/students';

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      setMessage('Failed to load students.');
    }
  };

  const deleteStudent = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessage('Student successfully deleted!');
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      setMessage('Failed to delete student.');
    }
  };

  return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Student Register</h1>


        {message && <p style={{ color: 'blue', fontWeight: 'bold' }}>{message}</p>}


        <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Enrollment Date</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {students.map((student) => (
              <tr key={student.id}>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>
                <td>{student.enrollmentDate}</td>
                <td>

                  <button style={{ marginRight: '10px' }}>Edit</button>
                  <button onClick={() => student.id && deleteStudent(student.id)}>
                    Delete
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>


      </div>
  );
}

export default App;