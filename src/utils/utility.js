// @flow
const Utility = {};

/* 
  GENERATORS ###############################################################################
*/

/* TIMESTAMP: Returns a string in the format of "HM:MM:SS :: <TIME>" */
Utility.timestamp = () => {
  const t = new Date();
  const ts = `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()} :: `;
  return ts;
};

/* TRACKNUM: Generates a string for a track number */
Utility.trackNum = string => {
  let number = '';
  const { length } = string;
  for (let i = 0; i < length; i += 1)
    number += string.charCodeAt(i).toString(5);
  number = number.substring(0, 4);
  return number;
};

/* GUID: Generates a global unique identifier string */
Utility.guid = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

/**
 * @desc Pads a number with a leading number (z) - according to value of width
 *
 * @param {integer} valueToPad - integer to pad
 * @param {integer} width - total width of the finished number, so 2 would give 00-type numbers
 * @param {integer} z - number to pad n with, to the width of width
 * @example
 * Utility.padNumber(someVar, 2, 0);
 */
Utility.padNumber = (n, width = 3, z = 0, precision = 0) => {
  if (!Number.isNaN(parseFloat(n))) {
    n = Math.round(n);
  }

  return (String(z).repeat(width) + String(n)).slice(String(n).length);
};

/* 
  CONVERTERS ###############################################################################
*/

/* DEG2RAD: Converts the supplied value in DEGREES to RADIANS */
Utility.deg2rad = deg => (deg * Math.PI) / 180;

/* RAD2DEG: Converts the supplied value in RADIANS to DEGREES */
Utility.rad2deg = rad => (rad * 180) / Math.PI;

/* METERS TO FEET: Converts supplied value in METERS to FEET. Will round to nearest foot unless rounded is supplied as false */
Utility.metersToFeet = (meters, rounded = true) => {
  let feet = meters * 3.28084;
  if (rounded === true) feet = Math.round(feet);
  return feet;
};

Utility.metersToNautical = meters => {
  const nautical = meters * 0.000539957;
  return nautical;
};

// Utility.NauticalToMeters = (nautical) => {
//   const meters = nautical / 0.000539957;
//   return meters;
// };

/* METERS TO FL: Converts supplied value in METERS to FLIGHTLEVEL */
Utility.metersToFL = meters => {
  let fl = Math.round((meters * 3.28084) / 100);
  if (fl < 100) fl = `0${fl}`;
  return fl;
};

/**
 * Converts meters into either feet or flight-level, depending on the provided treshold
 * @param {number} meters altitude to convert, in meters
 * @param {number} treshold transition altitude, in meters
 * @returns {string} Altitude with either ft or FL
 */
Utility.metersToAltitude = (meters, treshold) => {
  const alt = Math.round(meters * 3.28084);
  if (meters > treshold) {
    const fl = Math.round(alt / 100);
    if (fl < 100) return `FL0${fl}`;
    return `FL${fl}`;
  }
  return `${alt} ft`;
};

Utility.knotsToMs = knots => {
  const ms = knots * 0.514444444;
  return ms;
};

Utility.msToKnots = ms => {
  const knots = ms / 0.514444444;
  return knots;
};

/*
  FORMATTERS ###############################################################################
*/

/**
 * @desc Rounds a number to a provided number of decimals
 * @param {float} value - Value to round
 * @param {int} decimals - Number of decimals to round to
 * @returns {string}
 */
Utility.round = (value, decimals) => {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
};

/**
 * @desc Converts Decimal Degrees to Decimal Minutes Seconds
 * @param {float} dd - Decimal Degrees to convert
 * @return {string} dms - returns a string formatted as DMS
 */
Utility.DDtoDMS = dd => {
  // 42.178 => 42°10'41

  const dec = dd.toString().split('.')[0];
  let min = parseFloat(`.${dd.toString().split('.')[1]}`) * 60;
  let sec = Math.round(parseFloat(`.${min.toString().split('.')[1]}`) * 60);

  min = Utility.padNumber(min.toString().split('.')[0], 2);
  sec = Utility.padNumber(sec.toString(), 2);

  const res = `${dec}° ${min}' ${sec}"`;

  if (min === 'aN') return '';
  return res;
};

/**
 * @desc Converts Decimal Degrees to Degress Decimal Minutes
 * @param {float} dd - Decimal Degrees to convert
 * @return {string} dds - returns a string formatted as DDS
 */
Utility.DDtoDDS = dd => {
  // 41.7585 =>  41° 45.510'N ;

  const dec = dd.toString().split('.')[0];
  const ms = ((dd - dec) * 60).toFixed(3);

  let min = ms.toString().split('.')[0];
  let sec = ms.toString().split('.')[1];

  min = Utility.padNumber(min.toString().split('.')[0], 2);
  sec = Utility.padNumber(sec.toString(), 3);

  const res = `${dec}° ${min}.${sec}'`;

  // let res = dec + "°" + ms.toFixed(3);
  return res;
};

/*
  CALCULATE LAT/LON DISTANCES:
	Calculates distance in meter for 1deg of longitude and latitude - based on latitude (WGS84)
	Source: http://msi.nga.mil/MSISiteContent/StaticFiles/Calculators/degree.html
*/
Utility.calcLatLonDistances = LatInDegrees => {
  // Convert latitude to radians
  const lat = Utility.deg2rad(LatInDegrees);

  // Set up "Constants"
  const m1 = 111132.92; // latitude calculation term 1
  const m2 = -559.82; // latitude calculation term 2
  const m3 = 1.175; // latitude calculation term 3
  const m4 = -0.0023; // latitude calculation term 4
  const p1 = 111412.84; // longitude calculation term 1
  const p2 = -93.5; // longitude calculation term 2
  const p3 = 0.118; // longitude calculation term 3

  // Calculate the length of a degree of latitude and longitude in meters
  const latlen =
    m1 +
    m2 * Math.cos(2 * lat) +
    m3 * Math.cos(4 * lat) +
    m4 * Math.cos(6 * lat);
  const longlen =
    p1 * Math.cos(lat) + p2 * Math.cos(3 * lat) + p3 * Math.cos(5 * lat);

  // Distances in meters
  const lenghts = {
    lat: Math.round(latlen),
    lon: Math.round(longlen)
  };

  return lenghts;
};

/**
 * @desc Finds the straight line distance between two points
 * @param {array} f - array of lat,lon in DD
 * @param {array} s - array of lat,lon in DD
 * @returns {float} - Distance between points in meters
 *
 * @example
 *      let distance = findCoordDistance([42.178, 42.496], [41.905, 42.84])
 */
Utility.findCoordDistance = (f, s) => {
  // a = sin²(Δφ/2) + cos(φ1)⋅cos(φ2)⋅sin²(Δλ/2)
  // tanδ = √(a) / √(1−a)
  // see mathforum.org/library/drmath/view/51879.html for derivation

  const R = 6371e3; // meters - circumference of the earth

  const lat1 = Utility.deg2rad(f[0]);
  const lat2 = Utility.deg2rad(s[0]);

  const deltaLat = Utility.deg2rad(s[0] - f[0]);
  const deltaLon = Utility.deg2rad(s[1] - f[1]);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const res = R * c; // Distance in meters!

  return res;
};

/**
 * @desc Finds the straight line bearing between two coordinates
 * @param {array} f - array of lat,lon in DD
 * @param {array} s - array of lat,lon in DD
 * @returns {float} - Initial bearing between points in radians
 *
 * @example
 *      let bearing = findBearing([42.177, 42.481], [42.110, 41.001])
 */
Utility.findBearing = (f, s) => {
  // tanθ = sinΔλ⋅cosφ2 / cosφ1⋅sinφ2 − sinφ1⋅cosφ2⋅cosΔλ
  // see mathforum.org/library/drmath/view/55417.html for derivation

  const lat1 = Utility.deg2rad(f[0]);
  const lat2 = Utility.deg2rad(s[0]);
  const deltaLon = Utility.deg2rad(s[1] - f[1]);
  const y = Math.sin(deltaLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
  const brng = Math.atan2(y, x);

  // console.log("Bearing: %s", (Utility.rad2deg(brng) + 360) % 360);

  return (Utility.rad2deg(brng) + 360) % 360;
};

/**
 * @desc Takes a distance and a speed, and returns the ammount of seconds it takes to cover that distance.
 * @param {number} dist - Distance to travel
 * @param {number} speed - Speed of travel (ground speed)
 * @returns {number} - Time it takes to cover the dist at speed, in seconds
 */
Utility.travelTimeInMS = (dist, speed) => dist / speed;

/* CURVE DISTANCE: Takes a straight-line distance and returns the actual distance when converted into  a distance between two points on a circle. See https://en.wikipedia.org/wiki/Great-circle_distance. */
// Usefull for finding the actual distance between two points points on earth
// Utility.curveDistance = (distance, radius = 10) => {};

/* CALCULATE ETA: Calculates the estimated time of arrival. This distance is not linear. It is an arch because of the earths curvature. See https://en.wikipedia.org/wiki/Great-circle_distance */
// Utility.calculateETA = (distance, speed, straightLine = false) => {};

module.exports = Utility;
