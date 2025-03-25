import Image from 'next/image'

interface NavBarProps {
  toggleLoginPopup: () => void
  setSelectedPage: (page: string) => void
}

const Navbar: React.FC<NavBarProps> =  ({ toggleLoginPopup, setSelectedPage }) => {
  return (
    <nav className='bg-[#1B365D] text-white py-4 px-6 flex justify-center'>

      {/* Wrapper for å sentrere innholdet */}
      <div className='w-full max-w-5xl flex items-center justify-between'>

        {/* Logo + Tittel (Sentrert i sin del av navbaren) */}
        <div
          className='flex items-center cursor-pointer'
          onClick={async () => setSelectedPage('Home')}
        >
          <Image
            src='/images/logo01.png'
            alt='Logo'
            width={50}
            height={50}
          />
          <h1 className='text-xl font-bold leading-tight'>
            <span className='block'>Norges</span>
            <span className='block'>Discgolf-forbund</span>
          </h1>
        </div>

        {/* Ikoner (Jevnt fordelt, sentrert i sin del) */}
        <div className='flex space-x-6'>
          <Image
            src='/images/home-regular-24.png'
            alt='Hjem'
            width={26}
            height={26}
            className='cursor-pointer invert'
            onClick={() => setSelectedPage('Home')}
          />
          <Image
            src='/images/user-circle-regular-24.png'
            alt='Profil'
            width={26}
            height={26}
            className='cursor-pointer invert'
            onClick={toggleLoginPopup}
          />
          <Image
            src='/images/world-regular-24.png'
            alt='Språk'
            width={26}
            height={26}
            className='cursor-pointer invert'
          />
          <Image
            src='/images/adminsettings.png'
            alt='AdminPage'
            width={26}
            height={26}
            className='cursor-pointer invert'
            onClick={() => setSelectedPage('Admin')}
          />
        </div>

      </div>
    </nav>
  )
}

export default Navbar;
