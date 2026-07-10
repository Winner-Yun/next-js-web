/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CircleF,
  GoogleMap,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Loader2Icon, MapPinIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Google Maps Configurations
const mapLibraries: "places"[] = ["places"];
const fallbackCenter = { lat: 11.5564, lng: 104.9282 }; // Phnom Penh
const defaultMapOptions = {
  disableDefaultUI: false,
  clickableIcons: false,
  mapTypeControl: false,
};

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

interface LocationPickerMapProps {
  radius: number;
  initialLocation?: { lat: number; lng: number }; // Added to support Edit state tracking
  onLocationSelected: (location: LocationData) => void;
}

export function LocationPickerMap({
  radius,
  initialLocation,
  onLocationSelected,
}: LocationPickerMapProps) {
  const [mapCenter, setMapCenter] = useState(initialLocation || fallbackCenter);
  const [searchAddress, setSearchAddress] = useState("");

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-maps-location-picker",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: mapLibraries,
  });

  // Synchronize map position whenever the initial coordinates load or shift
  useEffect(() => {
    if (initialLocation) {
      setMapCenter(initialLocation);
      setSearchAddress(
        `${initialLocation.lat.toFixed(5)}, ${initialLocation.lng.toFixed(5)}`,
      );
    }
  }, [initialLocation, initialLocation.lat, initialLocation.lng]);

  useEffect(() => {
    if (!isLoaded || !searchInputRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      searchInputRef.current,
      {
        fields: ["geometry", "formatted_address"],
      },
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const selectedPlace = autocompleteRef.current?.getPlace();
      if (selectedPlace?.geometry?.location) {
        const newLat = selectedPlace.geometry.location.lat();
        const newLng = selectedPlace.geometry.location.lng();
        const newAddress = selectedPlace.formatted_address || "";

        setMapCenter({ lat: newLat, lng: newLng });
        setSearchAddress(newAddress);

        // Bubble up to parent
        onLocationSelected({ lat: newLat, lng: newLng, address: newAddress });
      }
    });
  }, [isLoaded, onLocationSelected]);

  // Handle Manual Canvas Clicks
  const handleMapCanvasClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      const newAddress = `${newLat.toFixed(5)}, ${newLng.toFixed(5)}`;

      setMapCenter({ lat: newLat, lng: newLng });
      setSearchAddress(newAddress);

      // Bubble up to parent
      onLocationSelected({ lat: newLat, lng: newLng, address: newAddress });
    }
  };

  if (loadError) {
    return (
      <div className="p-4 text-xs text-center border rounded-lg border-destructive/20 bg-destructive/10 text-destructive">
        Error loading Google Maps API. Check your .env configuration.
      </div>
    );
  }

  const newLocal =
    "w-full h-62.5 sm:h-95 md:h-[460px] rounded-lg overflow-hidden border border-muted bg-muted/10 relative flex items-center justify-center shadow-inner";
  return (
    <div className="space-y-4 w-full">
      <div className="space-y-1.5">
        <Label
          htmlFor="locationSearch"
          className="text-xs font-semibold text-foreground"
        >
          Location Search or Coordinate Bindings
        </Label>
        <div className="relative">
          <MapPinIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            id="locationSearch"
            ref={searchInputRef}
            type="text"
            placeholder="Search any location via Google Maps API..."
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            className="pl-9 text-xs h-9 bg-background focus-visible:ring-1"
            disabled={!isLoaded}
          />
        </div>
      </div>

      <div className={newLocal}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={mapCenter}
            zoom={14}
            options={defaultMapOptions}
            onClick={handleMapCanvasClick}
          >
            <MarkerF position={mapCenter} />
            <CircleF
              center={mapCenter}
              radius={radius}
              options={{
                strokeColor: "#2563eb",
                strokeOpacity: 0.85,
                strokeWeight: 2,
                fillColor: "#3b82f6",
                fillOpacity: 0.18,
              }}
            />
          </GoogleMap>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground animate-in fade-in duration-300">
            <Loader2Icon className="size-5 animate-spin text-brand" />
            <span>Loading Interactive Map Canvas...</span>
          </div>
        )}
      </div>
    </div>
  );
}
