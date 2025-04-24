import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';

import Course from '@/types/course';
import Review from '@/types/review';

/**
 * @author Ibrahim Queeum, Lars Andreas & Andreas Nilsen
 * @description The CourseList component displays a list of disc golf courses with filtering and search functionality.
 * Users can filter courses by town and rating, search by name or town, and select a course to view its details.
 * 
 * Features:
 * - Fetches and displays a list of courses from the backend.
 * - Provides a search bar for filtering courses by name or town.
 * - Allows filtering by town and rating using a dropdown menu.
 * - Displays a list of filtered courses.
 * - Allows users to select a course to view its details.
 * - Uses i18next for localization support.
 */

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
  const [selectedTowns, setSelectedTowns] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  /**
 * Fetches the list of courses from the backend and updates the state.
 * Populates the unique towns for filtering.
 * Displays an error toast if the fetch operation fails.
 * 
 * @author Ibrahim Queeum
 * @function fetchCourses
 */
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
          const towns = Array.from(new Set(data.map((course: Course) => course.town)));
          setUniqueTowns(towns);
        } else {
          toast.error(t('error_notanarray') + " " + data);
        }
      } catch (error) {
        toast.error(t('error_getcourses') + " " + error);
      }
    };
    fetchCourses();
  }, []);

 /**
 * Calculates the average rating for a course based on its reviews.
 * 
 * @author Ibrahim Queeum
 * @function calculateAverageRating
 * @param {Review[]} reviews - The list of reviews for the course.
 * @returns {number} The average rating, rounded to the nearest integer.
 */
  const calculateAverageRating = (reviews: Review[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round(totalRating / reviews.length);
  };

 /**
 * Filters the list of courses based on the search term, selected towns, and selected rating.
 * 
 * @author Ibrahim Queeum
 * @function filteredCourses
 * @returns {Course[]} The filtered list of courses.
 */
  const filteredCourses = courses.filter((course) => {
    const averageRating = calculateAverageRating(course.reviews);
    const matchesTown = selectedTowns.length === 0 || selectedTowns.includes(course.town);
    return (
      matchesTown &&
      (selectedRating ? averageRating === selectedRating : true) &&
      (course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.town.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

 /**
 * Toggles the selection of a town for filtering courses.
 * 
 * @author Ibrahim Queeum
 * @function handleTownSelect
 * @param {string} town - The town to toggle selection for.
 */
  const handleTownSelect = (town: string) => {
    if (selectedTowns.includes(town)) {
      setSelectedTowns(selectedTowns.filter((t) => t !== town));
    } else {
      setSelectedTowns([...selectedTowns, town]);
    }
  };

/**
 * Sets the selected rating for filtering courses.
 * Closes the dropdown menu after selection.
 * 
 * @author Ibrahim Queeum
 * @function handleRatingSelect
 * @param {number} rating - The rating to filter courses by.
 */
  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
    setShowDropdownBox(false);
  };

  return (
    <div className="min-w-[250px] sm:min-w-[300px] w-full">
      <div className="h-[100vh] p-4 rounded-xl shadow bg-[#E7EFFB]">
        {/* Filter Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder={t('course_search')}
            className="border p-2 rounded w-full text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="absolute right-3 top-2.5"
            onClick={() => {
              setSearchTerm('');
              setSelectedTowns([]);
              setSelectedRating(null);
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

          {/* Dropdown for Filters */}
          {showDropdownBox && (
            <div className="absolute top-12 right-0 bg-white border rounded shadow-lg w-full z-10 p-4 bg-opacity-90">
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">{t("courselist_town")}</label>
                <div className="flex flex-col gap-2">
                  {uniqueTowns.map((town) => (
                    <label key={town} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedTowns.includes(town)}
                        onChange={() => handleTownSelect(town)}
                        className="form-checkbox"
                      />
                      <span>{town}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">{t("courselist_popularity")}</label>
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

        {/* Course List */}
        <ul className="space-y-2 mt-4">
          {filteredCourses.map((course) => (
            <li key={course._id}>
              <button
                onClick={() => setSelectedCourse(course)}
                className="block w-full text-left bg-white hover:bg-blue-100 text-black px-4 py-2 rounded-lg shadow transition"
              >
                {course.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CourseList;
