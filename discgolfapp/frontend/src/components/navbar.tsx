import Image from 'next/image';
import router from 'next/router';

const Navbar = ({ toggleLoginPopup }: { toggleLoginPopup: () => void }) => {

    return (
        <nav className="bg-gray-600 text-white p-4 flex justify-center relative">
            <button
                        onClick={() => router.push('/')}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-black text-white rounded"
                    >
                        Hjem
                    </button>
            <div className="flex items-center w-3/4">
                <div className="flex items-center mr-4">
                    <Image src="/logo01.png" alt="Logo" width={32} height={32} className="mr-2" />
                    <h1 className="text-xl font-bold">Norges Discgolf-forbund</h1>
                </div>
                <div className="flex items-center w-1/2 mx-4">
                    <input
                        type="text"
                        placeholder="Søk..."
                        className="w-full px-4 py-2 rounded bg-gray-300 text-black placeholder-black"
                    />
                </div>
                <div className="flex items-center ml-4 space-x-2">
                    <Image
                        src="/bx-user-circle.svg"
                        alt="Profil"
                        width={32}
                        height={32}
                        className="rounded-full cursor-pointer"
                        onClick={toggleLoginPopup} 
                    />
                    <Image
                        src="/bx-world.svg"
                        alt="Flagg"
                        width={32}
                        height={32}
                        className="cursor-pointer"
                    />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
