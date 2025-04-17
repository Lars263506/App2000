import React from 'react';

interface PrivacyProps {
  setSelectedPage: (page: string) => void;
}

const PrivacyPage: React.FC<PrivacyProps> = ({ setSelectedPage }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow p-8 max-w-4xl mx-auto">
        <div className="bg-[#E7EFFB] p-6 rounded-2xl shadow-md">
          {/* Hvit innholdsboks */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6 text-center">Personvernerklæring</h1>

            <p className="mb-4">
              Ditt personvern er viktig for oss. Denne erklæringen forklarer hvordan vi samler inn, bruker og beskytter dine personopplysninger i samsvar med gjeldende lover og forskrifter.
            </p>

            <h2 className="text-1xl font-semibold mt-6 mb-2">1. Hvilken informasjon samler vi inn?</h2>
            <p className="mb-4">
              Vi samler inn personopplysninger du oppgir når du bruker våre tjenester, for eksempel e-postadresse og telefonnummer eller meldinger du sender til oss via kontaktskjemaet.
            </p>

            <h2 className="text-1xl font-semibold mt-6 mb-2">2. Hvordan bruker vi din informasjon?</h2>
            <p className="mb-4">Vi bruker innsamlet informasjon for å:</p>
            <ul className="list-disc list-inside mb-4">
              <li>Levere, drifte og forbedre våre tjenester.</li>
              <li>Tilpasse brukeropplevelsen basert på dine preferanser.</li>
              <li>Besvare henvendelser og gi kundesupport.</li>
              <li>Forbedre sikkerheten og forhindre misbruk av våre systemer.</li>
              <li>Overholde juridiske forpliktelser og beskytte våre rettigheter.</li>
            </ul>

            <h2 className="text-1xl font-semibold mt-6 mb-2">3. Hvordan deler vi informasjonen din?</h2>
            <p className="mb-4">
              Vi deler ikke din informasjon med tredjeparter uten ditt samtykke, med mindre det er nødvendig for å levere våre tjenester, beskytte våre rettigheter eller overholde lovpålagte krav.
            </p>

            <h2 className="text-1xl font-semibold mt-6 mb-2">4. Dine rettigheter</h2>
            <p className="mb-4">Du har rett til å:</p>
            <ul className="list-disc list-inside mb-4">
              <li>Be om innsyn i hvilke personopplysninger vi har om deg.</li>
              <li>Korrigere eller oppdatere uriktige eller ufullstendige opplysninger.</li>
              <li>Be om sletting av dine opplysninger dersom de ikke lenger er nødvendige.</li>
              <li>Begrense behandlingen av dine data eller protestere mot spesifikke bruksområder.</li>
              <li>Be om overføring av dine data til en annen tjenesteleverandør der det er relevant.</li>
            </ul>

            <h2 className="text-1xl font-semibold mt-6 mb-2">5. Sikkerhet og lagring</h2>
            <p className="mb-4">
              Vi tar datasikkerhet på alvor og bruker egnede tekniske og organisatoriske tiltak for å beskytte dine personopplysninger.
            </p>

            <h2 className="text-1xl font-semibold mt-6 mb-2">6. Spørsmål eller bekymringer?</h2>
            <p className="mb-4">
              Hvis du har spørsmål om vår personvernerklæring eller ønsker å utøve dine rettigheter, er du velkommen til å kontakte oss.
            </p>

            <div className="text-center mt-6">
              <button
                onClick={() => setSelectedPage('Contact')}
                className="bg-[#1B365D] text-white py-2 px-6 rounded-md hover:bg-[#5A8FCC] transition-colors duration-300"
              >
                Kontakt oss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
