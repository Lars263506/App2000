import React, { useRef, useEffect, useState } from 'react'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { Course } from '../../pages/coursepage'

interface CourseMapProps {
  selectedCourse: Course | null
  courses: Course[]
  setSelectedCourse: (course: Course) => void

}

const CourseMap: React.FC<CourseMapProps> = ({ selectedCourse, courses, setSelectedCourse }) => {
  const mapRef = useRef<google.maps.Map | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<Course | null>(null)

  useEffect(() => {
    if ((mapRef.current != null) && (selectedCourse != null)) {
      const newCenter = new window.google.maps.LatLng(selectedCourse.latitude, selectedCourse.longitude)
      mapRef.current.setCenter(newCenter)
      mapRef.current.setZoom(15)
    }
  }, [selectedCourse])

    return (
      <div className=' md:w-1/2 flex-grow min-w-[450px] bg-gray-200 p-4 rounded-xl shadow'>
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
          <GoogleMap
            onLoad={(map) => {
              mapRef.current = map
            }}
            center={(selectedCourse != null) ? { lat: selectedCourse.latitude, lng: selectedCourse.longitude } : { lat: 59.9139, lng: 10.7522 }}
            zoom={(selectedCourse != null) ? 15 : 6}
            mapContainerStyle={{ height: '680px', width: '100%' }}
          >
            {courses.map((course) => (
              <Marker
                key={course.name}
                position={{ lat: course.latitude, lng: course.longitude }}
                onClick={() => {
                  setSelectedCourse(course)
                  setSelectedMarker(course)
                }}
              />
            ))}
  
            {(selectedMarker != null) && (
              <InfoWindow
                position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className='text-black'>
                  {selectedMarker.name}
                  <a
                    href={`https://www.google.com/maps?q=${selectedMarker.latitude},${selectedMarker.longitude}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-500 block'
                  >
                    Naviger hit
                </a>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

export default CourseMap
