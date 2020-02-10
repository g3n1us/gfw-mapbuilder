import Map from 'esri/Map';
import MapView from 'esri/views/MapView';
import WebMap from 'esri/WebMap';
import Legend from 'esri/widgets/Legend';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import SketchViewModel from 'esri/widgets/Sketch/SketchViewModel';
import PrintTask from 'esri/tasks/PrintTask';
import PrintTemplate from 'esri/tasks/support/PrintTemplate';
import PrintParameters from 'esri/tasks/support/PrintParameters';
import { RefObject } from 'react';
import store from '../store/index';
import { LayerFactory } from 'js/helpers/LayerFactory';

import {
  allAvailableLayers,
  mapError,
  isMapReady
} from 'js/store/mapview/actions';
import { selectActiveTab, toggleTabviewPanel } from 'js/store/appState/actions';
import { LayerProps } from 'js/store/mapview/types';

import { LayerFactoryObject } from 'js/interfaces/mapping';

const allowedLayers = ['feature', 'dynamic', 'loss', 'gain']; //To be: tiled, webtiled, image, dynamic, feature, graphic, and custom (loss, gain, glad, etc)

interface ZoomParams {
  zoomIn: boolean;
}

interface RemoteDataLayer {
  // layer: object;
  layer: {
    opacity: number;
    metadata: object;
    label: object;
    url: string;
    type: string;
    // [key: string]: object
  };
  dataLayer?: {
    uuid: string;
    groupId: string;
    id: string;
    opacity?: number;
  };
  label: object;
  id: string;
  url: string;
  groupId: string;
  type: string;
  order: number;
  group: object;
}

export class MapController {
  _map: Map | undefined;
  _mapview: MapView | undefined;
  _sketchVM: SketchViewModel | undefined;
  _previousSketchGraphic: any;
  _printTask: PrintTask | undefined;
  _legend: Legend | undefined;

  constructor() {
    this._map = undefined;
    this._mapview = undefined;
    this._sketchVM = undefined;
    this._previousSketchGraphic = undefined;
    this._printTask = undefined;
    this._legend = undefined;
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

    this._legend = new Legend({
      view: this._mapview
    });

    this._mapview.ui.add(this._legend, 'bottom-right');
    this._mapview.ui.remove('zoom');

    this._mapview
      .when(
        () => {
          store.dispatch(isMapReady(true));

          const mapLayerObjects: LayerProps[] = [];
          this._map?.layers.forEach((layer: any) => {
            const { id, title, opacity, visible, definitionExpression } = layer;
            mapLayerObjects.push({
              id,
              title,
              opacity,
              visible,
              definitionExpression,
              group: 'webmap'
            });
          });

          store.dispatch(allAvailableLayers(mapLayerObjects));

          this.getMoreLayers().then(res => {
            const { appState } = store.getState();

            const resourceLayerObjects: LayerProps[] = [];
            const resouceLayerSpecs: LayerFactoryObject[] = [];

            res
              .filter((resLayer: RemoteDataLayer) => {
                const resLayerType = resLayer.dataLayer
                  ? resLayer.layer.type
                  : resLayer.type;
                return allowedLayers.includes(resLayerType);
              })
              .forEach((apiLayer: RemoteDataLayer) => {
                if (!apiLayer) return; //apiLayer may be undefined if we failed to retrieve layer data from api for some reason
                let resourceId;
                let resourceTitle;

                //TODO: In the future make this separate pure function, that accepts apiLayer and returns a number (opacity)
                function determineLayerOpacity() {
                  //Try the resources.js predetermined opacity
                  let opacity = apiLayer.dataLayer?.opacity;
                  if (!opacity && opacity !== 0) {
                    //nothing in the resources to do with opacity, try the response's oapcity
                    opacity = apiLayer.layer?.opacity;
                  }
                  return opacity ?? 1; //if all fails, default to 1
                }
                const resourceOpacity = determineLayerOpacity(); //TODO: Make this dynamic

                // let resourceVisible = true; //TODO: Make this dynamic as well!
                let resourceDefinitionExpression;
                let resourceGroup;
                let url;
                let type;

                if (apiLayer.dataLayer) {
                  resourceId = apiLayer.dataLayer.id;
                  resourceTitle =
                    apiLayer.layer.label[appState.selectedLanguage];
                  resourceGroup = apiLayer.dataLayer.groupId;
                  url = apiLayer.layer.url;
                  type = apiLayer.layer.type;
                } else {
                  resourceId = apiLayer.id;
                  resourceTitle = apiLayer.label[appState.selectedLanguage];
                  resourceGroup = apiLayer.groupId;
                  url = apiLayer.url;
                  type = apiLayer.type;
                }

                resouceLayerSpecs.push({
                  id: resourceId,
                  title: resourceTitle,
                  opacity: resourceOpacity,
                  visible: false,
                  definitionExpression: resourceDefinitionExpression,
                  url: url,
                  type: type
                });

                resourceLayerObjects.push({
                  id: resourceId,
                  title: resourceTitle,
                  opacity: resourceOpacity,
                  visible: false,
                  definitionExpression: resourceDefinitionExpression,
                  group: resourceGroup
                });
              });

            store.dispatch(
              allAvailableLayers([...mapLayerObjects, ...resourceLayerObjects])
            );

            const mapLayers = resouceLayerSpecs.map(resouceLayerSpec => {
              return LayerFactory(this._mapview, resouceLayerSpec);
            });

            this._map?.addMany(mapLayers);
          });

          this.initializeAndSetSketch();
        },
        (error: Error) => {
          console.log('error in initializeMap()', error);
          store.dispatch(mapError(true));
        }
      )
      .catch((error: Error) => {
        console.log('error in initializeMap()', error);
        store.dispatch(mapError(true));
      });
  }

  getMoreLayers(): Promise<any> {
    const { appSettings } = store.getState();
    const { layerPanel } = appSettings;
    const detailedLayers: any = [];
    const remoteDataLayers: any = [];

    const layers = Object.keys(layerPanel)
      .filter(groupName => {
        return groupName !== 'GROUP_BASEMAP' && groupName !== 'extraLayers';
      })
      .reduce((list, groupName, groupIndex) => {
        const orderedGroups = layerPanel[groupName].layers.map((layer: any) => {
          return { groupId: groupName, ...layer };
        });
        return list.concat(orderedGroups);
      }, []);

    layers.forEach((layer: RemoteDataLayer) => {
      if (layer.type === 'remoteDataLayer') {
        remoteDataLayers.push({
          order: layer.order,
          layerGroupId: layer.groupId,
          dataLayer: layer
        });
      } else {
        detailedLayers.push(layer);
      }
    });

    const remoteDataLayerRequests = remoteDataLayers.map(
      (item: RemoteDataLayer, j: any) => {
        return fetch(
          `https://production-api.globalforestwatch.org/v1/layer/${item?.dataLayer?.uuid}`
        )
          .then(response => response.json())
          .then(json => json.data)
          .then(layer =>
            fetch(layer.attributes.layerConfig.metadata)
              .then(response => response.json())
              .then(metadata => {
                const attributes = layer.attributes;
                const itemGroup = item.group;

                // Object.keys(remoteDataLayers[j].layer).forEach(layerProp => {

                // if (layerProp !== 'type' && layerProp !== 'uuid') {
                //   if (layerProp === 'legendConfig') {
                //     attributes[layerProp] = remoteDataLayers[j].layer[layerProp];
                //   } else {
                //     layer.attributes.layerConfig[layerProp] = remoteDataLayers[j].layer[layerProp];
                //   }
                // }
                // });
                item.layer = layer.attributes.layerConfig;

                item.group = itemGroup;
                item.layer.metadata = {
                  metadata,
                  legendConfig: attributes.legendConfig
                };
                return item;
              })
          )
          .catch(error => console.error(error));
      }
    );
    detailedLayers.forEach((detailedLayer: object) => {
      remoteDataLayerRequests.push(detailedLayer);
    });
    return Promise.all(remoteDataLayerRequests);
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

  clearAllLayers(): void {
    console.log('clear all layers');
    //1. Iterate over map's layers and turn them off one by one - do we toggle visibility or unload them?
    this._map?.layers.forEach(layer => (layer.visible = false));
    //2. Update redux state with visible layers array being empty

    const { mapviewState } = store.getState();
    const newLayersArray = mapviewState.allAvailableLayers.map(
      (l: LayerProps) => {
        return {
          ...l,
          visible: false
        };
      }
    );
    store.dispatch(allAvailableLayers(newLayersArray));
  }

  selectAllLayers(): void {
    console.log('select all layers');
    const layersToEnable: string[] = [];
    this._map?.layers.forEach(layer => {
      layer.visible = true;
      layersToEnable.push(layer.id);
    });
    const { mapviewState } = store.getState();
    const newLayersArray = mapviewState.allAvailableLayers.map(
      (l: LayerProps) => {
        return {
          ...l,
          visible: true
        };
      }
    );
    store.dispatch(allAvailableLayers(newLayersArray));
  }

  toggleLayerVisibility(layerID: string): void {
    const layer = this._map?.findLayerById(layerID);
    if (layer) {
      //1. update the map
      layer.visible = !layer.visible;
      //2. Update redux
      const { mapviewState } = store.getState();
      const newLayersArray = mapviewState.allAvailableLayers.map(l => {
        if (l.id === layerID) {
          return {
            ...l,
            visible: layer.visible
          };
        } else {
          return l;
        }
      });
      store.dispatch(allAvailableLayers(newLayersArray));
    }
  }

  setLayerOpacity(layerID: string, value: string): void {
    const layer = this._map?.findLayerById(layerID);
    if (layer) {
      layer.opacity = Number(value);
      const { mapviewState } = store.getState();
      const newLayersArray = mapviewState.allAvailableLayers.map(l => {
        if (l.id === layerID) {
          return {
            ...l,
            opacity: layer.opacity
          };
        } else {
          return l;
        }
      });
      store.dispatch(allAvailableLayers(newLayersArray));
    }
  }

  initializeAndSetSketch(): void {
    const tempGL = new GraphicsLayer({
      id: 'sketchGraphics'
    });

    this._sketchVM = new SketchViewModel({
      layer: tempGL,
      view: this._mapview,
      polylineSymbol: {
        type: 'simple-line',
        color: 'red',
        width: 3
      }
    });

    this._sketchVM?.on('create', (event: any) => {
      if (event.state === 'complete') {
        this._previousSketchGraphic = event.graphic;

        event.graphic.symbol.outline.color = [115, 252, 253];
        event.graphic.symbol.color = [0, 0, 0, 0];
        this._mapview?.graphics.add(event.graphic);

        store.dispatch(selectActiveTab('analysis'));
        store.dispatch(toggleTabviewPanel(true));
      }
    });
  }

  createPolygonSketch = (): void => {
    this._mapview?.graphics.remove(this._previousSketchGraphic);
    this._sketchVM?.create('polygon', { mode: 'freehand' });
  };

  generateMapPDF = async (layoutType: string): Promise<any> => {
    const printServiceURL = store.getState().appSettings.printServiceUrl;

    if (!this._printTask) {
      this._printTask = new PrintTask({
        url: printServiceURL
      });
    }

    const template = new PrintTemplate({
      format: 'pdf',
      layout: layoutType as any,
      // * NOTE - must set 'layout' as type of 'any' in order to assign
      // * custom layout types from GFW print service URL
      layoutOptions: {
        scalebarUnit: 'Kilometers',
        customTextElements: [
          { title: 'GFW Mapbuilder' },
          { subtitle: 'Make maps that matter' }
        ]
      }
    });

    const params = new PrintParameters({
      view: this._mapview,
      template
    });

    const mapPDF = await this._printTask
      ?.execute(params)
      .catch(e => console.log('error in generateMapPDF()', e));

    return mapPDF;
  };
  toggleLegend = (): void => {
    if (this._legend && typeof this._legend.container === 'object') {
      if (this._legend.container.classList.contains('hide')) {
        this._legend.container.classList.remove('hide');
      } else {
        this._legend.container.classList.add('hide');
      }
    }
  };
}

export const mapController = new MapController();

//TODO: This is for DEV only and should be removed once we deploy to prod
declare global {
  interface Window {
    mapController: any;
  }
}

window.mapController = mapController;
