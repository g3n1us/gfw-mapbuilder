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
  const selectedContent = useSelector(
    (state: any) => state.appState.measurementContent
  );
  const {
    areaUnitsOfLength,
    distanceUnitsOfLength,
    latitudeLongitudeUnits
  } = measureContent[selectedLanguage];
  const {
    measurementResults,
    selectedButton,
    selectedButtonActive
  } = selectedContent;

  const [renderDistanceOption, setDistanceOption] = useState(false);
  const [renderAreaOption, setAreaOption] = useState(false);
  const [renderLatLongOption, setLatLongOption] = useState(false);
  const [dropDownOptions, setDropDownOptions] = useState([]);
  const [selectedDropDownOption, setSelectedDropDownOption] = useState('');

  useEffect(() => {
    setSelectedWidget(selectedButton);
  }, [selectedButton]);

  useEffect(() => {
    setUnitOfLength();
  }, [selectedDropDownOption]);

  useEffect(() => {
    setMeasureByArea();
  }, [renderAreaOption]);

  useEffect(() => {
    setMeasureByDistance();
  }, [renderDistanceOption]);

  useEffect(() => {
    setFindCoordinates();
  }, [renderLatLongOption]);

  const setSelectedWidget = (selectedButton: string) => {
    mapController.setSpecificMeasureWidget({ measureByDistance: true });
    mapController.setSpecificMeasureWidget({ measureByDistance: false });

    if (selectedButtonActive) {
      switch (selectedButton) {
        case 'area':
          mapController.setSpecificMeasureWidget({
            measureByDistance: false,
            setNewMeasure: true,
            unitOfLength: ''
          });
          setDropDownOptions(areaUnitsOfLength);
          break;
        case 'distance':
          mapController.setSpecificMeasureWidget({
            measureByDistance: true,
            setNewMeasure: true,
            unitOfLength: ''
          });
          setDropDownOptions(distanceUnitsOfLength);
          break;
        case 'coordinates':
          setDropDownOptions(latitudeLongitudeUnits);
          break;
        default:
          break;
      }
    } else {
      setDropDownOptions([]);
      setSelectedDropDownOption('');
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

  const setMeasureByArea = () => {
    if (renderAreaOption) {
      dispatch(
        setMeasureWidgetContent({
          measurementResults: {},
          selectedButton: 'area',
          selectedButtonActive: renderAreaOption
        })
      );
    } else {
      dispatch(
        setMeasureWidgetContent({
          measurementResults: {},
          selectedButton: '',
          selectedButtonActive: renderAreaOption
        })
      );
    }
  };

  const setMeasureByDistance = () => {
    if (renderDistanceOption) {
      dispatch(
        setMeasureWidgetContent({
          measurementResults: {},
          selectedButton: 'distance',
          selectedButtonActive: renderDistanceOption
        })
      );
    } else {
      dispatch(
        setMeasureWidgetContent({
          measurementResults: {},
          selectedButton: '',
          selectedButtonActive: renderDistanceOption
        })
      );
    }
  };

  const setFindCoordinates = () => {
    if (renderLatLongOption) {
      dispatch(
        setMeasureWidgetContent({
          measurementResults: {},
          selectedButton: 'coordinates',
          selectedButtonActive: renderLatLongOption
        })
      );
    } else {
      dispatch(
        setMeasureWidgetContent({
          measurementResults: {},
          selectedButton: '',
          selectedButtonActive: renderLatLongOption
        })
      );
    }
  };

  return (
    <div className="measure-options-container">
      <div className="buttons-select-wrapper">
        <button
          onClick={() => setAreaOption(!renderAreaOption)}
          className={`esri-icon-measure-area ${
            selectedButton === 'area' && selectedButtonActive ? 'selected' : ''
          }`}
        />
        <button
          onClick={() => setDistanceOption(!renderDistanceOption)}
          className={`esri-icon-measure ${
            selectedButton === 'distance' && selectedButtonActive
              ? 'selected'
              : ''
          }`}
        />
        <button
          onClick={() => setLatLongOption(!renderLatLongOption)}
          className={`esri-icon-maps ${
            selectedButton === 'coordinates' && selectedButtonActive
              ? 'selected'
              : ''
          }`}
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
