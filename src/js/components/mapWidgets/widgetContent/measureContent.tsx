import React, { FunctionComponent, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AreaMeasurement2D from 'esri/widgets/AreaMeasurement2D';
import DistanceMeasurement2D from 'esri/widgets/DistanceMeasurement2D';

import {
  setMeasureResults,
  setActiveMeasureButton
} from 'js/store/appState/actions';

import { mapController } from 'js/controllers/mapController';

import { measureContent } from 'configs/modal.config';

import { OptionType } from 'js/interfaces/measureWidget';

import { RootState } from 'js/store/index';

import 'css/measureContent.scss';

interface SpecificDropDownOption {
  text: string;
  esriUnit: string;
}

const MeasureContent: FunctionComponent = () => {
  const { activeButton } = useSelector(
    (state: RootState) => state.appState.measureContent
  );
  const {
    areaResults,
    distanceResults,
    coordinateMouseClickResults,
    coordinatePointerMoveResults
  } = useSelector((state: RootState) => state.appState.measureContent);

  const selectedLanguage = useSelector(
    (state: RootState) => state.appState.selectedLanguage
  );

  const {
    defaultOption,
    areaUnitsOfLength,
    distanceUnitsOfLength,
    latitudeLongitudeUnits
  } = measureContent[selectedLanguage];

  const [selectedAreaUnit, setSelectedAreaUnit] = useState(
    areaUnitsOfLength[0].esriUnit
  );
  const [selectedDistanceUnit, setSelectedDistanceUnit] = useState(
    distanceUnitsOfLength[0].esriUnit
  );
  const [selectedCoordinatesUnit, setSelectedCoordinatesUnit] = useState(
    latitudeLongitudeUnits[0].esriUnit
  );
  const dispatch = useDispatch();

  const setMeasurementUnit = (
    selectedUnit: AreaMeasurement2D['unit'] | DistanceMeasurement2D['unit']
  ): void => {
    if (activeButton === 'area') {
      setSelectedAreaUnit(selectedUnit);
      mapController.updateSelectedMeasureWidget(
        'area',
        selectedUnit as AreaMeasurement2D['unit']
      );
    } else if (activeButton === 'distance') {
      setSelectedDistanceUnit(selectedUnit);
      mapController.updateSelectedMeasureWidget(
        'distance',
        selectedUnit as AreaMeasurement2D['unit']
      );
    } else if (activeButton === 'coordinates') {
      setSelectedCoordinatesUnit(selectedUnit);
      // mapController.setActiveMeasureWidget(activeButton);
      // TODO - convert area/perimeters
      // TODO - reset widget
      // TODO - update results in Redux
    }
  };

  const returnMeasurementResults = (): any => {
    // * NOTE - later one we'll want a message saying;
    // * 'select option to see results'
    // * when everything is toggled OFF
    if (activeButton === 'area') {
      return (
        <>
          <p>
            <strong>Area: </strong> {areaResults?.area}
          </p>
          <p>
            <strong>Perimeter: </strong>
            {areaResults?.perimeter}
          </p>
        </>
      );
    } else if (activeButton === 'distance') {
      return (
        <>
          <p>
            <strong>Distance Results: </strong>
            {distanceResults?.length}
          </p>
        </>
      );
    } else if (activeButton === 'coordinates') {
      return (
        <>
          <p>
            <strong>Coordinate results</strong>
          </p>
          <p>
            <strong>Mouse click</strong>
          </p>
          <p>Latitude: {coordinateMouseClickResults?.latitude}</p>
          <p>Longitude: {coordinateMouseClickResults?.longitude}</p>
          <br />
          <p>
            <strong>Pointer move</strong>
          </p>
          <p>Latitude: {coordinatePointerMoveResults?.latitude}</p>
          <p>Longitude: {coordinatePointerMoveResults?.longitude}</p>
        </>
      );
    }
  };

  const returnDropdown = (): Array<[]> | Array<JSX.Element> => {
    let selectedDropdown = [];

    switch (activeButton) {
      case 'area':
        selectedDropdown = areaUnitsOfLength;
        break;
      case 'distance':
        selectedDropdown = distanceUnitsOfLength;
        break;
      case 'coordinates':
        selectedDropdown = latitudeLongitudeUnits;
        break;
      default:
        selectedDropdown = defaultOption;
        break;
    }

    return selectedDropdown.map(
      (lengthUnit: SpecificDropDownOption, index: number) => {
        const { text, esriUnit } = lengthUnit;

        return (
          <option value={esriUnit} key={index}>
            {text}
          </option>
        );
      }
    );
  };

  const setSelectedWidget = (optionType: OptionType): void => {
    if (optionType === 'coordinates') {
      // do something
      // mapController.setActiveMeasureWidget(optionType);
    } else {
      mapController.setActiveMeasureWidget(optionType);
    }
  };

  const setOption = (optionType: OptionType): void => {
    mapController.clearAllWidgets();
    if (activeButton === optionType) {
      dispatch(setActiveMeasureButton(''));
      dispatch(
        setMeasureResults({
          areaResults: {},
          distanceResults: {},
          coordinateMouseClickResults: {},
          coordinatePointerMoveResults: {}
        })
      );
    } else {
      dispatch(setActiveMeasureButton(optionType));
      setSelectedWidget(optionType);
    }
  };

  const returnSelectedUnit = (): string => {
    switch (activeButton) {
      case 'area':
        return selectedAreaUnit;
      case 'distance':
        return selectedDistanceUnit;
      case 'coordinates':
        return selectedCoordinatesUnit;
      default:
        return '';
    }
  };

  return (
    <div className="measure-options-container">
      <div className="buttons-select-wrapper">
        <button
          onClick={(): void => setOption('area')}
          className={`esri-icon-measure-area ${
            activeButton === 'area' ? 'selected' : ''
          }`}
        />
        <button
          onClick={(): void => setOption('distance')}
          className={`esri-icon-measure ${
            activeButton === 'distance' ? 'selected' : ''
          }`}
        />
        {/* <button
          onClick={(): void => setOption('coordinates')}
          className={`esri-icon-maps ${
            activeButton === 'coordinates' ? 'selected' : ''
          }`}
        /> */}
        <span>|</span>
        <select
          value={returnSelectedUnit()}
          onChange={(e): void =>
            setMeasurementUnit(
              e.target.value as
                | AreaMeasurement2D['unit']
                | DistanceMeasurement2D['unit']
            )
          }
          onBlur={(): void => console.log('Bonjour, onBlur!')}
          disabled={activeButton === '' ? true : false}
        >
          {returnDropdown()}
        </select>
      </div>
      <p>Measurement Result</p>
      <hr />
      {returnMeasurementResults()}
    </div>
  );
};

export default MeasureContent;
