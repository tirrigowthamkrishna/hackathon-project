
// LastBite Web Application - Standalone Unified Bundle
(function() {
  'use strict';

  // --- MOCK DATA ---
  // LastBite Master Mock Dataset & Public Reference Constants
// Aligned with UNEP Food Waste Index, Open Food Facts, and OpenStreetMap

const PUBLIC_BENCHMARKS = {
  // UNEP Food Waste Index benchmarks
  kgPerMeal: 0.42, // Average edible portion weight (420g)
  co2ePerKgFood: 2.5, // kg CO2e greenhouse gas avoided per kg edible food saved
  waterPerKgFood: 1000, // Litres of freshwater conserved per kg food saved
  economicValuePerKg: 180, // Estimated value in local currency (INR ₹ / units)
  unepGlobalWastedTonnes: 1050000000, // 1.05 billion tonnes per year globally
};

const STORAGE_PRESETS = [
  { id: 'Ambient', label: 'Ambient (Room Temp)', icon: 'box', tempRange: '18°C - 24°C', safeLimitHours: 8, color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'Refrigerated', label: 'Cold Chain / Chilled', icon: 'thermometer-snowflake', tempRange: '1°C - 4°C', safeLimitHours: 48, color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'Hot-Hold', label: 'Hot-Hold Safe', icon: 'flame', tempRange: '60°C - 75°C', safeLimitHours: 4, color: 'bg-red-100 text-red-800 border-red-300' },
  { id: 'Frozen', label: 'Deep Frozen', icon: 'snowflake', tempRange: '-18°C or below', safeLimitHours: 72, color: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
];

const CATEGORIES = [
  'Prepared Meals',
  'Bakery & Pastries',
  'Fresh Produce',
  'Dairy & Eggs',
  'Pantry & Grains',
  'Beverages'
];

const CURRENT_RECEIVER = {
  id: 'rec_st_jude',
  name: 'St. Jude Shelter & Community Kitchen',
  type: 'Shelter & Kitchen Hub',
  address: '14 Richmond Road, Central District',
  lat: 12.9698,
  lng: 77.6015,
  maxRadiusKm: 6.0,
  storageCapabilities: ['Ambient', 'Refrigerated', 'Hot-Hold'],
  vehicleType: 'Refrigerated Van + 2 Cargo E-Bikes',
  capacityKg: 120,
  servingsPerDay: 450,
  contact: '+91 98450 11234',
  director: 'Sister Margaret / Rahul M.'
};

const DONORS = [
  {
    id: 'donor_marcos',
    name: "Marco's Artisan Bakery & Cafe",
    type: 'Artisan Bakery',
    address: '100 Feet Rd, Indiranagar',
    lat: 12.9784,
    lng: 77.6408,
    phone: '+91 80 4123 9988',
    manager: 'Marco D\'Souza',
    rating: 4.9,
    verifiedHandovers: 84
  },
  {
    id: 'donor_regency',
    name: 'Grand Regency Banquets & Caterers',
    type: 'Commercial Catering',
    address: 'Residency Rd, Central District',
    lat: 12.9712,
    lng: 77.6080,
    phone: '+91 80 2299 4411',
    manager: 'Chef Vikram Seth',
    rating: 4.8,
    verifiedHandovers: 142
  },
  {
    id: 'donor_farmdirect',
    name: 'FarmDirect Organic Fresh Mart',
    type: 'Produce Supermarket',
    address: '12th Main, 5th Block Koramangala',
    lat: 12.9352,
    lng: 77.6245,
    phone: '+91 80 6712 3344',
    manager: 'Ananya Sharma',
    rating: 4.9,
    verifiedHandovers: 98
  },
  {
    id: 'donor_greenvalley',
    name: 'Green Valley Farm Direct',
    type: 'Dairy & Poultry Depot',
    address: 'MG Road Metro Station Arcade',
    lat: 12.9756,
    lng: 77.6067,
    phone: '+91 80 2558 7722',
    manager: 'Senthil Kumar',
    rating: 4.7,
    verifiedHandovers: 65
  },
  {
    id: 'donor_citycanteen',
    name: 'City Harvest Corporate Canteen',
    type: 'Community Kitchen / Canteen',
    address: 'Embassy GolfLinks, Domlur',
    lat: 12.9482,
    lng: 77.6498,
    phone: '+91 80 4910 8800',
    manager: 'Pooja Iyer',
    rating: 4.9,
    verifiedHandovers: 210
  }
];

// Helper to generate ISO time offset from now
const now = Date.now();
const minutesFromNow = (mins) => new Date(now + mins * 60 * 1000).toISOString();
const minutesAgo = (mins) => new Date(now - mins * 60 * 1000).toISOString();

const INITIAL_LISTINGS = [
  {
    id: 'LB-101',
    title: 'Hot Catering Trays: Vegetable Lasagna & Baked Parmigiana',
    category: 'Prepared Meals',
    donorId: 'donor_regency',
    donorName: 'Grand Regency Banquets & Caterers',
    donorType: 'Commercial Catering',
    donorAddress: 'Residency Rd, Central District',
    lat: 12.9712,
    lng: 77.6080,
    quantity: 36,
    unit: 'portions',
    weightKg: 15.5,
    storageCondition: 'Hot-Hold',
    preparedAt: minutesAgo(90),
    expiresAt: minutesFromNow(105), // ~1h 45m left
    pickupWindow: {
      start: 'Immediate',
      end: '16:30 today'
    },
    packaging: 'Foil Catering Trays with Heat-Seal Lids',
    dietary: ['Vegetarian'],
    allergenAlert: 'Contains Dairy, Gluten',
    status: 'available', // 'available' | 'claimed' | 'in_transit' | 'verified_collected' | 'expired'
    verificationCode: 'LB-4821',
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&auto=format&fit=crop&q=80',
    notes: 'Hot-held in commercial food warmers at 68°C. Freshly prepared for corporate buffet lunch, strictly unserved untouched surplus.',
    claimedBy: null,
    events: [
      { type: 'LISTED', timestamp: minutesAgo(90), actor: 'Chef Vikram Seth', details: 'Surplus listed with 36 portions in thermal pans' }
    ]
  },
  {
    id: 'LB-102',
    title: 'Freshly Baked Ciabatta Rolls, Brioche & Baguettes',
    category: 'Bakery & Pastries',
    donorId: 'donor_marcos',
    donorName: "Marco's Artisan Bakery & Cafe",
    donorType: 'Artisan Bakery',
    donorAddress: '100 Feet Rd, Indiranagar',
    lat: 12.9784,
    lng: 77.6408,
    quantity: 65,
    unit: 'pieces',
    weightKg: 22.0,
    storageCondition: 'Ambient',
    preparedAt: minutesAgo(240),
    expiresAt: minutesFromNow(210), // ~3.5h left
    pickupWindow: {
      start: '15:00',
      end: '18:30 today'
    },
    packaging: 'Food-grade breathable paper bags in cardboard crates',
    dietary: ['Vegetarian', 'Vegan'],
    allergenAlert: 'Wheat/Gluten. Sesame on select rolls.',
    status: 'available',
    verificationCode: 'LB-7914',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    notes: 'Morning artisan bake, golden crust, soft crumb. Must be distributed today or frozen for toasting.',
    claimedBy: null,
    events: [
      { type: 'LISTED', timestamp: minutesAgo(240), actor: "Marco D'Souza", details: 'End-of-shift bakery surplus packaged in 3 crates' }
    ]
  },
  {
    id: 'LB-103',
    title: 'Farm Fresh Organic Vegetable Crate (Broccoli, Vine Tomatoes, Sweet Peppers)',
    category: 'Fresh Produce',
    donorId: 'donor_farmdirect',
    donorName: 'FarmDirect Organic Fresh Mart',
    donorType: 'Produce Supermarket',
    donorAddress: '12th Main, 5th Block Koramangala',
    lat: 12.9352,
    lng: 77.6245,
    quantity: 28,
    unit: 'kg',
    weightKg: 28.0,
    storageCondition: 'Refrigerated',
    preparedAt: minutesAgo(360),
    expiresAt: minutesFromNow(1200), // ~20h left
    pickupWindow: {
      start: '14:30',
      end: '20:00 today'
    },
    packaging: 'Wooden farm crates + ventilated liners',
    dietary: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    allergenAlert: 'None',
    status: 'available',
    verificationCode: 'LB-2309',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=80',
    notes: 'Grade A organic harvest. Crisp broccoli crowns, ripe red vine tomatoes, yellow bell peppers. Stored in cold walk-in at 3°C.',
    claimedBy: null,
    events: [
      { type: 'LISTED', timestamp: minutesAgo(360), actor: 'Ananya Sharma', details: 'Surplus produce crate marked for community rescue' }
    ]
  },
  {
    id: 'LB-104',
    title: 'Grade A Large Brown Farm Eggs (12 Dozen / 144 Eggs)',
    category: 'Dairy & Eggs',
    donorId: 'donor_greenvalley',
    donorName: 'Green Valley Farm Direct',
    donorType: 'Dairy & Poultry Depot',
    donorAddress: 'MG Road Metro Station Arcade',
    lat: 12.9756,
    lng: 77.6067,
    quantity: 12,
    unit: 'cartons',
    weightKg: 8.5,
    storageCondition: 'Refrigerated',
    preparedAt: minutesAgo(600),
    expiresAt: minutesFromNow(2160), // ~36h left
    pickupWindow: {
      start: 'Immediate',
      end: '19:00 today'
    },
    packaging: 'Molded pulp cartons (12-pack) stacked in secure crate',
    dietary: ['Vegetarian', 'Gluten-Free'],
    allergenAlert: 'Contains Egg',
    status: 'available',
    verificationCode: 'LB-6155',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&auto=format&fit=crop&q=80',
    notes: 'Free-range organic brown eggs. Perfect condition, passed candling inspection, stored at 4°C.',
    claimedBy: null,
    events: [
      { type: 'LISTED', timestamp: minutesAgo(600), actor: 'Senthil Kumar', details: 'Inventory surplus moved to rescue exchange' }
    ]
  },
  {
    id: 'LB-105',
    title: 'Assorted Danish Pastries, Cinnamon Swirls & Choc Chip Cookies',
    category: 'Bakery & Pastries',
    donorId: 'donor_marcos',
    donorName: "Marco's Artisan Bakery & Cafe",
    donorType: 'Artisan Bakery',
    donorAddress: '100 Feet Rd, Indiranagar',
    lat: 12.9784,
    lng: 77.6408,
    quantity: 48,
    unit: 'pieces',
    weightKg: 7.2,
    storageCondition: 'Ambient',
    preparedAt: minutesAgo(300),
    expiresAt: minutesFromNow(180), // ~3h left
    pickupWindow: {
      start: '16:00',
      end: '18:00'
    },
    packaging: 'Food boxes with wax paper liners',
    dietary: ['Vegetarian'],
    allergenAlert: 'Wheat, Dairy, Eggs, Tree Nuts',
    status: 'claimed',
    verificationCode: 'LB-8832',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop&q=80',
    notes: 'Delicate breakfast pastries and soft-batch cookies, unserved morning display items.',
    claimedBy: {
      id: 'rec_hope',
      name: 'Hope Meals Children Foundation',
      etaMinutes: 18,
      requestedAt: minutesAgo(20)
    },
    events: [
      { type: 'LISTED', timestamp: minutesAgo(300), actor: "Marco D'Souza", details: 'Listing published' },
      { type: 'CLAIMED', timestamp: minutesAgo(20), actor: 'Hope Meals Dispatch', details: 'Claim accepted; driver en route (ETA 18m)' }
    ]
  },
  {
    id: 'LB-106',
    title: 'Cooked Steamed Basmati Rice, Yellow Dal Tadka & Mix Veg Poriyal',
    category: 'Prepared Meals',
    donorId: 'donor_citycanteen',
    donorName: 'City Harvest Corporate Canteen',
    donorType: 'Community Kitchen / Canteen',
    donorAddress: 'Embassy GolfLinks, Domlur',
    lat: 12.9482,
    lng: 77.6498,
    quantity: 55,
    unit: 'portions',
    weightKg: 24.0,
    storageCondition: 'Hot-Hold',
    preparedAt: minutesAgo(210),
    expiresAt: minutesAgo(30), // Was collected 45 mins ago before expiry
    pickupWindow: {
      start: '13:30',
      end: '14:45'
    },
    packaging: 'Insulated stainless thermal containers',
    dietary: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal'],
    allergenAlert: 'None',
    status: 'verified_collected',
    verificationCode: 'LB-3341',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    notes: 'Nutritious balanced lunch. Maintained above 65°C throughout.',
    claimedBy: {
      id: 'rec_st_jude',
      name: 'St. Jude Shelter & Community Kitchen',
      etaMinutes: 0,
      requestedAt: minutesAgo(90)
    },
    collectedAt: minutesAgo(40),
    events: [
      { type: 'LISTED', timestamp: minutesAgo(210), actor: 'Pooja Iyer', details: 'Surplus lunch trays registered' },
      { type: 'CLAIMED', timestamp: minutesAgo(90), actor: 'St. Jude Kitchen Driver', details: 'Claim accepted' },
      { type: 'IN_TRANSIT', timestamp: minutesAgo(70), actor: 'St. Jude Kitchen Driver', details: 'Van in transit to Domlur' },
      { type: 'VERIFIED_COLLECTED', timestamp: minutesAgo(40), actor: 'Sister Margaret / Chef Pooja', details: 'Handover code LB-3341 verified! Food safely received and served.' }
    ]
  }
];


  // --- ENGINE ---
  // LastBite Smart Matching & Auditing Engine
// Implements 5-Factor Matching and UNEP Food Waste Index Calculators

/**
 * Calculates Haversine distance between two coordinates in Kilometers
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Estimates city transit travel time in minutes based on distance
 */
function estimateTransitMinutes(distanceKm) {
  // Average urban speed ~ 20 km/h + 5 min pickup buffer
  return Math.max(10, Math.round((distanceKm / 22) * 60) + 5);
}

/**
 * 5-Factor Smart Matching Algorithm
 * Returns Match Object with overall score (0-100) and factor breakdowns
 */
function calculateSmartMatch(listing, receiver) {
  const distanceKm = calculateDistanceKm(
    listing.lat,
    listing.lng,
    receiver.lat,
    receiver.lng
  );

  const transitMins = estimateTransitMinutes(distanceKm);
  const msRemaining = new Date(listing.expiresAt).getTime() - Date.now();
  const minsRemaining = Math.max(0, Math.round(msRemaining / (60 * 1000)));

  // Factor 1: Distance (Travel Radius) - Weight: 30%
  const radiusRatio = distanceKm / (receiver.maxRadiusKm || 6.0);
  const distanceScore = radiusRatio > 1 ? 0 : Math.max(0, Math.round((1 - radiusRatio) * 100));
  const isWithinRadius = distanceKm <= (receiver.maxRadiusKm || 6.0);

  // Factor 2: Remaining Shelf-life vs Transit time - Weight: 25%
  // Needs at least transit time + 30 min distribution buffer
  const bufferNeeded = transitMins + 30;
  let shelfLifeScore = 100;
  let hasSafeShelfLife = true;

  if (minsRemaining <= transitMins) {
    shelfLifeScore = 0;
    hasSafeShelfLife = false;
  } else if (minsRemaining < bufferNeeded) {
    shelfLifeScore = 35;
  } else if (minsRemaining < 120) {
    shelfLifeScore = 80; // High urgency but feasible
  } else {
    shelfLifeScore = 100;
  }

  // Factor 3: Storage Condition Compatibility - Weight: 20%
  const storageCompatible = receiver.storageCapabilities.includes(listing.storageCondition);
  const storageScore = storageCompatible ? 100 : 15;

  // Factor 4: Quantity vs Receiver Capacity - Weight: 15%
  const capacityCompatible = (listing.weightKg || 10) <= (receiver.capacityKg || 100);
  const capacityScore = capacityCompatible ? 100 : 40;

  // Factor 5: Pickup Window Overlap - Weight: 10%
  const pickupWindowScore = minsRemaining > transitMins ? 100 : 30;

  // Overall Weighted Score
  let overall = Math.round(
    distanceScore * 0.30 +
    shelfLifeScore * 0.25 +
    storageScore * 0.20 +
    capacityScore * 0.15 +
    pickupWindowScore * 0.10
  );

  // Hard penalty if out of radius or expired
  if (!isWithinRadius) overall = Math.min(overall, 45);
  if (!hasSafeShelfLife) overall = Math.min(overall, 20);

  return {
    overall: Math.max(0, Math.min(99, overall)),
    distanceKm,
    transitMins,
    minsRemaining,
    isWithinRadius,
    hasSafeShelfLife,
    storageCompatible,
    capacityCompatible,
    scores: {
      distance: distanceScore,
      shelfLife: shelfLifeScore,
      storage: storageScore,
      capacity: capacityScore,
      pickupWindow: pickupWindowScore
    },
    reasons: [
      isWithinRadius ? `${distanceKm} km away (within ${receiver.maxRadiusKm} km limit)` : `Outside current ${receiver.maxRadiusKm} km radius (${distanceKm} km)`,
      storageCompatible ? `${listing.storageCondition} storage capability verified` : `Requires ${listing.storageCondition} handling equipment`,
      minsRemaining > 120 ? `${Math.round(minsRemaining / 60)}h shelf-life remaining` : `Urgent: ${minsRemaining}m before safe expiry`,
      capacityCompatible ? `Fits cargo capacity (${listing.weightKg} kg vs ${receiver.capacityKg} kg max)` : `Exceeds current load buffer`
    ]
  };
}

/**
 * Calculates audited impact numbers according to UNEP Food Waste Index
 */
function calculateDiversionMetrics(listings) {
  let totalListedKg = 0;
  let totalRescuedKg = 0;
  let verifiedKg = 0;
  let inTransitKg = 0;
  let expiredKg = 0;
  let totalListingsCount = listings.length;
  let verifiedCount = 0;
  let activeCount = 0;

  const now = Date.now();

  listings.forEach((item) => {
    const kg = Number(item.weightKg) || 10;
    totalListedKg += kg;

    const isPastExpiry = new Date(item.expiresAt).getTime() < now;

    if (item.status === 'verified_collected') {
      verifiedKg += kg;
      totalRescuedKg += kg;
      verifiedCount++;
    } else if (item.status === 'claimed' || item.status === 'in_transit') {
      inTransitKg += kg;
      totalRescuedKg += kg;
      activeCount++;
    } else if (item.status === 'available') {
      if (isPastExpiry) {
        expiredKg += kg;
      } else {
        activeCount++;
      }
    } else if (item.status === 'expired') {
      expiredKg += kg;
    }
  });

  const mealsSaved = Math.round(totalRescuedKg / 0.42);
  const mealsVerified = Math.round(verifiedKg / 0.42);
  const co2eAvertedKg = Math.round(totalRescuedKg * 2.5 * 10) / 10;
  const waterSavedLitres = Math.round(totalRescuedKg * 1000);
  const economicRescueValue = Math.round(totalRescuedKg * 180);
  const diversionRate = totalListedKg > 0 ? Math.round((totalRescuedKg / totalListedKg) * 100) : 0;

  return {
    totalListedKg: Math.round(totalListedKg * 10) / 10,
    totalRescuedKg: Math.round(totalRescuedKg * 10) / 10,
    verifiedKg: Math.round(verifiedKg * 10) / 10,
    inTransitKg: Math.round(inTransitKg * 10) / 10,
    expiredKg: Math.round(expiredKg * 10) / 10,
    mealsSaved,
    mealsVerified,
    co2eAvertedKg,
    waterSavedLitres,
    economicRescueValue,
    diversionRate,
    totalListingsCount,
    verifiedCount,
    activeCount
  };
}

/**
 * Format remaining time nicely as HH:MM:SS
 */
function formatTimeRemaining(expiresAt) {
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (diffMs <= 0) {
    return { text: 'EXPIRED', urgent: true, critical: true, hours: 0, mins: 0, secs: 0 };
  }
  const totalSecs = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  const pad = (n) => String(n).padStart(2, '0');
  const text = hours > 0 ? `${hours}h ${pad(mins)}m ${pad(secs)}s` : `${pad(mins)}m ${pad(secs)}s`;

  return {
    text,
    hours,
    mins,
    secs,
    urgent: hours < 2,
    critical: hours === 0 && mins < 45
  };
}


  // --- MAP HELPER ---
  // OpenStreetMap & Leaflet Integration Helper
// Provides dynamic geofencing, custom pins, and pickup-route visualizer

function initMap(containerId, centerLat, centerLng, zoom = 13) {
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

function createDonorIcon(category, isUrgent = false) {
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

function createReceiverIcon() {
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

function drawPickupRoute(map, startLat, startLng, endLat, endLng) {
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


  // --- APP LOGIC ---
  





// Application State
class LastBiteApp {
  constructor() {
    this.storageKey = 'lastbite_state_v1';
    this.listings = this.loadListings();
    this.currentRole = 'receiver'; // 'receiver' | 'donor' | 'auditor' | 'engine'
    this.activeTab = 'feed'; // 'feed' | 'map'
    this.selectedCategory = 'all';
    this.selectedStorage = 'all';
    this.maxRadiusKm = 6.0;
    this.onlyWithinRadius = true;
    this.sortBy = 'urgency'; // 'urgency' | 'match' | 'distance' | 'quantity'
    this.searchQuery = '';
    this.selectedListing = null;
    this.activeModal = null;
    this.verifyingItem = null;
    this.claimingItem = null;

    // Map instance & layers
    this.map = null;
    this.markersGroup = null;
    this.radiusCircle = null;
    this.routeLine = null;

    // Simulator engine state
    this.simDistance = 2.4;
    this.simShelfLifeMins = 105;
    this.simStorage = 'Hot-Hold';
    this.simWeightKg = 18;

    this.init();
  }

  loadListings() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load from localStorage, using initial dataset');
    }
    return JSON.parse(JSON.stringify(INITIAL_LISTINGS));
  }

  saveListings() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.listings));
    } catch (e) {
      console.warn('Could not save to localStorage');
    }

    // Sync to backend REST API if running on HTTP
    if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
      fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.listings)
      }).catch(() => {});
    }
  }

  resetDemoData() {
    this.listings = JSON.parse(JSON.stringify(INITIAL_LISTINGS));
    this.saveListings();
    if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
      fetch('/api/reset', { method: 'POST' }).catch(() => {});
    }
    this.render();
    this.showToast('Demo data reset to baseline with 6 verified surplus listings!', 'info');
  }

  async init() {
    this.render();
    this.startCountdownTimer();
    this.setupEventListeners();

    // If running over HTTP server, try syncing with backend REST API
    if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
      try {
        const res = await fetch('/api/listings');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            this.listings = json.data;
            this.render();
          }
        }
      } catch (e) {
        // Fall back gracefully to localStorage
      }
    }
  }

  startCountdownTimer() {
    setInterval(() => {
      this.updateTimersInDOM();
    }, 1000);
  }

  updateTimersInDOM() {
    const timerElements = document.querySelectorAll('[data-expiry-for]');
    timerElements.forEach((el) => {
      const id = el.getAttribute('data-expiry-for');
      const item = this.listings.find((l) => l.id === id);
      if (item) {
        const timeObj = formatTimeRemaining(item.expiresAt);
        el.textContent = timeObj.text;
        if (timeObj.critical) {
          el.className = 'font-mono text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded border border-red-300 animate-pulse';
        } else if (timeObj.urgent) {
          el.className = 'font-mono text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300';
        } else {
          el.className = 'font-mono text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300';
        }
      }
    });
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      if (this.map) this.map.invalidateSize();
    });
  }

  // Action: Claim a listing
  claimListing(listingId, etaMinutes = 20) {
    const item = this.listings.find((l) => l.id === listingId);
    if (!item) return;

    item.status = 'claimed';
    item.claimedBy = {
      id: CURRENT_RECEIVER.id,
      name: CURRENT_RECEIVER.name,
      etaMinutes: etaMinutes,
      requestedAt: new Date().toISOString()
    };
    item.events.unshift({
      type: 'CLAIMED',
      timestamp: new Date().toISOString(),
      actor: CURRENT_RECEIVER.name,
      details: `Claim accepted. Receiver vehicle dispatched with ${etaMinutes} min ETA.`
    });

    this.saveListings();
    this.render();

    this.showCelebration();
    this.showToast(`Claim reserved for ${item.title}! Handover Pass PIN: ${item.verificationCode}`, 'success');

    // Display the Digital Handover Pass modal to confirm reservation
    this.openModal('claim_success', item);
  }

  // Action: Verify Handover (Simulates physical doorstep exchange)
  verifyHandover(listingId, inputCode) {
    const item = this.listings.find((l) => l.id === listingId);
    if (!item) return;

    if (inputCode.trim().toUpperCase() !== item.verificationCode.toUpperCase()) {
      this.showToast('Invalid Handover PIN! Please check receiver digital pass.', 'error');
      return false;
    }

    item.status = 'verified_collected';
    item.collectedAt = new Date().toISOString();
    item.events.unshift({
      type: 'VERIFIED_COLLECTED',
      timestamp: new Date().toISOString(),
      actor: 'Doorstep Food Safety Inspector & Kitchen Manager',
      details: `PIN verified [${item.verificationCode}]. Temperature & safety parameters confirmed. Rescued ${item.weightKg} kg (${Math.round(item.weightKg / 0.42)} meals) diverted from waste!`
    });

    this.saveListings();
    this.closeModal();
    this.render();

    this.showCelebration();
    this.showToast(`Food Rescued & Verified! ${item.weightKg} kg added to audited community meals.`, 'success');
    return true;
  }

  // Action: Add new listing
  addListing(newListingData) {
    const id = `LB-${Math.floor(100 + Math.random() * 900)}`;
    const donor = DONORS[0]; // Default or selected

    const listing = {
      id,
      title: newListingData.title,
      category: newListingData.category,
      donorId: donor.id,
      donorName: donor.name,
      donorType: donor.type,
      donorAddress: donor.address,
      lat: donor.lat,
      lng: donor.lng,
      quantity: Number(newListingData.quantity),
      unit: newListingData.unit,
      weightKg: Number(newListingData.weightKg),
      storageCondition: newListingData.storageCondition,
      preparedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + Number(newListingData.expiryHours) * 60 * 60 * 1000).toISOString(),
      pickupWindow: {
        start: 'Immediate',
        end: `Within ${newListingData.expiryHours} hours`
      },
      packaging: newListingData.packaging || 'Food grade hygienic container',
      dietary: newListingData.dietary || ['Vegetarian'],
      allergenAlert: newListingData.allergenAlert || 'None reported',
      status: 'available',
      verificationCode: `LB-${Math.floor(1000 + Math.random() * 9000)}`,
      image: newListingData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      notes: newListingData.notes || 'Surplus prepared fresh today. Maintained under controlled conditions.',
      claimedBy: null,
      events: [
        {
          type: 'LISTED',
          timestamp: new Date().toISOString(),
          actor: donor.name,
          details: `Listed with ${newListingData.quantity} ${newListingData.unit} (${newListingData.weightKg} kg)`
        }
      ]
    };

    this.listings.unshift(listing);
    this.saveListings();
    this.closeModal();
    this.render();
    this.showToast(`New Surplus Listing published: "${listing.title}"! Hyper-local match engine alerted nearby kitchens.`, 'success');
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const bgColors = {
      success: 'bg-emerald-900 text-emerald-100 border-emerald-500',
      error: 'bg-red-900 text-red-100 border-red-500',
      info: 'bg-stone-900 text-stone-100 border-amber-500'
    };

    toast.className = `fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg border-2 shadow-2xl flex items-center gap-3 transition-all transform translate-y-4 opacity-0 text-sm font-medium ${bgColors[type] || bgColors.info}`;
    toast.innerHTML = `
      <span class="text-base">${type === 'success' ? '✓' : type === 'error' ? '⚠' : '●'}</span>
      <span>${message}</span>
    `;

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('translate-y-4', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  showCelebration() {
    if (typeof window.confetti === 'function') {
      window.confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#E1372D', '#E5A93C', '#16A34A', '#FAF8F5']
      });
    }
  }

  openModal(modalName, data = null) {
    this.activeModal = modalName;
    if (modalName === 'verify') this.verifyingItem = data;
    if (modalName === 'claim' || modalName === 'claim_success') this.claimingItem = data;
    if (modalName === 'audit_details') this.selectedListing = data;
    this.renderModal();
  }

  closeModal() {
    this.activeModal = null;
    this.verifyingItem = null;
    this.claimingItem = null;
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) modalContainer.innerHTML = '';
  }

  // Filtering & Sorting listings
  getFilteredListings() {
    return this.listings.filter((item) => {
      // Role-specific filtering if desired
      if (this.currentRole === 'donor') {
        // In donor mode, show items from this donor or all
        return true;
      }

      // Search Query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        const matchesText =
          item.title.toLowerCase().includes(query) ||
          item.donorName.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          item.storageCondition.toLowerCase().includes(query);
        if (!matchesText) return false;
      }

      // Category filter
      if (this.selectedCategory !== 'all' && item.category !== this.selectedCategory) {
        return false;
      }

      // Storage filter
      if (this.selectedStorage !== 'all' && item.storageCondition !== this.selectedStorage) {
        return false;
      }

      // Radius filter
      if (this.onlyWithinRadius) {
        const dist = calculateDistanceKm(item.lat, item.lng, CURRENT_RECEIVER.lat, CURRENT_RECEIVER.lng);
        if (dist > this.maxRadiusKm) return false;
      }

      return true;
    }).sort((a, b) => {
      if (this.sortBy === 'urgency') {
        return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
      }
      if (this.sortBy === 'match') {
        const matchA = calculateSmartMatch(a, CURRENT_RECEIVER).overall;
        const matchB = calculateSmartMatch(b, CURRENT_RECEIVER).overall;
        return matchB - matchA;
      }
      if (this.sortBy === 'distance') {
        const distA = calculateDistanceKm(a.lat, a.lng, CURRENT_RECEIVER.lat, CURRENT_RECEIVER.lng);
        const distB = calculateDistanceKm(b.lat, b.lng, CURRENT_RECEIVER.lat, CURRENT_RECEIVER.lng);
        return distA - distB;
      }
      if (this.sortBy === 'quantity') {
        return (b.weightKg || 0) - (a.weightKg || 0);
      }
      return 0;
    });
  }

  render() {
    const appEl = document.getElementById('app');
    if (!appEl) return;

    // Capture currently focused element & selection to preserve during live search/filtering
    const activeEl = typeof document !== 'undefined' ? document.activeElement : null;
    const activeId = activeEl && activeEl.id ? activeEl.id : null;
    const selStart = activeEl?.selectionStart;
    const selEnd = activeEl?.selectionEnd;

    const metrics = calculateDiversionMetrics(this.listings);
    const filteredListings = this.getFilteredListings();

    appEl.innerHTML = `
      <!-- Top Running Marquee Banner -->
      <div class="bg-[#1F2421] text-[#FBF9F4] text-xs font-mono font-semibold py-1.5 px-4 overflow-hidden border-b border-stone-800 flex items-center justify-between">
        <div class="flex items-center gap-6 whitespace-nowrap overflow-x-auto no-scrollbar animate-none">
          <span class="flex items-center gap-1.5 text-red-400 font-bold tracking-wider">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block"></span>
            LIVE LASTBITE RESCUE NET
          </span>
          <span class="text-stone-400">★</span>
          <span class="text-amber-300">STOP FOOD WASTE</span>
          <span class="text-stone-400">★</span>
          <span>HYPER-LOCAL MATCHING</span>
          <span class="text-stone-400">★</span>
          <span class="text-emerald-400">AUDITED MEALS SAVED: <strong>${metrics.mealsSaved}</strong></span>
          <span class="text-stone-400">★</span>
          <span>SHELF-LIFE FIRST ALGORITHM</span>
          <span class="text-stone-400">★</span>
          <span class="text-red-300">CO2e AVERTED: <strong>${metrics.co2eAvertedKg} kg</strong></span>
        </div>
        <div class="hidden md:flex items-center gap-3 text-stone-400 text-[11px]">
          <span>City: <strong class="text-white">Bengaluru Central</strong></span>
          <span class="border-l border-stone-700 pl-2">UNEP Benchmark: 420g/Meal</span>
        </div>
      </div>

      <!-- Main Header Navigation -->
      <header class="bg-[#FAF8F5] border-b border-[#EAE4D9] sticky top-0 z-40 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-20">
            <!-- Brand Logo -->
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 cursor-pointer" id="brand-home-btn">
                <div class="bg-[#E1372D] text-white px-3 py-1 rounded-full font-bold text-sm tracking-tight flex items-center gap-1.5 shadow-sm">
                  <span>last</span>
                  <span class="w-2 h-2 rounded-full bg-white inline-block"></span>
                  <span>bite</span>
                </div>
                <div class="hidden sm:block">
                  <h1 class="text-xl font-black tracking-tight text-[#1F2421] leading-none">LastBite</h1>
                  <p class="text-[11px] font-medium text-stone-500 mt-0.5 tracking-tight">Food-Expiry Rescue & Local Surplus Exchange</p>
                </div>
              </div>
            </div>

            <!-- Role Switcher & Mode Badges -->
            <div class="flex items-center gap-2 sm:gap-3">
              <div class="bg-stone-200 p-1 rounded-xl flex items-center text-xs font-semibold shadow-inner">
                <button id="role-receiver-btn" class="px-3 py-1.5 rounded-lg transition-all ${this.currentRole === 'receiver' ? 'bg-[#1F2421] text-white shadow' : 'text-stone-600 hover:text-stone-900'}">
                  <span class="flex items-center gap-1.5">
                    <span>🍲</span>
                    <span>Receiver View</span>
                  </span>
                </button>
                <button id="role-donor-btn" class="px-3 py-1.5 rounded-lg transition-all ${this.currentRole === 'donor' ? 'bg-[#E1372D] text-white shadow' : 'text-stone-600 hover:text-stone-900'}">
                  <span class="flex items-center gap-1.5">
                    <span>🥖</span>
                    <span>Donor Kitchen</span>
                  </span>
                </button>
                <button id="role-auditor-btn" class="px-3 py-1.5 rounded-lg transition-all ${this.currentRole === 'auditor' ? 'bg-[#E5A93C] text-stone-950 shadow' : 'text-stone-600 hover:text-stone-900'}">
                  <span class="flex items-center gap-1.5">
                    <span>📊</span>
                    <span>Audit & Impact</span>
                  </span>
                </button>
                <button id="role-engine-btn" class="px-2.5 py-1.5 rounded-lg transition-all ${this.currentRole === 'engine' ? 'bg-purple-900 text-white shadow' : 'text-stone-600 hover:text-stone-900'}">
                  <span class="flex items-center gap-1">
                    <span>⚡</span>
                    <span>Matching Engine</span>
                  </span>
                </button>
              </div>

              <!-- Quick action buttons -->
              <button id="quick-list-btn" class="bg-[#E1372D] hover:bg-red-700 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-sm transition-all transform hover:-translate-y-0.5">
                <span>+</span>
                <span class="hidden sm:inline">List Surplus</span>
              </button>

              <button id="reset-data-btn" title="Reset Demo Data" class="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Sub-Bar Context Header (Role specific instructions & info) -->
      <div class="bg-white border-b border-[#EAE4D9] py-3 px-4 sm:px-6">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2">
            ${this.renderRoleContextBadge()}
          </div>
          <div class="flex items-center gap-4 text-stone-600 font-medium overflow-x-auto">
            <span class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              Urgent (&lt; 2h expiry)
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Time Sensitive (&lt; 6h)
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Scheduled (&gt; 6h)
            </span>
            <button id="open-benchmarks-btn" class="text-stone-900 underline font-semibold hover:text-[#E1372D]">
              UNEP & OpenFoodFacts Specs ↗
            </button>
          </div>
        </div>
      </div>

      <!-- Main Body Content Area based on currentRole -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        ${this.renderCurrentView(metrics, filteredListings)}
      </main>

      <!-- Modal Container -->
      <div id="modal-container"></div>
    `;

    this.attachDomHandlers();

    // Restore focus and cursor seamlessly
    if (activeId && typeof document !== 'undefined') {
      const restored = document.getElementById(activeId);
      if (restored) {
        restored.focus();
        if (typeof selStart === 'number' && typeof selEnd === 'number' && restored.setSelectionRange) {
          try {
            restored.setSelectionRange(selStart, selEnd);
          } catch (e) {}
        }
      }
    }

    // If map tab active in receiver view, init leaflet
    if (this.currentRole === 'receiver' && this.activeTab === 'map') {
      setTimeout(() => this.setupLeafletMap(filteredListings), 50);
    }
  }

  renderRoleContextBadge() {
    if (this.currentRole === 'receiver') {
      return `
        <span class="bg-stone-900 text-stone-100 font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
          <span>📍</span>
          <span>Logged in as: <strong>${CURRENT_RECEIVER.name}</strong></span>
        </span>
        <span class="text-stone-500">Max Travel Radius: <strong>${this.maxRadiusKm} km</strong> | Cold & Hot storage verified</span>
      `;
    }
    if (this.currentRole === 'donor') {
      return `
        <span class="bg-[#E1372D] text-white font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
          <span>👨‍🍳</span>
          <span>Donor View: <strong>Marco's Bakery & Commercial Donors</strong></span>
        </span>
        <span class="text-stone-500">List surplus food within tight safety windows before end-of-shift</span>
      `;
    }
    if (this.currentRole === 'auditor') {
      return `
        <span class="bg-[#E5A93C] text-stone-950 font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
          <span>📋</span>
          <span>Official Custody & Impact Auditor Ledger</span>
        </span>
        <span class="text-stone-500">Verified status trail from kitchen dispatch to verified community consumption</span>
      `;
    }
    if (this.currentRole === 'engine') {
      return `
        <span class="bg-purple-900 text-white font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
          <span>⚙</span>
          <span>5-Factor Smart Matching Algorithm Playground</span>
        </span>
        <span class="text-stone-500">Real-time weighting of distance, shelf-life, storage condition, capacity & window</span>
      `;
    }
    return '';
  }

  renderCurrentView(metrics, filteredListings) {
    if (this.currentRole === 'auditor') {
      return this.renderAuditorView(metrics);
    }
    if (this.currentRole === 'donor') {
      return this.renderDonorView(metrics);
    }
    if (this.currentRole === 'engine') {
      return this.renderEnginePlaygroundView();
    }
    return this.renderReceiverView(metrics, filteredListings);
  }

  // RECEIVER VIEW
  renderReceiverView(metrics, filteredListings) {
    return `
      <!-- Quick Metric Summary Bar -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div class="bg-white p-4 rounded-2xl border border-[#EAE4D9] shadow-xs">
          <div class="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Available Surpluses Nearby</div>
          <div class="mt-1 flex items-baseline justify-between">
            <span class="text-2xl font-black text-[#1F2421]">${this.listings.filter(i => i.status === 'available').length}</span>
            <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Ready for pickup</span>
          </div>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-[#EAE4D9] shadow-xs">
          <div class="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Urgent Rescues (&lt; 2h)</div>
          <div class="mt-1 flex items-baseline justify-between">
            <span class="text-2xl font-black text-red-600">${this.listings.filter(i => i.status === 'available' && formatTimeRemaining(i.expiresAt).urgent).length}</span>
            <span class="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full animate-pulse">Tight Clock</span>
          </div>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-[#EAE4D9] shadow-xs">
          <div class="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Active Transit Claims</div>
          <div class="mt-1 flex items-baseline justify-between">
            <span class="text-2xl font-black text-amber-600">${this.listings.filter(i => i.status === 'claimed').length}</span>
            <span class="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">En route</span>
          </div>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-[#EAE4D9] shadow-xs">
          <div class="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Audited Meals Saved</div>
          <div class="mt-1 flex items-baseline justify-between">
            <span class="text-2xl font-black text-emerald-700">${metrics.mealsSaved}</span>
            <span class="text-xs font-semibold text-stone-500">${metrics.totalRescuedKg} kg</span>
          </div>
        </div>
      </div>

      <!-- Filters & Controls Bar -->
      <div class="bg-white p-4 rounded-2xl border border-[#EAE4D9] shadow-xs mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <!-- Search & Category Filters -->
          <div class="flex flex-wrap items-center gap-2 flex-1">
            <div class="relative min-w-[200px] flex-1 sm:flex-initial">
              <input
                type="text"
                id="search-input"
                value="${this.searchQuery}"
                placeholder="Search surplus, bakery, lasagna..."
                class="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-[#E1372D]"
              />
              ${this.searchQuery ? `<button id="clear-search-btn" class="absolute right-2.5 top-2 text-stone-400 text-xs">✕</button>` : ''}
            </div>

            <!-- Category Pills -->
            <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button class="filter-category-btn px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${this.selectedCategory === 'all' ? 'bg-[#1F2421] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}" data-category="all">
                All Items
              </button>
              ${CATEGORIES.map(cat => `
                <button class="filter-category-btn px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${this.selectedCategory === cat ? 'bg-[#1F2421] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}" data-category="${cat}">
                  ${cat}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Radius Slider & View Toggle -->
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-2 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-stone-200">
              <span class="text-xs font-bold text-stone-700">Radius:</span>
              <input
                type="range"
                id="radius-slider"
                min="1"
                max="12"
                step="0.5"
                value="${this.maxRadiusKm}"
                class="w-24 accent-[#E1372D] cursor-pointer"
              />
              <span class="text-xs font-mono font-bold text-stone-900 w-12 text-right">${this.maxRadiusKm} km</span>
            </div>

            <!-- Sort dropdown -->
            <select id="sort-select" class="bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 focus:outline-none">
              <option value="urgency" ${this.sortBy === 'urgency' ? 'selected' : ''}>⏳ Urgency: Shortest Shelf-Life</option>
              <option value="match" ${this.sortBy === 'match' ? 'selected' : ''}>★ Smart Match Score</option>
              <option value="distance" ${this.sortBy === 'distance' ? 'selected' : ''}>📍 Nearest Distance</option>
              <option value="quantity" ${this.sortBy === 'quantity' ? 'selected' : ''}>⚖ Largest Quantity</option>
            </select>

            <!-- Feed vs Map toggle -->
            <div class="bg-stone-100 p-1 rounded-xl flex items-center text-xs font-bold">
              <button id="view-feed-btn" class="px-3 py-1.5 rounded-lg transition-all ${this.activeTab === 'feed' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-500 hover:text-stone-900'}">
                Cards
              </button>
              <button id="view-map-btn" class="px-3 py-1.5 rounded-lg transition-all ${this.activeTab === 'map' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-500 hover:text-stone-900'}">
                Map (${filteredListings.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Feed / Map Container -->
      ${this.activeTab === 'feed' ? this.renderListingsGrid(filteredListings) : this.renderMapView(filteredListings)}
    `;
  }

  renderListingsGrid(listings) {
    if (listings.length === 0) {
      return `
        <div class="bg-white rounded-3xl p-12 text-center border border-[#EAE4D9] max-w-lg mx-auto my-8">
          <div class="text-4xl mb-3">🔍</div>
          <h3 class="text-lg font-bold text-stone-900">No surplus matches current filters</h3>
          <p class="text-xs text-stone-500 mt-1">Try expanding your travel radius beyond ${this.maxRadiusKm} km or clearing category filters.</p>
          <button id="reset-filters-btn" class="mt-4 bg-[#E1372D] text-white text-xs font-bold px-4 py-2 rounded-xl">
            Reset Filters
          </button>
        </div>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        ${listings.map((item) => this.renderListingCard(item)).join('')}
      </div>
    `;
  }

  renderListingCard(item) {
    const match = calculateSmartMatch(item, CURRENT_RECEIVER);
    const timeObj = formatTimeRemaining(item.expiresAt);
    const isUrgent = timeObj.urgent;

    // Status color badge
    let statusBadge = '';
    if (item.status === 'claimed') {
      statusBadge = `<span class="bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">🚚 In Transit (${item.claimedBy?.name || 'Claimed'})</span>`;
    } else if (item.status === 'verified_collected') {
      statusBadge = `<span class="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">✓ Rescued & Verified</span>`;
    } else if (isUrgent) {
      statusBadge = `<span class="bg-red-100 text-red-800 border border-red-300 font-bold text-[10px] px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">⚡ URGENT RESCUE</span>`;
    } else {
      statusBadge = `<span class="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">● Available</span>`;
    }

    // Storage badge
    const storageClass =
      item.storageCondition === 'Hot-Hold' ? 'bg-red-50 text-red-700 border-red-200' :
      item.storageCondition === 'Refrigerated' ? 'bg-blue-50 text-blue-700 border-blue-200' :
      'bg-amber-50 text-amber-700 border-amber-200';

    return `
      <div class="bg-white rounded-2xl border border-[#EAE4D9] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group ${isUrgent && item.status === 'available' ? 'ring-2 ring-red-400 ring-offset-2' : ''}">
        <!-- Image & Badges Banner -->
        <div class="relative h-44 overflow-hidden bg-stone-100">
          <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          <!-- Top status & match score -->
          <div class="absolute top-3 left-3 right-3 flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              ${statusBadge}
            </div>
            <!-- Smart Match Score Pill -->
            <div class="bg-[#1F2421]/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 border border-stone-700" title="Smart Matching Score based on distance, shelf-life, storage & capacity">
              <span class="text-amber-400">★</span>
              <span>${match.overall}% Match</span>
            </div>
          </div>

          <!-- Bottom Image Overlay: Donor & Distance -->
          <div class="absolute bottom-3 left-3 right-3 text-white">
            <div class="text-[11px] font-semibold text-stone-200 flex items-center gap-2">
              <span>📍 ${match.distanceKm} km away</span>
              <span>•</span>
              <span>⏱ ~${match.transitMins} min transit</span>
            </div>
            <div class="text-xs font-bold truncate drop-shadow">${item.donorName}</div>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-2 mb-1.5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-stone-400">${item.category}</span>
              <span class="text-[11px] font-bold px-2 py-0.5 rounded border ${storageClass}">
                ${item.storageCondition}
              </span>
            </div>

            <h3 class="font-extrabold text-[#1F2421] text-base leading-snug line-clamp-2">
              ${item.title}
            </h3>

            <!-- Quantity & Weight specs -->
            <div class="mt-3 flex items-center justify-between bg-[#FAF8F5] p-2.5 rounded-xl border border-stone-200">
              <div>
                <div class="text-[10px] text-stone-500 font-semibold uppercase">Quantity</div>
                <div class="font-black text-stone-900 text-sm">${item.quantity} ${item.unit}</div>
              </div>
              <div class="text-right">
                <div class="text-[10px] text-stone-500 font-semibold uppercase">Est. Weight</div>
                <div class="font-bold text-stone-800 text-sm">~${item.weightKg} kg (${Math.round(item.weightKg / 0.42)} meals)</div>
              </div>
            </div>

            <!-- Countdown Timer Banner (Shelf Life) -->
            <div class="mt-3 flex items-center justify-between text-xs">
              <span class="text-stone-500 font-medium">Safe Shelf-Life Clock:</span>
              <span data-expiry-for="${item.id}" class="font-mono text-xs font-bold ${timeObj.critical ? 'text-red-600 bg-red-100 px-2 py-0.5 rounded border border-red-300 animate-pulse' : timeObj.urgent ? 'text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300' : 'text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300'}">
                ${timeObj.text}
              </span>
            </div>

            <!-- Dietary tags -->
            <div class="mt-3 flex flex-wrap gap-1">
              ${(item.dietary || []).map(tag => `
                <span class="text-[10px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                  ${tag}
                </span>
              `).join('')}
              <span class="text-[10px] font-mono text-stone-400 px-1 py-0.5">📦 ${item.packaging}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
            ${item.status === 'available' ? `
              <button class="claim-item-btn flex-1 bg-[#E1372D] hover:bg-red-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs" data-id="${item.id}">
                <span>Claim Surplus</span>
                <span>→</span>
              </button>
            ` : item.status === 'claimed' ? `
              <button class="verify-item-btn flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs" data-id="${item.id}">
                <span>Doorstep Verify PIN (${item.verificationCode})</span>
              </button>
            ` : `
              <div class="flex-1 text-center py-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
                ✓ Rescued & Handed Over
              </div>
            `}

            <button class="view-audit-btn p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors" title="View Audit Status Trail" data-id="${item.id}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // MAP VIEW
  renderMapView(listings) {
    return `
      <div class="bg-white rounded-2xl border border-[#EAE4D9] overflow-hidden shadow-xs">
        <div class="p-3 bg-[#FAF8F5] border-b border-stone-200 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span class="font-bold text-stone-900">Interactive OpenStreetMap Geofence</span>
            <span class="text-stone-500">(${listings.length} surplus locations plotted within ${this.maxRadiusKm} km travel boundary)</span>
          </div>
          <div class="text-[11px] font-mono text-stone-500">
            OpenStreetMap India &bull; CartoDB Positron
          </div>
        </div>
        <div id="leaflet-map-container" class="w-full h-[520px] relative z-0"></div>
      </div>
    `;
  }

  setupLeafletMap(listings) {
    const container = document.getElementById('leaflet-map-container');
    if (!container || typeof window.L === 'undefined') return;

    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    this.map = initMap('leaflet-map-container', CURRENT_RECEIVER.lat, CURRENT_RECEIVER.lng, 13);

    // Receiver marker
    const receiverMarker = window.L.marker([CURRENT_RECEIVER.lat, CURRENT_RECEIVER.lng], {
      icon: createReceiverIcon()
    }).addTo(this.map);

    receiverMarker.bindPopup(`
      <div class="p-1">
        <div class="font-bold text-sm text-stone-900">${CURRENT_RECEIVER.name}</div>
        <div class="text-xs text-stone-600">${CURRENT_RECEIVER.address}</div>
        <div class="mt-1 text-[11px] text-emerald-700 font-semibold">Max Radius: ${this.maxRadiusKm} km</div>
      </div>
    `);

    // Radius geofence circle
    this.radiusCircle = window.L.circle([CURRENT_RECEIVER.lat, CURRENT_RECEIVER.lng], {
      radius: this.maxRadiusKm * 1000,
      color: '#E1372D',
      weight: 1.5,
      dashArray: '6, 6',
      fillColor: '#E5A93C',
      fillOpacity: 0.08
    }).addTo(this.map);

    // Donor Markers
    this.markersGroup = window.L.featureGroup().addTo(this.map);

    listings.forEach((item) => {
      const timeObj = formatTimeRemaining(item.expiresAt);
      const isUrgent = timeObj.urgent;
      const marker = window.L.marker([item.lat, item.lng], {
        icon: createDonorIcon(item.category, isUrgent)
      }).addTo(this.markersGroup);

      const match = calculateSmartMatch(item, CURRENT_RECEIVER);

      marker.bindPopup(`
        <div class="p-2 max-w-xs font-sans">
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="text-[10px] font-bold text-stone-500 uppercase">${item.category}</span>
            <span class="text-[10px] font-bold bg-stone-900 text-white px-2 py-0.5 rounded">${match.overall}% Match</span>
          </div>
          <div class="font-bold text-stone-900 text-sm">${item.title}</div>
          <div class="text-xs text-stone-600 mt-0.5 font-medium">📍 ${item.donorName} (${match.distanceKm} km away)</div>
          <div class="mt-2 bg-stone-100 p-2 rounded text-xs flex justify-between items-center">
            <span>Quantity: <strong>${item.quantity} ${item.unit}</strong></span>
            <span class="font-mono text-red-600 font-bold">${timeObj.text}</span>
          </div>
          <div class="mt-2 pt-2 border-t border-stone-200 space-y-1.5">
            <button onclick="window.__lastbite.showRouteOnMap('${item.id}')" class="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[11px] py-1 rounded border border-stone-300 flex items-center justify-center gap-1">
              <span>🗺 Show Pickup Corridor</span>
            </button>
            ${item.status === 'available' ? `
              <button onclick="window.__lastbite.openClaimModal('${item.id}')" class="w-full bg-[#E1372D] hover:bg-red-700 text-white font-bold text-xs py-1.5 rounded">
                Claim Surplus
              </button>
            ` : `
              <span class="block text-center text-xs text-stone-500 font-bold">${item.status === 'claimed' ? '🚚 In Transit' : '✓ Verified Collected'}</span>
            `}
          </div>
        </div>
      `);
    });
  }

  showRouteOnMap(listingId) {
    const item = this.listings.find(l => l.id === listingId);
    if (!item || !this.map) return;

    if (this.routeLine) {
      try { this.map.removeLayer(this.routeLine); } catch (e) {}
      this.routeLine = null;
    }

    const match = calculateSmartMatch(item, CURRENT_RECEIVER);
    this.routeLine = drawPickupRoute(this.map, CURRENT_RECEIVER.lat, CURRENT_RECEIVER.lng, item.lat, item.lng);
    this.showToast(`Pickup Route to ${item.donorName}: ${match.distanceKm} km (~${match.transitMins} min transit)`, 'info');
  }

  // DONOR VIEW
  renderDonorView(metrics) {
    const donorListings = this.listings; // In prototype, shows all or donor's items

    return `
      <!-- Donor Hero Dashboard Header -->
      <div class="bg-gradient-to-r from-[#1F2421] to-stone-800 text-white p-6 sm:p-8 rounded-3xl mb-8 shadow-md">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="inline-flex items-center gap-2 bg-[#E1372D] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              <span>●</span>
              <span>COMMERCIAL KITCHEN PORTAL</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black tracking-tight">Turn Kitchen Surplus into Verified Community Meals</h2>
            <p class="text-stone-300 text-sm max-w-xl mt-1">
              List prepared buffet surplus, bakery overages, or chilled items with precise safe-consumption windows before your kitchen shift wraps up.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button id="donor-create-listing-btn" class="bg-[#E1372D] hover:bg-red-700 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-lg transition-transform transform hover:-translate-y-0.5 flex items-center gap-2">
              <span class="text-lg">+</span>
              <span>List New Surplus Food</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Active Donor Postings & Status -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left 2 Cols: My Active Postings -->
        <div class="lg:col-span-2 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-black text-[#1F2421] flex items-center gap-2">
              <span>Active Kitchen Dispatches</span>
              <span class="text-xs font-bold bg-stone-200 text-stone-800 px-2.5 py-0.5 rounded-full">${donorListings.length}</span>
            </h3>
            <span class="text-xs text-stone-500 font-medium">Automatic Handover Verification PIN generated per batch</span>
          </div>

          <div class="space-y-3">
            ${donorListings.map(item => `
              <div class="bg-white p-4 rounded-2xl border border-[#EAE4D9] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="flex items-center gap-3.5">
                  <img src="${item.image}" alt="${item.title}" class="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] font-bold uppercase tracking-wider text-stone-400">${item.category}</span>
                      <span class="text-[10px] font-mono font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded">PIN: ${item.verificationCode}</span>
                    </div>
                    <h4 class="font-bold text-stone-900 text-sm leading-tight">${item.title}</h4>
                    <div class="text-xs text-stone-500 mt-1 flex items-center gap-2">
                      <span>${item.quantity} ${item.unit} (~${item.weightKg} kg)</span>
                      <span>&bull;</span>
                      <span class="font-mono text-red-600 font-bold" data-expiry-for="${item.id}">${formatTimeRemaining(item.expiresAt).text}</span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                  ${item.status === 'claimed' ? `
                    <button class="verify-item-btn bg-[#E5A93C] hover:bg-amber-600 text-stone-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs" data-id="${item.id}">
                      <span>Doorstep Verify (${item.claimedBy?.name || 'Receiver'})</span>
                    </button>
                  ` : item.status === 'verified_collected' ? `
                    <span class="text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold text-xs px-3 py-1.5 rounded-xl">
                      ✓ Collected & Verified
                    </span>
                  ` : `
                    <span class="text-stone-600 bg-stone-100 font-semibold text-xs px-3 py-1.5 rounded-xl">
                      Awaiting Receiver Claim
                    </span>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right Col: Quick Preset Wizard & Open Food Facts Specs -->
        <div class="space-y-4">
          <div class="bg-white p-5 rounded-2xl border border-[#EAE4D9] shadow-xs">
            <h3 class="font-black text-stone-900 text-base mb-2">1-Click Fast Presets</h3>
            <p class="text-xs text-stone-500 mb-3">Instant mock surplus loads for real-time kitchen testing:</p>
            <div class="space-y-2">
              <button id="preset-bakery-btn" class="w-full text-left p-3 rounded-xl bg-[#FAF8F5] hover:bg-stone-100 border border-stone-200 text-xs font-semibold flex items-center justify-between">
                <span>🥖 50kg End-of-Day Artisan Bread Rolls</span>
                <span class="text-stone-400">+</span>
              </button>
              <button id="preset-lasagna-btn" class="w-full text-left p-3 rounded-xl bg-[#FAF8F5] hover:bg-stone-100 border border-stone-200 text-xs font-semibold flex items-center justify-between">
                <span>🍲 40 Portions Hot Buffet Curry & Rice</span>
                <span class="text-stone-400">+</span>
              </button>
              <button id="preset-produce-btn" class="w-full text-left p-3 rounded-xl bg-[#FAF8F5] hover:bg-stone-100 border border-stone-200 text-xs font-semibold flex items-center justify-between">
                <span>🥦 30kg Farm Fresh Vegetables Crate</span>
                <span class="text-stone-400">+</span>
              </button>
            </div>
          </div>

          <div class="bg-amber-50 p-5 rounded-2xl border border-amber-200 text-xs text-amber-900">
            <div class="font-bold flex items-center gap-1.5 mb-1 text-sm text-amber-950">
              <span>⚠️</span>
              <span>Open Food Facts Kitchen Preservation</span>
            </div>
            <ul class="space-y-1.5 text-[11px] list-disc list-inside text-amber-800">
              <li><strong>Hot-Hold:</strong> Maintain at ≥60°C. Safe rescue pickup window max 4 hours.</li>
              <li><strong>Cold Chain:</strong> Keep refrigerated at 1°C - 4°C. Transit in insulated containers.</li>
              <li><strong>Ambient Bakery:</strong> Keep ventilated, dry, away from direct sunlight.</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  // AUDITOR & METRICS VIEW
  renderAuditorView(metrics) {
    return `
      <!-- Audit Header -->
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-black text-[#1F2421]">Audited Diversion Metrics & Chain of Custody</h2>
          <p class="text-xs text-stone-500 mt-0.5">Every surplus listing moves through strict auditable states: Listed &rarr; Accepted &rarr; Collected &rarr; Verified</p>
        </div>
        <div class="flex items-center gap-2">
          <button id="download-audit-btn" class="bg-stone-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2">
            <span>📥 Export Audited CSV Ledger</span>
          </button>
        </div>
      </div>

      <!-- KPI Metrics Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-5 rounded-2xl border border-[#EAE4D9] shadow-xs">
          <div class="text-xs font-bold text-stone-400 uppercase tracking-wider">Total Meals Rescued</div>
          <div class="mt-2 text-3xl font-black text-emerald-700">${metrics.mealsSaved}</div>
          <div class="text-[11px] text-stone-500 mt-1">Based on UNEP 420g standard portion</div>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-[#EAE4D9] shadow-xs">
          <div class="text-xs font-bold text-stone-400 uppercase tracking-wider">Surplus Weight Diverted</div>
          <div class="mt-2 text-3xl font-black text-[#1F2421]">${metrics.totalRescuedKg} <span class="text-base font-bold text-stone-500">kg</span></div>
          <div class="text-[11px] text-stone-500 mt-1">${metrics.verifiedKg} kg verified collected</div>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-[#EAE4D9] shadow-xs">
          <div class="text-xs font-bold text-stone-400 uppercase tracking-wider">CO2e Emissions Avoided</div>
          <div class="mt-2 text-3xl font-black text-red-600">${metrics.co2eAvertedKg} <span class="text-base font-bold text-stone-500">kg</span></div>
          <div class="text-[11px] text-stone-500 mt-1">2.5 kg CO2e / kg edible food averted</div>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-[#EAE4D9] shadow-xs">
          <div class="text-xs font-bold text-stone-400 uppercase tracking-wider">Freshwater Conserved</div>
          <div class="mt-2 text-3xl font-black text-blue-600">${metrics.waterSavedLitres.toLocaleString()} <span class="text-base font-bold text-stone-500">L</span></div>
          <div class="text-[11px] text-stone-500 mt-1">1,000 Liters / kg food diverted</div>
        </div>
      </div>

      <!-- Audit Status Trail Table -->
      <div class="bg-white rounded-2xl border border-[#EAE4D9] overflow-hidden shadow-xs">
        <div class="p-4 bg-[#FAF8F5] border-b border-stone-200 flex items-center justify-between">
          <h3 class="font-extrabold text-sm text-stone-900">Chain of Custody Ledger (Full Status History)</h3>
          <span class="text-xs font-bold text-stone-500">${this.listings.length} Registered Batches</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th class="py-3 px-4">Batch ID & Item</th>
                <th class="py-3 px-4">Donor Kitchen</th>
                <th class="py-3 px-4">Weight & Portions</th>
                <th class="py-3 px-4">Storage Cond.</th>
                <th class="py-3 px-4">Current Status</th>
                <th class="py-3 px-4">Receiver Org</th>
                <th class="py-3 px-4">Audit Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 font-medium text-stone-700">
              ${this.listings.map(item => `
                <tr class="hover:bg-[#FAF8F5] transition-colors">
                  <td class="py-3.5 px-4 font-bold text-stone-900">
                    <div class="flex items-center gap-2">
                      <span class="font-mono text-[11px] text-stone-400">${item.id}</span>
                      <span>${item.title}</span>
                    </div>
                  </td>
                  <td class="py-3.5 px-4">${item.donorName}</td>
                  <td class="py-3.5 px-4">${item.weightKg} kg (${Math.round(item.weightKg / 0.42)} meals)</td>
                  <td class="py-3.5 px-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold ${item.storageCondition === 'Hot-Hold' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}">
                      ${item.storageCondition}
                    </span>
                  </td>
                  <td class="py-3.5 px-4">
                    ${item.status === 'verified_collected' ? `
                      <span class="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px]">
                        ✓ Verified Collected
                      </span>
                    ` : item.status === 'claimed' ? `
                      <span class="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-bold text-[10px]">
                        🚚 In Transit
                      </span>
                    ` : `
                      <span class="inline-flex items-center gap-1 text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full font-bold text-[10px]">
                        ● Listed
                      </span>
                    `}
                  </td>
                  <td class="py-3.5 px-4 text-xs font-semibold">
                    ${item.claimedBy ? item.claimedBy.name : '<span class="text-stone-400">Unclaimed</span>'}
                  </td>
                  <td class="py-3.5 px-4">
                    <button class="view-audit-btn text-[#E1372D] hover:underline font-bold text-xs" data-id="${item.id}">
                      View Timeline &rarr;
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // MATCHING ENGINE PLAYGROUND VIEW
  renderEnginePlaygroundView() {
    // Compute simulated match
    const simListing = {
      title: 'Simulation Surplus Item',
      storageCondition: this.simStorage,
      weightKg: this.simWeightKg,
      expiresAt: new Date(Date.now() + this.simShelfLifeMins * 60 * 1000).toISOString(),
      lat: CURRENT_RECEIVER.lat + (this.simDistance / 111), // approximate offset
      lng: CURRENT_RECEIVER.lng
    };

    const simMatch = calculateSmartMatch(simListing, CURRENT_RECEIVER);

    return `
      <div class="max-w-4xl mx-auto">
        <div class="bg-gradient-to-br from-purple-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl mb-8 shadow-lg">
          <div class="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <span>⚡ Algorithm Deep-Dive</span>
            <span>&bull;</span>
            <span>Slide 05 / 07 Architecture</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-black">5-Factor Smart Matching Engine Simulator</h2>
          <p class="text-purple-200 text-sm mt-1 max-w-2xl">
            Tuning the matching weights between surplus listings and receiver organizations before the expiry clock runs out.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Left: Interactive Sliders -->
          <div class="bg-white p-6 rounded-3xl border border-[#EAE4D9] shadow-xs space-y-5">
            <h3 class="font-extrabold text-stone-900 text-base">Adjust Simulation Parameters</h3>

            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-stone-700">1. Travel Distance</span>
                <span class="font-mono text-stone-900 font-bold">${this.simDistance} km (Receiver limit: ${CURRENT_RECEIVER.maxRadiusKm} km)</span>
              </div>
              <input type="range" id="sim-distance-slider" min="0.5" max="10" step="0.1" value="${this.simDistance}" class="w-full accent-purple-600" />
            </div>

            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-stone-700">2. Remaining Shelf Life</span>
                <span class="font-mono text-stone-900 font-bold">${this.simShelfLifeMins} mins (~${Math.round(this.simShelfLifeMins / 60 * 10) / 10} hours)</span>
              </div>
              <input type="range" id="sim-shelf-slider" min="10" max="360" step="5" value="${this.simShelfLifeMins}" class="w-full accent-purple-600" />
            </div>

            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-stone-700">3. Storage Condition</span>
                <span class="font-mono text-stone-900 font-bold">${this.simStorage}</span>
              </div>
              <div class="grid grid-cols-2 gap-2 mt-1">
                ${['Ambient', 'Refrigerated', 'Hot-Hold', 'Frozen'].map(st => `
                  <button class="sim-storage-btn px-3 py-2 rounded-xl text-xs font-bold transition-all ${this.simStorage === st ? 'bg-purple-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}" data-storage="${st}">
                    ${st}
                  </button>
                `).join('')}
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-stone-700">4. Batch Weight vs Capacity</span>
                <span class="font-mono text-stone-900 font-bold">${this.simWeightKg} kg (Vehicle max: ${CURRENT_RECEIVER.capacityKg} kg)</span>
              </div>
              <input type="range" id="sim-weight-slider" min="5" max="150" step="5" value="${this.simWeightKg}" class="w-full accent-purple-600" />
            </div>
          </div>

          <!-- Right: Calculated Score Breakdown -->
          <div class="bg-white p-6 rounded-3xl border border-[#EAE4D9] shadow-xs flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-extrabold text-stone-900 text-base">Match Score Result</h3>
                <div class="text-3xl font-black text-purple-900">
                  ${simMatch.overall}%
                </div>
              </div>

              <!-- Factors Breakdown Bars -->
              <div class="space-y-3 text-xs">
                <div>
                  <div class="flex justify-between text-[11px] font-semibold text-stone-600 mb-1">
                    <span>Distance (Weight 30%)</span>
                    <span>${simMatch.scores.distance}%</span>
                  </div>
                  <div class="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div class="bg-purple-600 h-full rounded-full" style="width: ${simMatch.scores.distance}%"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between text-[11px] font-semibold text-stone-600 mb-1">
                    <span>Remaining Shelf-Life (Weight 25%)</span>
                    <span>${simMatch.scores.shelfLife}%</span>
                  </div>
                  <div class="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div class="bg-amber-500 h-full rounded-full" style="width: ${simMatch.scores.shelfLife}%"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between text-[11px] font-semibold text-stone-600 mb-1">
                    <span>Storage Compatibility (Weight 20%)</span>
                    <span>${simMatch.scores.storage}%</span>
                  </div>
                  <div class="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div class="bg-emerald-500 h-full rounded-full" style="width: ${simMatch.scores.storage}%"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between text-[11px] font-semibold text-stone-600 mb-1">
                    <span>Batch Capacity Fit (Weight 15%)</span>
                    <span>${simMatch.scores.capacity}%</span>
                  </div>
                  <div class="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div class="bg-blue-500 h-full rounded-full" style="width: ${simMatch.scores.capacity}%"></div>
                  </div>
                </div>
              </div>

              <!-- Recommendation & Reasons -->
              <div class="mt-6 p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200">
                <div class="text-xs font-bold text-stone-900 mb-2">Automated Match Verdict:</div>
                <ul class="text-xs space-y-1.5 text-stone-600">
                  ${simMatch.reasons.map(r => `
                    <li class="flex items-start gap-1.5">
                      <span class="text-emerald-600 font-bold">✓</span>
                      <span>${r}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
              * Hard geofence: Drops below 50% if donor is outside receiver's ${CURRENT_RECEIVER.maxRadiusKm} km travel radius.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // MODAL RENDERERS
  renderModal() {
    const container = document.getElementById('modal-container');
    if (!container) return;

    if (!this.activeModal) {
      container.innerHTML = '';
      return;
    }

    if (this.activeModal === 'claim' && this.claimingItem) {
      const item = this.claimingItem;
      const match = calculateSmartMatch(item, CURRENT_RECEIVER);

      container.innerHTML = `
        <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in duration-200">
            <div class="p-5 bg-gradient-to-r from-[#1F2421] to-stone-800 text-white flex items-center justify-between">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400">Claim Surplus Reservation</span>
                <h3 class="text-lg font-black">${item.title}</h3>
              </div>
              <button id="close-modal-btn" class="text-stone-400 hover:text-white text-lg font-bold">✕</button>
            </div>

            <div class="p-6 space-y-4">
              <div class="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 text-xs space-y-2">
                <div class="flex justify-between">
                  <span class="text-stone-500">Donor Location:</span>
                  <span class="font-bold text-stone-900">${item.donorName} (${match.distanceKm} km)</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-stone-500">Pickup Window:</span>
                  <span class="font-bold text-stone-900">${item.pickupWindow.start} - ${item.pickupWindow.end}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-stone-500">Weight & Portions:</span>
                  <span class="font-bold text-stone-900">${item.quantity} ${item.unit} (~${item.weightKg} kg)</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-stone-500">Storage Required:</span>
                  <span class="font-bold text-stone-900">${item.storageCondition}</span>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-stone-700 mb-1">Your Vehicle Estimated Pickup Time (ETA):</label>
                <select id="claim-eta-select" class="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-900">
                  <option value="15">15 Minutes (Nearby Van)</option>
                  <option value="25" selected>25 Minutes (Standard Traffic)</option>
                  <option value="40">40 Minutes (Scheduled Dispatch)</option>
                </select>
              </div>

              <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                <strong>Doorstep Protocol:</strong> Once you claim, a digital Handover PIN will be assigned. Your driver must present this PIN to the kitchen manager upon physical arrival to verify the safe handover.
              </div>

              <div class="flex items-center gap-3 pt-2">
                <button id="cancel-claim-btn" class="flex-1 py-3 rounded-xl border border-stone-300 font-bold text-xs text-stone-700 hover:bg-stone-100">
                  Cancel
                </button>
                <button id="confirm-claim-btn" class="flex-1 py-3 rounded-xl bg-[#E1372D] hover:bg-red-700 font-bold text-xs text-white shadow-md">
                  Confirm & Reserve
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      this.attachModalHandlers();
      return;
    }

    if (this.activeModal === 'claim_success' && this.claimingItem) {
      const item = this.claimingItem;
      container.innerHTML = `
        <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in duration-200">
            <div class="p-6 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center text-xl font-black">
                  ✓
                </div>
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Surplus Reserved</span>
                  <h3 class="text-lg font-black leading-tight">Digital Handover Pass</h3>
                </div>
              </div>
              <button id="close-modal-btn" class="text-stone-300 hover:text-white text-lg font-bold">✕</button>
            </div>

            <div class="p-6 space-y-4 text-center">
              <div class="bg-[#FAF8F5] p-5 rounded-2xl border-2 border-dashed border-stone-300 relative">
                <div class="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Doorstep Verification Code</div>
                <div class="font-mono text-3xl sm:text-4xl font-black text-[#E1372D] tracking-widest my-2 select-all">${item.verificationCode}</div>
                <div class="text-[11px] text-stone-500">Provide this 4-digit code to the donor kitchen upon arrival</div>
              </div>

              <div class="bg-stone-50 p-4 rounded-xl text-left text-xs space-y-2 border border-stone-200">
                <div class="flex justify-between">
                  <span class="text-stone-500">Item:</span>
                  <span class="font-bold text-stone-900">${item.title}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-stone-500">Pickup Location:</span>
                  <span class="font-bold text-stone-900">${item.donorName}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-stone-500">Address:</span>
                  <span class="font-bold text-stone-700">${item.donorAddress}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-stone-500">Quantity & Weight:</span>
                  <span class="font-bold text-stone-900">${item.quantity} ${item.unit} (~${item.weightKg} kg)</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-stone-500">Assigned Transit ETA:</span>
                  <span class="font-bold text-emerald-700">${item.claimedBy?.etaMinutes || 25} Minutes (Driver Dispatched)</span>
                </div>
              </div>

              <div class="flex items-center gap-3 pt-2">
                <button id="close-pass-btn" class="flex-1 py-3 rounded-xl bg-stone-900 hover:bg-black font-bold text-xs text-white shadow-md">
                  Done (Back to Feed)
                </button>
                <button id="simulate-verify-now-btn" class="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 font-bold text-xs text-white shadow-md">
                  Doorstep Verify Handover &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      this.attachModalHandlers();
      return;
    }

    if (this.activeModal === 'verify' && this.verifyingItem) {
      const item = this.verifyingItem;

      container.innerHTML = `
        <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200">
            <div class="p-5 bg-[#1F2421] text-white flex items-center justify-between">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Doorstep Verification</span>
                <h3 class="text-base font-black">Verify Handover Token</h3>
              </div>
              <button id="close-modal-btn" class="text-stone-400 hover:text-white text-lg font-bold">✕</button>
            </div>

            <div class="p-6 space-y-4">
              <div class="text-center">
                <p class="text-xs text-stone-600 mb-1">Enter the 4-digit code shown on receiver's digital pass to verify physical collection for:</p>
                <div class="font-extrabold text-stone-900 text-sm">${item.title}</div>
                <div class="text-[11px] font-mono text-stone-400 mt-1">Expected Code: <strong>${item.verificationCode}</strong></div>
              </div>

              <div class="flex justify-center my-4">
                <input
                  type="text"
                  id="verify-pin-input"
                  maxlength="7"
                  value="${item.verificationCode}"
                  class="font-mono text-center text-2xl font-black tracking-widest bg-[#FAF8F5] border-2 border-stone-300 rounded-2xl w-48 py-3 text-stone-900 focus:outline-none focus:border-[#E1372D]"
                />
              </div>

              <div class="flex items-center gap-3">
                <button id="cancel-verify-btn" class="flex-1 py-3 rounded-xl border border-stone-300 font-bold text-xs text-stone-700 hover:bg-stone-100">
                  Cancel
                </button>
                <button id="confirm-verify-btn" class="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-xs text-white shadow-md">
                  Verify & Rescue
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      this.attachModalHandlers();
      return;
    }

    if (this.activeModal === 'list_surplus') {
      container.innerHTML = `
        <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div class="p-5 bg-[#E1372D] text-white flex items-center justify-between sticky top-0 z-10">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-red-200">New Surplus Listing</span>
                <h3 class="text-lg font-black">Register Kitchen Surplus</h3>
              </div>
              <button id="close-modal-btn" class="text-white/80 hover:text-white text-lg font-bold">✕</button>
            </div>

            <form id="new-listing-form" class="p-6 space-y-4">
              <div>
                <label class="block text-xs font-bold text-stone-700 mb-1">Food Item Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. 50 Portions Hot Vegetable Biryani & Raita"
                  class="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#E1372D]"
                />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-stone-700 mb-1">Category *</label>
                  <select name="category" class="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold">
                    ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-stone-700 mb-1">Storage Condition *</label>
                  <select name="storageCondition" class="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold">
                    <option value="Hot-Hold">Hot-Hold Safe (≥60°C)</option>
                    <option value="Ambient">Ambient Room Temp</option>
                    <option value="Refrigerated">Refrigerated (1-4°C)</option>
                    <option value="Frozen">Deep Frozen</option>
                  </select>
                </div>
              </div>

              <!-- Open Food Facts Dynamic Safety Advisory -->
              <div id="storage-advisory-box" class="p-2.5 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-900 font-medium">
                🔥 <strong>Open Food Facts Protocol:</strong> Hot-Hold food must be kept ≥60°C. Safe rescue pickup window is strictly within 2–4 hours.
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-bold text-stone-700 mb-1">Quantity *</label>
                  <input type="number" name="quantity" value="40" min="1" required class="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-stone-700 mb-1">Unit</label>
                  <select name="unit" class="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold">
                    <option value="portions">portions</option>
                    <option value="kg">kg</option>
                    <option value="boxes">boxes</option>
                    <option value="crates">crates</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-stone-700 mb-1">Est. Weight (kg)</label>
                  <input type="number" name="weightKg" value="18" min="1" required class="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-stone-700 mb-1">Shelf-Life Safe Expiry Window *</label>
                <select name="expiryHours" class="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold">
                  <option value="2">2 Hours (Urgent hot food / end of lunch)</option>
                  <option value="4" selected>4 Hours (Standard end of shift)</option>
                  <option value="8">8 Hours (End of evening)</option>
                  <option value="24">24 Hours (Refrigerated chilled)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-stone-700 mb-1">Packaging State</label>
                <input type="text" name="packaging" value="Sealed commercial foil containers" class="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold" />
              </div>

              <div>
                <label class="block text-xs font-bold text-stone-700 mb-1">Kitchen Preparation Notes</label>
                <textarea name="notes" rows="2" placeholder="Freshly prepared, untouched buffet surplus. Maintained strictly at safe temperature." class="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium"></textarea>
              </div>

              <div class="flex items-center gap-3 pt-2">
                <button type="button" id="cancel-list-btn" class="flex-1 py-3 rounded-xl border border-stone-300 font-bold text-xs text-stone-700 hover:bg-stone-100">
                  Cancel
                </button>
                <button type="submit" class="flex-1 py-3 rounded-xl bg-[#E1372D] hover:bg-red-700 font-bold text-xs text-white shadow-md">
                  Publish to Match Engine
                </button>
              </div>
            </form>
          </div>
        </div>
      `;
      this.attachModalHandlers();
      return;
    }

    if (this.activeModal === 'audit_details' && this.selectedListing) {
      const item = this.selectedListing;
      container.innerHTML = `
        <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div class="p-5 bg-[#1F2421] text-white flex items-center justify-between sticky top-0 z-10">
              <div>
                <span class="text-[10px] font-mono text-amber-400 font-bold">BATCH #${item.id}</span>
                <h3 class="text-base font-black">${item.title}</h3>
              </div>
              <button id="close-modal-btn" class="text-stone-400 hover:text-white text-lg font-bold">✕</button>
            </div>

            <div class="p-6 space-y-5">
              <!-- Timeline status steps -->
              <div>
                <h4 class="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Custody Event Log</h4>
                <div class="relative border-l-2 border-stone-200 ml-3 space-y-4">
                  ${(item.events || []).map((ev) => `
                    <div class="relative pl-6">
                      <div class="absolute -left-1.5 top-1 w-3 h-3 rounded-full ${ev.type === 'VERIFIED_COLLECTED' ? 'bg-emerald-500' : ev.type === 'CLAIMED' ? 'bg-amber-500' : 'bg-red-500'}"></div>
                      <div class="flex items-center justify-between text-[11px]">
                        <span class="font-bold text-stone-900">${ev.type}</span>
                        <span class="font-mono text-stone-400">${new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div class="text-xs text-stone-600 mt-0.5">${ev.details}</div>
                      <div class="text-[10px] font-semibold text-stone-400 mt-0.5">By: ${ev.actor}</div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Impact stats for this item -->
              <div class="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div class="text-stone-400 text-[10px] font-bold uppercase">Meals</div>
                  <div class="font-black text-stone-900 text-base">${Math.round(item.weightKg / 0.42)}</div>
                </div>
                <div>
                  <div class="text-stone-400 text-[10px] font-bold uppercase">CO2e Saved</div>
                  <div class="font-black text-red-600 text-base">${Math.round(item.weightKg * 2.5)} kg</div>
                </div>
                <div>
                  <div class="text-stone-400 text-[10px] font-bold uppercase">Water Saved</div>
                  <div class="font-black text-blue-600 text-base">${(item.weightKg * 1000).toLocaleString()} L</div>
                </div>
              </div>

              <div class="text-right">
                <button id="close-audit-btn" class="bg-stone-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl">
                  Close Log
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      this.attachModalHandlers();
      return;
    }

    if (this.activeModal === 'benchmarks') {
      container.innerHTML = `
        <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div class="p-5 bg-[#1F2421] text-white flex items-center justify-between sticky top-0 z-10">
              <div>
                <span class="text-[10px] font-mono text-amber-400 font-bold">SLIDE 06 & 07 SPECIFICATION</span>
                <h3 class="text-lg font-black">UNEP & Open Food Facts Data Methodology</h3>
              </div>
              <button id="close-modal-btn" class="text-stone-400 hover:text-white text-lg font-bold">✕</button>
            </div>

            <div class="p-6 space-y-4 text-xs text-stone-700 leading-relaxed">
              <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <h4 class="font-bold text-amber-950 text-sm mb-1">1. UNEP Food Waste Index Report Benchmark</h4>
                <p class="text-amber-900 text-xs">
                  Global baseline: 1.05 billion tonnes of food are wasted annually across retail, food service and households.
                  LastBite calculates diverted impact using standard scientific factors:
                </p>
                <div class="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px] text-amber-950">
                  <div class="bg-white p-2 rounded border border-amber-200">&bull; 1 Meal = 0.42 kg (420g)</div>
                  <div class="bg-white p-2 rounded border border-amber-200">&bull; 1 kg Food = 2.5 kg CO2e Averted</div>
                  <div class="bg-white p-2 rounded border border-amber-200">&bull; 1 kg Food = 1,000 Litres Water</div>
                  <div class="bg-white p-2 rounded border border-amber-200">&bull; Standard audit trail: Listed &rarr; Verified</div>
                </div>
              </div>

              <div class="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                <h4 class="font-bold text-blue-950 text-sm mb-1">2. Open Food Facts Preservation & Safety Rules</h4>
                <p class="text-blue-900 text-xs">
                  Storage criteria dictate whether a receiver can safely transport and distribute the food:
                </p>
                <ul class="list-disc list-inside mt-2 space-y-1 text-blue-900">
                  <li><strong>Hot-Hold Safe:</strong> Foods cooked above 75°C and kept ≥60°C. Urgent 2-4h window.</li>
                  <li><strong>Cold Chain:</strong> Dairy, eggs, chilled ready-to-eat foods kept strictly at 1-4°C.</li>
                  <li><strong>Ambient:</strong> Bread, dry grains, whole produce with shelf life up to 24-48h.</li>
                </ul>
              </div>

              <div class="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <h4 class="font-bold text-stone-900 text-sm mb-1">3. OpenStreetMap India Spatial Geofencing</h4>
                <p class="text-stone-600 text-xs">
                  Uses Haversine spherical distance calculation combined with urban transit speed matrices (22 km/h city average) to predict feasible collection before safe-consumption windows expire.
                </p>
              </div>

              <div class="text-right">
                <button id="close-modal-btn-2" class="bg-[#E1372D] text-white font-bold text-xs px-5 py-2.5 rounded-xl">
                  Understood
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      this.attachModalHandlers();
    }
  }

  attachDomHandlers() {
    // Brand home button
    const homeBtn = document.getElementById('brand-home-btn');
    if (homeBtn) {
      homeBtn.onclick = () => {
        this.currentRole = 'receiver';
        this.activeTab = 'feed';
        this.render();
      };
    }

    // Role switcher buttons
    const receiverBtn = document.getElementById('role-receiver-btn');
    const donorBtn = document.getElementById('role-donor-btn');
    const auditorBtn = document.getElementById('role-auditor-btn');
    const engineBtn = document.getElementById('role-engine-btn');

    if (receiverBtn) receiverBtn.onclick = () => { this.currentRole = 'receiver'; this.render(); };
    if (donorBtn) donorBtn.onclick = () => { this.currentRole = 'donor'; this.render(); };
    if (auditorBtn) auditorBtn.onclick = () => { this.currentRole = 'auditor'; this.render(); };
    if (engineBtn) engineBtn.onclick = () => { this.currentRole = 'engine'; this.render(); };

    // Reset data button
    const resetBtn = document.getElementById('reset-data-btn');
    if (resetBtn) resetBtn.onclick = () => this.resetDemoData();

    // Quick list buttons
    const quickListBtn = document.getElementById('quick-list-btn');
    if (quickListBtn) quickListBtn.onclick = () => this.openModal('list_surplus');

    const donorCreateBtn = document.getElementById('donor-create-listing-btn');
    if (donorCreateBtn) donorCreateBtn.onclick = () => this.openModal('list_surplus');

    // Benchmarks specs button
    const benchmarksBtn = document.getElementById('open-benchmarks-btn');
    if (benchmarksBtn) benchmarksBtn.onclick = () => this.openModal('benchmarks');

    // Feed / Map view switchers
    const feedBtn = document.getElementById('view-feed-btn');
    const mapBtn = document.getElementById('view-map-btn');
    if (feedBtn) feedBtn.onclick = () => { this.activeTab = 'feed'; this.render(); };
    if (mapBtn) mapBtn.onclick = () => { this.activeTab = 'map'; this.render(); };

    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value;
        this.render();
      };
    }

    const clearSearchBtn = document.getElementById('clear-search-btn');
    if (clearSearchBtn) {
      clearSearchBtn.onclick = () => {
        this.searchQuery = '';
        this.render();
      };
    }

    // Category filter pills
    document.querySelectorAll('.filter-category-btn').forEach((btn) => {
      btn.onclick = () => {
        this.selectedCategory = btn.getAttribute('data-category');
        this.render();
      };
    });

    // Radius slider
    const radiusSlider = document.getElementById('radius-slider');
    if (radiusSlider) {
      radiusSlider.oninput = (e) => {
        this.maxRadiusKm = Number(e.target.value);
        this.render();
      };
    }

    // Sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.onchange = (e) => {
        this.sortBy = e.target.value;
        this.render();
      };
    }

    // Reset filters btn
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    if (resetFiltersBtn) {
      resetFiltersBtn.onclick = () => {
        this.searchQuery = '';
        this.selectedCategory = 'all';
        this.maxRadiusKm = 10;
        this.render();
      };
    }

    // Claim buttons on cards
    document.querySelectorAll('.claim-item-btn').forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        const item = this.listings.find(l => l.id === id);
        if (item) this.openModal('claim', item);
      };
    });

    // Verify buttons on cards
    document.querySelectorAll('.verify-item-btn').forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        const item = this.listings.find(l => l.id === id);
        if (item) this.openModal('verify', item);
      };
    });

    // View audit timeline buttons
    document.querySelectorAll('.view-audit-btn').forEach((btn) => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        const item = this.listings.find(l => l.id === id);
        if (item) this.openModal('audit_details', item);
      };
    });

    // Preset buttons in donor view
    const pBakery = document.getElementById('preset-bakery-btn');
    if (pBakery) {
      pBakery.onclick = () => {
        this.addListing({
          title: '50kg End-of-Shift Artisan Ciabatta & Sourdough',
          category: 'Bakery & Pastries',
          quantity: 75,
          unit: 'portions',
          weightKg: 50,
          storageCondition: 'Ambient',
          expiryHours: 3,
          packaging: 'Cardboard bakery crates',
          dietary: ['Vegetarian', 'Vegan'],
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
          notes: 'End of bake shift surplus. Packed in breathable paper liners.'
        });
      };
    }

    const pLasagna = document.getElementById('preset-lasagna-btn');
    if (pLasagna) {
      pLasagna.onclick = () => {
        this.addListing({
          title: '40 Portions Hot Banquet Vegetable Lasagna',
          category: 'Prepared Meals',
          quantity: 40,
          unit: 'portions',
          weightKg: 20,
          storageCondition: 'Hot-Hold',
          expiryHours: 2,
          packaging: 'Insulated thermal hotel pans',
          dietary: ['Vegetarian'],
          image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&auto=format&fit=crop&q=80',
          notes: 'Untouched conference lunch buffet surplus. Kept at 68°C.'
        });
      };
    }

    const pProduce = document.getElementById('preset-produce-btn');
    if (pProduce) {
      pProduce.onclick = () => {
        this.addListing({
          title: '30kg Fresh Farm Crate (Broccoli, Tomatoes, Carrots)',
          category: 'Fresh Produce',
          quantity: 30,
          unit: 'kg',
          weightKg: 30,
          storageCondition: 'Refrigerated',
          expiryHours: 24,
          packaging: 'Wooden farm crates',
          dietary: ['Vegetarian', 'Vegan', 'Gluten-Free'],
          image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=80',
          notes: 'Freshly harvested surplus from organic partner farm.'
        });
      };
    }

    // CSV Download button in auditor view
    const downloadCsvBtn = document.getElementById('download-audit-btn');
    if (downloadCsvBtn) {
      downloadCsvBtn.onclick = () => this.exportCsv();
    }

    // Simulator Engine sliders
    const simDist = document.getElementById('sim-distance-slider');
    if (simDist) {
      simDist.oninput = (e) => {
        this.simDistance = Number(e.target.value);
        this.render();
      };
    }

    const simShelf = document.getElementById('sim-shelf-slider');
    if (simShelf) {
      simShelf.oninput = (e) => {
        this.simShelfLifeMins = Number(e.target.value);
        this.render();
      };
    }

    const simWeight = document.getElementById('sim-weight-slider');
    if (simWeight) {
      simWeight.oninput = (e) => {
        this.simWeightKg = Number(e.target.value);
        this.render();
      };
    }

    document.querySelectorAll('.sim-storage-btn').forEach(btn => {
      btn.onclick = () => {
        this.simStorage = btn.getAttribute('data-storage');
        this.render();
      };
    });
  }

  attachModalHandlers() {
    const closeBtn = document.getElementById('close-modal-btn');
    if (closeBtn) closeBtn.onclick = () => this.closeModal();

    const closeBtn2 = document.getElementById('close-modal-btn-2');
    if (closeBtn2) closeBtn2.onclick = () => this.closeModal();

    const closeAuditBtn = document.getElementById('close-audit-btn');
    if (closeAuditBtn) closeAuditBtn.onclick = () => this.closeModal();

    const cancelClaimBtn = document.getElementById('cancel-claim-btn');
    if (cancelClaimBtn) cancelClaimBtn.onclick = () => this.closeModal();

    const cancelVerifyBtn = document.getElementById('cancel-verify-btn');
    if (cancelVerifyBtn) cancelVerifyBtn.onclick = () => this.closeModal();

    const cancelListBtn = document.getElementById('cancel-list-btn');
    if (cancelListBtn) cancelListBtn.onclick = () => this.closeModal();

    const closePassBtn = document.getElementById('close-pass-btn');
    if (closePassBtn) closePassBtn.onclick = () => this.closeModal();

    const simulateVerifyBtn = document.getElementById('simulate-verify-now-btn');
    if (simulateVerifyBtn && this.claimingItem) {
      simulateVerifyBtn.onclick = () => {
        const item = this.claimingItem;
        this.openModal('verify', item);
      };
    }

    // Confirm Claim
    const confirmClaimBtn = document.getElementById('confirm-claim-btn');
    if (confirmClaimBtn && this.claimingItem) {
      confirmClaimBtn.onclick = () => {
        const etaSelect = document.getElementById('claim-eta-select');
        const eta = etaSelect ? Number(etaSelect.value) : 25;
        this.claimListing(this.claimingItem.id, eta);
      };
    }

    // Confirm Verify
    const confirmVerifyBtn = document.getElementById('confirm-verify-btn');
    if (confirmVerifyBtn && this.verifyingItem) {
      confirmVerifyBtn.onclick = () => {
        const pinInput = document.getElementById('verify-pin-input');
        const code = pinInput ? pinInput.value : '';
        this.verifyHandover(this.verifyingItem.id, code);
      };
    }

    // New Listing Form Submit
    const form = document.getElementById('new-listing-form');
    if (form) {
      const storageSelect = form.querySelector('select[name="storageCondition"]');
      const advisoryBox = document.getElementById('storage-advisory-box');
      if (storageSelect && advisoryBox) {
        storageSelect.onchange = (e) => {
          const val = e.target.value;
          if (val === 'Hot-Hold') {
            advisoryBox.className = 'p-2.5 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-900 font-medium';
            advisoryBox.innerHTML = '🔥 <strong>Open Food Facts Protocol:</strong> Hot-Hold food must be kept ≥60°C. Safe rescue pickup window is strictly within 2–4 hours.';
          } else if (val === 'Refrigerated') {
            advisoryBox.className = 'p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 font-medium';
            advisoryBox.innerHTML = '❄️ <strong>Open Food Facts Protocol:</strong> Cold chain must be maintained at 1°C–4°C. Insulated vehicle transfer required.';
          } else if (val === 'Ambient') {
            advisoryBox.className = 'p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium';
            advisoryBox.innerHTML = '🍞 <strong>Open Food Facts Protocol:</strong> Ambient room temp storage (18°C–24°C). Keep ventilated and dry.';
          } else if (val === 'Frozen') {
            advisoryBox.className = 'p-2.5 rounded-xl bg-cyan-50 border border-cyan-200 text-[11px] text-cyan-900 font-medium';
            advisoryBox.innerHTML = '🧊 <strong>Open Food Facts Protocol:</strong> Deep frozen at -18°C or below. Must not be refrozen once thawed.';
          }
        };
      }

      form.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        this.addListing({
          title: formData.get('title'),
          category: formData.get('category'),
          quantity: formData.get('quantity'),
          unit: formData.get('unit'),
          weightKg: formData.get('weightKg'),
          storageCondition: formData.get('storageCondition'),
          expiryHours: formData.get('expiryHours'),
          packaging: formData.get('packaging'),
          notes: formData.get('notes')
        });
      };
    }
  }

  exportCsv() {
    const headers = ['Batch ID', 'Title', 'Category', 'Donor', 'Weight (kg)', 'Estimated Meals', 'Storage', 'Status', 'Verification PIN', 'Expires At'];
    const rows = this.listings.map(item => [
      item.id,
      `"${item.title.replace(/"/g, '""')}"`,
      item.category,
      `"${item.donorName.replace(/"/g, '""')}"`,
      item.weightKg,
      Math.round(item.weightKg / 0.42),
      item.storageCondition,
      item.status,
      item.verificationCode,
      item.expiresAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lastbite_audit_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.showToast('Audited CSV Ledger downloaded successfully!', 'success');
  }

  // Global hooks for map popup click
  openClaimModal(listingId) {
    const item = this.listings.find(l => l.id === listingId);
    if (item) this.openModal('claim', item);
  }
}

// Instantiate and expose globally for Leaflet popup callbacks
window.__lastbite = new LastBiteApp();


})();
