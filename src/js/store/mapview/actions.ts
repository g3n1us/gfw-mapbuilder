import {
  MAP_ERROR,
  MAP_READY,
  ALL_AVAILABLE_LAYERS,
  MapviewState
} from './types';

export function isMapReady(payload: MapviewState['isMapReady']) {
  return {
    type: MAP_READY as typeof MAP_READY,
    payload
  };
}

export function mapError(payload: MapviewState['loadError']) {
  return {
    type: MAP_ERROR as typeof MAP_ERROR,
    payload
  };
}

export function allAvailableLayers(
  payload: MapviewState['allAvailableLayers']
) {
  return {
    type: ALL_AVAILABLE_LAYERS as typeof ALL_AVAILABLE_LAYERS,
    payload
  };
}
