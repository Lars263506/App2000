import React from "react";

const MemberBenefit = () => {
  return (
    <div className="flex-1 bg-gray-200 p-4 rounded-xl shadow text-black">
      <h2 className="text-xl font-bold">Fordeler ved å bli medlem</h2>
      <p>Her er de viktigste punktene om fordelene ved å være medlem i et discgolf-forbund:</p>
      <ul className="mt-2 list-disc pl-5 space-y-2">
        <li><strong>Rabatter på turneringer og arrangementer:</strong> 
        <p>Medlemskap gir ofte rabatter på deltakeravgifter for lokale og nasjonale turneringer eller spesialarrangementer. </p></li>
        <li><strong>Eksklusive trening:</strong> 
        <p>Tilgang til organiserte treningsøkter for å forbedre ferdighetene dine.</p></li>
        <li><strong>Nettverksmuligheter:</strong> 
        <p>Møte andre spillere og bygge vennskap, samtidig som du lærer av erfarne spillere.</p></li>
        <li><strong>Prioritert tilgang til booking:</strong>
        <p>Medlemmer får prioritert tilgang til banereservasjoner, spesielt i travle perioder.</p></li>
        <li><strong>Deltakelse i konkurranser:</strong> 
        <p> Mulighet til å delta i klubbens egne turneringer og konkurranser.</p></li>

       
      </ul>
    </div>
  );
};

export default MemberBenefit;
