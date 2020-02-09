import Utility from '../../../utils/utility';

import GeographicLib from 'geographiclib';
const Geod = GeographicLib.Geodesic.WGS84;

/**
 * Converts seconds in a day to hours and minutes
 */
export const SecondsToHHSS = seconds => {
  let t = seconds / 3600;
  let h = Utility.padNumber(Math.round(parseInt(t)), 2);
  let s = Utility.padNumber(Math.round((t - h) * 60), 2);

  return `${h}:${s}`;
};

/**
 * Calculates additional data for a waypoint/row
 */
const CalculateRow = (index, store) => {
  const { waypoints, settings } = store;

  let leg_time = 0;
  let distance = 0;
  let bearing = 0;

  // We need the DD values
  let lat = parseFloat(waypoints[index].lat);
  let lon = parseFloat(waypoints[index].lon);

  // Some calculations require more than one WP, i.e. cannot be performed on WP1
  if (index === 0) {
    // If this is the first waypoint, then TOT will be same as walktime
    leg_time = settings.mission_start;
  } else {
    let last_lat = parseFloat(waypoints[index - 1].lat);
    let last_lon = parseFloat(waypoints[index - 1].lon);

    // Calculate distance and bearing
    let r = Geod.Inverse(last_lat, last_lon, lat, lon);
    distance = r.s12 / 1852; // s12 is distance from 1 to 2 and then divide by 1852 to get Nautical Miles

    bearing = r.azi1; // Azimut from point 1 to point 2
    if (bearing < 0) {
      bearing += 360;
    }

    // Calculate time to fly from last wp to current wp
    leg_time += (distance / waypoints[index].gs) * 3600;
  }

  // Return an object with our calculated values
  return { distance, bearing, leg_time };
};

export default CalculateRow;
