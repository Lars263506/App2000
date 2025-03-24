import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from '@/components/global/navbar';
import Footer from '@/components/global/footer';
import PopupWrapper from '@/components/global/popupwrapper';
import { usePopup } from '@/components/global/usepopup';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface Course {
  name: string;
  latitude: number;
  longitude: number;
  difficulty: string;
  par: number;
  holes: number;
}

export default function StartGame() {
  const { popupType, toggleLoginPopup, toggleRegisterPopup, closePopup } = usePopup();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [players, setPlayers] = useState(["Spiller 1"]);
  const [scores, setScores] = useState<{ [key: string]: number[] }>({});
  const [currentBasket, setCurrentBasket] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  const baskets = 12;

  useEffect(() => {
    const fetchCourses = async () => {
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/course';
      try {
        const response = await fetch(url);
        const result = await response.json();
        setCourses(result.data);
      } catch (error) {
        console.error("Feil ved henting av baner:", error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const savedScores = localStorage.getItem("gameScores");
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
  }, []);

  const startGame = () => {
    if (selectedCourse) {
      setGameStarted(true);
      const initialScores = players.reduce<{ [key: string]: number[] }>((acc, player) => {
        acc[player] = Array(selectedCourse.holes).fill(0);
        return acc;
      }, {});
      setScores(initialScores);
    }
  };

  const handleScoreChange = (player: string, basket: number, value: number) => {
    const updatedScores = { ...scores };

    if (!updatedScores[player]) {
      updatedScores[player] = Array(selectedCourse?.holes || baskets).fill(0);
    }
    updatedScores[player][basket - 1] = value;
    setScores(updatedScores);

    localStorage.setItem("gameScores", JSON.stringify(updatedScores));
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = name;
    setPlayers(updatedPlayers);
  };

  const handleNextBasket = () => {
    if (currentBasket < (selectedCourse?.holes || baskets)) {
      setCurrentBasket(currentBasket + 1);
    }
  };

  const handlePreviousBasket = () => {
    if (currentBasket > 1) {
      setCurrentBasket(currentBasket - 1);
    }
  };

  const finishGame = async () => {
    setGameEnded(true);

    const gameResult = {
      course: selectedCourse?.name,
      players: players,
      scores: scores,
      date: new Date().toISOString(),
    };

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(gameResult),
      });

      if (!response.ok) {
        throw new Error('Failed to save game result');
      }

      console.log('Game result saved successfully');
    } catch (error) {
      console.error('Error saving game result:', error);
    }
  };

  const calculateTotalScore = (player: string) => {
    return scores[player]?.reduce((total, score) => total + score, 0);
  };

  const getScoreDescription = (player: string, basketIndex: number) => {
    const score = scores[player]?.[basketIndex];
    const coursePar = courses.find(course => course.name === selectedCourse?.name)?.par || 4;

    if (score === 1) return "Ace";
    if (score === coursePar - 2) return "Eagle";
    if (score === coursePar - 1) return "Birdie";
    if (score === coursePar) return "Par";
    if (score === coursePar + 1) return "Bogey";
    if (score === coursePar + 2) return "Double Bogey";
    return `${score} - Over Par`;
  };

  return (
    <div className="min-h-screen flex flex-col text-black">
      <Navbar toggleLoginPopup={toggleLoginPopup} />

      <div className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="max-w-5xl w-full p-10 bg-white shadow-xl rounded-3xl min-h-[600px] relative">
          {/* Plasseringen av knappen */}
          {gameStarted && !gameEnded && (
            <button
              className="absolute top-4 right-4 bg-red-600 text-white p-3 rounded-lg"
              onClick={finishGame}
            >
              Avslutt spill
            </button>
          )}

          {!gameStarted ? (
            <div className=" grid grid-cols-3 gap-10">
              <div className="col-span-1">
                <h1 className="text-xl font-bold text-center mb-4">Velg Bane</h1>
                <div className="w-full mt-10">
                  <ul className="space-y-6">
                    {courses.map((course) => (
                      <li
                        key={course.name}
                        className={`p-4 border rounded-lg cursor-pointer ${selectedCourse?.name === course.name ? 'bg-gray-400 text-white' : ''}`}
                        onClick={() => setSelectedCourse(course)}
                      >
                        {course.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="items-center">
                {selectedCourse && (
                  <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
                    <GoogleMap
                      center={{
                        lat: courses.find(course => course.name === selectedCourse.name)?.latitude || 59.9139,
                        lng: courses.find(course => course.name === selectedCourse.name)?.longitude || 10.7522
                      }}
                      zoom={15}
                      mapContainerStyle={{ height: "600px", width: "100%", borderRadius: "1rem" }}
                    >
                      {courses.map((course) => (
                        course.name === selectedCourse.name && (
                          <Marker
                            key={course.name}
                            position={{
                              lat: course.latitude,
                              lng: course.longitude
                            }}
                          />
                        )
                      ))}
                    </GoogleMap>
                  </LoadScript>
                )}
              </div>

              <div className="col-span-1 flex flex-col">
                {selectedCourse && (
                  <>
                    <h2 className="text-lg font-semibold mb-3">Vanskelighetsgrad: </h2>
                    <p>{selectedCourse.difficulty}</p>
                    <h2 className="text-lg font-semibold mb-3">Antall hull: </h2>
                    <p>{selectedCourse.holes}</p>

                    <h2 className="text-base font-semibold mt-8 mb-3">Legg til spillere</h2>
                    <div className="overflow-y-auto max-h-80">
                      {players.map((player, index) => (
                        <div key={index} className="flex items-center mb-4">
                          <input
                            type="text"
                            className="w-full p-2 border rounded-lg text-base"
                            value={player}
                            onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                            placeholder={`Spiller ${index + 1}`}
                          />
                          <button
                            className="ml-3 bg-red-600 text-white p-2 rounded"
                            onClick={() => {
                              const updatedPlayers = [...players];
                              updatedPlayers.splice(index, 1);
                              setPlayers(updatedPlayers);
                            }}
                            disabled={players.length <= 1}
                          >
                            -
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center mt-3">
                      <button
                        className="bg-green-600 text-white p-2 rounded-xl text-base mt-4"
                        onClick={() => setPlayers([...players, `Spiller ${players.length + 1}`])}
                      >
                        Legg til spiller
                      </button>
                    </div>
                    <div className="mt-auto">
                      <button
                        className="w-full bg-blue-600 text-white p-2 rounded-lg text-base hover:bg-blue-700"
                        onClick={startGame}
                        disabled={!selectedCourse || players.some(player => !player)}
                      >
                        Start spill
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : gameEnded ? (
            <div>
              <h2 className="text-xl font-bold text-center mb-4">Resultater</h2>
              <div className="overflow-y-auto max-h-96">
                <table className="w-full border rounded-lg mb-4">
                  <thead>
                    <tr className="bg-gray-300">
                      <th className="p-3 text-base">Kurv</th>
                      {players.map((player, index) => (
                        <th key={index} className="p-4 text-xl">{player}</th>
                      ))}
                      <th className="p-3 text-base"></th>
                      <th className="p-3 text-base">Par</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: baskets }, (_, index) => (
                      <tr key={index} className="text-center border-b text-base">
                        <td className="p-3">Kurv {index + 1}:</td>
                        {players.map((player) => (
                          <td key={player} className="p-3">
                            {scores[player] ? scores[player][index] : 0}
                          </td>
                        ))}
                        <td className="p-3">
                          {courses.find(course => course.name === selectedCourse?.name)?.par}
                        </td>
                        <td className="p-3">
                          {players.map((player) => (
                            <span key={player}>
                              {getScoreDescription(player, index)}
                            </span>
                          ))}
                        </td>
                      </tr>
                    ))}
                    {players.map((player) => (
                      <tr key={player} className="text-center border-b text-base">
                        <td colSpan={baskets + 1} className="p-3 text-left">
                          <div className="flex justify-between">
                            <span>Totalt score for {player}:</span>
                            <span className="mr-6">{calculateTotalScore(player)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-center mb-4">Kurv {currentBasket}</h2>
              {/* Kart for hver kurv */}
              {selectedCourse && (
                <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
                  <GoogleMap
                    center={{
                      lat: selectedCourse ? courses.find(course => course.name === selectedCourse.name)?.latitude || 59.9139 : 59.9139,
                      lng: courses.find(course => course.name === selectedCourse?.name)?.longitude || 10.7522
                    }}
                    zoom={15}
                    mapContainerStyle={{ height: "300px", width: "100%" }}
                  >
                    {courses.map((course) => (
                      course.name === selectedCourse?.name && (
                        <Marker
                          key={course.name}
                          position={{
                            lat: course.latitude,
                            lng: course.longitude
                          }}
                        />
                      )
                    ))}
                  </GoogleMap>
                </LoadScript>
              )}

              <div className="overflow-y-auto max-h-60 mt-4">
                <table className="w-full border rounded-lg mb-4">
                  <thead>
                    <tr className="bg-gray-300">
                      <th className="p-2 text-base">Navn</th>
                      <th className="p-2 text-base">Score</th>
                      <th className="p-2 text-base">Resultat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player, index) => (
                      <tr key={index} className="text-center border-b text-base">
                        <td className="p-3">
                          <input
                            type="text"
                            className="w-48 p-2 border rounded-lg text-base"
                            value={player}
                            onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            inputMode="numeric"
                            className="w-32 p-3 border rounded-lg text-base"
                            value={scores[player] ? scores[player][currentBasket - 1] : ""}
                            onChange={(e) => handleScoreChange(player, currentBasket, parseInt(e.target.value))}
                          />
                        </td>
                        <td className="p-3">
                          {getScoreDescription(player, currentBasket - 1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  className="bg-gray-300 p-1 rounded-lg"
                  onClick={handlePreviousBasket}
                  disabled={currentBasket === 1}
                >
                  ◀
                </button>
                <div className="flex gap-3">
                  <span>Kurv {currentBasket}</span>
                </div>
                <button
                  className="bg-gray-300 p-1 rounded-lg"
                  onClick={handleNextBasket}
                  disabled={currentBasket === baskets}
                >
                  ▶
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <PopupWrapper
        popupType={popupType}
        closePopup={closePopup}
        toggleRegisterPopup={toggleRegisterPopup}
        toggleMyPagePopup={toggleLoginPopup}
      />
      <Footer />
    </div>
  );
}
