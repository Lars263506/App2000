import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

import Course from '@/types/course'
import Review from '@/types/review'
import axios from 'axios'
import Button from '../global/Button'

import { useTranslation } from 'react-i18next'

/**
 * @author: Lars Andreas, Ibrahim Queeum & Andreas Nilsen
 * @description The CourseDetails component displays detailed information about a selected disc golf course.
 * It provides functionality for viewing course details, weather information, and user reviews.
 * Users can also submit reviews for the course.
 * 
 * Features:
 * - Displays course details such as location, difficulty, and family-friendliness.
 * - Fetches and displays weather data for the course location.
 * - Fetches and displays user reviews for the course.
 * - Allows logged-in users to submit reviews with a rating and comment.
 * - Provides a tabbed interface for switching between details, weather, and reviews.
 * - Uses i18next for localization support.
 */

/**
 Copilot has been used to generate the code for the functions and comments,
but all content has been reviewed and edited to ensure accuracy and alignment
with the project's requirements.
*/

interface CourseDetailsProps {
  selectedCourse: Course | null
  setSelectedCourse: (course: Course | null) => void
}

interface WeatherData {
  current: {
    condition: {
      icon: string;
      text: string;
    };
    temp_c: number;
    wind_kph: number;
  };
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ selectedCourse, setSelectedCourse }) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'details' | 'weather' | 'reviews'>('details')
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0)
  const [username, setUsername] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isLoggedIn = !!localStorage.getItem('accessToken')

 /**
 * Fetches weather data for the selected course using the WeatherAPI.
 * Updates the `weatherData` state with the fetched data.
 * Displays an error toast if the fetch operation fails.
 * 
 * @author Andreas Nilsen
 * @function fetchWeather
 */

  useEffect(() => {
    if (selectedCourse != null) {
      const fetchWeather = async () => {
        const apiKey = '685494a20dd04a5ebed120754252602'
        const lat = selectedCourse.latitude
        const lon = selectedCourse.longitude
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=4&lang=no`

        try {
          const response = await axios.get(url)
          console.log('Weather data:', response.data)
          setWeatherData(response.data)
        } catch (error) {
          toast.error(t("coursedetails_toast_error_fetch_weather_data") + error)
        }
      }

      fetchWeather()
    }
  }, [selectedCourse])

  /**
 * Fetches reviews for the selected course from the backend.
 * Updates the `reviews` state with the fetched data.
 * Displays an error toast if the fetch operation fails.
 * 
 * @author Ibrahim Queeum
 * @function fetchReviews
 */

  useEffect(() => {
    if (selectedCourse) {
      const fetchReviews = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/reviews/course/${selectedCourse._id}`
          );
          setReviews(response.data);
        } catch (error) {
          toast.error(t("coursedetails_toast_error_fetching_reviews") + error);
        }
      };

      fetchReviews();
    }
  }, [selectedCourse]);

  /**
 * Submits a new review for the selected course to the backend.
 * Updates the `reviews` state with the newly added review.
 * Displays success or error toasts based on the outcome.
 * 
 * @author Ibrahim Queeum
 * @function handleSubmitReview
 */

  const handleSubmitReview = async () => {
    if (!selectedCourse) return;

    setIsSubmitting(true);
    try {
      const newReview = {
        courseId: selectedCourse._id,
        username: username || 'Anonymous',
        rating,
        comment,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/reviews`, newReview, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/reviews/course/${selectedCourse._id}`
      );
      setReviews(response.data);

      setRating(0);
      setComment('');
      setUsername('');
    } catch (error) {
      toast.error(t("coursedetails_toast_error_fetching_reviews") + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex'>
      {selectedCourse != null && (
       <div className='flex-1 h-[100vh] min-w-[450px] bg-[#E7EFFB] p-4 rounded-xl shadow flex flex-col'>
          <div className='flex w-full'>
            <button
              className={`flex-1 py-1 text-center rounded-l-lg ${activeTab === 'details' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('details')}
            >
              {t("coursedetails_course")}
            </button>
            <button
              className={`flex-1 py-1 text-center ${activeTab === 'weather' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('weather')}
            >
              {t("coursedetails_weather")}
            </button>
            <button
              className={`flex-1 py-1 text-center rounded-r-lg ${activeTab === 'reviews' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('reviews')}
            >
              {t("coursedetails_reviews")}
            </button>
          </div>

          <div className='flex justify-between items-center mb-4 mt-6'>
            <h2 className='text-2xl font-semibold text-gray-900'>🏆 {selectedCourse.name}</h2>
          </div>

          <div className='space-y-6 text-gray-700 flex-grow mt-4 overflow-y-auto'>
            {activeTab === 'details' && (
              <>
                <p><span className='font-medium'>🏡 {t("coursedetails_city")}:</span> {selectedCourse.town}</p>
                <p><span className='font-medium'>📍 {t("coursedetails_location")}:</span> {selectedCourse.location}</p>
                <p><span className='font-medium'>🏙️ {t("coursedetails_postcode")}:</span> {selectedCourse.postCode}</p>
                <p><span className='font-medium'>🌍 {t("coursedetails_latitude")}:</span> {selectedCourse.latitude}</p>
                <p><span className='font-medium'>🌏 {t("coursedetails_longitude")}:</span> {selectedCourse.longitude}</p>
                <p><span className='font-medium'>🎯 {t("coursedetails_difficulty")}:</span> {selectedCourse.difficulty}</p>
                {selectedCourse.familyFriendly && (
                  <p><span className='font-medium'>👨‍👩‍👧‍👦 {t("coursedetails_family_friendly")}:</span> {selectedCourse.familyFriendly}</p>
                )}
              </>
            )}

            {activeTab === 'weather' && weatherData && (
              <div>
                <h3 className='text-md font-semibold mb-4'>Vær for {selectedCourse.location}</h3>

                <div className='bg-blue-50 p-4 rounded-lg shadow-lg flex flex-col items-center mb-6'>
                  <p className='text-md font-semibold mb-2'>{t("coursedetails_weather_for_today")}:</p>
                  <img
                    src={`https:${(weatherData).current.condition.icon}`}
                    alt={(weatherData).current.condition.text}
                    className='w-12 h-12 mb-2'
                  />
                  <p className='text-lg font-semibold'>{(weatherData).current.condition.text}</p>
                  <p className='text-xl font-bold'>{(weatherData).current.temp_c}°C</p>
                  <p className='text-sm mt-2'>{t("coursedetails_wind")}: {(weatherData).current.wind_kph} km/h</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className='text-lg font-semibold mb-4'>{t("coursedetails_title_reviews")}</h3>
                <div className='space-y-4'>
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <div key={index} className='p-4 border rounded shadow'>
                        <p>
                          <span className='font-medium'>{review.username}:</span> {review.comment}
                        </p>
                        <p>{t("coursedetails_rating")}: {'⭐'.repeat(review.rating)}</p>
                      </div>
                    ))
                  ) : (
                    <p>{t("coursedetails_no_reviews_yet")}</p>
                  )}
                </div>

                {isLoggedIn ? (
                  <div className='mt-4'>
                    <h3 className='text-lg font-semibold mb-2'>{t("coursedetails_add_your_review")}</h3>
                    <input
                      type='text'
                      placeholder={t("coursedetails_your_name")}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className='w-full p-2 border rounded mb-2'
                    />
                    <textarea
                      className='w-full p-2 border rounded mb-2'
                      rows={3}
                      placeholder={t("coursedetails_your_review")}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <div className='flex items-center mb-2'>
                      <span className='mr-2'>{t("coursedetails_rating")}:</span>
                      <div className='flex'>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`cursor-pointer ${i < rating ? 'text-yellow-500' : 'text-gray-400'}`}
                            onClick={() => setRating(i + 1)}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={handleSubmitReview}
                      className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50'
                      disabled={isSubmitting || rating === 0 || comment.trim() === ''}
                    >
                      {isSubmitting ? 'Sender...' : 'Send anmeldelse'}
                    </button>
                  </div>
                ) : (
                  <p className='text-gray-600 mt-4'>
                    {t("coursedetails_login_to_review")}
                  </p>
                )}
              </div>
            )}
          </div>

          <Button onClick={() => setSelectedCourse(null)}>
          {t("coursedetails_close")}
          </Button>
        </div>
      )}
    </div>
  )
}

export default CourseDetails
