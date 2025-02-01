'use client';

import Image from 'next/image';
import Link from 'next/link';

/**
 * @author Andreas263547 (Github)
 * @description Line: 21-26, Copilot has helped generate the code that displays the box and the image, written the code myself.  
 * @description Line: 30-33, Copilot has helped generate the text, written the code myself. 
 */

interface FirstBoxProps {
    images: string[];
    currentImageIndex: number;
    toggleBox: () => void;
    isBoxOpen: boolean;
}

const FirstBox: React.FC<FirstBoxProps> = ({ images, currentImageIndex, toggleBox, isBoxOpen }) => {
    return ( 
        <div className="w-full mx-auto mt-4 p-4">
            <div className={`relative bg-white border border-gray-300 rounded shadow-md ${isBoxOpen ? 'h-auto' : 'h-20'} overflow-hidden transition-all duration-300`}>
                <button onClick={toggleBox} className="absolute left-0 top-0 mt-2 ml-2 bg-gray-200 rounded-full p-2">
                    <svg className={`w-6 h-6 transform ${isBoxOpen ? 'rotate-90' : ''}`} fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path> 
                    </svg> 
                </button>
                <div className={`p-4 ${isBoxOpen ? 'block' : 'hidden'}`}>
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="bg-gray-100 p-4 rounded shadow w-80 h-80">
                            <Image src={images[currentImageIndex]} alt="Placeholder" width={300} height={300} className="w-full h-full object-cover rounded" />
                        </div> 
                        <div className="bg-gray-100 p-4 rounded shadow w-90 h-80">
                            <h2 className="text-xl font-bold text-black">Om Discgolf</h2>
                            <p className="mt-2 text-black"> 
                                Discgolf er en morsom og utfordrende sport som ligner på vanlig golf,<br></br> men i stedet for å bruke en ball og kølle, bruker du en disc (frisbee). <br></br> Målet er å kaste discen fra startpunktet til kurven på færrest mulig kast.
                            </p> 
                            <p className="mt-2 text-black">
                                Discgolfbaner varierer i lengde og vanskelighetsgrad.<br></br> Noen baner har hindringer som trær, busker og vann som gjør spillet mer utfordrende. <br></br> Prøv å følge etikette på banen for en god opplevelse.
                            </p> 
                            <Link href="/KomIGang">
                                <button className='mt-16 bg-black text-white px-4 py-2 rounded hover:bg-blue-600"'>Kom i gang</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ); 
};

export default FirstBox;