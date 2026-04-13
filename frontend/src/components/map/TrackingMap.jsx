import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom bus icon
function createBusIcon(status) {
  const colors = {
    running: '#34C759',
    delayed: '#FF9500',
    stopped: '#FF3B30',
    maintenance: '#8E8E93',
  };
  const color = colors[status] || '#007AFF';

  return L.divIcon({
    className: 'bus-marker-custom',
    html: `
      <div style="
        width: 36px; height: 36px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        animation: marker-pulse 2s infinite;
      ">🚌</div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

// Component to handle map recenter
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true, duration: 1 });
    }
  }, [center, map]);
  return null;
}

export default function TrackingMap({ locations, buses, height = '500px', selectedBusId }) {
  const [center, setCenter] = useState([17.4400, 78.4200]); // Hyderabad default
  const markersRef = useRef({});

  // Recenter map when a bus is selected
  useEffect(() => {
    if (selectedBusId && locations[selectedBusId]) {
      const loc = locations[selectedBusId];
      setCenter([loc.latitude, loc.longitude]);
    }
  }, [selectedBusId, locations]);

  // Build route lines from buses data
  const routeLines = {};
  if (buses) {
    buses.forEach((bus) => {
      if (bus.route_points && bus.route_points.length > 1) {
        routeLines[bus.id] = bus.route_points.map((p) => [p.latitude, p.longitude]);
      }
    });
  }

  return (
    <div className="map-container" style={{ height }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} />

        {/* Route polylines */}
        {Object.entries(routeLines).map(([busId, points]) => (
          <Polyline
            key={`route-${busId}`}
            positions={points}
            color="var(--accent)"
            weight={3}
            opacity={0.5}
            dashArray="8 8"
          />
        ))}

        {/* Bus markers */}
        {Object.values(locations).map((loc) => (
          <Marker
            key={loc.bus_id}
            position={[loc.latitude, loc.longitude]}
            icon={createBusIcon(loc.status)}
          >
            <Popup>
              <div className="bus-marker-popup">
                <h3>Bus {loc.bus_number}</h3>
                <p>{loc.route_name}</p>
                <p style={{ textTransform: 'capitalize' }}>
                  Status: <strong>{loc.status}</strong>
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Bus stop markers from bus data */}
        {buses?.map((bus) =>
          bus.stops?.map((stop) => (
            <Marker
              key={`stop-${bus.id}-${stop.id}`}
              position={[stop.latitude, stop.longitude]}
              icon={L.divIcon({
                className: 'stop-marker',
                html: `<div style="
                  width: 12px; height: 12px;
                  background: white;
                  border: 2px solid var(--accent, #007AFF);
                  border-radius: 50%;
                  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
                "></div>`,
                iconSize: [12, 12],
                iconAnchor: [6, 6],
              })}
            >
              <Popup>
                <div className="bus-marker-popup">
                  <h3>{stop.stop_name}</h3>
                  <p>Bus {bus.bus_number}</p>
                  {stop.estimated_time && <p>ETA: {stop.estimated_time}</p>}
                </div>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>

      <style>{`
        @keyframes marker-pulse {
          0%, 100% { box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 2px 16px rgba(0,0,0,0.4), 0 0 24px rgba(0,122,255,0.2); }
        }
      `}</style>
    </div>
  );
}
