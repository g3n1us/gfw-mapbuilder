import React, {
  FunctionComponent,
  useState,
  useRef,
  MutableRefObject,
  useEffect
} from 'react';
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
  const coordinateConversionRef = useRef(null) as MutableRefObject<null>;
  const {
    activeButton,
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

  useEffect(() => {
    if (activeButton === 'coordinates' && coordinateConversionRef.current) {
      mapController.setActiveMeasureWidget(
        activeButton,
        coordinateConversionRef.current
      );
    }
  }, [activeButton, coordinateConversionRef]);

  const setMeasurementUnit = (
    selectedUnit: AreaMeasurement2D['unit'] | DistanceMeasurement2D['unit']
  ): void => {
    if (activeButton === 'area') {
      setSelectedAreaUnit(selectedUnit);
      mapController.updateSelectedMeasureWidget(
        activeButton,
        selectedUnit as AreaMeasurement2D['unit']
      );
    } else if (activeButton === 'distance') {
      setSelectedDistanceUnit(selectedUnit);
      mapController.updateSelectedMeasureWidget(
        activeButton,
        selectedUnit as AreaMeasurement2D['unit']
      );
    }
  };

  const returnMeasurementResults = (): any => {
    // * NOTE - later one we'll want a message saying;
    // * 'select option to see results'
    // * when everything is toggled OFF
    if (activeButton === 'area') {
      return (
        <>
          <p>Measurement Result</p>
          <hr />
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
          <p>Measurement Result</p>
          <hr />
          <p>
            <strong>Distance Results: </strong>
            {distanceResults?.length}
          </p>
        </>
      );
    } else if (activeButton === 'coordinates') {
      return (
        <div
          className="coordinate-conversion-widget"
          ref={coordinateConversionRef}
        ></div>
      );
    }
  };

  const returnSelectedUnit = (): string => {
    switch (activeButton) {
      case 'area':
        return selectedAreaUnit;
      case 'distance':
        return selectedDistanceUnit;
      default:
        return '';
    }
  };

  const returnDropdown = (): JSX.Element | undefined => {
    let selectedDropdown = [];

    switch (activeButton) {
      case 'area':
        selectedDropdown = areaUnitsOfLength;
        break;
      case 'distance':
        selectedDropdown = distanceUnitsOfLength;
        break;
      default:
        selectedDropdown = defaultOption;
        break;
    }

    if (activeButton === 'area' || activeButton === 'distance') {
      return (
        <>
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
            // disabled={activeButton === '' ? true : false}
          >
            {selectedDropdown.map(
              (lengthUnit: SpecificDropDownOption, index: number) => {
                const { text, esriUnit } = lengthUnit;

                return (
                  <option value={esriUnit} key={index}>
                    {text}
                  </option>
                );
              }
            )}
          </select>
        </>
      );
    }
  };

  const setSelectedWidget = (optionType: OptionType): void => {
    if (optionType === 'area' || optionType === 'distance') {
      mapController.setActiveMeasureWidget(optionType as OptionType);
    }
    // * NOTE - we're maintaining coordinates widget via useEffect
    // * since that involves mounting/unmounting to the dom!
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
          coordinatePointerMoveResults: {},
          activeButton: ''
        })
      );
    } else {
      dispatch(setActiveMeasureButton(optionType));
      setSelectedWidget(optionType);
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
        <button
          onClick={(): void => setOption('coordinates')}
          className={`esri-icon-maps ${
            activeButton === 'coordinates' ? 'selected' : ''
          }`}
        />
        {returnDropdown()}
      </div>
      {returnMeasurementResults()}
    </div>
  );
};

export default MeasureContent;
