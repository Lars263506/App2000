import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';

import Course from '@/types/aaa';
import Review from '@/types/aaa';


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

  const calculateAverageRating = (reviews: Review[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round(totalRating / reviews.length);
  };

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

  const handleTownSelect = (town: string) => {
    if (selectedTowns.includes(town)) {
      setSelectedTowns(selectedTowns.filter((t) => t !== town));
    } else {
      setSelectedTowns([...selectedTowns, town]);
    }
  };

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
    setShowDropdownBox(false);
  };

  return (
    <div className="min-w-[400px]">
      <div className="h-[100vh] p-4 rounded-xl shadow bg-[#E7EFFB]">
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

          {showDropdownBox && (
            <div className="absolute top-12 right-0 bg-white border rounded shadow-lg w-full z-10 p-4 bg-opacity-90 ">
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
