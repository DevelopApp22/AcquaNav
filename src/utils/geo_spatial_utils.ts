
import type { Feature, Polygon, Point, LineString } from 'geojson';

import {
  lineString,
  bboxPolygon,
  booleanContains,
  booleanPointInPolygon,
  booleanIntersects
} from '@turf/turf';
import { Waypoint } from '../types/waypoint';


/**
 * Crea un Polygon che rappresenta un bounding box da due coordinate [lon, lat].
 * @param topLeft Waypoint in alto a sinistra
 * @param bottomRight Waypoint in basso a destra
 */
export function createBoundingBoxPolygon(
  topLeft: Waypoint,
  bottomRight:Waypoint
): Feature<Polygon> {

  const bbox: [number, number, number, number] = [topLeft.lon, bottomRight.lat, bottomRight.lon, topLeft.lat];
  const polygon = bboxPolygon(bbox);
  return polygon;

}

/**
 * Crea una LineString da una lista di oggetti Waypoint { lon, lat }.
 */
export function createLineStringFromCoords(
  coords: Waypoint[],
  properties: Record<string, any> = {}
): Feature<LineString> {
  // Converte ogni oggetto { lon, lat } in array [lon, lat]
  const formattedCoords = coords.map(coord => [coord.lon, coord.lat]);
  const line = lineString(formattedCoords, properties);
  return line;
}

/**
 * Verifica se una LineString è interamente contenuta in un bounding box Polygon.
 */
export function isLineInsideBox(
  line: Feature<LineString>,
  box: Feature<Polygon>
): boolean {
  return booleanContains(box, line);
}

/**
 * Verifica se un Point è contenuto in un bounding box Polygon.
 */
export function isPointInsideBox(
  pt: Feature<Point>,
  box: Feature<Polygon>
): boolean {
  return booleanPointInPolygon(pt, box);
}

/**
 * Verifica che una rotta (LineString) NON intersechi un box.
 * Ritorna true solo se è completamente FUORI.
 */
export function isRouteOutsideBox(
  line: Feature<LineString>,
  box: Feature<Polygon>
): boolean {
  return !booleanIntersects(line, box);
}