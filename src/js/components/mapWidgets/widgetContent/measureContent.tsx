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
  const { areaUnitsOfLength, distanceUnitsOfLength } = measureContent[
    selectedLanguage
  ];

  const [renderDistanceOption, setDistanceOption] = useState(false);
  const [renderAreaOption, setAreaOption] = useState(false);
  // const [renderLatLongOption, setLatLongOption] = useState(false);
  const [dropDownOptions, setDropDownOptions] = useState([]);
  const [selectedDropDownOption, setSelectedDropDownOption] = useState('');

  useEffect(() => {
    toggleMeasureByDistance();
  }, [renderDistanceOption]);

  useEffect(() => {
    toggleMeasureByAreaOption();
  }, [renderAreaOption]);

  useEffect(() => {
    setUnitOfLength();
  }, [selectedDropDownOption]);

  const toggleMeasureByDistance = () => {
    if (renderDistanceOption) {
      setDropDownOptions(distanceUnitsOfLength);
      mapController.setSpecificMeasureWidget({
        measureByDistance: true,
        setNewMeasure: true,
        unitOfLength: ''
      });
    } else {
      setDropDownOptions([]);
      setSelectedDropDownOption('');
      mapController.setSpecificMeasureWidget({ measureByDistance: true });
    }
  };

  const toggleMeasureByAreaOption = () => {
    if (renderAreaOption) {
      setDropDownOptions(areaUnitsOfLength);
      mapController.setSpecificMeasureWidget({
        measureByDistance: false,
        setNewMeasure: true,
        unitOfLength: ''
      });
    } else {
      setDropDownOptions([]);
      setSelectedDropDownOption('');
      mapController.setSpecificMeasureWidget({ measureByDistance: false });
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

  // const toggleLatLongOption = () => {
  //   if (renderLatLongOption) {
  //     mapController.setActiveMeasureWidget('latlong')
  //   } else {
  //     mapController.setActiveMeasureWidget()
  //   }
  // }

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
          className="esri-icon-measure-area"
        />
        <button
          onClick={() => setDistanceOption(!renderDistanceOption)}
          className="esri-icon-measure-line"
        />
        {/* <button onClick={() => setLatLongOption(!renderLatLongOption)}>
          Lat/long
        </button> */}
        <span>|</span>
        <select
          onChange={e => setSelectedDropDownOption(e.target.value)}
          disabled={dropDownOptions.length ? false : true}
        >
          {dropDownOptions.length === 0 && <option selected>Unit</option>}
          {returnDropdownOptions()}
        </select>
      </div>
      <p>Measurement Result</p>
      {/* TODO: render lat/long results here! */}
      <hr />
    </div>
  );
};

export default MeasureContent;
