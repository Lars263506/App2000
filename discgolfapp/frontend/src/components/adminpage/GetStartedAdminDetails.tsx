'use client'

import React, { useState } from 'react'

const GetStartedAdminDetails: React.FC = () => {
  const [beginnerTitle, setBeginnerTitle] = useState('')
  const [beginnerDescription, setBeginnerDescription] = useState('')
  const [advancedTitle, setAdvancedTitle] = useState('')
  const [advancedDescription, setAdvancedDescription] = useState('')

  const handleSave = () => {
    // TODO: Lagre til backend eller oversettelsesfil
    console.log('Lagre:', { beginnerTitle, beginnerDescription, advancedTitle, advancedDescription })
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-bold">Rediger "Kom i gang"-innhold</h2>

      <div className="flex flex-col gap-2">
        <label>Begynner - Tittel</label>
        <input value={beginnerTitle} onChange={(e) => setBeginnerTitle(e.target.value)} className="p-2 border rounded" />
        
        <label>Begynner - Beskrivelse</label>
        <textarea value={beginnerDescription} onChange={(e) => setBeginnerDescription(e.target.value)} className="p-2 border rounded" rows={3} />

        <label>Viderekommen - Tittel</label>
        <input value={advancedTitle} onChange={(e) => setAdvancedTitle(e.target.value)} className="p-2 border rounded" />
        
        <label>Viderekommen - Beskrivelse</label>
        <textarea value={advancedDescription} onChange={(e) => setAdvancedDescription(e.target.value)} className="p-2 border rounded" rows={3} />
      </div>

      <button onClick={handleSave} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Lagre endringer
      </button>
    </div>
  )
}

export default GetStartedAdminDetails
