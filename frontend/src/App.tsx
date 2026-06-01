import { useEffect, useState } from 'react';
import axios from 'axios';
import type {Student} from "./interfaces/student.ts";
import StudentForm from "./components/StudentForm.tsx";

function App() {

  const [students, setStudents] = useState<Student[]>([]);
  const [message, setMessage] = useState<string>('');
  const API_URL = 'http://localhost:8080/api/students';
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('id');
  const [direction, setDirection] = useState<string>('asc');
  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'dark');
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    fetchStudents();
  }, [search, sortBy, direction, page]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}?search=${search}&sortBy=${sortBy}&direction=${direction}&page=${page}&size=5`);

      setStudents(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
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
  // Edit
  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  const handleSaveSuccess = () => {
    setMessage(selectedStudent ? 'Student updated successfully!' : 'Student added successfully!');
    fetchStudents();
    handleFormCancel();
  };

  // Cancel
  const handleFormCancel = () => {
    setSelectedStudent(null);
    setIsFormOpen(false);
  };

  return (
      <div >
        <h1>Student Register</h1>

        <button
            onClick={toggleTheme}
            className="btn-secondary"
            style={{ marginLeft: 'auto', padding: '6px 12px' }}
        >
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>


        {message && <p>{message}</p>}

        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>


          <div>
            <label>Search: </label>
            <input
                type="text"
                placeholder="Type name or surname..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: '5px', width: '200px' }}
            />
          </div>

          <div>
            <label>Sort By: </label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '5px' }}>
              <option value="id">ID</option>
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
              <option value="course">Course</option>
              <option value="enrollmentDate">Enrollment Date</option>
            </select>
          </div>

          <div>
            <label>Direction: </label>
            <select value={direction} onChange={(e) => setDirection(e.target.value)} style={{ padding: '5px' }}>
              <option value="asc">Ascending (A-Z)</option>
              <option value="desc">Descending (Z-A)</option>
            </select>
          </div>
        <button
            onClick={() => { setSelectedStudent(null); setIsFormOpen(true); }}

        >
          Add New Student
        </button>
        </div>

        <table border={1} cellPadding={10} >
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

                  <button onClick={() => handleEditClick(student)} >Edit</button>
                  <button onClick={() => student.id && deleteStudent(student.id)}>
                    Delete
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '15px' }}>
          <button
              className="btn-secondary"
              onClick={() => setPage(prev => Math.max(prev - 1, 0))}
              disabled={page === 0}
              style={{ opacity: page === 0 ? 0.5 : 1, cursor: page === 0 ? 'not-allowed' : 'pointer' }}
          >
            ◀ Previous
          </button>

          <span style={{ fontWeight: 'bold' }}>
                Page {page + 1} of {totalPages || 1}
            </span>

          <button
              className="btn-secondary"
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
              disabled={page >= totalPages - 1}
              style={{ opacity: page >= totalPages - 1 ? 0.5 : 1, cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}
          >
            Next ▶
          </button>
        </div>
        {isFormOpen && (
            <div className="modal-backdrop">
            <StudentForm
                studentToEdit={selectedStudent}
                onSaveSuccess={handleSaveSuccess}
                onCancel={handleFormCancel}
            />
            </div>
        )}


      </div>
  );
}

export default App;