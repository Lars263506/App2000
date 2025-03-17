import { useRouter } from 'next/router'

const Navigation = () => {
  const router = useRouter()
  const navigateToCoursePage = async () => await router.push('/coursepage')
  const navigateToClubLandingPage = async () => await router.push('/clublandingpage')
  const navigateToGetStartedPage = async () => await router.push('/getstartedpage')
  const navigateToPlayPage = async () => await router.push('/playpage')

  return (
    <div className='max-w-6xl mx-auto flex flex-wrap justify-center gap-4 py-2'>

      {/* Spill nå */}
      <div 
        className='bg-[#E7EFFB] p-6 rounded-lg shadow-md w-full sm:w-[30%] cursor-pointer transition-transform duration-300 hover:scale-105 text-center'
        onClick={navigateToPlayPage}
      >
        <h2 className='text-[#1B365D] text-xl font-bold'>Spill nå</h2>
        <p className='mt-1 text-[#2A4470] text-sm'>
          Start en runde discgolf og finn en bane nær deg.
        </p>
      </div>

      {/* Kom i gang */}
      <div 
        className='bg-[#E7EFFB] p-6 rounded-lg shadow-md w-full sm:w-[30%] cursor-pointer transition-transform duration-300 hover:scale-105 text-center'
        onClick={navigateToGetStartedPage}
      >
        <h2 className='text-[#1B365D] text-xl font-bold'>Kom i gang</h2>
        <p className='mt-1 text-[#2A4470] text-sm'>
          Her finner du tips og triks for nybegynnere og viderekommende spillere.
        </p>
      </div>

      {/* Baner */}
      <div 
        className='bg-[#E7EFFB] p-6 rounded-lg shadow-md w-full sm:w-[30%] cursor-pointer transition-transform duration-300 hover:scale-105 text-center'
        onClick={navigateToCoursePage}
      >
        <h2 className='text-[#1B365D] text-xl font-bold'>Baner</h2>
        <p className='mt-1 text-[#2A4470] text-sm'>
          Se oversikt over discgolfbaner og finn detaljer om hver bane.
        </p>
      </div>

      {/* Klubber */}
      <div 
        className='bg-[#E7EFFB] p-6 rounded-lg shadow-md w-full sm:w-[30%] cursor-pointer transition-transform duration-300 hover:scale-105 text-center'
        onClick={navigateToClubLandingPage}
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
