'use client';

interface UserProps {
  toggleRegisterPopup: () => void;
}

const User = ({ toggleRegisterPopup }: UserProps) => {
  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Informasjon til ikke-medlemmer */}
      <div className="bg-gray-200 rounded-xl p-6 w-3/4 text-left shadow-md">
        <h2 className="text-xl font-bold">Informasjon til ikke-medlemmer</h2>
        <p className="mt-2">Her kan du lese om fordelene ved å bli medlem av klubben.</p>
        <b>1. Konkurransefordeler:</b> Deltakelse i lokale og nasjonale turneringer, som ofte er eksklusive for medlemmer.
        <br />
        <b>2. Forsikring:</b> Medlemskap gir tilgang til forsikring som dekker skader under spill.
        <br />
        <b>3. Rabatter:</b> Medlemmer får rabatter på discer, klær og annet utstyr.
        <br />
        <b>4. Sosialt fellesskap:</b> Bli kjent med andre discgolf-entusiaster og delta på sosiale arrangementer.
      </div>

      {/* Registrer medlemskap */}
      <div className="bg-gray-300 rounded-lg p-4 w-1/2 text-center shadow-md">
        <h3 className="text-lg font-semibold">Registrer medlemskap</h3>
        <button
          onClick={toggleRegisterPopup}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Bli medlem
        </button>
      </div>
    </div>
  );
};

export default User;