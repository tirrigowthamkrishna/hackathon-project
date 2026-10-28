// OpenStreetMap & Leaflet Integration Helper
// Provides dynamic geofencing, custom pins, and pickup-route visualizer

export function initMap(containerId, centerLat, centerLng, zoom = 13) {
  if (typeof window.L === 'undefined') {
    console.error('Leaflet is not loaded');
    return null;
  }

  const container = document.getElementById(containerId);
  if (!container) return null;

  if (container._leaflet_id) {
    delete container._leaflet_id;
  }

  const map = window.L.map(containerId, {
    zoomControl: false,
    scrollWheelZoom: true
  }).setView([centerLat, centerLng], zoom);

  window.L.control.zoom({ position: 'bottomright' }).addTo(map);

  // CartoDB Voyager tiles for warm, elegant cartography
  window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  return map;
}

export function createDonorIcon(category, isUrgent = false) {
  const bgClass = isUrgent ? '#E1372D' : '#D97706';
  const pulseHtml = isUrgent ? `<div class="absolute -inset-1 rounded-full bg-red-500 animate-ping opacity-60"></div>` : '';

  return window.L.divIcon({
    className: 'custom-donor-pin',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-110">
        ${pulseHtml}
        <div style="background-color: ${bgClass}; color: white; width: 38px; height: 38px; border-radius: 9999px; display: flex; align-items: center; justify-center: center; box-shadow: 0 4px 10px rgba(0,0,0,0.25); border: 2.5px solid white;">
          <svg style="width: 20px; height: 20px; margin: auto;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });
}

export function createReceiverIcon() {
  return window.L.divIcon({
    className: 'custom-receiver-pin',
    html: `
      <div class="relative flex items-center justify-center">
        <div style="background-color: #1F2421; color: #FBF9F4; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-center: center; box-shadow: 0 6px 14px rgba(0,0,0,0.3); border: 2.5px solid #E5A93C;">
          <svg style="width: 24px; height: 24px; margin: auto;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <div class="absolute -bottom-6 bg-stone-900 text-stone-100 text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
          St. Jude Shelter (You)
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  });
}

export function drawPickupRoute(map, startLat, startLng, endLat, endLng) {
  if (!map || typeof window.L === 'undefined') return null;

  // Waypoints with curved midpoint to simulate realistic street corridor
  const midLat = (startLat + endLat) / 2 + 0.003;
  const midLng = (startLng + endLng) / 2 - 0.004;
  const routePoints = [
    [startLat, startLng],
    [midLat, midLng],
    [endLat, endLng]
  ];

  const polyline = window.L.polyline(routePoints, {
    color: '#E1372D',
    weight: 4,
    opacity: 0.85,
    dashArray: '8, 8',
    lineCap: 'round',
    lineJoin: 'round'
  }).addTo(map);

  map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
  return polyline;
}
