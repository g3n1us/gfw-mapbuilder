import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';

import { renderModal } from '../../store/appState/actions';

import { ReactComponent as MeasureIcon } from '../../../images/MeasureIcon.svg';

const MeasureWidget: FunctionComponent = () => {
  const dispatch = useDispatch();

  return (
    <>
      <div className="widget-container">
        <button
          className="image-wrapper"
          onClick={() => dispatch(renderModal('MeasureWidget'))}
        >
          <MeasureIcon height={25} width={25} fill={'#555'} />
        </button>
      </div>
    </>
  );
};

export default MeasureWidget;
