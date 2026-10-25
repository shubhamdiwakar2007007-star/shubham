import React, { useState } from 'react';
import { X, MapPin, Search, Check, Navigation } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CITIES } from '../../data/mockData';

export const LocationModal: React.FC = () => {
  const { isLocationOpen, setIsLocationOpen, selectedCity, setSelectedCity, addToast } = useApp();
  const [filterText, setFilterText] = useState('');

  if (!isLocationOpen) return null;

  const filteredCities = CITIES.filter((city) =>
    city.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setIsLocationOpen(false);
    addToast(`Delivery location set to ${city}`, 'success');
  };

  const handleUseCurrentLocation = () => {
    setSelectedCity('Jaipur');
    setIsLocationOpen(false);
    addToast('Detected location: C-Scheme, Jaipur', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        onClick={() => setIsLocationOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 z-10 animate-scaleUp">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#FF7518]" />
              <h3 className="text-lg font-bold text-neutral-900">Choose Delivery Location</h3>
            </div>
            <button
              onClick={() => setIsLocationOpen(false)}
              className="text-neutral-400 hover:text-neutral-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current GPS button */}
          <div className="pt-4 pb-2">
            <button
              onClick={handleUseCurrentLocation}
              className="w-full flex items-center gap-3 p-3 rounded-2xl bg-orange-50/70 border border-orange-200 text-[#FF7518] hover:bg-orange-100 transition-colors text-xs font-bold"
            >
              <Navigation className="w-4 h-4 text-[#FF7518]" />
              <span>Use Current GPS Location (Instant Detect)</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative my-3">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search your city or hub..."
              className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#FF7518]"
            />
          </div>

          {/* City Grid */}
          <div className="max-h-60 overflow-y-auto space-y-1.5 pt-1">
            {filteredCities.map((city) => {
              const isSelected = selectedCity === city;
              return (
                <button
                  key={city}
                  onClick={() => handleSelectCity(city)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#FF7518] text-white shadow-sm'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-neutral-400'}`} />
                    <span>{city}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
