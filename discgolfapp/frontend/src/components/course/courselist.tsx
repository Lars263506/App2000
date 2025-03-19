import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface CourseListProps {
  courses: Course[]
  setCourses: (courses: Course[]) => void
  setSelectedCourse: (course: Course | null) => void
}

interface Course {
  name: string
  location: string
  url: string
  postCode: string
  latitude: number
  longitude: number
  difficulty: string
  familyFriendly: boolean
  holes: number;
}

const CourseList: React.FC<CourseListProps> = ({ courses, setCourses, setSelectedCourse }) => {
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchCourses = async () => {
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/course'

      try {
        const response = await fetch(url, {
          method: 'GET'
        })

        const result = await response.json()

        const data = result.data

        if (Array.isArray(data)) {
          setCourses(data)
        } else {
          console.error('Fetched data is not an array:', data)
        }

        setCourses(data)
      } catch (error) {
        console.error('Feil ved henting av baner:', error)
      }
    }
    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='min-w-[200px]'>
      <div className='h-[100vh] p-4 rounded-xl shadow bg-gray-200'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Søk etter bane...'
            className='border p-2 rounded w-full mb-4'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className='absolute right-3 top-2.5'
            onClick={() => setSearchTerm('')}
          >
            <X size={20} />
          </button>
        </div>
        <ul>
          {filteredCourses.map(course => (
            <li key={course.name}>
              <button onClick={() => setSelectedCourse(course)}>{course.name}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CourseList
