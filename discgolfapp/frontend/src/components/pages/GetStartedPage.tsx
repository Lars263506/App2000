'use client'

import { usePopup } from '@/components/global/usepopup'
import { useState } from 'react'
import Image from 'next/image'
import Navbar from '@/components/global/navbar'
import Footer from '@/components/global/footer'
import PopupWrapper from '@/components/global/popupwrapper'

const GetStartedPage = () => {
  const [selectedInfo, setSelectedInfo] = useState<'beginner' | 'advanced'>('beginner')

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hovedinnhold */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-4xl w-full bg-[#E7EFFB] p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-[#1B365D] mb-4">Kom i gang med Discgolf</h1>
          <p className="text-[#2A4470] mb-6">
            Velg mellom nybegynner- og avanserte tips for å forbedre ditt spill.
          </p>

          {/* Knappene for å velge nivå */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setSelectedInfo('beginner')}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition-all ${
                selectedInfo === 'beginner' ? 'bg-[#1B365D]' : 'bg-gray-400'
              }`}
            >
              Nybegynner Tips
            </button>
            <button
              onClick={() => setSelectedInfo('advanced')}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition-all ${
                selectedInfo === 'advanced' ? 'bg-[#1B365D]' : 'bg-gray-400'
              }`}
            >
              Avansert Tips
            </button>
          </div>

          {/* Innholdet som skifter basert på valg */}
          <div className="text-left bg-white p-6 rounded-lg shadow-md">
            {selectedInfo === 'beginner' ? (
              <div>
                <h2 className="text-xl font-bold text-[#1B365D] mb-4">Tips for nybegynnere</h2>
                <p className="text-[#2A4470] mb-4">
                  Discgolf er en morsom og inkluderende sport som er enkel å lære, men utfordrende å mestre. Her er noen gode tips for å komme i gang:
                </p>
                <ul className="list-disc pl-5 text-[#2A4470] space-y-2">
                  <li><strong>1. Velg riktig disc:</strong> Start med en <strong>putter</strong> eller <strong>midrange-disc</strong>. De er enklere å kontrollere enn raske drivere.</li>
                  <li><strong>2. Lær de grunnleggende kastene:</strong> Backhand, forehand (sidearm) og putting er de viktigste teknikkene.</li>
                  <li><strong>3. Forstå reglene:</strong> Start fra tee-området og kast mot kurven. Etter hvert kast spiller du videre fra der discen lander.</li>
                  <li><strong>4. Fokuser på teknikk fremfor kraft:</strong> Rolige og kontrollerte kast gir bedre resultater enn å prøve å kaste for hardt.</li>
                  <li><strong>5. Spill med erfarne spillere:</strong> Å lære av mer erfarne spillere gir raskere progresjon.</li>
                  <li><strong>6. Ha realistiske forventninger:</strong> Treffer du et tre? Ingen fare! Det er en del av læringsprosessen.</li>
                  <li><strong>7. Bruk enkelt utstyr:</strong> Start med rimelige discer og oppgrader etter hvert.</li>
                  <li><strong>8. Øv jevnlig:</strong> Jo mer du spiller, jo bedre blir du!</li>
                </ul>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-[#1B365D] mb-4">Avansert discgolfstrategi</h2>
                <p className="text-[#2A4470] mb-4">
                  Discgolf på et mer avansert nivå krever teknikk, strategi og en dypere forståelse av spillet. Her er noen tips for erfarne spillere:
                </p>
                <ul className="list-disc pl-5 text-[#2A4470] space-y-2">
                  <li><strong>1. Bruk forskjellige disker:</strong> Speed 9-12 drivere for kontroll, Speed 13+ for lengde.</li>
                  <li><strong>2. Mastere avanserte kasteteknikker:</strong> Lær hyzer, anhyzer og roller-kast for mer fleksibilitet.</li>
                  <li><strong>3. Forstå vindens innvirkning:</strong> Trening i ulike værforhold gir bedre kontroll på kast.</li>
                  <li><strong>4. Forbedre mental styrke:</strong> Øv på strategisk tenkning og å holde hodet kaldt under press.</li>
                  <li><strong>5. Fysisk trening og vedlikehold:</strong> Mobilitet, styrke og utholdenhet påvirker kasteteknikken din.</li>
                  <li><strong>6. Spill på avanserte baner:</strong> Utfordre deg selv med trange passasjer og teknisk krevende hull.</li>
                  <li><strong>7. Øv på spesifikke situasjoner:</strong> Trening på kast fra vanskelig terreng gir bedre resultater i turneringer.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Bildekarusell - Matcher frontpage design */}
        <div className="flex justify-center mt-8 space-x-4">
          <Image src="/post.png" alt="Discgolf Image 1" width={200} height={200} className="rounded-lg shadow-md" />
          <Image src="/disc.png" alt="Discgolf Image 2" width={200} height={200} className="rounded-lg shadow-md" />
          <Image src="/discs.png" alt="Discgolf Image 3" width={200} height={200} className="rounded-lg shadow-md" />
          <Image src="/kaste.png" alt="Discgolf Image 4" width={200} height={200} className="rounded-lg shadow-md" />
        </div>
      </div>
    </div>
  )
}

export default GetStartedPage
