import React from 'react';
import { Course } from '../../pages/coursepage';
import { X } from 'lucide-react';

type CourseDetailsProps = {
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
};

const CourseDetails: React.FC<CourseDetailsProps> = ({ selectedCourse, setSelectedCourse }) => {
  return (
    <div className="flex">
      {selectedCourse && (
        <div className="w-96 bg-white p-6 rounded-2xl shadow-lg text-gray-800 border border-gray-300 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">🏆 {selectedCourse.name}</h2>
            <button 
              className="text-gray-500 hover:text-gray-800 transition" 
              onClick={() => setSelectedCourse(null)}
            >
              <X size={24} />
            </button>
          </div>
          <div className="space-y-3 text-gray-700 flex-grow">
            <p><span className="font-medium">📍 Lokasjon:</span> {selectedCourse.location}</p>
            <p><span className="font-medium">🏙️ Post Kode:</span> {selectedCourse.postCode}</p>
            <p><span className="font-medium">🌍 Breddegrad:</span> {selectedCourse.latitude}</p>
            <p><span className="font-medium">🌏 Lengegrad:</span> {selectedCourse.longitude}</p>
            <p><span className="font-medium">🎯 Vanskelighetsgrad:</span> {selectedCourse.difficulty}</p>

            {selectedCourse.familyFriendly && (
              <p><span className="font-medium">👨‍👩‍👧‍👦 Familievennlig:</span> Ja</p>
            )}
          </div>
          <button 
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mt-6 hover:bg-gray-800 transition"
            onClick={() => setSelectedCourse(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
