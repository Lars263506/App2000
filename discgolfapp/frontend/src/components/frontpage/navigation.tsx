interface NavigationProps {
  setSelectedPage: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ setSelectedPage }) => {

  return (
    <div className='max-w-6xl mx-auto flex flex-wrap justify-center gap-4 py-2'>

      {/* Kom i gang */}
      <div
        className='bg-[#E7EFFB] p-6 rounded-lg shadow-md w-full sm:w-[30%] cursor-pointer transition-transform duration-300 hover:scale-105 text-center'
        onClick={() => setSelectedPage('GetStarted')}
      >
        <h2 className='text-[#1B365D] text-xl font-bold'>Kom i gang</h2>
        <p className='mt-1 text-[#2A4470] text-sm'>
          Her finner du tips og triks for nybegynnere og viderekommende spillere.
        </p>
      </div>

      {/* Baner */}
      <div
        className='bg-[#E7EFFB] p-6 rounded-lg shadow-md w-full sm:w-[30%] cursor-pointer transition-transform duration-300 hover:scale-105 text-center'
        onClick={() => setSelectedPage('Courses')}
      >
        <h2 className='text-[#1B365D] text-xl font-bold'>Baner</h2>
        <p className='mt-1 text-[#2A4470] text-sm'>
          Se oversikt over discgolfbaner og finn detaljer om hver bane.
        </p>
      </div>

      {/* Klubber */}
      <div
        className='bg-[#E7EFFB] p-6 rounded-lg shadow-md w-full sm:w-[30%] cursor-pointer transition-transform duration-300 hover:scale-105 text-center'
        onClick={() => setSelectedPage('Clubs')}
      >
        <h2 className='text-[#1B365D] text-xl font-bold'>Klubber</h2>
        <p className='mt-1 text-[#2A4470] text-sm'>
          Bli en del av et discgolf-miljø i en klubb nær deg.
        </p>
      </div>
    </div>
  )
}

export default Navigation
