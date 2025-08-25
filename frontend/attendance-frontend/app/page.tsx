"use client";

import { useEffect, useState } from "react";

type Student = {
  name: string;
  prn: string;
  year: number | string;
  email?: string;
  fingerprintid?: string;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    fetch("http://localhost:3001/api/students")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API responded with status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("API response:", data);
        if (Array.isArray(data)) {
          setStudents(data);
        } else if (data && typeof data === 'object') {
          // If the API returns an object with a students property
          if (Array.isArray(data.students)) {
            setStudents(data.students);
          } else {
            console.error("Unexpected data format - not an array or object with students array:", data);
            setError("Received invalid data format from server");
            setStudents([]);
          }
        } else {
          console.error("Unexpected data format:", data);
          setError("Received invalid data from server");
          setStudents([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
        setError(`Failed to fetch students: ${err.message}`);
        setStudents([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Registered Students</h1>
      
      {isLoading ? (
        <div className="text-center py-4">
          <p>Loading students...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">PRN</th>
              <th className="border px-4 py-2">Year</th>
              <th className="border px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student, idx) => (
                <tr key={idx}>
                  <td className="border px-4 py-2">{student.name}</td>
                  <td className="border px-4 py-2">{student.prn}</td>
                  <td className="border px-4 py-2">{student.year}</td>
                  <td className="border px-4 py-2">{student.email || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="border px-4 py-2 text-center">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
