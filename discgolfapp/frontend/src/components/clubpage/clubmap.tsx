import React, { useState, useEffect, useCallback, useRef } from 'react'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'

import { Club } from '../../types/club'
import { useTranslation } from 'react-i18next'

interface ClubMapProps {
  selectedClub: Club | null
  setSelectedPage: ( page: string ) => void
}

const ClubMap: React.FC<ClubMapProps> = ({ selectedClub, setSelectedPage }) => {
  const { t } = useTranslation()
  const [clubs, setClubs] = useState<Club[]>([])
  const [markers, setMarkers] = useState<google.maps.LatLng[]>([])
  const [selectedMarker, setSelectedMarker] = useState<google.maps.LatLng | null>(null)
  const [activeClub, setActiveClub] = useState<Club | null>(null)
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false)
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
        if (status === 'OK' && results && results[0]) {
          resolve(results[0].geometry.location)
        } else {
          console.error(`Geocoding failed for address: ${address}, status: ${status}`)
          reject('Geocoding failed')
        }
      })
    })
  }, [])

  useEffect(() => {
    const fetchMarkers = async () => {
      if (!isGoogleMapsLoaded) return

      const newMarkers = (
        await Promise.all(
          clubs.map(async (club) => {
            try {
              return await geocodeAddress(club.address)
            } catch {
              return null
            }
          })
        )
      ).filter((marker): marker is google.maps.LatLng => marker instanceof google.maps.LatLng)
      setMarkers(newMarkers)
    }
    if (clubs.length > 0) fetchMarkers()
  }, [clubs, geocodeAddress, isGoogleMapsLoaded])

  useEffect(() => {
    if (selectedClub) {
      geocodeAddress(selectedClub.address)
        .then((location) => {
          setSelectedMarker(location)
          if (mapRef.current) {
            mapRef.current.panTo(location)
            mapRef.current.setZoom(15)
          }
        })
        .catch(() => setSelectedMarker(null))
    }
  }, [selectedClub, geocodeAddress])

  const handleMarkerClick = (club: Club, marker: google.maps.LatLng) => {
    setActiveClub(club) 
    setSelectedMarker(marker)
  }

  const handleVisitClub = () => {
    if (activeClub) {
      localStorage.setItem('selectedClub', JSON.stringify(activeClub))
      setSelectedPage('Club')
    }
  }

  return (
    <div className='flex min-h-[580px] flex-col md:flex-row gap-6 w-full h-100 max-w-5xl '>
      <div className='w-full p-4 rounded-xl shadow'>
        <h1 className='text-xl font-bold text-black'>{t("clubmap_title")}</h1>
        <h2>{t("clubmap_prompt_action")}</h2>
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
          onLoad={() => setIsGoogleMapsLoaded(true)} // Mark API as loaded
        >
          <GoogleMap
            onLoad={(map) => {
              mapRef.current = map
              if (markers.length > 0) {
                const bounds = new window.google.maps.LatLngBounds()
                markers.forEach((marker) => {
                  if (marker && marker.lat() && marker.lng()) {
                    bounds.extend(marker)
                  } else {
                    console.error('Invalid marker:', marker)
                  }
                })
                map.fitBounds(bounds)
              }
            }}
            center={selectedMarker || (markers.length > 0 ? markers[0] : { lat: 59.9139, lng: 10.7522 })}
            zoom={(selectedMarker != null) ? 15 : 6}
            mapContainerStyle={{ height: '520px', width: '100%' }}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={marker}
                onClick={() => handleMarkerClick(clubs[index], marker)}
              />
            ))}
            {activeClub && selectedMarker && (
              <InfoWindow
                position={selectedMarker}
                onCloseClick={() => setActiveClub(null)}
              >
                <div>
                  <h2 className="font-bold">{activeClub.name}</h2>
                  <p>{activeClub.address}</p>
                  <button
                    className="mt-2 p-2 bg-blue-500 text-white rounded"
                    onClick={handleVisitClub}
                  >
                    {t("clubmap_visit_club")}
                  </button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  )
}

export default ClubMap