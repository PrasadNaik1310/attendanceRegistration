"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StudentForm from './StudentForm';

export default function Header() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleFormSubmit = async (student: { name: string; prn: string; year: string }) => {
    try {
      // Convert year to number before sending to backend
      const studentData = {
        name: student.name,
        prn: student.prn,
        year: parseInt(student.year, 10)
      };
      
      console.log('Sending student data:', studentData);
      
      //server checking log (debug)
      try {
        await fetch('http://localhost:3001/api/students', { method: 'GET' });
      } catch (networkError) {
        console.error('Cannot connect to backend server:', networkError);
        alert('Cannot connect to the backend server. Please make sure it is running.');
        return;
      }
      
      const response = await fetch('http://localhost:3001/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Server response:', response.status, errorData);
        throw new Error(`Failed to add student: ${response.status}`);
      }
      
      // Refresh the page to show new student
      window.location.reload();
    } catch (error) {
      console.error('Error adding student:', error);
      console.log('Student data was sent to the server');
      alert(`Failed to add student. Please try again. ${error}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm p-4 z-10">
      <div className="container ">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="https://gdscmitwpu.tech/" className="">
              <Image src="/gdgoc-logo.svg" alt="Logo" width={100} height={100} />
            </Link>
            <span className="font-bold text-xl">Registered Students</span>
          </div>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors ml-10"
          >
            + Create New Student
          </button>
        </div>
      </div>
      
      <StudentForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </header>
  );
}
