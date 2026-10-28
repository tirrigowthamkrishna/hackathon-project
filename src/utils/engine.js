// LastBite Smart Matching & Auditing Engine
// Implements 5-Factor Matching and UNEP Food Waste Index Calculators

/**
 * Calculates Haversine distance between two coordinates in Kilometers
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
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
export function estimateTransitMinutes(distanceKm) {
  // Average urban speed ~ 20 km/h + 5 min pickup buffer
  return Math.max(10, Math.round((distanceKm / 22) * 60) + 5);
}

/**
 * 5-Factor Smart Matching Algorithm
 * Returns Match Object with overall score (0-100) and factor breakdowns
 */
export function calculateSmartMatch(listing, receiver) {
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
export function calculateDiversionMetrics(listings) {
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
export function formatTimeRemaining(expiresAt) {
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
