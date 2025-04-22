import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, OverlayView, Polyline } from "@react-google-maps/api";

import Course from "../../types/course";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

type Pin = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: "kurv" | "Utslagspunkt";
  distance?: number;
  par?: number;
  outOfBounds?: string;
};

type Line = {
  pinId1: string;
  pinId2: string;
};

export default function CourseSettings() {
  const { t, i18n } = useTranslation();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [pins, setPins] = useState<Pin[]>([]);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [selectedPinType, setSelectedPinType] = useState<"kurv" | "Utslagspunkt">("kurv");
  const [newPinName, setNewPinName] = useState("");
  const [isCourseSelected, setIsCourseSelected] = useState(false);
  const [editPinName, setEditPinName] = useState("");
  const [editPinDistance, setEditPinDistance] = useState<number | null>(null);
  const [editPinPar, setEditPinPar] = useState<number | null>(null);
  const [editPinOutOfBounds, setEditPinOutOfBounds] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [linePins, setLinePins] = useState<Pin[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 59.9139,
    lng: 10.7522,
  });

  const [zoomLevel, setZoomLevel] = useState(2);

  const handlePinTypeChange = (value: string) => {
    if (value === "kurv" || value === "Utslagspunkt") {
      setSelectedPinType(value);
    } else {
      toast.error(t("coursesettings_toast_error_invalid_pin_type"));
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/course";
      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error(t("coursesettings_error_fetch_courses"));
        }

        const result = await response.json();
        const mappedCourses = result.data.map((course: Course) => ({
          ...course,
          id: course._id,
        }));

        setCourses(mappedCourses);
      } catch (error) {
        toast.error(t("coursesettings_toast_error_fetch_courses"));
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchCoursesForOwner = async () => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/owner`;
      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error(t("coursesettings_error_fetch_courses_for_owner"));
        }

        const result = await response.json();
        setFilteredCourses(result.data);
      } catch (error) {
        toast.error(t("coursesettings_toast_error_fetch_courses_for_owner"));
      }
    };

    fetchCoursesForOwner();
  }, []);

  const savePinsToDatabase = async () => {
    if (!selectedCourse) return;

    const course = courses.find((c) => c.name === selectedCourse);
    if (!course) return;

    const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/${course._id}/pins`;
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pins, lines }),
      });

      if (response.status !== 200) {
        const errorText = await response.text();
        throw new Error(t("coursesettings_error_pins_lines") + errorText);
      }

      const updatedData = await response.json();
      setPins(updatedData.pins || []);
      setLines(updatedData.lines || []);
      alert("Pins og linjer lagret i databasen!");
    } catch (error) {
      toast.error(t("coursesettings_toast_error_save_pins_lines"));
    }
  };

  const handleAddPin = (lat: number, lng: number) => {
    if (!newPinName) {
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
    setSelectedPin(null);
  };

  const handlePinClick = async (pin: Pin) => {
    if (isDeleteMode) {
      const pinName = pin.name || t("coursesettings_unknown_pin");
      if (window.confirm(t("coursesettings_confirm_delete") + ` "${pinName}"?`)) {
        const updatedPins = pins.filter((p) => p.id !== pin.id);
        const updatedLines = lines.filter(
          (line) => line.pinId1 !== pin.id && line.pinId2 !== pin.id
        );
        setPins(updatedPins);
        setLines(updatedLines);
        setSelectedPin(null);

        const course = courses.find((c) => c.name === selectedCourse);
        if (course) {
          const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/${course._id}/pins`;
          const token = localStorage.getItem("accessToken");
          try {
            const response = await fetch(url, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ pins: updatedPins, lines: updatedLines }),
            });
            if (response.status !== 200) {
              const errorText = await response.text();
              throw new Error(t("coursesettings_error_failed_savedS") + errorText);
            }
            toast.success(t('coursesettings_toast_success_pin') + pinName + t('coursesettings_toast_success_pin_deleted'));
          } catch (error) {
            toast.error(t("coursesettings_toast_error_failed_save_pin") + error);
            setPins(pins);
            setLines(lines);
          }
        }
      }
      return;
    }

    if (isDrawingLine) {
      setLinePins((prev) => {
        const newLinePins = [...prev, pin];
        if (newLinePins.length === 2) {
          // Add the new line to the lines state
          setLines((prevLines) => [
            ...prevLines,
            { pinId1: newLinePins[0].id, pinId2: newLinePins[1].id },
          ]);
          // Reset linePins for the next line
          return [];
        }
        return newLinePins;
      });
      return;
    }

    try {
      const course = courses.find((c) => c.name === selectedCourse);
      if (!course) return;

      const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/${course._id}/pins`;
      const token = localStorage.getItem("accessToken");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        throw new Error(t("Failed to fetch pins from database"));
      }

      const updatedData = await response.json();
      setPins(updatedData.pins || []);
      setLines(updatedData.lines || []);

      const selectedPinData = updatedData.pins.find((p: Pin) => p.id === pin.id);
      if (selectedPinData) {
        setSelectedPin(selectedPinData);
        setEditPinDistance(selectedPinData.distance || null);
        setEditPinPar(selectedPinData.par || null);
        setEditPinOutOfBounds(selectedPinData.outOfBounds || "");
      }
    } catch (error) {
      console.error("Error fetching pin data:", error);
      alert("Kunne ikke hente pin-data. Prøv igjen senere.");
    }

    setMapCenter({ lat: pin.latitude, lng: pin.longitude });
  };

  const handleLineClick = async (line: Line, index: number) => {
    if (isDeleteMode) {
      const pin1 = pins.find((p) => p.id === line.pinId1);
      const pin2 = pins.find((p) => p.id === line.pinId2);
      const lineName = t("coursesettings_line_between") + ` "${pin1?.name || t("coursesettings_unknown")}" ${t("coursesettings_and")} "${pin2?.name || t("coursesettings_unknown")}"`;
      if (window.confirm(t("coursesettings_confirm_delete") + ` ${lineName}?`)) {
        const updatedLines = lines.filter((_, i) => i !== index);
        setLines(updatedLines);

        const course = courses.find((c) => c.name === selectedCourse);
        if (course) {
          const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/${course._id}/pins`;
          const token = localStorage.getItem("accessToken");
          try {
            const response = await fetch(url, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ pins, lines: updatedLines }),
            });
            if (response.status !== 200) {
              const errorText = await response.text();
              throw new Error(t("coursesettings_failed_to_save_lines") + errorText);
            }
            toast.success(t('coursesettings_toast_success_line') + lineName + t('coursesettings_toast_success_line_deleted'));
          } catch (error) {
            toast.error(t("coursesettings_toast_error_failed_save_line") + error);
            setLines(lines);
          }
        }
      }
    }
  };

  const handleSavePinChanges = async () => {
    if (!selectedPin) return;

    const updatedPins = pins.map((pin) =>
      pin.id === selectedPin.id
        ? {
            ...pin,
            distance: editPinDistance ?? undefined,
            par: editPinPar ?? undefined,
            outOfBounds: editPinOutOfBounds || undefined,
          }
        : pin
    );

    setPins(updatedPins as Pin[]);
    const updatedPin = updatedPins.find((pin) => pin.id === selectedPin.id);
    if (updatedPin) {
      setSelectedPin(updatedPin);
    }

    try {
      const course = courses.find((c) => c.name === selectedCourse);
      if (!course) return;

      const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/${course._id}/pins`;
      const token = localStorage.getItem("accessToken");

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pins: updatedPins, lines }),
      });

      if (response.status !== 200) {
        throw new Error(t("coursesettings_error_failed_save_pin"));
      }

      alert("Endringer lagret!");
    } catch (error) {
      console.error("Error saving pins:", error);
      alert("Kunne ikke lagre endringer. Prøv igjen senere.");
    }

    setEditPinDistance(null);
    setEditPinPar(null);
    setEditPinOutOfBounds("");
    setSelectedPin(null);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    if (!selectedPin || !e.latLng) return;

    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();

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
      const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/${course._id}/pins`;
      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error(t("coursesettings_error_fetch_pins"));
        }

        const result = await response.json();
        setPins(Array.isArray(result.pins) ? result.pins : []);
        setLines(Array.isArray(result.lines) ? result.lines : []);
        setMapCenter({
          lat: course.latitude,
          lng: course.longitude,
        });
        setZoomLevel(15);
      } catch (error) {
        alert("Kunne ikke hente pins for banen. Vennligst prøv igjen senere.");
      }
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (isDeleteMode) {
      return;
    }
    if (e.latLng) {
      handleAddPin(e.latLng.lat(), e.latLng.lng());
    }
    setSelectedPin(null);
    setIsDrawingLine(false);
    setLinePins([]);
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && !e.target.closest(".edit-panel") && !e.target.closest(".gm-style")) {
      setSelectedPin(null);
      setIsDrawingLine(false);
      setLinePins([]);
      setIsDeleteMode(false);
    }
  };

  const toggleDrawLine = () => {
    setIsDrawingLine((prev) => !prev);
    if (!isDrawingLine) {
      setLinePins([]);
    }
    setSelectedPin(null);
    setIsDeleteMode(false);
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedPin(null);
    setIsDrawingLine(false);
    setLinePins([]);
  };

  return (
    <div className="min-h-screen flex flex-col text-black">
      <div className="flex-grow flex items-start justify-center">
        <div
          className="max-w-5xl w-full p-10 top-[-50px] bg-gray-100 shadow-xl rounded-3xl min-h-[950px] relative flex flex-col mt-24"
          onClick={handleContainerClick}
        >
          {!isCourseSelected && (
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-1">
                <h1 className="text-xl font-bold text-center mb-4">{t("coursesettings_title")}</h1>
                <div className="w-full mt-6">
                  <ul className="space-y-6">
                    {filteredCourses.map((course) => (
                      <li
                        key={course.name}
                        className={`block w-full text-left px-4 py-2 rounded-lg shadow transition ${
                          selectedCourse === course.name
                            ? "bg-blue-600 text-white"
                            : "bg-white hover:bg-blue-100 text-black"
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
                  <LoadScript
                    googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
                    language={i18n.language}
                  >
                    <GoogleMap
                      center={mapCenter}
                      zoom={zoomLevel}
                      mapContainerStyle={{
                        height: "900px",
                        width: "75%",
                        borderRadius: "1rem",
                      }}
                      onClick={handleMapClick}
                    >
                      {Array.isArray(pins) &&
                        pins.map((pin) => (
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
                              mapPaneName={"floatPane"}
                            >
                              <div
                                style={{
                                  position: "absolute",
                                  transform: "translate(-50%, -250%)",
                                  backgroundColor: "rgba(255, 255, 255, 1)",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  border: "1px solid black",
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  color: "black",
                                  whiteSpace: "nowrap",
                                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
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
                          mapPaneName={"floatPane"}
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
                              width: "150px",
                            }}
                          >
                            {selectedPin.distance && (
                              <div>
                                <strong>{t("coursesettings_distance")}:</strong> {selectedPin.distance} {t("coursesettings_meters")}
                              </div>
                            )}
                            {selectedPin.par && (
                              <div>
                                <strong>{t("coursesettings_par")}:</strong> {selectedPin.par}
                              </div>
                            )}
                            {selectedPin.outOfBounds && (
                              <div>
                                <strong>{t("coursesettings_ob")}:</strong> {selectedPin.outOfBounds}
                              </div>
                            )}
                          </div>
                        </OverlayView>
                      )}
                      {linePins.length === 2 && (
                        <Polyline
                          path={[
                            { lat: linePins[0].latitude, lng: linePins[0].longitude },
                            { lat: linePins[1].latitude, lng: linePins[1].longitude },
                          ]}
                          options={{
                            strokeColor: "#808080",
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            geodesic: true,
                            icons: [
                              {
                                icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 4 },
                                offset: "0",
                                repeat: "20px",
                              },
                            ],
                          }}
                        />
                      )}
                      {lines.map((line, index) => {
                        const pin1 = pins.find((p) => p.id === line.pinId1);
                        const pin2 = pins.find((p) => p.id === line.pinId2);
                        if (!pin1 || !pin2) return null;
                        return (
                          <Polyline
                            key={`line-${index}`}
                            path={[
                              { lat: pin1.latitude, lng: pin1.longitude },
                              { lat: pin2.latitude, lng: pin2.longitude },
                            ]}
                            options={{
                              strokeColor: "#808080",
                              strokeOpacity: 0.8,
                              strokeWeight: 2,
                              geodesic: true,
                              icons: [
                                {
                                  icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 4 },
                                  offset: "0",
                                  repeat: "20px",
                                },
                              ],
                            }}
                            onClick={() => handleLineClick(line, index)}
                          />
                        );
                      })}
                    </GoogleMap>
                  </LoadScript>
                )}
              </div>

              <div className="edit-panel absolute top-0 right-0 w-1/4 bg-gray-100 p-4 h-[850px] flex flex-col justify-between">
                <h2 className="text-xl font-semibold">{t("Edit Course")}</h2>
                <div>
                  <label className="block mt-4">{t("coursesettings_name")}:</label>
                  <input
                    type="text"
                    value={newPinName}
                    onChange={(e) => setNewPinName(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="mt-4">
                  <label className="block">{t("coursesettings_select_pin_type")}:</label>
                  <select
                    value={selectedPinType}
                    onChange={(e) => handlePinTypeChange(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="kurv">{t("coursesettings_basket")}</option>
                    <option value="Utslagspunkt">{t("coursesettings_tee_point")}</option>
                  </select>
                  <button
                    onClick={savePinsToDatabase}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg mt-4"
                  >
                    {t("coursesettings_save_all_pins")}
                  </button>
                  <button
                    onClick={toggleDrawLine}
                    className={`px-4 py-2 rounded-lg mt-2 block ${
                      isDrawingLine ? "bg-gray-400 text-black" : "bg-blue-600 text-white"
                    }`}
                  >
                    {isDrawingLine ? t("coursesettings_end_draw_line") : t("coursesettings_draw_line")}
                  </button>
                  <button
                    onClick={toggleDeleteMode}
                    className={`px-4 py-2 rounded-lg mt-2 ${
                      isDeleteMode ? "bg-gray-400 text-black" : "bg-red-600 text-white"
                    }`}
                  >
                    {isDeleteMode ? t("coursesettings_end_delete_mode") : t("coursesettings_delete_mode")}
                  </button>
                </div>

                {selectedPin && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-200">
                    <h3 className="text-lg font-semibold mb-2">{t("coursesettings_edit_pin")}</h3>
                    <div className="mb-2">
                      <label className="block text-sm font-medium">{t("coursesettings_name")}:</label>
                      <input
                        type="text"
                        value={editPinName}
                        onChange={(e) => setEditPinName(e.target.value)}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium">{t("coursesettings_distance")}</label>
                      <input
                        type="number"
                        value={editPinDistance || ""}
                        onChange={(e) => setEditPinDistance(Number(e.target.value))}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium">{t("coursesettings_par")}:</label>
                      <input
                        type="number"
                        value={editPinPar || ""}
                        onChange={(e) => setEditPinPar(Number(e.target.value))}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm font-medium">{t("coursesettings_ob")}</label>
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
                      {isDragging ? t("coursesettings_move_mode_enabled") : t("coursesettings_move_basket")}
                    </button>
                    <button
                      onClick={handleSavePinChanges}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2"
                    >
                      {t("coursesettings_save_changes")}
                    </button>
                  </div>
                )}

                <div className="mt-auto">
                  <button
                    onClick={handleGoBack}
                    className="bg-blue-600 text-white p-2 rounded-lg w-full mt-4"
                  >
                    {t("coursesettings_go_back")}
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
