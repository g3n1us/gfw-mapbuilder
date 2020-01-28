import Map from 'esri/Map';
import MapView from 'esri/views/MapView';

import Measurement from 'esri/widgets/Measurement';
import DistanceMeasurement2D from 'esri/widgets/DistanceMeasurement2D';
import AreaMeasurement2D from 'esri/widgets/AreaMeasurement2D';

import WebMap from 'esri/WebMap';
import Legend from 'esri/widgets/Legend';
// import Zoom from 'esri/widgets/Zoom'
import { RefObject } from 'react';
import store from '../store/index';

interface ZoomParams {
  zoomIn: boolean;
}

export class MapController {
  _map: Map | undefined;
  _mapview: MapView | undefined;
  _measureByDistance: DistanceMeasurement2D | any; //TODO; test & resolve types!
  _measureByArea: AreaMeasurement2D | any; //TODO; test & resolve types!

  constructor() {
    this._map = undefined;
    this._mapview = undefined;
    this._measureByDistance = undefined; //TODO; test & resolve types!
    this._measureByArea = undefined; //TODO; test & resolve types!
  }

  initializeMap(domRef: RefObject<any>): void {
    const { appSettings } = store.getState();
    this._map = new WebMap({
      portalItem: {
        id: appSettings.webmap
      }
    });

    this._mapview = new MapView({
      map: this._map,
      container: domRef.current
    });

    const legend = new Legend({
      view: this._mapview
    });

    this._mapview.ui.add(legend, 'bottom-right');

    this._mapview
      .when(
        () => {
          console.log('mapview is loaded');
          this.setMeasureWidget();

          store.dispatch({ type: 'MAP_READY', payload: true });
        },
        (error: Error) => {
          console.log('error in initializeMap()', error);
          store.dispatch({ type: 'MAP_ERROR', payload: true });
        }
      )
      .catch((error: Error) => {
        console.log('error in initializeMap()', error);
        store.dispatch({ type: 'MAP_ERROR', payload: true });
      });
  }

  log(): void {
    console.log(this._map?.basemap);
  }

  zoomInOrOut({ zoomIn }: ZoomParams): void {
    if (this._mapview) {
      const zoomNum = zoomIn ? this._mapview.zoom + 1 : this._mapview.zoom - 1;

      this._mapview.goTo({
        target: this._mapview.center,
        zoom: zoomNum
      });
    }
  }

  setMeasureWidget(): void {
    // * NOTE: measures by area
    this._measureByArea = new AreaMeasurement2D({
      view: this._mapview,
      unit: 'acres'
    });

    // * NOTE: measures by distance
    this._measureByDistance = new DistanceMeasurement2D({
      view: this._mapview,
      unit: 'miles'
    });
  }

  setMeasureDistance(setMeasureOption: boolean, unitOfLength: string): void {
    // TODO see if you can combine setMeasureDistance() and setMeasureArea()
    if (setMeasureOption) {
      const newUnit = unitOfLength.length
        ? unitOfLength
        : this._measureByDistance.unit;

      this._measureByDistance.unit = newUnit;
      this._measureByDistance.viewModel.newMeasurement();
    }

    if (setMeasureOption === false && this._measureByDistance) {
      // * NOTE: checking whether this._measureByDistance is defined
      // * resolves a race condition where the measure widget component
      // * loads on the DOM before the mapview widget does
      this._measureByDistance.viewModel.clearMeasurement();
    }
  }

  setMeasureArea(setAreaOption: boolean, unitOfLength: string): void {
    if (setAreaOption) {
      const newUnit = unitOfLength.length
        ? unitOfLength
        : this._measureByArea.unit;

      this._measureByArea.unit = newUnit;
      this._measureByArea.viewModel.newMeasurement();
    }

    if (setAreaOption === false && this._measureByArea) {
      // * NOTE: checking whether this._measureByArea is defined
      // * this resolves a race condition where the measure widget component
      // * loads on the DOM before the mapview widget does
      this._measureByArea.viewModel.clearMeasurement();
    }
  }
}

export const mapController = new MapController();
// window.mapController = mapController;
