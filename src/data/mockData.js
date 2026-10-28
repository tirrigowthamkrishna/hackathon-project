// LastBite Master Mock Dataset & Public Reference Constants
// Aligned with UNEP Food Waste Index, Open Food Facts, and OpenStreetMap

export const PUBLIC_BENCHMARKS = {
  // UNEP Food Waste Index benchmarks
  kgPerMeal: 0.42, // Average edible portion weight (420g)
  co2ePerKgFood: 2.5, // kg CO2e greenhouse gas avoided per kg edible food saved
  waterPerKgFood: 1000, // Litres of freshwater conserved per kg food saved
  economicValuePerKg: 180, // Estimated value in local currency (INR ₹ / units)
  unepGlobalWastedTonnes: 1050000000, // 1.05 billion tonnes per year globally
};

export const STORAGE_PRESETS = [
  { id: 'Ambient', label: 'Ambient (Room Temp)', icon: 'box', tempRange: '18°C - 24°C', safeLimitHours: 8, color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'Refrigerated', label: 'Cold Chain / Chilled', icon: 'thermometer-snowflake', tempRange: '1°C - 4°C', safeLimitHours: 48, color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'Hot-Hold', label: 'Hot-Hold Safe', icon: 'flame', tempRange: '60°C - 75°C', safeLimitHours: 4, color: 'bg-red-100 text-red-800 border-red-300' },
  { id: 'Frozen', label: 'Deep Frozen', icon: 'snowflake', tempRange: '-18°C or below', safeLimitHours: 72, color: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
];

export const CATEGORIES = [
  'Prepared Meals',
  'Bakery & Pastries',
  'Fresh Produce',
  'Dairy & Eggs',
  'Pantry & Grains',
  'Beverages'
];

export const CURRENT_RECEIVER = {
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

export const DONORS = [
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

export const INITIAL_LISTINGS = [
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
