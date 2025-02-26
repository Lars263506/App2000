import React, { useState } from 'react';
import { Course } from '../../pages/coursepage';

type CourseDetailsProps = {
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
};

const CourseDetails: React.FC<CourseDetailsProps> = ({ selectedCourse, setSelectedCourse }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'weather'>('details');

  // Dummy weather data for demonstration
  const weatherData = {
    temperature: '10°C',
    condition: 'Clear',
    windSpeed: '5 m/s',
  };

  return (
    <div className="flex">
      {selectedCourse && (
        <div className="w-96 bg-white rounded-lg text-gray-800 border border-gray-300 flex flex-col h-full">
          {/* Tab buttons - Plasseres helt øverst */}
          <div className="flex w-full">
            <button
              className={`flex-1 py-1 text-center rounded-l-lg ${activeTab === 'details' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('details')}
            >
              Bane
            </button>
            <button
              className={`flex-1 py-1 text-center rounded-r-lg ${activeTab === 'weather' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('weather')}
            >
              Vær
            </button>
          </div>

          {/* Course title */}
          <div className="flex justify-between items-center mb-4 mt-6">
            <h2 className="text-2xl font-semibold text-gray-900">🏆 {selectedCourse.name}</h2>
          </div>

          {/* Tab content */}
          <div className="space-y-6 text-gray-700 flex-grow mt-4">
            {activeTab === 'details' && (
              <>
                <p><span className="font-medium">📍 Lokasjon:</span> {selectedCourse.location}</p>
                <p><span className="font-medium">🏙️ Post Kode:</span> {selectedCourse.postCode}</p>
                <p><span className="font-medium">🌍 Breddegrad:</span> {selectedCourse.latitude}</p>
                <p><span className="font-medium">🌏 Lengegrad:</span> {selectedCourse.longitude}</p>
                <p><span className="font-medium">🎯 Vanskelighetsgrad:</span> {selectedCourse.difficulty}</p>
                {selectedCourse.familyFriendly && (
                  <p><span className="font-medium">👨‍👩‍👧‍👦 Familievennlig:</span> Ja</p>
                )}
              </>
            )}

            {activeTab === 'weather' && (
              <div>
                <p><span className="font-medium">🌡️ Temperature:</span> {weatherData.temperature}</p>
                <p><span className="font-medium">🌤️ Condition:</span> {weatherData.condition}</p>
                <p><span className="font-medium">💨 Wind Speed:</span> {weatherData.windSpeed}</p>
              </div>
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
