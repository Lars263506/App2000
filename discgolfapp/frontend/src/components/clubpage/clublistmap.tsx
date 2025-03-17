import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
interface Club {
  _id: string
  name: string
  address: string
}
const ClubListmap = () => {
  const [clubs, setClubs] = useState<Club[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [markers, setMarkers] = useState<google.maps.LatLng[]>([])
  const [selectedMarker, setSelectedMarker] = useState<google.maps.LatLng | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/clubpage/`)
        const data = await response.json()
        if (Array.isArray(data.data)) setClubs(data.data)
      } catch (error) {
        console.error('Feil ved henting av klubber:', error)
      }
    }
    fetchClubs()
  }, [])
  const geocodeAddress = useCallback(async (address: string) => {
    return await new Promise<google.maps.LatLng>((resolve, reject) => {
      new window.google.maps.Geocoder().geocode({ address }, (results, status) => {
        if (status === 'OK' && (results != null) && results[0]) {
          resolve(results[0].geometry.location)
        } else {
          reject('Geocoding failed')
        }
      })
    })
  }, [])
  useEffect(() => {
    const fetchMarkers = async () => {
      const newMarkers = (
        await Promise.all(clubs.map(async (club) => await geocodeAddress(club.address).catch(() => null)))
      ).filter(Boolean)
      setMarkers(newMarkers as google.maps.LatLng[])
    }
    if (clubs.length > 0) fetchMarkers()
  }, [clubs, geocodeAddress])
  useEffect(() => {
    const filteredClubs = clubs.filter((club) =>
      club.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (filteredClubs.length === 1) {
      geocodeAddress(filteredClubs[0].address)
        .then((location) => setSelectedMarker(location))
        .catch(() => setSelectedMarker(null))
    } else {
      setSelectedMarker(null)
    }
  }, [searchTerm, clubs, geocodeAddress])
  return (
    <div className='flex min-h-[580px] flex-col md:flex-row gap-6 w-full h-100 max-w-5xl '>
      {/* Klubbliste */}
      <div className='w-full md:w-1/2 bg-gray-200 p-4 rounded-xl shadow text-black'>
        <input
          type='text'
          placeholder='Filtrer på klubbnavn...'
          className='border p-2 rounded w-full mb-4'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul>
          {clubs
            .filter((club) => club.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((club) => (
              <li key={club._id} className='p-1 border-b last:border-none'>
                <Link href={`/clubpage?clubId=${club._id}`} className='text-blue-600 hover:text-blue-800'>
                  {club.name}
                </Link>
              </li>
            ))}
        </ul>
      </div>
      {/* Map */}
      <div className='w-full md:w-1/2 bg-gray-200 p-4 rounded-xl shadow'>
        <h2 className='text-xl font-bold text-black'>Kart</h2>
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
          <GoogleMap
            onLoad={(map) => {
              mapRef.current = map
              if (markers.length > 0) {
                const bounds = new window.google.maps.LatLngBounds()
                markers.forEach((marker) => bounds.extend(marker))
                map.fitBounds(bounds)
              }
            }}
            center={selectedMarker || (markers.length > 0 ? markers[0] : { lat: 59.9139, lng: 10.7522 })}
            zoom={(selectedMarker != null) ? 15 : 6}
            mapContainerStyle={{ height: '520px', width: '100%' }}
          >
            {markers.map((marker, index) => (
              <Marker key={index} position={marker} />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  )
}
export default ClubListmap
