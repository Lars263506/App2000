import React, { useState, useEffect } from 'react';
import { Course } from '../../pages/coursepage';
import axios from 'axios';

type CourseDetailsProps = {
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
};

const CourseDetails: React.FC<CourseDetailsProps> = ({ selectedCourse, setSelectedCourse }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'weather'>('details');
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    if (selectedCourse) {
      const fetchWeather = async () => {
        const apiKey = '685494a20dd04a5ebed120754252602'; 
        const lat = selectedCourse.latitude;
        const lon = selectedCourse.longitude;
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=4&lang=no`; 

        try {
          const response = await axios.get(url);
          setWeatherData(response.data);
        } catch (error) {
          console.error('Error fetching weather data:', error);
        }
      };

      fetchWeather();
    }
  }, [selectedCourse]);

  return (
    <div className="flex">
      {selectedCourse && (
        <div className="w-96 bg-white rounded-lg text-gray-800 border border-gray-300 flex flex-col h-full">
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

            {activeTab === 'weather' && weatherData && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Vær for {selectedCourse.location}</h3>

                {/* Current weather for today */}
                <div className="bg-blue-50 p-4 rounded-lg shadow-lg flex flex-col items-center w-full mb-6">
                  <img
                    src={`https:${weatherData.current.condition.icon}`}
                    alt={weatherData.current.condition.text}
                    className="w-16 h-16 mb-4"
                  />
                  <p className="text-lg font-semibold">{weatherData.current.condition.text}</p>
                  <p className="text-xl font-bold">{weatherData.current.temp_c}°C</p>
                  <p className="text-sm mt-2">Vind: {weatherData.current.wind_kph} km/h</p>
                </div>

                {/* Weather forecast for the next 3 days */}
                <div className="flex justify-between space-x-4">
                  {weatherData.forecast.forecastday.slice(1, 4).map((day: any) => (
                    <div key={day.date} className="bg-blue-50 p-4 rounded-lg shadow-lg flex flex-col items-center w-1/3">
                      <img
                        src={`https:${day.day.condition.icon}`}
                        alt={day.day.condition.text}
                        className="w-12 h-12 mb-2"
                      />
                      <p className="text-md font-semibold">{new Date(day.date).toLocaleDateString()}</p>
                      <p className="text-sm">{day.day.condition.text}</p>
                      <p className="mt-2 text-xl font-bold">{day.day.maxtemp_c}°C / {day.day.mintemp_c}°C</p>
                      <p className="text-sm mt-1">Vind: {day.day.maxwind_kph} km/h</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mt-6 hover:bg-gray-800 transition"
            onClick={() => setSelectedCourse(null)}
          >
            Lukk
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
