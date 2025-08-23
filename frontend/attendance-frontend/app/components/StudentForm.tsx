"use client";
import { useState } from 'react';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (student: { name: string; prn: string; year: string }) => void;
}

export default function StudentForm({ isOpen, onClose, onSubmit }: StudentFormProps) {
  const [name, setName] = useState('');
  const [prn, setPrn] = useState('');
  const [year, setYear] = useState('1');
  const [step, setStep] = useState(1);
  
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    
    setStep(2);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, prn, year });
    // Reset form
    setName('');
    setPrn('');
    setYear('1');
    setStep(1);
    onClose();
  };
  
  const handleBack = () => {
    setStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glassmorphism rounded-lg p-8 max-w-md w-full border border-white border-opacity-20 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {step === 1 ? "Add New Student" : "Additional Information"}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {step === 1 ? (
          <form onSubmit={handleContinue}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="prn" className="block text-gray-700 mb-2">PRN</label>
              <input
                type="text"
                id="prn"
                value={prn}
                onChange={(e) => setPrn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="year" className="block text-gray-700 mb-2">Year</label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Continue 
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <p className="text-gray-600 mb-4">Place the finger on  sensor.</p>

              {/* Placeholder for future form fields */}
              <div className="bg-gray-100 p-4 rounded-md mb-4">
                <p className="text-sm text-gray-500">Student Information:</p>
                <p className="font-medium">Name: {name}</p>
                <p className="font-medium">PRN: {prn}</p>
                <p className="font-medium">Year: {year}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
