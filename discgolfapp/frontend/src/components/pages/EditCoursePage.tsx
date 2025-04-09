import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, OverlayView } from "@react-google-maps/api";

type Course = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  difficulty: string;
  par: number;
}

type Pin = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: "kurv" | "Utslagspunkt";
  distance?: number;
  par?: number;
  outOfBounds?: string;
}

export default function EditCoursePage() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [pins, setPins] = useState<Pin[]>([]);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [selectedPinType, setSelectedPinType] = useState<"kurv" | "Utslagspunkt">("kurv");
  const [newPinName, setNewPinName] = useState("");
  const [isCourseSelected, setIsCourseSelected] = useState(false);
  const [editPinName, setEditPinName] = useState("");
  const [editPinLat, setEditPinLat] = useState<number | null>(null);
  const [editPinLng, setEditPinLng] = useState<number | null>(null);
  const [editPinDistance, setEditPinDistance] = useState<number | null>(null);
  const [editPinPar, setEditPinPar] = useState<number | null>(null);
  const [editPinOutOfBounds, setEditPinOutOfBounds] = useState<string>("");
  const [tempLat, setTempLat] = useState<number | null>(null);
  const [tempLng, setTempLng] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 59.9139, 
    lng: 10.7522,
  });

  const handlePinTypeChange = (value: string) => {
    if (value === "kurv" || value === "Utslagspunkt") {
      setSelectedPinType(value);
    } else {
      console.warn("Ugyldig pin type valgt:", value);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/course";
      const token = localStorage.getItem("accessToken"); // Hent token fra localStorage
  
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Legg til token i Authorization-headeren
          },
        });
  
        if (!response.ok) {
          throw new Error("Kunne ikke hente baner. Sjekk autentisering.");
        }
  
        const result = await response.json();
  
        // Map _id to id for frontend usage
        const mappedCourses = result.data.map((course: any) => ({
          ...course,
          id: course._id, // Map _id to id
        }));
  
        setCourses(mappedCourses);
      } catch (error) {
        console.error("Feil ved henting av baner:", error);
      }
    };
    fetchCourses();
  }, []);

  const savePinsToDatabase = async () => {
    if (!selectedCourse) return;
  
    const course = courses.find((c) => c.name === selectedCourse);
    if (!course) return;
  
    const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/${course.id}/pins`;
    const token = localStorage.getItem("accessToken");
  
    console.log("Saving pins to database:", pins);
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pins }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error response:", errorText);
        throw new Error("Failed to save pins to database");
      }
  
      // Hent oppdaterte pins fra backend
      const updatedPinsResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (!updatedPinsResponse.ok) {
        throw new Error("Failed to fetch updated pins from database");
      }

      const updatedPins = await response.json();
      console.log("Updated pins from backend:", updatedPins);
  
      // Konverter responsen til et array hvis nødvendig
      const parsedPins = Array.isArray(updatedPins) ? updatedPins : JSON.parse(updatedPins);
      setPins(parsedPins); // Oppdater pins i state
      alert("Pins lagret i databasen!");
    } catch (error) {
      console.error("Error saving pins:", error);
    }
  };

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
    setEditPinName(pin.name);
    setEditPinLat(pin.latitude);
    setEditPinLng(pin.longitude);
    setEditPinDistance(pin.distance || null);
    setEditPinPar(pin.par || null);
    setEditPinOutOfBounds(pin.outOfBounds || "");

    setMapCenter({ lat: pin.latitude, lng: pin.longitude });
  };

    const handleSavePinChanges = () => {
    if (!selectedPin) return;
  
    const updatedPins = pins.map((pin) =>
      pin.id === selectedPin.id
        ? {
            ...pin,
            name: editPinName,
            latitude: tempLat !== null ? tempLat : pin.latitude,
            longitude: tempLng !== null ? tempLng : pin.longitude,
            distance: editPinDistance ?? undefined,
            par: editPinPar ?? undefined,
            outOfBounds: editPinOutOfBounds || undefined,
          }
        : pin
    );
  
    setPins(updatedPins as Pin[]);
    savePinsToDatabase();
    setSelectedPin(null);
    setEditPinName("");
    setEditPinDistance(null);
    setEditPinPar(null);
    setEditPinOutOfBounds("");
    setTempLat(null);
    setTempLng(null);
    setIsDragging(false);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
  
    if (!selectedPin || !e.latLng) return;

    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();

    setTempLat(newLat);
    setTempLng(newLng);

    // Oppdater pinnen med ny posisjon i state
    const updatedPins = pins.map((p) =>
      p.id === selectedPin.id ? { ...p, latitude: newLat, longitude: newLng } : p
    );

    setPins(updatedPins);
  };

  const handleGoBack = () => {
    setIsCourseSelected(false);
    setSelectedCourse("");
  };

  const handleCourseSelection = async (courseName: string) => {
    setSelectedCourse(courseName);
    setIsCourseSelected(true);
  
    const course = courses.find((c) => c.name === courseName);
    if (course) {
      setMapCenter({ lat: course.latitude, lng: course.longitude });
  
      const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/${course.id}/pins`;
      const token = localStorage.getItem("accessToken");
  
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Kunne ikke hente pins for banen. Sjekk autentisering.");
        }
  
        const result = await response.json();
        console.log("Pins fetched from backend:", result);
  
        // Valider at result er et array
        if (Array.isArray(result)) {
          setPins(result);
        } else {
          console.error("Backend returned an unexpected format:", result);
          setPins([]); // Sett pins til et tomt array hvis responsen er ugyldig
        }
      } catch (error) {
        console.error("Error fetching pins:", error);
        alert("Kunne ikke hente pins for banen. Vennligst prøv igjen senere.");
      }
    }
  };
  
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      handleAddPin(e.latLng.lat(), e.latLng.lng());
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-black">
      <div className="flex-grow flex items-start justify-center">
        <div className="max-w-5xl w-full p-10 bg-gray-100 shadow-xl rounded-3xl min-h-[700px] relative flex flex-col">
          {!isCourseSelected && (
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-1">
                <h1 className="text-xl font-bold text-center mb-4">Velg Bane</h1>
                <div className="w-full mt-6">
                  <ul className="space-y-6">
                    {courses.map((course) => (
                      <li
                        key={course.name}
                        className={`p-4 border rounded-lg cursor-pointer ${
                          selectedCourse === course.name ? "bg-gray-400 text-white" : ""
                        }`}
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
                      center={mapCenter} 
                      zoom={15}
                      mapContainerStyle={{ height: "750px", width: "75%", borderRadius: "1rem" }}
                      onClick={handleMapClick}
                    >
                        {Array.isArray(pins) && pins.map((pin) => (
                          <>
                            <Marker
                              key={pin.id}
                              position={{ lat: pin.latitude, lng: pin.longitude }}
                              draggable={isDragging && selectedPin?.id === pin.id}
                              onDragStart={handleDragStart}
                              onDragEnd={handleDragEnd}
                              onClick={() => handlePinClick(pin)}
                            />
                            <OverlayView
                              position={{ lat: pin.latitude, lng: pin.longitude }}
                              mapPaneName={"floatPane"} // Beholder riktig mapPaneName for korrekt plassering
                            >
                              <div
                                style={{
                                  position: "absolute",
                                  transform: "translate(-50%, -250%)", // Flytt boksen oppover
                                  backgroundColor: "rgba(255, 255, 255, 1)", // Gjennomsiktig hvit bakgrunn
                                  padding: "4px 8px", // Gjør boksen tydelig
                                  borderRadius: "4px", // Myke hjørner
                                  border: "1px solid black", // Tydelig kantlinje
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  color: "black",
                                  whiteSpace: "nowrap",
                                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Lett skygge for dybde
                                }}
                              >
                                {pin.name}
                              </div>
                            </OverlayView>
                          </>
                        ))}
                      {selectedPin && (
                        <OverlayView
                        position={{ lat: selectedPin.latitude, lng: selectedPin.longitude }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      >
                        <div
                        style={{
                          position: "absolute",
                          transform: "translate(30px, -75%)", 
                          backgroundColor: "white",
                          padding: "15px",
                          borderRadius: "8px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "black",
                          textAlign: "left",
                          zIndex: 1000,
                          width: "160px",
                        }}
                        >
                          {selectedPin.distance && <div>Distanse: {selectedPin.distance} meter</div>}
                          {selectedPin.par && <div>Par: {selectedPin.par}</div>}
                          {selectedPin.outOfBounds && <div>OB: {selectedPin.outOfBounds}</div>}
                        </div>
                      </OverlayView>
                      )}
                    </GoogleMap>
                  </LoadScript>
                )}
              </div>

              <div className="absolute top-0 right-0 w-1/4 bg-gray-100 p-4 h-auto flex flex-col justify-between">
                <h2 className="text-xl font-semibold">Rediger bane</h2>
                <div>
                  <label className="block mt-4">Navn:</label>
                  <input
                    type="text"
                    value={newPinName}
                    onChange={(e) => setNewPinName(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="mt-4">
                  <label className="block">Velg Pin Type:</label>
                  <select
                  value={selectedPinType}
                  onChange={(e) => handlePinTypeChange(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="kurv">Kurv</option>
                  <option value="Utslagspunkt">Utslagspunkt</option>
                </select>
                </div>

                {selectedPin && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-200">
                    <h3 className="text-lg font-semibold mb-2">Rediger Pin</h3>
                    <div className="mb-2">
                      <label className="block text-sm font-medium">Navn:</label>
                      <input
                        type="text"
                        value={editPinName}
                        onChange={(e) => setEditPinName(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium">Distanse (meter):</label>
                      <input
                        type="number"
                        value={editPinDistance || ""}
                        onChange={(e) => setEditPinDistance(Number(e.target.value))}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium">Par:</label>
                      <input
                        type="number"
                        value={editPinPar || ""}
                        onChange={(e) => setEditPinPar(Number(e.target.value))}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium">Out-of-Bounds (OB):</label>
                      <textarea
                        value={editPinOutOfBounds}
                        onChange={(e) => setEditPinOutOfBounds(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <button
                      onClick={() => setIsDragging(!isDragging)}
                      className={`px-4 py-2 rounded-lg mt-2 ${
                        isDragging ? "bg-gray-400 text-black" : "bg-blue-600 text-white"
                      }`}
                    >
                      {isDragging ? "Flyttemodus aktivert" : "Flytt kurv"}
                    </button>
                    <button
                      onClick={handleSavePinChanges}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2"
                    >
                      Lagre endringer
                    </button>
                  </div>
                )}

                <div className="mt-auto">
                  <button
                    onClick={handleGoBack}
                    className="bg-blue-600 text-white p-2 rounded-lg w-full mt-8"
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