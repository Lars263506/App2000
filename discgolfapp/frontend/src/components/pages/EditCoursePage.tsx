import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, OverlayView } from "@react-google-maps/api";

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

  // Ny state for kartets senter
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 59.9139, // Standard senter (Oslo)
    lng: 10.7522,
  });

  useEffect(() => {
    const fetchCourses = async () => {
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/course";
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
    setEditPinName(pin.name);
    setEditPinLat(pin.latitude);
    setEditPinLng(pin.longitude);
    setEditPinDistance(pin.distance || null);
    setEditPinPar(pin.par || null);
    setEditPinOutOfBounds(pin.outOfBounds || "");

    // Oppdater kartets senter til pinnen som ble klikket
    setMapCenter({ lat: pin.latitude, lng: pin.longitude });
  };

  const handleSavePinChanges = () => {
    if (!selectedPin) return;

    const updatedPins = pins.map((pin) =>
      pin.id === selectedPin.id
        ? {
            ...pin,
            name: editPinName,
            latitude: tempLat !== null ? tempLat : pin.latitude, // Bruk eksisterende latitude hvis ikke endret
            longitude: tempLng !== null ? tempLng : pin.longitude, // Bruk eksisterende longitude hvis ikke endret
            distance: editPinDistance ?? undefined,
            par: editPinPar ?? undefined,
            outOfBounds: editPinOutOfBounds || undefined,
          }
        : pin
    );

    setPins(updatedPins as Pin[]);
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

    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();

    setTempLat(newLat);
    setTempLng(newLng);
  };

  const handleGoBack = () => {
    setIsCourseSelected(false);
    setSelectedCourse("");
  };

  const handleCourseSelection = (courseName: string) => {
    setSelectedCourse(courseName);
    setIsCourseSelected(true);

    // Oppdater kartets senter til banens posisjon
    const course = courses.find((c) => c.name === courseName);
    if (course) {
      setMapCenter({ lat: course.latitude, lng: course.longitude });
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
                      center={mapCenter} // Bruk mapCenter som senter
                      zoom={15}
                      mapContainerStyle={{ height: "750px", width: "75%", borderRadius: "1rem" }}
                      onClick={handleMapClick}
                    >
                      {pins.map((pin) => (
                        <Marker
                          key={pin.id}
                          position={{ lat: pin.latitude, lng: pin.longitude }}
                          draggable={isDragging && selectedPin?.id === pin.id}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          onClick={() => handlePinClick(pin)}
                        />
                      ))}

                      {tempLat !== null && tempLng !== null && (
                        <Marker
                          position={{ lat: tempLat, lng: tempLng }}
                          icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                          }}
                        />
                      )}

                      {selectedPin && (
                        <OverlayView
                          position={{ lat: selectedPin.latitude, lng: selectedPin.longitude }}
                          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "-150px",
                              left: "-50%",
                              transform: "translateX(-50%)",
                              backgroundColor: "white",
                              padding: "15px",
                              borderRadius: "8px",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                              fontSize: "14px",
                              fontWeight: "bold",
                              color: "black",
                              textAlign: "left",
                              zIndex: 1000,
                              width: "150px",
                            }}
                          >
                            <div>Navn: {selectedPin.name}</div>
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
                    onChange={(e) => setSelectedPinType(e.target.value as "kurv" | "Utslagspunkt")}
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