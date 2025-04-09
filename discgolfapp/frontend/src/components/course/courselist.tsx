import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FaStar } from 'react-icons/fa';
import Course from '@/types/course';
import Review from '@/types/review';

interface CourseListProps {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  setSelectedCourse: (course: Course | null) => void;
}



const CourseList: React.FC<CourseListProps> = ({ courses, setCourses, setSelectedCourse }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdownBox, setShowDropdownBox] = useState(false);
  const [uniqueTowns, setUniqueTowns] = useState<string[]>([]);
  const [selectedTown, setSelectedTown] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/course';

      try {
        const response = await fetch(url, {
          method: 'GET',
        });

        const result = await response.json();
        const data = result.data;

        if (Array.isArray(data)) {
          setCourses(data);

          // Extract unique towns
          const towns = Array.from(new Set(data.map((course: Course) => course.town)));
          setUniqueTowns(towns);
        } else {
          console.error(t('error_notanarray'), data);
        }
      } catch (error) {
        console.error(t('error_getcourses'), error);
      }
    };
    fetchCourses();
  }, []);

  const calculateAverageRating = (reviews: Review[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round(totalRating / reviews.length); // Round to the nearest integer
  };

  const filteredCourses = courses.filter((course) => {
    const averageRating = calculateAverageRating(course.reviews);
    return (
      (selectedTown ? course.town === selectedTown : true) &&
      (selectedRating ? averageRating === selectedRating : true) &&
      (course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       course.town.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleTownSelect = (town: string) => {
    setSelectedTown(town);
    setShowDropdownBox(false);
  };

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
    setShowDropdownBox(false);
  };

  return (
    <div className="min-w-[400px]">
      <div className="h-[100vh] p-4 rounded-xl shadow bg-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder={t('course_search')}
            className="border p-2 rounded w-full mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="absolute right-3 top-2.5"
            onClick={() => {
              setSearchTerm(''); // Clear the search term
              setSelectedTown(null); // Clear the selected town filter
              setSelectedRating(null); // Clear the selected rating filter
            }}
          >
            <X size={20} />
          </button>
          <button
            className="absolute right-10 top-2.5"
            onClick={() => setShowDropdownBox(!showDropdownBox)}
          >
            <ChevronDown size={20} />
          </button>

          {showDropdownBox && (
            <div className="absolute top-12 right-0 bg-white border rounded shadow-lg w-full z-10 p-4">
              {/* Town Filter */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">By</label>
                <select
                  className="w-full border p-2 rounded"
                  value={selectedTown || ''}
                  onChange={(e) => handleTownSelect(e.target.value)}
                >
                  <option value="">Velg en by</option>
                  {uniqueTowns.map((town) => (
                    <option key={town} value={town}>
                      {town}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Popularitet</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`cursor-pointer ${
                        selectedRating && selectedRating >= star
                          ? 'text-yellow-500'
                          : 'text-gray-300'
                      }`}
                      onClick={() => handleRatingSelect(star)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <ul>
          {filteredCourses.map((course) => (
            <li key={course._id}>
              <button onClick={() => setSelectedCourse(course)}>
                {course.name} {/* Only display the course name */}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseList;
