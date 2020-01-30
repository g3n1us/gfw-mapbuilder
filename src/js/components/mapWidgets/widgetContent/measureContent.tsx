import React, { FunctionComponent, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setMeasureWidgetContent } from 'js/store/appState/actions';

import { mapController } from '../../../controllers/mapController';

import { measureContent } from 'configs/modal.config';

interface SpecificDropDownOption {
  text: string;
  esriUnit: string;
}

const MeasureContent: FunctionComponent = () => {
  const dispatch = useDispatch();
  const selectedLanguage = useSelector(
    (state: any) => state.appState.selectedLanguage
  );
  const measurementResults = useSelector(
    (state: any) => state.appState.measurementResults
  );

  const {
    areaUnitsOfLength,
    distanceUnitsOfLength,
    latitudeLongitudeUnits
  } = measureContent[selectedLanguage];

  const [renderDistanceOption, setDistanceOption] = useState(false);
  const [renderAreaOption, setAreaOption] = useState(false);
  const [renderLatLongOption, setLatLongOption] = useState(false);
  const [dropDownOptions, setDropDownOptions] = useState([]);
  const [selectedDropDownOption, setSelectedDropDownOption] = useState('');
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0
  });

  useEffect(() => {
    if (renderLatLongOption && measurementResults?.mapClicked) {
      setCoordinates({
        latitude: measurementResults?.latitude,
        longitude: measurementResults?.longitude
      });
    }
  }, [measurementResults?.mapClicked, renderLatLongOption]);

  useEffect(() => {
    toggleMeasureByAreaOption();
    resetDropDownOptions();
  }, [renderAreaOption]);

  useEffect(() => {
    toggleMeasureByDistance();
    resetDropDownOptions();
  }, [renderDistanceOption]);

  useEffect(() => {
    setUnitOfLength();
  }, [selectedDropDownOption]);

  useEffect(() => {
    toggleLatLong();
    resetDropDownOptions();
  }, [renderLatLongOption]);

  const toggleMeasureByAreaOption = () => {
    dispatch(setMeasureWidgetContent({}));
    if (renderAreaOption) {
      setDistanceOption(false);
      setLatLongOption(false);
      setDropDownOptions(areaUnitsOfLength);
      mapController.setSpecificMeasureWidget({
        measureByDistance: false,
        setNewMeasure: true,
        unitOfLength: ''
      });
    } else {
      mapController.setSpecificMeasureWidget({ measureByDistance: false });
    }
  };

  const toggleMeasureByDistance = () => {
    dispatch(setMeasureWidgetContent({}));
    if (renderDistanceOption) {
      setAreaOption(false);
      setLatLongOption(false);
      setDropDownOptions(distanceUnitsOfLength);
      mapController.setSpecificMeasureWidget({
        measureByDistance: true,
        setNewMeasure: true,
        unitOfLength: ''
      });
    } else {
      mapController.setSpecificMeasureWidget({ measureByDistance: true });
    }
  };

  const toggleLatLong = () => {
    dispatch(setMeasureWidgetContent({}));
    if (renderLatLongOption) {
      setAreaOption(false);
      setDistanceOption(false);
      setDropDownOptions(latitudeLongitudeUnits);
      mapController.getCoordinatesLocation(renderLatLongOption);
    }
  };

  const setUnitOfLength = () => {
    if (dropDownOptions === areaUnitsOfLength) {
      mapController.setSpecificMeasureWidget({
        measureByDistance: false,
        setNewMeasure: true,
        unitOfLength: selectedDropDownOption
      });
    }

    if (dropDownOptions === distanceUnitsOfLength) {
      mapController.setSpecificMeasureWidget({
        measureByDistance: true,
        setNewMeasure: true,
        unitOfLength: selectedDropDownOption
      });
    }
  };

  const resetDropDownOptions = () => {
    if (
      renderAreaOption === false &&
      renderDistanceOption === false &&
      renderLatLongOption === false
    ) {
      setDropDownOptions([]);
      setSelectedDropDownOption('');
    }
  };

  const returnDropdownOptions = () => {
    return dropDownOptions.map(
      (lengthUnit: SpecificDropDownOption, index: number) => {
        const { text, esriUnit } = lengthUnit;

        return (
          <>
            <option value={esriUnit} key={index}>
              {text}
            </option>
          </>
        );
      }
    );
  };

  const returnCoordinateResults = () => {
    if (renderLatLongOption) {
      return (
        <>
          <p>Mouse click results:</p>
          <p>latitude: {coordinates.latitude}</p>
          <p>longitude: {coordinates.longitude}</p>
          <br />
          <p>Mouse move results;</p>
          <p>Latitude: {measurementResults?.latitude}</p>
          <p>Latitude: {measurementResults?.longitude}</p>
        </>
      );
    }
  };

  const returnDistanceResults = () => {
    if (renderDistanceOption) {
      console.log('distance', measurementResults);
      return <p> Distance: {measurementResults?.length}</p>;
    }
  };

  const returnAreaResults = () => {
    if (renderAreaOption) {
      console.log('area', measurementResults);
      return (
        <>
          <p> Perimeter: {measurementResults?.perimeter}</p>
          <p>Area: {measurementResults?.area}</p>
        </>
      );
    }
  };

  return (
    <div className="measure-options-container">
      <div className="buttons-select-wrapper">
        <button
          onClick={() => setAreaOption(!renderAreaOption)}
          className={`esri-icon-measure-area ${
            renderAreaOption ? 'selected' : ''
          }`}
        />
        <button
          onClick={() => setDistanceOption(!renderDistanceOption)}
          className={`esri-icon-measure ${
            renderDistanceOption ? 'selected' : ''
          }`}
        />
        <button
          onClick={() => setLatLongOption(!renderLatLongOption)}
          className={`esri-icon-maps ${renderLatLongOption ? 'selected' : ''}`}
        />
        <span>|</span>
        <select
          onChange={e => setSelectedDropDownOption(e.target.value)}
          disabled={dropDownOptions.length ? false : true}
        >
          {dropDownOptions.length === 0 && (
            <option defaultValue="Unit">Unit</option>
          )}
          {returnDropdownOptions()}
        </select>
      </div>
      <p>Measurement Result</p>
      <hr />
      {returnDistanceResults()}
      {returnAreaResults()}
      {returnCoordinateResults()}
    </div>
  );
};

export default MeasureContent;
