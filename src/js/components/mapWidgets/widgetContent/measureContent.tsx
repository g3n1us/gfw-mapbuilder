import React, { FunctionComponent, useState, useEffect } from 'react';

import { mapController } from '../../../controllers/mapController';

const MeasureContent: FunctionComponent = () => {
  const [renderDistanceOption, setDistanceOption] = useState(false);
  const [renderAreaOption, setAreaOption] = useState(false);
  const [renderLatLongOption, setLatLongOption] = useState(false);

  useEffect(() => {
    manageMeasureWidget();
  }, [renderDistanceOption, renderAreaOption, renderLatLongOption]);

  const manageMeasureWidget = () => {
    mapController.setMeasureByDistance(renderDistanceOption);
    mapController.setMeasureByArea(renderAreaOption);
    mapController.setMeasureByLatLong(renderLatLongOption);
  };

  return (
    <div className="measure-options-container">
      <div className="directions">
        <p>MeasureContent</p>
        <div className="measure-widget"></div>
        <button onClick={() => setDistanceOption(!renderDistanceOption)}>
          Measure distance
        </button>
        <button onClick={() => setAreaOption(!renderAreaOption)}>
          Measure area
        </button>
        <button onClick={() => setLatLongOption(!renderLatLongOption)}>
          Lat/long
        </button>
      </div>
    </div>
  );
};

export default MeasureContent;
