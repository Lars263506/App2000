import React, { useState, useEffect } from 'react'
import { Course } from '../pages/CoursePage'
import axios from 'axios'
import Button from '../global/button'

interface Review {
  username: string
  rating: number
  comment: string
}

interface CourseDetailsProps {
  selectedCourse: Course | null
  setSelectedCourse: (course: Course | null) => void
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ selectedCourse, setSelectedCourse }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'weather' | 'reviews'>('details')
  const [weatherData, setWeatherData] = useState<any>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0)
  const [username, setUsername] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (selectedCourse != null) {
      const fetchWeather = async () => {
        const apiKey = '685494a20dd04a5ebed120754252602'
        const lat = selectedCourse.latitude
        const lon = selectedCourse.longitude
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=4&lang=no`

        try {
          const response = await axios.get(url)
          setWeatherData(response.data)
        } catch (error) {
          console.error('Error fetching weather data:', error)
        }
      }

      fetchWeather()
    }
  }, [selectedCourse])

  useEffect(() => {
    if (selectedCourse && activeTab === 'reviews') {
      const fetchReviews = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/reviews/course/${selectedCourse._id}`
          )
          setReviews(response.data)
        } catch (error) {
          console.error('Error fetching reviews:', error)
        }
      }

      fetchReviews()
    }
  }, [selectedCourse, activeTab])

  const handleSubmitReview = async () => {
    if (!selectedCourse) return

    setIsSubmitting(true)
    try {
      const newReview = {
        courseId: selectedCourse._id,
        username: username || 'Anonymous',
        rating,
        comment,
      }

      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/reviews`, newReview)
      setReviews((prev) => [...prev, newReview])
      setRating(0)
      setComment('')
      setUsername('')
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex'>
      {selectedCourse != null && (
        <div className='flex-1 h-[100vh] min-w-[450px] bg-gray-200 p-4 rounded-xl shadow flex flex-col'>
          <div className='flex w-full'>
            <button
              className={`flex-1 py-1 text-center rounded-l-lg ${activeTab === 'details' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('details')}
            >
              Bane
            </button>
            <button
              className={`flex-1 py-1 text-center ${activeTab === 'weather' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('weather')}
            >
              Vær
            </button>
            <button
              className={`flex-1 py-1 text-center rounded-r-lg ${activeTab === 'reviews' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Anmeldelser
            </button>
          </div>

          <div className='flex justify-between items-center mb-4 mt-6'>
            <h2 className='text-2xl font-semibold text-gray-900'>🏆 {selectedCourse.name}</h2>
          </div>

          <div className='space-y-6 text-gray-700 flex-grow mt-4 overflow-y-auto'>
            {activeTab === 'details' && (
              <>
                <p><span className='font-medium'>📍 Lokasjon:</span> {selectedCourse.location}</p>
                <p><span className='font-medium'>🏙️ Post Kode:</span> {selectedCourse.postCode}</p>
                <p><span className='font-medium'>🌍 Breddegrad:</span> {selectedCourse.latitude}</p>
                <p><span className='font-medium'>🌏 Lengegrad:</span> {selectedCourse.longitude}</p>
                <p><span className='font-medium'>🎯 Vanskelighetsgrad:</span> {selectedCourse.difficulty}</p>
                {selectedCourse.familyFriendly && (
                  <p><span className='font-medium'>👨‍👩‍👧‍👦 Familievennlig:</span> Ja</p>
                )}
              </>
            )}

            {activeTab === 'weather' && weatherData && (
              <div>
                <h3 className='text-md font-semibold mb-4'>Vær for {selectedCourse.location}</h3>

                <div className='bg-blue-50 p-4 rounded-lg shadow-lg flex flex-col items-center mb-6'>
                  <p className='text-md font-semibold mb-2'>Værmelding for i dag:</p>
                  <img
                    src={`https:${weatherData.current.condition.icon}`}
                    alt={weatherData.current.condition.text}
                    className='w-12 h-12 mb-2'
                  />
                  <p className='text-lg font-semibold'>{weatherData.current.condition.text}</p>
                  <p className='text-xl font-bold'>{weatherData.current.temp_c}°C</p>
                  <p className='text-sm mt-2'>Vind: {weatherData.current.wind_kph} km/h</p>
                </div>

                <div className='flex justify-between space-x-4'>
                  {weatherData.forecast.forecastday.slice(1, 3).map((day: any) => (
                    <div key={day.date} className='bg-blue-50 p-4 rounded-lg shadow-lg flex flex-col items-center w-1/2'>
                      <p className='text-md font-semibold mb-2'>{new Date(day.date).toLocaleDateString()}</p>
                      <img
                        src={`https:${day.day.condition.icon}`}
                        alt={day.day.condition.text}
                        className='w-12 h-12 mb-2'
                      />
                      <p className='text-sm'>{day.day.condition.text}</p>
                      <p className='mt-2 text-xl font-bold'>{day.day.maxtemp_c}°C / {day.day.mintemp_c}°C</p>
                      <p className='text-sm mt-1'>Vind: {day.day.maxwind_kph} km/h</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className='text-lg font-semibold mb-4'>Anmeldelser</h3>
                <div className='space-y-4'>
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <div key={index} className='p-4 border rounded shadow'>
                        <p>
                          <span className='font-medium'>{review.username}:</span> {review.comment}
                        </p>
                        <p>Rating: {Array.from({ length: review.rating }).map((_, i) => '⭐').join('')}</p>
                      </div>
                    ))
                  ) : (
                    <p>Ingen anmeldelser ennå. Bli den første til å legge til en!</p>
                  )}
                </div>

                <div className='mt-4'>
                  <h3 className='text-lg font-semibold mb-2'>Legg til din anmeldelse</h3>
                  <input
                    type='text'
                    placeholder='Ditt navn (valgfritt)'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='w-full p-2 border rounded mb-2'
                  />
                  <textarea
                    className='w-full p-2 border rounded mb-2'
                    rows={3}
                    placeholder='Skriv din anmeldelse...'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className='flex items-center mb-2'>
                    <span className='mr-2'>Rating:</span>
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
              </div>
            )}
          </div>

          <Button onClick={() => setSelectedCourse(null)}>
            Lukk
          </Button>
        </div>
      )}
    </div>
  )
}

export default CourseDetails
