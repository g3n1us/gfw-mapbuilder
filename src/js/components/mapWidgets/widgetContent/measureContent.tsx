import React, { FunctionComponent, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { mapController } from '../../../controllers/mapController';

import { measureContent } from 'configs/modal.config';

interface SpecificDropDownOption {
  text: string;
  esriUnit: string;
}

const MeasureContent: FunctionComponent = () => {
  const selectedLanguage = useSelector(
    (state: any) => state.appState.selectedLanguage
  );
  const selectedContent = useSelector(
    (state: any) => state.appState.measurementContent
  );
  const {
    areaUnitsOfLength,
    distanceUnitsOfLength,
    latitudeLongitudeUnits
  } = measureContent[selectedLanguage];
  // const { measurementResults, activeButton } = selectedContent

  const [renderDistanceOption, setDistanceOption] = useState(false);
  const [renderAreaOption, setAreaOption] = useState(false);
  const [renderLatLongOption, setLatLongOption] = useState(false);
  const [dropDownOptions, setDropDownOptions] = useState([]);
  const [selectedDropDownOption, setSelectedDropDownOption] = useState('');

  console.log('selectedContent', selectedContent);

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
    if (renderLatLongOption) {
      setAreaOption(false);
      setDistanceOption(false);
      setDropDownOptions(latitudeLongitudeUnits);
      // TODO will need to access measureContent property to update this component with content!
      // * NOTE: will not need to conditionally fire mapController.setSpecificMeasureWidget()
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
    </div>
  );
};

export default MeasureContent;
