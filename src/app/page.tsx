// src/app/page.tsx
'use client';

import { useState } from 'react';
import FlagCanvas from '@/components/FlagCanvas';
import FlagControls from '@/components/FlagControls';

export default function Home() {
  const [windStrength, setWindStrength] = useState(0.5);
  const [windDirection, setWindDirection] = useState(0);

  return (
    <main className="relative min-h-screen">
      <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-black/80 p-4 rounded-lg backdrop-blur-md">
        <h2 className="text-lg font-bold mb-2">깃발 컨트롤</h2>
        <FlagControls 
          windStrength={windStrength}
          setWindStrength={setWindStrength}
          windDirection={windDirection}
          setWindDirection={setWindDirection}
        />
      </div>
      
      <FlagCanvas 
        windStrength={windStrength}
        windDirection={windDirection}
      />
    </main>
  );
}