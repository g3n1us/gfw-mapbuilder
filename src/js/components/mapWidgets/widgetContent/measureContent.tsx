import React, { FunctionComponent, useEffect } from 'react';

import { mapController } from '../../../controllers/mapController';

const MeasureContent: FunctionComponent = () => {
  useEffect(() => {
    // TODO initialize ESRI measure widget
    mapController.setMeasureWidget();
  });

  return (
    <div className="modal-content-container">
      <div className="directions">
        <p>MeasureContent</p>
        <div className="widget-container"></div>
      </div>
    </div>
  );
};

export default MeasureContent;
