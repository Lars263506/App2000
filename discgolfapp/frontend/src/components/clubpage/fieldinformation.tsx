import React, { useEffect, useState } from 'react'

/**
 * @author Andreas Nilsen
 * @description Line: 40-41, ChatGPT has helped with styling in tailwind.
 */

interface Field {
  fieldName: string
  location: string
}

const FieldInformation: React.FC = () => {
  const [field, setField] = useState<Field | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Her kan du hente data fra backend når API-et er klart
    const fetchFieldInfo = async () => {
      try {
        // Eksempel: Erstatt URL-en med din faktiske API-endepunkt
        // const response = await fetch('/api/field');
        // const data = await response.json();

        // Foreløpig hardkodet eksempeldata
        const data: Field = { fieldName: 'Bø DiscGolfPark', location: 'Bø' }

        setField(data)
      } catch (error) {
        console.error('Feil ved henting av baneinformasjon:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFieldInfo()
  }, [])

  return (
    <div className='p-4 border rounded-lg shadow-md bg-white w-full'>
      <h2 className='text-xl font-bold mb-2'>Baneinformasjon</h2>
      {loading
        ? (
          <p className=''>Laster baneinformasjon...</p>
          )
        : (field != null)
            ? (
              <>
                <p className=''>Bane: {field.fieldName}</p>
                <p className=''>Sted: {field.location}</p>
              </>
              )
            : (
              <p className=''>Ingen baneinformasjon tilgjengelig.</p>
              )}
    </div>
  )
}

export default FieldInformation
