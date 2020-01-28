import React, { FunctionComponent, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { renderModal } from '../../store/appState/actions';

import { ReactComponent as MeasureIcon } from '../../../images/MeasureIcon.svg';

const MeasureWidget: FunctionComponent = () => {
  const [renderWidget, setRenderWidget] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    toggleMeasureWidget();
  }, [renderWidget]);

  const toggleMeasureWidget = () => {
    if (renderWidget) {
      dispatch(renderModal('MeasureWidget'));
    } else {
      dispatch(renderModal(''));
    }
  };

  return (
    <>
      <div className="widget-container">
        <button
          className="image-wrapper"
          onClick={() => setRenderWidget(!renderWidget)}
        >
          <MeasureIcon height={25} width={25} fill={'#555'} />
        </button>
      </div>
    </>
  );
};

export default MeasureWidget;
