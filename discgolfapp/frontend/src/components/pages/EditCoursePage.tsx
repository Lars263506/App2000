import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, OverlayView } from '@react-google-maps/api';

interface Course {
  name: string;
  latitude: number;
  longitude: number;
  difficulty: string;
  par: number;
}

interface Pin {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: "kurv" | "ttbox";
}

export default function EditCoursePage() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [pins, setPins] = useState<Pin[]>([]);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [selectedPinType, setSelectedPinType] = useState<"kurv" | "ttbox">("kurv");
  const [newPinName, setNewPinName] = useState("");
  const [isCourseSelected, setIsCourseSelected] = useState(false);

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

  const handleAddPin = (lat: number, lng: number) => {
    if (!newPinName) {
      alert("Vennligst skriv et navn for pinnen.");
      return;
    }

    const newPin: Pin = {
      id: `${lat}-${lng}`,
      name: newPinName,
      latitude: lat,
      longitude: lng,
      type: selectedPinType,
    };
    setPins([...pins, newPin]);
    setNewPinName(""); 
  };

  const handlePinClick = (pin: Pin) => {
    setSelectedPin(pin);
  };

  const handlePinNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPinName(e.target.value);
  };

  const handleGoBack = () => {
    setIsCourseSelected(false);
    setSelectedCourse("");
  };

  const handleCourseSelection = (courseName: string) => {
    setSelectedCourse(courseName);
    setIsCourseSelected(true);
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      handleAddPin(e.latLng.lat(), e.latLng.lng());
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-black">
      <div className="flex-grow flex items-start justify-center"> {/* Plasserer innholdet øverst */}
        <div className="max-w-5xl w-full p-10 bg-gray-100 shadow-xl rounded-3xl min-h-[600px] relative flex flex-col">
          {!isCourseSelected && (
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-1">
                <h1 className="text-xl font-bold text-center mb-4">Velg Bane</h1>
                <div className="w-full mt-6">
                  <ul className="space-y-6">
                    {courses.map((course) => (
                      <li
                        key={course.name}
                        className={`p-4 border rounded-lg cursor-pointer ${selectedCourse === course.name ? 'bg-gray-400 text-white' : ''}`}
                        onClick={() => handleCourseSelection(course.name)}
                      >
                        {course.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {isCourseSelected && (
            <div className="relative flex">
              <div className="flex-grow">
                {selectedCourse && (
                  <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
                    <GoogleMap
                      center={{
                        lat: courses.find(course => course.name === selectedCourse)?.latitude || 59.9139,
                        lng: courses.find(course => course.name === selectedCourse)?.longitude || 10.7522,
                      }}
                      zoom={15}
                      mapContainerStyle={{ height: "600px", width: "100%", borderRadius: "1rem" }}
                      onClick={handleMapClick}
                    >
                      {pins.map((pin) => (
                        <Marker
                          key={pin.id}
                          position={{ lat: pin.latitude, lng: pin.longitude }}
                          onClick={() => handlePinClick(pin)}
                        />
                      ))}

                      {pins.map((pin) => (
                        <OverlayView
                          key={pin.id}
                          position={{ lat: pin.latitude, lng: pin.longitude }}
                          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "-30px",
                              left: "-50%",
                              transform: "translateX(-50%)",
                              backgroundColor: "white",
                              padding: "5px",
                              borderRadius: "5px",
                              fontSize: "14px",
                              fontWeight: "bold",
                              color: "black",
                            }}
                          >
                            {pin.name}
                          </div>
                        </OverlayView>
                      ))}
                    </GoogleMap>
                  </LoadScript>
                )}
              </div>

              <div className="absolute top-0 right-0 w-1/4 bg-gray-100 p-4 h-full flex flex-col justify-between">
                <h2 className="text-xl font-semibold">Rediger bane</h2>
                <div>
                  <label className="block mt-4">Navn:</label>
                  <input
                    type="text"
                    value={newPinName}
                    onChange={handlePinNameChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="mt-4">
                  <label className="block">Velg Pin Type:</label>
                  <select
                    value={selectedPinType}
                    onChange={(e) => setSelectedPinType(e.target.value as "kurv" | "ttbox")}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="kurv">Kurv</option>
                    <option value="ttbox">TTBox</option>
                  </select>
                </div>
                <div className="mt-auto">
                  <button
                    onClick={handleGoBack}
                    className="bg-blue-600 text-white p-2 rounded-lg w-full ml-6"
                  >
                    Gå tilbake til velg bane
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
