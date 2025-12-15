import { useState } from "react";
import { MapPin, ChevronDown, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Location {
  id: string;
  name: string;
  country: string;
  flag: string;
  latency: number;
}

const locations: Location[] = [
  { id: "auto", name: "Auto", country: "Fastest", flag: "⚡", latency: 0 },
  { id: "us", name: "New York", country: "United States", flag: "🇺🇸", latency: 45 },
  { id: "uk", name: "London", country: "United Kingdom", flag: "🇬🇧", latency: 32 },
  { id: "de", name: "Frankfurt", country: "Germany", flag: "🇩🇪", latency: 28 },
  { id: "jp", name: "Tokyo", country: "Japan", flag: "🇯🇵", latency: 120 },
  { id: "sg", name: "Singapore", country: "Singapore", flag: "🇸🇬", latency: 85 },
];

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (locationId: string) => void;
}

const LocationSelector = ({ selectedLocation, onLocationChange }: LocationSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selected = locations.find(l => l.id === selectedLocation) || locations[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
          "glass border",
          isOpen ? "border-primary box-glow" : "border-border/50 hover:border-primary/50"
        )}
      >
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-xl">{selected.flag}</span>
        <div className="text-left">
          <p className="text-sm font-medium text-foreground">{selected.name}</p>
          <p className="text-xs text-muted-foreground">{selected.country}</p>
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground transition-transform duration-300",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 p-2 rounded-xl glass border border-border/50 z-50 animate-in fade-in slide-in-from-top-2">
          {locations.map((location) => (
            <button
              key={location.id}
              onClick={() => {
                onLocationChange(location.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                selectedLocation === location.id
                  ? "bg-primary/20 text-foreground"
                  : "hover:bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="text-lg">{location.flag}</span>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{location.name}</p>
                <p className="text-xs opacity-70">{location.country}</p>
              </div>
              {location.id !== "auto" && (
                <div className="flex items-center gap-1 text-xs">
                  <Zap className="w-3 h-3 text-primary" />
                  <span className={cn(
                    location.latency < 50 ? "text-cyber-green" :
                    location.latency < 100 ? "text-primary" : "text-accent"
                  )}>
                    {location.latency}ms
                  </span>
                </div>
              )}
              {selectedLocation === location.id && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
