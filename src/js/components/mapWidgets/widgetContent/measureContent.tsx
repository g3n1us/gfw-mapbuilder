import React, { FunctionComponent, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { mapController } from '../../../controllers/mapController';

import { measureContent } from 'configs/modal.config';

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

  useEffect(() => {
    toggleMeasureByDistance();
  }, [renderDistanceOption]);

  useEffect(() => {
    toggleMeasureByAreaOption();
  }, [renderAreaOption]);

  const toggleMeasureByDistance = () => {
    if (renderDistanceOption) {
      setDropDownOptions(distanceUnitsOfLength);
      mapController.setMeasureDistance(true);
    } else {
      mapController.setMeasureDistance(false);
    }
  };

  const toggleMeasureByAreaOption = () => {
    if (renderAreaOption) {
      setDropDownOptions(areaUnitsOfLength);
      mapController.setMeasureArea(true);
    } else {
      mapController.setMeasureArea(false);
    }
  };

  // const toggleLatLongOption = () => {
  //   if (renderLatLongOption) {
  //     mapController.setActiveMeasureWidget('latlong')
  //   } else {
  //     mapController.setActiveMeasureWidget()
  //   }
  // }

  /**
   * TODO
   * [ ] DISTANCE OPTION - figure out how to render the ESRI map button icon
   * [ ] AREA OPTION - figure out how to render the ESRI map button icon
   */

  return (
    <div className="measure-options-container">
      <div className="directions">
        <p>MeasureContent</p>
        <div className="measure-widget"></div>
        <button onClick={() => setAreaOption(!renderAreaOption)}>
          Measure area
        </button>
        <button onClick={() => setDistanceOption(!renderDistanceOption)}>
          Measure distance
        </button>
        {/* <button onClick={() => setLatLongOption(!renderLatLongOption)}>
          Lat/long
        </button> */}
        <select
          onChange={e => console.log(e.target.value)}
          disabled={dropDownOptions.length ? false : true}
        >
          {dropDownOptions.length === 0 && <option selected>Unit</option>}
          {dropDownOptions.map((lengthUnit: string, index: number) => (
            <option value={lengthUnit} key={index}>
              {lengthUnit}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MeasureContent;
