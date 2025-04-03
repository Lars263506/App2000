'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

const GetStartedPage = () => {
  const { t } = useTranslation()
  const [selectedInfo, setSelectedInfo] = useState<'beginner' | 'advanced'>('beginner')

  const [content, setContent] = useState<{
    beginnerTitle: string
    beginnerDescription: string
    advancedTitle: string
    advancedDescription: string
  } | null>(null)

  // Hent innhold fra backend
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('http://localhost:4000/getstarted-content')
        const data = await response.json()
        setContent(data)
      } catch (error) {
        console.error('Kunne ikke hente innhold. Bruker fallback.')
      }
    }

    fetchContent()
  }, [])

  return (
    <div className="flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-center pb-8">
        <div className="max-w-4xl w-full p-8 rounded-lg shadow-lg text-center bg-[#E7EFFB]">
          <h1 className="text-2xl font-bold text-[#1B365D] mb-4">
            {t("getstarted_title")}
          </h1>
          <p className="text-[#2A4470] mb-6">
            {t("getstarted_choose")}
          </p>

          {/* Knappene for å velge nivå */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setSelectedInfo('beginner')}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition-all ${selectedInfo === 'beginner' ? 'bg-[#1B365D]' : 'bg-gray-400'}`}
            >
              {t("getstarted_beginnerbutton")}
            </button>
            <button
              onClick={() => setSelectedInfo('advanced')}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition-all ${selectedInfo === 'advanced' ? 'bg-[#1B365D]' : 'bg-gray-400'}`}
            >
              {t("getstarted_advancedbutton")}
            </button>
          </div>

          {/* Innholdet som skifter basert på valg */}
          <div className="text-left bg-white p-6 rounded-lg shadow-md">
            {selectedInfo === 'beginner' ? (
              <div>
                <h2 className="text-xl font-bold text-[#1B365D] mb-4">
                  {content?.beginnerTitle || t("getstarted_beginner_title")}
                </h2>
                <p className="text-[#2A4470] mb-4">
                  {content?.beginnerDescription || t("getstarted_beginner_description")}
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-[#1B365D] mb-4">
                  {content?.advancedTitle || t("getstarted_advanced_title")}
                </h2>
                <p className="text-[#2A4470] mb-4">
                  {content?.advancedDescription || t("getstarted_advanced_description")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bildekarusell */}
        <div className="flex justify-center mt-8 space-x-4">
          <Image src="/images/post.png" alt="Discgolf Image 1" width={200} height={200} className="rounded-lg shadow-md" />
          <Image src="/images/disc.png" alt="Discgolf Image 2" width={200} height={200} className="rounded-lg shadow-md" />
          <Image src="/images/discs.png" alt="Discgolf Image 3" width={200} height={200} className="rounded-lg shadow-md" />
          <Image src="/images/kaste.png" alt="Discgolf Image 4" width={200} height={200} className="rounded-lg shadow-md" />
        </div>
      </div>
    </div>
  )
}

export default GetStartedPage
