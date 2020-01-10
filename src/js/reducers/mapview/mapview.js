import { MAP_READY } from '../../constants/actionTypes';

const initialState = false;

export default (state = initialState, action) => {
  switch (action.type) {
    case MAP_READY:
      return action.isMapReady || initialState;
    default:
      return state;
  }
};