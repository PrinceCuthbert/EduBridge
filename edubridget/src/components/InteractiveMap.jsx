import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Phone, Mail, Clock, User, Building2 } from "lucide-react";
import { renderToString } from "react-dom/server";

// Fix for default marker icons in Leaflet with Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

/**
 * Custom marker icon using EduBridge brand colors
 * Returns a Leaflet DivIcon with custom styling
 */
const createCustomIcon = (isHeadOffice = false) => {
  const iconHtml = renderToString(
    <div className="relative">
      <div
        className={`w-10 h-10 rounded-full ${isHeadOffice ? "bg-accent" : "bg-primary"} 
                    shadow-lg flex items-center justify-center border-4 border-white
                    transform -translate-y-1/2`}
        style={{ position: "relative" }}>
        <MapPin className="h-5 w-5 text-white" fill="white" />
      </div>
      {isHeadOffice && (
        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
          <Building2 className="h-3 w-3 text-accent" />
        </div>
      )}
    </div>,
  );

  return L.divIcon({
    html: iconHtml,
    className: "custom-marker-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

/**
 * Component to handle map flying and auto-popup
 * Separated for clean architecture
 */
const MapController = ({ selectedBranch, branches, onMarkerClick }) => {
  const map = useMap();
  const markersRef = useRef({});

  useEffect(() => {
    if (selectedBranch && selectedBranch.coordinates) {
      const { lat, lng } = selectedBranch.coordinates;

      // Smooth fly to selected branch
      map.flyTo([lat, lng], 13, {
        duration: 1.5,
        easeLinearity: 0.25,
      });

      // Auto-open popup after flight completes
      const timeoutId = setTimeout(() => {
        const marker = markersRef.current[selectedBranch.country];
        if (marker) {
          marker.openPopup();
        }
      }, 1600); // Slightly after animation completes

      // Cleanup timeout to prevent memory leak
      return () => clearTimeout(timeoutId);
    }
  }, [selectedBranch, map]);

  return (
    <>
      {branches.map((branch) => (
        <Marker
          key={branch.country}
          position={[branch.coordinates.lat, branch.coordinates.lng]}
          icon={createCustomIcon(branch.isHeadOffice)}
          ref={(ref) => {
            if (ref) markersRef.current[branch.country] = ref;
          }}
          eventHandlers={{
            click: () => {
              onMarkerClick(branch);
            },
          }}>
          <Popup className="custom-popup" maxWidth={300}>
            <div className="p-2">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
                <span className="text-2xl">{branch.flag}</span>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    {branch.city}
                  </h3>
                  <p className="text-xs text-slate-500">{branch.country}</p>
                </div>
                {branch.isHeadOffice && (
                  <div className="ml-auto bg-accent/10 text-accent px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    HQ
                  </div>
                )}
              </div>

              {/* Essential Info Only - SIMPLIFIED */}
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{branch.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <a
                    href={`tel:${branch.phone}`}
                    className="text-primary hover:underline">
                    {branch.phone}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <a
                    href={`mailto:${branch.email}`}
                    className="text-primary hover:underline text-xs">
                    {branch.email}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-slate-700">{branch.hours}</span>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

/**
 * Main InteractiveMap Component
 * TypeScript-compatible, scalable architecture
 * Now with Satellite View toggle!
 */
const InteractiveMap = ({
  branches,
  selectedBranch,
  onMarkerClick,
  defaultCenter = { lat: -1.9441, lng: 30.0619 }, // East Africa center
  defaultZoom = 5,
  className = "",
}) => {
  // Smart center logic: selected branch or East Africa region
  const mapCenter = selectedBranch?.coordinates
    ? [selectedBranch.coordinates.lat, selectedBranch.coordinates.lng]
    : [defaultCenter.lat, defaultCenter.lng];

  const initialZoom = selectedBranch ? 13 : defaultZoom;

  return (
    <div className={`relative ${className}`}>
      {/* Loading skeleton overlay */}
      <div className="absolute inset-0 bg-slate-100 animate-pulse rounded-2xl z-0">
        <div className="flex items-center justify-center h-full">
          <div className="text-slate-400 flex items-center gap-2">
            <MapPin className="h-5 w-5 animate-bounce" />
            <span className="text-sm font-medium">Locating branches...</span>
          </div>
        </div>
      </div>

      {/* Map Container - Landscape orientation for mobile */}
      <MapContainer
        center={mapCenter}
        zoom={initialZoom}
        scrollWheelZoom={true}
        className="h-full w-full rounded-2xl shadow-lift z-10 relative"
        style={{ minHeight: "450px" }}>
        {/* Layer Control - Toggle between Street and Satellite */}
        <LayersControl position="topright">
          {/* Street Map (Default) */}
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* Satellite View */}
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <MapController
          selectedBranch={selectedBranch}
          branches={branches}
          onMarkerClick={onMarkerClick}
        />
      </MapContainer>

      {/* Custom CSS for popups */}
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 16px;
          padding: 0;
          box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 0 15px -5px rgba(15, 76, 129, 0.08);
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
        
        .custom-marker-icon {
          background: transparent;
          border: none;
        }
        
        /* Smooth transitions */
        .leaflet-marker-pane img {
          transition: transform 0.3s ease, filter 0.3s ease;
        }
        
        .leaflet-marker-pane img:hover {
          transform: scale(1.1);
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
        }
      `}</style>
    </div>
  );
};

export default InteractiveMap;
