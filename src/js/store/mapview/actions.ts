import { MAP_ERROR, MAP_READY } from './types';

export function isMapReady(isMapReady: boolean): object {
  return {
    type: MAP_READY,
    isMapReady
  };
}

export function mapError(loadError: boolean): object {
  return {
    type: MAP_ERROR,
    loadError
  };
}
