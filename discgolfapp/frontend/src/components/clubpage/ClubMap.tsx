import React, { useState, useEffect, useCallback, useRef } from 'react'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { toast } from 'react-toastify'

import Club from '../../types/club'
import { useTranslation } from 'react-i18next'

/**
 * @author Adrian Johansen & Ibrahim Queeum
 * @description This component displays a map of clubs using Google Maps.
 * It fetches club data from the backend and geocodes their addresses to display markers on the map.
 * Users can click on markers to view club details and navigate to the club page.
 * The map dynamically adjusts to fit all markers and supports selecting a specific club.
 * Success and error notifications are shown for geocoding and data fetching.
 */

interface ClubMapProps {
  selectedClub: Club | null
  setSelectedPage: ( page: string ) => void
}

const ClubMap: React.FC<ClubMapProps> = ({ selectedClub, setSelectedPage }) => {
  const { t, i18n } = useTranslation()
  const [clubs, setClubs] = useState<Club[]>([])
  const [markers, setMarkers] = useState<google.maps.LatLng[]>([])
  const [selectedMarker, setSelectedMarker] = useState<google.maps.LatLng | null>(null)
  const [activeClub, setActiveClub] = useState<Club | null>(null)
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false)
  const mapRef = useRef<google.maps.Map | null>(null)

/**
 * Fetches the list of clubs from the backend and updates the state.
 * Displays an error toast if the fetch operation fails.
 * 
 * @function fetchClubs
 * @author Ibrahim Queeum
 */
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/clubpage/`)
        const data = await response.json()
        if (Array.isArray(data.data)) setClubs(data.data)
      } catch (error) {
        toast.error(t('toast_error_fetching_clubs') + ': ' + error);
      }
    }
    fetchClubs()
  }, [])

  /**
 * Geocodes a given address to retrieve its latitude and longitude.
 * Displays an error toast if the geocoding operation fails.
 * 
 * @author Ibrahim Queeum
 * @function geocodeAddress
 * @param {string} address - The address to geocode.
 * @returns {Promise<google.maps.LatLng>}
 */
  const geocodeAddress = useCallback(async (address: string) => {
    return await new Promise<google.maps.LatLng>((resolve, reject) => {
      new window.google.maps.Geocoder().geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          resolve(results[0].geometry.location)
        } else {
          toast.error(t('toast_error_geocoding_failed', { address, status }));
          reject(t('toast_error_geocoding_failed'));
        }
      })
    })
  }, [])

  /**
 * Fetches markers for all clubs by geocoding their addresses.
 * Updates the markers state with the geocoded locations.
 * 
 * @author Ibrahim Queeum
 * @function fetchMarkers
 */
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

/**
 * Geocodes the selected club's address and updates the map view to center on the club's location.
 * 
 * @author Ibrahim Queeum
 * @function updateSelectedClubLocation
 */
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

/**
 * Handles the click event on a marker, setting the active club and selected marker.
 * 
 * @author Ibrahim Queeum
 * @function handleMarkerClick
 * @param {Club} club - The club associated with the clicked marker.
 * @param {google.maps.LatLng} marker - The location of the clicked marker.
 */
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
          language={i18n.language}
          onLoad={() => setIsGoogleMapsLoaded(true)}
        >
          {!isGoogleMapsLoaded ? (
            <p>{t("clubmap_loading")}</p>
          ) : (
            <GoogleMap
              onLoad={(map) => {
                mapRef.current = map
                if (markers.length > 0) {
                  const bounds = new window.google.maps.LatLngBounds()
                  markers.forEach((marker) => {
                    if (marker && marker.lat() && marker.lng()) {
                      bounds.extend(marker)
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
          )}
        </LoadScript>
      </div>
    </div>
  )
}

export default ClubMap
