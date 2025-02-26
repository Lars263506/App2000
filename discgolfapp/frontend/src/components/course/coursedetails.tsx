import React, { useState, useEffect } from 'react';
import { Course } from '../../pages/coursepage';

type CourseDetailsProps = {
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ selectedCourse, setSelectedCourse }) => {

  return (
    <div className="flex">
      {selectedCourse && (
        <div className="w-96 bg-gray-200 p-4 rounded-xl shadow text-black">
          <h2 className="text-xl font-bold">Course Details</h2>
          <p>Course name: {selectedCourse.name}</p>
          <p>Location: {selectedCourse.location}</p>
          <p>Post code: {selectedCourse.postCode}</p>
          <p>Latitude: {selectedCourse.latitude}</p>
          <p>Longitude: {selectedCourse.longitude}</p>
          <button className="bg-gray-700 text-white px-4 py-2 rounded mt-4" onClick={() => setSelectedCourse(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;


