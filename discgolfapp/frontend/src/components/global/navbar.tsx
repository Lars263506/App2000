import Image from 'next/image';
import router from 'next/router';

const Navbar = ({ toggleLoginPopup }: { toggleLoginPopup: () => void }) => {
    return (
        <nav className="bg-gray-600 text-white p-4 flex justify-center relative">
            <div className="flex items-center w-full justify-center">
                {/* Logo og tittel */}
                <div className="flex items-center mr-4">
                    <Image src="/logo01.png" alt="Logo" width={32} height={32} className="mr-2 cursor-pointer" onClick={() => router.push('/')}/>
                    <h1 className="text-xl font-bold">Norges Discgolf-forbund</h1>
                </div>

                {/* Søkeboks */}
                <div className="flex items-center w-1/2">
                    <input
                        type="text"
                        placeholder="Søk..."
                        className="w-full px-4 py-2 rounded bg-gray-300 text-black placeholder-black"
                    />
                </div>

               {/* Login og flagg ikon */}
                <div className="flex items-center space-x-4 ml-4">
                    <div className="w-8 h-8 flex-shrink-0">
                        <Image
                        src="/home-regular-24.png"
                        alt="Hjem"
                        width={32}
                        height={32}
                        className="cursor-pointer w-full h-full"
                        onClick={() => router.push('/')}
                        />
                    </div>
                    <div className="w-8 h-8 flex-shrink-0">
                        <Image
                        src="/user-circle-regular-24.png"
                        alt="Profil"
                        width={32}
                        height={32}
                        className="rounded-full cursor-pointer w-full h-full"
                        onClick={toggleLoginPopup}
                        />
                    </div>
                    <div className="w-8 h-8 flex-shrink-0">
                        <Image
                        src="/world-regular-24.png"
                        alt="Flagg"
                        width={32}
                        height={32}
                        className="cursor-pointer w-full h-full"
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
