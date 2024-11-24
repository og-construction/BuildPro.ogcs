import React, { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { MdLocationOn } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

const PincodeToCity = () => {
  const [pincode, setPincode] = useState("");
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    city: "Fetching your current city...",
    error: null,
  });
  const [isDialogOpen, setDialogOpen] = useState(false);

  // Fetch city from latitude and longitude
  const fetchCityFromLatLng = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      if (data && data.address) {
        setPincode(data?.address?.postcode);
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.state ||
          "Unknown City";
        setLocation({
          latitude: lat,
          longitude: lon,
          city,
          error: null,
        });
      } else {
        setLocation({
          latitude: lat,
          longitude: lon,
          city: "Unknown City",
          error: null,
        });
      }
    } catch (error) {
      setLocation({
        latitude: lat,
        longitude: lon,
        city: null,
        error: "Error fetching location data.",
      });
    }
  };

  // Fetch latitude and longitude from pincode
  const fetchLatLngFromPincode = async () => {
    if (!pincode) {
      setLocation({ ...location, error: "Please enter a valid pincode." });
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&postalcode=${pincode}&country=IN`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        fetchCityFromLatLng(lat, lon);
      } else {
        setLocation({
          latitude: null,
          longitude: null,
          city: null,
          error: "No location found for the provided pincode.",
        });
      }
    } catch (error) {
      setLocation({
        latitude: null,
        longitude: null,
        city: null,
        error: "Error fetching location data.",
      });
    }
  };

  // Get user's current location using Geolocation API
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCityFromLatLng(latitude, longitude);
        },
        () => {
          setLocation({
            latitude: null,
            longitude: null,
            city: null,
            error: "Unable to fetch your location. Please enter a pincode.",
          });
        }
      );
    } else {
      setLocation({
        latitude: null,
        longitude: null,
        city: null,
        error: "Geolocation is not supported by your browser.",
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="max-w-lg cursor-pointer"
        onClick={() => setDialogOpen(true)}
      >
        <div className="flex gap-2 items-center justify-center mb-4">
          {/* Display the location icon and city name side by side */}
          <MdLocationOn className="text-blue-600 text-5xl" />
          <div className="flex flex-col text-center">
            {location.error ? (
              <p className="text-red-600 text-sm mt-2">{location.error}</p>
            ) : (
              <div className="mt-2">
                <p className="text-xl font-semibold text-gray-800">
                  <strong>City:</strong> {location.city}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Pincode:</strong> {pincode || "Not entered"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog for entering Pincode */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <div className="relative p-8 bg-white rounded-lg shadow-2xl">
          <AiOutlineClose
            className="absolute top-4 right-4 text-gray-600 cursor-pointer text-2xl"
            onClick={() => setDialogOpen(false)}
          />
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Choose your location
          </h3>
          <div className="mb-6">
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Pincode"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                fetchLatLngFromPincode();
                setDialogOpen(false);
              }}
              className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition duration-300"
            >
              Apply
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PincodeToCity;
