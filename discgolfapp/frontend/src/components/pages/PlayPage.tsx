import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { toast } from "react-toastify";
import Course from '@/types/course'


export default function StartGame() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [players, setPlayers] = useState(["Spiller 1"]);
  const [scores, setScores] = useState<{ [key: string]: number[] }>({});
  const [currentBasket, setCurrentBasket] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ displayName: string; email: string }[]>([]);
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
        toast.error("Feil ved henting av baner: " + error);
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
        acc[player] = Array(selectedCourse.holes).fill(0); // Use selectedCourse.holes
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
    if (currentBasket < (selectedCourse?.holes || 12)) {
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
      players: players.map((player) => {
        const registeredUser = searchResults.find((user) => user.displayName === player);
        return {
          name: player,
          email: registeredUser ? registeredUser.email : null,
        };
      }),
      scores: scores,
      date: new Date().toISOString(),
    };

    console.log('Game result payload:', gameResult);

    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/games`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(gameResult),
        });

        if (response.status !== 201) {
          throw new Error('Failed to save game result');
        }
      } catch (error) {
        toast.error('Error saving game result: ' + error);
        if (error instanceof Error) {
          alert(`Error: ${error.message}`);
        } else {
          alert('An unknown error occurred');
        }
      }
    }
  };

  const calculateTotalScore = (player: string) => {
    return scores[player]?.reduce((total, score) => total + score, 0);
  };

  const getScoreDescription = (player: string, basketIndex: number) => {
    const score = scores[player]?.[basketIndex];
    if (score === undefined) return '-';
    return `${score || '-'} `;
  };

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);

    if (query.length > 2) {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/search?query=${query}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.status !== 200) {
          toast.error('Failed to fetch users');
          setSearchResults([]);
          return;
        }

        const users = await response.json();
        setSearchResults(users);
      } catch (error) {
        toast.error('Error fetching users: ' + error);
        toast.error('An error occurred while fetching users.');
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleAddPlayer = (player: { displayName: string; email: string }) => {
    setPlayers([...players, player.displayName]);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen flex flex-col text-black">
      <div className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="max-w-5xl w-full p-10 bg-white shadow-xl rounded-3xl min-h-[600px] max-h-[600px] overflow-y-auto relative">

          {gameStarted && !gameEnded && (
            <button
              className="absolute top-4 right-4 bg-red-600 text-white p-3 rounded-lg"
              onClick={finishGame}
            >
              Avslutt spill
            </button>
          )}

          {!gameStarted ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
                      mapContainerStyle={{ height: "500px", width: "300px", borderRadius: "1rem" }}
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

                    <div className="mt-4">
                      <h2 className="text-base font-semibold mb-3">Legg til spillere</h2>

                      <div className="flex justify-center mt-3">
                        <input
                          type="text"
                          className="w-full p-2 border rounded-lg text-base"
                          placeholder="Søk etter registrerte brukere"
                          value={searchQuery}
                          onChange={(e) => handleSearchChange(e.target.value)}
                        />
                        {searchResults.length > 0 && (
                          <ul className="absolute bg-white border rounded-lg mt-2 w-30 max-h-40 overflow-y-auto">
                            {searchResults.map((user) => (
                              <li
                                key={user.email}
                                className="p-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleAddPlayer(user)}
                              >
                                {user.displayName} ({user.email})
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="flex flex-col h-full">
                        <div className="overflow-y-auto max-h-40 mt-4">
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
                        <div className="mt-1">
                          <div className="flex justify-center mt-3">
                            <button
                              className="bg-green-600 text-white p-2 rounded-xl text-base"
                              onClick={() => setPlayers([...players, `Spiller ${players.length + 1}`])}
                            >
                              Legg til spiller
                            </button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <button
                            className="w-full bg-blue-600 text-white p-2 rounded-lg text-base hover:bg-blue-700"
                            onClick={startGame}
                            disabled={!selectedCourse || players.some(player => !player)}
                          >
                            Start spill
                          </button>
                        </div>
                      </div>
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
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: selectedCourse?.holes || 12 }, (_, index) => (
                      <tr key={index} className="text-center border-b text-base">
                        <td className="p-3">Kurv {index + 1}:</td>
                        {players.map((player) => (
                          <td key={player} className="p-3">
                            {index + 1 > currentBasket
                              ? '-'
                              : scores[player]?.[index] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {players.map((player) => (
                      <tr key={player} className="text-center border-t font-semibold">
                        <td colSpan={players.length + 1} className="p-3 text-left">
                          <div className="flex justify-between">
                            <span>Totalt score for {player}:</span>
                            <span className="mr-6">
                              {scores[player]
                                ? scores[player]
                                    .slice(0, currentBasket)
                                    .reduce((total, score) => total + score, 0)
                                : '-'}
                            </span>
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
              {selectedCourse && (
                <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
                  <GoogleMap
                    center={{
                      lat: selectedCourse ? courses.find(course => course.name === selectedCourse.name)?.latitude || 59.9139 : 59.9139,
                      lng: courses.find(course => course.name === selectedCourse?.name)?.longitude || 10.7522
                    }}
                    zoom={15}
                    mapContainerStyle={{ height: "200px", width: "100%", borderRadius: "1rem" }}
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
                  disabled={currentBasket === (selectedCourse?.holes || 12)}
                >
                  ▶
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
