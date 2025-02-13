'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { CountryData } from '@/app/dashboard/geography/page';

interface WorldMapProps {
  data: CountryData[];
  isLoading: boolean;
}

interface TooltipData {
  name: string;
  visits: number;
  x: number;
  y: number;
}

// Expanded map of country coordinates
const countryCoordinates: { [key: string]: [number, number] } = {
  // North America
  "United States": [-95, 38],
  "Canada": [-95, 56],
  "Mexico": [-102, 23],

  // South America
  "Brazil": [-53, -10],
  "Argentina": [-64, -34],
  "Chile": [-71, -30],
  "Colombia": [-74, 4],
  "Peru": [-76, -10],

  // Europe
  "United Kingdom": [-2, 54],
  "Germany": [10, 51],
  "France": [2, 46],
  "Italy": [12, 42],
  "Spain": [-4, 40],
  "Netherlands": [5, 52],
  "Belgium": [4, 50],
  "Sweden": [15, 62],
  "Norway": [8, 61],
  "Denmark": [10, 56],
  "Finland": [26, 64],
  "Poland": [19, 52],
  "Switzerland": [8, 47],
  "Austria": [13, 48],
  "Ireland": [-8, 53],
  "Portugal": [-8, 39],

  // Asia
  "China": [105, 35],
  "Japan": [138, 38],
  "South Korea": [127, 36],
  "India": [78, 22],
  "Indonesia": [120, -5],
  "Vietnam": [108, 16],
  "Thailand": [101, 15],
  "Malaysia": [102, 4],
  "Singapore": [103, 1],
  "Philippines": [122, 13],

  // Oceania
  "Australia": [133, -25],
  "New Zealand": [174, -41],

  // Africa
  "South Africa": [24, -29],
  "Egypt": [30, 27],
  "Nigeria": [8, 9],
  "Kenya": [38, 1],
  "Morocco": [-6, 32],

  // Middle East
  "Israel": [35, 31],
  "Saudi Arabia": [45, 25],
  "United Arab Emirates": [54, 24],
  "Turkey": [35, 39],
};

const defaultPosition: { coordinates: [number, number]; zoom: number } = {
  coordinates: [0, 0],
  zoom: 1
};

const geoUrl = "/data/world-countries.json";

export function WorldMap({ data, isLoading }: WorldMapProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>(defaultPosition);
  const mapRef = useRef<HTMLDivElement>(null);

  // Memoize the country data mapping to avoid recalculations
  const countryVisits = useMemo(() => {
    return data.reduce((acc: { [key: string]: number }, curr) => {
      acc[curr.country] = curr.visits;
      return acc;
    }, {});
  }, [data]);

  // Find top country and set position
  useEffect(() => {
    if (data.length > 0) {
      const topCountry = data.reduce((max, current) => 
        (current.visits > max.visits) ? current : max
      );
      
      const coordinates = countryCoordinates[topCountry.country];
      if (coordinates) {
        setPosition({
          coordinates: coordinates,
          zoom: 4 // Increased zoom level for better focus
        });
      }
    }
  }, [data]);

  const resetView = () => {
    setPosition(defaultPosition);
  };

  // Calculate color based on visit count
  const getColor = (visits: number | undefined) => {
    if (!visits) return '#F5F5F5'; // Default color for no visits
    
    // Color scale based on visits
    if (visits > 1000) return '#1E40AF'; // Very high
    if (visits > 500) return '#2563EB'; // High
    if (visits > 100) return '#3B82F6'; // Medium-high
    if (visits > 50) return '#60A5FA'; // Medium
    if (visits > 10) return '#93C5FD'; // Medium-low
    return '#BFDBFE'; // Low
  };

  const handleMouseMove = (evt: React.MouseEvent, countryName: string, visits: number) => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBoundingClientRect();
      const x = evt.clientX - bounds.left;
      const y = evt.clientY - bounds.top;
      
      setTooltip({
        name: countryName,
        visits: visits || 0,
        x,
        y
      });
    }
  };

  if (isLoading) {
    return <div className="h-[400px] flex items-center justify-center">Loading map...</div>;
  }

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <Button 
          variant="outline" 
          size="sm"
          onClick={resetView}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset View
        </Button>
      </div>
      <div ref={mapRef} className="relative h-[400px] w-full overflow-hidden">
        <ComposableMap
          width={800}
          height={400}
          projection={"geoMercator"}
          projectionConfig={{
            scale: 100,
            center: [0, 0]
          }}
          style={{
            width: "100%",
            height: "100%"
          }}
        >
          <ZoomableGroup 
            center={position.coordinates}
            zoom={position.zoom}
            translateExtent={[[0, 0], [800, 400]]}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name;
                  const visits = countryVisits[countryName];
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getColor(visits)}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: 'none',
                          transition: 'all 250ms'
                        },
                        hover: {
                          fill: '#1E3A8A',
                          outline: 'none',
                          cursor: 'pointer',
                          transition: 'all 250ms'
                        },
                        pressed: {
                          fill: '#1E3A8A',
                          outline: 'none',
                          transition: 'all 250ms'
                        }
                      }}
                      onMouseEnter={(evt) => {
                        handleMouseMove(evt, countryName, visits || 0);
                      }}
                      onMouseMove={(evt) => {
                        handleMouseMove(evt, countryName, visits || 0);
                      }}
                      onMouseLeave={() => {
                        setTooltip(null);
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {tooltip && (
          <div
            className="absolute bg-white px-2 py-1 rounded-md shadow-md text-sm z-10"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y - 40}px`,
              pointerEvents: 'none'
            }}
          >
            <div className="font-medium">{tooltip.name}</div>
            <div className="text-gray-600">{tooltip.visits.toLocaleString()} visits</div>
          </div>
        )}
      </div>
    </div>
  );
}