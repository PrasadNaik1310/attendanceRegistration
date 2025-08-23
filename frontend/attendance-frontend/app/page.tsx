"use client";

import { useEffect, useState } from "react";

type Student = {
  name: string;
  prn: string;
  year: string;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Registered Students</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">PRN</th>
            <th className="border px-4 py-2">Year</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{student.name}</td>
              <td className="border px-4 py-2">{student.prn}</td>
              <td className="border px-4 py-2">{student.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
