'use client';

import { useState } from 'react';

interface FlagControlsProps {
  windStrength: number;
  setWindStrength: (value: number) => void;
  windDirection: number;
  setWindDirection: (value: number) => void;
}

export default function FlagControls({
  windStrength,
  setWindStrength,
  windDirection,
  setWindDirection
}: FlagControlsProps) {
  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-md font-bold">깃발 제어</h3>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          바람 세기: {windStrength.toFixed(1)}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={windStrength}
          onChange={(e) => setWindStrength(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          바람 방향: {windDirection}°
        </label>
        <input
          type="range"
          min="0"
          max="359"
          step="1"
          value={windDirection}
          onChange={(e) => setWindDirection(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>
      
      <div className="pt-2">
        <button
          onClick={() => {
            setWindStrength(0.5);
            setWindDirection(0);
          }}
          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          초기화
        </button>
      </div>
    </div>
  );
}