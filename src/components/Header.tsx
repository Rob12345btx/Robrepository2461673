/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, TrendingUp, RefreshCw, Layers } from 'lucide-react';

interface HeaderProps {
  currentLocation: string;
  onLocationChange: (newLocation: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
}

export default function Header({
  currentLocation,
  onLocationChange,
  isLoading,
  onRefresh,
}: HeaderProps) {
  const [typedLoc, setTypedLoc] = useState(currentLocation);
  const [isEditing, setIsEditing] = useState(false);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');

  useEffect(() => {
    setTypedLoc(currentLocation);
  }, [currentLocation]);

  const handleApplyLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedLoc.trim()) {
      onLocationChange(typedLoc.trim());
      setIsEditing(false);
    }
  };

  const handleGPSDetect = () => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      alert("Geolocation is not supported by your browser inside this window.");
      return;
    }

    setGeoStatus('locating');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Instead of high overhead Google Geocoding API keys, we reverse find locally or standard API
          const { latitude, longitude } = position.coords;
          // Use openstreetmap free non-key geocoder
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          if (res.ok) {
            const data = await res.json();
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.suburb ||
              'Your Region';
            const state = data.address.state || data.address.country || '';
            const locationString = state ? `${city}, ${state}` : city;
            onLocationChange(locationString);
            setTypedLoc(locationString);
            setGeoStatus('success');
          } else {
            // Fallback coordinate search string
            const truncatedCoord = `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°W`;
            onLocationChange(truncatedCoord);
            setTypedLoc(truncatedCoord);
            setGeoStatus('success');
          }
        } catch (err) {
          console.error("Nominatim reverse geocode failing: ", err);
          const coordText = `${position.coords.latitude.toFixed(2)}°N, ${position.coords.longitude.toFixed(2)}°W`;
          onLocationChange(coordText);
          setTypedLoc(coordText);
          setGeoStatus('success');
        }
      },
      (error) => {
        console.error("GPS error: ", error);
        setGeoStatus('error');
        // Let user know gracefully due to iframe sandbox constraints
        alert("Geolocation permission denied or blocked by sandbox iframe constraints. Please enter your city manually in the field!");
      },
      { timeout: 8000 }
    );
  };

  const currentDateText = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <header className="border-b border-neutral-200 py-6 px-4 bg-white select-none">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Top Mini Tagline */}
        <div className="flex items-center gap-1.5 text-[10px] tracking-widest text-neutral-500 font-mono uppercase border border-neutral-200 px-2.5 py-0.5 rounded-full mb-4">
          <Layers className="w-3 h-3 text-emerald-600 animate-pulse" />
          AD-FREE NEWS FOR MACROECONOMISTS & GLOBAL CITIZENS
        </div>

        {/* Master Masthead */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 tracking-tight text-center my-1 font-display">
          ECONWORLD PULSE
        </h1>
        <p className="font-sans text-xs italic text-neutral-500 tracking-wide text-center">
          Democratizing global macroeconomic flows • Grounded in empirical search synthesis
        </p>

        {/* Info Grid (Date / Location / Quick Stats) */}
        <div className="w-full mt-6 pt-3 border-t border-b border-neutral-150 grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-xs text-neutral-600 font-sans">
          
          {/* Left Column: Date and Year */}
          <div className="text-left font-serif text-sm text-neutral-700 md:block hidden">
            <span>{currentDateText}</span>
          </div>

          {/* Center Column: Geolocation and Editable Location */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1 bg-neutral-50 px-3 py-1.5 rounded-md border border-neutral-200">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              {isEditing ? (
                <form onSubmit={handleApplyLocation} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={typedLoc}
                    onChange={(e) => setTypedLoc(e.target.value)}
                    className="bg-white border border-neutral-300 rounded px-1.5 py-0.5 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400 w-36 font-semibold"
                    autoFocus
                    placeholder="E.g. Boston, MA"
                  />
                  <button
                    type="submit"
                    className="bg-neutral-800 text-white rounded px-2 py-0.5 hover:bg-neutral-700 font-medium"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-neutral-500 hover:text-neutral-700 px-1"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <span
                  onClick={() => setIsEditing(true)}
                  className="font-semibold text-neutral-800 cursor-pointer hover:underline border-b border-dashed border-neutral-400"
                  title="Click to edit location manually"
                >
                  {currentLocation}
                </span>
              )}

              {/* Geolocation Trigger */}
              {!isEditing && (
                <button
                  type="button"
                  onClick={handleGPSDetect}
                  disabled={geoStatus === 'locating'}
                  className="text-neutral-400 hover:text-neutral-700 p-0.5 rounded transition"
                  title="Detect my current location with GPS"
                >
                  <Navigation
                    className={`w-3 h-3 ${
                      geoStatus === 'locating' ? 'animate-spin text-emerald-500' : ''
                    }`}
                  />
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Global Markets Health Feed / Refresher */}
          <div className="flex md:justify-end justify-center items-center gap-4.5">
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>S&P Risk Premium: Balanced</span>
            </div>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white rounded-md transition text-xs font-medium disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Desk</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
