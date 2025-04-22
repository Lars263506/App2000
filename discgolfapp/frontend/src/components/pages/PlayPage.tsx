import { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { toast } from "react-toastify";
import Course from '@/types/course';
import CourseList from '@/components/coursepage/CourseList';

export default function StartGame() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [players, setPlayers] = useState(["Spiller 1"]);
  const [scores, setScores] = useState<{ [key: string]: number[] }>({});
  const [currentBasket, setCurrentBasket] = useState(1);
  const [currentBasketIndex, setCurrentBasketIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ displayName: string; email: string }[]>([]);
  const [pins, setPins] = useState<{ id: string; latitude: number; longitude: number; name: string; type: string }[]>([]);
  const [lines, setLines] = useState<{ pinId1: string; pinId2: string }[]>([]);
  const [showCourseList, setShowCourseList] = useState(true);
  const [mapInitialized, setMapInitialized] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);

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

  const fetchPins = async () => {
    if (selectedCourse) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/${selectedCourse._id}/pins`);
        const data = await response.json();

        const sortedPins = data.pins.sort((a: { name: string }, b: { name: string }) => 
          a.name.localeCompare(b.name, undefined, { numeric: true })
        );

        setPins(sortedPins); 
        setLines(data.lines || []);
      } catch (error) {
        toast.error("Failed to fetch pins: " + error);
      }
    }
  };

  useEffect(() => {
    if (gameStarted) {
      fetchPins();
    }
  }, [gameStarted]);

  useEffect(() => {
    if (mapRef.current && gameStarted && !mapInitialized) {
      const basketPins = pins
        .filter((pin) => pin.type === "kurv")
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

      if (basketPins.length > 0) {
        const firstPin = basketPins[0];
        mapRef.current.setCenter({ lat: firstPin.latitude, lng: firstPin.longitude });
        mapRef.current.setZoom(19);
        setMapInitialized(true);
      } else if (selectedCourse) {
        mapRef.current.setCenter({ lat: selectedCourse.latitude, lng: selectedCourse.longitude });
        mapRef.current.setZoom(16);
        setMapInitialized(true); 
      }
    }
  }, [pins, gameStarted, selectedCourse, mapInitialized]);

  useEffect(() => {
    if (mapRef.current && gameStarted) {
      const basketPins = pins
        .filter((pin) => pin.type === "kurv")
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

      if (basketPins.length > 0 && currentBasket > 0) {
        const currentPin = basketPins[currentBasket - 1];
        mapRef.current.setCenter({ lat: currentPin.latitude, lng: currentPin.longitude });
        mapRef.current.setZoom(18);
      }
    }
  }, [currentBasket, pins, gameStarted]);

  const startGame = () => {
    if (selectedCourse) {
      setGameStarted(true);
      setCurrentBasket(1); 
      setCurrentBasketIndex(0); 
      setMapInitialized(false); 

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
    const basketPins = pins
      .filter((pin) => pin.type === "kurv")
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })); 

    if (currentBasket < (selectedCourse?.holes || 12)) {
      if (basketPins.length > 0 && currentBasketIndex >= basketPins.length - 1) {
        toast.success("Det finnes ikke flere kurver for denne banen. Spillet avsluttes.");
        finishGame(); 
      } else {
        setCurrentBasket(currentBasket + 1);
        setCurrentBasketIndex(currentBasketIndex + 1); 
        if (mapRef.current && basketPins[currentBasketIndex + 1]) {
          const nextPin = basketPins[currentBasketIndex + 1]; 
          mapRef.current.setCenter({ lat: nextPin.latitude, lng: nextPin.longitude });
          mapRef.current.setZoom(15);
        }
      }
    }
  };

  const handlePreviousBasket = () => {
    const basketPins = pins
      .filter((pin) => pin.type === "kurv")
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })); 

    if (currentBasket > 1) {
      setCurrentBasket(currentBasket - 1);
      setCurrentBasketIndex(currentBasketIndex - 1); 
      if (mapRef.current && basketPins[currentBasketIndex - 1]) {
        const previousPin = basketPins[currentBasketIndex - 1]; 
        mapRef.current.setCenter({ lat: previousPin.latitude, lng: previousPin.longitude });
        mapRef.current.setZoom(19);
      }
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
          toast.error(`Error: ${error.message}`);
        } else {
          toast.error('An unknown error occurred');
        }
      }
    }
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
    <div className="min-h-screen flex flex-col sm:flex-row text-black">
      {showCourseList && !gameStarted && (
        <div className="w-full sm:w-1/4 h-full">
          <CourseList
            courses={courses}
            setCourses={setCourses}
            setSelectedCourse={(course) => {
              setSelectedCourse(course);
              setShowCourseList(false);
            }}
          />
        </div>
      )}

      <div className={`flex-grow flex flex-col sm:flex-row rounded-lg`}>
        {!gameStarted || (gameStarted && !selectedCourse) ? (
          <div className="flex-grow sm:w-4/5 h-[300px] sm:h-auto transition-all duration-300 rounded-lg overflow-hidden">
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={selectedCourse ? { lat: selectedCourse.latitude, lng: selectedCourse.longitude } : { lat: 59.9139, lng: 10.7522 }}
                zoom={selectedCourse ? 15 : 6}
                onLoad={(map) => {
                  mapRef.current = map;
                }}
              >
                {courses.map((course, index) => (
                  <Marker
                    key={index}
                    position={{ lat: course.latitude, lng: course.longitude }}
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowCourseList(false);
                      if (mapRef.current) {
                        const newCenter = new window.google.maps.LatLng(course.latitude, course.longitude);
                        mapRef.current.setCenter(newCenter);
                        mapRef.current.setZoom(15);
                      }
                    }}
                  />
                ))}
              </GoogleMap>
            </LoadScript>
          </div>
        ) : (
          <div className="flex-grow sm:w-4/5 h-[300px] sm:h-auto transition-all duration-300 rounded-lg overflow-hidden">
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={
                  pins.length > 0 && currentBasket > 0
                    ? { lat: pins[currentBasket - 1].latitude, lng: pins[currentBasket - 1].longitude }
                    : selectedCourse
                    ? { lat: selectedCourse.latitude, lng: selectedCourse.longitude }
                    : { lat: 59.9139, lng: 10.7522 } 
                }
                zoom={pins.length > 0 ? 19 : 15}
                onLoad={(map) => {
                  mapRef.current = map;
                }}
              >
                {pins.map((pin, index) => (
                  <Marker
                    key={index}
                    position={{ lat: pin.latitude, lng: pin.longitude }}
                    icon={{
                      url: pin.type === "Utslagspunkt" ? "/svg/start-point.png" : "/svg/basket.png",
                      scaledSize: new google.maps.Size(30, 30),
                    }}
                  >
                    <InfoWindow position={{ lat: pin.latitude + 0.00005, lng: pin.longitude }}>
                      <div>
                        <p>{pin.name}</p>
                      </div>
                    </InfoWindow>
                  </Marker>
                ))}
                {pins.length === 0 && selectedCourse && (
                  <Marker
                    position={{ lat: selectedCourse.latitude, lng: selectedCourse.longitude }}
                  >
                  </Marker>
                )}
              </GoogleMap>
            </LoadScript>
          </div>
        )}
      </div>

      {selectedCourse && !gameStarted && (
        <div className="w-30 sm:w-3/10 bg-[#E7EFFB] p-4 sm:p-10 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-3">Vanskelighetsgrad:</h2>
          <p>{selectedCourse.difficulty}</p>
          <h2 className="text-lg font-semibold mb-3">Antall hull:</h2>
          <p>{selectedCourse.holes}</p>
          <div className="mt-4">
            <h2 className="text-base font-semibold mb-3">Legg til spillere</h2>

            {localStorage.getItem('accessToken') ? (
              <div className="flex justify-center mt-3 relative">
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg text-base"
                  placeholder="Søk etter registrerte brukere"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                {searchResults.length > 0 && (
                  <ul className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto text-sm">
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
            ) : (
              <p className="text-sm text-gray-600 mt-2">
                Logg inn for å søke etter registrerte brukere.
              </p>
            )}

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
              <div className="mt-2">
                <button
                  className="w-full bg-gray-600 text-white p-2 rounded-lg text-base hover:bg-gray-700"
                  onClick={() => {
                    setSelectedCourse(null); 
                    setShowCourseList(true);
                  }}
                >
                  Tilbake til baner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {gameStarted && !gameEnded && (
        <div className="bg-[#E7EFFB] rounded-lg shadow-lg p-4 sm:p-10">
          <h2 className="text-lg font-semibold text-center mb-4">Kurv {currentBasket}</h2>
          <div className="mt-4 bg-[#E7EFFB] rounded-lg p-4">
            <table className="w-full rounded-lg mb-4">
              <thead>
                <tr>
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
          <div className="mt-4 flex justify-center">
            <button
              className="bg-red-600 text-white p-2 rounded-lg text-base hover:bg-red-700"
              onClick={finishGame}
            >
              Avslutt spill
            </button>
          </div>
        </div>
      )}

      {gameEnded && (
        <div className="bg-[#E7EFFB] rounded-lg shadow-lg p-4 sm:p-10">
          <h2 className="text-xl font-bold text-center mb-4">Resultater</h2>
          <div className="bg-[#E7EFFB] rounded-lg p-4">
            <table className="w-full border rounded-lg mb-4">
              <thead>
                <tr className="bg-[#E7EFFB] rounded-lg">
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
      )}
    </div>
  );
}
